<template>
    <section
        v-if="slides.length > 0"
        id="intro"
        class="scroll-section hero-vignette bg-black flex flex-col items-center justify-center p-4 h-[100dvh]"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
        @touchend="handleTouchEnd"
    >
        <!-- 백그라운드 슬라이더 -->
        <transition name="slide-fade">
            <div :key="activeSlide" class="absolute inset-0 bg-cover bg-center" :style="{backgroundImage: `url(${slides[activeSlide].image})`}"></div>
        </transition>

        <!-- 콘텐츠 오버레이 -->
        <div class="relative z-10 flex flex-col items-center justify-center h-full text-center text-white p-4">
            <transition name="slide-text-fade" mode="out-in">
                <div :key="activeSlide">
                    <h1 class="text-5xl md:text-7xl font-extrabold mb-4" v-scroll-animate>
                        {{ slides[activeSlide].title }}
                    </h1>
                    <p class="text-xl md:text-2xl max-w-2xl mx-auto font-light" v-scroll-animate>
                        {{ slides[activeSlide].contents || slides[activeSlide].subtitle }}
                    </p>
                    <router-link
                        to="#courses"
                        class="mt-8 inline-block bg-main text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-blue-700 transition-colors duration-300 transform hover:scale-105"
                        v-scroll-animate
                        @click="scrollToSection('#courses')"
                    >
                        주요 강의 보기
                    </router-link>
                </div>
            </transition>
        </div>

        <!-- 도트 네비게이션 -->
        <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
            <button
                v-for="(slide, index) in slides"
                :key="`dot-${slide.id}`"
                @click="goToSlide(index)"
                :class="['w-3 h-3 rounded-full transition-all duration-300', activeSlide === index ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white']"
                :aria-label="`Slide ${index + 1}`"
            ></button>
        </div>

        <!-- 서브 앵커 -->
        <div id="greeting" class="absolute top-[100vh]"></div>
        <div id="about" class="absolute top-[100vh]"></div>
    </section>
    <!-- 슬라이드가 없을 때 대체 콘텐츠 -->
    <section v-else id="intro" class="scroll-section bg-black flex items-center justify-center h-[100dvh] text-white">
        <p>슬라이드 데이터를 로드 중입니다...</p>
    </section>
</template>

<script setup lang="ts">
import {ref, onMounted, onUnmounted} from "vue";

// 슬라이드 인터페이스
interface Slide {
    id: number;
    title: string;
    contents?: string;
    subtitle?: string;
    image: string;
}

// props
const props = defineProps<{
    slides: Slide[];
}>();

// emit
const emit = defineEmits<{
    (e: "scroll-to", hash: string): void;
}>();

// 상태 변수
const activeSlide = ref(0);
const touchStartX = ref(0);
const touchEndX = ref(0);
let slideInterval: number | null = null;

// 슬라이드 함수
const nextSlide = () => {
    if (props.slides.length > 0) {
        activeSlide.value = (activeSlide.value + 1) % props.slides.length;
    }
};

const prevSlide = () => {
    if (props.slides.length > 0) {
        activeSlide.value = (activeSlide.value - 1 + props.slides.length) % props.slides.length;
    }
};

const goToSlide = (index: number) => {
    activeSlide.value = index;
};

// 터치 핸들러
const handleTouchStart = (event: TouchEvent) => {
    touchStartX.value = event.touches[0].clientX;
    if (slideInterval) clearInterval(slideInterval);
};

const handleTouchMove = (event: TouchEvent) => {
    touchEndX.value = event.touches[0].clientX;
};

const handleTouchEnd = () => {
    const threshold = 50;
    const deltaX = touchStartX.value - touchEndX.value;

    if (Math.abs(deltaX) > threshold) {
        if (deltaX > 0) nextSlide();
        else prevSlide();
    }
    touchStartX.value = 0;
    touchEndX.value = 0;
    startSlider();
};

// 자동 슬라이드
const startSlider = () => {
    if (props.slides.length > 1 && slideInterval === null) {
        slideInterval = setInterval(nextSlide, 5000);
    }
};

// 스크롤 함수
const scrollToSection = (hash: string) => {
    emit("scroll-to", hash); // 부모 컴포넌트로 이벤트 방출
};

// 마운트
onMounted(() => {
    startSlider();
});

onUnmounted(() => {
    if (slideInterval) clearInterval(slideInterval);
});
</script>

<style scoped>
/* 비네트 효과 (상단 강화) */
.hero-vignette::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.4) 20%, transparent 40%, transparent 70%, rgba(0, 0, 0, 0.3) 100%);
    z-index: 2;
}

/* 슬라이드 트랜지션 */
.slide-fade-enter-active,
.slide-fade-leave-active {
    transition: opacity 1s ease, transform 1s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
    opacity: 0;
    transform: translateX(20px);
}
.slide-fade-enter-to,
.slide-fade-leave-from {
    opacity: 1;
    transform: translateX(0);
}

/* 텍스트 트랜지션 */
.slide-text-fade-enter-active,
.slide-text-fade-leave-active {
    transition: opacity 0.5s ease, transform 0.5s ease;
}
.slide-text-fade-enter-from,
.slide-text-fade-leave-to {
    opacity: 0;
    transform: translateY(10px);
}
.slide-text-fade-enter-to,
.slide-text-fade-leave-from {
    opacity: 1;
    transform: translateY(0);
}

/* 슬라이드 아이템 스타일 */
.slide-item {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
}
</style>
