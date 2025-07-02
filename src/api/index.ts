import axios, {AxiosInstance, AxiosRequestConfig} from "axios";
import {useAuthStore} from "@/stores/auth";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const apiClient: AxiosInstance = axios.create({
    // .env 파일에서 API 기본 URL을 가져오거나, Vite 프록시 경로를 사용합니다.
    baseURL: baseURL,
    headers: {
        "Content-Type": "application/json",
    },
});

// 요청 인터셉터 추가: 모든 API 요청이 보내지기 전에 실행됩니다.
apiClient.interceptors.request.use(
    (config: AxiosRequestConfig): AxiosRequestConfig => {
        const authStore = useAuthStore(); // Pinia 스토어 인스턴스 가져오기
        const accessToken = authStore.getAccessToken; // 스토어에서 엑세스 토큰 가져오기

        // 엑세스 토큰이 존재하면 Authorization 헤더에 추가
        if (accessToken) {
            // TypeScript가 config.headers가 있을 것이라고 확신하지 못하므로, 안전하게 접근
            if (!config.headers) {
                config.headers = {};
            }
            config.headers.Authorization = `Bearer ${accessToken}`; // JWT 토큰 형식
        }
        return config;
    },
    // 요청 오류 처리
    (error: any) => {
        return Promise.reject(error);
    }
);

export default apiClient;
