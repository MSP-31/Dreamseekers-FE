<template>
    <LoadingSpinner :isLoading="isLoading" />
    <PageLayout title="강의 문의" backgroundImageUrl="/img/top_header/inquiry.webp">
        <form @submit.prevent="handleSubmit" class="max-w-2xl mx-auto">
            <table class="w-full mb-6">
                <tbody>
                    <template v-for="field in formSchema" :key="field.id">
                        <tr class="block md:table-row border-b border-gray-200">
                            <th class="block md:table-cell pt-4 pb-1 md:py-3 md:pr-4 md:w-1/8 text-left font-medium text-gray-700 md:align-middle">
                                <label :for="field.id" class="cursor-pointer">{{ field.label }}</label>
                            </th>
                            <td class="block md:table-cell pb-4 md:py-3 relative">
                                <template v-if="field.type === 'text'">
                                    <input
                                        :type="field.type"
                                        :id="field.id"
                                        v-model="formData[field.name]"
                                        :placeholder="field.placeholder"
                                        @blur="validateField(field.name)"
                                        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[var(--dream-main)] focus:border-[var(--dream-main)] sm:text-sm"
                                        :class="{'border-red-500 focus:border-red-500 focus:ring-red-500': errors[field.name]}"
                                    />
                                </template>
                                <template v-else-if="field.type === 'textarea' && !field.name.includes('contents')">
                                    <textarea
                                        :id="field.id"
                                        v-model="formData[field.name]"
                                        :placeholder="field.placeholder"
                                        rows="8"
                                        @blur="validateField(field.name)"
                                        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[var(--dream-main)] focus:border-[var(--dream-main)] sm:text-sm resize-none"
                                        :class="{'border-red-500 focus:border-red-500 focus:ring-red-500': errors[field.name]}"
                                    ></textarea>
                                </template>
                                <template v-if="field.name === 'contents'">
                                    <div :class="{'border border-red-500 rounded-md': errors.contents}">
                                        <TiptapEditor v-model="formData.contents" @blur="validateField('contents')" />
                                    </div>
                                </template>
                                <p v-if="errors[field.name]" class="mt-1 text-sm text-red-600">{{ errors[field.name] }}</p>
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

const errors = reactive({
    email: "",
    phone: "",
    title: "",
    contents: "",
});

const validateEmail = (email: string): boolean => {
    // 간단한 이메일 형식 검증을 위한 정규식
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const isFormValid = computed(() => {
    const isContentsValid = formData.contents && formData.contents.replace(/<[^>]*>/g, "").trim() !== "";
    return formData.title.trim() !== "" && isContentsValid && formData.phone.trim() !== "" && validateEmail(formData.email);
});

const validateField = (field: keyof InquiryWriteFormData) => {
    switch (field) {
        case "title":
            errors.title = formData.title.trim() === "" ? "제목을 입력해주세요." : "";
            break;
        case "contents":
            errors.contents = !formData.contents || formData.contents.replace(/<[^>]*>/g, "").trim() === "" ? "내용을 입력해주세요." : "";
            break;
        case "phone":
            errors.phone = formData.phone.trim() === "" ? "연락처를 입력해주세요." : "";
            break;
        case "email":
            if (formData.email.trim() === "") {
                errors.email = "이메일을 입력해주세요.";
            } else if (!validateEmail(formData.email)) {
                errors.email = "올바른 이메일 형식이 아닙니다.";
            } else {
                errors.email = "";
            }
            break;
    }
};

const resetForm = () => {
    Object.assign(formData, initialFormData);
    Object.keys(errors).forEach((key) => {
        errors[key as keyof typeof errors] = "";
    });
};

const handleSubmit = async () => {
    // 모든 필드를 다시 한번 검증합니다.
    (Object.keys(formData) as Array<keyof InquiryWriteFormData>).forEach((field) => validateField(field));
    if (!isFormValid.value) return;

    isLoading.value = true;
    try {
        await apiClient.post("/lecture/inquiries", formData);
        alert("문의가 성공적으로 등록되었습니다.");
        resetForm();
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
