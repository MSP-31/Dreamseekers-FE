<template>
    <main id="app" class="w-screen">
        <!-- 도트 네비게이션 -->
        <div :class="['dot-navigation hidden md:block transition-opacity duration-300', {'opacity-0 pointer-events-none': activeSection === '#intro'}]">
            <a
                v-for="(menu, index) in dotMenus"
                :key="menu.name"
                :href="menu.hash"
                @click.prevent="scrollToSection(menu.hash)"
                :class="['dot', {active: activeSection === menu.hash}, {dark: ['#courses', '#schedule', '#contact'].includes(activeSection)}]"
                :title="menu.name"
            ></a>
        </div>

        <!-- 1. 인트로 섹션 (슬라이드) -->
        <SlideSection
            id="intro"
            class="scroll-section hero-vignette bg-black flex flex-col items-center justify-center p-4 h-[100dvh]"
            :slides="mainData.slides"
            @scroll-to="scrollToSection"
            v-scroll-animate
        />

        <!-- 2. 강의 목록 섹션 -->
        <section id="courses" class="scroll-section bg-gray-50 flex flex-col justify-center h-[100dvh] py-16 overflow-y-hidden">
            <div class="container mx-auto px-6">
                <LectureListSection :lecture-item="mainData.lectureItem" v-scroll-animate />
            </div>
        </section>

        <!-- 3. 강의 일정 섹션 -->
        <section id="schedule" class="scroll-section bg-white flex items-center justify-center h-[100dvh] overflow-y-hidden">
            <div class="flex flex-col items-center justify-center text-center p-6">
                <span class="text-8xl mb-6 text-main" v-scroll-animate>🗓️</span>
                <h2 class="text-4xl md:text-5xl font-bold mb-4 text-gray-800" v-scroll-animate>강의 일정표</h2>
                <div class="px-[1%] md:px-[20%]" v-scroll-animate>
                    <CalendarSection :schedules="mainData.schedules" :is-staff="authStore.isAdmin" />
                </div>
            </div>
        </section>

        <!-- 4. 오시는 길 섹션 -->
        <section id="contact" class="scroll-section bg-gray-50 flex items-center justify-center h-[100dvh] overflow-y-hidden">
            <div class="flex flex-col items-center justify-center text-center p-6">
                <span class="text-8xl mb-6 text-main" v-scroll-animate>📍</span>
                <h2 class="text-4xl md:text-5xl font-bold mb-4 text-gray-800" v-scroll-animate>오시는 길</h2>
                <div class="px-[1%] md:px-[20%]" v-scroll-animate>
                    <ContactMapSection />
                </div>
            </div>
        </section>
    </main>
</template>

<script setup lang="ts">
import SlideSection from "@/components/main/SlideSection.vue";
import LectureListSection from "@/components/main/LectureListSection.vue";
import CalendarSection from "@/components/main/CalendarSection.vue";
import ContactMapSection from "@/components/main/ContactMapSection.vue";
import {useAuthStore} from "@/stores/auth";
import apiClient from "@/api";
import {onMounted, onUnmounted, ref} from "vue";

const authStore = useAuthStore();
const mainData = ref({
    slides: [],
    schedules: [],
    lectureItem: [],
});
const activeSection = ref("#intro");
const dotMenus = [
    {name: "교육원 소개", hash: "#intro"},
    {name: "주요 강의", hash: "#courses"},
    {name: "강의 일정", hash: "#schedule"},
    {name: "오시는 길", hash: "#contact"},
];

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

const handleScroll = (event: Event) => {
    const target = document.getElementById("app-container") as HTMLElement;
    const scrollTop = target.scrollTop;
    const sectionHeight = window.innerHeight;

    const sections = ["#intro", "#courses", "#schedule", "#contact"];
    let currentIndex = Math.round(scrollTop / sectionHeight);

    if (currentIndex < 0) currentIndex = 0;
    if (currentIndex >= sections.length) currentIndex = sections.length - 1;

    activeSection.value = sections[currentIndex];
};

const scrollToSection = (hash: string) => {
    const targetElement = document.querySelector(hash);
    const appContainer = document.getElementById("app-container");

    if (targetElement && appContainer) {
        const targetTop = targetElement.getBoundingClientRect().top + appContainer.scrollTop;
        appContainer.scrollTo({
            top: targetTop,
            behavior: "smooth",
        });
        activeSection.value = hash; // 즉시 activeSection 업데이트
    }
};

onMounted(async () => {
    await fetchData();
    const appContainer = document.getElementById("app-container");
    if (appContainer) {
        appContainer.addEventListener("scroll", handleScroll);
        handleScroll({target: appContainer} as any); // 초기 스크롤 상태 설정
    }
});

onUnmounted(() => {
    const appContainer = document.getElementById("app-container");
    if (appContainer) {
        appContainer.removeEventListener("scroll", handleScroll);
    }
});
</script>
