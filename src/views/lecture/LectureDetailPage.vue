<template>
    <div class="font-[var(--font-body)]">
        <PageHeader :title="mainLecture?.title || '강의 상세'" backgroundImageUrl="/img/top_header/lecture.jpg" />

        <div class="main-content">
            <div v-if="mainLecture">
                <h1 class="text-3xl font-bold text-center mb-4 text-[var(--dream-text)]">{{ mainLecture.title }}</h1>
                <p v-if="mainLecture.contents" class="text-center text-lg text-[var(--dream-sub)] mb-10">{{ mainLecture.contents }}</p>

                <div v-if="isAdmin" class="text-right mb-6">
                    <button @click="openModal()" class="bg-[var(--dream-main)] hover:bg-opacity-80 text-white font-semibold py-2 px-6 rounded-md shadow-sm">세부 항목 추가</button>
                </div>

                <ul v-if="currentSubItems.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    <LectureCard v-for="lecture in currentSubItems" :key="lecture.id" :lecture="lecture" :is-staff="isAdmin" @edit="openModal" @delete="handleDelete" />
                </ul>
                <div v-else class="text-center text-gray-500 py-8">
                    <p>표시할 세부 강의 항목이 없습니다.</p>
                    <p v-if="isAdmin" class="mt-2 text-sm">"세부 항목 추가" 버튼을 눌러 내용을 추가할 수 있습니다.</p>
                </div>
            </div>
            <div v-else class="text-center text-gray-500 py-16">
                <p>강의 정보를 불러올 수 없습니다.</p>
                <router-link to="/lecture/list" class="text-[var(--dream-main)] hover:underline mt-4 inline-block">강의 목록으로 돌아가기</router-link>
            </div>

            <div class="mt-12 border-t border-[var(--dream-gray-dark)] opacity-30"></div>

            <ReusableFormModal
                v-if="isAdmin"
                v-model:show="showModal"
                :modal-title="isEditing ? '세부 항목 수정' : '새 세부 항목 추가'"
                :form-fields="formSchema"
                :initial-data="initialModalData"
                :submit-button-text="isEditing ? '수정 완료' : '등록'"
                @submit="handleModalSubmit"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import {ref, onMounted} from "vue"; // reactive 제거, onMounted 추가
import {useRoute} from "vue-router";
import PageHeader from "@/components/common/PageHeader.vue";
import LectureCard from "@/components/main/LectureCard.vue";
// dummyData 대신 API 연동을 위해 필요한 타입만 import
import {lectureFormSchema, type LectureItem, type LectureFormData, type LectureFormSchemaField} from "@/data/dummyData";
import ReusableFormModal from "@/components/main/FormModal.vue";
import {useAuthStore} from "@/stores/auth";
import apiClient from "@/api"; // apiClient 임포트

const authStore = useAuthStore();
const isAdmin = authStore.isAdmin;

const route = useRoute();
const lectureId = ref<number | null>(null); // 현재 보고 있는 메인 강의 ID

const mainLecture = ref<LectureItem | null>(null);
const currentSubItems = ref<LectureItem[]>([]);

const showModal = ref(false);
const isEditing = ref(false);
const editingSubItemId = ref<number | null>(null);

// ReusableFormModal에 전달할 초기 데이터
// reactive 대신 ref 사용, LectureFormData 타입 명시
const initialModalData = ref<LectureFormData>({
    title: "",
    contents: "",
    image: null, // 이미지 필드 포함
});

// 폼 스키마는 동일하게 사용
const formSchema = ref<LectureFormSchemaField[]>(lectureFormSchema);

// 메인 강의 및 하위 항목 데이터 불러오기
const fetchLectureData = async () => {
    lectureId.value = parseInt(route.params.id as string, 10);
    if (isNaN(lectureId.value)) {
        console.error("Invalid lecture ID in route params.");
        return;
    }

    try {
        // 1. 메인 강의 정보 불러오기
        const mainLectureResponse = await apiClient.get<LectureItem>(`/lecture/titles/${lectureId.value}`);
        mainLecture.value = mainLectureResponse.data;

        // 2. 해당 메인 강의의 하위 항목들 불러오기
        const subItemsResponse = await apiClient.get<LectureItem[]>(`/lecture/titles/${lectureId.value}/details`); // API 경로 확인 필요
        currentSubItems.value = subItemsResponse.data;
    } catch (error: any) {
        console.error("강의 데이터 로딩 오류:", error);
        alert(error.response?.data?.detail || "강의 정보를 불러오는 데 실패했습니다.");
        mainLecture.value = null; // 오류 시 메인 강의 정보 초기화
    }
};

const openModal = (itemToEdit?: LectureItem) => {
    if (itemToEdit) {
        isEditing.value = true;
        editingSubItemId.value = itemToEdit.id;
        // 기존 데이터를 initialModalData에 할당
        initialModalData.value = {
            title: itemToEdit.title,
            contents: itemToEdit.contents,
            image: itemToEdit.image || null, // 기존 이미지 URL 전달
        };
    } else {
        isEditing.value = false;
        editingSubItemId.value = null;
        // 새 항목 추가 시 초기 데이터 리셋
        initialModalData.value = {title: "", contents: "", image: null};
    }
    showModal.value = true;
};

// ReusableFormModal에서 submit 이벤트 발생 시 호출될 핸들러
const handleModalSubmit = async (payload: FormData) => {
    if (!lectureId.value) {
        alert("메인 강의 ID를 찾을 수 없습니다.");
        return;
    }

    try {
        if (isEditing.value && editingSubItemId.value !== null) {
            // 세부 항목 수정 API 호출
            await apiClient.put(`/lecture/titles/${lectureId.value}/details/${editingSubItemId.value}`, payload, {
                headers: {"Content-Type": "multipart/form-data"},
            });
            alert("세부 항목이 수정되었습니다.");
        } else {
            // 세부 항목 추가 API 호출
            await apiClient.post(`/lecture/titles/${lectureId.value}/details`, payload, {
                headers: {"Content-Type": "multipart/form-data"},
            });
            alert("세부 항목이 추가되었습니다.");
        }
        showModal.value = false; // 모달 닫기
        await fetchLectureData(); // 데이터 다시 로딩
    } catch (error: any) {
        console.error("API 호출 오류:", error);
        const errorMessage = error.response?.data?.detail || "요청 처리 중 오류가 발생했습니다.";
        alert(errorMessage);
    }
};

const handleDelete = async (itemId: number) => {
    if (!lectureId.value) {
        alert("메인 강의 ID를 찾을 수 없습니다.");
        return;
    }
    if (window.confirm("정말로 이 세부 항목을 삭제하시겠습니까?")) {
        try {
            await apiClient.delete(`/lecture/titles/${lectureId.value}/details/${itemId}`);
            alert("세부 항목이 삭제되었습니다.");
            await fetchLectureData(); // 데이터 다시 로딩
        } catch (error: any) {
            console.error("API 호출 오류:", error);
            const errorMessage = error.response?.data?.detail || "삭제 중 오류가 발생했습니다.";
            alert(errorMessage);
        }
    }
};

onMounted(() => {
    fetchLectureData(); // 컴포넌트 마운트 시 데이터 로딩
});
</script>
