<template>
    <div class="relative w-full overflow-hidden" style="height: 500px">
        <!-- 슬라이드 높이 고정 예시 -->
        <div v-for="(slide, index) in slides" :key="slide.id" :class="['absolute inset-0 transition-opacity duration-1000 ease-in-out', currentIndex === index ? 'opacity-100' : 'opacity-0']">
            <img :src="slide.image.url" :alt="slide.title" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-black bg-opacity-30 flex flex-col justify-center items-center text-white p-8">
                <h1 class="text-4xl font-bold mb-4 text-center">{{ slide.title }}</h1>
                <p class="text-lg text-center">{{ slide.contents }}</p>
            </div>
        </div>

        <!-- Navigation Buttons -->
        <button @click="prevSlide" class="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 focus:outline-none z-10">
            &#10094;
            <!-- < -->
        </button>
        <button @click="nextSlide" class="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 focus:outline-none z-10">
            &#10095;
            <!-- > -->
        </button>

        <!-- Pagination Dots -->
        <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
            <button
                v-for="(slide, index) in slides"
                :key="`dot-${slide.id}`"
                @click="goToSlide(index)"
                :class="['w-3 h-3 rounded-full', currentIndex === index ? 'bg-white' : 'bg-gray-400 hover:bg-gray-200']"
            ></button>
        </div>
    </div>
</template>

<script setup>
import {ref, onMounted, onUnmounted} from "vue";

const props = defineProps({
    slides: {
        type: Array,
        required: true,
        default: () => [],
    },
});

const currentIndex = ref(0);
let slideInterval = null;

const nextSlide = () => {
    currentIndex.value = (currentIndex.value + 1) % props.slides.length;
};

const prevSlide = () => {
    currentIndex.value = (currentIndex.value - 1 + props.slides.length) % props.slides.length;
};

const goToSlide = (index) => {
    currentIndex.value = index;
};

onMounted(() => {
    if (props.slides.length > 1) {
        slideInterval = setInterval(nextSlide, 5000); // 5초마다 자동 슬라이드
    }
});

onUnmounted(() => {
    clearInterval(slideInterval);
});

// slide.js의 복잡한 DOM 조작 대신 Vue의 데이터 바인딩과 상태 관리를 사용합니다.
// 기존 slide.js의 pagination 생성 로직은 v-for와 @click으로 대체됩니다.
</script>
