<template>
    <PageLayout title="교육원 소개" backgroundImageUrl="/img/top_header/intro.jpg">
        <div v-if="isAdmin" class="text-right mb-6">
            <router-link to="/intro/greeting/edit" class="bg-[var(--dream-main)] hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow-sm transition duration-150 ease-in-out"
                >수정</router-link
            >
        </div>

        <div class="flex flex-col lg:flex-row items-start gap-8 p-6 bg-white shadow-lg rounded-lg">
            <img :src="currentIntroData.image" alt="대표 이미지" class="w-full lg:w-1/3 h-auto object-cover rounded-md shadow" />
            <div class="lg:w-2/3">
                <div class="prose max-w-none" v-html="sanitizedContents"></div>
            </div>
        </div>

        <!-- Empty decorative divider (from original .board-title) -->
        <div class="mt-12 border-t border-gray-200"></div>
    </PageLayout>
</template>

<script setup lang="ts">
import {reactive, onMounted, computed} from "vue";
import {useAuthStore} from "@/stores/auth";
import PageLayout from "@/components/layout/PageLayout.vue";
import {IntroData} from "@/types/common";
import DOMPurify from "dompurify";
import apiClient from "@/api";

const authStore = useAuthStore();
const isAdmin = authStore.isAdmin;

// 현재 페이지에 표시될 인사말 데이터 (초기값은 더미 데이터)
const currentIntroData = reactive<IntroData>({
    contents: "",
    image: "",
    id: 0,
    title: "",
});

const fetchData = async () => {
    try {
        const response = await apiClient.get("/intro/greeting");
        console.log(response);
        currentIntroData.contents = response.data.contents;
        currentIntroData.image = response.data.image; // 서버에서 반환된 새 이미지 URL 업데이트
    } catch (error: any) {
        console.error("API 호출 오류:", error);
        const errorMessage = error.response?.data?.detail || error.response?.data?.message || "요청 처리 중 오류가 발생했습니다.";
        alert(errorMessage);
    }
};

const sanitizedContents = computed(() => {
    // DOMPurify 설정: 링크를 새 탭에서 열도록 `target="_blank"` 속성을 허용합니다.
    DOMPurify.addHook("afterSanitizeAttributes", function (node) {
        if (node.tagName === "A" && "href" in node && !node.getAttribute("target")) {
            node.setAttribute("target", "_blank");
            node.setAttribute("rel", "noopener noreferrer");
        }
    });

    const cleanHTML = DOMPurify.sanitize(currentIntroData.contents, {
        USE_PROFILES: {html: true},
        ADD_ATTR: ["target", "rel"],
    });

    // 훅을 제거하여 다른 정제 과정에 영향을 주지 않도록 합니다.
    DOMPurify.removeHook("afterSanitizeAttributes");

    return cleanHTML;
});

// 컴포넌트 마운트 시 초기화
onMounted(() => {
    fetchData();
});
</script>
