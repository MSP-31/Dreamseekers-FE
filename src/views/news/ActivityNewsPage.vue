<template>
    <div class="font-[var(--font-body)]">
        <PageHeader title="소통 마당" backgroundImageUrl="/img/top_header/forum.jpg" />

        <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 class="text-3xl font-bold text-center mb-10 text-[var(--dream-text)]">활동 소식</h1>

            <ul v-if="newsItems.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
                <li v-for="item in newsItems" :key="item.id" class="flex flex-col bg-gray-50 shadow-lg rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl group">
                    <div class="p-6 flex-grow flex flex-col">
                        <h3 class="text-xl font-semibold text-[var(--dream-text)] mb-3 leading-tight">
                            <a :href="item.link" target="_blank" class="hover:text-[var(--dream-main)] transition-colors duration-200 line-clamp-2" rel="noopener noreferrer">
                                {{ item.title }}
                            </a>
                        </h3>
                        <p class="text-sm text-[var(--dream-sub)] leading-relaxed flex-grow line-clamp-5 mb-4">
                            <a :href="item.link" target="_blank" rel="noopener noreferrer">
                                {{ item.description }}
                            </a>
                        </p>
                    </div>
                    <div class="p-4 border-t border-gray-200 text-xs text-gray-500 flex justify-between items-center bg-white">
                        <a
                            v-if="item.sourceLink"
                            :href="item.sourceLink"
                            target="_blank"
                            class="hover:underline hover:text-[var(--dream-blue)] transition-colors duration-200"
                            rel="noopener noreferrer"
                        >
                            {{ item.source }}
                        </a>
                        <span v-else>{{ item.source }}</span>
                        <span>{{ formatDate(item.postdate) }}</span>
                    </div>
                </li>
            </ul>
            <div v-else class="text-center text-gray-500 py-16">
                <p>표시할 활동 소식이 없습니다.</p>
            </div>

            <!-- Empty decorative divider -->
            <div class="mt-12 border-t border-[var(--dream-gray-dark)] opacity-30"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import PageHeader from "@/components/PageHeader.vue";
import {activityNewsData, type ActivityNewsItem} from "@/data/dummyData";

const newsItems = ref<ActivityNewsItem[]>([...activityNewsData]);

const formatDate = (dateString: string): string => {
    if (!dateString || dateString.length !== 8) return dateString; // YYYYMMDD 형식 가정
    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6);
    const day = dateString.substring(6, 8);
    return `${year}.${month}.${day}`;
};

// Scroll animation (scroll_on type_bottom)은 Tailwind CSS만으로는 직접 구현하기 어렵습니다.
// Vue의 <TransitionGroup>과 Intersection Observer API를 함께 사용하거나,
// vue-scroll-reveal 같은 라이브러리를 사용하면 구현할 수 있습니다.
// 여기서는 정적 렌더링에 집중했습니다.
</script>

<style scoped>
/* line-clamp 유틸리티 (Tailwind CSS v3.3+ 에서는 기본 제공, 이전 버전은 플러그인 필요 또는 직접 정의) */
.line-clamp-2 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
}
.line-clamp-5 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 5;
}
</style>
