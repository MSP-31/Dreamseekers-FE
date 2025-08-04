<template>
    <PageLayout title="교육원 소개" backgroundImageUrl="/img/top_header/intro.jpg">
        <div v-if="isAdmin" class="text-right mb-6">
            <button @click="openModal" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow-sm transition duration-150 ease-in-out">수정</button>
        </div>

        <!-- Introduction Content -->
        <div class="flex flex-col lg:flex-row items-start gap-8 p-6 bg-white shadow-lg rounded-lg">
            <img :src="currentIntroData.image" alt="대표 이미지" class="w-full lg:w-1/3 h-auto object-cover rounded-md shadow" />
            <div class="lg:w-2/3">
                <h2 class="text-2xl font-semibold text-gray-700 mb-4">{{ currentIntroData.title }}</h2>
                <p class="text-gray-600 leading-relaxed whitespace-pre-line">{{ currentIntroData.contents }}</p>
            </div>
        </div>

        <!-- Empty decorative divider (from original .board-title) -->
        <div class="mt-12 border-t border-gray-200"></div>

        <!-- 수정 모달 -->
        <ReusableFormModal
            v-model:show="showModal"
            :modalTitle="modalConfig.title"
            :formFields="modalConfig.formFields"
            :initialData="currentIntroData"
            :submitButtonText="modalConfig.submitText"
            @submit="handleModalSubmit"
        />
    </PageLayout>
</template>

<script setup lang="ts">
import {ref, reactive, onMounted} from "vue";
import {useAuthStore} from "@/stores/auth";
import PageLayout from "@/components/layout/PageLayout.vue";
import ReusableFormModal from "@/components/main/FormModal.vue";
import {IntroData, FormField} from "@/types/common";
import apiClient from "@/api";

const authStore = useAuthStore();
const isAdmin = authStore.isAdmin;

// 폼 필드 정의
const greetingFormFields: FormField[] = [
    {id: "title", name: "title", label: "제목", type: "text"},
    {id: "contents", name: "contents", label: "내용", type: "textarea"},
    {id: "image", name: "image", label: "대표 이미지", type: "image"},
];

// 모달 표시 여부
const showModal = ref(false);

// 현재 페이지에 표시될 인사말 데이터 (초기값은 더미 데이터)
const currentIntroData = reactive<IntroData>({
    title: "",
    contents: "",
    image: "",
});

// 모달 설정 객체
const modalConfig = reactive({
    title: "인사말 수정",
    formFields: greetingFormFields,
    submitText: "수정 완료",
});

// 모달 열기
const openModal = () => {
    showModal.value = true;
};

// 모달에서 submit 이벤트 발생 시 호출될 핸들러
const handleModalSubmit = async (payload: FormData) => {
    // 내용물 확인
    // for (const [key, value] of payload.entries()) {
    //     console.log(key, value);
    // }

    try {
        await apiClient.put("/intro/greeting", payload, {
            headers: {
                "Content-Type": "multipart/form-data", // FormData 사용 시 필수
            },
        });
        await fetchData();
        alert("성공적으로 수정되었습니다.");
    } catch (error: any) {
        console.error("API 호출 오류:", error);
        if (error.response?.status === 400) {
            alert(error.response.data.message || "입력 오류가 발생했습니다.");
        } else if (error.response.status === 404) {
            alert(error.response.data?.detail);
        } else {
            alert("수정에 실패했습니다.");
        }
    }
};

const fetchData = async () => {
    try {
        const response = await apiClient.get("/intro/greeting");
        currentIntroData.title = response.data.title;
        currentIntroData.contents = response.data.contents;
        currentIntroData.image = response.data.image; // 서버에서 반환된 새 이미지 URL 업데이트
        console.log(currentIntroData.image);
        console.log(response.data);
    } catch (error: any) {
        console.error("API 호출 오류:", error);
        if (error.response?.status === 400) {
            alert(error.response.data?.detail);
        } else if (error.response.status === 404) {
            alert(error.response.data?.detail);
        } else {
            alert("데이터 로딩에 실패했습니다.");
        }
    }
};

// 컴포넌트 마운트 시 초기화
onMounted(() => {
    fetchData();
});
</script>

<style scoped>
.fixed.inset-0 {
    transition: opacity 0.3s ease-in-out;
}
.fixed.inset-0 > div {
    transition: transform 0.3s ease-in-out;
}
</style>
