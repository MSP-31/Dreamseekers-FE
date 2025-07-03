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
    type: "text" | "textarea" | "image";
}
