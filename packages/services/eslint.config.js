import baseConfig, { allowDbAccess } from "@mc/eslint-config/base";

/** @type {import('typescript-eslint').Config} */
export default [...baseConfig, ...allowDbAccess];
