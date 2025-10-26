import "./assets/main.css";

import {createApp} from "vue";
import {createPinia} from "pinia";

import App from "./App.vue";
import router from "./router";

import {useAuthStore} from "./stores/auth";
import {Directive} from "vue";

// scrollAnimate 디렉티브 정의
const scrollAnimate: Directive = {
    mounted(el) {
        // 요소가 DOM에 마운트될 때 실행
        const observer = new IntersectionObserver(
            (entries) => {
                // 화면에 요소가 나타나는지 감지
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        // 요소가 화면에 보이면
                        el.classList.add("is-visible"); // is-visible 클래스 추가
                    }
                });
            },
            {root: document.getElementById("app"), threshold: 0.1} // 설정
        );
        observer.observe(el); // 요소 감시 시작
    },
};

const app = createApp(App);
const pinia = createPinia();

app.use(router);
app.use(pinia);

// Pinia 스토어가 생성된 후, auth 스토어를 초기화하고 로컬 스토리지에서 토큰을 로드합니다.
// 이렇게 하면 페이지 새로고침 후에도 로그인 상태가 유지됩니다.
const authStore = useAuthStore();
authStore.fetchUser();

app.directive("scroll-animate", scrollAnimate); // 글로벌 등록

app.mount("#app");
