<template>
    <PageLayout title="교육원 소개" backgroundImageUrl="/img/top_header/intro.webp">
        <div v-if="isAdmin" class="text-right mb-6">
            <button @click="openModal()" class="bg-[var(--dream-main)] hover:bg-opacity-80 text-white font-semibold py-2 px-6 rounded-md shadow-sm transition duration-150 ease-in-out">
                교육원 소개 이미지 수정
            </button>
        </div>

        <div v-if="!academyInfo.images || academyInfo.images.length === 0" class="flex justify-center items-center h-64 text-gray-500 text-lg">
            <span>아직 등록된 이미지가 없습니다.</span>
        </div>

        <ul v-else class="flex flex-col">
            <li v-for="(image, index) in academyInfo.images" :key="index" class="bg-white shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
                <img :src="image" :alt="`교육원 소개 이미지 ${index + 1}`" class="w-full h-auto object-cover" />
            </li>
        </ul>

        <ReusableMultiImageFormModal
            v-model:show="showModal"
            :modal-title="'교육원 소개 이미지 수정'"
            :form-fields="formSchema"
            :initial-data="initialModalData"
            :submit-button-text="'수정 완료'"
            @submit="handleModalSubmit"
        />
    </PageLayout>
</template>

<script setup lang="ts">
import {ref, onMounted} from "vue";
import {useAuthStore} from "@/stores/auth";
import PageLayout from "@/components/common/PageLayout.vue";
import ReusableMultiImageFormModal from "@/components/main/MultiImageFormModal.vue";
import apiClient from "@/api";

// API 응답 데이터 타입을 백엔드에 맞게 재정의
interface AcademyInfo {
    id: number;
    images: string[];
}

const authStore = useAuthStore();
const isAdmin = authStore.isAdmin;

const academyInfo = ref<AcademyInfo>({
    id: 1,
    images: [],
});

const showModal = ref(false);
const initialModalData = ref<{image_files: string[]}>({
    image_files: [],
});

const formSchema = ref([{id: "image_files", name: "image_files", label: "교육원 이미지", type: "multiple-image"}]);

const openModal = () => {
    // 모달을 열 때, 기존 이미지 URL을 initialModalData에 할당
    initialModalData.value = {
        image_files: academyInfo.value.images || [],
    };
    showModal.value = true;
};

const handleModalSubmit = async (payload: FormData) => {
    try {
        await apiClient.put(`/intro/instructors/${academyInfo.value.id}`, payload, {
            headers: {"Content-Type": "multipart/form-data"},
        });

        alert("교육원 소개 이미지가 수정되었습니다.");
        showModal.value = false;
        await fetchData();
    } catch (error: any) {
        console.error("API 호출 오류:", error);
        const errorMessage = error.response?.data?.detail || "요청 처리 중 오류가 발생했습니다.";
        alert(errorMessage);
    }
};

const fetchData = async () => {
    try {
        const response = await apiClient.get<AcademyInfo>(`/intro/instructors/1`);
        academyInfo.value = response.data;
    } catch (error: any) {
        console.error("API 호출 오류:", error);
        alert("데이터 로딩에 실패했습니다.");
    }
};

onMounted(() => {
    fetchData();
});
</script>
