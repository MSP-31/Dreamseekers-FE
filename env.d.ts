/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_BASE_URL: string;
    readonly VITE_BASE_PATH: string;
    // 다른 환경 변수도 여기에 추가
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
