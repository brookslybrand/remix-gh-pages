import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { copyFileSync } from "node:fs";
import { join } from "node:path";

export default defineConfig({
  base: "/remix-gh-pages/",
  plugins: [
    remix({
      ssr: false,
      basename: "/remix-gh-pages/",
      buildEnd(args) {
        if (!args.viteConfig.isProduction) return;

        // copy the index.html to 404.html for GH Pages
        let buildPath = args.viteConfig.build.outDir;
        copyFileSync(
          join(buildPath, "index.html"),
          join(buildPath, "404.html"),
        );
      },
    }),
    tsconfigPaths(),
  ],
});
