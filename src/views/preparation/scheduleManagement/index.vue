<template>
    <ClassContent/>
    <QuestionBank/>
</template>

<script lang="ts" setup>
import { bagKey } from "@/hooks/useBag";
import emitter from "@/utils/mitt";
import { findIndex, isEmpty } from "lodash";
import { defineProps, inject, onMounted, provide, watchEffect } from "vue";
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

const { getBagList, bagList, handleSelectBag, selectBag } = inject(bagKey)!;

provide("isOperator", props.isOperator);

watchEffect(() => {
    if (props.selectLessonId) {
        getBagList("39F7666ABD9E8041FB7E46A7089D1434").then(() => {
            if (!isEmpty(bagList.value)) {
                handleSelectBag(bagList.value[0], 0);
            }
        });
    }
});

onMounted(() => {
    emitter.on("preparationReLoad", () => {
        getBagList(props.selectLessonId).then(() => {
            const index = findIndex(bagList.value, { ID: selectBag.value?.ID }) || 0;
            handleSelectBag(selectBag.value || bagList.value[0], index);
        });
    });
});

</script>

<style lang="scss" scoped>
</style>
