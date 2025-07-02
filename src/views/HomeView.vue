<template>
    <main>
        <SlideSection :slides="dummySlides" />
        <div class="relative text-center text-black flex-1 my-0 mx-[20%]">
            <LectureListSection :lectures="lectureItemsData" />
            <CalendarSection :schedules="dummySchedules" :is-staff="authStore.isAdmin" />
            <ContactMapSection :contacts="dummyContacts" :business-info="dummyBusinessInfo" :naver-map-client-id="naverClientId" />
        </div>
    </main>
</template>

<script setup>
import SlideSection from "../components/main/SlideSection.vue";
import LectureListSection from "../components/main/LectureListSection.vue";
import CalendarSection from "../components/main/CalendarSection.vue";
import ContactMapSection from "../components/main/ContactMapSection.vue";
import {dummySlides, lectureItemsData, dummySchedules, dummyContacts, dummyBusinessInfo, naverClientId} from "@/data/dummyData.ts"; // 데이터 모듈
import {useAuthStore} from "@/stores/auth";

const authStore = useAuthStore();
</script>
