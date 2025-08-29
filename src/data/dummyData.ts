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

// 강사 소개
export interface Instructor {
    id: number;
    name: string;
    contents: string;
    image: string; // 이미지 URL
}

// 모달 폼 데이터 타입
export interface InstructorFormData {
    name: string;
    contents: string;
    image?: File | string | null;
}

// 강의 추가/수정 모달 폼 데이터 타입
export interface LectureFormData {
    title: string;
    contents: string;
    image?: File | string | null;
}

// 모달 폼 필드 정의
export interface InstructorFormField {
    id: string;
    name: keyof InstructorFormData | "imageFile"; // 'imageFile'은 실제 File 객체를 다루기 위한 이름
    label: string;
    type: "text" | "textarea" | "image";
}

// 오시는 길 페이지에 사용될 데이터
export interface ContactInfo {
    address: string;
    sub_address: string;
    map_add: string; // 지도 링크
    phone: string;
    sub_phone: string;
    weekday_start_time: string;
    weekday_end_time: string;
    weekend_start_time: string;
    weekend_end_time: string;
    latitude: number;
    longitude: number;
    ncpClientId: string; // Naver Cloud Platform Client ID (실제로는 .env 파일 등에서 관리 권장)
}

export interface BusinessInfo {
    rep: string;
    email: string;
    depositor: string;
    bank: string;
    account: string;
    parking_info: string; // 주차 안내
    usage_guide: string; // 이용 안내
}
//-----------------------------

// 강의 목록 및 상세 페이지용 데이터 타입
export interface LectureItem {
    id: number;
    title: string;
    contents: string;
    image: string; // 이미지 URL
    // category?: string; // 필요시 카테고리 추가
}

export interface LectureFormSchemaField {
    id: string;
    name: keyof LectureFormData | "imageFile";
    label: string;
    type: "text" | "textarea" | "image";
}

export const lectureFormSchema: LectureFormSchemaField[] = [
    {id: "title", name: "title", label: "강의명", type: "text"},
    {id: "contents", name: "contents", label: "강의 내용", type: "textarea"},
    {id: "image", name: "image", label: "강의 대표 이미지", type: "image"}, // name이 "image"인지 확인
];

//-----------------------------
export const dummyContacts: Ref<Contact> = ref({
    address: "경상남도 창원시 성산구용지로 70 ",
    sub_address: "성원 그랜드오피스텔 10층 1029호",
    map_add: "https://map.naver.com/p/entry/place/15838380?c=17.10,0,0,0,dh&placePath=/home?from=map&fromPanelNum=1&additionalHeight=76&timestamp=202506231548&locale=ko&svcName=map_pcv5", // 네이버 지도 링크
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
    parking_info: "string",
    usage_guide: "string",
});

export const naverClientId: Ref<string> = ref("YOUR_NCP_CLIENT_ID"); // 네이버 클라우드 플랫폼 Client ID

// ----------------

export const contactInfoData: ContactInfo = {
    address: "경상남도 창원시 성산구용지로 70 ",
    sub_address: "성원 그랜드오피스텔 10층 1029호",
    map_add: "https://map.naver.com/p/entry/place/15838380?c=17.10,0,0,0,dh&placePath=/home?from=map&fromPanelNum=1&additionalHeight=76&timestamp=202506231548&locale=ko&svcName=map_pcv5", // 네이버 지도 링크
    weekday_start_time: "09:00",
    weekday_end_time: "18:00",
    weekend_start_time: "10:00",
    weekend_end_time: "16:00",
    phone: "055-6010-451",
    sub_phone: "010-9371-0450",
    latitude: 35.2220973957462,
    longitude: 128.676299239476,
};

export const businessInfoData: BusinessInfo = {
    rep: "홍의섭",
    email: "jhs9747@naver.com",
    depositor: "꿈을찾는사람들교육원(홍의섭)",
    bank: "국민은행",
    account: "654301-04-315674",
    parking_info: "유료주차 / 2시간 무료", // 예시 주차 안내
    usage_guide: "예약\n주차", // 예시 이용 안내 (줄바꿈 포함)
};
//-----------------------------

// 문의 내역 페이지에 사용될 데이터 타입
export interface InquiryPost {
    pk: number; // 게시글 고유 ID (Django의 pk와 일치)
    title: string;
    author: string;
    created_at: string; // 날짜 형식 (예: "YYYY-MM-DD")
}

// 페이지네이션 데이터 타입 (Django Paginator 객체 구조 참고)
export interface PaginationData {
    count: number; // 전체 게시글 수
    start_index: number; // 현재 페이지의 첫 항목의 전체 목록에서의 1-based 인덱스
    number: number; // 현재 페이지 번호 (1-based)
    has_other_pages: boolean; // 현재 페이지 외 다른 페이지가 있는지 여부
    has_previous: boolean; // 이전 페이지가 있는지 여부
    has_next: boolean; // 다음 페이지가 있는지 여부
    previous_page_number: number | null; // 이전 페이지 번호
    next_page_number: number | null; // 다음 페이지 번호
    custom_range: number[]; // 페이지네이션에 표시할 페이지 번호 배열 (예: [1, 2, 3, 4, 5])
}

// 문의 작성 페이지에 사용될 데이터 타입
export interface InquiryWriteFormData {
    email: string;
    phone: string;
    title: string;
    contents: string;
    // 필요한 경우 파일 첨부 등 추가 필드 정의
}

export interface InquiryWriteFormField {
    id: string;
    name: keyof InquiryWriteFormData;
    label: string;
    type: "text" | "textarea";
    placeholder?: string;
}

// 문의 작성 폼 스키마
export const inquiryWriteFormSchema: InquiryWriteFormField[] = [
    {id: "inquiry-email", name: "email", label: "이메일", type: "text", placeholder: "ex) example@naver.com"},
    {id: "inquiry-phone", name: "phone", label: "연락처", type: "text", placeholder: "ex) 010-1234-5678"},
    {id: "inquiry-title", name: "title", label: "제목", type: "text", placeholder: "문의 제목을 입력해주세요."},
    {id: "inquiry-contents", name: "contents", label: "내용", type: "textarea", placeholder: "문의 내용을 상세히 작성해주세요."},
];

// ---------------
// 활동 소식 페이지에 사용될 데이터 타입
export interface ActivityNewsItem {
    id: number; // 고유 ID 추가
    link: string; // 원본 게시물 링크
    title: string;
    description: string;
    source: string; // 출처 (예: "네이버 블로그")
    sourceLink?: string; // 출처 링크 (선택적)
    postdate: string; // 게시일 (예: "20231027" 또는 "2023-10-27")
}

// -----------------
// 검색 유형 옵션
export const noticeSearchTypes = [
    {value: "all", text: "전체"},
    {value: "title", text: "제목"},
    {value: "contents", text: "내용"},
];
