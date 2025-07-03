<template>
    <PageLayout title="교육원 소개" backgroundImageUrl="/img/top_header/intro.jpg">
        <!-- Staff-only: Edit Button -->
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
        <EditModal
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
import {greetingIntroData, greetingFormFields} from "@/data/dummyData";
import {useAuthStore} from "@/stores/auth";
import PageLayout from "@/components/layout/PageLayout.vue";
import EditModal from "@/components/layout/EditModal.vue";
import type {IntroData, FormField} from "@/types/common";

const authStore = useAuthStore();
const isAdmin = authStore.isAdmin;

// 모달 표시 여부
const showModal = ref(false);

// 현재 페이지에 표시될 인사말 데이터 (초기값은 더미 데이터)
const currentIntroData = reactive<IntroData>({...greetingIntroData});

// 모달 설정 객체
const modalConfig = reactive({
    title: "인사말 수정",
    formFields: greetingFormFields as FormField[], // 더미 데이터의 필드 스키마 사용
    submitText: "수정 완료",
});

// 모달 열기
const openModal = () => {
    showModal.value = true;
};

// 모달에서 submit 이벤트 발생 시 호출될 핸들러
const handleModalSubmit = async (payload: FormData) => {
    console.log("Modal submitted with payload:", payload);

    // TODO: 여기서 실제 API 호출 로직을 구현합니다.
    // payload는 FormData 객체이므로, Axios 등으로 바로 보낼 수 있습니다.
    // 예시:
    // try {
    //     const response = await api.put('/intro/', payload, {
    //         headers: {
    //             'Content-Type': 'multipart/form-data', // FormData 사용 시 필수
    //         },
    //     });
    //     currentIntroData.title = response.data.title;
    //     currentIntroData.contents = response.data.contents;
    //     currentIntroData.image = response.data.image; // 서버에서 반환된 새 이미지 URL 업데이트
    //     alert('성공적으로 수정되었습니다.');
    // } catch (error) {
    //     console.error('API 호출 오류:', error);
    //     alert('수정에 실패했습니다.');
    // }

    // 더미 데이터 업데이트 (실제 API 호출 대체)
    // FormData에서 값 가져오기
    currentIntroData.title = payload.get("title") as string;
    currentIntroData.contents = payload.get("contents") as string;

    // 이미지 처리: payload에 파일이 있으면 새 이미지, 없으면 기존 이미지 유지 또는 삭제된 경우 처리
    const newImageFile = payload.get("image"); // 'image'는 formFields의 name과 일치해야 함
    if (newImageFile instanceof File) {
        // 새 파일이 업로드된 경우 (실제로는 서버에서 반환된 URL 사용)
        const reader = new FileReader();
        reader.onload = (e) => {
            currentIntroData.image = e.target?.result as string;
        };
        reader.readAsDataURL(newImageFile);
    } else if (newImageFile === "" && currentIntroData.image) {
        // 기존 이미지가 제거되었다고 판단될 경우
        currentIntroData.image = "/img/dummy/placeholder.png"; // 또는 null 등으로 처리
    }
};

// 컴포넌트 마운트 시 초기화 (필요하다면)
onMounted(() => {
    // api 호출해서 현재 데이터 가져오기
    // 지금은 더미로 처리해놨기에 그부분 제거하게 되면 호출
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
