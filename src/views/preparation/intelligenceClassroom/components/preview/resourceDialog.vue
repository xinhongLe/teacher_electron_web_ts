<script lang="ts" setup>
import { onClickOutside } from "@vueuse/core";
import { defineEmits, ref } from "vue";
import ClassContent from "@/views/preparation/scheduleManagement/packageManagement/ClassContent.vue";
import QuestionBank from "@/views/preparation/scheduleManagement/packageManagement/questionBank/index.vue";

const emits = defineEmits(["update:modelValue"]);

const contentRef = ref<HTMLDivElement>();

const close = () => {
    emits("update:modelValue", false);
};

onClickOutside(contentRef, close);
</script>

<template>
    <div class="dialog-warp">
        <div class="content-container" ref="contentRef">
            <ClassContent/>
            <QuestionBank/>
        </div>
        <div class="close-btn" >
            关闭
        </div>
    </div>
</template>

<style lang="scss" scoped>
.dialog-warp {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 2000;
    background-color: rgba(0, 0, 0, 0.5);
    .content-container {
        position: absolute;
        bottom: 98px;
        left: 50%;
        transform: translateX(-50%);
        width: 1452px;
        height: 584px;
        background: #FFFFFF;
        box-shadow: 0px 6px 16px -8px rgba(0, 0, 0, 0.12), 0px 9px 28px 0px rgba(0, 0, 0, 0.08), 0px 12px 48px 16px rgba(0, 0, 0, 0.05);
        border-radius: 8px;
        padding: 32px;
        display: flex;
        justify-content: space-between;
    }
    .close-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        bottom: 24px;
        left: 50%;
        transform: translateX(-50%);
        width: 160px;
        height: 50px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 25px;
        border: 2px solid #FFFFFF;
        color: #FFFFFF;
        font-weight: 600;
        font-size: 20px;
        cursor: pointer;
    }
}
</style>
