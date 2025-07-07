<template>
    <div class="py-2 text-sm">
        <div class="container mx-auto flex justify-end items-center px-4">
            <template v-if="authStore.isAuthenticated">
                <b class="mr-2">관리자</b>님
                <span class="mx-2 border-l border-gray-400 h-3"></span>
                <a href="#" @click.prevent="goToAccount" class="hover:text-[var(--dream-main)]">정보수정</a>
                <span class="mx-2 border-l border-gray-400 h-3"></span>
                <a href="#" @click.prevent="handleLogout" class="hover:text-[var(--dream-main)]">로그아웃</a>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import {useAuthStore} from "@/stores/auth";
import {useRouter} from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

const handleLogout = () => {
    authStore.logout();
    // 로그아웃 후 로그인 페이지로 리디렉션
    router.push("/");
};

// 실제 라우팅 함수로 대체 필요
const goToAccount = () => alert("정보수정 페이지로 이동");
</script>
