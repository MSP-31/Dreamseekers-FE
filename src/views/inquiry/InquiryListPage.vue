<template>
    <div class="font-[var(--font-body)]">
        <PageHeader title="강의 문의" backgroundImageUrl="/img/top_header/inquiry.jpg" />

        <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 class="text-3xl font-bold text-center mb-8 text-[var(--dream-text)]">
                {{ isStaff ? "문의 내역" : "내 문의 내역" }}
            </h1>

            <table class="min-w-full divide-y divide-gray-200 border-t border-b border-gray-300">
                <thead class="bg-gray-50">
                    <tr>
                        <th scope="col" class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">번호</th>
                        <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8/12">제목</th>
                        <th scope="col" class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">글쓴이</th>
                        <th scope="col" class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">작성일</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="(post, index) in posts" :key="post.pk" class="hover:bg-gray-100 cursor-pointer transition-colors duration-150" @click="goToDetail(post.pk)">
                        <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                            {{ pagination.count - pagination.start_index - index + 1 }}
                        </td>
                        <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-left">
                            <router-link :to="`/inquiry/${post.pk}`" class="hover:underline text-[var(--dream-text)] hover:text-[var(--dream-main)]">
                                {{ post.title }}
                            </router-link>
                        </td>
                        <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                            {{ post.author }}
                        </td>
                        <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                            {{ formatDate(post.created_at) }}
                        </td>
                    </tr>
                    <tr v-if="posts.length === 0">
                        <td colspan="4" class="px-4 py-8 text-center text-gray-500">표시할 문의 내역이 없습니다.</td>
                    </tr>
                </tbody>
            </table>

            <div class="mt-6 text-center">
                <router-link
                    to="/inquiry/write"
                    class="inline-block bg-[var(--dream-main)] hover:bg-opacity-80 text-white font-semibold py-2 px-6 rounded-md shadow-sm transition duration-150 ease-in-out"
                >
                    문의하기
                </router-link>
            </div>

            <!-- Pagination -->
            <div v-if="pagination.has_other_pages" class="paging-navi mt-8 flex justify-center">
                <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                        @click="changePage(pagination.previous_page_number)"
                        :disabled="!pagination.has_previous"
                        class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span class="sr-only">Previous</span>
                        <!-- Heroicon name: solid/chevron-left -->
                        <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                        </svg>
                    </button>

                    <button
                        v-for="page in pagination.custom_range"
                        :key="page"
                        @click="changePage(page)"
                        :aria-current="page === pagination.number ? 'page' : undefined"
                        class="relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                        :class="{
                            'z-10 bg-[var(--dream-main)] border-[var(--dream-main)] text-white': page === pagination.number,
                            'bg-white border-gray-300 text-gray-700 hover:bg-gray-50': page !== pagination.number,
                        }"
                    >
                        {{ page }}
                    </button>

                    <button
                        @click="changePage(pagination.next_page_number)"
                        :disabled="!pagination.has_next"
                        class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span class="sr-only">Next</span>
                        <!-- Heroicon name: solid/chevron-right -->
                        <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                        </svg>
                    </button>
                </nav>
            </div>

            <!-- Empty decorative divider -->
            <div class="mt-12 border-t border-[var(--dream-gray-dark)] opacity-30"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {ref, onMounted} from "vue";
import {useRouter} from "vue-router";
import PageHeader from "@/components/PageHeader.vue";
import {
    userStatus,
    dummyInquiryPosts,
    dummyPaginationData,
    dummyInquiryPostsPage2, // 예시: 2페이지 데이터
    dummyPaginationDataPage2, // 예시: 2페이지 페이지네이션 데이터
    type InquiryPost,
    type PaginationData,
} from "@/data/dummyData"; // dummyData.ts 경로에 맞게 수정

const router = useRouter();
const isStaff = ref(userStatus.isStaff);

// 실제 애플리케이션에서는 API 호출로 데이터를 가져옵니다.
// 여기서는 더미 데이터를 사용합니다.
const posts = ref<InquiryPost[]>([]);
const pagination = ref<PaginationData>({
    count: 0,
    start_index: 0,
    number: 0,
    has_other_pages: false,
    has_previous: false,
    has_next: false,
    previous_page_number: null,
    next_page_number: null,
    custom_range: [],
});

const loadInquiryData = (page: number = 1) => {
    // 실제 API 호출 로직
    console.log(`Loading inquiry data for page: ${page}`);

    // 더미 데이터 로딩 (페이지 번호에 따라 다른 더미 데이터 사용 예시)
    if (page === 1) {
        posts.value = [...dummyInquiryPosts];
        Object.assign(pagination.value, dummyPaginationData);
    } else if (page === 2) {
        posts.value = [...dummyInquiryPostsPage2];
        Object.assign(pagination.value, dummyPaginationDataPage2);
    } else {
        // 다른 페이지는 빈 데이터 또는 오류 처리
        posts.value = [];
        Object.assign(pagination.value, {
            count: dummyInquiryPosts.length,
            start_index: 0,
            number: page,
            has_other_pages: false,
            has_previous: true,
            has_next: false,
            previous_page_number: page - 1,
            next_page_number: null,
            custom_range: [1, 2], // 예시 범위 유지
        });
    }
};

const goToDetail = (pk: number) => {
    router.push(`/inquiry/${pk}`);
};

const changePage = (pageNumber: number | null) => {
    if (pageNumber !== null && pageNumber !== pagination.value.number) {
        // 실제 앱에서는 라우터 쿼리 파라미터를 변경하여 페이지를 로드합니다.
        // router.push({ query: { page: pageNumber } });
        // 여기서는 더미 데이터 로딩 함수를 직접 호출합니다.
        loadInquiryData(pageNumber);
        // 스크롤을 페이지 상단으로 이동 (선택적)
        window.scrollTo({top: 0, behavior: "smooth"});
    }
};

// 날짜 형식 변환 함수 (Django date 필터와 유사하게 YYYY.m.d 형식으로)
const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}.${month}.${day}`;
};

onMounted(() => {
    // 컴포넌트 마운트 시 초기 데이터 로드 (첫 페이지)
    // 실제 앱에서는 라우터 쿼리 파라미터(route.query.page)를 확인하여 해당 페이지 로드
    loadInquiryData(1); // 더미 데이터의 첫 페이지 로드
});
</script>

<style scoped>
/* 테이블 border-collapse와 border-spacing은 Tailwind 기본값 사용 또는 필요시 추가 */
/* .board-table thead th 스타일 */
thead th {
    background-color: #f8f8f8; /* bg-gray-50 */
    /* font-size: 20px; -> text-xs (Tailwind) 또는 text-base/lg 등 적절히 선택 */
    /* font-weight: normal; -> font-medium (Tailwind) */
    /* padding: 20px 0; -> px-4 py-3 (Tailwind) */
    /* border-bottom: 1px solid rgb(65, 64, 64); -> border-b border-gray-700 (Tailwind) */
    /* border-top: 2px solid rgb(37, 35, 35); -> border-t-2 border-gray-800 (Tailwind) */
}

/* .board-table tbody td 스타일 */
tbody td {
    /* border-top: 1px solid rgb(235, 230, 230); -> border-t border-gray-200 (Tailwind) */
    /* padding: 8px; -> px-4 py-4 (Tailwind) */
}

/* .paging-navi ul 스타일 */
.paging-navi ul {
    /* display: flex; justify-content: center; -> flex justify-center (Tailwind) */
}

/* .paging-navi li 스타일 */
.paging-navi li {
    /* margin:3px; -> mx-1 (Tailwind) */
}

/* .paging-navi li a 스타일 */
.paging-navi li a {
    /* text-decoration: none; -> no-underline (Tailwind) */
    /* color: black; -> text-black (Tailwind) */
}

/* .paging-navi li.active a 스타일 */
.paging-navi li.active a {
    /* color: red; -> text-red-500 (Tailwind) 또는 text-[var(--dream-main)] 등 */
}

/* .clickable-row:hover 스타일 */
.clickable-row:hover {
    /* background-color: var(--line-color-light); -> hover:bg-gray-100 (Tailwind) */
}
</style>
