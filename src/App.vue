<template>
    <div id="app-container">
        <TheHeader :user="currentUser" @logout="handleLogout" />

        <router-view />

        <TheFooter />
        <FloatingButtons />
    </div>
</template>

<script setup>
import {ref} from "vue";
import TheHeader from "@/components/layout/AppHeader.vue";
import TheFooter from "@/components/layout/AppFooter.vue";
import FloatingButtons from "@/components/layout/FloatingButtons.vue";

// 더미 데이터: 사용자 정보 (실제로는 로그인 상태에 따라 동적으로 변경)
const currentUser = ref({isAuthenticated: false, username: "", isStaff: false});
const handleLogout = () => (currentUser.value = {isAuthenticated: false, username: "", isStaff: false});
</script>
