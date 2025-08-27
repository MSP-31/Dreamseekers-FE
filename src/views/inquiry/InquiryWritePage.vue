<template>
    <LoadingSpinner :isLoading="isLoading" />
    <PageLayout title="강의 문의" backgroundImageUrl="/img/top_header/inquiry.webp">
        <form @submit.prevent="handleSubmit" class="max-w-2xl mx-auto">
            <table class="w-full mb-6">
                <tbody>
                    <template v-for="field in formSchema" :key="field.id">
                        <tr class="border-b border-gray-200">
                            <th class="py-3 pr-4 w-1/8 text-left font-medium text-gray-700 align-top">
                                <label :for="field.id">{{ field.label }}</label>
                            </th>
                            <td class="py-3">
                                <input
                                    v-if="field.type === 'text'"
                                    :type="field.type"
                                    :id="field.id"
                                    v-model="formData[field.name]"
                                    :placeholder="field.placeholder"
                                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[var(--dream-main)] focus:border-[var(--dream-main)] sm:text-sm"
                                />
                                <textarea
                                    v-else-if="field.type === 'textarea' && !field.name.includes('contents')"
                                    :id="field.id"
                                    v-model="formData[field.name]"
                                    :placeholder="field.placeholder"
                                    rows="8"
                                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[var(--dream-main)] focus:border-[var(--dream-main)] sm:text-sm resize-none"
                                ></textarea>
                                <TiptapEditor v-if="field.name === 'contents'" v-model="formData.contents" />
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>

            <div class="text-right">
                <button
                    type="submit"
                    :disabled="!isFormValid"
                    class="bg-[var(--dream-main)] hover:bg-opacity-80 text-white font-semibold py-2 px-6 rounded-md shadow-sm transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    등록
                </button>
            </div>
        </form>
    </PageLayout>
</template>

<script setup lang="ts">
import {ref, reactive, computed} from "vue";
import apiClient from "@/api";
import {inquiryWriteFormSchema, type InquiryWriteFormData, type InquiryWriteFormField} from "@/data/dummyData";
import PageLayout from "@/components/common/PageLayout.vue";
import LoadingSpinner from "@/components/common/LoadingSpinner.vue";
import TiptapEditor from "@/components/utils/TiptapEditor.vue";

const isLoading = ref(false);

const formSchema = ref<InquiryWriteFormField[]>(inquiryWriteFormSchema);

const initialFormData: InquiryWriteFormData = {
    email: "",
    phone: "",
    title: "",
    contents: "",
};
const formData = reactive<InquiryWriteFormData>({...initialFormData});

const isFormValid = computed(() => {
    return formData.title.trim() !== "" && formData.contents.trim() !== "" && formData.phone !== "" && formData.email.trim() !== "";
});

const handleSubmit = async () => {
    isLoading.value = true;
    try {
        await apiClient.post("/lecture/inquiries", formData);
        alert("문의가 성공적으로 등록되었습니다.");
        formData.title = "";
        formData.contents = "";
        formData.phone = "";
        formData.email = "";
    } catch (error: any) {
        console.error("API 요청 오류:", error);
        const errorMessage = error.response?.data?.detail || error.response?.data?.message || "요청 처리 중 오류가 발생했습니다.";
        alert(errorMessage);
    } finally {
        // 요청이 성공하든 실패하든 isLoading을 false로 설정
        isLoading.value = false;
    }
};
</script>
