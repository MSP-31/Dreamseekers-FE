<template>
    <ul class="fixed z-30 right-[50px] bottom-[50px] flex flex-col items-end space-y-[10px]">
        <!-- '오시는 길' Button -->
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

        <!-- '강의 문의' Button -->
        <li>
            <router-link
                :to="`/lecture/inquiry`"
                title="강의 문의"
                class="inline-flex items-center justify-center relative w-[60px] h-[60px] rounded-full bg-[#1fa2ff] shadow-[3px_2px_8px_1px_rgba(0,0,0,0.2)] text-[#ebebeb] transition-all duration-200 ease-in-out cursor-pointer group hover:w-[170px] hover:justify-start hover:pl-[15px]"
            >
                <span class="w-10 h-10 bg-center bg-no-repeat bg-contain shrink-0" :style="{backgroundImage: `url(${textIconUrl})`}" aria-hidden="true"></span>
                <span class="ml-[10px] text-xl whitespace-nowrap hidden group-hover:inline"> 강의 문의 </span>
            </router-link>
        </li>

        <!-- '맨 위로' Button -->
        <li>
            <span
                @click="scrollToTop"
                title="맨 위로"
                role="button"
                tabindex="0"
                @keydown.enter="scrollToTop"
                @keydown.space.prevent="scrollToTop"
                class="inline-flex items-center justify-center relative w-[60px] h-[60px] rounded-full bg-white border-2 border-[#ebebeb] shadow-[3px_2px_8px_1px_rgba(0,0,0,0.2)] transition-all duration-200 ease-in-out cursor-pointer hover:bg-gray-100"
            >
                <span class="w-10 h-10 bg-center bg-no-repeat bg-contain shrink-0" :style="{backgroundImage: `url(${upwardIconUrl})`}" aria-hidden="true"></span>
                <!-- 이 버튼은 원래 디자인처럼 호버 시 텍스트가 표시되지 않습니다. -->
            </span>
        </li>
    </ul>
</template>

<script setup>
const mapIconUrl = "/img/icon/map_white_24dp.svg";
const textIconUrl = "/img/icon/textsms_white_24dp.svg";
const upwardIconUrl = "/img/icon/arrow_upward_white_24dp.svg";

const scrollToTop = () => {
    window.scrollTo({top: 0, behavior: "smooth"});
};
</script>
