<template>
    <main>
        <SlideSection :slides="dummySlides" />
        <div class="hidden nav-breakpoint:flex bg-red-500">화면 크기가 1140px 이상이면 보여야 합니다!</div>
        <div class="relative text-center text-black flex-1 my-0 mx-[20%]">
            <LectureListSection :lectures="dummyLectures" />
            <CalendarSection :schedules="dummySchedules" :is-staff="isUserStaff" />
            <ContactMapSection :contacts="dummyContacts" :business-info="dummyBusinessInfo" :naver-map-client-id="naverClientId" />
        </div>
    </main>
</template>

<script setup>
import SlideSection from "../components/main/SlideSection.vue";
import LectureListSection from "../components/main/LectureListSection.vue";
import CalendarSection from "../components/main/CalendarSection.vue";
import ContactMapSection from "../components/main/ContactMapSection.vue";
import {dummySlides, dummyLectures, dummySchedules, dummyContacts, dummyBusinessInfo, isUserStaff, naverClientId} from "@/data/dummyData.ts"; // 더미 데이터 모듈
</script>
