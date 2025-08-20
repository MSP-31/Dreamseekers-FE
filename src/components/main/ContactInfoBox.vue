<template>
    <div class="info_box bg-white shadow-lg rounded-lg p-6">
        <table class="w-full text-left border-collapse">
            <tbody>
                <tr class="border-b border-[var(--dream-gray-dark)]">
                    <th class="py-3 pr-4 w-1/4 font-semibold text-[var(--dream-text)] text-sm md:text-base">주차안내</th>
                    <td class="py-3 text-[var(--dream-sub)] text-sm md:text-base">{{ businessInfo.parking_info }}</td>
                </tr>
                <tr class="border-b border-[var(--dream-gray-dark)]">
                    <th class="py-3 pr-4 w-1/4 font-semibold text-[var(--dream-text)] text-sm md:text-base">전화번호</th>
                    <td class="py-3 text-[var(--dream-sub)] text-sm md:text-base">
                        {{ contactInfo.phone }}<br />
                        {{ contactInfo.sub_phone }}
                    </td>
                </tr>
                <tr class="border-b border-[var(--dream-gray-dark)]">
                    <th class="py-3 pr-4 w-1/4 font-semibold text-[var(--dream-text)] text-sm md:text-base">이용시간</th>
                    <td class="py-3 text-[var(--dream-sub)] text-sm md:text-base">
                        평일 {{ contactInfo.weekday_start_time }} - {{ contactInfo.weekday_end_time }}<br />
                        주말 {{ contactInfo.weekend_start_time }} - {{ contactInfo.weekend_end_time }}
                    </td>
                </tr>
                <tr class="border-b border-[var(--dream-gray-dark)]">
                    <th class="py-3 pr-4 w-1/4 font-semibold text-[var(--dream-text)] text-sm md:text-base">이용안내</th>
                    <td class="py-3 text-[var(--dream-sub)] whitespace-pre-line text-sm md:text-base">{{ businessInfo.usage_guide }}</td>
                </tr>
                <tr class="border-b border-[var(--dream-gray-dark)]">
                    <th class="py-3 pr-4 w-1/4 font-semibold text-[var(--dream-text)] align-top text-sm md:text-base">사업자 정보</th>
                    <td class="py-3 text-[var(--dream-sub)] text-sm md:text-base">
                        상호명: 꿈을찾는사람들교육원<br />
                        대표: {{ businessInfo.rep }}<br />
                        이메일: {{ businessInfo.email }}<br />
                    </td>
                </tr>
                <tr>
                    <th class="py-3 pr-4 w-1/4 font-semibold text-[var(--dream-text)] align-top text-sm md:text-base">입금 정보</th>
                    <td class="py-3 text-[var(--dream-sub)] text-sm md:text-base">
                        예금주: {{ businessInfo.depositor }}<br />
                        은행: {{ businessInfo.bank }}<br />
                        계좌번호: {{ businessInfo.account }}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup lang="ts">
import type {ContactInfo, BusinessInfo} from "@/data/dummyData"; // dummyData.ts 경로에 맞게 수정

defineProps<{
    contactInfo: ContactInfo;
    businessInfo: BusinessInfo;
}>();
</script>

<style scoped>
/* 테이블 border-collapse와 border-spacing을 Tailwind로 직접 제어하기 어려워 기본 스타일 유지 */
table {
    border-collapse: collapse;
    border-spacing: 0;
}
</style>
