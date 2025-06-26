import axios, {type AxiosInstance} from "axios";
const baseURL = import.meta.env.VITE_API_BASE_URL;

const apiClient: AxiosInstance = axios.create({
    // .env 파일에서 API 기본 URL을 가져오거나, Vite 프록시 경로를 사용합니다.
    baseURL: baseURL,
    headers: {
        "Content-Type": "application/json",
    },
});

export default apiClient;
