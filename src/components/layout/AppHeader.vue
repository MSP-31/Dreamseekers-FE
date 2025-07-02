<template>
    <header>
        <TopHeader @logout="$emit('logout')" />
        <NavigationBar />
        <!-- MobileSidebar는 NavigationBar 내부 또는 여기서 조건부로 렌더링 가능 -->
    </header>
</template>

<script setup>
import TopHeader from "./TopHeader.vue";
import NavigationBar from "./NavigationBar.vue";

defineEmits(["logout"]);
</script>
