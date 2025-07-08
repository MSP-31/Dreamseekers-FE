<template>
    <li class="bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl relative group flex flex-col border border-transparent hover:border-[var(--dream-main)]">
        <div class="relative p-5 flex-grow">
            <router-link :to="detailUrl || '#'" class="block">
                <img :src="lecture.image || '/img/dummy/placeholder-lecture.png'" :alt="lecture.title" class="w-full h-48 object-cover rounded-md mb-4" />
                <h2 class="text-xl font-semibold text-[var(--dream-text)] mb-2 truncate" :data-id="lecture.id">
                    {{ lecture.title }}
                </h2>
                <p class="text-sm text-[var(--dream-sub)] leading-relaxed line-clamp-3">
                    {{ lecture.contents }}
                </p>
            </router-link>
        </div>

        <div v-if="isStaff" class="absolute top-3 right-3 flex flex-col space-y-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button @click="$emit('edit', lecture)" class="bg-[var(--dream-blue)] hover:bg-opacity-80 text-white text-xs font-semibold py-1 px-2.5 rounded-md shadow-sm">수정</button>
            <button @click="$emit('delete', lecture.id)" class="bg-red-500 hover:bg-red-600 text-white text-xs font-semibold py-1 px-2.5 rounded-md shadow-sm">삭제</button>
        </div>
    </li>
</template>

<script setup lang="ts">
import type {LectureItem} from "@/data/dummyData";

defineProps<{
    lecture: LectureItem;
    isStaff: boolean;
    detailUrl?: string; // 상세 페이지 URL (선택적)
}>();

defineEmits<{
    (e: "edit", lecture: LectureItem): void;
    (e: "delete", lectureId: number): void;
}>();
</script>
