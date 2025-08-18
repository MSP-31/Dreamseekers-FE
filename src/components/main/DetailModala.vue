<template>
    <BaseModal :show="show" :modalTitle="modalTitle" @update:show="closeModal">
        <template #content>
            <div class="space-y-6 text-left">
                <div v-for="field in formFields" :key="field.name">
                    <div v-if="field.type === 'image'">
                        <img :src="initialData[field.name] || '/img/dummy/placeholder-lecture.png'" :alt="initialData[field.name]" class="w-full h-48 object-cover rounded-md mb-4" />
                    </div>
                    <div v-else>
                        <label :for="field.id" class="block text-sm font-medium text-gray-700 mb-1 font-semibold">
                            {{ field.label }}
                        </label>
                        <h2 class="text-[var(--dream-text)]" v-if="field.type === 'text'">
                            {{ formData[field.name] }}
                        </h2>
                        <p class="text-[var(--dream-sub)] leading-relaxed" v-else-if="field.type === 'textarea'">
                            {{ formData[field.name] }}
                        </p>
                    </div>
                </div>
            </div>
        </template>
    </BaseModal>
</template>

<script setup lang="ts">
import {reactive, watch} from "vue";
import BaseModal from "@/components/common/BaseModal.vue";
import type {FormField} from "@/types/common";

// --- Props 정의 ---
const props = defineProps({
    show: {type: Boolean, default: false},
    modalTitle: {type: String, default: "상세 정보"},
    formFields: {type: Array as () => FormField[], required: true},
    initialData: {type: Object as () => Record<string, any>, default: () => ({})},
});

// --- Emits 정의 ---
// 모달 닫기 이벤트
const emit = defineEmits(["update:show", "submit"]);

// --- Internal State ---
const formData = reactive<Record<string, any>>({}); // 폼 입력 값

// --- Watcher: `show` prop이 변경될 때 폼 데이터 초기화 및 미리보기 설정 ---
watch(
    () => props.show,
    (newVal) => {
        if (newVal) {
            // 모달이 열릴 때만 초기화
            initializeFormData();
        }
    },
    {immediate: true} // 컴포넌트 마운트 시에도 한 번 실행
);

// --- Methods ---

// 폼 데이터 초기화
const initializeFormData = () => {
    // formData 초기화
    for (const key in formData) {
        delete formData[key];
    }

    props.formFields.forEach((field) => {
        if (field.type === "image") {
            formData[field.name] = null; // 초기에는 파일이 선택되지 않은 상태
        } else {
            // 텍스트 필드는 초기 데이터가 있으면 그 값으로, 없으면 빈 문자열
            formData[field.name] = props.initialData[field.name] !== undefined ? props.initialData[field.name] : field.type === "checkbox" ? false : "";
        }
    });
};

// 모달 닫기
const closeModal = () => {
    emit("update:show", false);
};
</script>
