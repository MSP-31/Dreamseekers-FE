<template>
    <div class="font-[var(--font-body)]">
        <!-- Top Image Section -->
        <div class="relative h-64 md:h-80 bg-gray-700">
            <img src="/img/top_header/intro.jpg" alt="교육원 소개 배경 이미지" class="w-full h-full object-cover opacity-50" />
            <div class="absolute inset-0 flex items-center justify-center">
                <h1 class="text-white text-4xl md:text-5xl font-bold">교육원 소개</h1>
            </div>
        </div>

        <!-- Main Content Section -->
        <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 class="text-3xl font-bold text-center mb-10 text-[var(--dream-text)]">오시는 길</h1>

            <!-- Map Area -->
            <div id="map" class="w-full h-96 rounded-lg shadow-xl mb-8">
                <!-- Naver Map will be rendered here -->
            </div>

            <!-- Address and Map Link -->
            <div class="map_address text-left py-6 border-b border-[var(--dream-text)] mb-8 relative">
                <h3 class="text-lg font-semibold text-[var(--dream-text)] mb-1">꿈을찾는사람들교육원</h3>
                <h2 class="text-2xl font-bold text-[var(--dream-main)]">{{ contactInfo.address }} / {{ contactInfo.sub_address }}</h2>
                <a
                    :href="contactInfo.map_add"
                    target="_blank"
                    class="absolute right-0 top-2 bg-[var(--dream-blue)] hover:bg-opacity-80 text-white font-semibold py-2 px-4 rounded-md shadow-sm transition duration-150 ease-in-out"
                >
                    지도에서 보기
                </a>
            </div>

            <!-- Contact and Business Info Box (Separated Component) -->
            <ContactInfoBox :contactInfo="contactInfo" :businessInfo="businessInfo" />

            <!-- Empty decorative divider (from original .board-title) -->
            <div class="mt-12 border-t border-[var(--dream-gray-dark)] opacity-30"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {ref, reactive, onMounted, onBeforeUnmount} from "vue";
import ContactInfoBox from "@/components/ContactInfoBox.vue"; // 컴포넌트 경로에 맞게 수정
import {contactInfoData, businessInfoData, type ContactInfo, type BusinessInfo} from "@/data/dummyData"; // dummyData.ts 경로에 맞게 수정

// 현재 페이지에 표시될 데이터 (초기값은 더미 데이터)
const contactInfo = reactive<ContactInfo>({...contactInfoData});
const businessInfo = reactive<BusinessInfo>({...businessInfoData});

// Naver Map 관련 상태 및 함수
let map: naver.maps.Map | null = null;
let marker: naver.maps.Marker | null = null;

// Naver Maps API 스크립트를 동적으로 로드하는 헬퍼 함수
const loadNaverMapsScript = (clientId: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        // 이미 로드되었는지 확인
        if (typeof naver !== "undefined" && naver.maps) {
            resolve();
            return;
        }

        const scriptId = "naver-maps-script";
        if (document.getElementById(scriptId)) {
            // 스크립트 태그는 있지만 아직 로딩 중일 수 있음.
            // 이 경우, window.naver.maps가 정의될 때까지 기다리거나,
            // 이미 로드된 것으로 간주하고 resolve() 할 수 있습니다.
            // 여기서는 간단히 resolve() 처리합니다.
            resolve();
            return;
        }

        const script = document.createElement("script");
        script.id = scriptId;
        script.type = "text/javascript";
        script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${clientId}`;
        script.async = true;
        script.onload = () => {
            console.log("Naver Maps script loaded.");
            resolve();
        };
        script.onerror = (error) => {
            console.error("Naver Maps script load error:", error);
            reject(new Error("Failed to load Naver Maps script"));
        };
        document.head.appendChild(script);
    });
};

// 지도 초기화 함수
const initMap = () => {
    if (!naver || !naver.maps) {
        console.error("Naver Maps API not available.");
        return;
    }

    const mapOptions = {
        center: new naver.maps.LatLng(contactInfo.latitude, contactInfo.longitude),
        zoom: 17, // 적절한 줌 레벨 설정
        mapTypeId: naver.maps.MapTypeId.NORMAL,
        scaleControl: true,
        mapDataControl: true,
        zoomControl: true,
        minZoom: 6,
    };

    map = new naver.maps.Map("map", mapOptions);

    marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(contactInfo.latitude, contactInfo.longitude),
        map: map,
    });

    console.log("Naver Map initialized.");
};

// 컴포넌트 마운트 시 지도 로드 및 초기화
onMounted(async () => {
    try {
        await loadNaverMapsScript(contactInfo.ncpClientId);
        initMap();
    } catch (error) {
        console.error("Failed to initialize map:", error);
        // 사용자에게 오류 메시지 표시
    }
});

// 컴포넌트 언마운트 시 지도 리소스 정리 (선택적)
onBeforeUnmount(() => {
    if (map) {
        // map.destroy(); // Naver Maps API v3에는 공식적인 destroy 메서드가 명시되어 있지 않음
        // 대부분의 경우 가비지 컬렉터가 처리하지만, 복잡한 앱에서는 수동 정리 고려
        map = null;
        marker = null;
    }
});
</script>
