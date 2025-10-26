<template>
    <div id="app-container" class="h-[100dvh] w-screen overflow-x-hidden overflow-y-scroll">
        <TheHeader />
        <router-view />
        <TheFooter />
        <FloatingButtons />
    </div>
</template>

<script setup>
import TheHeader from "@/components/common/AppHeader.vue";
import TheFooter from "@/components/common/AppFooter.vue";
import FloatingButtons from "@/components/common/FloatingButtons.vue";
</script>

<style scoped>
#app-container {
    scroll-behavior: auto; /* 스크롤 딜레이 제거 */
    scroll-snap-type: y proximity; /* 부드러운 스크롤 스냅 */
    -webkit-overflow-scrolling: touch; /* 모바일 스크롤 최적화 */
}

/* 스크롤바 숨기기 */
#app-container::-webkit-scrollbar {
    display: none;
}
#app-container {
    -ms-overflow-style: none; /* IE 및 Edge */
    scrollbar-width: none; /* Firefox */
}
</style>
