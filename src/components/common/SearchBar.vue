<template>
    <form @submit.prevent="handleSubmit" class="mb-8 max-w-xl mx-auto">
        <div class="flex items-center border border-gray-300 rounded-md shadow-sm overflow-hidden">
            <select v-model="searchType" class="px-3 py-2 border-r border-gray-300 bg-gray-50 text-sm text-gray-700 focus:outline-none">
                <option v-for="type in searchTypes" :key="type.value" :value="type.value">
                    {{ type.text }}
                </option>
            </select>
            <input type="text" v-model="searchQueryInput" placeholder="검색어를 입력해주세요" class="flex-grow px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--dream-main)]" />
            <button type="submit" class="px-4 py-2 bg-[var(--dream-main)] text-white hover:bg-opacity-80 transition-colors">
                <img src="/img/icon/search_black_24dp.svg" alt="검색" class="h-5 w-5" />
            </button>
        </div>
    </form>

    <div v-if="currentSearchQuery" class="text-center text-sm text-gray-600 mb-6">
        "'{{ currentSearchQuery }}' 검색 결과입니다. <button @click="handleClearSearch" class="ml-2 text-[var(--dream-blue)] hover:underline text-xs">(검색 초기화)</button>"
    </div>
</template>

<script setup lang="ts">
import {ref, watch} from "vue";
import {noticeSearchTypes} from "@/types/pagination";

const props = defineProps<{
    initialSearchQuery: string;
    initialSearchType: string;
}>();

const emit = defineEmits(["search", "clearSearch"]);

const searchTypes = ref(noticeSearchTypes); // 예시: { value: 'all', text: '전체' }
const searchQueryInput = ref(props.initialSearchQuery);
const searchType = ref(props.initialSearchType);
const currentSearchQuery = ref(props.initialSearchQuery); // UI 표시용

// 부모로부터 props가 변경될 때 내부 상태 업데이트
watch(
    () => props.initialSearchQuery,
    (newVal) => {
        searchQueryInput.value = newVal;
        currentSearchQuery.value = newVal;
    }
);

watch(
    () => props.initialSearchType,
    (newVal) => {
        searchType.value = newVal;
    }
);

const handleSubmit = () => {
    currentSearchQuery.value = searchQueryInput.value; // 검색 시 현재 검색어 업데이트
    emit("search", {query: searchQueryInput.value, type: searchType.value});
};

const handleClearSearch = () => {
    searchQueryInput.value = "";
    searchType.value = noticeSearchTypes[0].value; // 검색 타입도 기본값으로 초기화
    currentSearchQuery.value = ""; // UI 검색어 초기화
    emit("clearSearch");
};
</script>
