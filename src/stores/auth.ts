import {defineStore} from "pinia";

// State의 타입을 정의합니다.
interface AuthState {
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    isAdmin: boolean;
}

export const useAuthStore = defineStore("auth", {
    // State 정의: 반드시 화살표 함수로 반환하여 각 스토어 인스턴스가 독립적인 상태를 가지도록 합니다.
    state: (): AuthState => ({
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isAdmin: false,
    }),

    // Actions 정의: 상태를 변경하거나 비동기 작업을 수행합니다.
    actions: {
        // 로그인 성공 후 토큰을 설정하고 로컬 스토리지에 저장합니다.
        setTokens(accessToken: string, refreshToken: string | null = null, isAdmin: boolean) {
            this.accessToken = accessToken;
            this.refreshToken = refreshToken;
            this.isAuthenticated = true;
            this.isAdmin = isAdmin;
            localStorage.setItem("accessToken", accessToken);
            if (refreshToken) {
                localStorage.setItem("refreshToken", refreshToken);
            }
        },

        // 로그아웃 시 토큰을 지우고 로컬 스토리지에서도 제거합니다.
        clearTokens() {
            this.accessToken = null;
            this.refreshToken = null;
            this.isAuthenticated = false;
            this.isAdmin = false;
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
        },

        // 애플리케이션 초기 로드 시 로컬 스토리지에서 토큰을 가져와 인증 상태를 복원합니다.
        initializeAuth() {
            const storedAccessToken = localStorage.getItem("accessToken");
            const storedRefreshToken = localStorage.getItem("refreshToken");
            if (storedAccessToken) {
                this.setTokens(storedAccessToken, storedRefreshToken);
            }
        },
    },

    // Getters 정의: 상태로부터 파생된 데이터를 계산합니다.
    getters: {
        // 엑세스 토큰을 반환합니다.
        getAccessToken: (state): string | null => state.accessToken,
        // 사용자가 인증되었는지 여부를 반환합니다.
        isAuthenticatedUser: (state): boolean => state.isAuthenticated,
    },
});
