<template>
    <div
        v-if="show"
        class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-in-out"
        :class="{'opacity-100': show, 'opacity-0 pointer-events-none': !show}"
        @click.self="closeModal"
    >
        <div class="bg-white p-6 sm:p-8 rounded-lg shadow-2xl w-full max-w-2xl transform transition-all duration-300 ease-in-out" :class="{'scale-100': show, 'scale-95': !show}">
            <div class="flex justify-between items-center mb-6">
                <h3 class="text-xl font-semibold text-gray-800">{{ modalTitle }}</h3>
                <button @click="closeModal" class="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>
            <form @submit.prevent="handleSubmit">
                <table class="w-full">
                    <tbody>
                        <template v-for="field in formFields" :key="field.name">
                            <tr v-if="field.type === 'image'">
                                <td colspan="2" class="py-3">
                                    <label :for="field.id" class="block text-sm font-medium text-gray-700 mb-1">{{ field.label }}</label>
                                    <label
                                        class="w-full flex flex-col items-center px-4 py-3 bg-white text-blue-600 rounded-lg shadow border border-blue-300 cursor-pointer hover:bg-blue-50 hover:text-blue-700 transition-colors"
                                    >
                                        <svg class="w-6 h-6" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                            <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                                        </svg>
                                        <span class="mt-1 text-sm leading-normal">이미지 선택</span>
                                        <input :id="field.id" :name="field.name" type="file" accept="image/*" class="hidden" @change="handleImageUpload($event, field.name)" />
                                    </label>
                                </td>
                            </tr>
                            <tr v-if="field.type === 'image' && (previewImages[field.name] || initialData[field.name])">
                                <td colspan="2" class="py-3">
                                    <p class="text-sm font-medium text-gray-700 mb-1">미리보기</p>
                                    <div class="border border-gray-300 p-2 rounded-md w-full max-w-md h-48 mx-auto flex items-center justify-center overflow-hidden relative">
                                        <img :src="previewImages[field.name] || initialData[field.name]" alt="이미지 미리보기" class="max-h-full max-w-full object-contain rounded" />
                                        <button
                                            type="button"
                                            @click="removePreviewImage(field.name)"
                                            class="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs leading-none hover:bg-red-600"
                                            title="이미지 제거"
                                        >
                                            X
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr v-if="field.type !== 'image'">
                                <th class="text-left py-3 pr-4 align-top">
                                    <label :for="field.id" class="block text-sm font-medium text-gray-700">{{ field.label }}</label>
                                </th>
                                <td class="py-3 w-full">
                                    <input
                                        v-if="field.type === 'text'"
                                        :type="field.type"
                                        :id="field.id"
                                        :name="field.name"
                                        v-model="formData[field.name]"
                                        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                    <textarea
                                        v-else-if="field.type === 'textarea'"
                                        :id="field.id"
                                        :name="field.name"
                                        v-model="formData[field.name]"
                                        rows="5"
                                        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm resize-none"
                                    ></textarea>
                                </td>
                            </tr>
                        </template>
                    </tbody>
                </table>
                <div class="text-right">
                    <button type="button" @click="closeModal" class="mr-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-md shadow-sm transition duration-150 ease-in-out">
                        취소
                    </button>
                    <button type="submit" class="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md shadow-sm transition duration-150 ease-in-out">
                        {{ submitButtonText }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import {reactive, watch} from "vue";
import type {FormField} from "@/types/common";

// --- Props 정의 ---
const props = defineProps({
    // 모달 표시 여부 (v-model처럼 사용 가능)
    show: {
        type: Boolean,
        default: false,
    },
    // 모달 제목 (예: "인사말 수정", "공지사항 작성")
    modalTitle: {
        type: String,
        default: "수정",
    },
    // 폼 필드 정의 (필드명, 라벨, 타입 등)
    formFields: {
        type: Array as () => FormField[],
        required: true,
    },
    // 폼에 초기화할 데이터 (수정 모드일 경우 기존 데이터)
    initialData: {
        type: Object as () => Record<string, any>,
        default: () => ({}),
    },
    // 제출 버튼 텍스트
    submitButtonText: {
        type: String,
        default: "등록",
    },
});

// --- Emits 정의 ---
// 모달 닫기 이벤트
const emit = defineEmits(["update:show", "submit"]);

// --- Internal State ---
const formData = reactive<Record<string, any>>({}); // 폼 입력 값
const uploadedFiles = reactive<Record<string, File | null>>({}); // 업로드된 파일 객체 (필드명 기준)
const previewImages = reactive<Record<string, string | null>>({}); // 이미지 미리보기 URL (필드명 기준)

// --- Watcher: `show` prop이 변경될 때 폼 데이터 초기화 및 미리보기 설정 ---
watch(
    () => props.show,
    (newVal) => {
        if (newVal) {
            // 모달이 열릴 때만 초기화
            initializeFormData();
        }
    },
    {immediate: true} // 컴포넌트 마운트 시에도 한 번 실행
);

// --- Methods ---

// 폼 데이터 초기화
const initializeFormData = () => {
    // formData 초기화 (기존 값 유지)
    for (const key in formData) {
        delete formData[key];
    }
    // uploadedFiles 및 previewImages 초기화
    for (const key in uploadedFiles) {
        delete uploadedFiles[key];
    }
    for (const key in previewImages) {
        delete previewImages[key];
    }

    props.formFields.forEach((field) => {
        if (field.type === "image") {
            // 이미지 필드는 초기 데이터가 있으면 미리보기 설정
            if (props.initialData[field.name]) {
                previewImages[field.name] = props.initialData[field.name];
            } else {
                previewImages[field.name] = null;
            }
            uploadedFiles[field.name] = null; // 업로드 파일 초기화
        } else {
            // 텍스트 필드는 초기 데이터가 있으면 그 값으로, 없으면 빈 문자열
            formData[field.name] = props.initialData[field.name] !== undefined ? props.initialData[field.name] : "";
        }
    });
};

// 모달 닫기
const closeModal = () => {
    emit("update:show", false); // v-model 사용을 위한 이벤트
};

// 이미지 업로드 핸들러
const handleImageUpload = (event: Event, fieldName: string) => {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
        const file = target.files[0];
        uploadedFiles[fieldName] = file; // 해당 필드명으로 파일 저장

        const reader = new FileReader();
        reader.onload = (e) => {
            previewImages[fieldName] = e.target?.result as string; // 해당 필드명으로 미리보기 URL 저장
        };
        reader.readAsDataURL(file);
    }
};

// 이미지 미리보기 제거
const removePreviewImage = (fieldName: string) => {
    previewImages[fieldName] = null; // 미리보기 URL 제거
    uploadedFiles[fieldName] = null; // 업로드된 파일 제거
    // 초기 데이터에 해당 이미지가 있었다면, 이 이미지를 삭제해야 함을 부모에게 알릴 수 있도록 추가 로직 필요
    // 예: emit('imageDelete', fieldName, props.initialData[fieldName])
};

// 폼 제출
const handleSubmit = () => {
    // FormData 객체를 생성하여 파일과 텍스트 데이터를 함께 담음
    const payload = new FormData();

    // 텍스트 데이터 추가
    for (const key in formData) {
        payload.append(key, formData[key]);
    }

    // 파일 데이터 추가
    for (const fieldName in uploadedFiles) {
        const file = uploadedFiles[fieldName];
        if (file) {
            payload.append(fieldName, file);
        } else if (props.initialData[fieldName] && !previewImages[fieldName]) {
            // 기존 이미지가 있었는데 제거된 경우, 해당 필드를 빈 값으로 보냄 (서버가 이를 삭제로 인지하도록)
            // 서버 API 설계에 따라 'delete_image_field: true' 같은 별도 플래그를 보낼 수도 있음
            payload.append(fieldName, "");
        }
    }

    // 파일 삭제 처리에 대한 추가 고려 사항:
    // 만약 `images_to_delete`와 같은 별도의 필드가 필요하다면,
    // removePreviewImage에서 해당 ID를 수집하여 payload에 추가해야 합니다.
    // 현재 코드에서는 단일 이미지 필드를 가정하고 있으므로,
    // 이미지를 제거하면 해당 필드에 빈 값을 보내는 것으로 처리합니다.

    // 데이터를 부모 컴포넌트로 emit
    emit("submit", payload);

    // 제출 후 모달 닫기
    closeModal();
};
</script>
