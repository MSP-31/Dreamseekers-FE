<template>
    <div id="app-container">
        <TheHeader @logout="handleLogout" />

        <router-view />

        <TheFooter />
        <FloatingButtons />
    </div>
</template>

<script setup>
import TheHeader from "@/components/layout/AppHeader.vue";
import TheFooter from "@/components/layout/AppFooter.vue";
import FloatingButtons from "@/components/layout/FloatingButtons.vue";
</script>
