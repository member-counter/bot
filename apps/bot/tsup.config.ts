import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/deployCommands.ts"],
  noExternal: [/^@mc\/.*/],
  skipNodeModulesBundle: true,
  splitting: true,
  format: "esm",
  clean: true,
});
