<template>
    <header>
        <TopHeader :user="user" @logout="$emit('logout')" />
        <NavigationBar :is-staff="user.isStaff" />
        <!-- MobileSidebar는 NavigationBar 내부 또는 여기서 조건부로 렌더링 가능 -->
    </header>
</template>

<script setup>
import TopHeader from "./TopHeader.vue";
import NavigationBar from "./NavigationBar.vue";

defineProps({
    user: {
        type: Object,
        required: true,
    },
});

defineEmits(["logout"]);
</script>
