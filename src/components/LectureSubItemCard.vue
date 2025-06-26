<template>
    <li class="bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl relative group flex flex-col border border-transparent hover:border-[var(--dream-main)]">
        <div class="p-5 flex-grow flex flex-col">
            <img v-if="subItem.image" :src="subItem.image" :alt="subItem.title" class="w-full h-40 object-cover rounded-md mb-4" />
            <div v-else class="w-full h-40 bg-[var(--dream-gray)] rounded-md mb-4 flex items-center justify-center text-[var(--dream-sub)]">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                </svg>
            </div>
            <h2 class="text-lg font-semibold text-[var(--dream-text)] mb-2 group-hover:text-[var(--dream-main)]" :data-id="subItem.id">
                {{ subItem.title }}
            </h2>
            <p class="text-sm text-[var(--dream-sub)] leading-relaxed whitespace-pre-line flex-grow">
                {{ subItem.contents }}
            </p>
        </div>

        <!-- Staff-only: Edit/Delete Buttons -->
        <div v-if="isStaff" class="absolute top-2 right-2 flex flex-col space-y-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button @click="$emit('edit', subItem)" class="bg-[var(--dream-blue)] hover:bg-opacity-80 text-white text-xs font-semibold py-1 px-2 rounded-md shadow-sm">수정</button>
            <button @click="$emit('delete', subItem.id)" class="bg-red-500 hover:bg-red-600 text-white text-xs font-semibold py-1 px-2 rounded-md shadow-sm">삭제</button>
        </div>
    </li>
</template>

<script setup lang="ts">
import {defineProps, defineEmits} from "vue";
import type {LectureSubItem} from "@/data/dummyData";

const _props = defineProps<{
    subItem: LectureSubItem;
    isStaff: boolean;
}>();

const _emit = defineEmits<{
    (e: "edit", item: LectureSubItem): void;
    (e: "delete", itemId: number): void;
}>();
</script>
