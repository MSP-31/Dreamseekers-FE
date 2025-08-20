<template>
    <div class="py-12">
        <div class="content-box container mx-auto px-4">
            <div class="text-center mb-12">
                <p class="text-3xl font-bold mb-2">다양한 교육들</p>
                <p class="text-gray-600">전문적인 지식으로 사례화된 교육을 실시하며 대면강의와 온라인 강의가능합니다.</p>
                <p class="text-gray-600">모두가 공감하는 현실적인 교육 대상별 차별화된 맞춤형 강의내용</p>
            </div>
            <Carousel :autoplay="5000" :wrap-around="true" :breakpoints="breakpoints">
                <Slide v-for="lecture in lectureItem" :key="lecture.id">
                    <LectureCard :lecture="lecture" :is-staff="false" @open-modal="handleOpenModal" />
                </Slide>
                <template #addons>
                    <Navigation />
                    <Pagination />
                </template>
            </Carousel>
        </div>
    </div>
    <LectureDetailModal class="mb-0" v-model:show="isModalOpen" :modal-title="'강의 상세 정보'" :initial-data="modalData" :form-fields="formFields" @close="handleCloseModal" />
</template>

<script setup lang="ts">
import LectureCard from "@/components/main/LectureCard.vue";
import type {LectureItem} from "@/data/dummyData.ts";
import {PropType, ref} from "vue";
import {Carousel, Slide, Pagination, Navigation} from "vue3-carousel";
import "vue3-carousel/dist/carousel.css";
import LectureDetailModal from "@/components/main/DetailModala.vue";
import {lectureFormSchema, type LectureFormSchemaField} from "@/data/dummyData";

defineProps({
    lectureItem: {
        type: Array as PropType<LectureItem[]>,
        required: true,
        default: () => [],
    },
});

const breakpoints = {
    0: {
        itemsToShow: 1,
        snapAlign: "center",
    },
    768: {
        itemsToShow: 2,
        snapAlign: "center",
    },
    1024: {
        itemsToShow: 3,
        snapAlign: "start",
    },
};

const isModalOpen = ref(false);
const modalData = ref({});
const formFields = ref<LectureFormSchemaField[]>(lectureFormSchema); // formFields 정의

const handleOpenModal = (lecture: LectureItem) => {
    modalData.value = lecture;
    isModalOpen.value = true;
};

const handleCloseModal = () => {
    isModalOpen.value = false;
};
</script>
