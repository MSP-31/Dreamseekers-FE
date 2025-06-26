<template>
    <div class="relative h-64 md:h-80 bg-gray-700">
        <img :src="backgroundImageUrl" :alt="`${title} 배경 이미지`" class="w-full h-full object-cover opacity-50" />
        <div class="absolute inset-0 flex items-center justify-center">
            <h1 class="text-white text-4xl md:text-5xl font-bold">{{ title }}</h1>
        </div>
    </div>
</template>

<script setup lang="ts">
import {defineProps} from "vue";

const _props = defineProps<{
    title: string;
    backgroundImageUrl: string;
}>();
</script>
