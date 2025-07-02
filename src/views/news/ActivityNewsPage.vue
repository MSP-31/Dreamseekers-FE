<template>
    <PageLayout title="소통 마당" backgroundImageUrl="/img/top_header/forum.jpg">
        <!-- 1. 로딩 상태 UI -->
        <div v-if="isLoading" class="text-center text-gray-500 py-16">
            <p>데이터를 불러오는 중입니다...</p>
        </div>

        <!-- 2. 에러 발생 시 UI -->
        <div v-else-if="error" class="text-center text-red-500 bg-red-100 p-4 rounded-lg py-16">
            <p>오류가 발생했습니다: {{ error }}</p>
        </div>

        <!-- 3. 데이터가 성공적으로 로드되었을 때 UI -->
        <ul v-else-if="newsItems.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
            <li v-for="item in newsItems" :key="item.id" class="flex flex-col bg-gray-50 shadow-lg rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl group">
                <div class="p-6 flex-grow flex flex-col">
                    <h3 class="text-xl font-semibold text-[var(--dream-text)] mb-3 leading-tight">
                        <a :href="item.link" target="_blank" class="hover:text-[var(--dream-main)] transition-colors duration-200" rel="noopener noreferrer">
                            {{ item.title }}
                        </a>
                    </h3>
                    <p class="text-sm text-[var(--dream-sub)] leading-relaxed flex-grow mb-4">
                        <a :href="item.link" target="_blank" rel="noopener noreferrer">
                            {{ item.description }}
                        </a>
                    </p>
                </div>
                <div class="p-4 border-t border-gray-200 text-xs text-gray-500 flex justify-between items-center bg-white">
                    <a v-if="item.sourceLink" :href="item.sourceLink" target="_blank" class="hover:underline hover:text-[var(--dream-blue)] transition-colors duration-200" rel="noopener noreferrer">
                        {{ item.source }}
                    </a>
                    <span v-else>{{ item.source }}</span>
                    <span>{{ formatDate(item.postdate) }}</span>
                </div>
            </li>
        </ul>

        <!-- 4. 데이터가 없을 때 UI -->
        <div v-else class="text-center text-gray-500 py-16">
            <p>표시할 활동 소식이 없습니다.</p>
        </div>

        <!-- Empty decorative divider -->
        <div class="mt-12 border-t border-[var(--dream-gray-dark)] opacity-30"></div>
    </PageLayout>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import PageLayout from "@/components/layout/PageLayout.vue";
import type {ActivityNewsItem} from "@/data/dummyData";
import apiClient from "@/api";

// 1. 데이터, 로딩, 에러 상태를 위한 ref 선언
const newsItems = ref<ActivityNewsItem[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);

// 2. 백엔드에서 데이터를 가져오는 비동기 함수
const fetchActivityNews = async () => {
    isLoading.value = true;
    error.value = null;
    try {
        // 실제 백엔드 API 엔드포인트로 교체해야 합니다.
        const response = await apiClient.get("/news");
        newsItems.value = response.data;
    } catch (e: any) {
        // axios 에러 객체는 더 자세한 정보를 포함할 수 있습니다. e.response.data
        console.error("활동 소식 로딩 중 에러 발생:", e);
        error.value = e.message || "알 수 없는 오류가 발생했습니다.";
    } finally {
        isLoading.value = false;
    }
};

const formatDate = (dateString: string): string => {
    if (!dateString || dateString.length !== 8) return dateString; // YYYYMMDD 형식 가정
    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6);
    const day = dateString.substring(6, 8);
    return `${year}.${month}.${day}`;
};

// 3. 컴포넌트가 마운트된 후 데이터 로딩 함수를 호출
onMounted(() => {
    fetchActivityNews();
});
</script>
