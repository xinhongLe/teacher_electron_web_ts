<template>
    <ClassContent/>
    <QuestionBank/>
</template>

<script lang="ts" setup>
import { bagKey } from "@/hooks/useBag";
import emitter from "@/utils/mitt";
import { findIndex, isEmpty } from "lodash";
import { defineProps, inject, onMounted, provide, watchEffect, defineEmits, onUnmounted } from "vue";
import ClassContent from "./ClassContent.vue";
import QuestionBank from "./questionBank/index.vue";

const props = defineProps({
    selectLessonId: {
        type: String,
        default: ""
    },
    isOperator: {
        type: Boolean,
        default: true
    }
});

const emits = defineEmits(["update:isBagLoadEnd"]);

const { getBagList, bagList, handleSelectBag, selectBag, classContentList } = inject(bagKey)!;

provide("isOperator", props.isOperator);

watchEffect(() => {
    if (props.selectLessonId) {
        classContentList.value = [];
        selectBag.value = undefined;
        bagList.value = [];
        getBagList(props.selectLessonId).then(() => {
            emits("update:isBagLoadEnd", true);
            if (!isEmpty(bagList.value)) {
                handleSelectBag(bagList.value[0], 0);
            }
        });
    }
});

const preparationReLoad = () => {
    getBagList(props.selectLessonId).then(() => {
        const index = findIndex(bagList.value, { ID: selectBag.value?.ID }) || 0;
        handleSelectBag(selectBag.value || bagList.value[0], index);
    });
};

onMounted(() => {
    emitter.on("preparationReLoad", preparationReLoad);
});
onUnmounted(() => {
    emitter.off("preparationReLoad", preparationReLoad);
});
</script>

<style lang="scss" scoped>
</style>
