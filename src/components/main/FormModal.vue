<template>
    <BaseModal :show="show" :modalTitle="modalTitle" :submitButtonText="submitButtonText" @update:show="closeModal" @submit="handleSubmit">
        <template #content>
            <form @submit.prevent="handleSubmit">
                <div class="space-y-4">
                    <div v-if="formFields.some((field) => ['startDate', 'endDate'].includes(field.name))">
                        <div class="mt-1 flex flex-wrap space-x-2">
                            <label for="startDate" class="block text-sm font-medium text-gray-700">시작 날짜</label>
                            <input
                                v-if="formFields.find((f) => f.name === 'startDate')"
                                type="date"
                                :id="formFields.find((f) => f.name === 'startDate')?.id"
                                :name="formFields.find((f) => f.name === 'startDate')?.name"
                                v-model="formData[formFields.find(f => f.name === 'startDate')?.name as string]"
                                class="block flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            <input
                                v-if="formFields.find((f) => f.name === 'startTime')"
                                type="time"
                                :id="formFields.find((f) => f.name === 'startTime')?.id"
                                :name="formFields.find((f) => f.name === 'startTime')?.name"
                                :disabled="formData.allDay"
                                v-model="formData[formFields.find(f => f.name === 'startTime')?.name as string]"
                                class="block flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                step="60"
                            />
                        </div>
                        <div class="mt-1 flex flex-wrap space-x-2">
                            <label for="startDate" class="block text-sm font-medium text-gray-700">종료 날짜</label>
                            <input
                                v-if="formFields.find((f) => f.name === 'endDate')"
                                type="date"
                                :id="formFields.find((f) => f.name === 'endDate')?.id"
                                :name="formFields.find((f) => f.name === 'endDate')?.name"
                                v-model="formData[formFields.find(f => f.name === 'endDate')?.name as string]"
                                class="block flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            <input
                                v-if="formFields.find((f) => f.name === 'endTime')"
                                type="time"
                                :id="formFields.find((f) => f.name === 'endTime')?.id"
                                :name="formFields.find((f) => f.name === 'endTime')?.name"
                                :disabled="formData.allDay"
                                v-model="formData[formFields.find(f => f.name === 'endTime')?.name as string]"
                                class="block flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                step="60"
                            />
                        </div>
                    </div>

                    <template v-for="field in formFields" :key="field.name">
                        <div v-if="!['id', 'startDate', 'endDate', 'startTime', 'endTime'].includes(field.name)" class="space-y-1">
                            <label :for="field.id" class="block text-sm font-medium text-gray-700">{{ field.label }}</label>

                            <input
                                v-if="field.type === 'text'"
                                :type="field.type"
                                :id="field.id"
                                :name="field.name"
                                v-model="formData[field.name]"
                                class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            <textarea
                                v-else-if="field.type === 'textarea'"
                                :id="field.id"
                                :name="field.name"
                                v-model="formData[field.name]"
                                rows="5"
                                class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm resize-none"
                            ></textarea>
                            <input
                                v-else-if="field.type === 'checkbox'"
                                :type="field.type"
                                :id="field.id"
                                :name="field.name"
                                v-model="formData[field.name]"
                                class="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                            />
                            <ImageUploader
                                v-else-if="field.type === 'image'"
                                v-model="formData[field.name]"
                                :inputId="field.id"
                                :buttonText="field.label"
                                :maxSizeMB="0.2"
                                :maxWidthOrHeight="1024"
                                :initialPreviewUrl="initialData[field.name]"
                                @error="handleImageUploaderError"
                            />
                        </div>
                    </template>
                </div>
            </form>
        </template>
    </BaseModal>
</template>
<script setup lang="ts">
import {reactive, watch} from "vue";
import BaseModal from "@/components/common/BaseModal.vue";
import type {FormField} from "@/types/common";
import ImageUploader from "@/components/utils/ImageUploader.vue";

// --- Props 정의 ---
const props = defineProps({
    show: {type: Boolean, default: false},
    modalTitle: {type: String, default: "수정"},
    formFields: {type: Array as () => FormField[], required: true},
    initialData: {type: Object as () => Record<string, any>, default: () => ({})},
    submitButtonText: {type: String, default: "등록"},
});

// --- Emits 정의 ---
// 모달 닫기 이벤트
const emit = defineEmits(["update:show", "submit"]);

// --- Internal State ---
const formData = reactive<Record<string, any>>({}); // 폼 입력 값

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
    // formData 초기화
    for (const key in formData) {
        delete formData[key];
    }

    props.formFields.forEach((field) => {
        if (field.type === "image") {
            formData[field.name] = null; // 초기에는 파일이 선택되지 않은 상태
        } else {
            // 텍스트 필드는 초기 데이터가 있으면 그 값으로, 없으면 빈 문자열
            formData[field.name] = props.initialData[field.name] !== undefined ? props.initialData[field.name] : field.type === "checkbox" ? false : "";
        }
    });
};

// 모달 닫기
const closeModal = () => {
    emit("update:show", false);
};

// 폼 제출
// CalendarModal.vue 또는 ReusableFormModal.vue 의 handleSubmit 함수
const handleSubmit = () => {
    const payload = new FormData();

    for (const key in formData) {
        const value = formData[key];
        const fieldDef = props.formFields.find((f) => f.name === key);

        // 이미지 필드 처리 (blob 또는 file 인스턴스 모두 검사)
        // console.log(`Processing key: ${key}, value:`, value, `instanceof File: ${value instanceof File}, instanceof Blob: ${value instanceof Blob}`); // 디버깅용 로그

        if (fieldDef && fieldDef.type === "image") {
            if (value instanceof File || value instanceof Blob) {
                // File 또는 Blob 인스턴스 모두 허용
                let fileToSend: File;

                if (value instanceof File) {
                    fileToSend = value; // 이미 File 객체라면 그대로 사용
                } else {
                    // Blob 객체인 경우 File 객체로 변환
                    // Blob에서 File 객체를 생성할 때 필요한 이름과 타입을 명시적으로 지정
                    // 이 이름은 `ImageUploader`에서 `v-model`로 받아온 `Blob`의 `name` 속성 (만약 있다면)
                    // 또는 기본 이름을 사용합니다.
                    const originalFileName = value.name || `${key}_${Date.now()}.jpeg`; // 콘솔에 찍힌 name 속성 활용
                    const originalFileType = value.type || "image/jpeg"; // 콘솔에 찍힌 type 속성 활용

                    // Blob을 File 객체로 변환
                    fileToSend = new File([value], originalFileName, {type: originalFileType, lastModified: value.lastModified || Date.now()});
                }

                // 이제 fileToSend는 확실히 File 객체입니다.
                // 파일 이름이 비어있다면, 기본 이름을 생성하거나 유효한 이름을 사용하도록 합니다.
                const finalFileName = fileToSend.name || `${key}_${Date.now()}.jpeg`;

                payload.append(key, fileToSend, finalFileName);
                console.log(`Appending image: key=${key}, name=${finalFileName}, size=${fileToSend.size}, type=${fileToSend.type}`);
            } else if (value === null && props.initialData[key]) {
                // 이미지가 제거된 경우:
                // 이미지가 null이면 해당 필드를 payload에 아예 추가하지 않습니다.
            }
        } else {
            // 텍스트 필드 또는 다른 타입의 필드
            payload.append(key, value);
        }
    }

    emit("submit", payload);
    closeModal();
};

// ImageUploader에서 발생한 오류를 처리하는 함수
const handleImageUploaderError = (error: string | Error) => {
    console.error("ImageUploader 오류:", error);
};
</script>
