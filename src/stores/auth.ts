import apiClient from "@/api";
import {defineStore} from "pinia";

// 사용자 정보 타입 정의
interface User {
    pk: number;
    username: string;
    email: string;
    is_staff: boolean;
}

// State의 타입 정의
interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
}

export const useAuthStore = defineStore("auth", {
    state: (): AuthState => ({
        user: null,
        isAuthenticated: false,
    }),

    // Actions 정의: 상태를 변경하거나 비동기 작업을 수행합니다.
    actions: {
        // 로그인 : API 호출 후 성공 시 사용자 정보 저장
        async login(credentials: {username: string; password: string}) {
            await apiClient.post("/user/login", credentials);
            await this.fetchUser();
        },

        // 로그아웃 : API 호출 후 상태 초기화
        async logout() {
            await apiClient.post("/user/logout");
            // 프론트엔드 상태 초기화
            this.user = null;
            this.isAuthenticated = false;
        },

        // 사용자 정보 가져오기 : 인증 상태 확인 및 사용자 정보 업데이트
        async fetchUser() {
            try {
                // dj-rest-auth의 기본 사용자 정보 URL
                const response = await apiClient.get<User>("/user/account");
                this.user = response.data;
                this.isAuthenticated = true;
            } catch (error) {
                this.user = null;
                this.isAuthenticated = false;
                console.error("인증되지 않은 사용자입니다.");
                throw error;
            }
        },
    },

    // Getters 정의: 상태로부터 파생된 데이터를 계산합니다.
    getters: {
        // 로그인 여부 반환
        isLoggedIn: (state): boolean => state.isAuthenticated,
        // 현재 사용자 정보 반환
        currentUser: (state): User | null => state.user,
        // 관리자 여부 반환
        isAdmin: (state): boolean => state.user?.is_staff || false,
    },
});
