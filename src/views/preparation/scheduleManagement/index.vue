<template>
    <ClassContent/>
    <QuestionBank/>
</template>

<script lang="ts" setup>
import { bagKey } from "@/hooks/useBag";
import emitter from "@/utils/mitt";
import { get } from "@/utils/storage";
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

const { getBagList, bagList, handleSelectBag, selectBag, classContentList, selectBagIdKey } = inject(bagKey)!;

provide("isOperator", props.isOperator);

watchEffect(() => {
    if (props.selectLessonId) {
        classContentList.value = [];
        selectBag.value = undefined;
        bagList.value = [];
        getBagList(props.selectLessonId).then(() => {
            emits("update:isBagLoadEnd", true);
            if (!isEmpty(bagList.value)) {
                const rememberBagId = get(selectBagIdKey.value);
                let bag = bagList.value[0];
                let index = 0;
                if (rememberBagId) {
                    const rememberBagIndex = findIndex(bagList.value, { ID: rememberBagId });
                    if (rememberBagIndex !== -1) {
                        bag = bagList.value[rememberBagIndex];
                        index = rememberBagIndex;
                    }
                }
                handleSelectBag(bag, index);
            }
        });
    }
});

const preparationReLoad = () => {
    getBagList(props.selectLessonId).then(() => {
        let index = findIndex(bagList.value, { ID: selectBag.value?.ID });
        let bag = selectBag.value || bagList.value[0];
        if (index === -1) {
            index = 0;
            bag = bagList.value[0];
        }
        handleSelectBag(bag, index);
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
