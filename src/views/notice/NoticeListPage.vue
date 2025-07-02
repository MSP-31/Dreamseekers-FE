<template>
    <div class="font-[var(--font-body)]">
        <PageHeader title="소통 마당" backgroundImageUrl="/img/top_header/forum.jpg" />

        <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 class="text-3xl font-bold text-center mb-8 text-[var(--dream-text)]">공지사항</h1>

            <!-- Search Form -->
            <form @submit.prevent="performSearch" class="mb-8 max-w-xl mx-auto">
                <div class="flex items-center border border-gray-300 rounded-md shadow-sm overflow-hidden">
                    <select v-model="searchType" class="px-3 py-2 border-r border-gray-300 bg-gray-50 text-sm text-gray-700 focus:outline-none">
                        <option v-for="type in searchTypes" :key="type.value" :value="type.value">
                            {{ type.text }}
                        </option>
                    </select>
                    <input
                        type="text"
                        v-model="searchQueryInput"
                        placeholder="검색어를 입력해주세요"
                        class="flex-grow px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--dream-main)]"
                    />
                    <button type="submit" class="px-4 py-2 bg-[var(--dream-main)] text-white hover:bg-opacity-80 transition-colors">
                        <img src="/img/icon/search_black_24dp.svg" alt="검색" class="h-5 w-5" />
                    </button>
                </div>
            </form>

            <div v-if="currentSearchQuery" class="text-center text-sm text-gray-600 mb-6">
                "'{{ currentSearchQuery }}' 검색 결과입니다. <button @click="clearSearch" class="ml-2 text-[var(--dream-blue)] hover:underline text-xs">(검색 초기화)</button>"
            </div>

            <table class="min-w-full divide-y divide-gray-200 border-t border-b border-gray-300">
                <thead class="bg-gray-50">
                    <tr>
                        <th scope="col" class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-16">번호</th>
                        <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">제목</th>
                        <th scope="col" class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24">글쓴이</th>
                        <th scope="col" class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-32">작성일</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    <!-- Important Notices -->
                    <tr
                        v-for="post in importantNotices"
                        :key="`important-${post.pk}`"
                        class="hover:bg-gray-100 cursor-pointer transition-colors duration-150 bg-yellow-50 font-semibold"
                        @click="goToDetail(post.pk)"
                    >
                        <td class="px-4 py-3 whitespace-nowrap text-sm text-center">
                            <span class="inline-flex items-center justify-center text-[var(--dream-main)]">
                                <img src="/img/icon/campaign_black_24dp.svg" alt="중요" class="h-5 w-5 mr-1 opacity-70" />
                            </span>
                        </td>
                        <td class="px-4 py-3 whitespace-nowrap text-sm text-left">
                            <router-link :to="`/notice/${post.pk}`" class="hover:underline text-[var(--dream-text)] hover:text-[var(--dream-main)]">
                                {{ post.title }}
                            </router-link>
                        </td>
                        <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-center">{{ post.author }}</td>
                        <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-center">{{ formatDate(post.created_at) }}</td>
                    </tr>

                    <!-- Regular Notices -->
                    <tr v-for="(post, index) in regularNotices" :key="post.pk" class="hover:bg-gray-100 cursor-pointer transition-colors duration-150" @click="goToDetail(post.pk)">
                        <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-center">
                            {{ pagination.count - pagination.start_index - index + 1 }}
                        </td>
                        <td class="px-4 py-3 whitespace-nowrap text-sm text-left">
                            <router-link :to="`/notice/${post.pk}`" class="hover:underline text-[var(--dream-text)] hover:text-[var(--dream-main)]">
                                {{ post.title }}
                            </router-link>
                        </td>
                        <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-center">{{ post.author }}</td>
                        <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-center">{{ formatDate(post.created_at) }}</td>
                    </tr>

                    <tr v-if="importantNotices.length === 0 && regularNotices.length === 0">
                        <td colspan="4" class="px-4 py-8 text-center text-gray-500">표시할 공지사항이 없습니다.</td>
                    </tr>
                </tbody>
            </table>

            <div v-if="isAdmin" class="mt-6 text-right">
                <router-link to="/notice/write" class="inline-block bg-[var(--dream-main)] hover:bg-opacity-80 text-white font-semibold py-2 px-6 rounded-md shadow-sm"> 글쓰기 </router-link>
            </div>

            <!-- Pagination -->
            <div v-if="pagination.has_other_pages" class="mt-8 flex justify-center">
                <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                        @click="changePage(pagination.previous_page_number)"
                        :disabled="!pagination.has_previous"
                        class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                        <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                        </svg>
                    </button>
                    <button
                        v-for="page in pagination.custom_range"
                        :key="page"
                        @click="changePage(page)"
                        :class="[
                            'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                            page === pagination.number ? 'z-10 bg-[var(--dream-main)] border-[var(--dream-main)] text-white' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50',
                        ]"
                    >
                        {{ page }}
                    </button>
                    <button
                        @click="changePage(pagination.next_page_number)"
                        :disabled="!pagination.has_next"
                        class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                        <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                        </svg>
                    </button>
                </nav>
            </div>

            <div class="mt-12 border-t border-[var(--dream-gray-dark)] opacity-30"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {ref, onMounted} from "vue";
import {useRouter} from "vue-router";
import PageHeader from "@/components/PageHeader.vue";
import {dummyImportantNotices, dummyNoticePosts, dummyNoticePaginationData, noticeSearchTypes, type NoticePost, type PaginationData} from "@/data/dummyData";
import {useAuthStore} from "@/stores/auth";

const authStore = useAuthStore();
const isAdmin = authStore.isAdmin;

const router = useRouter();

const importantNotices = ref<NoticePost[]>([]);
const regularNotices = ref<NoticePost[]>([]);
const pagination = ref<PaginationData>({...dummyNoticePaginationData}); // Initialize with a default structure

const searchTypes = ref(noticeSearchTypes);
const searchType = ref(noticeSearchTypes[0].value); // Default to 'all'
const searchQueryInput = ref("");
const currentSearchQuery = ref("");
const currentSearchType = ref("");

const ITEMS_PER_PAGE = 5; // 페이지당 항목 수 (더미 데이터 로직용)

const loadNoticeData = (page: number = 1, query: string = "", type: string = "all") => {
    console.log(`Loading notices: page=${page}, query=${query}, type=${type}`);
    currentSearchQuery.value = query;
    currentSearchType.value = type;

    // 중요 공지는 항상 모두 표시 (검색과 무관하게)
    importantNotices.value = [...dummyImportantNotices];

    // 일반 공지 필터링 및 페이지네이션 (더미 데이터 기준)
    let filteredPosts = [...dummyNoticePosts];
    if (query) {
        filteredPosts = dummyNoticePosts.filter((post) => {
            const qLower = query.toLowerCase();
            if (type === "title") return post.title.toLowerCase().includes(qLower);
            if (type === "contents") return true; // 더미 데이터에는 contents가 없으므로, 실제로는 contents 검색
            return post.title.toLowerCase().includes(qLower); // 'all' or unhandled type
        });
    }

    const totalFiltered = filteredPosts.length;
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    regularNotices.value = filteredPosts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    // 페이지네이션 정보 업데이트
    pagination.value = {
        count: totalFiltered,
        start_index: startIndex + 1,
        number: page,
        has_other_pages: totalFiltered > ITEMS_PER_PAGE * page || page > 1,
        has_previous: page > 1,
        has_next: totalFiltered > ITEMS_PER_PAGE * page,
        previous_page_number: page > 1 ? page - 1 : null,
        next_page_number: totalFiltered > ITEMS_PER_PAGE * page ? page + 1 : null,
        custom_range: Array.from({length: Math.ceil(totalFiltered / ITEMS_PER_PAGE)}, (_, i) => i + 1).slice(0, 5), // 예시: 최대 5개
    };
};

const performSearch = () => {
    // router.push({ query: { q: searchQueryInput.value, type: searchType.value, page: '1' } });
    // 위 라우터 푸시 후 watch(route.query, ...) 로 loadNoticeData 호출 또는 직접 호출
    loadNoticeData(1, searchQueryInput.value, searchType.value);
};

const clearSearch = () => {
    searchQueryInput.value = "";
    searchType.value = noticeSearchTypes[0].value;
    // router.push({ query: { page: '1' } }); // 검색어 없이 1페이지로
    loadNoticeData(1);
};

const goToDetail = (pk: number) => {
    router.push(`/notice/${pk}`); // 실제 공지사항 상세 페이지 경로로 수정
};

const changePage = (pageNumber: number | null) => {
    if (pageNumber !== null && pageNumber !== pagination.value.number) {
        // router.push({ query: { ...route.query, page: pageNumber.toString() } });
        loadNoticeData(pageNumber, currentSearchQuery.value, currentSearchType.value);
        window.scrollTo({top: 0, behavior: "smooth"});
    }
};

const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, "0")}.${date.getDate().toString().padStart(2, "0")}`;
};

onMounted(() => {
    // const initialPage = parseInt(route.query.page as string || '1', 10);
    // const initialQuery = route.query.q as string || '';
    // const initialType = route.query.type as string || noticeSearchTypes[0].value;
    // searchQueryInput.value = initialQuery;
    // searchType.value = initialType;
    loadNoticeData(1); // 초기 로드 (라우터 쿼리 파싱 로직은 주석 처리)
});

// Vue Router의 쿼리 변경을 감지하여 데이터 다시 로드 (실제 앱에서 사용)
// import { watch } from 'vue';
// watch(() => route.query, (newQuery) => {
//   const page = parseInt(newQuery.page as string || '1', 10);
//   const query = newQuery.q as string || '';
//   const type = newQuery.type as string || noticeSearchTypes[0].value;
//   searchQueryInput.value = query; // 검색창에도 반영
//   searchType.value = type;       // 검색 타입에도 반영
//   loadNoticeData(page, query, type);
// }, { deep: true });
</script>
