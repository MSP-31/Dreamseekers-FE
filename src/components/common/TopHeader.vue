<template>
    <div class="py-2 text-sm">
        <div class="container mx-auto flex justify-end items-center px-4">
            <template v-if="authStore.isAuthenticated">
                <b v-if="isAdmin" class="mr-2">관리자</b>
                <b v-else class="mr-2">{{ userName }}</b
                >님

                <span class="mx-2 border-l border-gray-400 h-3"></span>
                <router-link to="/user/setting" class="hover:text-[var(--dream-main)]">설정 </router-link>
                <span class="mx-2 border-l border-gray-400 h-3"></span>
                <a href="#" @click.prevent="handleLogout" class="hover:text-[var(--dream-main)]">로그아웃</a>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import {useAuthStore} from "@/stores/auth";
import {useRouter} from "vue-router";
import {computed} from "vue";

const authStore = useAuthStore();
// isAdmin의 변화에 반응하도록 설정
const isAdmin = computed(() => authStore.isAdmin);
const userName = authStore.user?.username;
const router = useRouter();

const handleLogout = () => {
    authStore.logout();
    // 로그아웃 후 로그인 페이지로 리디렉션
    router.push("/");
};
</script>
