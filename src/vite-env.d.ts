/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GA_MEASUREMENT_ID?: string;
  readonly VITE_ENABLE_ANALYTICS_IN_DEV?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
