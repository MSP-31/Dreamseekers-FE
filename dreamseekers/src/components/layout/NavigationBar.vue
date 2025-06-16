<template>
    <nav class="bg-white shadow-md">
        <div class="container mx-auto px-4 h-20 flex justify-between items-center">
            <!-- 로고 -->
            <a href="/" class="flex items-center">
                <img class="h-10 w-auto mr-2" src="/img/logo.svg" alt="꿈을 찾는 사람들 교육원" />
                <span class="text-xl font-bold text-dream-main">꿈을 찾는 사람들 교육원</span>
            </a>

            <!-- 데스크탑 메뉴 -->
            <ul class="desktop-menu">
                <li v-for="item in menuItems" :key="item.title" class="relative group">
                    <a :href="item.link" class="text-gray-700 hover:text-dream-main py-2 block">{{ item.title }}</a>
                    <div
                        v-if="item.submenu && item.submenu.length > 0"
                        class="absolute left-0 mt-0 w-48 bg-white shadow-lg rounded-md py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 invisible group-hover:visible z-20"
                    >
                        <a v-for="subItem in item.submenu" :key="subItem.title" :href="subItem.link" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-dream-main">
                            {{ subItem.title }}
                        </a>
                    </div>
                    <div class="absolute bottom-0 left-0 w-full h-0.5 bg-dream-main transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                </li>
            </ul>

            <!-- 모바일 메뉴 토글 버튼 -->
            <div class="nav-breakpoint:hidden">
                <button @click="toggleMobileMenu" class="text-gray-600 hover:text-dream-main focus:outline-none">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                    </svg>
                </button>
            </div>
        </div>

        <!-- 모바일 사이드바 (MobileSidebar.vue 컴포넌트로 분리 가능) -->
        <div v-if="isMobileMenuOpen" class="fixed inset-0 bg-black bg-opacity-50 z-40 nav-breakpoint:hidden" @click="closeMobileMenu"></div>
        <div
            :class="[
                'fixed top-0 right-0 h-full bg-white w-64 shadow-lg transform transition-transform duration-300 ease-in-out z-50 nav-breakpoint:hidden',
                isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full',
            ]"
        >
            <div class="p-4">
                <button @click="closeMobileMenu" class="float-right text-gray-600 hover:text-dream-main">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
                <ul class="mt-8 space-y-2">
                    <li v-for="item in menuItems" :key="item.title + '-mobile'">
                        <a :href="item.link" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-dream-main">{{ item.title }}</a>
                        <ul v-if="item.submenu && item.submenu.length > 0" class="ml-4 mt-1 space-y-1">
                            <li v-for="subItem in item.submenu" :key="subItem.title + '-mobile-sub'">
                                <a :href="subItem.link" class="block px-3 py-2 rounded-md text-sm text-gray-600 hover:bg-gray-50 hover:text-dream-main">{{ subItem.title }}</a>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<script setup>
import {ref} from "vue";

const props = defineProps({
    isStaff: {
        type: Boolean,
        default: false,
    },
});

const isMobileMenuOpen = ref(false);
const toggleMobileMenu = () => (isMobileMenuOpen.value = !isMobileMenuOpen.value);
const closeMobileMenu = () => (isMobileMenuOpen.value = false);

const menuItems = ref([
    {
        title: "교육원 소개",
        link: "/intro/greeting/",
        submenu: [
            {title: "인사말", link: "/intro/greeting/"},
            {title: "강사 소개", link: "/intro/instructors/"},
            {title: "오시는 길", link: "/intro/contact/"},
        ],
    },
    {
        title: "주요 강의",
        link: "/lecture/list",
        submenu: [{title: "주요 강의", link: "/lecture/list"}],
    },
    {
        title: "강의 문의",
        link: props.isStaff ? "/lecture/inquiry/list" : "/lecture/inquiry",
        submenu: [
            ...(props.isStaff ? [] : [{title: "강의 상담 문의", link: "/lecture/inquiry"}]),
            {title: props.isStaff ? "문의 내역" : "내 문의 내역", link: "/lecture/inquiry/list"},
            {title: "강의 일정", link: "/lecture/calender"},
        ],
    },
    {
        title: "소통 마당",
        link: "/board/notice/",
        submenu: [
            {title: "공지사항", link: "/board/notice/"},
            {title: "자료실", link: "/board/archive/"},
            {title: "방명록", link: "/board/guest/"},
            {title: "활동 소식", link: "/board/news/"},
        ],
    },
]);

// Django의 {% if request.user.is_staff %} 와 같은 조건부 링크는 위 menuItems 정의 시 props.isStaff를 활용하여 처리했습니다.
// 실제 링크는 Vue Router의 <router-link>를 사용하거나, a href를 그대로 사용한다면 페이지 전체가 새로고침됩니다.
// SPA로 구성한다면 Vue Router 사용이 권장됩니다.
</script>
