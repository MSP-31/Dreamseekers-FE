// MenuItem 인터페이스 정의
export interface MenuItem {
    title: string;
    link: string;
    submenu?: MenuItem[]; // 하위 메뉴는 선택적 속성
}

// 메뉴 데이터 배열 (상수)
export const menuItemsData: MenuItem[] = [
    {
        title: "교육원 소개",
        link: "/intro/greeting/",
        submenu: [
            {title: "인사말", link: "/intro/greeting/"},
            {title: "교육원 소개", link: "/intro/instructors/"},
            {title: "오시는 길", link: "/intro/contact/"},
        ],
    },
    {
        title: "주요 강의",
        link: "/lecture/list",
        // submenu: [{title: "주요 강의", link: "/lecture/list"}],
    },
    {
        title: "강의 일정",
        link: "/lecture/calender", // 기본적으로는 inquiry/write로 리디렉션될 수 있지만, 최상위 링크는 inquiry로 통일 (라우터 가드 등에서 처리)
        submenu: [
            // isStaff 여부에 따라 동적으로 추가될 항목은 컴포넌트에서 처리
            // { title: "강의 상담 문의", link: "/inquiry/write" },
            // {title: "문의 내역", link: "/inquiry/list"},
            // {title: "강의 일정", link: "/lecture/calender"},
        ],
    },
    {
        title: "소통 마당",
        link: "/notice/",
        submenu: [
            {title: "공지사항", link: "/notice/"},
            // { title: "자료실", link: "/archive/" },
            // { title: "방명록", link: "/guest/" },
            {title: "활동 소식", link: "/news/"},
        ],
    },
];
