<template>
    <div class="flex h-screen bg-gray-50">
        <!-- 왼쪽 이미지 섹션 (데스크톱에서만 보임) -->
        <div class="hidden lg:block lg:w-1/2">
            <img src="/img/1.jpg" alt="회원가입 배경 이미지" class="object-cover w-full h-full" />
        </div>

        <!-- 오른쪽 회원가입 폼 섹션 -->
        <div class="flex flex-col justify-center items-center w-full lg:w-1/2">
            <div class="w-full max-w-md p-8 space-y-6">
                <div>
                    <h1 class="text-3xl font-bold text-center text-gray-900">회원가입</h1>
                </div>

                <!-- 회원가입 폼 -->
                <form class="mt-8 space-y-6" @submit.prevent="handleSignup">
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
                                v-model="formData.username"
                                name="username"
                                type="text"
                                required
                                class="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border rounded-md appearance-none focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                :class="{'border-red-500': errors.username}"
                                placeholder="아이디"
                            />
                            <p v-if="errors.username" class="mt-1 text-xs text-red-600">{{ errors.username }}</p>
                        </div>

                        <!-- 이메일 입력 필드 -->
                        <div>
                            <label for="email" class="sr-only">이메일</label>
                            <input
                                id="email"
                                v-model="formData.email"
                                name="email"
                                type="email"
                                required
                                class="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border rounded-md appearance-none focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                :class="{'border-red-500': errors.email}"
                                placeholder="이메일 주소"
                            />
                            <p v-if="errors.email" class="mt-1 text-xs text-red-600">{{ errors.email }}</p>
                        </div>

                        <!-- 비밀번호 입력 필드 -->
                        <div>
                            <label for="password" class="sr-only">비밀번호</label>
                            <input
                                id="password"
                                v-model="formData.password"
                                name="password"
                                type="password"
                                required
                                class="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border rounded-md appearance-none focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                :class="{'border-red-500': errors.password}"
                                placeholder="비밀번호"
                            />
                            <p v-if="errors.password" class="mt-1 text-xs text-red-600">{{ errors.password }}</p>
                        </div>

                        <!-- 비밀번호 확인 필드 -->
                        <div>
                            <label for="password-confirm" class="sr-only">비밀번호 확인</label>
                            <input
                                id="password-confirm"
                                v-model="formData.passwordConfirm"
                                name="password-confirm"
                                type="password"
                                required
                                class="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border rounded-md appearance-none focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                :class="{'border-red-500': errors.passwordConfirm}"
                                placeholder="비밀번호 확인"
                            />
                            <p v-if="errors.passwordConfirm" class="mt-1 text-xs text-red-600">{{ errors.passwordConfirm }}</p>
                        </div>
                    </div>

                    <!-- 회원가입 버튼 -->
                    <div>
                        <button
                            type="submit"
                            class="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md group hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            등록
                        </button>
                    </div>
                </form>

                <!-- 구분선 -->
                <div class="flex items-center justify-center my-4">
                    <div class="w-full border-t border-gray-300"></div>
                </div>

                <!-- 로그인 페이지로 돌아가기 -->
                <div>
                    <router-link
                        to="/user/login"
                        class="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md group hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                        로그인 페이지로 돌아가기
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import {reactive, ref} from "vue";
import {useRouter} from "vue-router";
import apiClient from "@/api";

// Vue Router 인스턴스
const router = useRouter();

// 폼 데이터 (reactive 사용)
const formData = reactive({
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
});

// 에러 메시지 상태
const errors = ref({});
const errorMessage = ref(null);

// 회원가입 처리 함수
const handleSignup = async () => {
    // 1. 이전 에러 초기화
    errors.value = {};
    errorMessage.value = null;

    // 2. 클라이언트 측 유효성 검사
    if (formData.password !== formData.passwordConfirm) {
        errors.value.passwordConfirm = "비밀번호가 일치하지 않습니다.";
        return; // 함수 종료
    }
    // (여기에 다른 유효성 검사 추가 가능: ex. 비밀번호 길이, 형식 등)

    try {
        // 3. API 요청
        // 실제로는 여기에 axios나 fetch를 사용하여 백엔드 API로 회원가입 요청을 보냅니다.
        console.log("회원가입 시도:", {
            username: formData.username,
            email: formData.email,
            password: formData.password,
        });

        // --- API 요청 시뮬레이션 ---
        const response = await apiClient.post("/user/signup", {
            username: formData.username,
            email: formData.email,
            password: formData.password,
            re_password: formData.passwordConfirm,
        });

        // 시뮬레이션 성공 로직
        console.log("회원가입 성공!");
        alert("회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.");

        // 4. 성공 시 로그인 페이지로 리디렉션
        router.push("/user/login");
        // --- API 요청 시뮬레이션 종료 ---
    } catch (error) {
        // 5. API 요청 실패 처리
        console.error("회원가입 실패:", error);
        // 백엔드에서 받은 에러 메시지를 상태에 반영
        if (error.response && error.response.data) {
            // 필드별 에러가 오는 경우
            if (typeof error.response.data === "object") {
                errors.value = error.response.data;
            } else {
                // 일반적인 에러 메시지가 오는 경우
                errorMessage.value = error.response.data.message || "회원가입 중 오류가 발생했습니다.";
            }
        } else {
            errorMessage.value = error.message || "알 수 없는 오류가 발생했습니다.";
        }
    }
};
</script>
