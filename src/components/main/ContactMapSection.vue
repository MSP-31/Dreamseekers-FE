<template>
    <div class="py-12">
        <div class="content-box container mx-auto px-4">
            <h1 class="text-3xl font-bold text-dream-text text-center mb-8">오시는 길</h1>

            <!-- 지도 -->
            <NaverMap />

            <div class="map_address text-center mb-8">
                <h3 class="text-xl font-semibold text-dream-text">꿈을찾는사람들교육원</h3>
                <h2 class="text-lg text-gray-700 mb-3">{{ contacts.address }} / {{ contacts.sub_address }}</h2>
                <a :href="contacts.map_add" target="_blank" class="inline-block bg-[var(--dream-main)] hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded transition-colors">
                    지도에서 보기
                </a>
            </div>

            <div class="info_box bg-white p-6 rounded-lg shadow-lg">
                <table class="w-full text-sm text-left text-gray-700">
                    <tbody>
                        <tr class="border-b">
                            <th class="py-3 px-2 md:px-4 font-semibold w-1/4 md:w-1/5">이용시간</th>
                            <td class="py-3 px-2 md:px-4">
                                평일 {{ contacts.weekday_start_time }} - {{ contacts.weekday_end_time }}<br />
                                주말 {{ contacts.weekend_start_time }} - {{ contacts.weekend_end_time }}
                            </td>
                        </tr>
                        <tr class="border-b">
                            <th class="py-3 px-2 md:px-4 font-semibold">전화번호</th>
                            <td class="py-3 px-2 md:px-4">
                                {{ contacts.phone }}<br />
                                {{ contacts.sub_phone }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {type PropType} from "vue";
import type {Contact, BusinessInfo} from "@/data/dummyData.ts";
import NaverMap from "./NaverMap.vue";

const props = defineProps({
    contacts: {type: Object as PropType<Contact>, required: true},
    businessInfo: {type: Object as PropType<BusinessInfo>, required: true},
    naverMapClientId: {type: String, required: true},
});

// window 객체에 naver 속성을 사용하기 위해 타입 선언 (필요한 경우)
declare global {
    interface Window {
        naver: any;
    }
}
</script>
