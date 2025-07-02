<template>
    <div class="font-[var(--font-body)]">
        <PageHeader title="소통 마당" backgroundImageUrl="/img/top_header/forum.jpg" />

        <div class="main-content">
            <div v-if="post" class="max-w-3xl mx-auto">
                <h1 class="text-3xl font-bold text-center mb-6 text-[var(--dream-text)]">공지사항</h1>

                <div class="border-t-2 border-gray-700">
                    <div class="board-title py-4 px-2 border-b border-gray-300 flex justify-between items-center">
                        <h3 class="text-xl font-semibold text-gray-800">{{ post.title }}</h3>
                        <span class="text-sm text-gray-500">{{ formatDate(post.created_at) }}</span>
                    </div>

                    <div class="board-content py-6 px-2 min-h-[200px]">
                        <p class="text-gray-700 leading-relaxed whitespace-pre-line">{{ post.contents }}</p>

                        <div v-if="post.images && post.images.length > 0" class="mt-8 space-y-4">
                            <img v-for="(image, index) in post.images" :key="`image-${index}`" :src="image.url" :alt="image.alt || post.title" class="max-w-full h-auto rounded-md shadow-md mx-auto" />
                        </div>

                        <div v-if="post.files && post.files.length > 0" class="mt-8 pt-4 border-t border-gray-200">
                            <h4 class="text-sm font-semibold text-gray-600 mb-2">첨부파일</h4>
                            <ul>
                                <li v-for="(file, index) in post.files" :key="`file-${index}`" class="mb-1">
                                    <a :href="file.url" download class="file-download inline-flex items-center text-[var(--dream-blue)] hover:text-[var(--dream-main)] hover:underline text-sm">
                                        <img src="/img/icon/save_alt_black_24dp.svg" alt="다운로드" class="h-4 w-4 mr-1 opacity-70" />
                                        {{ file.name }}
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="mt-8 flex justify-end items-center space-x-3">
                    <template v-if="isAuthorOrStaff">
                        <router-link
                            :to="`/notice/edit/${post.pk}`"
                            class="inline-block text-center text-sm font-medium py-2 px-4 rounded-md shadow-sm transition-colors duration-150 ease-in-out bg-gray-200 hover:bg-gray-300 text-gray-700"
                        >
                            수정
                        </router-link>
                        <button
                            @click="handleDelete"
                            class="inline-block text-center text-sm font-medium py-2 px-4 rounded-md shadow-sm transition-colors duration-150 ease-in-out bg-[var(--primary-warning)] hover:bg-[var(--primary-warning-strong)] text-white"
                        >
                            삭제
                        </button>
                    </template>
                    <router-link
                        to="/notice"
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
        </div>
    </div>
</template>

<script setup lang="ts">
import {ref, onMounted, computed} from "vue";
import {useRoute, useRouter} from "vue-router";
import PageHeader from "@/components/PageHeader.vue";
import {dummyImportantNotices, dummyNoticePosts, type NoticePost} from "@/data/dummyData";
import {useAuthStore} from "@/stores/auth";

const authStore = useAuthStore();
const isAdmin = authStore.isAdmin;

const route = useRoute();
const router = useRouter();

const post = ref<NoticePost | null>(null);

const isAuthorOrStaff = computed(() => {
    if (!post.value) return false;
    // 더미 데이터에는 author_id가 없으므로, isAdmin로만 판단하거나,
    // dummyNoticePosts의 author 필드를 ID로 가정하고 비교할 수 있습니다.
    // 여기서는 isAdmin만으로 판단합니다. 실제 앱에서는 post.author_id === currentUserId.value || isAdmin.value
    return isAdmin.value;
});

onMounted(() => {
    const postId = parseInt(route.params.pk as string, 10);
    const foundPost = dummyImportantNotices.find((p) => p.pk === postId) || dummyNoticePosts.find((p) => p.pk === postId);
    post.value = foundPost || null;
});

const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, "0")}.${date.getDate().toString().padStart(2, "0")}`;
};

const handleDelete = () => {
    if (post.value && window.confirm("정말로 이 공지사항을 삭제하시겠습니까?")) {
        console.log(`Deleting post with pk: ${post.value.pk}`);
        // 실제 애플리케이션에서는 여기서 API 호출
        // 성공 시 목록 페이지로 이동
        alert("공지사항이 삭제되었습니다."); // 임시 알림
        router.push("/notice");
    }
};
</script>
