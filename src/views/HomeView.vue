<template>
    <main>
        <SlideSection :slides="mainData.slides" />
        <div class="relative text-center text-black flex-1 my-0 mx-[20%] space-y-12">
            <LectureListSection :lectureItem="mainData.lectureItem" />
            <p class="text-3xl font-bold mb-2">강의 일정표</p>
            <CalendarSection :schedules="mainData.schedules" :is-staff="authStore.isAdmin" />
            <ContactMapSection :contacts="dummyContacts" :business-info="dummyBusinessInfo" :naver-map-client-id="naverClientId" />
        </div>
    </main>
</template>

<script setup lang="ts">
import SlideSection from "../components/main/SlideSection.vue";
import LectureListSection from "../components/main/LectureListSection.vue";
import CalendarSection from "../components/main/CalendarSection.vue";
import ContactMapSection from "../components/main/ContactMapSection.vue";
import {dummyContacts, dummyBusinessInfo, naverClientId} from "@/data/dummyData.ts"; // 데이터 모듈
import {useAuthStore} from "@/stores/auth";
import apiClient from "@/api";
import {onMounted, ref} from "vue";

const authStore = useAuthStore();
const mainData = ref({
    slides: [],
    schedules: [],
    lectureItem: [],
});

const fetchData = async () => {
    try {
        const response = await apiClient.get("/main/");
        mainData.value.slides = response.data.slides || [];
        mainData.value.schedules = response.data.schedules || [];
        mainData.value.lectureItem = response.data.lectures || [];
    } catch (error: any) {
        console.error("API 호출 오류:", error);
        if (error.response?.status === 400) {
            alert(error.response.data?.detail);
        } else if (error.response.status === 404) {
            alert(error.response.data?.detail);
        } else {
            alert("데이터 로딩에 실패했습니다.");
        }
    }
};

// 데이터를 불러오기
onMounted(async () => {
    fetchData();
});
</script>
