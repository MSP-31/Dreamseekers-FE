<template>
    <div class="font-[var(--font-body)]">
        <PageHeader title="소통 마당" backgroundImageUrl="/Dreamseekers-FE/img/top_header/forum.jpg" />

        <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 class="text-3xl font-bold text-center mb-8 text-[var(--dream-text)]">
                {{ isEditMode ? "공지사항 수정" : "공지사항 작성" }}
            </h1>

            <form @submit.prevent="handleSubmit" class="max-w-3xl mx-auto space-y-6">
                <template v-for="field in formSchema" :key="field.id">
                    <!-- Title and Contents Fields -->
                    <div v-if="field.type === 'text' || field.type === 'textarea'">
                        <label :for="field.id" class="block text-sm font-medium text-gray-700 mb-1">{{ field.label }}</label>
                        <input
                            v-if="field.type === 'text'"
                            :type="field.type"
                            :id="field.id"
                            v-model="formData[field.name as keyof Pick<NoticeFormData, 'title' | 'contents'>]"
                            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[var(--dream-main)] focus:border-[var(--dream-main)] sm:text-sm"
                        />
                        <textarea
                            v-else-if="field.type === 'textarea'"
                            :id="field.id"
                            v-model="formData[field.name as keyof Pick<NoticeFormData, 'title' | 'contents'>]"
                            rows="10"
                            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[var(--dream-main)] focus:border-[var(--dream-main)] sm:text-sm resize-none"
                        ></textarea>
                    </div>

                    <!-- Image Upload Field -->
                    <div v-if="field.type === 'image'">
                        <label class="block text-sm font-medium text-gray-700 mb-1">{{ field.label }}</label>
                        <input
                            type="file"
                            :id="field.id"
                            multiple
                            accept="image/*"
                            @change="handleNewImageSelection"
                            class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[var(--dream-blue)] file:text-white hover:file:bg-opacity-80 cursor-pointer"
                        />
                        <!-- New Image Previews -->
                        <div v-if="newImagePreviews.length > 0" class="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            <div v-for="(preview, index) in newImagePreviews" :key="`new-img-${index}`" class="relative">
                                <img :src="preview.url" alt="New image preview" class="w-full h-32 object-cover rounded-md shadow" />
                                <button @click="removeNewImage(index)" type="button" class="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs leading-none">&times;</button>
                            </div>
                        </div>
                        <!-- Existing Image Previews (Edit Mode) -->
                        <div v-if="isEditMode && existingImages.length > 0" class="mt-4 pt-4 border-t">
                            <p class="text-xs text-gray-600 mb-2">기존 이미지 (클릭하여 삭제 표시/해제)</p>
                            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                <div v-for="image in existingImages" :key="image.id" class="relative cursor-pointer" @click="toggleDeleteExistingImage(image.id)">
                                    <img
                                        :src="image.url"
                                        :alt="image.alt || 'Existing image'"
                                        class="w-full h-32 object-cover rounded-md shadow"
                                        :class="{'opacity-50 ring-2 ring-red-500': image.toDelete}"
                                    />
                                    <div v-if="image.toDelete" class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-md">
                                        <span class="text-white text-xs font-bold">삭제 예정</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- File Upload Field -->
                    <div v-if="field.type === 'file'">
                        <label class="block text-sm font-medium text-gray-700 mb-1">{{ field.label }}</label>
                        <input
                            type="file"
                            :id="field.id"
                            multiple
                            @change="handleNewFileSelection"
                            class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[var(--dream-blue)] file:text-white hover:file:bg-opacity-80 cursor-pointer"
                        />
                        <!-- New Files List -->
                        <ul v-if="newFiles.length > 0" class="mt-4 list-disc list-inside text-sm space-y-1">
                            <li v-for="(file, index) in newFiles" :key="`new-file-${index}`" class="flex justify-between items-center">
                                <span>{{ file.name }} ({{ (file.size / 1024).toFixed(1) }} KB)</span>
                                <button @click="removeNewFile(index)" type="button" class="text-red-500 hover:text-red-700 text-xs">&times; 제거</button>
                            </li>
                        </ul>
                        <!-- Existing Files List (Edit Mode) -->
                        <div v-if="isEditMode && existingFiles.length > 0" class="mt-4 pt-4 border-t">
                            <p class="text-xs text-gray-600 mb-2">기존 파일 (클릭하여 삭제 표시/해제)</p>
                            <ul class="text-sm space-y-1">
                                <li
                                    v-for="file in existingFiles"
                                    :key="file.id"
                                    @click="toggleDeleteExistingFile(file.id)"
                                    class="flex justify-between items-center cursor-pointer p-1 rounded hover:bg-gray-100"
                                    :class="{'line-through text-red-500 bg-red-50': file.toDelete}"
                                >
                                    <span>{{ file.name }}</span>
                                    <span v-if="file.toDelete" class="text-xs font-bold">(삭제 예정)</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <!-- Important Checkbox -->
                    <div v-if="field.type === 'checkbox' && isStaff" class="flex items-center">
                        <input
                            :id="field.id"
                            type="checkbox"
                            v-model="formData[field.name as 'is_important']"
                            class="h-4 w-4 text-[var(--dream-main)] border-gray-300 rounded focus:ring-[var(--dream-main)]"
                        />
                        <label :for="field.id" class="ml-2 block text-sm text-gray-900">{{ field.label }}</label>
                    </div>
                </template>

                <div class="pt-5">
                    <div class="flex justify-end space-x-3">
                        <router-link to="/notice" class="btn-base bg-gray-200 hover:bg-gray-300 text-gray-700"> 취소 </router-link>
                        <button type="submit" class="btn-base bg-[var(--dream-main)] hover:bg-opacity-80 text-white">
                            {{ isEditMode ? "수정 완료" : "등록" }}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import {ref, reactive, computed, onMounted} from "vue";
import {useRoute, useRouter} from "vue-router";
import PageHeader from "@/components/PageHeader.vue";
import {userStatus, dummyImportantNotices, dummyNoticePosts, type NoticeFormData} from "@/data/dummyData";

interface ExistingFileItem {
    id: number;
    url: string;
    name: string;
    toDelete: boolean;
}
interface ExistingImageItem {
    id: number;
    url: string;
    alt?: string;
    toDelete: boolean;
}
interface NewImagePreview {
    file: File;
    url: string;
}

const route = useRoute();
const router = useRouter();

const isStaff = ref(userStatus.isStaff);

const noticeId = ref<number | null>(null);
const isEditMode = computed(() => noticeId.value !== null);

const initialFormData: NoticeFormData = {
    title: "",
    contents: "",
    is_important: false,
};
const formData = reactive<NoticeFormData>({...initialFormData});

const newImages = ref<File[]>([]);
const newImagePreviews = ref<NewImagePreview[]>([]);
const existingImages = ref<ExistingImageItem[]>([]);

const newFiles = ref<File[]>([]);
const existingFiles = ref<ExistingFileItem[]>([]);

const loadNoticeData = (pk: number) => {
    const postToEdit = dummyImportantNotices.find((p) => p.pk === pk) || dummyNoticePosts.find((p) => p.pk === pk);
    if (postToEdit) {
        formData.title = postToEdit.title;
        formData.contents = postToEdit.contents || "";
        formData.is_important = postToEdit.is_important || false;
        existingImages.value = (postToEdit.images || []).map((img) => ({...img, toDelete: false}));
        existingFiles.value = (postToEdit.files || []).map((file) => ({...file, toDelete: false}));
    } else {
        console.error("Notice not found for editing");
        router.push("/notice"); // Or show an error message
    }
};

onMounted(() => {
    if (route.params.pk) {
        noticeId.value = parseInt(route.params.pk as string, 10);
        loadNoticeData(noticeId.value);
    }
});

const handleNewImageSelection = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files) {
        Array.from(target.files).forEach((file) => {
            newImages.value.push(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                newImagePreviews.value.push({file, url: e.target?.result as string});
            };
            reader.readAsDataURL(file);
        });
        target.value = ""; // Reset file input
    }
};

const removeNewImage = (index: number) => {
    newImages.value.splice(index, 1);
    newImagePreviews.value.splice(index, 1);
};

const toggleDeleteExistingImage = (id: number) => {
    const image = existingImages.value.find((img) => img.id === id);
    if (image) image.toDelete = !image.toDelete;
};

const handleNewFileSelection = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files) {
        newFiles.value.push(...Array.from(target.files));
        target.value = ""; // Reset file input
    }
};

const removeNewFile = (index: number) => {
    newFiles.value.splice(index, 1);
};

const toggleDeleteExistingFile = (id: number) => {
    const file = existingFiles.value.find((f) => f.id === id);
    if (file) file.toDelete = !file.toDelete;
};

const handleSubmit = () => {
    const imagesToDelete = existingImages.value.filter((img) => img.toDelete).map((img) => img.id);
    const filesToDelete = existingFiles.value.filter((file) => file.toDelete).map((file) => file.id);

    // FormData 객체 생성 (실제 API 호출 시 사용)
    const apiFormData = new FormData();
    apiFormData.append("title", formData.title);
    apiFormData.append("contents", formData.contents);
    apiFormData.append("is_important", String(formData.is_important));

    newImages.value.forEach((file) => apiFormData.append("new_images", file));
    newFiles.value.forEach((file) => apiFormData.append("new_files", file));

    imagesToDelete.forEach((id) => apiFormData.append("delete_images", String(id)));
    filesToDelete.forEach((id) => apiFormData.append("delete_files", String(id)));

    console.log("Form Data to Submit:", {
        ...formData,
        newImages: newImages.value.map((f) => f.name),
        newFiles: newFiles.value.map((f) => f.name),
        deleteImageIds: imagesToDelete,
        deleteFileIds: filesToDelete,
    });
    // console.log('API FormData:', Object.fromEntries(apiFormData.entries())); // FormData 내용 확인

    if (isEditMode.value) {
        console.log(`Updating notice with ID: ${noticeId.value}`);
        // 실제 API 호출: PUT /api/notices/${noticeId.value} with apiFormData
        alert("공지사항이 수정되었습니다.");
    } else {
        console.log("Creating new notice");
        // 실제 API 호출: POST /api/notices with apiFormData
        alert("공지사항이 등록되었습니다.");
    }
    router.push("/notice"); // 성공 후 목록 페이지로 이동
};
</script>
