<template>
    <div class="py-12">
        <div class="content-box container mx-auto px-4">
            <div class="text-center mb-12">
                <p class="text-3xl font-bold mb-2">다양한 교육들</p>
                <p class="text-gray-600">전문적인 지식으로 사례화된 교육을 실시하며 대면강의와 온라인 강의가능합니다.</p>
                <p class="text-gray-600">모두가 공감하는 현실적인 교육 대상별 차별화된 맞춤형 강의내용</p>
            </div>
            <ul class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                <LectureCard v-for="lecture in lectureItem" :key="lecture.id" :lecture="lecture" :is-staff="false" />
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">
import LectureCard from "@/components/main/LectureCard.vue";
import type {LectureItem} from "@/data/dummyData.ts";
import {PropType} from "vue";

defineProps({
    lectureItem: {
        type: Array as PropType<LectureItem[]>,
        required: true,
        default: () => [],
    },
});
</script>
