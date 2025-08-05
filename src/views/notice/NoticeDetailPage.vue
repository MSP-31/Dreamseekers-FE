<template>
    <PageLayout title="소통 마당" background-image-url="/img/top_header/forum.jpg">
        <h1 class="text-3xl font-bold text-center mb-8 text-[var(--dream-text)]">공지사항</h1>
        <div v-if="post" class="max-w-3xl mx-auto">
            <div class="border-t-2 border-gray-700">
                <div class="board-title py-4 px-2 border-b border-gray-300 flex justify-between items-center">
                    <h3 class="text-xl font-semibold text-gray-800">{{ post.title }}</h3>
                    <span class="text-sm text-gray-500">{{ formatDate(post.created_at) }}</span>
                </div>

                <div class="board-content py-6 px-2 min-h-[200px]">
                    <div class="prose max-w-none" v-html="sanitizedContents"></div>

                    <div v-if="post.image_details && post.image_details.length > 0" class="mt-8 space-y-4">
                        <img v-for="(image, index) in post.image_details" :key="`image-${index}`" :src="image.image" :alt="post.title" class="max-w-full h-auto rounded-md shadow-md mx-auto" />
                    </div>

                    <div v-if="post.file_details && post.file_details.length > 0" class="mt-8 pt-4 border-t border-gray-200">
                        <h4 class="text-sm font-semibold text-gray-600 mb-2">첨부파일</h4>
                        <ul>
                            <li v-for="(file, index) in post.file_details" :key="`file-${index}`" class="mb-1">
                                <a :href="file.file" download class="file-download inline-flex items-center text-[var(--dream-blue)] hover:text-[var(--dream-main)] hover:underline text-sm">
                                    <img src="/img/icon/save_alt_black_24dp.svg" alt="다운로드" class="h-4 w-4 mr-1 opacity-70" />
                                    {{ file.name }}
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="mt-8 flex justify-end items-center space-x-3">
                <template v-if="isAdmin">
                    <router-link
                        :to="`/notice/edit/${post.id}`"
                        class="inline-block text-center text-sm font-medium py-2 px-4 rounded-md shadow-sm transition-colors duration-150 ease-in-out bg-gray-200 hover:bg-gray-300 text-gray-700"
                    >
                        수정
                    </router-link>
                    <button
                        @click="handleDelete"
                        class="inline-block text-center text-sm font-medium py-2 px-4 rounded-md shadow-sm transition-colors duration-150 ease-in-out bg-orange-500 hover:bg-orange-700 text-white"
                    >
                        삭제
                    </button>
                </template>
                <router-link
                    to="/notice/"
                    class="inline-block text-center text-sm font-medium py-2 px-4 rounded-md shadow-sm transition-colors duration-150 ease-in-out bg-gray-500 hover:bg-gray-600 text-white"
                >
                    목록
                </router-link>
            </div>
        </div>

        <div v-else class="text-center text-gray-500 py-16">
            <p>요청하신 공지사항을 찾을 수 없습니다.</p>
            <router-link to="/notice" class="text-[var(--dream-main)] hover:underline mt-4 inline-block"> 목록으로 돌아가기 </router-link>
        </div>

        <div class="mt-12 border-t border-[var(--dream-gray-dark)] opacity-30"></div>
    </PageLayout>
</template>

<script setup lang="ts">
import {ref, onMounted, computed} from "vue";
import {useRoute, useRouter} from "vue-router";
import PageLayout from "@/components/layout/PageLayout.vue";
import {type NoticePost} from "@/types/pagination";
import {useAuthStore} from "@/stores/auth";
import apiClient from "@/api";
import DOMPurify from "dompurify";

const authStore = useAuthStore();
const isAdmin = authStore.isAdmin;

const route = useRoute();
const router = useRouter();

const post = ref<NoticePost | null>(null);

const sanitizedContents = computed(() => {
    if (!post.value || !post.value.contents) {
        return "";
    }

    // DOMPurify의 `addHook`을 사용하여 정제 과정에서 <a> 태그 속성 조작
    DOMPurify.addHook("afterSanitizeAttributes", function (node) {
        // `href` 속성이 있고 `target` 속성이 없다면, `target="_blank"`를 추가
        if (node.tagName === "A" && "href" in node && !node.getAttribute("target")) {
            node.setAttribute("target", "_blank");
            node.setAttribute("rel", "noopener noreferrer");
        }
    });

    // DOMPurify로 콘텐츠 정제. 여기서 `addHook`이 실행됩니다.
    const cleanHTML = DOMPurify.sanitize(post.value.contents, {
        USE_PROFILES: {html: true},
        ADD_ATTR: ["target", "rel"], // `target`과 `rel` 속성을 허용 목록에 추가
    });

    // 후크를 제거하여 다른 정제 과정에 영향을 주지 않도록 합니다.
    DOMPurify.removeHook("afterSanitizeAttributes");

    return cleanHTML;
});

const fetchNoticeDetail = async () => {
    const noticeId = route.params.id;
    if (!noticeId) {
        console.error("Notice ID is missing.");
        post.value = null;
        return;
    }

    try {
        const response = await apiClient.get<NoticePost>(`/notice/${noticeId}`);
        post.value = response.data;
    } catch (error: any) {
        console.error(`Error fetching notice ${noticeId}:`, error);
        post.value = null;
        alert(error.response?.data?.detail || "공지사항을 불러오는 데 실패했습니다.");
    }
};

onMounted(() => {
    fetchNoticeDetail();
});

const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, "0")}.${date.getDate().toString().padStart(2, "0")}`;
};

const handleDelete = async () => {
    if (!post.value) {
        return;
    }

    if (window.confirm("정말로 이 공지사항을 삭제하시겠습니까?")) {
        try {
            await apiClient.delete(`/notice/${post.value.id}`);
            alert("공지사항이 삭제되었습니다.");
            router.push("/notice");
        } catch (error: any) {
            console.error(`Error deleting notice ${post.value.id}:`, error);
            alert(error.response?.data?.detail || "공지사항 삭제에 실패했습니다.");
        }
    }
};
</script>
