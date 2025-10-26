// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx,css}"],
    theme: {
        extend: {
            colors: {
                main: "#006eb9",
                "dream-main": "#007bff",
                "dream-sub": "#6c757d",
                "dream-text": "#333333",
                "dream-blue": "#3490dc",
                "dream-gray": "#f7fafc",
                "dream-gray-dark": "#a0aec0",
            },
            fontFamily: {
                "nanum-square": ["NanumSquare", "sans-serif"],
                sans: ["Pretendard", "ui-sans-serif", "system-ui", "sans-serif"],
            },
            screens: {
                nav: "1140px",
            },
        },
    },
    plugins: [],
};
