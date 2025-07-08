import axios, {AxiosInstance, AxiosRequestConfig} from "axios";
import {useAuthStore} from "@/stores/auth";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const apiClient: AxiosInstance = axios.create({
    baseURL: baseURL,
    headers: {
        "Content-Type": "application/json",
    },
    // HttpOnly 쿠키를 서버와 주고받기 위한 옵션
    withCredentials: true,
});

// JWTCookieAuthentication 사용 시, 브라우저가 자동으로 쿠키를 헤더에 담아 보냄

// 401 에러 발생 시 토큰 재발급 및 재요청 처리
apiClient.interceptors.response.use(
    // 1. 성공적인 응답은 그대로 반환
    (response) => {
        return response;
    },
    // 2. 에러가 발생했을 때 처리
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && originalRequest.url === "/user/token/refresh") {
            console.error("Refresh token is invalid or expired. Logging out.");
            const authStore = useAuthStore();
            // 스토어의 로그아웃 액션을 호출하여 상태를 초기화하고 로그인 페이지로 이동시킵니다.
            authStore.logout();
            // 더 이상 진행하지 않고 즉시 에러를 반환합니다.
            return Promise.reject(error);
        }

        // 401 에러 (엑세스 토큰 만료) & 재시도한 요청 아닐경우
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // 무한 재시도 방지를 위해 플래그 설정

            try {
                // 토큰 재발급 API 호출
                await apiClient.post("/user/token/refresh");

                // 재발급 성공시, 새로운 access_token을 쿠키로 설정
                return apiClient(originalRequest);
            } catch (refreshError) {
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;
