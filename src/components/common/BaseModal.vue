<template>
    <div
        v-if="show"
        class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-in-out"
        :class="{'opacity-100': show, 'opacity-0 pointer-events-none': !show}"
        @click.self="closeModal"
    >
        <div class="bg-white p-6 sm:p-8 rounded-lg shadow-2xl w-full max-w-2xl transform transition-all duration-300 ease-in-out" :class="{'scale-100': show, 'scale-95': !show}">
            <div class="flex justify-between items-center mb-6">
                <h3 class="text-xl font-semibold text-gray-800">{{ modalTitle }}</h3>
                <button @click="closeModal" class="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>
            <slot name="content"></slot>
            <div class="text-right mt-6" v-if="submitButtonText">
                <button type="button" @click="closeModal" class="mr-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-md shadow-sm transition duration-150 ease-in-out">
                    취소
                </button>
                <button type="button" @click="handleSubmit" class="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md shadow-sm transition duration-150 ease-in-out">
                    {{ submitButtonText }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps({
    show: {type: Boolean, default: false},
    modalTitle: {type: String, default: "모달"},
    submitButtonText: {type: String},
});

const emit = defineEmits(["update:show", "submit"]);

const closeModal = () => {
    emit("update:show", false);
};

const handleSubmit = () => {
    emit("submit");
};
</script>
