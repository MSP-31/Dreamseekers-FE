<template>
    <div class="font-[var(--font-body)]">
        <PageHeader title="소통 마당" backgroundImageUrl="/img/top_header/forum.jpg" />

        <div class="main-content">
            <h1 class="text-3xl font-bold text-center mb-8 text-[var(--dream-text)]">
                {{ isEditMode ? "공지사항 수정" : "공지사항 작성" }}
            </h1>

            <form @submit.prevent="handleSubmit" class="max-w-3xl mx-auto space-y-6" v-if="isAdmin">
                <template v-for="field in formSchema" :key="field.id">
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
                        <div v-if="newImagePreviews.length > 0" class="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            <div v-for="(preview, index) in newImagePreviews" :key="`new-img-${index}`" class="relative">
                                <img :src="preview.url" alt="New image preview" class="w-full h-32 object-cover rounded-md shadow" />
                                <button @click="removeNewImage(index)" type="button" class="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs leading-none">&times;</button>
                            </div>
                        </div>
                        <div v-if="isEditMode && existingImages.length > 0" class="mt-4 pt-4 border-t">
                            <p class="text-xs text-gray-600 mb-2">기존 이미지 (클릭하여 삭제 표시/해제)</p>
                            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                <div v-for="image in existingImages" :key="image.id" class="relative cursor-pointer" @click="toggleDeleteExistingImage(image.id)">
                                    <img
                                        :src="image.image"
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

                    <div v-if="field.type === 'file'">
                        <label class="block text-sm font-medium text-gray-700 mb-1">{{ field.label }}</label>
                        <input
                            type="file"
                            :id="field.id"
                            multiple
                            @change="handleNewFileSelection"
                            class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[var(--dream-blue)] file:text-white hover:file:bg-opacity-80 cursor-pointer"
                        />
                        <ul v-if="newFiles.length > 0" class="mt-4 list-disc list-inside text-sm space-y-1">
                            <li v-for="(file, index) in newFiles" :key="`new-file-${index}`" class="flex justify-between items-center">
                                <span>{{ file.name }} ({{ (file.size / 1024).toFixed(1) }} KB)</span>
                                <button @click="removeNewFile(index)" type="button" class="text-red-500 hover:text-red-700 text-xs">&times; 제거</button>
                            </li>
                        </ul>
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

                    <div v-if="field.type === 'checkbox' && isAdmin" class="flex items-center">
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
            <div v-else class="text-center py-16 text-gray-600">
                <p>이 페이지는 관리자만 접근할 수 있습니다.</p>
                <router-link to="/" class="mt-4 inline-block text-[var(--dream-main)] hover:underline">홈으로 돌아가기</router-link>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {ref, reactive, computed, onMounted} from "vue";
import {useRoute, useRouter} from "vue-router";
import PageHeader from "@/components/layout/PageHeader.vue";
// NoticeFormData, NoticeFormField는 그대로 유지하되, NoticeItem의 정의는 API 응답에 맞게 수정
import {type NoticeFormData, type NoticeFormField, type NoticePost} from "@/types/pagination";
import {useAuthStore} from "@/stores/auth";
import apiClient from "@/api"; // apiClient 임포트

// API 응답에 맞춰 NoticePost (NoticeItem) 타입 업데이트
// 이미지와 파일 배열의 각 객체에 'image', 'file' 필드와 'id'가 있다고 가정
interface NoticePostWithDetails extends NoticePost {
    image_details?: {id: number; image: string; alt?: string}[];
    file_details?: {id: number; file: string; name: string}[];
}

interface ExistingFileItem {
    id: number;
    file: string; // API에서 파일 URL이 'file' 필드로 온다고 가정
    name: string;
    toDelete: boolean;
}
interface ExistingImageItem {
    id: number;
    image: string; // API에서 이미지 URL이 'image' 필드로 온다고 가정
    alt?: string;
    toDelete: boolean;
}
interface NewImagePreview {
    file: File;
    url: string; // FileReader로 생성된 blob URL
}

const route = useRoute();
const router = useRouter();

const authStore = useAuthStore();
const isAdmin = authStore.isAdmin; // isAdmin은 직접 사용 (ref 아님)

const noticeId = ref<number | null>(null);
const isEditMode = computed(() => noticeId.value !== null);

const initialFormData: NoticeFormData = {
    title: "",
    contents: "",
    is_important: false,
};

const formData = reactive<NoticeFormData>({...initialFormData});
// formSchema는 더미 데이터에서 가져왔지만, 이 컴포넌트에서는 필드 렌더링에만 사용
// 실제 API 요청 데이터는 formData와 new/existing files/images로 구성
const formSchema = ref<NoticeFormField[]>([
    {id: "title", name: "title", label: "제목", type: "text"},
    {id: "contents", name: "contents", label: "내용", type: "textarea"},
    {id: "images", name: "images", label: "이미지 첨부", type: "image"},
    {id: "files", name: "files", label: "파일 첨부", type: "file"},
    {id: "is_important", name: "is_important", label: "중요 공지", type: "checkbox"},
]);

const newImages = ref<File[]>([]);
const newImagePreviews = ref<NewImagePreview[]>([]);
const existingImages = ref<ExistingImageItem[]>([]);

const newFiles = ref<File[]>([]);
const existingFiles = ref<ExistingFileItem[]>([]);

// 공지사항 데이터 불러오기 (수정 모드일 때)
const loadNoticeData = async (id: number) => {
    // pk 대신 id 사용
    try {
        const response = await apiClient.get<NoticePostWithDetails>(`/notice/${id}`); // API에서 공지사항 상세 데이터 가져오기
        const postToEdit = response.data;

        formData.title = postToEdit.title;
        formData.contents = postToEdit.contents || "";
        formData.is_important = postToEdit.is_important || false;

        // 기존 이미지와 파일 목록을 상태에 저장 (API 응답 필드명에 맞게 image_details, file_details 사용)
        existingImages.value = (postToEdit.image_details || []).map((img) => ({
            id: img.id,
            image: img.image, // URL 필드명
            alt: img.alt,
            toDelete: false,
        }));
        existingFiles.value = (postToEdit.file_details || []).map((file) => ({
            id: file.id,
            file: file.file, // URL 필드명
            name: file.name,
            toDelete: false,
        }));
    } catch (error: any) {
        console.error("공지사항 데이터 로딩 오류:", error);
        alert(error.response?.data?.detail || "공지사항을 불러오는 데 실패했습니다.");
        router.push("/notice"); // 오류 발생 시 목록 페이지로 이동
    }
};

onMounted(() => {
    // 라우트 파라미터가 'pk' 대신 'id'로 넘어올 것이라고 가정
    if (route.params.id) {
        noticeId.value = parseInt(route.params.id as string, 10);
        loadNoticeData(noticeId.value);
    }
});

// 새 이미지 선택 핸들러
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
        target.value = ""; // 파일 인풋 리셋
    }
};

// 새 이미지 제거
const removeNewImage = (index: number) => {
    newImages.value.splice(index, 1);
    newImagePreviews.value.splice(index, 1);
};

// 기존 이미지 삭제 토글
const toggleDeleteExistingImage = (id: number) => {
    const image = existingImages.value.find((img) => img.id === id);
    if (image) image.toDelete = !image.toDelete;
};

// 새 파일 선택 핸들러
const handleNewFileSelection = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files) {
        newFiles.value.push(...Array.from(target.files));
        target.value = ""; // 파일 인풋 리셋
    }
};

// 새 파일 제거
const removeNewFile = (index: number) => {
    newFiles.value.splice(index, 1);
};

// 기존 파일 삭제 토글
const toggleDeleteExistingFile = (id: number) => {
    const file = existingFiles.value.find((f) => f.id === id);
    if (file) file.toDelete = !file.toDelete;
};

// 폼 제출 핸들러 (API 호출)
const handleSubmit = async () => {
    console.log("Submitting form data:", formData.title, formData.contents);
    if (!isAdmin) {
        // isAdmin은 ref가 아니므로 .value 없이 직접 사용
        alert("공지사항 작성/수정 권한이 없습니다.");
        return;
    }

    const apiFormData = new FormData();
    apiFormData.append("title", formData.title);
    apiFormData.append("contents", formData.contents);
    // is_important는 'true' 또는 'false' 문자열로 변환하여 전송
    apiFormData.append("is_important", formData.is_important ? "true" : "false");

    // 새로운 이미지 파일 추가
    newImages.value.forEach((file) => {
        apiFormData.append("new_images", file); // 백엔드 필드명에 맞게 "new_images" 사용
    });
    // 새로운 파일 추가
    newFiles.value.forEach((file) => {
        apiFormData.append("new_files", file); // 백엔드 필드명에 맞게 "new_files" 사용
    });

    // 삭제할 기존 이미지 ID 추가
    const imagesToDelete = existingImages.value.filter((img) => img.toDelete).map((img) => img.id);
    imagesToDelete.forEach((id) => {
        apiFormData.append("delete_images", String(id)); // 백엔드에서 배열로 받도록 `delete_images` (복수형) 사용
    });

    // 삭제할 기존 파일 ID 추가
    const filesToDelete = existingFiles.value.filter((file) => file.toDelete).map((file) => file.id);
    filesToDelete.forEach((id) => {
        apiFormData.append("delete_files", String(id)); // 백엔드에서 배열로 받도록 `delete_files` (복수형) 사용
    });

    try {
        if (isEditMode.value && noticeId.value !== null) {
            // 공지사항 수정 (PATCH 또는 PUT 요청, 부분 수정은 PATCH가 더 적합)
            // Django REST Framework는 PUT/PATCH 모두 multipart/form-data를 지원합니다.
            await apiClient.patch(`/notice/${noticeId.value}`, apiFormData, {
                // PATCH 사용
                headers: {"Content-Type": "multipart/form-data"},
            });
            alert("공지사항이 성공적으로 수정되었습니다.");
        } else {
            // 새 공지사항 생성 (POST 요청)
            await apiClient.post("/notice/", apiFormData, {
                headers: {"Content-Type": "multipart/form-data"},
            });
            alert("공지사항이 성공적으로 등록되었습니다.");
        }
        router.push("/notice"); // 성공 후 목록 페이지로 이동
    } catch (error: any) {
        console.error("API 요청 오류:", error);
        const errorMessage = error.response?.data?.detail || error.response?.data?.message || JSON.stringify(error.response?.data) || "요청 처리 중 오류가 발생했습니다.";
        alert(errorMessage);
    }
};
</script>
