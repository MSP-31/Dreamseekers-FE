<template>
    <PageLayout title="주요 강의" backgroundImageUrl="/img/top_header/lecture.webp">
        <h1 class="text-3xl font-bold text-center mb-8 text-[var(--dream-text)]">
            {{ searchQuery ? `"${searchQuery}" 검색 결과` : "전체 강의" }}
        </h1>

        <div class="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <form @submit.prevent="performSearch" class="w-full sm:w-auto flex-grow sm:max-w-md">
                <div class="relative">
                    <input
                        type="text"
                        v-model="searchInput"
                        placeholder="강의명을 입력해주세요"
                        class="search-text w-full pl-4 pr-10 py-2 border border-[var(--dream-gray-dark)] rounded-md shadow-sm focus:ring-[var(--dream-main)] focus:border-[var(--dream-main)]"
                    />
                    <button type="submit" class="search-image absolute inset-y-0 right-0 flex items-center pr-3">
                        <img src="/img/icon/search_black_24dp.svg" alt="검색" class="h-5 w-5 text-gray-400" />
                    </button>
                </div>
            </form>
            <button
                v-if="isAdmin"
                @click="openModal()"
                class="bg-[var(--dream-main)] hover:bg-opacity-80 text-white font-semibold py-2 px-6 rounded-md shadow-sm transition duration-150 ease-in-out w-full sm:w-auto"
            >
                강의 추가
            </button>
        </div>

        <div v-if="searchQuery && filteredLectures.length === 0" class="text-center text-gray-500 py-8">
            <p>"{{ searchQuery }}"에 대한 검색 결과가 없습니다.</p>
        </div>

        <ul v-else-if="filteredLectures.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <LectureCard v-for="lecture in filteredLectures" :key="lecture.id" :lecture="lecture" :is-staff="isAdmin" @open-modal="handleOpenModal" @edit="openModal" @delete="handleDelete" />
        </ul>
        <div v-else class="text-center text-gray-500 py-8">
            <p>표시할 강의가 없습니다.</p>
        </div>

        <div class="mt-12 border-t border-[var(--dream-gray-dark)] opacity-30"></div>

        <ReusableFormModal
            v-if="isAdmin"
            v-model:show="showModal"
            :modal-title="isEditing ? '강의 정보 수정' : '새 강의 추가'"
            :form-fields="formSchema"
            :initial-data="initialModalData"
            :submit-button-text="isEditing ? '수정 완료' : '등록'"
            @submit="handleModalSubmit"
        />
    </PageLayout>
    <LectureDetailModal v-model:show="isModalOpen" :modal-title="'강의 상세 정보'" :initial-data="modalData" :form-fields="formFields" @close="handleCloseModal" />
</template>

<script setup lang="ts">
import {ref, computed, onMounted} from "vue"; // onMounted 추가
import PageLayout from "@/components/common/PageLayout.vue";
import LectureCard from "@/components/main/LectureCard.vue";
import {lectureFormSchema, type LectureItem, type LectureFormData, type LectureFormSchemaField} from "@/data/dummyData";
import {useAuthStore} from "@/stores/auth";
import ReusableFormModal from "@/components/main/FormModal.vue";
import apiClient from "@/api";
import LectureDetailModal from "@/components/main/DetailModala.vue";

const authStore = useAuthStore();
const isAdmin = authStore.isAdmin;

const allLectures = ref<LectureItem[]>([]); // API에서 불러오므로 빈 배열로 시작

const searchInput = ref("");
const searchQuery = ref(""); // 실제 검색에 사용된 쿼리

const filteredLectures = computed(() => {
    if (!searchQuery.value) {
        return allLectures.value;
    }
    return allLectures.value.filter((lecture) => lecture.title.toLowerCase().includes(searchQuery.value.toLowerCase()) || lecture.contents.toLowerCase().includes(searchQuery.value.toLowerCase()));
});

const performSearch = () => {
    searchQuery.value = searchInput.value;
};

const showModal = ref(false);
const isEditing = ref(false);
const editingLectureId = ref<number | null>(null);

// ReusableFormModal에 전달할 초기 데이터
const initialModalData = ref<LectureFormData>({
    title: "",
    contents: "",
    image: null, // 이미지 필드도 포함
});

// 폼 스키마는 동일하게 사용
const formSchema = ref<LectureFormSchemaField[]>(lectureFormSchema);

const openModal = (lectureToEdit?: LectureItem) => {
    if (lectureToEdit && typeof lectureToEdit.id === "number") {
        isEditing.value = true;
        editingLectureId.value = lectureToEdit.id;
        initialModalData.value = {
            // initialModalData를 업데이트하여 자식 컴포넌트에 전달
            title: lectureToEdit.title,
            contents: lectureToEdit.contents,
            image: lectureToEdit.image || null, // 기존 이미지 URL 전달
        };
    } else {
        isEditing.value = false;
        editingLectureId.value = null;
        initialModalData.value = {...initialModalData.value, title: "", contents: "", image: null}; // 초기 데이터 리셋
    }
    showModal.value = true;
};

// ReusableFormModal에서 submit 이벤트가 발생했을 때 호출될 핸들러
const handleModalSubmit = async (payload: FormData) => {
    try {
        if (isEditing.value && editingLectureId.value !== null) {
            // 수정 API 호출
            await apiClient.put(`/lecture/titles/${editingLectureId.value}`, payload, {
                headers: {"Content-Type": "multipart/form-data"},
            });
            alert("강의 정보가 수정되었습니다.");
        } else {
            // 추가 API 호출
            await apiClient.post("/lecture/titles", payload, {
                headers: {"Content-Type": "multipart/form-data"},
            });
            alert("강의 정보가 추가되었습니다.");
        }
        showModal.value = false; // 모달 닫기 (ReusableFormModal에서도 닫히지만 명시적으로)
        await fetchLectures(); // 데이터 다시 로딩
    } catch (error: any) {
        console.error("API 호출 오류:", error);
        const errorMessage = error.response?.data?.detail || "요청 처리 중 오류가 발생했습니다.";
        alert(errorMessage);
    }
};

const handleDelete = async (lectureId: number) => {
    if (window.confirm("정말로 이 강의 정보를 삭제하시겠습니까?")) {
        try {
            await apiClient.delete(`/lecture/titles/${lectureId}`);
            alert("강의 정보가 삭제되었습니다.");
            await fetchLectures(); // 데이터 다시 로딩
        } catch (error: any) {
            console.error("API 호출 오류:", error);
            const errorMessage = error.response?.data?.detail || "삭제 중 오류가 발생했습니다.";
            alert(errorMessage);
        }
    }
};

// 강의 데이터를 서버에서 불러오는 함수
const fetchLectures = async () => {
    try {
        const response = await apiClient.get<LectureItem[]>("/lecture/titles");
        allLectures.value = response.data;
    } catch (error: any) {
        console.error("API 호출 오류:", error);
        if (error.response?.status === 400) {
            alert(error.response.data?.detail);
        } else if (error.response?.status === 404) {
            alert(error.response.data?.detail);
        } else {
            alert("강의 데이터를 불러오는 데 실패했습니다.");
        }
    }
};

const isModalOpen = ref(false);
const modalData = ref({});
const formFields = ref<LectureFormSchemaField[]>(lectureFormSchema); // formFields 정의

const handleOpenModal = (lecture: LectureItem) => {
    modalData.value = lecture;
    isModalOpen.value = true;
};

const handleCloseModal = () => {
    isModalOpen.value = false;
};

onMounted(() => {
    fetchLectures(); // 컴포넌트 마운트 시 강의 데이터 로딩
});
</script>
