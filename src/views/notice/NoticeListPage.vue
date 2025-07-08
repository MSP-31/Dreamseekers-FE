<template>
    <PageLayout title="소통 마당" backgroundImageUrl="/img/top_header/forum.jpg">
        <SearchBar :initial-search-query="currentSearchQuery" :initial-search-type="currentSearchType" @search="handleSearch" @clear-search="handleClearSearch" />

        <DynamicTable :headers="tableHeaders" :items="displayNotices" :pagination="pagination" @change-page="changePage" @go-to-detail="goToDetail">
            <template #cell-number="{item, index, pagination}">
                <span v-if="item.is_important" class="inline-flex items-center justify-center text-[var(--dream-main)]">
                    <img src="/img/icon/campaign_black_24dp.svg" alt="중요" class="h-5 w-5 mr-1 opacity-70" />
                </span>
                <span v-else>
                    {{ pagination.count - (pagination.current_page - 1) * pagination.items_per_page - (index - importantNotices.length) }}
                </span>
            </template>

            <template #cell-title="{item}">
                <router-link :to="`/notice/${item.id}`" class="hover:underline text-[var(--dream-text)] hover:text-[var(--dream-main)]">
                    {{ item.title }}
                </router-link>
            </template>
        </DynamicTable>

        <div v-if="isAdmin" class="mt-6 text-right">
            <router-link to="/notice/write" class="inline-block bg-[var(--dream-main)] hover:bg-opacity-80 text-white font-semibold py-2 px-6 rounded-md shadow-sm"> 글쓰기 </router-link>
        </div>
    </PageLayout>
</template>

<script setup lang="ts">
import {ref, onMounted, watch, computed} from "vue";
import {useRouter, useRoute} from "vue-router";
import PageLayout from "@/components/layout/PageLayout.vue";
import SearchBar from "@/components/layout/SearchBar.vue";
import DynamicTable from "@/components/layout/DynamicTable.vue";
import {type TableHeader} from "@/components/layout/DynamicTable.vue";
import {type NoticePost, type PaginatedResponse, type PaginationState} from "@/types/pagination";
import {useAuthStore} from "@/stores/auth";
import apiClient from "@/api";

const authStore = useAuthStore();
const isAdmin = authStore.isAdmin;

const router = useRouter();
const route = useRoute();

// 모든 공지사항 데이터를 한 번에 가져와 저장할 ref
const allFetchedNotices = ref<NoticePost[]>([]);

// 중요 공지와 일반 공지를 각각 분류할 computed 속성
const importantNotices = computed(() => {
    return allFetchedNotices.value
        .filter((post) => post.is_important)
        .map((post) => ({
            ...post,
            author: typeof post.author === "object" && post.author !== null && "username" in post.author ? post.author.username : "Unknown",
            created_at_formatted: formatDate(post.created_at),
        }));
});

const regularNotices = computed(() => {
    return allFetchedNotices.value
        .filter((post) => !post.is_important)
        .map((post) => ({
            ...post,
            author: typeof post.author === "object" && post.author !== null && "username" in post.author ? post.author.username : "Unknown",
            created_at_formatted: formatDate(post.created_at),
        }));
});

// 최종적으로 테이블에 표시할 데이터 (중요 공지 + 일반 공지)
const displayNotices = computed(() => {
    // 중요한 공지를 먼저 배치하고 그 뒤에 일반 공지를 배치
    return [...importantNotices.value, ...regularNotices.value];
});

const pagination = ref<PaginationState>({
    count: 0,
    current_page: 1,
    total_pages: 1,
    has_previous: false,
    has_next: false,
    previous_page_number: null,
    next_page_number: null,
    page_numbers: [],
    items_per_page: 10,
    start_index: 0,
});

const currentSearchQuery = ref("");
const currentSearchType = ref("");

const tableHeaders: TableHeader[] = [
    {key: "number", text: "번호", align: "text-center", width: "w-16"},
    {key: "title", text: "제목", align: "text-left"},
    {key: "author", text: "글쓴이", align: "text-center", width: "w-24", textClass: "text-gray-500"},
    {key: "created_at_formatted", text: "작성일", align: "text-center", width: "w-32", textClass: "text-gray-500"},
];

const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, "0")}.${date.getDate().toString().padStart(2, "0")}`;
};

const getPaginationRange = (currentPage: number, totalPages: number, pageRange: number = 5): number[] => {
    let start = Math.max(1, currentPage - Math.floor(pageRange / 2));
    let end = Math.min(totalPages, start + pageRange - 1);

    if (end - start + 1 < pageRange) {
        start = Math.max(1, end - pageRange + 1);
    }

    const pages: number[] = [];
    for (let i = start; i <= end; i++) {
        pages.push(i);
    }
    return pages;
};

const fetchNotices = async () => {
    const page = parseInt((route.query.page as string) || "1", 10);
    const query = (route.query.q as string) || "";
    const type = (route.query.type as string) || "all";

    currentSearchQuery.value = query;
    currentSearchType.value = type;

    try {
        const params: Record<string, string | number> = {page: page};
        if (query) {
            if (type === "title") {
                params.title_search = query;
            } else if (type === "contents") {
                params.contents_search = query;
            } else if (type === "author") {
                params.author_search = query;
            } else {
                // type이 'all'이거나 정의되지 않았을 때
                params.search = query;
            }
        }
        // 페이지당 항목 수는 그대로 유지
        params.page_size = pagination.value.items_per_page;

        // 하나의 API 호출로 모든 공지사항 (검색/페이지네이션 적용) 가져오기
        const response = await apiClient.get<PaginatedResponse<NoticePost>>("/notice/", {
            params: params,
        });

        // 가져온 데이터를 allFetchedNotices에 할당
        allFetchedNotices.value = response.data.results;

        // 페이지네이션 정보는 전체 API 응답을 기준으로 업데이트
        const totalCount = response.data.count;
        const totalPages = Math.ceil(totalCount / pagination.value.items_per_page);

        pagination.value = {
            count: totalCount,
            current_page: page,
            total_pages: totalPages,
            has_previous: !!response.data.previous,
            has_next: !!response.data.next,
            previous_page_number: response.data.previous ? page - 1 : null,
            next_page_number: response.data.next ? page + 1 : null,
            page_numbers: getPaginationRange(page, totalPages, 5),
            items_per_page: pagination.value.items_per_page,
            // 시작 인덱스 계산은 여전히 전체 아이템 수 기준 (여기서는 일반 공지만 계산)
            // (allFetchedNotices.value.length - (page - 1) * pagination.value.items_per_page) 로 변경하면 전체 개수 기준이 됨.
            // 하지만 현재는 regularNotices.value.length가 아닌 전체 API의 count를 사용하는 것이 맞음.
            start_index: totalCount - (page - 1) * pagination.value.items_per_page,
        };
    } catch (error: any) {
        console.error("공지사항 로딩 오류:", error);
        alert(error.response?.data?.detail || "공지사항을 불러오는 데 실패했습니다.");
        allFetchedNotices.value = []; // 오류 시 데이터 초기화
        pagination.value = {
            count: 0,
            current_page: 1,
            total_pages: 1,
            has_previous: false,
            has_next: false,
            previous_page_number: null,
            next_page_number: null,
            page_numbers: [],
            items_per_page: pagination.value.items_per_page,
            start_index: 0,
        };
    }
};

const handleSearch = ({query, type}: {query: string; type: string}) => {
    router.push({
        query: {
            q: query,
            type: type,
            page: "1",
        },
    });
};

const handleClearSearch = () => {
    router.push({
        query: {page: "1"},
    });
};

const changePage = (pageNumber: number | null) => {
    if (pageNumber !== null && pageNumber !== pagination.value.current_page) {
        router.push({
            query: {
                ...route.query,
                page: pageNumber.toString(),
            },
        });
        window.scrollTo({top: 0, behavior: "smooth"});
    }
};

const goToDetail = (pk: number) => {
    router.push(`/notice/${pk}`);
};

onMounted(() => {
    fetchNotices();
});

watch(
    () => route.query,
    () => {
        fetchNotices();
    },
    {deep: true, immediate: false}
);
</script>
