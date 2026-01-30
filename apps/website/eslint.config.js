import baseConfig, { restrictEnvAccess } from "@mc/eslint-config/base";
import reactConfig from "@mc/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [
      "dist/**",
      // ignore submodules
      "**/twemoji/**",
      "**/unicode-emoji-json/**",
    ],
  },
  ...baseConfig,
  ...reactConfig,
  ...restrictEnvAccess,
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.app.json", "./tsconfig.node.json"],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
];
