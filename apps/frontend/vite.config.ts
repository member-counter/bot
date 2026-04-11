import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";
import { imagetools } from "vite-imagetools";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    imagetools(),
    visualizer({
      filename: "./dist/stats.html",
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  server: {
    open: false,
    host: true,
    allowedHosts: ["frontend-upstream"],
    proxy: {
      "/api": {
        target: "http://localhost:3000",
      },
    },
  },
  ssr: {
    // Bundle all dependencies for SSR to avoid CJS/ESM interop issues
    // (e.g. react-text-transition default export resolving to an object).
    // The SSR bundle is only used at build time for prerendering.
    noExternal: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // React ecosystem
          if (
            id.includes("node_modules/react/") ||
            id.includes("node_modules/react-dom/") ||
            id.includes("node_modules/scheduler/")
          ) {
            return "react-vendor";
          }

          // React Router
          if (
            id.includes("node_modules/react-router") ||
            id.includes("node_modules/react-router-typesafe-routes")
          ) {
            return "react-router";
          }

          // tRPC & React Query
          if (
            id.includes("node_modules/@trpc/") ||
            id.includes("node_modules/@tanstack/react-query")
          ) {
            return "trpc-vendor";
          }

          // i18next
          if (
            id.includes("node_modules/i18next") ||
            id.includes("node_modules/react-i18next")
          ) {
            return "i18n-vendor";
          }

          // Slate editor
          if (id.includes("node_modules/slate")) {
            return "slate-editor";
          }

          // Particles
          if (id.includes("node_modules/@tsparticles/")) {
            return "particles";
          }

          // Discord utils
          if (id.includes("node_modules/@discordjs/rest")) {
            return "discord-utils";
          }

          // UI components and icons
          if (
            id.includes("node_modules/lucide-react") ||
            id.includes("packages/ui")
          ) {
            return "ui-vendor";
          }

          // Other node_modules
          if (id.includes("node_modules/")) {
            return "vendor";
          }
        },
      },
    },
  },
});
