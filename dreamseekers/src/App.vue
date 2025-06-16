<template>
    <div id="app-container">
        <TheHeader :user="currentUser" @logout="handleLogout" />

        <router-view />

        <FloatingButtons />
        <TheFooter :footer-info="footerData" />
    </div>
</template>

<script setup>
import {ref} from "vue";
import TheHeader from "@/components/layout/AppHeader.vue";
// import FloatingButtons from "@/components/layout/FloatingButtons.vue";
import TheFooter from "@/components/layout/AppFooter.vue";

// 더미 데이터: 사용자 정보 (실제로는 로그인 상태에 따라 동적으로 변경)
const currentUser = ref({isAuthenticated: false, username: "", isStaff: false});
const handleLogout = () => (currentUser.value = {isAuthenticated: false, username: "", isStaff: false});

const footerData = ref({
    rep: "홍길동",
    address: "서울특별시 강남구 테헤란로",
    sub_address: "123",
    CRN: "123-45-67890",
    phone: "02-1234-5678",
    email: "info@dreamseekers.com",
    sub_phone: "070-1234-5678",
});
</script>
