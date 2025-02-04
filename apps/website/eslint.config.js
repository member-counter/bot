import baseConfig, { restrictEnvAccess } from "@mc/eslint-config/base";
import nextjsConfig from "@mc/eslint-config/nextjs";
import reactConfig from "@mc/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [
      ".next/**",
      // ignore submodules
      "**/twemoji/**",
      "**/unicode-emoji-json/**",
    ],
  },
  ...baseConfig,
  ...reactConfig,
  ...nextjsConfig,
  ...restrictEnvAccess,
];
