<template>
    <div class="flex h-screen bg-gray-50">
        <!-- 왼쪽 이미지 섹션 (데스크톱에서만 보임) -->
        <div class="hidden lg:block lg:w-1/2">
            <img src="/img/1.jpg" alt="로그인 배경 이미지" class="object-cover w-full h-full" />
        </div>

        <!-- 오른쪽 로그인 폼 섹션 -->
        <div class="flex flex-col justify-center items-center w-full lg:w-1/2">
            <div class="w-full max-w-md p-8 space-y-6">
                <div>
                    <h1 class="text-3xl font-bold text-center text-gray-900">로그인</h1>
                </div>

                <!-- 로그인 폼 -->
                <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
                    <!-- 서버 에러 메시지 표시 -->
                    <div v-if="errorMessage" class="p-3 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
                        {{ errorMessage }}
                    </div>

                    <div class="space-y-4 rounded-md shadow-sm">
                        <!-- 아이디 입력 필드 -->
                        <div>
                            <label for="username" class="sr-only">아이디</label>
                            <input
                                id="username"
                                v-model="username"
                                name="username"
                                type="text"
                                required
                                class="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="아이디"
                            />
                        </div>
                        <!-- 비밀번호 입력 필드 -->
                        <div>
                            <label for="password" class="sr-only">비밀번호</label>
                            <input
                                id="password"
                                v-model="password"
                                name="password"
                                type="password"
                                required
                                class="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="비밀번호"
                            />
                        </div>
                    </div>

                    <!-- 로그인 버튼 -->
                    <div>
                        <button
                            type="submit"
                            class="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md group hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            로그인
                        </button>
                    </div>
                </form>

                <!-- 구분선 -->
                <div class="flex items-center justify-center my-4">
                    <div class="w-full border-t border-gray-300"></div>
                    <span class="px-2 text-sm text-gray-500 bg-gray-50">또는</span>
                    <div class="w-full border-t border-gray-300"></div>
                </div>

                <!-- 회원가입 링크 -->
                <div>
                    <router-link
                        to="/user/signup"
                        class="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-blue-700 bg-white border border-blue-500 rounded-md group hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        회원가입
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useAuthStore} from "@/stores/auth"; // Pinia 스토어

// Vue Router 인스턴스 가져오기
const router = useRouter();
const route = useRoute();
// Pinia 스토어 인스턴스 가져오기
const authStore = useAuthStore();

// 폼 입력 값을 위한 반응형 상태 (TypeScript 타입 지정)
const username = ref<string>("");
const password = ref<string>("");
const errorMessage = ref<string | null>(null);

// 로그인 처리 함수
const handleLogin = async () => {
    errorMessage.value = null; // 이전 에러 메시지 초기화

    try {
        await authStore.login({
            username: username.value,
            password: password.value,
        });

        // 로그인 성공! 스토어에서 상태가 업데이트되었으므로, 페이지를 이동합니다.
        const redirectPath = (route.query.next as string) || "/";
        router.push(redirectPath);
    } catch (error: any) {
        console.error("로그인 실패:", error);
        // 스토어에서 발생한 에러를 잡아서 UI에 표시합니다.
        // dj-rest-auth는 보통 non_field_errors에 에러 메시지를 담아 보냅니다.
        errorMessage.value =
            error.response?.data?.non_field_errors?.[0] || // dj-rest-auth의 일반적인 에러 형식
            error.response?.data?.detail ||
            "아이디 또는 비밀번호가 올바르지 않습니다.";
    }
};

onMounted(() => {
    // 컴포넌트가 마운트될 때 이미 로그인 상태인지 확인
    if (authStore.isAuthenticated) {
        // 이미 로그인되어 있다면 메인 페이지로 리디렉션
        router.push("/");
    }
});
</script>
