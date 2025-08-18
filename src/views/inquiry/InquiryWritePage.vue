<template>
    <PageLayout title="강의 문의" backgroundImageUrl="/img/top_header/inquiry.jpg">
        <form @submit.prevent="handleSubmit" class="max-w-2xl mx-auto">
            <table class="w-full mb-6">
                <tbody>
                    <tr class="border-b border-gray-200">
                        <th class="py-3 pr-4 w-1/4 text-left font-medium text-gray-700 align-top">작성자</th>
                        <td class="py-3 text-gray-800">{{ currentUser.username }}</td>
                    </tr>
                    <tr class="border-b border-gray-200">
                        <th class="py-3 pr-4 w-1/4 text-left font-medium text-gray-700 align-top">이메일</th>
                        <td class="py-3 text-gray-800">{{ currentUser.email }}</td>
                    </tr>
                    <template v-for="field in formSchema" :key="field.id">
                        <tr class="border-b border-gray-200">
                            <th class="py-3 pr-4 w-1/4 text-left font-medium text-gray-700 align-top">
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
                                    v-else-if="field.type === 'textarea'"
                                    :id="field.id"
                                    v-model="formData[field.name]"
                                    :placeholder="field.placeholder"
                                    rows="8"
                                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[var(--dream-main)] focus:border-[var(--dream-main)] sm:text-sm resize-none"
                                ></textarea>
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>

            <div class="mb-6 text-left">
                <label for="consent-check" class="flex items-center cursor-pointer text-sm text-gray-700">
                    <input type="checkbox" id="consent-check" v-model="consentChecked" class="h-4 w-4 text-[var(--dream-main)] border-gray-300 rounded focus:ring-[var(--dream-main)] mr-2" />
                    개인정보 수집 및 이용에 동의합니다.
                </label>
                <button type="button" @click="openConsentModal" class="ml-2 text-xs text-[var(--dream-blue)] hover:underline">내용보기</button>
            </div>

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

        <!-- Consent Modal -->
        <div v-if="showConsentModal" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" @click.self="closeConsentModal">
            <div class="bg-white p-6 sm:p-8 rounded-lg shadow-2xl w-full max-w-lg transform transition-all duration-300 ease-in-out">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-xl font-semibold text-[var(--dream-text)]">{{ consentContent.title }}</h3>
                    <button @click="closeConsentModal" class="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
                </div>
                <div class="space-y-3 text-sm text-gray-600 max-h-80 overflow-y-auto pr-2">
                    <p v-for="(paragraph, index) in consentContent.paragraphs" :key="index">
                        {{ paragraph }}
                    </p>
                </div>
                <div class="mt-6 text-right">
                    <button @click="closeConsentModal" class="bg-[var(--dream-gray-dark)] hover:bg-opacity-80 text-white font-semibold py-2 px-4 rounded-md shadow-sm">닫기</button>
                </div>
            </div>
        </div>
    </PageLayout>
</template>

<script setup lang="ts">
import {ref, reactive, computed} from "vue";
import {useRouter} from "vue-router";
import {dummyUserData, inquiryWriteFormSchema, consentModalContent, type InquiryWriteFormData, type InquiryWriteFormField} from "@/data/dummyData";
import PageLayout from "@/components/common/PageLayout.vue";

const router = useRouter();

const currentUser = ref(dummyUserData); // 실제 앱에서는 로그인된 사용자 정보 사용
const formSchema = ref<InquiryWriteFormField[]>(inquiryWriteFormSchema);

const initialFormData: InquiryWriteFormData = {
    title: "",
    contents: "",
};
const formData = reactive<InquiryWriteFormData>({...initialFormData});

const consentChecked = ref(false);
const showConsentModal = ref(false);
const consentContent = ref(consentModalContent);

const isFormValid = computed(() => {
    return formData.title.trim() !== "" && formData.contents.trim() !== "" && consentChecked.value;
});

const openConsentModal = () => {
    showConsentModal.value = true;
};

const closeConsentModal = () => {
    showConsentModal.value = false;
};

const handleSubmit = () => {
    if (!isFormValid.value) {
        alert("제목, 내용 입력 및 개인정보 수집 동의가 필요합니다.");
        return;
    }
    console.log("문의 제출:", {
        user: currentUser.value,
        ...formData,
        consent: consentChecked.value,
    });
    // 실제 애플리케이션에서는 여기서 API 호출
    alert("문의가 성공적으로 등록되었습니다."); // 성공 메시지 (임시)
    router.push("/inquiry"); // 문의 목록 페이지로 이동 (예시)
};
</script>

<style scoped>
/* Tailwind CSS를 주로 사용하므로 scoped style은 최소화합니다. */
/* 필요한 경우 여기에 컴포넌트 특정 스타일을 추가할 수 있습니다. */

/* 모달 트랜지션 (다른 페이지와 유사하게) */
.fixed.inset-0 {
    transition: opacity 0.3s ease-in-out;
}
.fixed.inset-0 > div {
    /* 모달 컨텐츠 div */
    transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
}

/* 스크롤바 스타일 (선택적) */
.max-h-80.overflow-y-auto::-webkit-scrollbar {
    width: 6px;
}
.max-h-80.overflow-y-auto::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
}
.max-h-80.overflow-y-auto::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 10px;
}
.max-h-80.overflow-y-auto::-webkit-scrollbar-thumb:hover {
    background: #a1a1a1;
}
</style>
