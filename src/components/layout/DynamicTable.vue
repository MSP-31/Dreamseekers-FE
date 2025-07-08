<template>
    <table class="min-w-full divide-y divide-gray-200 border-t border-b border-gray-300">
        <thead class="bg-gray-50">
            <tr>
                <th
                    v-for="header in headers"
                    :key="header.key"
                    scope="col"
                    :class="['px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider', header.align || 'text-left', header.width || '']"
                >
                    {{ header.text }}
                </th>
            </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="items.length === 0">
                <td :colspan="headers.length" class="px-4 py-8 text-center text-gray-500">표시할 내용이 없습니다.</td>
            </tr>
            <tr
                v-for="(item, rowIndex) in items"
                :key="item.id || rowIndex"
                :class="['hover:bg-gray-100 cursor-pointer transition-colors duration-150', item.is_important ? 'bg-yellow-50 font-semibold' : '']"
                @click="goToDetail(item.id)"
            >
                <td
                    v-for="header in headers"
                    :key="`${item.id || rowIndex}-${header.key}`"
                    :class="['px-4 py-3 whitespace-nowrap text-sm', header.align || 'text-left', header.textClass || 'text-gray-700']"
                >
                    <slot :name="`cell-${header.key}`" :item="item" :index="rowIndex" :pagination="pagination">
                        {{ item[header.key] }}
                    </slot>
                </td>
            </tr>
        </tbody>
    </table>

    <div v-if="pagination.total_pages > 1" class="mt-8 flex justify-center">
        <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button
                @click="changePage(pagination.previous_page_number)"
                :disabled="!pagination.has_previous"
                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
                <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
            </button>
            <button
                v-for="page in pagination.page_numbers"
                :key="page"
                @click="changePage(page)"
                :class="[
                    'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                    page === pagination.current_page ? 'z-10 bg-[var(--dream-main)] border-[var(--dream-main)] text-white' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50',
                ]"
            >
                {{ page }}
            </button>
            <button
                @click="changePage(pagination.next_page_number)"
                :disabled="!pagination.has_next"
                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
                <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
            </button>
        </nav>
    </div>
</template>

<script setup lang="ts">
import {type PaginationState} from "@/types/pagination";

// DynamicTable의 헤더 정의를 위한 타입
export interface TableHeader {
    key: string; // 데이터 객체의 속성 이름
    text: string; // 테이블 헤더에 표시될 텍스트
    align?: "text-left" | "text-center" | "text-right"; // 텍스트 정렬 (Tailwind CSS 클래스)
    width?: string; // 열 너비 (Tailwind CSS 클래스)
    textClass?: string; // 셀 텍스트에 적용할 추가 클래스
}

defineProps<{
    headers: TableHeader[]; // 테이블 헤더 정의
    items: any[]; // 표시할 데이터 배열 (어떤 타입이든 가능)
    pagination: PaginationState; // 페이지네이션 상태
}>();

const emit = defineEmits(["changePage", "goToDetail"]);

const changePage = (pageNumber: number | null) => {
    emit("changePage", pageNumber);
};

const goToDetail = (id: number) => {
    emit("goToDetail", id);
};
</script>
