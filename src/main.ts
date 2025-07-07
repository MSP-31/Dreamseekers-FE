import "./assets/main.css";

import {createApp} from "vue";
import {createPinia} from "pinia";

import App from "./App.vue";
import router from "./router";

import {useAuthStore} from "./stores/auth";

const app = createApp(App);
const pinia = createPinia();

app.use(createPinia());
app.use(router);
app.use(pinia);

// Pinia 스토어가 생성된 후, auth 스토어를 초기화하고 로컬 스토리지에서 토큰을 로드합니다.
// 이렇게 하면 페이지 새로고침 후에도 로그인 상태가 유지됩니다.
const authStore = useAuthStore();
authStore.fetchUser();

app.mount("#app");
