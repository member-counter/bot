import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/telemetry.ts"],
  noExternal: [/^@mc\/.*/],
  skipNodeModulesBundle: true,
  splitting: true,
  format: "esm",
  clean: true,
});
