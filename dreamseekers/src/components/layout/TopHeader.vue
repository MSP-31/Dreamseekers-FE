<template>
    <div class="bg-gray-100 py-2 text-sm">
        <div class="container mx-auto flex justify-end items-center px-4">
            <template v-if="user.isAuthenticated">
                <b class="mr-2">{{ user.username }}</b
                >님
                <span class="mx-2 border-l border-gray-400 h-3"></span>
                <a href="#" @click.prevent="goToAccount" class="hover:text-dream-main">정보수정</a>
                <span class="mx-2 border-l border-gray-400 h-3"></span>
                <a href="#" @click.prevent="$emit('logout')" class="hover:text-dream-main">로그아웃</a>
            </template>
            <template v-else>
                <a href="#" @click.prevent="goToLogin" class="hover:text-dream-main">로그인</a>
                <span class="mx-2 border-l border-gray-400 h-3"></span>
                <a href="#" @click.prevent="goToSignup" class="hover:text-dream-main">회원가입</a>
            </template>
        </div>
    </div>
</template>

<script setup>
defineProps({
    user: {
        type: Object,
        required: true,
    },
});
defineEmits(["logout"]);

// 실제 라우팅 함수로 대체 필요
const goToAccount = () => alert("정보수정 페이지로 이동");
const goToLogin = () => alert("로그인 페이지로 이동");
const goToSignup = () => alert("회원가입 페이지로 이동");
</script>
