<template>
    <section id="welcome" class="scroll-section bg-white">
        <div class="flex flex-col items-center justify-center w-full p-6" style="min-height: calc(100vh - 4rem)">
            <div class="flex flex-col items-center justify-center text-center">
                <span class="text-8xl mb-6" v-scroll-animate>👋</span>
                <h2 class="text-4xl md:text-5xl font-bold mb-4 text-gray-800 delay-1" v-scroll-animate>꿈을 찾는 사람들 교육원에 오신 것을 환영합니다!</h2>
                <p class="text-2xl md:text-3xl font-semibold text-main max-w-3xl mb-10 delay-2" v-scroll-animate>“전국 어디서든, 누구에게나 필요한 의무교육을 제공합니다”</p>
                <p class="text-lg text-gray-600 max-w-lg mb-10 delay-3" v-scroll-animate>저희 교육원은 법정의무교육, 직무역량 강화, 리더십 교육 등 다양한 분야에서 최고의 교육 솔루션을 제공합니다.</p>
                <button
                    @click="$emit('goto', '#why-us')"
                    class="bg-main text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-blue-700 transition-colors duration-300 transform hover:scale-105 delay-4"
                    v-scroll-animate
                >
                    교육원 소개 자세히 보기
                </button>
            </div>
        </div>
    </section>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
    name: "WelcomeSection",
    emits: ["goto"],
});
</script>
