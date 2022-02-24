<script lang="ts" setup>
import { defineProps, PropType, defineEmits } from "vue";

defineProps({
    selected: {
        type: Number
    },
    pageList: {
        type: Array as PropType<any[]>
    }
});

defineEmits(["selectPage"]);
</script>
<template>
    <div
        class="me-page-item"
        :class="selected === index && 'active'"
        v-for="(item, index) in pageList"
        :key="index"
        @click="$emit('selectPage', index, item)"
    >
        {{ item.Name }}
    </div>
</template>

<style lang="scss" scoped>
.me-page-item {
    background-color: #F0F4FF;
    color: var(--app-color-primary);
    padding: 0px 20px;
    height: 36px;
    display: flex;
    align-items: center;
    font-size: 16px;
    white-space: nowrap;
    margin-right: 12px;
    border: 2px solid transparent;
    border-radius: 4px;
    cursor: pointer;
    position: relative;
    font-weight: 600;
    &.active {
        border: 2px solid var(--app-color-primary);
    }
}
</style>
