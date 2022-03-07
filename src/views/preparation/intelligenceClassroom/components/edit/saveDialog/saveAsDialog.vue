<script lang="ts" setup>
import BaseDialog from "./baseDialog.vue";
import { defineEmits } from "vue";
const emit = defineEmits(["update:isShow"]);
const close = () => {
    emit("update:isShow", false);
};
</script>

<template>
    <BaseDialog
        title="提示"
        content="您正在编辑系统课件，保存后将自动为您生成自己的副本课件。"
        @close="close"
    >
    </BaseDialog>
</template>

<style lang="scss" scoped></style>
