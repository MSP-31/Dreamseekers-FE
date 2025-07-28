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
import {ref, reactive, computed, onMounted} from "vue";
import CalendarModal from "./CalendarModal.vue"; // 모달 컴포넌트 임포트
import ReusableFormModal from "@/components/layout/ReusableFormModal.vue";

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
    {id: "date", name: "date", label: "날짜", type: "date"},
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
    currentData.date = schedule?.date || new Date().toISOString().substring(0, 10);
    currentData.title = schedule?.title;
    currentData.startTime = schedule?.startTime;
    currentData.endTime = schedule?.endTime;
    currentData.allDay = schedule?.allDay || false;
    currentData.id = schedule?.id;
};

// 모달에서 submit 이벤트 발생 시 호출될 핸들러
const handleModalSubmit = async (payload: FormData) => {
    const idValue = payload.get("id");
    console.log("idValue:", idValue);
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
        const eventDate = new Date(schedule.date); // schedule.date는 'YYYY-MM-DD' 형식일 것
        const formattedDate = `${eventDate.getFullYear()}-${(eventDate.getMonth() + 1).toString().padStart(2, "0")}-${eventDate.getDate().toString().padStart(2, "0")}`;

        // 시간이 null 또는 비어있는 경우 '00:00'으로 처리하거나 allDay: true로 설정하는 로직 추가 고려
        const startDateTime = schedule.startTime ? `${formattedDate}T${schedule.startTime.substring(0, 5)}` : formattedDate;
        const endDateTime = schedule.endTime ? `${formattedDate}T${schedule.endTime.substring(0, 5)}` : formattedDate;

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
    return props.isStaff ? "today,addEventButton" : "today";
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
        right: rightToolbarButtons,
    },
    customButtons: {
        // addEventButton에 대한 설정
        addEventButton: {
            text: "등록",
            click: function () {
                openAddModal();
            },
        },
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
    events: async (fetchInfo: {startStr: string; endStr: string; timeZone: string}, successCallback: (events: any[]) => void, failureCallback: (error: any) => void) => {
        try {
            // 날짜 추출
            const startDateFormatted = fetchInfo.startStr.substring(0, 10);
            const endDateFormatted = fetchInfo.endStr.substring(0, 10);

            // FullCalendar가 요청하는 날짜 범위 (startStr, endStr)를 사용하여 API 호출
            const response = await apiClient.get("/lecture/calendar", {
                params: {
                    start_date: startDateFormatted, // 서버에서 인식할 파라미터 이름 확인
                    end_date: endDateFormatted, // 서버에서 인식할 파라미터 이름 확인
                },
            });

            // 서버 응답 데이터를 FullCalendar 이벤트 형식으로 변환
            const transformedEvents = fullCalendarEvents(response.data); // 위에서 정의한 함수 사용

            // FullCalendar에 이벤트 전달
            successCallback(transformedEvents);
        } catch (error) {
            console.error("FullCalendar 이벤트 로드 실패:", error);
            failureCallback(error); // FullCalendar에 오류를 알림
        }
    },

    dayMaxEvents: 2, // 예시: 2개까지만 표시하고 그 이상은 "+N more"로 표시
    // "+N more" 링크 클릭 시 동작 정의
    moreLinkClick: function (info: any) {
        return "popover"; // 'popover' 또는 'dayGridDay', 'timeGridDay', 'listWeek', 'listDay' 등 뷰 이름 반환
    },

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
// const handleAddSchedule = (newSchedule: ScheduleEntry) => {
//     if (selectedDate.value) {
//         const year = selectedDate.value.getFullYear();
//         const month = selectedDate.value.getMonth() + 1;
//         const day = selectedDate.value.getDate();
//         const dateKey = `${year}-${month}-${day}`;

//         // 내부 schedules.value를 직접 업데이트
//         if (!schedules.value[dateKey]) {
//             schedules.value[dateKey] = [];
//         }
//         schedules.value[dateKey].push(newSchedule);

//         // if (fullCalendarRef.value) {
//         //   fullCalendarRef.value.getApi().refetchEvents();
//         // }
//     }
//     closeModal();
// };

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
    console.log(schedule);
    closeModal();
    openAddModal(schedule);
};

const handleEventResize = (info: any) => {
    // 이벤트 리사이즈 로직 (주로 timeGrid에서 사용)
    // info.event.start, info.event.end 등을 사용하여 일정 시간을 업데이트
    console.log("Event resized:", info.event);
};

// onMounted(async () => {
//     try {
//         const response = await apiClient.get<ScheduleData>("/lecture/calendar");
//         schedules.value = response.data;
//         console.log("강의 일정 데이터:", response.data);
//     } catch (error: any) {
//         console.error("강의 일정 API 호출 오류:", error);
//         if (error.response) {
//             const errorMessage = error.response.data?.detail || error.response.data?.message || `서버 오류: ${error.response.status}`;
//             alert(`강의 데이터를 불러오는 데 실패했습니다: ${errorMessage}`);
//         } else {
//             alert("강의 데이터를 불러오는 데 실패했습니다: 네트워크 연결을 확인하세요.");
//         }
//     }
// });
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
