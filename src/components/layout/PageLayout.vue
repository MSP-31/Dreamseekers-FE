<template>
    <div>
        <PageHeader :title="title" :backgroundImageUrl="backgroundImageUrl" />

        <SubMenuBreadcrumb />

        <div class="main-content">
            <slot></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
import PageHeader from "./PageHeader.vue";
import SubMenuBreadcrumb from "./SubMenuBreadcrumb.vue";

const props = defineProps<{
    title: string;
    backgroundImageUrl: string;
}>();
</script>
