/// <reference types="vite/client" />

// (optional but nice) strongly-type the env vars you use
interface ImportMetaEnv {
    readonly VITE_WC_PROJECT_ID: string
    readonly VITE_API_BASE?: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
