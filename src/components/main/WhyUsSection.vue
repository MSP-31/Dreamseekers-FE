<template>
    <section id="why-us" class="scroll-section bg-white">
        <div class="flex flex-col justify-center w-full py-16" style="min-height: calc(100vh - 4rem)">
            <div class="container mx-auto px-6">
                <h2 class="text-4xl md:text-5xl font-bold text-center mb-12 text-gray-800" v-scroll-animate>왜 <span class="text-main">꿈을 찾는 사람들</span>인가?</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div class="bg-gray-50 p-8 rounded-xl shadow-lg text-center transform transition-all duration-300 hover:scale-105 hover:shadow-xl" v-scroll-animate>
                        <div class="why-us-icon">🚗</div>
                        <h3 class="text-xl font-bold text-gray-800 mb-3">전국 출장 강의</h3>
                        <p class="text-base text-gray-600">장소에 구애받지 않고, 전문 강사진이 전국 어디든 직접 방문하여 강의를 진행합니다.</p>
                    </div>

                    <div class="bg-gray-50 p-8 rounded-xl shadow-lg text-center transform transition-all duration-300 hover:scale-105 hover:shadow-xl delay-1" v-scroll-animate>
                        <div class="why-us-icon">💻</div>
                        <h3 class="text-xl font-bold text-gray-800 mb-3">온·오프라인 병행</h3>
                        <p class="text-base text-gray-600">실시간 비대면(ZOOM) 강의와 현장 강의를 병행하여 교육 효과를 극대화합니다.</p>
                    </div>

                    <div class="bg-gray-50 p-8 rounded-xl shadow-lg text-center transform transition-all duration-300 hover:scale-105 hover:shadow-xl delay-2" v-scroll-animate>
                        <div class="why-us-icon">📋</div>
                        <h3 class="text-xl font-bold text-gray-800 mb-3">맞춤형 커리큘럼</h3>
                        <p class="text-base text-gray-600">기업 및 기관의 특성과 요구에 맞춘 최적화된 교육 내용을 설계하여 제공합니다.</p>
                    </div>

                    <div class="bg-gray-50 p-8 rounded-xl shadow-lg text-center transform transition-all duration-300 hover:scale-105 hover:shadow-xl delay-3" v-scroll-animate>
                        <div class="why-us-icon">🏆</div>
                        <h3 class="text-xl font-bold text-gray-800 mb-3">다수 실적 보유</h3>
                        <p class="text-base text-gray-600">공공기관 및 유수 기업 대상의 풍부한 강의 실적을 통해 신뢰성을 입증합니다.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
    name: "WhyUsSection",
});
</script>
