<template>
    <PageLayout title="설정" backgroundImageUrl="/img/top_header/setting.jpg">
        <div v-if="isAdmin">
            <div class="text-right mb-6">
                <button @click="openAddModal" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow-sm transition duration-150 ease-in-out">추가</button>
            </div>
            <ul class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <SlideItem v-for="s in slides" :key="s.id" :slide="s" :isAdmin="isAdmin" @edit="handleEditSlide" @delete="handleDeleteSlide" />
            </ul>

            <!-- 추가 모달 -->
            <ReusableFormModal
                v-model:show="showModal"
                :modalTitle="modalConfig.title"
                :formFields="modalConfig.formFields"
                :initialData="currentSlideData"
                :submitButtonText="modalConfig.submitText"
                @submit="handleModalSubmit"
            />
        </div>
        <div v-else class="text-center text-gray-500 py-8">
            <p>관리자 권한이 필요합니다.</p>
        </div>
    </PageLayout>
</template>

<script setup lang="ts">
import {ref, onMounted, computed} from "vue";
import apiClient from "@/api";
import {useAuthStore} from "@/stores/auth";
import PageLayout from "@/components/common/PageLayout.vue";
import ReusableFormModal from "@/components/main/FormModal.vue";
import SlideItem from "@/components/main/SlideItem.vue";
import {FormField} from "@/types/common";

const authStore = useAuthStore();
const isAdmin = computed(() => authStore.isAdmin);

// Slides 데이터 타입 정의
interface SlideItem {
    id: number;
    image: string | null;
    title?: string;
    contents?: string;
}

const slides = ref<SlideItem[]>([]);

// 모달 관련 변수
const showModal = ref(false);
const isEditMode = ref(false); // 현재 모드가 수정 모드인지 추적
const editingSlideId = ref<number | null>(null); // 수정 중인 슬라이드의 ID

// 폼 필드 정의 'title', 'contents'
const slideFormFields: FormField[] = [
    {id: "title", name: "title", label: "제목", type: "text"},
    {id: "contents", name: "contents", label: "내용", type: "textarea"},
    {id: "image", name: "image", label: "슬라이드 이미지", type: "image"},
];

// 모달 설정 객체
const modalConfig = ref({
    title: "슬라이드 추가",
    formFields: slideFormFields,
    submitText: "추가",
});

// 현재 페이지에 표시될 데이터 (초기값은 더미 데이터)
const currentSlideData = ref<Partial<SlideItem>>({
    image: "",
});

// -------------------
// 모달 열기
const openAddModal = () => {
    isEditMode.value = false;
    editingSlideId.value = null;
    modalConfig.value.title = "슬라이드 추가";
    modalConfig.value.submitText = "추가";
    currentSlideData.value = {image: ""}; // 추가 시 데이터 초기화
    showModal.value = true;
};

// "수정" 버튼 클릭 시 호출
const handleEditSlide = (slide: SlideItem) => {
    // 정확한 Slide 타입으로 지정
    isEditMode.value = true;
    editingSlideId.value = slide.id; // 수정할 슬라이드의 ID 저장
    modalConfig.value.title = "슬라이드 수정";
    modalConfig.value.submitText = "수정";
    currentSlideData.value = {
        id: slide.id,
        image: slide.image,
        title: slide.title,
        contents: slide.contents,
    };
    showModal.value = true;
};

// "삭제" 버튼 클릭 시 호출
const handleDeleteSlide = async (slideId: number) => {
    if (confirm("정말로 이 슬라이드를 삭제하시겠습니까?")) {
        try {
            await apiClient.delete(`/main/slides/${slideId}/`); // DELETE 요청
            await fetchData(); // 데이터 다시 불러오기
            alert("슬라이드가 성공적으로 삭제되었습니다.");
        } catch (error: any) {
            console.error("슬라이드 삭제 오류:", error);
            alert("슬라이드 삭제에 실패했습니다.");
        }
    }
};

// 모달에서 submit 이벤트 발생 시 호출될 핸들러
const handleModalSubmit = async (payload: FormData) => {
    try {
        if (isEditMode.value && editingSlideId.value) {
            // 수정 모드일 때 PATCH 요청
            await apiClient.patch(`/main/slides/${editingSlideId.value}/`, payload, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            alert("성공적으로 수정되었습니다.");
        } else {
            // 추가 모드일 때 POST 요청
            await apiClient.post("/main/slides/", payload, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            alert("성공적으로 추가되었습니다.");
        }
        await fetchData();
    } catch (error: any) {
        console.error("API 호출 오류:", error);
        if (error.response?.status === 400) {
            alert(error.response.data.message || "입력 오류가 발생했습니다.");
        } else if (error.response.status === 404) {
            alert(error.response.data?.detail);
        } else {
            alert(isEditMode.value ? "슬라이드 수정을 실패했습니다." : "슬라이드 추가를 실패했습니다.");
        }
    }
};

const fetchData = async () => {
    try {
        const response = await apiClient.get("/main/slides/");
        slides.value = response.data;
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

// 슬라이드 데이터를 불러오기
onMounted(async () => {
    fetchData();
});
</script>
