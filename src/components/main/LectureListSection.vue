<template>
    <div class="py-12">
        <div class="content-box container mx-auto px-4">
            <div class="text-center mb-12">
                <p class="text-3xl font-bold mb-2">다양한 교육들</p>
                <p class="text-gray-600">전문적인 지식으로 사례화된 교육을 실시하며 대면강의와 온라인 강의가능합니다.</p>
                <p class="text-gray-600">모두가 공감하는 현실적인 교육 대상별 차별화된 맞춤형 강의내용</p>
            </div>
            <ul class="lecture-box grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <li v-for="lecture in lectures" :key="lecture.pk" class="lecture-content bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105">
                    <router-link :to="`/lecture/detail/${lecture.id}`" class="block">
                        <img :src="lecture.image" :alt="lecture.title" class="w-full h-48 object-cover" />
                        <div class="p-6">
                            <h2 class="lecture-title text-xl font-semibold mb-2">{{ lecture.title }}</h2>
                            <p class="lecture-text text-gray-700 text-sm leading-relaxed whitespace-pre-line">{{ lecture.contents }}</p>
                        </div>
                    </router-link>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">
import type {PropType} from "vue";
import type {Lecture} from "@/data/dummyData.ts";

defineProps({
    lectures: {
        type: Array as PropType<Lecture[]>,
        required: true,
        default: () => [],
    },
});
</script>
