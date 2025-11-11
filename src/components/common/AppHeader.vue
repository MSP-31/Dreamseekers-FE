<template>
    <header>
        <TopHeader v-if="isAdmin" @logout="$emit('logout')" />
        <NavigationBar />
        <!-- MobileSidebar는 NavigationBar 내부 또는 여기서 조건부로 렌더링 가능 -->
    </header>
</template>

<script setup>
import TopHeader from "@/components/common/TopHeader.vue";
import NavigationBar from "../common/NavigationBar.vue";
import {useAuthStore} from "@/stores/auth";
import {computed} from "vue";

const authStore = useAuthStore();
const isAdmin = computed(() => authStore.isAdmin);

defineEmits(["logout"]);
</script>
