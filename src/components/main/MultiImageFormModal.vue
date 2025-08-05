<template>
    <BaseModal :show="show" :modalTitle="modalTitle" :submitButtonText="submitButtonText" @update:show="closeModal" @submit="handleSubmit">
        <template #content>
            <form @submit.prevent="handleSubmit">
                <table class="w-full">
                    <tbody>
                        <tr v-for="field in formFields" :key="field.name">
                            <template v-if="field.type === 'multiple-image'">
                                <td colspan="2" class="py-3">
                                    <label :for="field.id" class="block text-sm font-medium text-gray-700 mb-2">{{ field.label }}</label>

                                    <div v-if="initialPreviewUrls.length > 0" class="mb-4">
                                        <h4 class="text-sm font-medium text-gray-600 mb-2">현재 이미지</h4>
                                        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                                            <div v-for="(url, index) in initialPreviewUrls" :key="index" class="relative">
                                                <img :src="url" class="w-full h-24 object-cover rounded-md border" />
                                                <button
                                                    @click.prevent="removeInitialImage(index)"
                                                    class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-80 hover:opacity-100 transition-opacity"
                                                >
                                                    &times;
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <input
                                        type="file"
                                        :id="field.id"
                                        :name="field.name"
                                        @change="handleFileChange($event, field.name)"
                                        class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
                                        multiple
                                        accept="image/jpeg, image/png, image/gif"
                                    />

                                    <div v-if="newImagePreviews.length > 0" class="mt-4">
                                        <h4 class="text-sm font-medium text-gray-600 mb-2">새로 업로드할 이미지</h4>
                                        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                                            <div v-for="(preview, index) in newImagePreviews" :key="index" class="relative">
                                                <img :src="preview" class="w-full h-24 object-cover rounded-md border" />
                                                <button
                                                    @click.prevent="removeNewImage(index)"
                                                    class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-80 hover:opacity-100 transition-opacity"
                                                >
                                                    &times;
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <p class="mt-2 text-xs text-gray-500">최대 10개까지 이미지를 선택할 수 있습니다.</p>
                                </td>
                            </template>

                            <template v-else-if="!['id', 'date', 'startTime', 'endTime'].includes(field.name)">
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
                            </template>
                        </tr>
                    </tbody>
                </table>
            </form>
        </template>
    </BaseModal>
</template>
<script setup lang="ts">
import {reactive, ref, watch} from "vue";
import BaseModal from "../layout/BaseModal.vue";
import type {AcademyIntroFormField} from "@/types/common";

const props = defineProps({
    show: {type: Boolean, default: false},
    modalTitle: {type: String, default: "수정"},
    formFields: {type: Array as () => AcademyIntroFormField[], required: true},
    initialData: {type: Object as () => Record<string, any>, default: () => ({})},
    submitButtonText: {type: String, default: "등록"},
});

const emit = defineEmits(["update:show", "submit"]);

const formData = reactive<Record<string, any>>({});
const newImageFiles = ref<File[]>([]);
const newImagePreviews = ref<string[]>([]);
const initialPreviewUrls = ref<string[]>([]);
const deletedInitialImageUrls = ref<string[]>([]);

// 'multiple-image' 타입의 필드 이름을 찾습니다.
const multiImageFieldName = props.formFields.find((f) => f.type === "multiple-image")?.name || "image_files";

// 모달이 열릴 때 데이터 초기화
watch(
    () => props.show,
    (newVal) => {
        if (newVal) {
            initializeFormData();
        }
    },
    {immediate: true}
);

const initializeFormData = () => {
    for (const key in formData) {
        delete formData[key];
    }
    newImageFiles.value = [];
    newImagePreviews.value = [];
    initialPreviewUrls.value = [];
    deletedInitialImageUrls.value = []; // 삭제 이미지 목록도 초기화

    props.formFields.forEach((field) => {
        if (field.type === "multiple-image") {
            if (props.initialData[field.name]) {
                initialPreviewUrls.value = [...props.initialData[field.name]];
            }
            formData[field.name] = [];
        } else {
            formData[field.name] = props.initialData[field.name] !== undefined ? props.initialData[field.name] : "";
        }
    });
};

const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files) {
        newImageFiles.value = Array.from(target.files);
        newImagePreviews.value = newImageFiles.value.map((file) => URL.createObjectURL(file));
        formData[multiImageFieldName] = newImageFiles.value;
    }
};

const removeInitialImage = (index: number) => {
    // 삭제할 URL을 deletedInitialImageUrls 배열에 추가
    const removedUrl = initialPreviewUrls.value.splice(index, 1)[0];
    deletedInitialImageUrls.value.push(removedUrl);
};

const removeNewImage = (index: number) => {
    newImageFiles.value.splice(index, 1);
    newImagePreviews.value.splice(index, 1);
    formData[multiImageFieldName] = newImageFiles.value;
};

const closeModal = () => {
    emit("update:show", false);
};

const handleSubmit = () => {
    const payload = new FormData();

    // 삭제된 이미지 URL 목록을 JSON 문자열로 변환하여 payload에 추가
    if (deletedInitialImageUrls.value.length > 0) {
        payload.append("deleted_images", JSON.stringify(deletedInitialImageUrls.value));
    }

    // 새로운 이미지 파일 처리
    if (newImageFiles.value.length > 0) {
        newImageFiles.value.forEach((file) => {
            payload.append(multiImageFieldName, file);
        });
    }

    // 기존에 남아있는 이미지 URL 목록을 JSON 문자열로 변환하여 payload에 추가
    // 백엔드가 이 목록을 기준으로 기존 이미지들을 유지하도록 처리합니다.
    if (initialPreviewUrls.value.length > 0) {
        payload.append("current_images", JSON.stringify(initialPreviewUrls.value));
    }

    // 기타 필드 처리
    for (const key in formData) {
        if (key !== multiImageFieldName) {
            payload.append(key, formData[key]);
        }
    }

    emit("submit", payload);
    closeModal();
};
</script>
