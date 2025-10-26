<template>
    <div
        class="bg-white shadow-xl rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ring-4 ring-transparent hover:ring-main/50 group"
        @click="$emit('open-modal', lecture)"
    >
        <div class="h-36 bg-cover bg-center" :style="{backgroundImage: `url(${lecture.image || '/img/dummy/placeholder-lecture.png'})`}"></div>
        <div class="p-5 flex flex-col">
            <h3 class="text-xl font-bold text-gray-800 mb-2 truncate" :data-id="lecture.id">
                {{ lecture.title }}
            </h3>
            <div class="flex flex-wrap gap-1 mb-3">
                <span v-for="tag in lecture.tags" :key="tag" class="text-xs font-semibold bg-main/10 text-main px-2 py-0.5 rounded-full">
                    {{ tag }}
                </span>
            </div>
            <p class="text-gray-600 text-sm mb-4 line-clamp-2">
                {{ lecture.contents }}
            </p>
            <div class="flex flex-col space-y-2">
                <button
                    class="font-bold text-main hover:text-blue-700 transition-colors text-center text-sm bg-main/5 py-2 px-4 rounded-full"
                    @click.stop="$emit('open-modal', lecture)"
                    :aria-label="'View details for ' + lecture.title"
                >
                    자세히 보기 &rarr;
                </button>
            </div>
            <div v-if="isStaff" class="absolute top-3 right-3 flex flex-col space-y-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button @click.stop="$emit('edit', lecture)" class="bg-main hover:bg-blue-700 text-white text-xs font-semibold py-1 px-2.5 rounded-full shadow-sm">수정</button>
                <button @click.stop="$emit('delete', lecture.id)" class="bg-red-500 hover:bg-red-600 text-white text-xs font-semibold py-1 px-2.5 rounded-full shadow-sm">삭제</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {defineEmits} from "vue";
import type {LectureItem} from "@/data/dummyData.ts";

defineProps<{
    lecture: LectureItem;
    isStaff: boolean;
}>();

defineEmits<{
    (e: "edit", lecture: LectureItem): void;
    (e: "delete", lectureId: number): void;
    (e: "open-modal", lecture: LectureItem): void;
}>();
</script>
