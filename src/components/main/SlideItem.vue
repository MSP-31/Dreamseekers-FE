<template>
    <li class="bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl relative group flex flex-col border border-transparent hover:border-[var(--dream-main)]">
        <div class="relative p-5 flex-grow">
            <div class="block">
                <img :src="slide.image" :alt="slide.id" class="w-full h-48 object-cover rounded-md" />
                <h2 class="text-xl font-semibold text-[var(--dream-text)] mb-2 truncate">
                    {{ slide.title }}
                </h2>
                <p class="text-sm text-[var(--dream-sub)] leading-relaxed line-clamp-3">
                    {{ slide.contents }}
                </p>
            </div>
        </div>

        <div v-if="isAdmin" class="absolute top-3 right-3 flex flex-col space-y-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button @click="$emit('edit', slide)" class="bg-[var(--dream-blue)] hover:bg-opacity-80 text-white text-xs font-semibold py-1 px-2.5 rounded-md shadow-sm">수정</button>
            <button @click="$emit('delete', slide.id)" class="bg-red-500 hover:bg-red-600 text-white text-xs font-semibold py-1 px-2.5 rounded-md shadow-sm">삭제</button>
        </div>
    </li>
</template>

<script setup lang="ts">
// Slides 모델의 Serializer에서 반환하는 데이터 구조에 맞게 타입을 정의합니다.
// 예시: image가 객체 형태(url, width, height 등)로 온다면 더 복잡해질 수 있습니다.
interface SlideItem {
    id: number;
    image: string | null; // 이미지 URL을 포함하는 객체 또는 null
    title?: string;
    contents?: string;
}

defineProps<{
    slide: SlideItem; // lecture 대신 slide prop을 받도록 변경
    isAdmin: boolean; // 관리자 여부를 위한 prop 추가 (어디서 받아오는지 확인 필요)
}>();

defineEmits<{
    (e: "edit", slide: SlideItem): void; // 이벤트 인자도 slide 객체로 변경
    (e: "delete", slideId: number): void; // 이벤트 인자는 ID로 유지
}>();
</script>

<style scoped>
/* 필요한 스타일 추가 */
</style>
