// src/services/api.js 또는 Vue 컴포넌트 내
import axios, {AxiosInstance} from "axios";

const apiClient = axios.create({
    baseURL: "http://localhost:8000/api",
    headers: {
        "Content-Type": "application/json",
    },
});

export default apiClient;
