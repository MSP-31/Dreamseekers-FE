<template>
    <PageLayout title="강의 일정" backgroundImageUrl="/img/top_header/inquiry.jpg">
        <CalendarSection :is-staff="authStore.isAdmin" />
    </PageLayout>
</template>

<script setup lang="ts">
import CalendarSection from "@/components/main/CalendarSection.vue";
import PageLayout from "@/components/layout/PageLayout.vue";
import {useAuthStore} from "@/stores/auth";

const authStore = useAuthStore();

/*
const fetchLectures = async () => {
    try {
        const response = await apiClient.get<ScheduleEntry[]>("/lecture/calendar");
        schedules.value = response.data;
        console.log("강의 일정 데이터:", schedules.value);
    } catch (error: any) {
        console.error("강의 일정 API 호출 오류:", error);
        if (error.response) {
            const errorMessage = error.response.data?.detail || error.response.data?.message || `서버 오류: ${error.response.status}`;
            alert(`강의 데이터를 불러오는 데 실패했습니다: ${errorMessage}`);
        } else {
            alert("강의 데이터를 불러오는 데 실패했습니다: 네트워크 연결을 확인하세요.");
        }
    }
};
*/
</script>
