import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { cloudflare } from "@cloudflare/vite-plugin";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    // `root` below is client/, so the plugin would otherwise look for the
    // Wrangler config there and silently fall back to a stub Worker.
    cloudflare({
      configPath: path.resolve(import.meta.dirname, "wrangler.jsonc"),
      // Without this the plugin persists local D1/KV state under client/.wrangler
      // while the wrangler CLI uses ./.wrangler — so `d1 migrations apply --local`
      // would create the table in a database the dev server never opens.
      persistState: {
        path: path.resolve(import.meta.dirname, ".wrangler/state"),
      },
    }),
  ],
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    // `root` is client/, so without this the output would land in client/dist.
    // The plugin still derives assets.directory from the real client build dir,
    // so relocating the parent directory is safe.
    outDir: path.resolve(import.meta.dirname, "dist"),
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  server: {
    fs: {
      // The Worker imports @shared from outside `root`, so the dev file server
      // has to be allowed to reach the project root.
      allow: [path.resolve(import.meta.dirname)],
    },
  },
});
