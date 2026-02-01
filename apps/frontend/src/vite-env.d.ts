/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly SKIP_ENV_VALIDATION?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
