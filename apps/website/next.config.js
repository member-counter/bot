import { fileURLToPath } from "url";
import createJiti from "jiti";

// Import env files to validate at build time. Use jiti so we can load .ts files in here.
createJiti(fileURLToPath(import.meta.url))("./src/env");

/** @type {import("next").NextConfig} */
const config = {
  /** Enables hot reloading for local packages without a build step */
  transpilePackages: [
    "@mc/db",
    "@mc/ui",
    "@mc/validators",
    "@mc/redis",
    "@mc/common",
    "@mc/bot-data-exchange",
  ],

  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.node$/,
      loader: "node-loader",
    });

    return config;
  },

  /** We already do linting and typechecking as separate tasks in CI */
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

export default config;
