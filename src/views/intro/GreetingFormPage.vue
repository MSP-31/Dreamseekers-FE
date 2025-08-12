<template>
    <PageLayout title="교육원 소개" backgroundImageUrl="/img/top_header/intro.jpg">
        <h1 class="text-3xl font-bold text-center mb-8 text-[var(--dream-text)]">인사말 수정</h1>

        <form @submit.prevent="handleSubmit" class="max-w-3xl mx-auto space-y-6" v-if="isAdmin">
            <TiptapEditor v-model="formData.contents" />

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">대표 이미지</label>
                <ImageUploader
                    v-model="imageFile"
                    inputId="intro-image-uploader"
                    buttonText="대표 이미지 선택"
                    :maxSizeMB="1"
                    :maxWidthOrHeight="1024"
                    :initialPreviewUrl="initialImagePreviewUrl"
                    @error="handleImageUploaderError"
                />
            </div>

            <div class="pt-5">
                <div class="flex justify-end space-x-3">
                    <router-link to="/intro/greeting" class="px-4 py-2 rounded-md transition-colors duration-200 text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300"> 취소 </router-link>
                    <button type="submit" class="px-4 py-2 rounded-md transition-colors duration-200 text-sm font-medium btn-base bg-[var(--dream-main)] hover:bg-opacity-80 text-white">등록</button>
                </div>
            </div>
        </form>

        <div v-else class="text-center py-16 text-gray-600">
            <p>이 페이지는 관리자만 접근할 수 있습니다.</p>
            <router-link to="/" class="mt-4 inline-block text-[var(--dream-main)] hover:underline">홈으로 돌아가기</router-link>
        </div>
    </PageLayout>
</template>

<script setup lang="ts">
import {ref, reactive, onMounted, computed} from "vue";
import {useRouter} from "vue-router";
import {useAuthStore} from "@/stores/auth";
import PageLayout from "@/components/layout/PageLayout.vue";
import TiptapEditor from "@/components/layout/TiptapEditor.vue";
import ImageUploader from "@/components/layout/ImageUploader.vue";
import apiClient from "@/api";

interface IntroData {
    id?: number;
    title: string;
    contents: string;
    image: string;
}

const router = useRouter();
const authStore = useAuthStore();
const isAdmin = authStore.isAdmin;

const formData = reactive<IntroData>({
    title: "",
    contents: "",
    image: "",
});

const imageFile = ref<File | null>(null);
// ImageUploader의 initialPreviewUrl에 전달할 값
const initialImagePreviewUrl = computed(() => {
    // 새로운 파일이 있으면 새로운 파일의 미리보기를, 없으면 기존 이미지 URL을 사용
    return imageFile.value ? URL.createObjectURL(imageFile.value) : formData.image;
});

const loadGreetingData = async () => {
    try {
        const response = await apiClient.get<IntroData>("intro/greeting");
        const postToEdit = response.data;
        formData.title = postToEdit.title;
        formData.contents = postToEdit.contents || "";
        formData.image = postToEdit.image;
    } catch (error: any) {
        console.error("데이터 로딩 오류:", error);
        alert(error.response?.data?.detail || "데이터를 불러오는 데 실패했습니다.");
    }
};

onMounted(() => {
    loadGreetingData();
});

const handleSubmit = async () => {
    if (!isAdmin) {
        alert("수정 권한이 없습니다.");
        return;
    }

    const apiFormData = new FormData();
    apiFormData.append("title", formData.title);
    apiFormData.append("contents", formData.contents);

    // ImageUploader에서 받아온 imageFile이 존재하면 FormData에 추가
    if (imageFile.value) {
        apiFormData.append("image", imageFile.value);
    }
    // ImageUploader에서 기존 이미지를 제거했다면 (imageFile.value가 null),
    // 서버에 image 필드를 빈 값으로 보내 기존 이미지를 삭제하도록 유도
    else if (!formData.image && imageFile.value === null) {
        apiFormData.append("image", "");
    }
    // 만약 imageFile.value가 null이고 formData.image가 있다면,
    // 이 경우 image 필드를 FormData에 추가하지 않아 서버가 기존 이미지를 유지하게 함.

    try {
        await apiClient.patch("/intro/greeting", apiFormData, {
            headers: {"Content-Type": "multipart/form-data"},
        });
        alert("인사말이 성공적으로 수정되었습니다.");
        router.push("/intro/greeting/");
    } catch (error: any) {
        console.error("API 요청 오류:", error);
        const errorMessage = error.response?.data?.detail || error.response?.data?.message || "요청 처리 중 오류가 발생했습니다.";
        alert(errorMessage);
    }
};

const handleImageUploaderError = (error: string | Error) => {
    console.error("ImageUploader 오류:", error);
    alert(`이미지 업로드 중 오류가 발생했습니다: ${error}`);
};
</script>
