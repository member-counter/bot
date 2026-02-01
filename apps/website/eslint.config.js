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
  {
    files: ["**/*.ts", "**/*.tsx"],
    ignores: ["src/lib/navigation/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "process",
              importNames: ["env"],
              message:
                "Use `import { env } from '~/env'` instead to ensure validated types.",
            },
            {
              name: "react-router",
              importNames: ["useNavigate", "Link", "NavLink"],
              message:
                "Use `~/lib/navigation` instead to support dirty form blocking.",
            },
            {
              name: "@mc/ui/Link",
              message:
                "This module has been moved. Use `~/app/components/Link` instead.",
            },
            {
              name: "@mc/ui/LinkUnderlined",
              message:
                "This module has been moved. Use `~/app/components/LinkUnderlined` instead.",
            },
          ],
        },
      ],
    },
  },
];
