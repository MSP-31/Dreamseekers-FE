// postcss.config.js
import tailwindcss from "@tailwindcss/postcss"; // <-- v4에서는 이 패키지입니다!

export default {
    plugins: [
        tailwindcss(), // 함수 호출
    ],
};
