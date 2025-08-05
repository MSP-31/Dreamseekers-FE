export interface IntroData {
    id: number;
    title: string;
    contents: string;
    image: string;
}

// 모달 데이터 타입 정의
export interface FormField {
    id: string;
    name: string;
    label: string;
    type: "text" | "textarea" | "image" | "date" | "time" | "checkbox" | "number";
}

// 새로 추가할 '교육원 소개' 전용 데이터 타입
export interface AcademyIntroData {
    id: number;
    images: string[];
}

// 새로 추가할 '교육원 소개' 전용 폼 필드 타입
export interface AcademyIntroFormField {
    id: string;
    name: string;
    label: string;
    type: "multiple-image";
}
