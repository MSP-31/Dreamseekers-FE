<template>
    <div v-if="isLoading" class="fixed inset-0 bg-white bg-opacity-80 z-50 flex flex-col items-center justify-center">
        <div class="h-12 w-12 border-4 border-t-4 border-gray-200 border-t-[var(--dream-main)] rounded-full animate-spin"></div>
        <span class="mt-4 text-gray-700 font-medium">처리 중...</span>
    </div>
</template>

<script setup lang="ts">
import {defineProps} from "vue";

defineProps<{
    isLoading: boolean;
}>();
</script>
