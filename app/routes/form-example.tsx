import {
  ClientActionFunctionArgs,
  useFetcher,
  useLoaderData,
} from "@remix-run/react";
import { useEffect, useRef } from "react";
import { flushSync } from "react-dom";

export async function clientLoader() {
  const name = localStorage.getItem("name");
  return { name };
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function clientAction({ request }: ClientActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "delete") {
    localStorage.removeItem("name");
    return {};
  }

  const name = formData.get("name");

  if (!name || typeof name !== "string") {
    return { error: "Name is required" };
  }
  await sleep(1000);
  localStorage.setItem("name", name);
  return { ok: true };
}

export default function FormExample() {
  const fetcher = useFetcher<typeof clientAction>();
  let { name } = useLoaderData<typeof clientLoader>();
  const inputRef = useRef<HTMLInputElement>(null);

  const isSubmitting = fetcher.state !== "idle";

  const pendingName = fetcher.formData?.get("name");
  if (pendingName && typeof pendingName === "string") {
    name = pendingName;
  }

  const error = fetcher.data?.error;

  // Ryan will probably get mad at me for not using flushSync, but that shit is confusing me
  useEffect(() => {
    // If there was an error, focus the input
    if (error) {
      inputRef.current?.focus();
    }
  }, [error]);

  useEffect(() => {
    const node = inputRef.current;
    if (node && fetcher.state === "idle" && fetcher.data?.ok) {
      node.value = "";
    }
  }, [fetcher.data?.ok, fetcher.state]);

  return (
    <div>
      <h1 style={{ opacity: isSubmitting ? 0.5 : 1 }}>
        {name ? `Hi ${name}!` : "Form example"}
      </h1>
      <fetcher.Form method="post" noValidate>
        <label>
          Name:
          <input ref={inputRef} type="text" name="name" required />
        </label>
        <button type="submit">Submit</button>
      </fetcher.Form>
      {error && !isSubmitting ? <p>{error}</p> : null}
      <br />
      {name ? (
        <fetcher.Form
          onSubmit={() => {
            flushSync(() => inputRef.current?.focus());
          }}
          method="post"
        >
          <input type="hidden" name="intent" value="delete" />
          <button type="submit">Delete name</button>
        </fetcher.Form>
      ) : null}
    </div>
  );
}
