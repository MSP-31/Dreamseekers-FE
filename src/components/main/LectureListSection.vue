<template>
    <section id="courses" class="scroll-section bg-gray-50 flex flex-col justify-center min-h-[100vh] py-16">
        <div class="container mx-auto px-6">
            <!-- 섹션 제목 및 설명 -->
            <h2 class="text-4xl md:text-5xl font-bold text-center mb-4 text-gray-800" v-scroll-animate>화려하고 <span class="text-main">현대적인</span> 주요 강의</h2>
            <p class="text-center text-lg text-gray-600 mb-12 delay-200" v-scroll-animate>
                전문적인 지식으로 사례화된 교육을 실시하며 대면강의와 온라인 강의 가능합니다.
                <br />
                모두가 공감하는 현실적인 교육 대상별 차별화된 맞춤형 강의 내용
            </p>

            <!-- 전체 강의목록 링크 -->
            <div class="flex justify-end mb-4">
                <router-link
                    to="/lecture/list"
                    class="bg-main text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-blue-700 transition-colors duration-300 transform hover:scale-105 delay-400"
                    v-scroll-animate
                >
                    전체 강의목록
                </router-link>
            </div>

            <!-- 마키 효과 컨테이너 -->
            <div class="marquee-container delay-600" v-scroll-animate>
                <div class="marquee-content" aria-hidden="true">
                    <!-- 강의 카드 (원본) -->
                    <div v-for="lecture in lectureItem" :key="lecture.id" class="course-card">
                        <LectureCard :lecture="lecture" :is-staff="false" @open-modal="handleOpenModal" />
                    </div>
                    <!-- 마키 효과를 위한 복제본 -->
                    <div v-for="lecture in lectureItem" :key="lecture.id + '-copy'" class="course-card">
                        <LectureCard :lecture="lecture" :is-staff="false" @open-modal="handleOpenModal" />
                    </div>
                </div>
            </div>
        </div>

        <!-- 기존 모달 -->
        <LectureDetailModal class="mb-0" v-model:show="isModalOpen" :modal-title="'강의 상세 정보'" :initial-data="modalData" :form-fields="formFields" @close="handleCloseModal" />
    </section>
</template>

<script setup lang="ts">
import LectureCard from "@/components/main/LectureCard.vue";
import type {LectureItem} from "@/data/dummyData.ts";
import {PropType, ref} from "vue";
import LectureDetailModal from "@/components/main/DetailModala.vue";
import {lectureFormSchema, type LectureFormSchemaField} from "@/data/dummyData";

defineProps({
    lectureItem: {
        type: Array as PropType<LectureItem[]>,
        required: true,
        default: () => [],
    },
});

const isModalOpen = ref(false);
const modalData = ref({});
const formFields = ref<LectureFormSchemaField[]>(lectureFormSchema);

const handleOpenModal = (lecture: LectureItem) => {
    modalData.value = lecture;
    isModalOpen.value = true;
};

const handleCloseModal = () => {
    isModalOpen.value = false;
};
</script>

<style scoped>
.marquee-container {
    @apply w-full overflow-hidden whitespace-nowrap box-border;
    mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
    -webkit-mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
}

.marquee-content {
    @apply inline-flex animate-[marquee_40s_linear_infinite] pb-8;
    will-change: transform;
}

.marquee-content:hover {
    animation-play-state: paused;
}

.course-card {
    @apply flex-shrink-0 w-80 mr-8; /* 320px 너비, 2rem 간격 */
}

@keyframes marquee {
    0% {
        transform: translateX(0);
    }
    100% {
        transform: translateX(-50%);
    }
}
</style>
