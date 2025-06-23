<template>
    <div>
        <PageHeader title="주요 강의" backgroundImageUrl="/Dreamseekers-FE/img/top_header/lecture.jpg" />
        <div class="relative text-center text-black flex-1 my-0 mx-[20%]">
            <CalendarSection :schedules="dummySchedules" :is-staff="isUserStaff" />
        </div>
    </div>
</template>

<script setup>
import PageHeader from "@/components/PageHeader.vue";
import CalendarSection from "@/components/main/CalendarSection.vue";
import {dummySchedules} from "@/data/dummyData.ts"; // 더미 데이터 모듈
</script>
