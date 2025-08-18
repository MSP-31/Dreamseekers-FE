<template>
    <li class="bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl relative group flex flex-col border border-transparent hover:border-[var(--dream-main)]">
        <div class="relative p-5 flex-grow" @click="openModal(lecture)">
            <img :src="lecture.image || '/img/dummy/placeholder-lecture.png'" :alt="lecture.title" class="w-full h-48 object-cover rounded-md mb-4" />
            <h2 class="text-xl font-semibold text-[var(--dream-text)] mb-2 truncate" :data-id="lecture.id">
                {{ lecture.title }}
            </h2>
            <p class="text-sm text-[var(--dream-sub)] leading-relaxed line-clamp-3">
                {{ lecture.contents }}
            </p>
        </div>

        <div v-if="isStaff" class="absolute top-3 right-3 flex flex-col space-y-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button @click="$emit('edit', lecture)" class="bg-[var(--dream-blue)] hover:bg-opacity-80 text-white text-xs font-semibold py-1 px-2.5 rounded-md shadow-sm">수정</button>
            <button @click="$emit('delete', lecture.id)" class="bg-red-500 hover:bg-red-600 text-white text-xs font-semibold py-1 px-2.5 rounded-md shadow-sm">삭제</button>
        </div>
    </li>
    <LectureDetailModal v-model:show="showModal" :modal-title="'강의 상세 정보'" :form-fields="formSchema" :initial-data="initialModalData" />
</template>

<script setup lang="ts">
import {ref} from "vue";
import {LectureFormData, lectureFormSchema, type LectureFormSchemaField, type LectureItem} from "@/data/dummyData";
import LectureDetailModal from "@/components/main/DetailModala.vue";

const showModal = ref(false);
const formSchema = ref<LectureFormSchemaField[]>(lectureFormSchema);

defineProps<{
    lecture: LectureItem;
    isStaff: boolean;
}>();

defineEmits<{
    (e: "edit", lecture: LectureItem): void;
    (e: "delete", lectureId: number): void;
}>();

// 모달 초기 데이터
const initialModalData = ref<LectureFormData>({
    title: "",
    contents: "",
    image: null, // 이미지 필드도 포함
});

const openModal = (lecture: LectureItem) => {
    initialModalData.value = {
        // initialModalData를 업데이트하여 자식 컴포넌트에 전달
        title: lecture.title,
        contents: lecture.contents,
        image: lecture.image || null, // 기존 이미지 URL 전달
    };
    showModal.value = true;
};
</script>
