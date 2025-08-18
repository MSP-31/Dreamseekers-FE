<template>
    <!-- Map Area -->
    <NaverMap />

    <!-- Address and Map Link -->
    <div class="map_address text-left py-6 border-b border-[var(--dream-text)] mb-8 relative">
        <h3 class="text-lg font-semibold text-[var(--dream-text)] mb-1">꿈을찾는사람들교육원</h3>
        <h2 class="text-2xl font-bold text-[var(--dream-main)]">{{ contactInfo.address }} / {{ contactInfo.sub_address }}</h2>
        <a
            :href="contactInfo.map_add"
            target="_blank"
            class="absolute right-0 top-2 bg-[var(--dream-blue)] hover:bg-opacity-80 text-white font-semibold py-2 px-4 rounded-md shadow-sm transition duration-150 ease-in-out"
        >
            지도에서 보기
        </a>
    </div>

    <!-- Contact and Business Info Box (Separated Component) -->
    <ContactInfoBox :contactInfo="contactInfo" :businessInfo="businessInfo" />

    <!-- Empty decorative divider (from original .board-title) -->
    <div class="mt-12 border-t border-[var(--dream-gray-dark)] opacity-30"></div>
</template>

<script setup lang="ts">
import {reactive} from "vue";
import ContactInfoBox from "@/components/ContactInfoBox.vue"; // 컴포넌트 경로에 맞게 수정
import {contactInfoData, businessInfoData, type ContactInfo, type BusinessInfo} from "@/data/dummyData"; // dummyData.ts 경로에 맞게 수정
import NaverMap from "@/components/utils/NaverMap.vue";

// 현재 페이지에 표시될 데이터
const contactInfo = reactive<ContactInfo>({...contactInfoData});
const businessInfo = reactive<BusinessInfo>({...businessInfoData});
</script>
