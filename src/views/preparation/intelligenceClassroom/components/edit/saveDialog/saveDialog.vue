<script lang="ts" setup>
import BaseDialog from "./baseDialog.vue";
import { defineEmits, defineProps } from "vue";

defineProps({
    name: {
        type: String,
        default: ""
    }
});
const emit = defineEmits(["update:isShow", "onSave"]);
const close = () => {
    emit("update:isShow", false);
};

const onSave = (name: string) => {
    emit("onSave", name);
};
</script>

<template>
    <BaseDialog title="另存课件" :name="name" @close="close" @onSave="onSave"> </BaseDialog>
</template>

<style lang="scss" scoped></style>
