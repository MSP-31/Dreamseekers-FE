<template>
    <div class="font-[var(--font-body)]">
        <PageHeader :title="mainLecture?.title || '강의 상세'" backgroundImageUrl="/Dreamseekers-FE/img/top_header/lecture.jpg" />

        <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div v-if="mainLecture">
                <h1 class="text-3xl font-bold text-center mb-4 text-[var(--dream-text)]">{{ mainLecture.title }}</h1>
                <p v-if="mainLecture.contents" class="text-center text-lg text-[var(--dream-sub)] mb-10">{{ mainLecture.contents }}</p>

                <!-- Staff-only: Add Sub-item Button -->
                <div v-if="isStaff" class="text-right mb-6">
                    <button @click="openModal()" class="bg-[var(--dream-main)] hover:bg-opacity-80 text-white font-semibold py-2 px-6 rounded-md shadow-sm">세부 항목 추가</button>
                </div>

                <!-- Sub-Lectures List -->
                <ul v-if="currentSubItems.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <LectureSubItemCard v-for="item in currentSubItems" :key="item.id" :sub-item="item" :is-staff="isStaff" @edit="openModal" @delete="handleDelete" />
                </ul>
                <div v-else class="text-center text-gray-500 py-8">
                    <p>표시할 세부 강의 항목이 없습니다.</p>
                    <p v-if="isStaff" class="mt-2 text-sm">"세부 항목 추가" 버튼을 눌러 내용을 추가할 수 있습니다.</p>
                </div>
            </div>
            <div v-else class="text-center text-gray-500 py-16">
                <p>강의 정보를 불러올 수 없습니다.</p>
                <router-link to="/lectures" class="text-[var(--dream-main)] hover:underline mt-4 inline-block">강의 목록으로 돌아가기</router-link>
            </div>

            <!-- Empty decorative divider -->
            <div class="mt-12 border-t border-[var(--dream-gray-dark)] opacity-30"></div>

            <!-- Modal for Adding/Editing Sub-Lecture Item -->
            <div
                v-if="isStaff && showModal"
                class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
                :class="{'opacity-100': showModal, 'opacity-0 pointer-events-none': !showModal}"
                @click.self="closeModal"
            >
                <div class="bg-white p-6 sm:p-8 rounded-lg shadow-2xl w-full max-w-lg transform transition-all duration-300 ease-in-out" :class="{'scale-100': showModal, 'scale-95': !showModal}">
                    <div class="flex justify-between items-center mb-6">
                        <h3 class="text-xl font-semibold text-[var(--dream-text)]">{{ isEditing ? "세부 항목 수정" : "새 세부 항목 추가" }}</h3>
                        <button @click="closeModal" class="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
                    </div>
                    <form @submit.prevent="handleSubmit">
                        <div class="space-y-4">
                            <template v-for="field in formSchema" :key="field.name">
                                <div v-if="field.type === 'text' || field.type === 'textarea'">
                                    <label :for="field.id" class="block text-sm font-medium text-[var(--dream-sub)] mb-1">{{ field.label }}</label>
                                    <input
                                        v-if="field.type === 'text'"
                                        :type="field.type"
                                        :id="field.id"
                                        v-model="formData[field.name as keyof LectureSubItemFormData]"
                                        class="mt-1 block w-full px-3 py-2 border border-[var(--dream-gray-dark)] rounded-md shadow-sm focus:outline-none focus:ring-[var(--dream-main)] focus:border-[var(--dream-main)] sm:text-sm"
                                    />
                                    <textarea
                                        v-else-if="field.type === 'textarea'"
                                        :id="field.id"
                                        v-model="formData[field.name as keyof LectureSubItemFormData]"
                                        rows="4"
                                        class="mt-1 block w-full px-3 py-2 border border-[var(--dream-gray-dark)] rounded-md shadow-sm focus:outline-none focus:ring-[var(--dream-main)] focus:border-[var(--dream-main)] sm:text-sm resize-none"
                                    ></textarea>
                                </div>
                                <div v-if="field.type === 'image'">
                                    <label class="block text-sm font-medium text-[var(--dream-sub)] mb-1">{{ field.label }}</label>
                                    <label
                                        class="mt-1 w-full flex flex-col items-center px-4 py-3 bg-white text-[var(--dream-blue)] rounded-lg shadow border border-[var(--dream-blue)] border-dashed cursor-pointer hover:bg-[var(--dream-gray)] hover:text-[var(--dream-main)] transition-colors"
                                    >
                                        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                                        </svg>
                                        <span class="mt-1 text-xs leading-normal">{{ uploadedImageFile ? uploadedImageFile.name : "이미지 선택 (선택 사항)" }}</span>
                                        <input :id="field.id" type="file" accept="image/*" class="hidden" @change="handleImageUpload" />
                                    </label>
                                    <div v-if="previewImageUrl" class="mt-3 text-center">
                                        <p class="text-xs font-medium text-[var(--dream-sub)] mb-1">미리보기</p>
                                        <div class="border border-gray-300 p-2 rounded-md w-full max-w-xs h-40 mx-auto flex items-center justify-center overflow-hidden relative bg-gray-50">
                                            <img :src="previewImageUrl" alt="이미지 미리보기" class="max-h-full max-w-full object-contain rounded" />
                                            <button
                                                type="button"
                                                @click="removePreviewImage"
                                                class="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 w-5 h-5 flex items-center justify-center text-xs leading-none hover:bg-red-600"
                                                title="이미지 제거"
                                            >
                                                X
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </div>
                        <div class="mt-8 text-right space-x-3">
                            <button type="button" @click="closeModal" class="bg-[var(--dream-gray-dark)] hover:bg-opacity-80 text-white font-semibold py-2 px-4 rounded-md shadow-sm">취소</button>
                            <button type="submit" class="bg-[var(--dream-main)] hover:bg-opacity-80 text-white font-semibold py-2 px-4 rounded-md shadow-sm">
                                {{ isEditing ? "수정 완료" : "등록" }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {ref, reactive, computed, onMounted} from "vue";
import {useRoute} from "vue-router";
import PageHeader from "@/components/PageHeader.vue";
import LectureSubItemCard from "@/components/LectureSubItemCard.vue";
import {
    lectureItemsData,
    lectureSubItemsData,
    lectureSubItemFormSchema,
    userStatus,
    type LectureItem,
    type LectureSubItem,
    type LectureSubItemFormData,
    type LectureSubItemFormSchemaField,
} from "@/data/dummyData";

const route = useRoute();
const isStaff = ref(userStatus.isStaff);

const mainLecture = ref<LectureItem | null>(null);
const currentSubItems = ref<LectureSubItem[]>([]);

const showModal = ref(false);
const isEditing = ref(false);
const editingSubItemId = ref<number | null>(null);

const initialFormData: LectureSubItemFormData = {title: "", contents: ""};
const formData = reactive<LectureSubItemFormData>({...initialFormData});
const formSchema = ref<LectureSubItemFormSchemaField[]>(lectureSubItemFormSchema);
const previewImageUrl = ref<string | null>(null);
const uploadedImageFile = ref<File | null>(null);

onMounted(() => {
    const lectureId = parseInt(route.params.id as string, 10);
    mainLecture.value = lectureItemsData.find((l) => l.id === lectureId) || null;
    if (mainLecture.value) {
        currentSubItems.value = [...(lectureSubItemsData[lectureId] || [])];
    }
});

const openModal = (itemToEdit?: LectureSubItem) => {
    if (itemToEdit) {
        isEditing.value = true;
        editingSubItemId.value = itemToEdit.id;
        formData.title = itemToEdit.title;
        formData.contents = itemToEdit.contents;
        previewImageUrl.value = itemToEdit.image || null;
    } else {
        isEditing.value = false;
        editingSubItemId.value = null;
        Object.assign(formData, initialFormData);
        previewImageUrl.value = null;
    }
    uploadedImageFile.value = null;
    showModal.value = true;
};

const closeModal = () => {
    showModal.value = false;
    Object.assign(formData, initialFormData);
    previewImageUrl.value = null;
    uploadedImageFile.value = null;
    isEditing.value = false;
    editingSubItemId.value = null;
};

const handleSubmit = () => {
    if (!mainLecture.value) return;

    let imageToSave = previewImageUrl.value;
    if (uploadedImageFile.value) {
        imageToSave = previewImageUrl.value; // Placeholder for actual upload URL
    } else if (!previewImageUrl.value && isEditing.value) {
        // If image was removed during edit, set to undefined or a specific placeholder
        imageToSave = undefined;
    }

    if (isEditing.value && editingSubItemId.value !== null) {
        const index = currentSubItems.value.findIndex((item) => item.id === editingSubItemId.value);
        if (index !== -1) {
            currentSubItems.value[index] = {
                ...currentSubItems.value[index],
                ...formData,
                image: imageToSave === undefined ? currentSubItems.value[index].image : imageToSave || undefined,
            };
        }
    } else {
        const newId = currentSubItems.value.length > 0 ? Math.max(...currentSubItems.value.map((i) => i.id)) + 1001 : 1001; // Ensure unique ID
        currentSubItems.value.push({
            id: newId,
            mainLectureId: mainLecture.value.id,
            ...formData,
            image: imageToSave || undefined,
        });
    }
    // Update the main store if this were a real app
    if (mainLecture.value) lectureSubItemsData[mainLecture.value.id] = [...currentSubItems.value];
    closeModal();
};

const handleDelete = (itemId: number) => {
    if (window.confirm("정말로 이 항목을 삭제하시겠습니까?")) {
        currentSubItems.value = currentSubItems.value.filter((item) => item.id !== itemId);
        if (mainLecture.value) lectureSubItemsData[mainLecture.value.id] = [...currentSubItems.value];
    }
};

const handleImageUpload = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
        const file = target.files[0];
        uploadedImageFile.value = file;
        const reader = new FileReader();
        reader.onload = (e) => {
            previewImageUrl.value = e.target?.result as string;
        };
        reader.readAsDataURL(file);
        target.value = "";
    }
};

const removePreviewImage = () => {
    previewImageUrl.value = null;
    uploadedImageFile.value = null;
};
</script>

<style scoped>
/* 모달 트랜지션 */
.fixed.inset-0 {
    transition: opacity 0.3s ease-in-out;
}
.fixed.inset-0 > div {
    transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
}
</style>
