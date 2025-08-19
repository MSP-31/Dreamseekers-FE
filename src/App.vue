<template>
    <div id="app-container">
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
