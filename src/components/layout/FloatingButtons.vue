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
// Vite 프로젝트의 경우, 아이콘 파일들을 `public` 디렉토리 (예: public/img/icon/map_white_24dp.svg)에 위치시키고,
// 아래와 같이 절대 경로로 참조합니다.
const mapIconUrl = "/img/icon/map_white_24dp.svg";
const textIconUrl = "/img/icon/textsms_white_24dp.svg";
const upwardIconUrl = "/img/icon/arrow_upward_white_24dp.svg";
// 중요: arrow_upward_white_24dp.svg 아이콘은 흰색입니다.
// '맨 위로' 버튼의 배경이 흰색이므로 이 아이콘이 보이지 않을 수 있습니다.
// 어두운 색상의 아이콘을 사용하거나, 인라인 SVG를 사용하여 색상을 제어하는 것을 고려해 보세요.

const scrollToTop = () => {
    window.scrollTo({top: 0, behavior: "smooth"});
};
</script>

<style scoped>
/*
    Tailwind CSS v4 (및 JIT 모드가 활성화된 v3)는 w-[60px], bg-[#1fa2ff]와 같은 임의의 값을 지원합니다.
    자주 사용하는 값들은 tailwind.config.js 파일에 사용자 정의 값으로 추가하여 재사용성을 높일 수 있습니다. 예:
  
    // tailwind.config.js
    module.exports = {
      theme: {
        extend: {
          colors: {
            'brand-primary-light': '#1fa2ff', // var(--primary-color-light)
            'brand-line-color': '#ebebeb',    // var(--line-color)
          },
          boxShadow: {
            'brand-floating': '3px 2px 8px 1px rgba(0, 0, 0, 0.2)',
          },
          spacing: {
            '10px': '10px',
            '15px': '15px',
            '50px': '50px',
          }
        },
      },
      // ...
    };
  
    위와 같이 설정 후, bg-brand-primary-light, shadow-brand-floating, right-50px, ml-10px, pl-15px 등의 클래스를 사용할 수 있습니다.
  */
</style>
