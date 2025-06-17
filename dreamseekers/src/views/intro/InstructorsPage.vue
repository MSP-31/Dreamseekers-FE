<template>
    <div class="font-[var(--font-body)]">
        <!-- Top Image Section -->
        <div class="relative h-64 md:h-80 bg-gray-700">
            <!-- 실제 이미지 경로로 수정 필요. public 폴더 또는 assets에서 불러오도록 설정 -->
            <img src="/img/top_header/intro.jpg" alt="교육원 소개 배경 이미지" class="w-full h-full object-cover opacity-50" />
            <div class="absolute inset-0 flex items-center justify-center">
                <h1 class="text-white text-4xl md:text-5xl font-bold">교육원 소개</h1>
            </div>
        </div>

        <!-- Main Content Section -->
        <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 class="text-3xl font-bold text-center mb-10 text-[var(--dream-text)]">강사 소개</h1>

            <!-- Staff-only: Add Button -->
            <div v-if="isStaff" class="text-right mb-6">
                <button @click="openModal()" class="bg-[var(--dream-main)] hover:bg-opacity-80 text-white font-semibold py-2 px-6 rounded-md shadow-sm transition duration-150 ease-in-out">
                    강사 추가
                </button>
            </div>

            <!-- Instructors List -->
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

                    <!-- Staff-only: Edit/Delete Buttons -->
                    <div v-if="isStaff" class="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button @click="openModal(instructor)" class="bg-[var(--dream-blue)] hover:bg-opacity-80 text-white text-xs font-semibold py-1 px-3 rounded-md shadow-sm">수정</button>
                        <button @click="handleDelete(instructor.id)" class="bg-red-500 hover:bg-red-600 text-white text-xs font-semibold py-1 px-3 rounded-md shadow-sm">삭제</button>
                    </div>
                </li>
            </ul>

            <!-- Empty decorative divider (from original .board-title) -->
            <div class="mt-12 border-t border-[var(--dream-gray-dark)] opacity-30"></div>

            <!-- Staff-only: Modal for Adding/Editing Instructor -->
            <div
                v-if="isStaff && showModal"
                class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-in-out"
                :class="{'opacity-100': showModal, 'opacity-0 pointer-events-none': !showModal}"
                @click.self="closeModal"
            >
                <div class="bg-white p-6 sm:p-8 rounded-lg shadow-2xl w-full max-w-lg transform transition-all duration-300 ease-in-out" :class="{'scale-100': showModal, 'scale-95': !showModal}">
                    <div class="flex justify-between items-center mb-6">
                        <h3 class="text-xl font-semibold text-[var(--dream-text)]">{{ isEditing ? "강사 정보 수정" : "새 강사 추가" }}</h3>
                        <button @click="closeModal" class="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
                    </div>
                    <form @submit.prevent="handleSubmit">
                        <div class="space-y-4">
                            <template v-for="field in formSchema" :key="field.name">
                                <div v-if="field.type === 'text' || field.type === 'textarea'">
                                    <label :for="field.id" class="block text-sm font-medium text-[var(--dream-sub)] mb-1">{{ field.label }}</label>
                                    <input
                                        v-if="field.type === 'text'"
                                        :type="field.type"
                                        :id="field.id"
                                        v-model="formData[field.name as keyof InstructorFormData]"
                                        class="mt-1 block w-full px-3 py-2 border border-[var(--dream-gray-dark)] rounded-md shadow-sm focus:outline-none focus:ring-[var(--dream-main)] focus:border-[var(--dream-main)] sm:text-sm"
                                    />
                                    <textarea
                                        v-else-if="field.type === 'textarea'"
                                        :id="field.id"
                                        v-model="formData[field.name as keyof InstructorFormData]"
                                        rows="4"
                                        class="mt-1 block w-full px-3 py-2 border border-[var(--dream-gray-dark)] rounded-md shadow-sm focus:outline-none focus:ring-[var(--dream-main)] focus:border-[var(--dream-main)] sm:text-sm resize-none"
                                    ></textarea>
                                </div>

                                <div v-if="field.type === 'image'">
                                    <label class="block text-sm font-medium text-[var(--dream-sub)] mb-1">{{ field.label }}</label>
                                    <label
                                        class="mt-1 w-full flex flex-col items-center px-4 py-3 bg-white text-[var(--dream-blue)] rounded-lg shadow border border-[var(--dream-blue)] border-dashed cursor-pointer hover:bg-[var(--dream-gray)] hover:text-[var(--dream-main)] transition-colors"
                                    >
                                        <svg class="w-6 h-6" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                            <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                                        </svg>
                                        <span class="mt-1 text-xs leading-normal">{{ uploadedImageFile ? uploadedImageFile.name : "이미지 선택 (클릭 또는 드래그)" }}</span>
                                        <input :id="field.id" type="file" accept="image/*" class="hidden" @change="handleImageUpload" />
                                    </label>
                                    <div v-if="previewImageUrl" class="mt-3 text-center">
                                        <p class="text-xs font-medium text-[var(--dream-sub)] mb-1">미리보기</p>
                                        <div class="border border-gray-300 p-2 rounded-md w-full max-w-xs h-40 mx-auto flex items-center justify-center overflow-hidden relative bg-gray-50">
                                            <img :src="previewImageUrl" alt="이미지 미리보기" class="max-h-full max-w-full object-contain rounded" />
                                            <button
                                                type="button"
                                                @click="removePreviewImage"
                                                class="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 w-5 h-5 flex items-center justify-center text-xs leading-none hover:bg-red-600"
                                                title="이미지 제거"
                                            >
                                                X
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </div>
                        <div class="mt-8 text-right space-x-3">
                            <button
                                type="button"
                                @click="closeModal"
                                class="bg-[var(--dream-gray-dark)] hover:bg-opacity-80 text-white font-semibold py-2 px-4 rounded-md shadow-sm transition duration-150 ease-in-out"
                            >
                                취소
                            </button>
                            <button type="submit" class="bg-[var(--dream-main)] hover:bg-opacity-80 text-white font-semibold py-2 px-4 rounded-md shadow-sm transition duration-150 ease-in-out">
                                {{ isEditing ? "수정 완료" : "등록" }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {ref, reactive, onMounted} from "vue";
import {
    instructorsListData,
    instructorFormSchema,
    userStatus, // dummyData.ts에 userStatus가 정의되어 있다고 가정
    type Instructor,
    type InstructorFormData,
    type InstructorFormField,
} from "@/data/dummyData"; // dummyData.ts 경로에 맞게 수정

const isStaff = ref(userStatus.isStaff);
const instructors = ref<Instructor[]>([...instructorsListData]); // 더미 데이터로 초기화

const showModal = ref(false);
const isEditing = ref(false);
const editingInstructorId = ref<number | null>(null);

const initialFormData: InstructorFormData = {
    name: "",
    contents: "",
};
const formData = reactive<InstructorFormData>({...initialFormData});
const formSchema = ref<InstructorFormField[]>(instructorFormSchema);

const previewImageUrl = ref<string | null>(null);
const uploadedImageFile = ref<File | null>(null);

const openModal = (instructor?: Instructor) => {
    if (instructor) {
        isEditing.value = true;
        editingInstructorId.value = instructor.id;
        formData.name = instructor.name;
        formData.contents = instructor.contents;
        previewImageUrl.value = instructor.image || null; // 기존 이미지로 미리보기 설정
    } else {
        isEditing.value = false;
        editingInstructorId.value = null;
        Object.assign(formData, initialFormData); // 폼 데이터 초기화
        previewImageUrl.value = null;
    }
    uploadedImageFile.value = null; // 새 파일 선택을 위해 항상 초기화
    showModal.value = true;
};

const closeModal = () => {
    showModal.value = false;
    // 모달이 닫힐 때 폼 관련 상태 초기화 (선택적)
    isEditing.value = false;
    editingInstructorId.value = null;
    Object.assign(formData, initialFormData);
    previewImageUrl.value = null;
    uploadedImageFile.value = null;
};

const handleImageUpload = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
        const file = target.files[0];
        uploadedImageFile.value = file;
        const reader = new FileReader();
        reader.onload = (e) => {
            previewImageUrl.value = e.target?.result as string;
        };
        reader.readAsDataURL(file);
        target.value = ""; // 같은 파일 다시 선택 가능하도록
    }
};

const removePreviewImage = () => {
    previewImageUrl.value = null;
    uploadedImageFile.value = null;
    // 만약 실제 input file 요소의 값을 초기화하고 싶다면, 해당 input 요소를 ref로 잡고 value를 ''로 설정해야 합니다.
    // (위 handleImageUpload에서 target.value = ''로 처리)
};

const handleSubmit = () => {
    // 실제 애플리케이션에서는 여기서 API 호출
    console.log("Form submitted:", formData);
    console.log("Uploaded image:", uploadedImageFile.value);

    let newImageURL = previewImageUrl.value; // 기본적으로 현재 미리보기 URL 사용

    if (uploadedImageFile.value) {
        // 새 이미지가 업로드된 경우, 실제로는 서버 업로드 후 반환된 URL을 사용해야 합니다.
        // 여기서는 로컬 미리보기 URL을 그대로 사용하거나, 임시 URL을 생성합니다.
        // 예: newImageURL = URL.createObjectURL(uploadedImageFile.value); (컴포넌트 unmount시 revoke 필요)
        // 지금은 previewImageUrl을 그대로 사용합니다.
        newImageURL = previewImageUrl.value;
    } else if (!previewImageUrl.value && isEditing.value) {
        // 이미지가 제거된 경우 (수정 모드에서)
        newImageURL = "/img/dummy/placeholder-avatar.png"; // 기본 플레이스홀더 또는 null
    }

    if (isEditing.value && editingInstructorId.value !== null) {
        // 수정
        const index = instructors.value.findIndex((instr) => instr.id === editingInstructorId.value);
        if (index !== -1) {
            instructors.value[index] = {
                ...instructors.value[index],
                name: formData.name,
                contents: formData.contents,
                image: newImageURL || instructors.value[index].image, // 이미지가 변경되었으면 새 URL, 아니면 기존 URL
            };
        }
    } else {
        // 추가
        const newId = instructors.value.length > 0 ? Math.max(...instructors.value.map((i) => i.id)) + 1 : 1;
        instructors.value.push({
            id: newId,
            name: formData.name,
            contents: formData.contents,
            image: newImageURL || "/img/dummy/placeholder-avatar.png",
        });
    }
    closeModal();
};

const handleDelete = (instructorId: number) => {
    if (window.confirm("정말로 이 강사 정보를 삭제하시겠습니까?")) {
        // 실제 애플리케이션에서는 여기서 API 호출
        console.log("Deleting instructor:", instructorId);
        instructors.value = instructors.value.filter((instr) => instr.id !== instructorId);
        // 성공 알림 등
    }
};

onMounted(() => {
    // 페이지 로드 시 초기 데이터 로딩 (필요하다면 API 호출)
    // 현재는 dummyData를 직접 사용
});
</script>

<style scoped>
/* Tailwind CSS를 주로 사용하므로 scoped style은 최소화합니다. */
/* 필요한 경우 여기에 컴포넌트 특정 스타일을 추가할 수 있습니다. */
.font-\[var\(--font-body\)\] {
    /* Tailwind JIT가 CSS 변수를 인식하도록 이스케이프 처리 */
    font-family: var(--font-body);
}

/* 모달 트랜지션 (GreetingPage와 유사) */
.fixed.inset-0 {
    transition: opacity 0.3s ease-in-out;
}
.fixed.inset-0 > div {
    /* 모달 컨텐츠 div */
    transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
}
</style>
