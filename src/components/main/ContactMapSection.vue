<template>
    <div class="py-12">
        <div class="content-box container mx-auto px-4">
            <h1 class="text-3xl font-bold text-dream-text text-center mb-8">오시는 길</h1>

            <!-- 지도 -->
            <div id="map-container" class="w-full h-72 md:h-96 bg-gray-300 rounded-lg shadow-md mb-6 relative">
                <!-- 실제 네이버 지도가 여기에 렌더링됩니다. -->
                <div v-if="!mapLoaded" class="absolute inset-0 flex items-center justify-center text-gray-500">지도 로딩 중... (Naver Maps API 키를 확인해주세요)</div>
            </div>

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
                        <!--  
                        <tr>
                            <th class="py-3 px-2 md:px-4 font-semibold align-top">사업자 정보</th>
                            <td class="py-3 px-2 md:px-4">
                                상호명: 꿈을찾는사람들교육원<br />
                                대표: {{ businessInfo.rep }}<br />
                                이메일: {{ businessInfo.email }}
                            </td>
                            <th class="py-3 px-2 md:px-4 font-semibold align-top hidden md:table-cell">입금 정보</th>
                            <td class="py-3 px-2 md:px-4 hidden md:table-cell">
                                예금주: {{ businessInfo.depositor }}<br />
                                은행: {{ businessInfo.bank }}<br />
                                계좌번호: {{ businessInfo.account }}
                            </td>
                        </tr>
                        -->
                        <!-- 
                        <tr class="md:hidden border-t">
                            <th class="py-3 px-2 md:px-4 font-semibold align-top">입금 정보</th>
                            <td class="py-3 px-2 md:px-4">
                                예금주: {{ businessInfo.depositor }}<br />
                                은행: {{ businessInfo.bank }}<br />
                                계좌번호: {{ businessInfo.account }}
                            </td>
                        </tr>
                        -->
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {ref, onMounted, type PropType} from "vue";
import type {Contact, BusinessInfo} from "@/data/dummyData.ts";

const props = defineProps({
    contacts: {type: Object as PropType<Contact>, required: true},
    businessInfo: {type: Object as PropType<BusinessInfo>, required: true},
    naverMapClientId: {type: String, required: true},
});

const mapLoaded = ref(false);

onMounted(() => {
    // Naver Maps API 스크립트가 로드되었는지 확인 후 지도 초기화
    // index.html에 스크립트 태그가 있거나, 여기서 동적으로 로드해야 합니다.
    if (window.naver && window.naver.maps) {
        const mapOptions = {
            center: new window.naver.maps.LatLng(props.contacts.latitude, props.contacts.longitude),
            zoom: 17,
        };
        const map = new window.naver.maps.Map("map-container", mapOptions);
        new window.naver.maps.Marker({position: mapOptions.center, map: map});
        mapLoaded.value = true;
    } else {
        console.error("Naver Maps API가 로드되지 않았습니다. index.html 또는 동적 로드를 확인하세요.");
        // API 로드를 위한 동적 스크립트 추가 로직을 여기에 구현할 수 있습니다.
    }
});

// window 객체에 naver 속성을 사용하기 위해 타입 선언 (필요한 경우)
declare global {
    interface Window {
        naver: any;
    }
}
</script>
