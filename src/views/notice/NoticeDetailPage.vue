<template>
    <PageLayout title="소통 마당" backgroundImageUrl="/img/top_header/forum.jpg">
        <h1 class="text-3xl font-bold text-center mb-8 text-[var(--dream-text)]">공지사항</h1>
        <div v-if="post" class="max-w-3xl mx-auto">
            <div class="border-t-2 border-gray-700">
                <div class="board-title py-4 px-2 border-b border-gray-300 flex justify-between items-center">
                    <h3 class="text-xl font-semibold text-gray-800">{{ post.title }}</h3>
                    <span class="text-sm text-gray-500">{{ formatDate(post.created_at) }}</span>
                </div>

                <div class="board-content py-6 px-2 min-h-[200px]">
                    <p class="text-gray-700 leading-relaxed whitespace-pre-line">{{ post.contents }}</p>

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
import {ref, onMounted} from "vue";
import {useRoute, useRouter} from "vue-router";
import PageLayout from "@/components/layout/PageLayout.vue";
import {type NoticePost} from "@/types/pagination";
import {useAuthStore} from "@/stores/auth";
import apiClient from "@/api"; // API 클라이언트 임포트

const authStore = useAuthStore();
const isAdmin = authStore.isAdmin;

const route = useRoute();
const router = useRouter();

const post = ref<NoticePost | null>(null);

// 공지사항 상세 정보 불러오기 함수
const fetchNoticeDetail = async () => {
    const noticeId = route.params.id; // 라우트 파라미터에서 id 가져오기

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
        post.value = null; // 데이터를 가져오지 못하면 null로 설정
        // 사용자에게 오류 메시지를 표시하거나, 목록으로 리다이렉트하는 등의 처리
        alert(error.response?.data?.detail || "공지사항을 불러오는 데 실패했습니다.");
    }
};

onMounted(() => {
    fetchNoticeDetail(); // 컴포넌트 마운트 시 공지사항 상세 정보 불러오기
});

const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, "0")}.${date.getDate().toString().padStart(2, "0")}`;
};

const handleDelete = async () => {
    if (!post.value) {
        return; // 게시물이 없으면 삭제 시도하지 않음
    }

    if (window.confirm("정말로 이 공지사항을 삭제하시겠습니까?")) {
        try {
            await apiClient.delete(`/notice/${post.value.id}`); // id 사용
            alert("공지사항이 삭제되었습니다.");
            router.push("/notice"); // 삭제 성공 시 목록 페이지로 이동
        } catch (error: any) {
            console.error(`Error deleting notice ${post.value.id}:`, error);
            alert(error.response?.data?.detail || "공지사항 삭제에 실패했습니다.");
        }
    }
};
</script>
