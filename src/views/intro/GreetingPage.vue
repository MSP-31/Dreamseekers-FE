<template>
    <div>
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
            <h1 class="text-3xl font-bold text-center mb-10 text-gray-800">인사말</h1>

            <!-- Staff-only: Edit Button -->
            <div v-if="isStaff" class="text-right mb-6">
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

            <!-- Staff-only: Modal for Editing -->
            <div
                v-if="isStaff && showModal"
                class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-in-out"
                :class="{'opacity-100': showModal, 'opacity-0 pointer-events-none': !showModal}"
                @click.self="closeModal"
            >
                <div class="bg-white p-6 sm:p-8 rounded-lg shadow-2xl w-full max-w-2xl transform transition-all duration-300 ease-in-out" :class="{'scale-100': showModal, 'scale-95': !showModal}">
                    <div class="flex justify-between items-center mb-6">
                        <h3 class="text-xl font-semibold text-gray-800">인사말 수정</h3>
                        <button @click="closeModal" class="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
                    </div>
                    <form @submit.prevent="handleSubmit">
                        <table class="w-full">
                            <tbody>
                                <template v-for="field in formSchema" :key="field.name">
                                    <tr v-if="field.type === 'image'">
                                        <td colspan="2" class="py-3">
                                            <label :for="field.id" class="block text-sm font-medium text-gray-700 mb-1">{{ field.label }}</label>
                                            <label
                                                class="w-full flex flex-col items-center px-4 py-3 bg-white text-blue-600 rounded-lg shadow border border-blue-300 cursor-pointer hover:bg-blue-50 hover:text-blue-700 transition-colors"
                                            >
                                                <svg class="w-6 h-6" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                                    <path
                                                        d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z"
                                                    />
                                                </svg>
                                                <span class="mt-1 text-sm leading-normal">이미지 선택</span>
                                                <input :id="field.id" :name="field.name" type="file" accept="image/*" class="hidden" @change="handleImageUpload" />
                                            </label>
                                        </td>
                                    </tr>
                                    <tr v-if="field.type === 'image' && previewImageUrl">
                                        <td colspan="2" class="py-3">
                                            <p class="text-sm font-medium text-gray-700 mb-1">미리보기</p>
                                            <div class="border border-gray-300 p-2 rounded-md w-full max-w-md h-48 mx-auto flex items-center justify-center overflow-hidden relative">
                                                <img :src="previewImageUrl" alt="이미지 미리보기" class="max-h-full max-w-full object-contain rounded" />
                                                <button
                                                    type="button"
                                                    @click="removePreviewImage"
                                                    class="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs leading-none hover:bg-red-600"
                                                    title="이미지 제거"
                                                >
                                                    X
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr v-if="field.type !== 'image'">
                                        <th class="text-left py-3 pr-4 align-top">
                                            <label :for="field.id" class="block text-sm font-medium text-gray-700">{{ field.label }}</label>
                                        </th>
                                        <td class="py-3 w-full">
                                            <input
                                                v-if="field.type === 'text'"
                                                :type="field.type"
                                                :id="field.id"
                                                :name="field.name"
                                                v-model="formData[field.name]"
                                                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            />
                                            <textarea
                                                v-else-if="field.type === 'textarea'"
                                                :id="field.id"
                                                :name="field.name"
                                                v-model="formData[field.name]"
                                                rows="5"
                                                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm resize-none"
                                            ></textarea>
                                        </td>
                                    </tr>
                                </template>
                            </tbody>
                        </table>
                        <div class="text-right">
                            <button
                                type="button"
                                @click="closeModal"
                                class="mr-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-md shadow-sm transition duration-150 ease-in-out"
                            >
                                취소
                            </button>
                            <button type="submit" class="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md shadow-sm transition duration-150 ease-in-out">등록</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {ref, reactive, onMounted} from "vue";
import {greetingIntroData, greetingFormFields, userStatus, type IntroData, type FormField} from "@/data/dummyData";

const isStaff = ref(userStatus.isStaff);
const showModal = ref(false);

// 현재 페이지에 표시될 인사말 데이터 (초기값은 더미 데이터)
const currentIntroData = reactive<IntroData>({...greetingIntroData});

// 모달 내 폼 데이터
const formData = reactive<Record<string, any>>({});
const formSchema = ref<FormField[]>(greetingFormFields); // 폼 필드 스키마
const previewImageUrl = ref<string | null>(null);
const uploadedImageFile = ref<File | null>(null);

// 모달 열기: 현재 데이터를 폼에 채움
const openModal = () => {
    // 현재 currentIntroData를 기반으로 formData 초기화
    formSchema.value.forEach((field) => {
        if (field.name in currentIntroData) {
            formData[field.name] = currentIntroData[field.name as keyof IntroData];
        } else {
            formData[field.name] = ""; // 기본값
        }
    });
    previewImageUrl.value = currentIntroData.image; // 현재 이미지로 미리보기 설정
    uploadedImageFile.value = null; // 새 파일 선택을 위해 초기화
    showModal.value = true;
};

const closeModal = () => {
    showModal.value = false;
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
    }
};

const removePreviewImage = () => {
    previewImageUrl.value = null;
    uploadedImageFile.value = null;
    // 만약 input file 요소의 값을 초기화하고 싶다면, 해당 input 요소를 ref로 잡고 value를 ''로 설정해야 합니다.
    // 예: const imageInput = ref<HTMLInputElement|null>(null); imageInput.value.value = '';
};

const handleSubmit = () => {
    console.log("Form submitted with data:", formData);
    console.log("Uploaded image file:", uploadedImageFile.value);

    // 실제 애플리케이션에서는 여기서 API 호출을 통해 서버에 데이터를 전송합니다.
    // 예시: formData와 uploadedImageFile.value (FormData 객체에 담아서)를 서버로 전송

    // 성공적으로 제출되었다고 가정하고, currentIntroData를 업데이트합니다.
    currentIntroData.title = formData.title;
    currentIntroData.contents = formData.contents;
    if (previewImageUrl.value && uploadedImageFile.value) {
        // 새 이미지가 업로드된 경우
        // 실제로는 서버에서 반환된 새 이미지 URL을 사용해야 합니다.
        // 여기서는 로컬 미리보기 URL을 임시로 사용합니다.
        currentIntroData.image = previewImageUrl.value;
    } else if (!previewImageUrl.value && !uploadedImageFile.value) {
        // 이미지가 제거된 경우 (서버에 null 또는 빈 값으로 업데이트 요청)
        currentIntroData.image = "/img/dummy/placeholder.png"; // 기본 플레이스홀더 이미지
    }

    closeModal();
    // 성공 알림 등을 추가할 수 있습니다.
};

// 컴포넌트 마운트 시 초기화 (필요하다면)
onMounted(() => {
    // 초기 formData 설정 (openModal 시에도 수행되지만, 필요시 여기서도 가능)
    formSchema.value.forEach((field) => {
        if (field.name in currentIntroData) {
            formData[field.name] = currentIntroData[field.name as keyof IntroData];
        }
    });
});
</script>

<style scoped>
/* Tailwind CSS를 주로 사용하므로 scoped style은 최소화합니다. */
/* 필요한 경우 여기에 컴포넌트 특정 스타일을 추가할 수 있습니다. */
/* 예: 모달 트랜지션 */
.fixed.inset-0 {
    transition: opacity 0.3s ease-in-out;
}
.fixed.inset-0 > div {
    transition: transform 0.3s ease-in-out;
}
</style>
