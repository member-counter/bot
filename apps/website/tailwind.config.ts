import type { Config } from "tailwindcss";

import baseConfig from "@mc/tailwind-config/web";

export default {
  // We need to append the path to the UI package to the content array so that
  // those classes are included correctly.
  content: [...baseConfig.content, "../../packages/ui/**/*.{ts,tsx}"],
  presets: [baseConfig],
  theme: {
    extend: {
      keyframes: {
        wiggle: {
          "0%, 100%": { transform: "rotate(-5deg)" },
          "50%": { transform: "rotate(5deg)" },
        },
        static: {
          "0%, 100%": {},
        },
        shake: {
          "0%, 100%": { transform: "translateX(-3px)" },
          "50%": { transform: "translateX(3px)" },
        },
      },
      animation: {
        "wiggle-once": "wiggle 0.19s linear 10, static",
        "shake-once": "shake 0.10s ease-in-out 5, static",
      },
    },
  },
} satisfies Config;
