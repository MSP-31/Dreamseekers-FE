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
export const lectureSubItemsData: {[mainLectureId: number]: LectureSubItem[]} = {
    1: [
        // mainLectureId: 1 (도박 중독, 이제 그만! '스마트한 선택' 예방 강좌)의 하위 항목들
        {
            id: 101,
            mainLectureId: 1,
            title: "도박 중독의 이해와 심각성",
            contents: "도박 중독의 정의, 유형, 그리고 개인 및 사회에 미치는 심각한 영향에 대해 심층적으로 학습합니다. 실제 사례를 통해 문제의 본질을 이해합니다.",
            image: "/img/1.jpg",
        },
        {
            id: 102,
            mainLectureId: 1,
            title: "충동 제어 및 스트레스 관리 기법",
            contents: "도박 충동을 효과적으로 관리하고 스트레스를 건강하게 해소하는 다양한 전략과 기법을 배웁니다. 자기 통제력을 강화하는 실제적인 방법을 제시합니다.",
            image: "/img/1.jpg",
        },
        {
            id: 103,
            mainLectureId: 1,
            title: "건강한 여가 활동 및 대안 찾기",
            contents: "도박 외에 삶의 만족도를 높일 수 있는 건강하고 즐거운 여가 활동을 탐색하고 실천하는 방법을 모색합니다. 긍정적인 생활 습관 형성을 돕습니다.",
            image: "/img/1.jpg",
        },
        {
            id: 104,
            mainLectureId: 1,
            title: "재정 관리와 회복 지원 시스템",
            contents: "도박으로 인한 재정 문제를 해결하고, 중독에서 벗어나기 위한 전문적인 회복 프로그램 및 지원 기관에 대한 정보를 제공합니다.",
            image: "/img/1.jpg",
        },
    ],
    2: [
        // mainLectureId: 2 (마약류 오남용 방지 '안전한 우리 사회' 지킴이 강좌)의 하위 항목들
        {
            id: 201,
            mainLectureId: 2,
            title: "마약류의 종류와 신체적/정신적 영향",
            contents: "다양한 마약류의 종류(필로폰, 대마초, 코카인 등)를 알아보고, 각 약물이 인체에 미치는 치명적인 신체적, 정신적 부작용에 대해 구체적으로 배웁니다.",
            image: "/img/1.jpg", // 이미지 경로는 그대로 유지
        },
        {
            id: 202,
            mainLectureId: 2,
            title: "마약 중독의 진행 과정과 사회적 위험",
            contents: "마약 중독이 어떻게 시작되고 진행되는지 단계별로 이해하고, 중독으로 인해 발생하는 개인 및 사회 전체의 문제점과 위험성을 논의합니다.",
            image: "/img/1.jpg", // 이미지 경로는 그대로 유지
        },
        {
            id: 203,
            mainLectureId: 2,
            title: "약물 오남용 예방을 위한 대처 전략",
            contents: "청소년 및 성인이 약물 오남용 유혹에 직면했을 때 현명하게 대처하고 거절하는 방법을 학습합니다. 위기 상황 시 도움을 요청하는 방법을 포함합니다.",
            image: "/img/1.jpg",
        },
        {
            id: 204,
            mainLectureId: 2,
            title: "마약 관련 법규 및 회복 지원 시스템",
            contents: "마약류 관련 법규와 처벌 기준을 이해하고, 중독자들을 위한 치료 및 재활 프로그램, 법적 지원 체계에 대한 정보를 제공합니다.",
            image: "/img/1.jpg",
        },
    ],
    3: [
        // mainLectureId: 3 (성폭력 및 디지털 성범죄 예방 '존중과 안전' 교육)의 하위 항목들
        {
            id: 301,
            mainLectureId: 3,
            title: "성인지 감수성 향상과 폭력의 이해",
            contents: "성인지 감수성의 중요성을 이해하고, 성폭력 및 성차별적 행동의 다양한 형태를 인식합니다. 건강한 성문화 조성을 위한 태도를 함양합니다.",
            image: "/img/1.jpg", // 이미지 경로는 그대로 유지
        },
        {
            id: 302,
            mainLectureId: 3,
            title: "디지털 성범죄의 유형과 예방",
            contents: "사이버 성폭력, 불법 촬영물, 몸캠피싱 등 디지털 성범죄의 주요 유형과 발생 원인을 학습하고, 온라인 환경에서 자신을 보호하는 방법을 배웁니다.",
            image: "/img/1.jpg",
        },
        {
            id: 303,
            mainLectureId: 3,
            title: "피해자 중심의 관점과 2차 피해 방지",
            contents: "성폭력 및 디지털 성범죄 피해자를 존중하고 지지하는 태도를 배우며, 2차 피해를 예방하기 위한 언행과 행동 수칙을 익힙니다.",
            image: "/img/1.jpg",
        },
        {
            id: 304,
            mainLectureId: 3,
            title: "성폭력 발생 시 대처 및 법적 지원",
            contents: "성폭력 발생 시 즉각적으로 대처하는 방법, 증거 확보, 신고 절차, 그리고 법률 및 심리 상담 등 이용 가능한 지원 서비스를 안내합니다.",
            image: "/img/1.jpg",
        },
    ],
    4: [
        // mainLectureId: 4 (학교 폭력 및 사이버 폭력 예방 '평화로운 교실' 만들기)의 하위 항목들 (새로 추가됨)
        {
            id: 401,
            mainLectureId: 4,
            title: "학교 폭력의 유형과 특징 이해",
            contents: "신체 폭력, 언어 폭력, 집단 따돌림, 성폭력 등 다양한 학교 폭력의 유형과 그 특징을 상세히 알아봅니다. 학교 폭력의 심각성과 예방의 필요성을 강조합니다.",
            image: "/img/1.jpg",
        },
        {
            id: 402,
            mainLectureId: 4,
            title: "사이버 폭력의 실태와 예방 전략",
            contents: "사이버 왕따, 디지털 성폭력, 사이버 명예훼손 등 온라인에서 발생하는 폭력의 실태를 파악하고, 온라인 환경에서 안전하게 자신을 보호하는 방법을 학습합니다.",
            image: "/img/1.jpg",
        },
        {
            id: 403,
            mainLectureId: 4,
            title: "건강한 또래 관계 형성 및 갈등 해결",
            contents: "친구들과 긍정적인 관계를 맺고, 갈등 상황 발생 시 평화롭고 효과적으로 문제를 해결하는 방법을 배웁니다. 공감과 소통의 중요성을 강조합니다.",
            image: "/img/1.jpg",
        },
        {
            id: 404,
            mainLectureId: 4,
            title: "피해 발생 시 신고 및 도움 요청 방법",
            contents: "학교 폭력 또는 사이버 폭력 피해를 겪었을 때 누구에게, 어떻게 도움을 요청하고 신고할 수 있는지 구체적인 절차와 지원 기관을 안내합니다. 2차 피해 방지 교육을 포함합니다.",
            image: "/img/1.jpg",
        },
    ],
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
            "안녕하세요. 꿈을 찾는 사람들 교육원입니다.\n보다 안정적인 서비스 제공을 위해 아래와 같이 시스템 점검을 실시할 예정입니다.\n\n- 점검 일시: 2023년 11월 15일 (수) 02:00 ~ 06:00 (4시간)\n- 점검 내용: 서버 안정화 및 보안 업데이트\n\n점검 시간 동안에는 웹사이트 및 모든 서비스 이용이 일시적으로 중단될 수 있습니다.\n이용에 불편을 드려 죄송하며, 너른 양해 부탁드립니다.\n감사합니다.",
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
    {pk: 19, title: "10월 우수 수강생 발표", author: "관리자", created_at: "2023-10-27"},
    {pk: 18, title: "교육원 휴관일 안내 (11월)", author: "관리자", created_at: "2023-10-26"},
    {pk: 17, title: "스터디 그룹 모집 공고", author: "관리자", created_at: "2023-10-25"},
    {pk: 16, title: "강의 만족도 설문조사 참여 안내", author: "관리자", created_at: "2023-10-24"},
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
