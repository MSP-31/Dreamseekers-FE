<template>
    <div id="naver-map-container" class="w-full h-96 rounded-lg shadow-xl mb-8"></div>
</template>

<script setup lang="ts">
import {onMounted, onBeforeUnmount, reactive} from "vue";
import {contactInfoData, type ContactInfo} from "@/data/dummyData";
const ncpClientId = import.meta.env.VITE_NAVER_MAPS_CLIENT_ID;

const contactInfo = reactive<ContactInfo>({...contactInfoData});

// Naver Map 관련 상태
let mapInstance: naver.maps.Map | null = null;
let markerInstance: naver.maps.Marker | null = null;

// Naver Maps API 스크립트를 동적으로 로드하는 헬퍼 함수
const loadNaverMapsScript = (clientId: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        if (typeof naver !== "undefined" && naver.maps) {
            resolve();
            return;
        }

        const scriptId = "naver-maps-script";
        if (document.getElementById(scriptId)) {
            resolve();
            return;
        }

        const script = document.createElement("script");
        script.id = scriptId;
        script.type = "text/javascript";
        script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${clientId}`;
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

// 지도 초기화 및 마커 설정 함수
const initMap = () => {
    if (!naver || !naver.maps) {
        console.error("Naver Maps API not available.");
        return;
    }

    const mapOptions: naver.maps.MapOptions = {
        center: new naver.maps.LatLng(contactInfo.latitude, contactInfo.longitude),
        zoom: 17,
        mapTypeId: naver.maps.MapTypeId.NORMAL,
        scaleControl: true,
        mapDataControl: true,
        zoomControl: true,
        minZoom: 6,
    };

    // 'naver-map-container' ID를 가진 DOM 요소에 지도를 그립니다.
    mapInstance = new naver.maps.Map("naver-map-container", mapOptions);

    markerInstance = new naver.maps.Marker({
        position: new naver.maps.LatLng(contactInfo.latitude, contactInfo.longitude),
        map: mapInstance,
    });

    console.log("Naver Map initialized.");
};

// 컴포넌트 마운트 시 지도 로드 및 초기화
onMounted(async () => {
    try {
        if (!ncpClientId) {
            console.error("Naver Maps Client ID is not provided.");
            return;
        }
        await loadNaverMapsScript(ncpClientId);
        initMap();
    } catch (error) {
        console.error("Failed to initialize map:", error);
    }
});

// 컴포넌트 언마운트 시 지도 리소스 정리 (선택적)
onBeforeUnmount(() => {
    if (mapInstance) {
        // Naver Maps API v3는 공식적인 destroy 메서드를 명시적으로 제공하지 않습니다.
        // 하지만 mapInstance와 markerInstance를 null로 설정하여 참조를 해제하고,
        // 브라우저의 가비지 컬렉터가 정리하도록 돕습니다.
        mapInstance = null;
        markerInstance = null;
    }
});
</script>

<style scoped>
/* 선택적으로 지도 컨테이너에 대한 추가 스타일 */
#naver-map-container {
    /* 부모 컴포넌트에서 width/height를 지정하므로 여기서는 최소한만 */
    min-height: 200px; /* 지도가 최소한 보일 수 있도록 */
}
</style>
