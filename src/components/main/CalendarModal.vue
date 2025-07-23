<template>
    <div v-if="selectedDateProp" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click.self="$emit('close')">
        <div class="modal-content bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <div class="modal-title flex justify-between items-center border-b pb-3 mb-4">
                <div>
                    <span class="selected-date text-xl font-bold text-dream-text">{{ formattedDate }}</span>
                    <span class="selected-day text-lg text-gray-600 ml-2">{{ dayOfWeek }}</span>
                </div>
                <div>
                    <button v-if="isStaff" @click="$emit('add-schedule')" class="add-sched bg-[var(--dream-blue)] hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded text-sm mr-2">
                        추가
                    </button>
                    <button @click="$emit('close')" class="modal-close text-2xl text-gray-500 hover:text-gray-700">&times;</button>
                </div>
            </div>
            <div class="modal-detail">
                <ul v-if="schedulesProp.length > 0" class="detail-list-area space-y-3 max-h-60 overflow-y-auto">
                    <li v-for="(schedule, index) in schedulesProp" :key="index" class="p-3 bg-[var(--dream-gray)] rounded-md">
                        <p class="font-semibold text-[var(--dream-main)]">({{ schedule.startTime }} - {{ schedule.endTime }})</p>
                        <p class="text-sm text-gray-700">{{ schedule.title }}</p>
                    </li>
                </ul>
                <p v-else class="text-gray-600">해당 날짜에 등록된 강의 일정이 없습니다.</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {computed, type PropType} from "vue";

export interface ScheduleEntry {
    id: string; // 고유 ID (선택 사항이지만 FullCalendar에서 이벤트 관리에 유용)
    date: string; // 'YYYY-MM-DD' 형식의 날짜 문자열
    startTime: string; // 'HH:mm' 형식의 시작 시간
    endTime: string; // 'HH:mm' 형식의 종료 시간
    title: string; // 이벤트 제목
    allDay: boolean; // 하루 종일 이벤트인지 여부
}

export interface ScheduleData {
    [date: string]: ScheduleEntry[];
}

const props = defineProps({
    selectedDateProp: {
        type: Date as PropType<Date | null>,
        default: null,
    },
    schedulesProp: {
        type: Array as PropType<ScheduleEntry[]>,
        default: () => [],
    },
    isStaff: {
        type: Boolean,
        default: false,
    },
});

defineEmits(["close", "add-schedule"]);

const formattedDate = computed(() => props.selectedDateProp?.toLocaleDateString("ko-KR", {year: "numeric", month: "long", day: "numeric"}));
const dayOfWeek = computed(() => props.selectedDateProp?.toLocaleDateString("ko-KR", {weekday: "long"}));
</script>
