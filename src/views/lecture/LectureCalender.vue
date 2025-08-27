<template>
    <PageLayout title="강의 일정" backgroundImageUrl="/img/top_header/inquiry.webp">
        <CalendarSection :is-staff="authStore.isAdmin" />
    </PageLayout>
</template>

<script setup lang="ts">
import CalendarSection from "@/components/main/CalendarSection.vue";
import PageLayout from "@/components/common/PageLayout.vue";
import {useAuthStore} from "@/stores/auth";

const authStore = useAuthStore();
</script>
