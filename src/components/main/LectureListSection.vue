<template>
    <div class="py-12">
        <div class="content-box container mx-auto px-4">
            <div class="text-center mb-12">
                <p class="text-3xl font-bold mb-2">다양한 교육들</p>
                <p class="text-gray-600">전문적인 지식으로 사례화된 교육을 실시하며 대면강의와 온라인 강의가능합니다.</p>
                <p class="text-gray-600">모두가 공감하는 현실적인 교육 대상별 차별화된 맞춤형 강의내용</p>
            </div>
            <ul class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                <LectureCard v-for="lecture in lectures" :key="lecture.id" :lecture="lecture" :is-staff="false" :detail-url="`/lecture/detail/${lecture.id}`" />
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">
import apiClient from "@/api";
import LectureCard from "@/components/LectureCard.vue";
import {type LectureItem} from "@/data/dummyData";
import {onMounted, ref} from "vue";

const lectures = ref<LectureItem[]>([]);

// 강의 데이터를 서버에서 불러오는 함수
const fetchLectures = async () => {
    try {
        const response = await apiClient.get<LectureItem[]>("/lecture/titles");
        lectures.value = response.data;
    } catch (error: any) {
        console.error("API 호출 오류:", error);
        if (error.response?.status === 400) {
            alert(error.response.data?.detail);
        } else if (error.response?.status === 404) {
            alert(error.response.data?.detail);
        } else {
            alert("강의 데이터를 불러오는 데 실패했습니다.");
        }
    }
};

onMounted(() => {
    fetchLectures(); // 컴포넌트 마운트 시 강의 데이터 로딩
});
</script>
