<template>
    <section id="contact" class="scroll-section bg-white">
        <div class="flex flex-col justify-center w-full py-16" style="min-height: calc(100vh - 4rem)">
            <div class="container mx-auto px-6 text-center">
                <h2 class="text-4xl md:text-5xl font-bold text-center mb-12 text-gray-800" v-scroll-animate><span class="text-main">무엇이든</span> 물어보세요</h2>
                <p class="text-lg text-gray-600 max-w-lg mx-auto mb-12 delay-1" v-scroll-animate>교육 과정, 일정, 비용 등 궁금한 점이 있다면 언제든지 편한 방법으로 문의해주세요.</p>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
                    <div class="bg-gray-50 p-8 rounded-xl shadow-lg text-center transform transition-all duration-300 hover:scale-105 hover:shadow-xl delay-2" v-scroll-animate>
                        <span class="text-6xl">💬</span>
                        <h3 class="text-2xl font-bold text-gray-800 my-3">카카오톡 문의</h3>
                        <p class="text-gray-600 mb-4">@꿈을찾는사람들</p>
                        <a href="#" class="font-bold text-main hover:text-blue-700">채널 바로가기 &rarr;</a>
                    </div>

                    <div class="bg-gray-50 p-8 rounded-xl shadow-lg text-center transform transition-all duration-300 hover:scale-105 hover:shadow-xl delay-3" v-scroll-animate>
                        <span class="text-6xl">📞</span>
                        <h3 class="text-2xl font-bold text-gray-800 my-3">전화 문의</h3>
                        <p class="text-gray-600 mb-4">02-1234-5678</p>
                        <a href="tel:02-1234-5678" class="font-bold text-main hover:text-blue-700">전화 걸기 &rarr;</a>
                    </div>

                    <div class="bg-gray-50 p-8 rounded-xl shadow-lg text-center transform transition-all duration-300 hover:scale-105 hover:shadow-xl delay-4" v-scroll-animate>
                        <span class="text-6xl">📧</span>
                        <h3 class="text-2xl font-bold text-gray-800 my-3">이메일 문의</h3>
                        <p class="text-gray-600 mb-4">contact@dreamseeker.edu</p>
                        <a href="mailto:contact@dreamseeker.edu" class="font-bold text-main hover:text-blue-700">메일 보내기 &rarr;</a>
                    </div>
                </div>

                <button class="bg-main text-white font-bold py-3 px-10 rounded-full text-lg hover:bg-blue-700 transition-colors duration-300 transform hover:scale-105 delay-5" v-scroll-animate>
                    간편 문의하기
                </button>
            </div>
        </div>
    </section>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
    name: "ContactSection",
});
</script>
