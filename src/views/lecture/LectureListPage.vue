<template>
    <div class="font-[var(--font-body)]">
        <PageHeader title="주요 강의" backgroundImageUrl="/Dreamseekers-FE/img/top_header/lecture.jpg" />

        <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 class="text-3xl font-bold text-center mb-8 text-[var(--dream-text)]">
                {{ searchQuery ? `"${searchQuery}" 검색 결과` : "전체 강의" }}
            </h1>

            <!-- Admin: Add Button & Search Form -->
            <div class="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                <form @submit.prevent="performSearch" class="w-full sm:w-auto flex-grow sm:max-w-md">
                    <div class="relative">
                        <input
                            type="text"
                            v-model="searchInput"
                            placeholder="강의명을 입력해주세요"
                            class="search-text w-full pl-4 pr-10 py-2 border border-[var(--dream-gray-dark)] rounded-md shadow-sm focus:ring-[var(--dream-main)] focus:border-[var(--dream-main)]"
                        />
                        <button type="submit" class="search-image absolute inset-y-0 right-0 flex items-center pr-3">
                            <img src="/img/icon/search_black_24dp.svg" alt="검색" class="h-5 w-5 text-gray-400" />
                        </button>
                    </div>
                </form>
                <button
                    v-if="isStaff"
                    @click="openModal()"
                    class="bg-[var(--dream-main)] hover:bg-opacity-80 text-white font-semibold py-2 px-6 rounded-md shadow-sm transition duration-150 ease-in-out w-full sm:w-auto"
                >
                    강의 추가
                </button>
            </div>

            <!-- Messages (e.g., no search results) -->
            <div v-if="searchQuery && filteredLectures.length === 0" class="text-center text-gray-500 py-8">
                <p>"{{ searchQuery }}"에 대한 검색 결과가 없습니다.</p>
            </div>

            <!-- Lectures List -->
            <ul v-else-if="filteredLectures.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                <LectureCard
                    v-for="lecture in filteredLectures"
                    :key="lecture.id"
                    :lecture="lecture"
                    :is-staff="isStaff"
                    :detail-url="`/lectures/${lecture.id}`"
                    @edit="openModal"
                    @delete="handleDelete"
                />
            </ul>
            <div v-else class="text-center text-gray-500 py-8">
                <p>표시할 강의가 없습니다.</p>
            </div>

            <!-- Empty decorative divider -->
            <div class="mt-12 border-t border-[var(--dream-gray-dark)] opacity-30"></div>

            <!-- Modal for Adding/Editing Lecture -->
            <div
                v-if="isStaff && showModal"
                class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-in-out"
                :class="{'opacity-100': showModal, 'opacity-0 pointer-events-none': !showModal}"
                @click.self="closeModal"
            >
                <div class="bg-white p-6 sm:p-8 rounded-lg shadow-2xl w-full max-w-lg transform transition-all duration-300 ease-in-out" :class="{'scale-100': showModal, 'scale-95': !showModal}">
                    <div class="flex justify-between items-center mb-6">
                        <h3 class="text-xl font-semibold text-[var(--dream-text)]">{{ isEditing ? "강의 정보 수정" : "새 강의 추가" }}</h3>
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
                                        v-model="formData[field.name as keyof LectureFormData]"
                                        class="mt-1 block w-full px-3 py-2 border border-[var(--dream-gray-dark)] rounded-md shadow-sm focus:outline-none focus:ring-[var(--dream-main)] focus:border-[var(--dream-main)] sm:text-sm"
                                    />
                                    <textarea
                                        v-else-if="field.type === 'textarea'"
                                        :id="field.id"
                                        v-model="formData[field.name as keyof LectureFormData]"
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
                                        <span class="mt-1 text-xs leading-normal">{{ uploadedImageFile ? uploadedImageFile.name : "이미지 선택" }}</span>
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
import {ref, reactive, computed} from "vue";
import PageHeader from "@/components/PageHeader.vue";
import LectureCard from "@/components/LectureCard.vue";
import {
    lectureItemsData,
    lectureFormSchema,
    userStatus, // dummyData.ts에 userStatus가 정의되어 있다고 가정
    type LectureItem,
    type LectureFormData,
    type LectureFormSchemaField,
} from "@/data/dummyData";

const isStaff = ref(userStatus.isStaff);
const allLectures = ref<LectureItem[]>([...lectureItemsData]);

const searchInput = ref("");
const searchQuery = ref(""); // 실제 검색에 사용된 쿼리

const filteredLectures = computed(() => {
    if (!searchQuery.value) {
        return allLectures.value;
    }
    return allLectures.value.filter((lecture) => lecture.title.toLowerCase().includes(searchQuery.value.toLowerCase()) || lecture.contents.toLowerCase().includes(searchQuery.value.toLowerCase()));
});

const performSearch = () => {
    searchQuery.value = searchInput.value;
};

const showModal = ref(false);
const isEditing = ref(false);
const editingLectureId = ref<number | null>(null);

const initialFormData: LectureFormData = {title: "", contents: ""};
const formData = reactive<LectureFormData>({...initialFormData});
const formSchema = ref<LectureFormSchemaField[]>(lectureFormSchema);
const previewImageUrl = ref<string | null>(null);
const uploadedImageFile = ref<File | null>(null);

const openModal = (lectureToEdit?: LectureItem) => {
    if (lectureToEdit && typeof lectureToEdit.id === "number") {
        // Ensure lectureToEdit is a LectureItem
        isEditing.value = true;
        editingLectureId.value = lectureToEdit.id;
        formData.title = lectureToEdit.title;
        formData.contents = lectureToEdit.contents;
        previewImageUrl.value = lectureToEdit.image || null;
    } else {
        isEditing.value = false;
        editingLectureId.value = null;
        Object.assign(formData, initialFormData);
        previewImageUrl.value = null;
    }
    uploadedImageFile.value = null;
    showModal.value = true;
};

const closeModal = () => {
    showModal.value = false;
    // Reset form states
    Object.assign(formData, initialFormData);
    previewImageUrl.value = null;
    uploadedImageFile.value = null;
    isEditing.value = false;
    editingLectureId.value = null;
};

const handleSubmit = () => {
    let imageToSave = previewImageUrl.value;
    if (uploadedImageFile.value) {
        // 실제 앱에서는 서버 업로드 후 URL 반환받아 사용
        imageToSave = previewImageUrl.value; // 현재는 미리보기 URL 임시 사용
    } else if (!previewImageUrl.value && isEditing.value) {
        imageToSave = "/img/dummy/placeholder-lecture.png"; // 이미지 제거 시 기본 이미지
    }

    if (isEditing.value && editingLectureId.value !== null) {
        const index = allLectures.value.findIndex((l) => l.id === editingLectureId.value);
        if (index !== -1) {
            allLectures.value[index] = {
                ...allLectures.value[index],
                ...formData,
                image: imageToSave || allLectures.value[index].image,
            };
        }
    } else {
        const newId = allLectures.value.length > 0 ? Math.max(...allLectures.value.map((l) => l.id)) + 1 : 1;
        allLectures.value.push({
            id: newId,
            ...formData,
            image: imageToSave || "/img/dummy/placeholder-lecture.png",
        });
    }
    closeModal();
};

const handleDelete = (lectureId: number) => {
    if (window.confirm("정말로 이 강의 정보를 삭제하시겠습니까?")) {
        allLectures.value = allLectures.value.filter((l) => l.id !== lectureId);
    }
};

// InstructorsPage.vue의 handleImageUpload, removePreviewImage 로직을 여기에 복사합니다.
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
