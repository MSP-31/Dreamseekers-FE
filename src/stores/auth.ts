import apiClient from "@/api";
import {defineStore} from "pinia";

// 사용자 정보 타입 정의
interface User {
    pk: number;
    username: string;
    email: string;
    isAdmin: boolean;
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
            try {
                await apiClient.post("/user/logout");
            } catch (error) {
                // 서버와의 통신이 실패하더라도 로그아웃 처리는 계속 진행합니다.
                console.error("Logout API call failed, but clearing session locally:", error);
            } finally {
                // API 호출 성공 여부와 관계없이 프론트엔드 상태를 초기화합니다.
                this.user = null;
                this.isAuthenticated = false;
            }
        },

        // 사용자 정보 가져오기 : 인증 상태 확인 및 사용자 정보 업데이트
        async fetchUser() {
            try {
                const response = await apiClient.get<User>("/user/account");
                this.user = response.data;
                this.isAuthenticated = true;
            } catch (error: any) {
                this.user = null;
                this.isAuthenticated = false;
                const status = error.response?.status;
                // 401, 400 오류는 로그인하지 않은 사용자의 정상적인 흐름이므로 콘솔에 출력하지 않습니다.
                if (status !== 401 && status !== 400) {
                    console.error("Failed to fetch user:", error);
                }
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
        isAdmin: (state): boolean => state.user?.isAdmin || false,
    },
});
