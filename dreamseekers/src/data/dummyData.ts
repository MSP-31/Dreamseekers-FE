import {ref, type Ref} from "vue";

interface ImageUrl {
    url: string;
}

export interface Slide {
    id: number;
    image: ImageUrl;
    title: string;
    contents: string;
}

export interface Lecture {
    pk: number;
    title: string;
    contents: string;
    image: ImageUrl;
}

export interface ScheduleEntry {
    title: string;
    time: string;
    contents: string;
}

export interface ScheduleData {
    [date: string]: ScheduleEntry[];
}

export interface Contact {
    address: string;
    sub_address: string;
    map_add: string;
    latitude: number;
    longitude: number;
    weekday_start_time: string;
    weekday_end_time: string;
    weekend_start_time: string;
    weekend_end_time: string;
    phone: string;
    sub_phone: string;
}

export interface BusinessInfo {
    rep: string;
    email: string;
    depositor: string;
    bank: string;
    account: string;
}

// export interface FooterInfo {
//   rep: string;
//   address: string;
//   sub_address: string;
//   CRN: string;
//   phone: string;
//   email: string;
//   sub_phone: string;
// }

export const dummySlides: Ref<Slide[]> = ref([
    {id: 1, image: {url: "/img/1.jpg"}, title: "꿈을 찾는 여정", contents: "당신의 가능성을 발견하세요."},
    {id: 2, image: {url: "/img/1.jpg"}, title: "전문가의 길", contents: "최고의 강사진과 함께합니다."},
    // public/img/slide1.jpg, slide2.jpg 등 이미지 파일 필요
]);

export const dummyLectures: Ref<Lecture[]> = ref([
    {pk: 1, title: "Vue.js 마스터 클래스", contents: "Vue.js의 모든 것을 배우는 심층 강의입니다. 기초부터 실전 프로젝트까지 다룹니다.", image: {url: "/img/1.jpg"}},
    {pk: 2, title: "Tailwind CSS 디자인 워크샵", contents: "Tailwind CSS를 활용한 빠르고 효율적인 UI 개발 방법을 익힙니다.", image: {url: "/img/1.jpg"}},
    // public/img/lecture1.jpg, lecture2.jpg 등 이미지 파일 필요
]);

export const dummySchedules: Ref<ScheduleData> = ref({
    // "2024-7-15": [{ title: "Vue 특강", time: "14:00", contents: "Vue.js 심화 과정" }]
});

export const dummyContacts: Ref<Contact> = ref({
    address: "경상남도 창원시 성산구용지로 70 ",
    sub_address: "성원 그랜드오피스텔 10층 1029호",
    map_add: "https://map.naver.com/p/entry/place/12345?c=15.00,0,0,0,dh", // 네이버 지도 링크
    latitude: 37.4979, // 예시 위도
    longitude: 127.0276, // 예시 경도
    weekday_start_time: "09:00",
    weekday_end_time: "18:00",
    weekend_start_time: "10:00",
    weekend_end_time: "16:00",
    phone: "055-6010-451",
    sub_phone: "010-9371-0450",
});

export const dummyBusinessInfo: Ref<BusinessInfo> = ref({
    rep: "홍의섭",
    email: "jhs9747@naver.com",
    depositor: "꿈을찾는사람들교육원(홍의섭)",
    bank: "국민은행",
    account: "654301-04-315674",
});

export const isUserStaff: Ref<boolean> = ref(false); // 관리자 여부 더미 데이터

export const naverClientId: Ref<string> = ref("YOUR_NCP_CLIENT_ID"); // 네이버 클라우드 플랫폼 Client ID

// Footer 정보는 App.vue에서 이미 정의함
// export const dummyFooterInfo: Ref<FooterInfo | null> = ref(null); // 예시: 초기값 null
// 또는
// export const dummyFooterInfo: Ref<FooterInfo> = ref({
//   rep: '박원장',
//   address: '서울특별시 강남구 테헤란로 123',
//   sub_address: '드림타워 5층',
//   CRN: '111-22-33333',
//   phone: '02-987-6543',
//   email: 'admin@dreamseekers.com',
//   sub_phone: '070-987-6543'
// });
