<template>
    <nav class="bg-white shadow-md">
        <div class="container mx-auto px-4 h-20 flex justify-between items-center">
            <router-link to="/" class="flex items-center">
                <img class="h-10 w-auto mr-2" src="/img/logo.svg" alt="꿈을 찾는 사람들 교육원" />
                <span class="text-xl font-bold">꿈을 찾는 사람들 교육원</span>
            </router-link>

            <ul class="desktop-menu space-x-16">
                <li v-for="item in processedMenuItems" :key="item.title" class="relative group">
                    <router-link :to="item.link" class="text-gray-700 hover:text-[var(--dream-main)] py-2 block text-2xl font-semibold">{{ item.title }}</router-link>
                    <div
                        v-if="item.submenu && item.submenu.length > 0"
                        class="absolute left-0 mt-0 w-48 bg-white shadow-lg rounded-md py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 invisible group-hover:visible z-20"
                    >
                        <router-link
                            v-for="subItem in item.submenu"
                            :key="subItem.title"
                            :to="subItem.link"
                            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[var(--dream-main)]"
                        >
                            {{ subItem.title }}
                        </router-link>
                    </div>
                    <div class="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--dream-main)] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                </li>
            </ul>

            <div class="nav-breakpoint:hidden">
                <button @click="toggleMobileMenu" class="text-gray-600 hover:text-[var(--dream-main)] focus:outline-none">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                    </svg>
                </button>
            </div>
        </div>

        <div v-if="isMobileMenuOpen" class="fixed inset-0 bg-black/50 z-40 nav-breakpoint:hidden" @click="closeMobileMenu"></div>
        <div
            :class="[
                'fixed top-0 right-0 h-full bg-white w-64 shadow-lg transform transition-transform duration-300 ease-in-out z-50 nav-breakpoint:hidden',
                isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full',
            ]"
        >
            <div class="p-4">
                <button @click="closeMobileMenu" class="float-right text-gray-600 hover:text-[var(--dream-main)]">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
                <ul class="mt-8 space-y-2">
                    <li v-for="item in processedMenuItems" :key="item.title + '-mobile'">
                        <router-link :to="item.link" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-[var(--dream-main)]" @click="closeMobileMenu">{{
                            item.title
                        }}</router-link>
                        <ul v-if="item.submenu && item.submenu.length > 0" class="ml-4 mt-1 space-y-1">
                            <li v-for="subItem in item.submenu" :key="subItem.title + '-mobile-sub'">
                                <router-link :to="subItem.link" class="block px-3 py-2 rounded-md text-sm text-gray-600 hover:bg-gray-50 hover:text-[var(--dream-main)]" @click="closeMobileMenu">{{
                                    subItem.title
                                }}</router-link>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<script setup lang="ts">
import {ref, computed} from "vue";
import {useAuthStore} from "@/stores/auth"; // Pinia 스토어 임포트
import {menuItemsData, type MenuItem} from "@/data/menuData"; // 분리된 데이터 임포트

// Pinia authStore 인스턴스 가져오기
const authStore = useAuthStore();

const isMobileMenuOpen = ref(false);
const toggleMobileMenu = () => (isMobileMenuOpen.value = !isMobileMenuOpen.value);
const closeMobileMenu = () => (isMobileMenuOpen.value = false);

// isStaff 여부에 따라 동적으로 변경될 메뉴 아이템을 계산하는 computed 속성
const processedMenuItems = computed<MenuItem[]>(() => {
    // 원본 데이터를 수정하지 않기 위해 깊은 복사본 생성
    const items = JSON.parse(JSON.stringify(menuItemsData)) as MenuItem[];

    // '강의 문의' 메뉴 찾기
    const inquiryMenu = items.find((menu) => menu.title === "강의 문의");

    /*
    if (inquiryMenu) {
        // 1. isStaff 여부에 따라 '강의 상담 문의' 서브메뉴 추가/제거
        const isAdmin = authStore.isAdmin;

        if (!isAdmin) {
            // 일반 사용자일 경우 '강의 상담 문의' 추가
            inquiryMenu.submenu = [
                {title: "강의 상담 문의", link: "/inquiry/write"},
                ...(inquiryMenu.submenu || []), // 기존 서브메뉴가 있다면 그 뒤에 추가
            ];
        } else {
            // 스태프일 경우 '강의 상담 문의' 제거 (원본 데이터에 없으므로 이 로직은 필요 없을 수 있음)
            // 만약 원본 데이터에 항상 있고 스태프일 때만 제거하려면 아래와 같이 필터링
            inquiryMenu.submenu = (inquiryMenu.submenu || []).filter((sub) => sub.link !== "/inquiry/write");
        }

        // 2. '문의 내역' 서브메뉴 타이틀 변경
        const myInquiryItem = (inquiryMenu.submenu || []).find((sub) => sub.link === "/inquiry");
        if (myInquiryItem) {
            myInquiryItem.title = isAdmin ? "문의 내역" : "내 문의 내역";
        }

        // 3. '강의 문의' 최상위 링크 변경
        inquiryMenu.link = isAdmin ? "/inquiry" : "/inquiry/write";
    }
    */

    return items;
});
</script>
