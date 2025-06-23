import axios, {type AxiosInstance} from "axios";

// apiClient를 생성합니다.
// baseURL은 실제 백엔드 서버 주소로 설정해야 합니다.
// 개발 환경에서는 Vite 프록시를 통해 CORS 문제를 우회할 수 있습니다.
const apiClient: AxiosInstance = axios.create({
    // .env 파일에서 API 기본 URL을 가져오거나, Vite 프록시 경로를 사용합니다.
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export default apiClient;
