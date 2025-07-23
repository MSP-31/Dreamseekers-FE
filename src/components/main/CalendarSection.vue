<template>
    <div class="content-box container mx-auto px-4">
        <div class="sec-cal bg-white rounded-lg shadow-lg">
            <div class="cal-wrap">
                <FullCalendar ref="fullCalendarRef" :options="calendarOptions" />
            </div>
        </div>

        <CalendarModal v-if="isModalOpen" :selected-date-prop="selectedDate" :schedules-prop="selectedSchedules" :is-staff="isStaff" @close="closeModal" @add-schedule="handleAddSchedule" />
    </div>
</template>

<script setup lang="ts">
import {ref, reactive, computed, onMounted} from "vue";
import CalendarModal from "./CalendarModal.vue"; // 모달 컴포넌트 임포트

// FullCalendar 관련 임포트
import FullCalendar from "@fullcalendar/vue3"; // Vue 3 사용 시 @fullcalendar/vue3
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import apiClient from "@/api";

const props = defineProps({
    isStaff: {
        type: Boolean,
        default: false,
    },
});

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

// 컴포넌트 내부에서 관리할 schedules 상태 선언
const schedules = ref<ScheduleData>({});

// FullCalendar 인스턴스 참조
const fullCalendarRef = ref<typeof FullCalendar | null>(null);

// 모달 관련
const isModalOpen = ref(false);
const selectedDate = ref<Date | null>(null);
const selectedSchedules = ref<ScheduleEntry[]>([]);

// Prop에서 받은 schedules 데이터를 FullCalendar 이벤트 형식으로 변환
const fullCalendarEvents = computed(() => {
    const events: any[] = [];
    // schedules 객체의 각 날짜를 순회
    for (const dateKey in schedules.value) {
        // 해당 속성이 schedules 객체 자체의 것인지 확인
        if (Object.prototype.hasOwnProperty.call(schedules.value, dateKey)) {
            const dailySchedules = schedules.value[dateKey];

            // 5. 특정 날짜의 각 스케줄 항목 순회
            dailySchedules.forEach((schedule) => {
                // 6. 이벤트 날짜 객체 생성
                const eventDate = new Date(schedule.date);

                // 7. 날짜 포맷팅 (YYYY-MM-DD 형식으로)
                const formattedDate = `${eventDate.getFullYear()}-${(eventDate.getMonth() + 1).toString().padStart(2, "0")}-${eventDate.getDate().toString().padStart(2, "0")}`;

                // 8. 시작 및 종료 시간 포함한 전체 날짜/시간 문자열 생성
                const startDateTime = `${formattedDate}T${schedule.startTime.substring(0, 5)}`;
                const endDateTime = `${formattedDate}T${schedule.endTime.substring(0, 5)}`;

                // 9. FullCalendar 이벤트 객체 생성
                events.push({
                    title: schedule.title, // 이벤트 제목
                    start: startDateTime, // 이벤트 시작 시간 (필수)
                    end: endDateTime, // 이벤트 종료 시간 (선택 사항이지만 유용)
                    allDay: schedule.allDay, // 하루 종일 이벤트 여부
                    id: schedule.id, // 이벤트 고유 ID (선택 사항이지만 관리 용이)
                    extendedProps: {
                        originalSchedule: schedule, // 원본 스케줄 데이터를 저장하여 나중에 쉽게 접근
                    },
                });
                console.log("변환된 이벤트 객체:", events[events.length - 1]);
            });
        }
    }
    return events;
});

// FullCalendar 옵션 설정
const calendarOptions = reactive({
    plugins: [
        dayGridPlugin, // 월별 보기
        interactionPlugin, // 드래그 앤 드롭, 날짜 클릭 등
        timeGridPlugin, // 주별, 일별 시간 보기
        listPlugin, // 목록 보기
    ],
    initialView: "dayGridMonth", // 초기 뷰를 월별로 설정
    headerToolbar: {
        // 캘린더 헤더에 표시할 버튼 및 제목 설정
        left: "prev,next",
        center: "title",
        right: "today",
    },
    locale: "ko", // 한글 로케일 적용
    buttonText: {
        // 버튼 텍스트 한글화
        today: "오늘",
        month: "월",
        week: "주",
        day: "일",
        list: "목록",
    },
    events: fullCalendarEvents, // Computed 속성을 사용하여 이벤트 데이터 바인딩
    dateClick: (info: any) => {
        // 날짜 클릭 이벤트 핸들러
        openModal(new Date(info.dateStr)); // info.dateStr은 'YYYY-MM-DD' 형식의 문자열
    },
    eventClick: (info: any) => {
        // 이벤트 클릭 이벤트 핸들러
        // 이벤트 클릭 시에도 모달을 열 수 있습니다.
        // info.event.start: 클릭한 이벤트의 시작 날짜 (Date 객체)
        // info.event.extendedProps.originalSchedule: 원본 일정 데이터
        openModal(info.event.start, info.event.extendedProps.originalSchedule);
    },
    editable: props.isStaff, // isStaff prop에 따라 이벤트 편집 가능 여부 설정 (드래그앤드롭 등)
    eventDrop: (info: any) => {
        // 이벤트 드래그 앤 드롭 후
        if (props.isStaff) {
            handleEventDrop(info);
        }
    },
    eventResize: (info: any) => {
        // 이벤트 리사이즈 후 (timeGrid 등에서)
        if (props.isStaff) {
            handleEventResize(info);
        }
    },
    eventDidMount: function (info: {event: any}) {
        console.log("이벤트 마운트됨:", info.event);
    },
    // FullCalendar의 배경색 변경을 위한 스타일 오버라이딩 (선택 사항)
    // eventColor: 'var(--dream-main)', // 모든 이벤트에 동일한 색상 적용
    // eventTextColor: '#ffffff',
});

// Modal 관련 함수
const openModal = (date: Date, schedule?: ScheduleEntry | ScheduleEntry[]) => {
    selectedDate.value = date;
    // dateKey 생성 (MM-DD 형식이므로, V-calendar 구현체에 맞게 조정)
    const dateKey = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

    if (schedule) {
        // 특정 이벤트 클릭 시 해당 이벤트만 전달
        selectedSchedules.value = Array.isArray(schedule) ? schedule : [schedule];
    } else {
        // 날짜 클릭 시 해당 날짜의 모든 일정 전달
        selectedSchedules.value = schedules.value[dateKey] || [];
    }
    isModalOpen.value = true;
};

const closeModal = () => {
    isModalOpen.value = false;
    selectedDate.value = null;
    selectedSchedules.value = [];
};

// 추가
const handleAddSchedule = (newSchedule: ScheduleEntry) => {
    if (selectedDate.value) {
        const year = selectedDate.value.getFullYear();
        const month = selectedDate.value.getMonth() + 1;
        const day = selectedDate.value.getDate();
        const dateKey = `${year}-${month}-${day}`;

        // 내부 schedules.value를 직접 업데이트
        if (!schedules.value[dateKey]) {
            schedules.value[dateKey] = [];
        }
        schedules.value[dateKey].push(newSchedule);

        // if (fullCalendarRef.value) {
        //   fullCalendarRef.value.getApi().refetchEvents();
        // }
    }
    closeModal();
};

const handleEventDrop = (info: any) => {
    const event = info.event;
    const oldDate = info.oldEvent.start;
    const newDate = event.start;

    const oldDateKey = `${oldDate.getFullYear()}-${oldDate.getMonth() + 1}-${oldDate.getDate()}`;
    const newDateKey = `${newDate.getFullYear()}-${newDate.getMonth() + 1}-${newDate.getDate()}`;

    // 이전 날짜에서 이벤트 제거
    if (schedules.value[oldDateKey]) {
        const originalSchedule = event.extendedProps.originalSchedule;
        schedules.value[oldDateKey] = schedules.value[oldDateKey].filter((s: ScheduleEntry) => s !== originalSchedule);
        if (schedules.value[oldDateKey].length === 0) {
            delete schedules.value[oldDateKey];
        }
    }

    // 새 날짜에 이벤트 추가
    if (!schedules.value[newDateKey]) {
        schedules.value[newDateKey] = [];
    }
    schedules.value[newDateKey].push(event.extendedProps.originalSchedule);

    // 필요하다면 서버에 업데이트된 데이터 전송
    // updateScheduleOnServer(schedules.value);
};

const handleEventResize = (info: any) => {
    // 이벤트 리사이즈 로직 (주로 timeGrid에서 사용)
    // info.event.start, info.event.end 등을 사용하여 일정 시간을 업데이트
    console.log("Event resized:", info.event);
};

onMounted(async () => {
    try {
        //     // 더미 데이터 사용 예시 (개발용)
        //     const dummyData: ScheduleData = {
        //         "2025-7-25": [
        //             {
        //                 id: "1",
        //                 date: "2025-07-25",
        //                 startTime: "09:00",
        //                 endTime: "10:00",
        //                 title: "회의",
        //                 allDay: false,
        //             },
        //             {
        //                 id: "2",
        //                 date: "2025-07-25",
        //                 startTime: "14:00",
        //                 endTime: "15:00",
        //                 title: "점심 약속",
        //                 allDay: false,
        //             },
        //         ],
        //         "2025-7-26": [
        //             {
        //                 id: "3",
        //                 date: "2025-07-26",
        //                 startTime: "10:00",
        //                 endTime: "11:00",
        //                 title: "프로젝트 마감",
        //                 allDay: true,
        //             },
        //         ],
        //     };
        const response = await apiClient.get<ScheduleData>("/lecture/calendar");
        schedules.value = response.data;
        console.log("강의 일정 데이터:", response.data);
    } catch (error: any) {
        console.error("강의 일정 API 호출 오류:", error);
        if (error.response) {
            const errorMessage = error.response.data?.detail || error.response.data?.message || `서버 오류: ${error.response.status}`;
            alert(`강의 데이터를 불러오는 데 실패했습니다: ${errorMessage}`);
        } else {
            alert("강의 데이터를 불러오는 데 실패했습니다: 네트워크 연결을 확인하세요.");
        }
    }
});
</script>

<style>
/* FullCalendar 기본 스타일 임포트 */

/* FullCalendar 커스터마이징 */
.fc .fc-button-primary {
    background-color: var(--dream-main);
    border-color: var(--dream-main);
    color: #fff;
}
.fc-event {
    background-color: var(--dream-blue) !important; /* 일정 배경색 */
    border-color: var(--dream-blue) !important; /* 일정 테두리 색 */
    color: #fff !important; /* 일정 텍스트 색 */
}
.fc-event-title {
    font-weight: bold;
}

/* 요일 라벨 (월, 화, 수...) */
.fc-day-header {
    color: #6b7280; /* text-gray-600 */
    font-weight: 600; /* font-semibold */
}
</style>
