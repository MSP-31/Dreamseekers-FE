export interface NoticePost {
    pk: number;
    title: string;
    author: string;
    created_at: string; // ISO 8601 형식의 날짜 문자열 (예: "2023-10-26T10:00:00Z")
    contents: string; // 필요에 따라 추가
    is_important: boolean; // 중요 공지 여부
}

// API에서 받아오는 페이지네이션 응답 구조
export interface PaginatedResponse<T> {
    count: number; // 전체 항목 수
    next: string | null; // 다음 페이지 URL
    previous: string | null; // 이전 페이지 URL
    results: T[]; // 현재 페이지의 데이터 배열
}

// 프런트엔드에서 관리하는 페이지네이션 상태
export interface PaginationState {
    count: number; // 전체 항목 수
    current_page: number; // 현재 페이지 번호
    total_pages: number; // 전체 페이지 수
    has_previous: boolean; // 이전 페이지 존재 여부
    has_next: boolean; // 다음 페이지 존재 여부
    previous_page_number: number | null; // 이전 페이지 번호
    next_page_number: number | null; // 다음 페이지 번호
    page_numbers: number[]; // 페이지 번호 목록 (버튼 렌더링용)
    items_per_page: number; // 페이지당 항목 수
    start_index: number; // 현재 페이지의 시작 항목 인덱스 (게시물 번호 계산용)
}

// 검색 타입 정의
export const noticeSearchTypes = [
    {value: "all", text: "전체"},
    {value: "title", text: "제목"},
    {value: "contents", text: "내용"},
    {value: "author", text: "작성자"}, // 작성자 검색 추가 가능
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
