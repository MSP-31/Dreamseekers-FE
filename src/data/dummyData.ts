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

//-----------------------------
export interface IntroData {
    image: string;
    title: string;
    contents: string;
}

export interface FormField {
    id: string;
    name: string;
    label: string;
    type: "text" | "textarea" | "image";
    // value?: string | File | null; // 필요에 따라 초기값 타입 확장
}
//-----------------------------

// 강사 소개
export interface Instructor {
    id: number;
    name: string;
    contents: string;
    image: string; // 이미지 URL
}

// 모달 폼 데이터 타입 (이미지는 File 객체로 별도 관리)
export interface InstructorFormData {
    name: string;
    contents: string;
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

// 강의 추가/수정 모달 폼 데이터 타입
export interface LectureFormData {
    title: string;
    contents: string;
    // imageFile은 별도로 File 객체로 관리
}

// 강의 추가/수정 모달 폼 필드 정의
export interface LectureFormSchemaField {
    id: string;
    name: keyof LectureFormData | "imageFile";
    label: string;
    type: "text" | "textarea" | "image";
}
//-----------------------------

//-----------------------------

// 강의 상세 페이지의 하위 강의 항목
export interface LectureSubItem {
    id: number; // 하위 항목의 고유 ID
    mainLectureId: number; // 상위 LectureItem의 ID
    title: string;
    contents: string;
    image?: string; // 하위 항목 이미지 (선택적)
}

// 하위 강의 추가/수정 모달 폼 데이터 타입
export interface LectureSubItemFormData {
    title: string;
    contents: string;
}

export const dummySlides: Ref<Slide[]> = ref([
    {id: 1, image: {url: "/img/1.jpg"}, title: "꿈을 찾는 여정", contents: "당신의 가능성을 발견하세요."},
    {id: 2, image: {url: "/img/1.jpg"}, title: "전문가의 길", contents: "최고의 강사진과 함께합니다."},
    // public/img/slide1.jpg, slide2.jpg 등 이미지 파일 필요
]);

export const dummySchedules: Ref<ScheduleData> = ref({
    // "2024-7-15": [{ title: "Vue 특강", time: "14:00", contents: "Vue.js 심화 과정" }]
});

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

export const isUserStaff: Ref<boolean> = ref(false); // 관리자 여부 더미 데이터

export const naverClientId: Ref<string> = ref("YOUR_NCP_CLIENT_ID"); // 네이버 클라우드 플랫폼 Client ID

//-----------------------------
// 인사말 페이지에 사용될 더미 데이터
export const greetingIntroData: IntroData = {
    image: "/img/dummy/representative-dummy.jpg", // Vite의 public 폴더 기준 예시 경로입니다. 실제 이미지 경로로 수정해주세요.
    title: "꿈을 찾는 이들을 위한 따뜻한 인사말",
    contents: `안녕하세요. 꿈을찾는사람들 교육원에 오신 것을 진심으로 환영합니다.\n저희는 여러분 각자의 소중한 꿈이 현실이 될 수 있도록 돕는 든든한 동반자가 되겠습니다.\n\n다년간 축적된 교육 경험과 전문성을 바탕으로, 여러분의 잠재력을 최대한 발휘하고 성공적인 미래를 설계할 수 있도록 양질의 교육 콘텐츠와 맞춤형 지원을 제공할 것을 약속드립니다.`,
};

// (관리자용) 수정 모달 폼 필드 정의
// Django 템플릿의 {{ form }} 부분을 기반으로 추정하여 작성합니다.
// 실제 Django Form 클래스의 필드 구성에 맞게 조정해야 합니다.
export const greetingFormFields: FormField[] = [
    {id: "intro-title", name: "title", label: "제목", type: "text"},
    {id: "intro-contents", name: "contents", label: "내용", type: "textarea"},
    {id: "intro-image", name: "image", label: "대표 이미지", type: "image"},
];

// 사용자 상태 (is_staff) - 실제 애플리케이션에서는 인증 상태에 따라 동적으로 관리됩니다.
export const userStatus = {
    isStaff: true, // 예시: 현재 사용자가 관리자라고 가정
};
//-----------------------------

// 강사 목록 더미 데이터
export const instructorsListData: Instructor[] = [
    {
        id: 1,
        name: "김강사 프로",
        contents: "Vue.js 및 최신 웹 프론트엔드 기술 전문가.\n실무 중심의 명쾌한 강의로 여러분의 성장을 돕겠습니다.",
        image: "/img/dummy/instructor1-dummy.jpg", // public 폴더 기준 예시 경로
    },
    {
        id: 2,
        name: "이선생 마스터",
        contents: "데이터베이스 설계와 백엔드 시스템 아키텍처 전문가.\n탄탄한 기본기와 실전 노하우를 전수합니다.",
        image: "/img/dummy/instructor2-dummy.jpg", // public 폴더 기준 예시 경로
    },
    {
        id: 3,
        name: "박교수 엑스퍼트",
        contents: "알고리즘, 자료구조 및 문제 해결 전략 교육.\n논리적 사고와 코딩 역량을 함께 키워드립니다.",
        image: "/img/dummy/instructor3-dummy.jpg", // public 폴더 기준 예시 경로
    },
    {
        id: 4,
        name: "최강사 스페셜리스트",
        contents: "UI/UX 디자인 및 사용자 중심 개발 방법론.\n매력적이고 사용하기 쉬운 서비스를 만드는 비법을 공유합니다.",
        image: "/img/dummy/instructor4-dummy.jpg", // public 폴더 기준 예시 경로
    },
];

// 강사 추가/수정 모달 폼 스키마
export const instructorFormSchema: InstructorFormField[] = [
    {id: "instr-name", name: "name", label: "강사명", type: "text"},
    {id: "instr-contents", name: "contents", label: "소개", type: "textarea"},
    {id: "instr-image", name: "imageFile", label: "대표 이미지", type: "image"},
];

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
    ncpClientId: "YOUR_NAVER_MAPS_CLIENT_ID", // !!! 실제 Naver Maps Client ID로 교체하세요 !!!
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
// 강의 목록 더미 데이터 (lecture_list.html의 'titles' 및 'list'를 통합적으로 표현)
export const lectureItemsData: LectureItem[] = [
    {
        id: 1,
        title: "실전! Vue.js 프론트엔드 개발",
        contents: "Vue.js를 활용한 인터랙티브 웹 애플리케이션 구축의 모든 것을 다룹니다. Composition API부터 상태 관리, 라우팅까지 실습 중심으로 진행됩니다.",
        image: "/img/1.jpg", // public 폴더 기준 예시 경로
    },
    {
        id: 2,
        title: "Tailwind CSS 마스터 과정",
        contents: "유틸리티 우선 CSS 프레임워크인 Tailwind CSS를 심도 있게 학습합니다. 빠르고 일관된 UI 디자인 시스템을 구축하는 방법을 익힙니다.",
        image: "/img/dummy/lecture-tailwind.jpg",
    },
    {
        id: 3,
        title: "Node.js와 Express로 만드는 API 서버",
        contents: "JavaScript 런타임 환경인 Node.js와 Express 프레임워크를 사용하여 강력하고 확장 가능한 RESTful API 서버를 개발합니다.",
        image: "/img/dummy/lecture-node.jpg",
    },
];

export const lectureFormSchema: LectureFormSchemaField[] = [
    {id: "lecture-title", name: "title", label: "강의명", type: "text"},
    {id: "lecture-contents", name: "contents", label: "강의 내용", type: "textarea"},
    {id: "lecture-image", name: "imageFile", label: "대표 이미지", type: "image"},
];
//-----------------------------
// 강의 상세 페이지의 하위 항목 더미 데이터
export const lectureSubItemsData: {[mainLectureId: number]: LectureSubItem[]} = {
    1: [
        // lectureItemsData id: 1 (Vue.js)의 하위 항목들
        {
            id: 101,
            mainLectureId: 1,
            title: "Vue.js 기본 문법 및 디렉티브",
            contents: "데이터 바인딩, 조건부 렌더링, 리스트 렌더링 등 Vue의 핵심 디렉티브를 학습합니다.",
            image: "/img/dummy/vue-sub1.jpg",
        },
        {
            id: 102,
            mainLectureId: 1,
            title: "컴포넌트 기반 아키텍처",
            contents: "재사용 가능한 컴포넌트를 만들고 관리하는 방법을 익힙니다. Props, Emit, Slots 활용법을 다룹니다.",
            image: "/img/dummy/vue-sub2.jpg",
        },
        {id: 103, mainLectureId: 1, title: "Vue Router를 이용한 SPA 구현", contents: "Vue Router를 사용하여 싱글 페이지 애플리케이션의 네비게이션을 관리합니다.", image: "/img/dummy/vue-sub3.jpg"},
    ],
    2: [
        // lectureItemsData id: 2 (Tailwind CSS)의 하위 항목들
        {id: 201, mainLectureId: 2, title: "Tailwind CSS 기본 유틸리티", contents: "Spacing, Typography, Colors 등 기본 유틸리티 클래스 사용법을 익힙니다.", image: "/img/dummy/tailwind-sub1.jpg"},
        {id: 202, mainLectureId: 2, title: "반응형 디자인과 Tailwind", contents: "Breakpoints를 활용하여 다양한 화면 크기에 대응하는 반응형 UI를 구축합니다.", image: "/img/dummy/tailwind-sub2.jpg"},
    ],
    3: [
        // lectureItemsData id: 3 (Node.js)의 하위 항목들
        {id: 301, mainLectureId: 3, title: "Node.js와 NPM 소개", contents: "Node.js 런타임 환경과 NPM 패키지 매니저 사용법을 알아봅니다.", image: "/img/dummy/node-sub1.jpg"},
    ],
};

// 하위 강의 추가/수정 모달 폼 스키마
export interface LectureSubItemFormSchemaField {
    id: string;
    name: keyof LectureSubItemFormData | "imageFile";
    label: string;
    type: "text" | "textarea" | "image";
}
export const lectureSubItemFormSchema: LectureSubItemFormSchemaField[] = [
    {id: "sublecture-title", name: "title", label: "세부 강의명", type: "text"},
    {id: "sublecture-contents", name: "contents", label: "세부 내용", type: "textarea"},
    {id: "sublecture-image", name: "imageFile", label: "대표 이미지 (선택)", type: "image"},
];

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

// 문의 내역 더미 데이터
export const dummyInquiryPosts: InquiryPost[] = [
    {pk: 10, title: "강의 문의합니다.", author: "사용자1", created_at: "2023-10-26"},
    {pk: 9, title: "수강료 관련 질문", author: "관리자", created_at: "2023-10-25"},
    {pk: 8, title: "교재 문의", author: "사용자2", created_at: "2023-10-24"},
    {pk: 7, title: "시간표 문의", author: "사용자3", created_at: "2023-10-23"},
    {pk: 6, title: "온라인 강의 문의", author: "사용자4", created_at: "2023-10-22"},
    {pk: 5, title: "오프라인 강의 문의", author: "사용자5", created_at: "2023-10-21"},
    {pk: 4, title: "환불 규정 문의", author: "사용자6", created_at: "2023-10-20"},
    {pk: 3, title: "시설 이용 문의", author: "사용자7", created_at: "2023-10-19"},
    {pk: 2, title: "기타 문의 사항", author: "사용자8", created_at: "2023-10-18"},
    {pk: 1, title: "웹사이트 오류 보고", author: "관리자", created_at: "2023-10-17"},
];

// 페이지네이션 더미 데이터 (예시: 전체 10개 중 페이지 1, 페이지당 5개)
export const dummyPaginationData: PaginationData = {
    count: dummyInquiryPosts.length, // 전체 게시글 수
    start_index: 1, // 현재 페이지의 첫 항목 인덱스 (1-based)
    number: 1, // 현재 페이지 번호
    has_other_pages: true,
    has_previous: false, // 첫 페이지이므로 이전 페이지 없음
    has_next: true, // 다음 페이지 있음
    previous_page_number: null,
    next_page_number: 2,
    custom_range: [1, 2], // 예시: 2페이지까지 있다고 가정
};

// 예시: 페이지 2의 더미 데이터
export const dummyInquiryPostsPage2: InquiryPost[] = [
    {pk: 5, title: "오프라인 강의 문의 (2)", author: "사용자5", created_at: "2023-10-21"},
    {pk: 4, title: "환불 규정 문의 (2)", author: "사용자6", created_at: "2023-10-20"},
    {pk: 3, title: "시설 이용 문의 (2)", author: "사용자7", created_at: "2023-10-19"},
    {pk: 2, title: "기타 문의 사항 (2)", author: "사용자8", created_at: "2023-10-18"},
    {pk: 1, title: "웹사이트 오류 보고 (2)", author: "관리자", created_at: "2023-10-17"},
];

// 예시: 페이지 2의 페이지네이션 데이터
export const dummyPaginationDataPage2: PaginationData = {
    count: dummyInquiryPosts.length,
    start_index: 6, // 페이지 2의 첫 항목 인덱스 (1-based)
    number: 2,
    has_other_pages: true,
    has_previous: true,
    has_next: false, // 마지막 페이지이므로 다음 페이지 없음
    previous_page_number: 1,
    next_page_number: null,
    custom_range: [1, 2],
};

// 문의 작성 페이지에 사용될 데이터 타입
export interface InquiryWriteFormData {
    title: string;
    contents: string;
    // 필요한 경우 파일 첨부 등 추가 필드 정의
}

export interface InquiryWriteFormField {
    id: string;
    name: keyof InquiryWriteFormData;
    label: string;
    type: "text" | "textarea"; // 예시: 텍스트와 텍스트 영역만
    placeholder?: string;
}

// 문의 작성 폼 스키마
export const inquiryWriteFormSchema: InquiryWriteFormField[] = [
    {id: "inquiry-title", name: "title", label: "제목", type: "text", placeholder: "문의 제목을 입력해주세요."},
    {id: "inquiry-contents", name: "contents", label: "내용", type: "textarea", placeholder: "문의 내용을 상세히 작성해주세요."},
];

// 사용자 정보 더미 데이터 (실제로는 로그인 상태에서 가져옴)
export const dummyUserData = {
    username: "홍길동",
    email: "hong@example.com",
};

export const consentModalContent = {
    title: "개인정보 수집 및 이용 동의 안내",
    paragraphs: [
        "[수집 목적 및 이용] 본 동의서는 강의 문의에 대한 처리 및 회신을 목적으로 개인정보를 수집하고 이용하는 데 있어, 정보 주체의 동의를 얻기 위함입니다.",
        "[수집 항목] 다음과 같은 개인정보를 수집하고 있습니다 [이름,이메일,연락처,주소]", // 실제 수집 항목에 맞게 수정 필요
        "[보유 및 이용 기간] 수집된 개인정보는 요청 처리 후 회원 탈퇴 시까지 보유되며, 회원 탈퇴 시 해당 정보는 지체 없이 파기됩니다.",
        "[동의 거부 권리 및 거부 시 불이익 안내] 본 동의는 정보 주체가 자유롭게 거부할 수 있는 권리가 있으며, 동의 거부 시 강의 문의에 대한 처리 및 회신 서비스 이용에 제한이 있을 수 있음을 알려드립니다.",
        "본인은 위와 같은 개인정보 수집 및 이용에 대해 충분히 이해하였으며, 이에 동의합니다.",
    ],
};

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

// 활동 소식 더미 데이터
export const activityNewsData: ActivityNewsItem[] = [
    {
        id: 1,
        link: "https://blog.naver.com/jhs9747/223905375765",
        title: "훈련병의 첫 교육, 존중에서 시작하다 – 해군 714기의 맞춤형... ",
        description:
            "‘꿈을 찾는 사람들 교육원’, 군 맞춤형 성인지 교육의 선두주자 우리 교육원은 군 장병, 간부, 훈련병을 위한 맞춤형 성인지 교육과 폭력 예방 교육을 전문적으로 제공하고 있습니다. ✔ 실전 사례...",
        source: "네이버 블로그",
        sourceLink: "http://blog.naver.com/jhs9747",
        postdate: "2025-06-20",
    },
    {
        id: 2,
        link: "https://blog.naver.com/jhs9747/223904203673",
        title: "사실혼 파트너가 나를 스토킹으로 신고했다면? 진실과 대응법",
        description: "꿈을찾는사람들교육원 대표원장 홍의섭입니다. 사실혼 관계에 있다가 갑자기 상대방에게 스토킹...",
        source: "네이버 블로그",
        sourceLink: "http://blog.naver.com/jhs9747",
        postdate: "2025-06-19",
    },
];

// -----------------
// 공지사항 페이지에 사용될 데이터 타입
export interface NoticePost {
    pk: number; // 게시글 고유 ID
    title: string;
    author: string;
    created_at: string; // 날짜 형식 (예: "YYYY-MM-DD")
    is_important?: boolean; // 중요 공지 여부 (선택적)
    contents?: string; // 상세 내용
    images?: {id: number; url: string; alt?: string}[]; // 이미지 목록 (id 추가)
    files?: {id: number; url: string; name: string}[]; // 첨부 파일 목록 (id 추가)
}

// 페이지네이션 데이터 타입 (InquiryListPage와 동일하게 사용 가능)
// export interface PaginationData { ... } // 이미 정의되어 있다면 생략

// 공지사항 더미 데이터 (중요 공지 포함)
export const dummyImportantNotices: NoticePost[] = [
    {
        pk: 101,
        title: "시스템 점검 안내 (중요)",
        author: "관리자",
        created_at: "2023-11-01",
        is_important: true,
        contents:
            "안녕하세요. 드림시커즈 교육원입니다.\n보다 안정적인 서비스 제공을 위해 아래와 같이 시스템 점검을 실시할 예정입니다.\n\n- 점검 일시: 2023년 11월 15일 (수) 02:00 ~ 06:00 (4시간)\n- 점검 내용: 서버 안정화 및 보안 업데이트\n\n점검 시간 동안에는 웹사이트 및 모든 서비스 이용이 일시적으로 중단될 수 있습니다.\n이용에 불편을 드려 죄송하며, 너른 양해 부탁드립니다.\n감사합니다.",
        images: [
            // id 추가
            {id: 1, url: "/img/dummy/notice-img1.jpg", alt: "점검 안내 이미지"},
        ],
        files: [
            // id 추가
            {id: 1, url: "/files/dummy/점검 상세 안내.pdf", name: "점검 상세 안내.pdf"},
        ],
    },
    {
        pk: 102,
        title: "개인정보처리방침 변경 안내 (필독)",
        author: "관리자",
        created_at: "2023-10-30",
        is_important: true,
        contents: "개인정보처리방침이 일부 변경되어 안내드립니다. 자세한 내용은 첨부파일을 확인해주시기 바랍니다.",
        files: [
            // id 추가
            {id: 2, url: "/files/dummy/개인정보처리방침_v2.0.docx", name: "개인정보처리방침_v2.0.docx"},
        ],
    },
];

export const dummyNoticePosts: NoticePost[] = [
    {pk: 20, title: "신규 강의 오픈: React 마스터 과정", author: "관리자", created_at: "2023-10-28"},
    {pk: 19, title: "10월 우수 수강생 발표", author: "관리자", created_at: "2023-10-27"},
    {pk: 18, title: "교육원 휴관일 안내 (11월)", author: "관리자", created_at: "2023-10-26"},
    {pk: 17, title: "스터디 그룹 모집 공고", author: "관리자", created_at: "2023-10-25"},
    {pk: 16, title: "강의 만족도 설문조사 참여 안내", author: "관리자", created_at: "2023-10-24"},
    // ... 더 많은 일반 공지
];

// 공지사항 페이지네이션 더미 데이터 (예시: 일반 공지 5개 중 페이지 1)
export const dummyNoticePaginationData: PaginationData = {
    count: dummyNoticePosts.length, // 전체 일반 공지 수
    start_index: 1,
    number: 1,
    has_other_pages: dummyNoticePosts.length > 5, // 예시: 페이지당 5개
    has_previous: false,
    has_next: dummyNoticePosts.length > 5,
    previous_page_number: null,
    next_page_number: dummyNoticePosts.length > 5 ? 2 : null,
    custom_range: Array.from({length: Math.ceil(dummyNoticePosts.length / 5)}, (_, i) => i + 1).slice(0, 5), // 최대 5개 페이지 버튼
};

// 검색 유형 옵션
export const noticeSearchTypes = [
    {value: "all", text: "전체"},
    {value: "title", text: "제목"},
    {value: "contents", text: "내용"},
];

// 공지사항 작성/수정 폼 데이터 타입
export interface NoticeFormData {
    title: string;
    contents: string;
    is_important: boolean;
    // images와 files는 File 객체 배열로 별도 관리
}

// 공지사항 작성/수정 폼 필드 정의
export interface NoticeFormField {
    id: string;
    name: keyof NoticeFormData | "newImages" | "newFiles"; // 'newImages', 'newFiles'는 File 객체 배열을 다루기 위함
    label: string;
    type: "text" | "textarea" | "checkbox" | "image" | "file";
}

export const noticeFormSchema: NoticeFormField[] = [
    {id: "notice-title", name: "title", label: "제목", type: "text"},
    {id: "notice-contents", name: "contents", label: "내용", type: "textarea"},
    {id: "notice-images", name: "newImages", label: "이미지 첨부", type: "image"},
    {id: "notice-files", name: "newFiles", label: "파일 첨부", type: "file"},
    {id: "notice-important", name: "is_important", label: "중요 공지", type: "checkbox"},
];
