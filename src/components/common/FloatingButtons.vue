<template>
    <div>
        <ul
            class="hidden md:flex fixed z-30 right-0 bottom-[50px] pr-[10px] flex-col items-end space-y-[10px] md:right-[50px] md:pr-0 transition-opacity duration-500 ease-in-out"
            :class="{'opacity-0': !isVisible, 'opacity-100': isVisible}"
        >
            <li>
                <router-link
                    :to="`/inquiry/write`"
                    title="강의 문의"
                    class="inline-flex items-center justify-center relative w-[60px] h-[60px] rounded-full bg-[#1fa2ff] shadow-[3px_2px_8px_1px_rgba(0,0,0,0.2)] text-[#ebebeb] transition-all duration-200 ease-in-out cursor-pointer group hover:w-[170px] hover:justify-start hover:pl-[15px]"
                >
                    <span class="w-10 h-10 bg-center bg-no-repeat bg-contain shrink-0" :style="{backgroundImage: `url(${textIconUrl})`}" aria-hidden="true"></span>
                    <span class="ml-[10px] text-xl whitespace-nowrap hidden group-hover:inline"> 강의 문의 </span>
                </router-link>
            </li>
            <li>
                <router-link
                    :to="`/intro/contact/`"
                    title="오시는 길"
                    class="inline-flex items-center justify-center relative w-[60px] h-[60px] rounded-full bg-[#1fa2ff] shadow-[3px_2px_8px_1px_rgba(0,0,0,0.2)] text-[#ebebeb] transition-all duration-200 ease-in-out cursor-pointer group hover:w-[170px] hover:justify-start hover:pl-[15px]"
                >
                    <span class="w-10 h-10 bg-center bg-no-repeat bg-contain shrink-0" :style="{backgroundImage: `url(${mapIconUrl})`}" aria-hidden="true"></span>
                    <span class="ml-[10px] text-xl whitespace-nowrap hidden group-hover:inline"> 오시는 길 </span>
                </router-link>
            </li>
            <li>
                <span
                    @click="scrollToTop"
                    title="상단으로"
                    role="button"
                    tabindex="0"
                    @keydown.enter="scrollToTop"
                    @keydown.space.prevent="scrollToTop"
                    class="inline-flex items-center justify-center relative w-[60px] h-[60px] rounded-full bg-white border-2 border-[#ebebeb] shadow-[3px_2px_8px_1px_rgba(0,0,0,0.2)] transition-all duration-200 ease-in-out cursor-pointer hover:bg-gray-100"
                >
                    <span class="w-10 h-10 bg-center bg-no-repeat bg-contain shrink-0" :style="{backgroundImage: `url(${upwardIconUrl})`}" aria-hidden="true"></span>
                </span>
            </li>
        </ul>

        <div class="md:hidden fixed bottom-0 w-full bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-100 flex justify-evenly items-center h-16">
            <router-link :to="`/inquiry/write`" title="강의 문의" class="flex flex-col items-center justify-center text-sm text-gray-700 w-1/3 h-full border-black/10">
                <span class="w-6 h-6 bg-center bg-no-repeat bg-contain filter invert" :style="{backgroundImage: `url(${textIconUrl})`}" aria-hidden="true"></span>
                <span class="mt-1">강의 문의</span>
            </router-link>

            <router-link :to="`/intro/contact/`" title="오시는 길" class="flex flex-col items-center justify-center text-sm text-gray-700 w-1/3 h-full border-black/10">
                <span class="w-6 h-6 bg-center bg-no-repeat bg-contain filter invert" :style="{backgroundImage: `url(${mapIconUrl})`}" aria-hidden="true"></span>
                <span class="mt-1">오시는 길</span>
            </router-link>

            <span
                @click="scrollToTop"
                title="상단으로"
                role="button"
                tabindex="0"
                @keydown.enter="scrollToTop"
                @keydown.space.prevent="scrollToTop"
                class="flex flex-col items-center justify-center text-sm text-gray-700 w-1/3 h-full"
            >
                <span class="w-6 h-6 bg-center bg-no-repeat bg-contain" :style="{backgroundImage: `url(${upwardIconUrl})`}" aria-hidden="true"></span>
                <span class="mt-1">상단으로</span>
            </span>
        </div>
    </div>
</template>

<script setup>
import {ref, onMounted, onUnmounted} from "vue";

const mapIconUrl = "/img/icon/map_white_24dp.svg";
const textIconUrl = "/img/icon/textsms_white_24dp.svg";
const upwardIconUrl = "/img/icon/arrow_upward_white_24dp.svg";

const scrollToTop = () => {
    window.scrollTo({top: 0, behavior: "smooth"});
};

// 플로팅 버튼 가시성
const isVisible = ref(false);

// 스크롤 이벤트 핸들러
const handleScroll = () => {
    // 현재 스크롤 위치를 감지
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    console.log(scrollTop);

    // 스크롤 위치가 100px보다 클 때만 isVisible을 true로 설정 (임계값 100px)
    isVisible.value = scrollTop > 250;
};

// 3. 컴포넌트 마운트 시 이벤트 리스너 등록
onMounted(() => {
    // 데스크톱 환경 (md)에서만 플로팅 버튼이 보이므로, 스크롤 감지 리스너를 추가
    window.addEventListener("scroll", handleScroll);
    // 초기 로드 시 스크롤 위치를 한 번 확인하여 isVisible 초기화
    handleScroll();
});

// 4. 컴포넌트 언마운트 시 이벤트 리스너 제거 (메모리 누수 방지)
onUnmounted(() => {
    window.removeEventListener("scroll", handleScroll);
});
</script>
