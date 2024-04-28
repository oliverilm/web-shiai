/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_GOOGLE_CLIENT_ID: string
    readonly ENV: 'dev' | 'prod'
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
