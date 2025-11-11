<template>
    <!-- 고정된 헤더: 스크롤/호버 상태에 따라 투명(header-transparent) 또는 솔리드(header-solid) 스타일 적용 -->
    <header
        :class="[headerScrolled || isHeaderHovered ? 'header-solid' : 'header-transparent', 'fixed top-0 left-0 right-0 z-50 transition-all duration-300']"
        @mouseenter="isHeaderHovered = true"
        @mouseleave="isHeaderHovered = false"
    >
        <!-- 헤더 내부의 레이아웃 컨테이너 -->
        <div class="relative">
            <!-- 모바일 헤더: 중간 크기 이상(md) 화면에서는 숨김 -->
            <div class="flex items-center w-full justify-between md:hidden py-3 px-5">
                <!-- 왼쪽 여백용 스페이서: 로고와 버튼의 균형을 맞춤 -->
                <div class="w-8"></div>
                <!-- 로고와 타이틀: 클릭 시 홈(/) 또는 #intro로 이동 -->
                <router-link to="/" class="absolute left-1/2 transform -translate-x-1/2" @click="scrollToSection('#intro')">
                    <span :class="[headerScrolled ? 'text-gray-800' : 'text-white', 'text-lg font-bold transition-colors']"> 꿈을 찾는 사람들 교육원 </span>
                </router-link>
                <!-- 모바일 메뉴 토글 버튼: 햄버거(☰)와 닫기(✕) 아이콘 전환 -->
                <button @click="toggleMobileMenu" :class="[headerScrolled ? 'text-gray-800' : 'text-white', 'text-3xl z-50 transition-colors']">
                    <span v-if="!isMobileMenuOpen">☰</span>
                    <span v-else>✕</span>
                </button>
            </div>

            <!-- 데스크톱 네비게이션: 모바일 화면에서는 숨김 -->
            <div class="hidden md:block">
                <!-- 메인 네비게이션: 중앙 정렬된 로고와 메뉴 -->
                <div class="flex w-full justify-center items-center container mx-auto px-5 py-3 space-x-12 transition-all duration-300">
                    <!-- 로고와 타이틀: 클릭 시 홈(/) 또는 #intro로 이동 -->
                    <router-link to="/" class="flex items-center space-x-2 min-w-max" @click="scrollToSection('#intro')">
                        <!-- 로고 이미지: 기존 프로젝트의 logo.svg 사용 -->
                        <img class="h-10 w-auto" src="/img/logo.svg" alt="꿈을 찾는 사람들 교육원 로고" />
                        <span :class="[headerScrolled || isHeaderHovered ? 'text-gray-800' : 'text-white', 'text-lg font-bold transition-colors']"> 꿈을 찾는 사람들 교육원 </span>
                    </router-link>
                    <!-- 메인 메뉴: 동적으로 생성된 메뉴 항목 -->
                    <nav class="flex space-x-8">
                        <router-link
                            v-for="item in processedMenuItems"
                            :key="item.title"
                            :to="item.link"
                            :class="['font-medium py-3 px-2 transition-colors block whitespace-nowrap', 'hover:text-main', headerScrolled || isHeaderHovered ? 'text-gray-800' : 'text-white']"
                            @click="scrollToSection(item.link)"
                        >
                            {{ item.title }}
                        </router-link>
                    </nav>
                </div>

                <!-- 서브메뉴 컨테이너: 호버 시 확장(max-h-96) 애니메이션 -->
                <div :class="['overflow-hidden transition-all duration-300 ease-in-out', isHeaderHovered ? 'max-h-96' : 'max-h-0']">
                    <div class="container mx-auto px-5 pt-0 pb-6">
                        <!-- 서브메뉴 레이아웃: 로고 크기만큼 왼쪽 여백을 두어 메뉴 정렬 -->
                        <div class="flex justify-center border-t border-gray-200 pt-3 space-x-12">
                            <!-- 로고 자리맞춤용 투명 플레이스홀더 -->
                            <div class="flex items-center space-x-2 invisible min-w-max">
                                <img class="h-10 w-auto" src="/img/logo.svg" alt="" />
                                <span class="text-lg font-bold whitespace-nowrap">꿈을 찾는 사람들 교육원</span>
                            </div>
                            <!-- 서브메뉴 항목 -->
                            <div class="flex space-x-8">
                                <div v-for="item in processedMenuItems" :key="item.title" class="px-2 min-w-max">
                                    <nav class="flex flex-col space-y-2 pt-1">
                                        <!-- 서브메뉴가 없는 경우: 메인 섹션으로 이동 링크 -->
                                        <template v-if="!item.submenu || item.submenu.length === 0">
                                            <router-link
                                                :to="item.link"
                                                class="text-gray-600 font-medium hover:text-main transition-colors text-sm"
                                                @click="
                                                    scrollToSection(item.link);
                                                    isHeaderHovered = false;
                                                "
                                            >
                                                {{ item.title }}
                                            </router-link>
                                        </template>
                                        <!-- 서브메뉴가 있는 경우: 각 서브메뉴 항목 표시 -->
                                        <template v-else>
                                            <router-link
                                                v-for="subItem in item.submenu"
                                                :key="subItem.title"
                                                :to="subItem.link"
                                                class="text-gray-600 hover:text-main transition-colors text-sm whitespace-nowrap"
                                                @click="
                                                    scrollToSection(subItem.link);
                                                    isHeaderHovered = false;
                                                "
                                            >
                                                {{ subItem.title }}
                                            </router-link>
                                        </template>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 모바일 메뉴: 풀스크린으로 표시, 상단에서 슬라이드 애니메이션 -->
            <transition
                enter-active-class="transition ease-out duration-300"
                enter-from-class="transform opacity-0 -translate-y-full"
                enter-to-class="transform opacity-100 translate-y-0"
                leave-active-class="transition ease-in duration-200"
                leave-from-class="transform opacity-100 translate-y-0"
                leave-to-class="transform opacity-0 -translate-y-full"
            >
                <div v-if="isMobileMenuOpen" class="md:hidden fixed inset-0 bg-main pt-16 overflow-y-auto">
                    <nav class="flex flex-col items-center justify-start h-full space-y-4 p-8">
                        <!-- 모바일 메인 메뉴 -->
                        <template v-for="item in processedMenuItems" :key="item.title + '-mobile'">
                            <router-link
                                :to="item.link"
                                class="text-white text-3xl font-medium hover:text-gray-200 transition-colors pt-4 pb-2"
                                @click="
                                    closeMobileMenu;
                                    scrollToSection(item.link);
                                "
                            >
                                {{ item.title }}
                            </router-link>
                            <!-- 모바일 서브메뉴 -->
                            <div v-if="item.submenu && item.submenu.length > 0" class="flex flex-col items-center space-y-2 w-full">
                                <router-link
                                    v-for="subItem in item.submenu"
                                    :key="subItem.title + '-mobile-sub'"
                                    :to="subItem.link"
                                    class="text-gray-300 text-xl hover:text-white transition-colors w-full text-center py-1"
                                    @click="
                                        closeMobileMenu;
                                        scrollToSection(subItem.link);
                                    "
                                >
                                    - {{ subItem.title }}
                                </router-link>
                            </div>
                        </template>
                    </nav>
                </div>
            </transition>
        </div>
    </header>
</template>

<script setup lang="ts">
import {ref, computed, onMounted, onUnmounted} from "vue";
import {menuItemsData, type MenuItem} from "@/data/menuData";

// 상태 변수 정의
const isMobileMenuOpen = ref(false); // 모바일 메뉴 열림/닫힘 상태
const headerScrolled = ref(false); // 스크롤 여부 (50px 이상 스크롤 시 true)
const isHeaderHovered = ref(false); // 헤더 호버 상태

// 모바일 메뉴 토글 함수
const toggleMobileMenu = () => {
    isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

// 모바일 메뉴 닫기 함수
const closeMobileMenu = () => {
    isMobileMenuOpen.value = false;
};

// 동적 메뉴 데이터: menuItemsData를 깊은 복사하여 사용
const processedMenuItems = computed<MenuItem[]>(() => {
    return JSON.parse(JSON.stringify(menuItemsData)) as MenuItem[];
});

// 섹션으로 스크롤 이동 함수: 해시(#intro 등) 기반으로 부드럽게 이동
const scrollToSection = (hash: string) => {
    // 메인 섹션 목록: 스크롤 스냅 지점
    const sections = ["#intro", "#courses", "#schedule", "#community", "#footer"];
    const appContainer = document.getElementById("app-container");

    // 대상 요소 선택
    const targetElement = document.querySelector(hash);
    let scrollSnapTarget = targetElement;

    // 서브 앵커(greeting, about 등)인 경우 부모 scroll-section 찾기
    if (["#greeting", "#about", "#inquiry", "#notice", "#news", "#location"].includes(hash)) {
        scrollSnapTarget = targetElement?.closest(".scroll-section") || targetElement;
    }

    if (scrollSnapTarget && appContainer) {
        // 섹션 인덱스 기반 스크롤 위치 계산
        const sectionIndex = sections.indexOf(`#${scrollSnapTarget.id}`);
        const scrollPosition = sectionIndex >= 0 ? sectionIndex * window.innerHeight : scrollSnapTarget.getBoundingClientRect().top + appContainer.scrollTop;

        // 메인 섹션으로 스크롤
        appContainer.scrollTo({
            top: scrollPosition,
            behavior: "smooth",
        });

        // 서브 앵커인 경우 추가 스크롤
        if (scrollSnapTarget !== targetElement && targetElement) {
            setTimeout(() => {
                const subPosition = targetElement.getBoundingClientRect().top + appContainer.scrollTop;
                appContainer.scrollTo({
                    top: subPosition,
                    behavior: "smooth",
                });
            }, 500); // 스냅 완료 후 0.5초 대기
        }
    } else {
        console.warn(`스크롤 대상 요소를 찾을 수 없습니다: ${hash}`); // 디버깅용 경고
    }

    isMobileMenuOpen.value = false; // 모바일 메뉴 닫기
    isHeaderHovered.value = false; // 서브메뉴 닫기
};

// 스크롤 이벤트 처리: 헤더 스타일(투명/솔리드) 전환
const handleScroll = (event: Event) => {
    const scrollTop = (event.target as HTMLElement).scrollTop;
    console.log(scrollTop);
    headerScrolled.value = scrollTop > 50; // 50px 초과 시 솔리드 헤더
};

// 컴포넌트 마운트 시 스크롤 이벤트 리스너 등록
onMounted(() => {
    const appContainer = document.getElementById("app-container");
    if (appContainer) {
        appContainer.addEventListener("scroll", handleScroll);
        handleScroll({target: appContainer} as Event); // 초기 상태 설정
    }
});

// 컴포넌트 언마운트 시 스크롤 이벤트 리스너 제거
onUnmounted(() => {
    const appContainer = document.getElementById("app-container");
    if (appContainer) {
        appContainer.removeEventListener("scroll", handleScroll);
    }
});
</script>

<style scoped>
/* 투명 헤더 스타일: 초기 상태 또는 인트로 섹션에서 사용 */
.header-transparent {
    background-color: transparent;
    color: white;
    box-shadow: none;
}

/* 솔리드 헤더 스타일: 스크롤 또는 호버 시 사용 */
.header-solid {
    background-color: white;
    color: #1f2937; /* 다크 그레이 텍스트 */
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
}
</style>
