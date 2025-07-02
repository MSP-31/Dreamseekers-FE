<template>
    <div class="py-12">
        <div class="content-box container mx-auto px-4">
            <h1 class="text-3xl font-bold text-dream-text text-center mb-8">강의 일정</h1>
            <div class="sec-cal bg-white p-6 rounded-lg shadow-lg">
                <div class="cal-nav flex justify-between items-center mb-6">
                    <button @click="prevMonth" class="nav-btn hover:text-[var(--dream-main)] font-semibold py-2 px-4 rounded">&lt; 이전 달</button>
                    <div class="year-month text-xl font-bold text-dream-text">{{ currentYear }}년 {{ currentMonth + 1 }}월</div>
                    <button @click="nextMonth" class="nav-btn hover:text-[var(--dream-main)] font-semibold py-2 px-4 rounded">다음 달 &gt;</button>
                </div>
                <div class="cal-wrap">
                    <div class="days grid grid-cols-7 text-center font-semibold text-gray-600 mb-2">
                        <div v-for="day in dayLabels" :key="day" class="week py-2">{{ day }}</div>
                    </div>
                    <div class="dates grid grid-cols-7 text-center">
                        <!-- 빈 칸 (이전 달) -->
                        <div v-for="n in startDayOfMonth" :key="`empty-prev-${n}`" class="py-2"></div>
                        <!-- 현재 달의 날짜들 -->
                        <div
                            v-for="day in daysInMonth"
                            :key="day"
                            class="py-3 border border-gray-200 rounded-md cursor-pointer hover:bg-[var(--dream-gray)] transition-colors relative"
                            :class="{
                                'bg-[var(--dream-blue)] text-white': isToday(day),
                                'font-bold': schedulesForDate(day).length > 0,
                            }"
                            @click="openModal(day)"
                        >
                            {{ day }}
                            <div v-if="schedulesForDate(day).length > 0" class="absolute bottom-1 right-1 w-2 h-2 bg-red-500 rounded-full"></div>
                        </div>
                        <!-- 빈 칸 (다음 달) -->
                    </div>
                </div>
            </div>
        </div>

        <CalendarModal v-if="isModalOpen" :selected-date-prop="selectedDate" :schedules-prop="selectedSchedules" :is-staff="isStaff" @close="closeModal" @add-schedule="handleAddSchedule" />
    </div>
</template>

<script setup lang="ts">
import {ref, computed, type PropType} from "vue";
import type {ScheduleData, ScheduleEntry} from "@/data/dummyData.ts";
import CalendarModal from "./CalendarModal.vue"; // 모달 컴포넌트 임포트

const props = defineProps({
    schedules: {
        type: Object as PropType<ScheduleData>,
        required: true,
        default: () => ({}),
    },
    isStaff: {
        type: Boolean,
        default: false,
    },
});

const dayLabels = ["월", "화", "수", "목", "금", "토", "일"];
const today = new Date();
const currentYear = ref(today.getFullYear());
const currentMonth = ref(today.getMonth()); // 0: January, 11: December

const daysInMonth = computed(() => {
    return new Date(currentYear.value, currentMonth.value + 1, 0).getDate();
});

const startDayOfMonth = computed(() => {
    // 0: Sunday, 1: Monday, ..., 6: Saturday
    let day = new Date(currentYear.value, currentMonth.value, 1).getDay();
    return day === 0 ? 6 : day - 1; // 월요일 시작으로 조정
});

const isToday = (day: number) => {
    return currentYear.value === today.getFullYear() && currentMonth.value === today.getMonth() && day === today.getDate();
};

const prevMonth = () => {
    if (currentMonth.value === 0) {
        currentMonth.value = 11;
        currentYear.value--;
    } else {
        currentMonth.value--;
    }
};

const nextMonth = () => {
    if (currentMonth.value === 11) {
        currentMonth.value = 0;
        currentYear.value++;
    } else {
        currentMonth.value++;
    }
};

const schedulesForDate = (day: number): ScheduleEntry[] => {
    const dateKey = `${currentYear.value}-${currentMonth.value + 1}-${day}`;
    return props.schedules[dateKey] || [];
};

// Modal 관련
const isModalOpen = ref(false);
const selectedDate = ref<Date | null>(null);
const selectedSchedules = ref<ScheduleEntry[]>([]);

const openModal = (day: number) => {
    selectedDate.value = new Date(currentYear.value, currentMonth.value, day);
    selectedSchedules.value = schedulesForDate(day);
    isModalOpen.value = true;
};

const closeModal = () => {
    isModalOpen.value = false;
    selectedDate.value = null;
    selectedSchedules.value = [];
};

const handleAddSchedule = () => {
    // 실제 일정 추가 로직 구현 (API 호출 등)
    alert(`관리자: ${selectedDate.value?.toLocaleDateString()}에 일정 추가 기능`);
    // 예시: dummySchedules에 직접 추가하거나, 부모 컴포넌트에 emit하여 처리
    closeModal();
};

// 참고: 기존 calender.js의 복잡한 DOM 조작 및 상태 관리는 Vue의 반응형 시스템으로 대체됩니다.
// 이 코드는 기본적인 달력 표시 및 간단한 상호작용만 포함합니다.
// 실제 프로덕션에서는 FullCalendar.js와 같은 라이브러리 사용을 고려할 수 있습니다.
</script>
