import { fileURLToPath } from "url";
import { createJiti } from "jiti";
import webpack from "webpack";

// Import env files to validate at build time. Use jiti so we can load .ts files in here.
createJiti(fileURLToPath(import.meta.url)).import("./src/env");

/** @type {import("next").NextConfig} */
const config = {
  output: "standalone",
  /** Enables hot reloading for local packages without a build step */
  transpilePackages: [
    "@mc/db",
    "@mc/ui",
    "@mc/validators",
    "@mc/redis",
    "@mc/common",
    "@mc/services",
    "@t3-oss/env-nextjs",
    "@t3-oss/env-core",
  ],

  webpack: (config, { isServer }) => {
    config.plugins.push(
      new webpack.IgnorePlugin({ resourceRegExp: /^zlib-sync$/ }),
      new webpack.IgnorePlugin({ resourceRegExp: /^bufferutil$/ }),
    );
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
