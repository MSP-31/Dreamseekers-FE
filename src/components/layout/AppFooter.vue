<template>
    <footer class="bg-[#515151] text-white text-sm mt-16">
        <div class="max-w-7xl mx-auto px-6 py-8">
            <ul class="flex flex-wrap gap-4 justify-center mb-6">
                <li><router-link to="/intro/greeting">교육원 소개</router-link></li>
                <li><router-link to="/lecture/list">주요 강의</router-link></li>
                <li><router-link to="/lecture/inquiry">강의 문의</router-link></li>
                <li><router-link to="/unauthorized-collection">이메일무단수집거부</router-link></li>
                <li><router-link to="/privacy-policy">개인정보처리방침</router-link></li>
            </ul>

            <div class="flex flex-col md:flex-row md:justify-between text-center md:text-left gap-6 md:gap-0">
                <ul class="space-y-1 text-xs md:text-sm">
                    <li>꿈을 찾는 사람들 교육원</li>
                    <li>대표 : 홍의섭</li>
                    <li>주소 : 경상남도 창원시 성산구용지로 70 (성원 그랜드오피스텔 10층 1029호)</li>
                    <li>사업자등록번호 : 102-27-75425</li>
                    <li>전화번호 : 055-6010-451</li>
                    <li>이메일 : jhs9747@naver.com</li>
                    <li>강의접수 : 010-9371-0450</li>
                </ul>
                <!-- 아이콘 -->
                <div class="flex items-center justify-center md:justify-end space-x-6">
                    <a
                        href="https://www.facebook.com/people/꿈을-찾는-사람들-교육원/100046588332120/"
                        target="_blank"
                        rel="noopener"
                        class="text-gray-700 hover:text-blue-700 text-2xl"
                        aria-label="페이스북"
                    >
                        <img src="/img/icon/facebook.svg" alt="페이스북 아이콘" />
                    </a>
                    <a href="https://www.instagram.com/dreamseekers1004/" target="_blank" rel="noopener" class="text-gray-700 hover:text-pink-600 text-2xl" aria-label="인스타그램">
                        <img src="/img/icon/instagram.svg" alt="인스타그램 아이콘" />
                    </a>
                    <a href="https://blog.naver.com/jhs9747" target="_blank" rel="noopener" class="text-gray-700 hover:text-green-600 text-2xl" aria-label="네이버 블로그">
                        <img src="/img/icon/naverblog.svg" alt="네이버 블로그 아이콘" />
                    </a>
                </div>
            </div>

            <p class="text-center text-xs mt-6 text-white">Copyright 2025. 꿈을 찾는 사람들 교육원 All rights reserved.</p>
        </div>
    </footer>
</template>

<script setup lang="ts"></script>
