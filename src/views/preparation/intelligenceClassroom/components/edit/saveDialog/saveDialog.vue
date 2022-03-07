<script lang="ts" setup>
import BaseDialog from "./baseDialog.vue";
import { defineEmits } from "vue";
const emit = defineEmits(["update:isShow"]);
const close = () => {
    emit("update:isShow", false);
};
</script>

<template>
    <BaseDialog title="另存课件" name="1.1 秒的认识（副本1）" @close="close"> </BaseDialog>
</template>

<style lang="scss" scoped></style>
