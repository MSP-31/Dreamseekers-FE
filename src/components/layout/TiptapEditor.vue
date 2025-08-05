<template>
    <div class="tiptap-container">
        <div v-if="editor" class="toolbar">
            <select @change="updateHeading" class="select-heading">
                <option value="p">본문</option>
                <option value="h1">제목 1</option>
                <option value="h2">제목 2</option>
                <option value="h3">제목 3</option>
            </select>

            <div class="color-input-wrapper">
                <label for="color-picker" class="sr-only">글자색</label>
                <input
                    id="color-picker"
                    type="color"
                    @input="editor.chain().focus().setColor($event.target.value).run()"
                    :value="editor.getAttributes('textStyle').color || '#000000'"
                    class="color-input"
                    title="글자색 변경"
                />
            </div>

            <button type="button" @click="editor.chain().focus().toggleBold().run()" :class="{'is-active': editor.isActive('bold')}" title="볼드">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
                    <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
                </svg>
            </button>
            <button type="button" @click="editor.chain().focus().toggleItalic().run()" :class="{'is-active': editor.isActive('italic')}" title="이탤릭">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="19" y1="4" x2="10" y2="4"></line>
                    <line x1="14" y1="20" x2="5" y2="20"></line>
                    <line x1="15" y1="4" x2="9" y2="20"></line>
                </svg>
            </button>
            <button type="button" @click="editor.chain().focus().toggleBulletList().run()" :class="{'is-active': editor.isActive('bulletList')}" title="글머리 기호">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="feather feather-list"
                >
                    <line x1="8" y1="6" x2="21" y2="6"></line>
                    <line x1="8" y1="12" x2="21" y2="12"></line>
                    <line x1="8" y1="18" x2="21" y2="18"></line>
                    <line x1="3" y1="6" x2="3.01" y2="6"></line>
                    <line x1="3" y1="12" x2="3.01" y2="12"></line>
                    <line x1="3" y1="18" x2="3.01" y2="18"></line>
                </svg>
            </button>
            <button type="button" @click="editor.chain().focus().toggleOrderedList().run()" :class="{'is-active': editor.isActive('orderedList')}" title="번호 매기기">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="feather feather-list-ordered"
                >
                    <line x1="10" y1="6" x2="21" y2="6"></line>
                    <line x1="10" y1="12" x2="21" y2="12"></line>
                    <line x1="10" y1="18" x2="21" y2="18"></line>
                    <text x="3" y="7" font-family="Arial" font-size="5">1</text>
                    <text x="3" y="13" font-family="Arial" font-size="5">2</text>
                    <text x="3" y="19" font-family="Arial" font-size="5">3</text>
                </svg>
            </button>

            <button type="button" @click="setLink" :class="{'is-active': editor.isActive('link')}" title="링크 추가/수정">
                <img src="/img/icon/link.svg" alt="링크 추가/수정 아이콘" />
            </button>
            <button type="button" @click="editor.chain().focus().unsetLink().run()" :disabled="!editor.isActive('link')" title="링크 제거">
                <img src="/img/icon/unlink.svg" alt="링크 제거 아이콘" />
            </button>

            <button type="button" @click="editor.chain().focus().undo().run()" title="실행 취소">
                <img src="/img/icon/arrow-left.svg" alt="실행 취소 아이콘" />
            </button>
            <button type="button" @click="editor.chain().focus().redo().run()" title="다시 실행">
                <img src="/img/icon/arrow-right.svg" alt="다시 실행 아이콘" />
            </button>
        </div>
        <EditorContent :editor="editor" class="editor-content" />
    </div>
</template>

<script setup lang="ts">
import {watch, onBeforeUnmount} from "vue";
import {useEditor, EditorContent} from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import {Color} from "@tiptap/extension-color"; // 글자색 확장 기능
import {TextStyle} from "@tiptap/extension-text-style";

const props = defineProps({
    modelValue: {
        type: String,
        default: "",
    },
});

const emit = defineEmits(["update:modelValue"]);

const editor = useEditor({
    content: props.modelValue,
    extensions: [
        StarterKit,
        TextStyle.configure(),
        Color, // 글자색 기능 활성화
        Link.configure({
            autolink: true, // URL을 입력하면 자동으로 링크로 변환
            openOnClick: false, // 에디터 모드에서는 클릭 시 페이지 이동 방지
            HTMLAttributes: {
                target: "_blank", // 하이퍼링크 클릭 시 새 창에서 열기
            },
        }),
    ],
    onUpdate: ({editor}) => {
        emit("update:modelValue", editor.getHTML());
    },
});

// 헤더 드롭다운 변경 시 호출되는 함수
const updateHeading = (event: Event) => {
    if (editor.value) {
        const target = event.target as HTMLSelectElement;
        const value = target.value;

        if (value === "p") {
            editor.value.chain().focus().setParagraph().run();
        } else {
            editor.value
                .chain()
                .focus()
                .toggleHeading({level: parseInt(value.substring(1), 10) as 1 | 2 | 3})
                .run();
        }
    }
};

const setLink = () => {
    if (editor.value) {
        const previousUrl = editor.value.getAttributes("link").href;
        const url = window.prompt("URL을 입력하세요:", previousUrl);

        if (url === null) {
            return;
        }

        if (url === "") {
            editor.value.chain().focus().extendMarkRange("link").unsetLink().run();
            return;
        }

        editor.value.chain().focus().extendMarkRange("link").setLink({href: url}).run();
    }
};

watch(
    () => props.modelValue,
    (newVal) => {
        if (editor.value && newVal !== editor.value.getHTML()) {
            editor.value.commands.setContent(newVal, false);
        }
    }
);

onBeforeUnmount(() => {
    editor.value?.destroy();
});
</script>

<style scoped>
.tiptap-container {
    border: 1px solid #e2e8f0;
    border-radius: 0.25rem;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}
.toolbar {
    display: flex;
    flex-wrap: wrap;
    padding: 0.5rem;
    border-bottom: 1px solid #e2e8f0;
    background-color: #f8fafc;
    gap: 0.5rem;
}
.toolbar button {
    padding: 0.25rem 0.5rem;
    border: 1px solid #cbd5e1;
    border-radius: 0.25rem;
    cursor: pointer;
    background-color: #fff;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}
.toolbar button:hover {
    background-color: #f1f5f9;
}
.toolbar button.is-active {
    background-color: #3b82f6;
    color: #fff;
    border-color: #3b82f6;
}
.editor-content {
    flex-grow: 1;
    padding: 1rem;
    min-height: 200px;
    background-color: #fff;
    line-height: 1.5;
    font-size: 16px;
}
.editor-content :deep(.tiptap:focus) {
    outline: none;
}

/* 하이퍼링크 스타일 수정 */
.editor-content :deep(.tiptap a) {
    color: #3b82f6; /* 하늘색으로 표시 */
    text-decoration: underline;
    pointer-events: none; /* 에디터 내에서 링크를 클릭 불가능하게 만듭니다. */
    cursor: text;
}
/* 마크다운 헤더 스타일링 */
.editor-content :deep(.tiptap h1),
.editor-content :deep(.tiptap h2),
.editor-content :deep(.tiptap h3) {
    margin-top: 1rem;
    margin-bottom: 0.5rem;
}
.editor-content :deep(.tiptap h1) {
    font-size: 2.5rem;
    font-weight: bold;
}
.editor-content :deep(.tiptap h2) {
    font-size: 2rem;
    font-weight: bold;
}
.editor-content :deep(.tiptap h3) {
    font-size: 1.5rem;
    font-weight: bold;
}
.editor-content :deep(.tiptap ul),
.editor-content :deep(.tiptap ol) {
    padding-left: 20px;
}
.editor-content :deep(.tiptap ul) {
    list-style: disc;
}
.editor-content :deep(.tiptap ol) {
    list-style: decimal;
}
.editor-content :deep(.tiptap p) {
    margin-top: 0;
}

/* 드롭다운 스타일 */
.select-heading {
    padding: 0.25rem 0.5rem;
    border: 1px solid #cbd5e1;
    border-radius: 0.25rem;
    background-color: #fff;
    cursor: pointer;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background-image: url("data:image/svg+xml;utf8,<svg fill='black' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/><path d='M0 0h24v24H0z' fill='none'/></svg>");
    background-repeat: no-repeat;
    background-position-x: 95%;
    background-position-y: center;
    padding-right: 2rem;
}
/* 글자색 입력 필드 스타일 */
.color-input-wrapper {
    display: flex;
    align-items: center;
    border: 1px solid #cbd5e1;
    border-radius: 0.25rem;
    background-color: #fff;
    padding: 0.25rem;
    height: 32px;
}
.color-input {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    width: 24px;
    height: 24px;
    background-color: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
}
.color-input::-webkit-color-swatch-wrapper {
    padding: 0;
}
.color-input::-webkit-color-swatch {
    border: none;
    border-radius: 0.125rem;
}
.color-input::-moz-color-swatch {
    border: none;
    border-radius: 0.125rem;
}
</style>
