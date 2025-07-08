<template>
    <PageLayout title="교육원 소개" backgroundImageUrl="/img/top_header/intro.jpg">
        <div v-if="isAdmin" class="text-right mb-6">
            <button @click="openModal()" class="bg-[var(--dream-main)] hover:bg-opacity-80 text-white font-semibold py-2 px-6 rounded-md shadow-sm transition duration-150 ease-in-out">
                강사 추가
            </button>
        </div>

        <ul class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <li
                v-for="instructor in instructors"
                :key="instructor.id"
                class="bg-white shadow-xl rounded-lg p-6 flex flex-col items-center text-center transition-all duration-300 hover:shadow-2xl relative group"
            >
                <img
                    :src="instructor.image || '/img/dummy/placeholder-avatar.png'"
                    :alt="instructor.name"
                    class="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover mb-5 shadow-lg border-4 border-white"
                />
                <h2 class="text-xl font-semibold text-[var(--dream-text)] mb-2">{{ instructor.name }}</h2>
                <p class="text-sm text-[var(--dream-sub)] leading-relaxed whitespace-pre-line flex-grow">{{ instructor.contents }}</p>

                <div v-if="isAdmin" class="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button @click="openModal(instructor)" class="bg-[var(--dream-blue)] hover:bg-opacity-80 text-white text-xs font-semibold py-1 px-3 rounded-md shadow-sm">수정</button>
                    <button @click="handleDelete(instructor.id)" class="bg-red-500 hover:bg-red-600 text-white text-xs font-semibold py-1 px-3 rounded-md shadow-sm">삭제</button>
                </div>
            </li>
        </ul>

        <div class="mt-12 border-t border-[var(--dream-gray-dark)] opacity-30"></div>

        <ReusableFormModal
            v-if="isAdmin"
            v-model:show="showModal"
            :modal-title="isEditing ? '강사 정보 수정' : '새 강사 추가'"
            :form-fields="formSchema"
            :initial-data="initialModalData"
            :submit-button-text="isEditing ? '수정 완료' : '등록'"
            @submit="handleModalSubmit"
        />
    </PageLayout>
</template>

<script setup lang="ts">
import {ref, onMounted} from "vue";
import {type Instructor, type LectureFormData, type InstructorFormField} from "@/data/dummyData";
import {useAuthStore} from "@/stores/auth";
import PageLayout from "@/components/layout/PageLayout.vue";
import ReusableFormModal from "@/components/layout/ReusableFormModal.vue";
import apiClient from "@/api";

const authStore = useAuthStore();
const isAdmin = authStore.isAdmin;

const instructors = ref<Instructor[]>([]);

const showModal = ref(false);
const isEditing = ref(false);
const editingInstructorId = ref<number | null>(null);

// 모달 초기 데이터는 이제 initialData prop으로 전달되므로,
// formData의 초기 상태를 직접 다루는 대신 initialModalData를 설정합니다.
const initialModalData = ref<LectureFormData>({
    name: "",
    contents: "",
    image: null, // 이미지 필드의 초기값도 고려
});

const formSchema: InstructorFormField[] = [
    {id: "name", name: "name", label: "강사명", type: "text"},
    {id: "contents", name: "contents", label: "소개", type: "textarea"},
    {id: "image", name: "image", label: "프로필 이미지", type: "image"},
];

const openModal = (instructor?: Instructor) => {
    if (instructor) {
        // 수정 모드
        isEditing.value = true;
        editingInstructorId.value = instructor.id;
        initialModalData.value = {
            // initialModalData를 업데이트하여 자식 컴포넌트에 전달
            name: instructor.name,
            contents: instructor.contents,
            image: instructor.image, // 기존 이미지 URL을 전달
        };
    } else {
        // 추가 모드
        isEditing.value = false;
        editingInstructorId.value = null;
        initialModalData.value = {...initialModalData.value, ...{name: "", contents: "", image: null}}; // 초기 데이터 리셋
    }
    showModal.value = true;
};

// ReusableFormModal에서 'submit' 이벤트가 발생했을 때 호출될 핸들러
const handleModalSubmit = async (payload: FormData) => {
    try {
        if (isEditing.value && editingInstructorId.value !== null) {
            // 수정
            await apiClient.put(`/intro/instructors/${editingInstructorId.value}`, payload, {
                headers: {"Content-Type": "multipart/form-data"},
            });
            alert("강사 정보가 수정되었습니다.");
        } else {
            // 추가
            await apiClient.post("/intro/instructors", payload, {
                headers: {"Content-Type": "multipart/form-data"},
            });
            alert("강사 정보가 추가되었습니다.");
        }
        // 모달은 ReusableFormModal 내부에서 자동으로 닫힙니다.
        await fetchData(); // 데이터 다시 로딩
    } catch (error: any) {
        console.error("API 호출 오류:", error);
        const errorMessage = error.response?.data?.detail || "요청 처리 중 오류가 발생했습니다.";
        alert(errorMessage);
    }
};

const handleDelete = async (instructorId: number) => {
    if (window.confirm("정말로 이 강사 정보를 삭제하시겠습니까?")) {
        try {
            await apiClient.delete(`/intro/instructors/${instructorId}`);
            alert("강사 정보가 삭제되었습니다.");
            await fetchData(); // 데이터 다시 로딩
        } catch (error: any) {
            console.error("API 호출 오류:", error);
            const errorMessage = error.response?.data?.detail || "삭제 중 오류가 발생했습니다.";
            alert(errorMessage);
        }
    }
};

const fetchData = async () => {
    try {
        const response = await apiClient.get<Instructor[]>("/intro/instructors");
        instructors.value = response.data;
    } catch (error: any) {
        console.error("API 호출 오류:", error);
        if (error.response?.status === 400) {
            alert(error.response.data?.detail);
        } else if (error.response?.status === 404) {
            alert(error.response.data?.detail);
        } else {
            alert("데이터 로딩에 실패했습니다.");
        }
    }
};

onMounted(() => {
    fetchData();
});
</script>
