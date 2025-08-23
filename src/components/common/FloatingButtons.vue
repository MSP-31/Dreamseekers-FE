<template>
    <div>
        <ul class="hidden md:flex fixed z-30 right-0 bottom-[50px] pr-[10px] flex-col items-end space-y-[10px] md:right-[50px] md:pr-0">
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
                    title="맨 위로"
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
            <router-link :to="`/intro/contact/`" title="오시는 길" class="flex flex-col items-center justify-center text-sm text-gray-700 w-1/2 h-full">
                <span class="w-6 h-6 bg-center bg-no-repeat bg-contain filter invert" :style="{backgroundImage: `url(${mapIconUrl})`}" aria-hidden="true"></span>
                <span class="mt-1">오시는 길</span>
            </router-link>

            <span
                @click="scrollToTop"
                title="맨 위로"
                role="button"
                tabindex="0"
                @keydown.enter="scrollToTop"
                @keydown.space.prevent="scrollToTop"
                class="flex flex-col items-center justify-center text-sm text-gray-700 w-1/2 h-full"
            >
                <span class="w-6 h-6 bg-center bg-no-repeat bg-contain" :style="{backgroundImage: `url(${upwardIconUrl})`}" aria-hidden="true"></span>
                <span class="mt-1">맨 위로</span>
            </span>
        </div>
    </div>
</template>

<script setup>
const mapIconUrl = "/img/icon/map_white_24dp.svg";
const textIconUrl = "/img/icon/textsms_white_24dp.svg";
const upwardIconUrl = "/img/icon/arrow_upward_white_24dp.svg";

const scrollToTop = () => {
    window.scrollTo({top: 0, behavior: "smooth"});
};
</script>
