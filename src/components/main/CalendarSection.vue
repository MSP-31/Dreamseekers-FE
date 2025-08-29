<template>
    <div class="content-box container mx-auto px-4">
        <div class="sec-cal bg-white rounded-lg shadow-lg p-8">
            <div class="cal-wrap">
                <FullCalendar ref="fullCalendarRef" :options="calendarOptions" />
            </div>
        </div>
        <!-- 상세 모달 -->
        <CalendarModal
            v-if="isModalOpen"
            :selected-date-prop="selectedDate"
            :schedules-prop="selectedSchedules"
            :is-staff="isStaff"
            @close="closeModal"
            @delete="handleDeleteSchedule"
            @edit-schedule="handleEditSchedule"
        />
        <!-- 추가 모달 -->
        <ReusableFormModal
            v-model:show="showModal"
            :modalTitle="modalConfig.title"
            :formFields="modalConfig.formFields"
            :initialData="currentData"
            :submitButtonText="modalConfig.submitText"
            @submit="handleModalSubmit"
        />
    </div>
</template>

<script setup lang="ts">
import {ref, reactive, computed} from "vue";
import CalendarModal from "./CalendarModal.vue"; // 모달 컴포넌트 임포트
import ReusableFormModal from "@/components/main/FormModal.vue";

// FullCalendar 관련 임포트
import FullCalendar from "@fullcalendar/vue3";
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
    startDate: string; // 'YYYY-MM-DD' 형식의 날짜 문자열
    endDate: string; // 'YYYY-MM-DD' 형식의 종료 날짜 문자열
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

// ---------- 수정 모달 ---------------
// FormField 인터페이스 (필요에 따라 확장)
interface FormField {
    id: string;
    name: string;
    label: string;
    type: "text" | "textarea" | "image" | "date" | "time" | "checkbox" | "number";
}
// 폼 필드 정의
const calendarFormFields: FormField[] = [
    {id: "id", name: "id", label: "ID", type: "number"}, // 수정용
    {id: "startDate", name: "startDate", label: " 시작 날짜", type: "date"},
    {id: "endDate", name: "endDate", label: "종료 날짜", type: "date"},
    {id: "title", name: "title", label: "제목", type: "text"},
    {id: "startTime", name: "startTime", label: "시작 시간", type: "time"},
    {id: "endTime", name: "endTime", label: "종료 시간", type: "time"},
    {id: "allDay", name: "allDay", label: "종일", type: "checkbox"},
];

// 현재 데이터를 저장할 객체
const currentData = reactive<ScheduleData>({});

// 모달 표시 여부
const showModal = ref(false);

// 모달 설정 객체
const modalConfig = reactive({
    title: "일정",
    formFields: calendarFormFields,
    submitText: "저장",
});

// 모달 열기
const openAddModal = (schedule?: ScheduleEntry) => {
    showModal.value = true;
    if (schedule?.id) {
        modalConfig.title = "일정 수정";
        modalConfig.submitText = "수정";
    } else {
        modalConfig.title = "일정 추가";
        modalConfig.submitText = "추가";
    }
    currentData.startDate = schedule?.startDate || new Date().toISOString().substring(0, 10);
    currentData.endDate = schedule?.endDate || new Date().toISOString().substring(0, 10);
    currentData.title = schedule?.title;
    currentData.startTime = schedule?.startTime || "00:00";
    currentData.endTime = schedule?.endTime || "00:00";
    currentData.allDay = schedule?.allDay || false;
    currentData.id = schedule?.id;
};

// 모달에서 submit 이벤트 발생 시 호출될 핸들러
const handleModalSubmit = async (payload: FormData) => {
    const idValue = payload.get("id");
    if (idValue === null || String(idValue).trim() === "") {
        try {
            await apiClient.post("/lecture/calendar", payload);
            location.reload();
            alert("성공적으로 일정을 추가했습니다.");
        } catch (error: any) {
            console.error("API 호출 오류:", error);
            if (error.response?.status === 400) {
                alert(error.response.data.message || "입력 오류가 발생했습니다.");
            } else if (error.response.status === 404) {
                alert(error.response.data?.detail);
            } else {
                alert("일정 추가에 실패했습니다.");
            }
        }
    } else {
        try {
            await apiClient.patch(`/lecture/calendar/${idValue}`, payload);
            location.reload();
            alert("성공적으로 일정을 수정했습니다.");
        } catch (error: any) {
            console.error("API 호출 오류:", error);
            if (error.response?.status === 400) {
                alert(error.response.data.message || "입력 오류가 발생했습니다.");
            } else if (error.response.status === 404) {
                alert(error.response.data?.detail);
            } else {
                alert("일정 수정에 실패했습니다.");
            }
        }
    }
};

const fullCalendarEvents = (rawData: any[]): any[] => {
    // rawData가 배열임을 명시
    const events: any[] = [];

    // rawData는 서버에서 /lecture/calendar API를 통해 받은 일정 데이터 배열입니다.
    // 서버 응답 형태가 `ScheduleEntry[]` 배열이라고 가정합니다.
    rawData.forEach((schedule) => {
        // --- 시작 날짜 및 시간 처리 ---
        const startEventDate = new Date(schedule.startDate);
        const startFormattedDate = `${startEventDate.getFullYear()}-${(startEventDate.getMonth() + 1).toString().padStart(2, "0")}-${startEventDate.getDate().toString().padStart(2, "0")}`;
        const startDateTime = schedule.startTime ? `${startFormattedDate}T${schedule.startTime.substring(0, 5)}` : startFormattedDate;

        // --- 종료 날짜 및 시간 처리 ---
        // endDate 필드가 없거나 null이면 startDate를 사용합니다.
        const endEventDate = schedule.endDate ? new Date(schedule.endDate) : startEventDate;
        const endFormattedDate = `${endEventDate.getFullYear()}-${(endEventDate.getMonth() + 1).toString().padStart(2, "0")}-${endEventDate.getDate().toString().padStart(2, "0")}`;

        // 종료 시간이 없으면 종료 날짜만 사용
        const endDateTime = schedule.endTime ? `${endFormattedDate}T${schedule.endTime.substring(0, 5)}` : endFormattedDate;

        events.push({
            title: schedule.title,
            start: startDateTime,
            end: endDateTime,
            allDay: schedule.allDay, // 백엔드에서 받은 allDay 값 사용
            id: schedule.id,
            extendedProps: {
                originalSchedule: schedule,
            },
        });
    });
    return events;
};

// `isStaff` prop에 따라 동적으로 변경될 headerToolbar.right 값
const rightToolbarButtons = computed(() => {
    // 여기에 listWeek 뷰 버튼 추가
    return props.isStaff ? "today,addEventButton" : "today";
});

// FullCalendar 옵션 설정
const calendarOptions = computed(() => ({
    height: 600,
    contentHeight: 600,
    plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin],
    initialView: "dayGridMonth",

    // 이 부분을 함수로 변경하여 반응형 헤더 툴바를 구현합니다.
    headerToolbar: {
        left: "prev,next",
        center: "title",
        right: props.isStaff ? "today,addEventButton" : "today",
    },

    customButtons: {
        addEventButton: {
            text: "등록",
            click: () => openAddModal(),
        },
    },
    locale: "ko",
    buttonText: {
        today: "오늘",
        month: "월",
        week: "주",
        day: "일",
        list: "목록",
    },
    events: async (fetchInfo: any, successCallback: any, failureCallback: any) => {
        try {
            const response = await apiClient.get("/lecture/calendar", {
                params: {
                    start_date: fetchInfo.startStr.substring(0, 10),
                    end_date: fetchInfo.endStr.substring(0, 10),
                },
            });
            const transformedData: ScheduleData = {};
            response.data.forEach((schedule: ScheduleEntry) => {
                const dateKey = schedule.startDate;
                if (!transformedData[dateKey]) {
                    transformedData[dateKey] = [];
                }
                transformedData[dateKey].push(schedule);
            });
            schedules.value = transformedData;
            successCallback(fullCalendarEvents(response.data));
        } catch (error) {
            console.error("FullCalendar 이벤트 로드 실패:", error);
            failureCallback(error);
        }
    },
    dayMaxEvents: 2,
    moreLinkClick: (info: any) => "popover",
    dateClick: (info: any) => openModal(new Date(info.dateStr)),
    eventClick: (info: any) => {
        openModal(info.event.start, info.event.extendedProps.originalSchedule);
        const popover = (info.jsEvent.target as HTMLElement).closest(".fc-popover");
        if (popover) {
            popover.remove();
        }
    },
    editable: props.isStaff,
    eventDrop: (info: any) => {
        if (props.isStaff) handleEventDrop(info);
    },
    eventResize: (info: any) => {
        if (props.isStaff) handleEventResize(info);
    },
}));

// Modal 관련 함수
const openModal = (date: Date, schedule?: ScheduleEntry | ScheduleEntry[]) => {
    selectedDate.value = date;
    // dateKey 생성 (MM-DD 형식이므로, V-calendar 구현체에 맞게 조정)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const dateKey = `${year}-${month}-${day}`;

    if (schedule) {
        // 특정 이벤트 클릭 시 해당 이벤트만 전달
        selectedSchedules.value = Array.isArray(schedule) ? schedule : [schedule];
    } else {
        // 날짜 클릭 시 해당 날짜의 모든 일정 전달 (수정된 로직)
        const schedulesOnClickedDate: ScheduleEntry[] = [];

        // schedules.value의 모든 일정들을 순회합니다.
        for (const startDate in schedules.value) {
            schedules.value[startDate].forEach((entry) => {
                const start = new Date(entry.startDate);
                const end = new Date(entry.endDate);
                const clicked = new Date(dateKey); // YYYY-MM-DD 형식으로 Date 객체 생성

                // 클릭한 날짜가 일정의 시작과 끝 날짜 사이에 있는지 확인합니다.
                // 시간을 제외하고 날짜만 비교하기 위해 시간을 자정으로 맞춥니다.
                const startMidnight = new Date(start.getFullYear(), start.getMonth(), start.getDate());
                const endMidnight = new Date(end.getFullYear(), end.getMonth(), end.getDate());
                const clickedMidnight = new Date(clicked.getFullYear(), clicked.getMonth(), clicked.getDate());

                if (clickedMidnight >= startMidnight && clickedMidnight <= endMidnight) {
                    schedulesOnClickedDate.push(entry);
                }
            });
        }
        selectedSchedules.value = schedulesOnClickedDate;
    }
    isModalOpen.value = true;
};

const closeModal = () => {
    isModalOpen.value = false;
    selectedDate.value = null;
    selectedSchedules.value = [];
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

// 일정 삭제
const handleDeleteSchedule = async (scheduleId: string) => {
    if (confirm("정말로 이 일정을 삭제하시겠습니까?")) {
        try {
            // 서버에 삭제 요청을 보냅니다.
            await apiClient.delete(`/lecture/calendar/${scheduleId}`); // 예시 API 경로

            alert("일정이 성공적으로 삭제되었습니다.");

            // schedules 데이터를 업데이트하여 FullCalendar 및 모달을 새로고침
            // 예를 들어, 삭제된 항목을 schedules.value에서 제거하는 로직
            for (const dateKey in schedules.value) {
                schedules.value[dateKey] = schedules.value[dateKey].filter((s) => s.id !== scheduleId);
            }

            // FullCalendar 이벤트 새로고침 (schedules 데이터가 변경되었으므로 computed 속성이 재계산될 것)
            if (fullCalendarRef.value) {
                // computed 속성에 바인딩되어 있다면 이 호출은 불필요하거나,
                // FullCalendar 자체의 events 배열을 직접 조작해야 할 수 있습니다.
                // 위에서 schedules.value를 업데이트했다면 이미 반응적으로 갱신될 것입니다.
                fullCalendarRef.value.getApi().refetchEvents(); // 안전을 위해 호출
            }
            closeModal(); //모달 닫기
        } catch (error) {
            console.error("일정 삭제 실패:", error);
            alert("일정 삭제에 실패했습니다.");
        }
    }
};

// 일정 수정
const handleEditSchedule = async (schedule: ScheduleEntry) => {
    closeModal();
    openAddModal(schedule);
};

const handleEventResize = (info: any) => {
    // 이벤트 리사이즈 로직 (주로 timeGrid에서 사용)
    // info.event.start, info.event.end 등을 사용하여 일정 시간을 업데이트
    console.log("Event resized:", info.event);
};
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

/* 모바일 화면에서 제목 글씨 크기 줄이기 */
@media (max-width: 767px) {
    .fc .fc-toolbar-title {
        font-size: 1.25rem; /* Tailwind의 text-xl과 유사 */
    }
    .fc .fc-toolbar-chunk .fc-button-group button {
        padding: 0.25rem 0.5rem; /* 패딩 줄이기 */
    }
}
</style>
