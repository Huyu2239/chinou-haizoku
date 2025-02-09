/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APPLICATION_ID: string
  readonly VITE_TENANT_INFO: string
  readonly VITE_BACKEND_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
