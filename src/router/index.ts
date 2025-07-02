import {createRouter, createWebHistory} from "vue-router";
import HomeView from "@/views/HomeView.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "home",
            component: HomeView,
        },
        {
            path: "/intro",
            name: "intro", // 부모 라우트의 이름
            children: [
                {
                    // 자식 라우트: /intro/greeting
                    path: "greeting", // 부모 경로를 제외한 상대 경로
                    name: "greeting",
                    component: () => import("@/views/intro/GreetingPage.vue"),
                },
                {
                    // 자식 라우트: /intro/instructors
                    path: "instructors", // 부모 경로를 제외한 상대 경로
                    name: "instructors",
                    component: () => import("@/views/intro/InstructorsPage.vue"),
                },
                {
                    // 자식 라우트: /intro/contact
                    path: "contact", // 부모 경로를 제외한 상대 경로
                    name: "contact",
                    component: () => import("@/views/intro/ContactPage.vue"), // ContactPage.vue로 수정했습니다 (소문자 c를 대문자 C로)
                },
            ],
        },
        {
            path: "/lecture",
            name: "lecture",
            children: [
                {
                    path: "list",
                    name: "lectureList",
                    component: () => import("@/views/lecture/LectureListPage.vue"),
                },
                {
                    path: "detail/:id", // 부모 경로를 제외한 상대 경로
                    name: "lectureDetail",
                    component: () => import("@/views/lecture/LectureDetailPage.vue"),
                    props: true,
                },
                {
                    path: "calender",
                    name: "calender",
                    component: () => import("@/views/lecture/LectureCalender.vue"),
                },
            ],
        },
        {
            path: "/inquiry",
            name: "inquiry",
            children: [
                {
                    path: "",
                    name: "inquiryList",
                    component: () => import("@/views/inquiry/InquiryListPage.vue"),
                },
                {
                    path: "write",
                    name: "inquiryWrite",
                    component: () => import("@/views/inquiry/InquiryWritePage.vue"),
                },
            ],
        },
        {
            path: "/notice", // 또는 /community/notice 등 원하는 경로
            name: "notice",
            children: [
                {
                    path: "",
                    name: "noticeList",
                    component: () => import("@/views/notice/NoticeListPage.vue"), // 공지사항 작성 페이지
                },
                {
                    path: "write",
                    name: "noticeWrite",
                    component: () => import("@/views/notice/NoticeFormPage.vue"), // 공지사항 작성 페이지
                },
                {
                    path: "edit/:pk",
                    name: "noticeEdit",
                    component: () => import("@/views/notice/NoticeFormPage.vue"), // 공지사항 작성 페이지
                    props: true, // route.params.pk를 props로 전달
                },
                {
                    path: ":pk", // :pk는 공지사항 고유 ID
                    name: "noticeDetail",
                    component: () => import("@/views/notice/NoticeDetailPage.vue"), // 공지사항 상세 페이지
                    props: true,
                },
            ],
        },
        {
            path: "/news",
            name: "news",
            component: () => import("@/views/news/ActivityNewsPage.vue"),
        },
        {
            path: "/user",
            name: "user",
            children: [
                {
                    path: "login",
                    name: "userLogin",
                    component: () => import("@/views/user/Login.vue"),
                },
                {
                    path: "signup",
                    name: "userSignup",
                    component: () => import("@/views/user/Signup.vue"),
                },
            ],
        },
    ],
});

export default router;
