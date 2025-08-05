<template>
    <div>
        <input type="file" :id="inputId" accept="image/*" @change="handleFileChange" class="hidden" />

        <label
            :for="inputId"
            class="w-full flex flex-col items-center px-4 py-3 bg-white text-blue-600 rounded-lg shadow-sm border border-blue-300 cursor-pointer hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200 ease-in-out text-sm font-medium"
            :class="{'opacity-50 cursor-not-allowed': isLoading}"
        >
            <svg class="w-6 h-6 mb-1" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
            </svg>
            <span class="leading-normal">{{ buttonText || "이미지 선택" }}</span>
        </label>

        <div v-if="isLoading" class="mt-4 flex items-center justify-center p-4">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p class="ml-3 text-gray-600">이미지 압축 중...</p>
        </div>

        <div v-else-if="localPreviewImage" class="mt-4 p-2 border border-gray-300 rounded-md max-w-xs mx-auto relative overflow-hidden">
            <img :src="localPreviewImage" alt="이미지 미리보기" class="block w-full h-auto object-contain rounded max-h-96" />
            <button
                type="button"
                @click="removeImage"
                class="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs leading-none w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors duration-200 ease-in-out font-bold"
                title="이미지 제거"
            >
                &times;
            </button>
        </div>

        <p v-if="errorMessage" class="text-red-600 text-sm mt-2">{{ errorMessage }}</p>
    </div>
</template>

<script setup lang="ts">
import {ref, watch, defineProps, defineEmits} from "vue";
import imageCompression from "browser-image-compression";

const props = defineProps<{
    modelValue: File | null; // v-model을 통해 부모와 파일 객체를 주고받음
    inputId: string; // input 태그의 id (label 연결용)
    buttonText?: string; // 버튼 텍스트
    maxSizeMB?: number; // 최대 파일 크기 (MB)
    maxWidthOrHeight?: number; // 최대 너비 또는 높이 (px)
    initialPreviewUrl?: string | null; // 초기 미리보기 URL (예: 기존 이미지)
}>();

const emit = defineEmits(["update:modelValue", "image-compressed", "error"]);

const localPreviewImage = ref<string | null>(props.initialPreviewUrl || null);
const errorMessage = ref<string | null>(null);
const isLoading = ref<boolean>(false); // 🚨 로딩 상태 추가

// initialPreviewUrl이 변경될 때 미리보기 업데이트
watch(
    () => props.initialPreviewUrl,
    (newUrl) => {
        localPreviewImage.value = newUrl || null;
    }
);

const handleFileChange = async (event: Event) => {
    errorMessage.value = null;
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
        const imageFile = input.files[0];

        if (!imageFile.type.startsWith("image/")) {
            errorMessage.value = "이미지 파일만 업로드할 수 있습니다.";
            emit("error", "invalid_file_type");
            input.value = "";
            return;
        }

        const options = {
            maxSizeMB: props.maxSizeMB || 1, // 기본 1MB
            // maxWidthOrHeight: props.maxWidthOrHeight || 1200, // 기본 800px
            useWebWorker: true,
            initialQuality: 1,
            fileType: "image/webp", // 기본 JPEG, 필요 시 'image/webp'로 변경 가능
        };

        try {
            isLoading.value = true; // 🚨 압축 시작 시 로딩 상태 true
            const compressedFile = await imageCompression(imageFile, options);

            // 압축된 파일의 이름을 fileType에 맞게 변경
            let newFileName = compressedFile.name;
            const dotIndex = newFileName.lastIndexOf(".");
            if (dotIndex !== -1) {
                newFileName = newFileName.substring(0, dotIndex); // 확장자 제거
            }

            let targetExtension = "";
            if (options.fileType === "image/jpeg") {
                targetExtension = ".jpeg";
            } else if (options.fileType === "image/webp") {
                targetExtension = ".webp";
            } else if (options.fileType === "image/png") {
                targetExtension = ".png";
            }
            // 다른 파일 타입도 필요에 따라 추가

            // 새로운 File 객체 생성: 이름만 변경
            const finalFile = new File([compressedFile], newFileName + targetExtension, {type: options.fileType, lastModified: compressedFile.lastModified});

            // v-model 업데이트
            emit("update:modelValue", finalFile); // 변경된 이름의 File 객체 전달

            localPreviewImage.value = URL.createObjectURL(finalFile);
        } catch (error: any) {
            errorMessage.value = "이미지 최적화 중 오류가 발생했습니다.";
            console.error("Image compression error:", error);
            emit("error", error);
        } finally {
            isLoading.value = false; // 🚨 압축 완료/오류 시 로딩 상태 false
            input.value = ""; // input file을 초기화하여 같은 파일 재선택 시 change 이벤트 발생시키기
        }
    }
};

const removeImage = () => {
    localPreviewImage.value = null;
    emit("update:modelValue", null); // 부모 컴포넌트에 파일 없음을 알림
};
</script>
