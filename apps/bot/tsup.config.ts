import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  noExternal: [/^@mc\/.*/],
  skipNodeModulesBundle: true,
  splitting: true,
  format: "esm",
  clean: true,
});
