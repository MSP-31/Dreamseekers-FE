<template>
    <section id="process" class="scroll-section bg-gray-50">
        <div class="flex flex-col justify-center w-full py-16" style="min-height: calc(100vh - 4rem)">
            <div class="container mx-auto px-6 text-center">
                <h2 class="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-800" v-scroll-animate>간편한 <span class="text-main">수강신청 절차</span></h2>

                <div class="flex flex-col md:flex-row justify-center items-start md:items-center space-y-8 md:space-y-0 delay-1" v-scroll-animate>
                    <div class="process-step active">
                        <div class="process-icon-wrapper"><span class="process-icon">📝</span></div>
                        <h3 class="process-title">신청</h3>
                    </div>

                    <div class="process-step active">
                        <div class="process-icon-wrapper"><span class="process-icon">✅</span></div>
                        <h3 class="process-title">확인</h3>
                    </div>

                    <div class="process-step active">
                        <div class="process-icon-wrapper"><span class="process-icon">🧑‍🏫</span></div>
                        <h3 class="process-title">수강</h3>
                    </div>

                    <div class="process-step active">
                        <div class="process-icon-wrapper"><span class="process-icon">📜</span></div>
                        <h3 class="process-title">수료증 발급</h3>
                    </div>
                </div>

                <p class="text-lg text-gray-600 mt-12 mb-10 delay-2" v-scroll-animate>간단한 절차를 통해 원하시는 강의를 빠르게 신청하고 수강하실 수 있습니다.</p>

                <button
                    class="bg-white border-2 border-main text-main font-bold py-3 px-8 rounded-full text-lg hover:bg-main hover:text-white transition-colors duration-300 transform hover:scale-105 delay-3"
                    v-scroll-animate
                >
                    자주 묻는 질문 (Q&A)
                </button>
            </div>
        </div>
    </section>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
    name: "ProcessSection",
});
</script>
