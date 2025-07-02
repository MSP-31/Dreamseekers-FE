<template>
    <PageLayout title="강의 문의" backgroundImageUrl="/img/top_header/inquiry.jpg">
        <CalendarSection :schedules="dummySchedules" :is-staff="isUserStaff" />
    </PageLayout>
</template>

<script setup>
import CalendarSection from "@/components/main/CalendarSection.vue";
import {dummySchedules} from "@/data/dummyData.ts"; // 더미 데이터 모듈
import PageLayout from "@/components/layout/PageLayout.vue";
</script>
