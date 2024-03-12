import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  base: "/remix-gh-pages/",
  plugins: [
    remix({
      ssr: false,
      basename: "/remix-gh-pages/",
    }),
    tsconfigPaths(),
  ],
});
