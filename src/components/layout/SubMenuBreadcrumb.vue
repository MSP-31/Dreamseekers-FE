<template>
    <div class="py-4 border-b border-gray-200 bg-gray-50">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap gap-2 justify-center">
            <router-link
                v-for="item in currentSubMenu"
                :key="item.link"
                :to="item.link"
                class="px-4 py-2 rounded-md transition-colors duration-200 text-sm font-medium"
                :class="{
                    'bg-[var(--dream-main)] text-white shadow-md': isActive(item.link),
                    'bg-gray-200 text-gray-700 hover:bg-gray-300': !isActive(item.link),
                }"
            >
                {{ item.title }}
            </router-link>
        </div>
    </div>
</template>

<script setup lang="ts">
import {computed} from "vue";
import {useRoute} from "vue-router";
import {useAuthStore} from "@/stores/auth";

// 데이터 파일에서 메뉴 데이터와 타입을 임포트
import {menuItemsData, type MenuItem} from "@/data/menuData";

const authStore = useAuthStore();
const route = useRoute();

// menuItemsData를 직접 사용하되, 필요한 경우 반응형으로 감싸거나 변형하여 사용
// 여기서는 동적 submenu를 처리하기 위해 computed 속성으로 변형
const processedMenuItems = computed<MenuItem[]>(() => {
    // menuItemsData의 복사본을 만들어 변경
    const items = JSON.parse(JSON.stringify(menuItemsData)) as MenuItem[]; // 깊은 복사

    // '강의 문의' 메뉴 찾기 및 동적 submenu 추가/변경
    const inquiryMenu = items.find((menu) => menu.title === "강의 문의");
    if (inquiryMenu) {
        // isStaff에 따라 '강의 상담 문의' 추가 여부 결정
        if (!authStore.isAdmin) {
            inquiryMenu.submenu = [
                {title: "강의 상담 문의", link: "/inquiry/write"},
                ...(inquiryMenu.submenu || []), // 기존 서브메뉴가 있다면 추가
            ];
        }

        // 문의 내역의 타이틀 변경
        const myInquiryItem = (inquiryMenu.submenu || []).find((sub) => sub.link === "/inquiry");
        if (myInquiryItem) {
            myInquiryItem.title = authStore.isAdmin ? "문의 내역" : "내 문의 내역";
        }
    }

    // 상위 링크 처리: isStaff에 따라 '강의 문의'의 최상위 링크 변경
    // inquiryMenu가 undefined가 아님을 보장
    if (inquiryMenu) {
        inquiryMenu.link = authStore.isAdmin ? "/inquiry" : "/inquiry/write";
    }

    return items;
});

// 현재 라우트 경로에 해당하는 상위 메뉴의 하위 메뉴를 계산
const currentSubMenu = computed(() => {
    const currentPath = route.path;

    // processedMenuItems를 순회하며 현재 경로가 포함된 상위 메뉴를 찾습니다.
    for (const menu of processedMenuItems.value) {
        // processedMenuItems 사용
        if (menu.submenu) {
            if (currentPath.startsWith(menu.link) || menu.submenu.some((sub) => currentPath.startsWith(sub.link))) {
                return menu.submenu;
            }
        }
    }
    return [];
});

// 현재 라우트가 특정 링크와 일치하는지 확인
const isActive = (link: string) => {
    return route.path === link;
};
</script>
