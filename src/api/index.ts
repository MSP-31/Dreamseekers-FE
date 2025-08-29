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
    (error) => {
        return Promise.reject(error);
    }
);

export default apiClient;
