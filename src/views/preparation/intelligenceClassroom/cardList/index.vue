<template>
    <div class="me-card">
        <div
            class="me-card-item"
            :class="currentCardIndex === index && 'active'"
            v-for="(item, index) in cardList"
            :key="index"
            @click="handleClick(index, item)"
        >
            <span>{{ item.Name ? item.Name : "新卡" }}</span>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { defineEmits, inject, defineExpose } from "vue";
import { ElMessage } from "element-plus";
import { SchoolWindowCardInfo } from "@/types/preparation";
import { debounce } from "lodash";
import { windowInfoKey } from "@/hooks/useWindowInfo";

const emit = defineEmits(["updatePageList", "updateFlag"]);

const { handleSelectCard, cardList, currentCardIndex } = inject(windowInfoKey)!;

const handleClick = (index: number, item: SchoolWindowCardInfo) => {
    currentCardIndex.value = index;
    handleSelectCard(item);
};
const ToastFirstPage = debounce(() => {
    return ElMessage({ type: "warning", message: "已经是第一页了" });
}, 200);
const ToastLastPage = debounce(() => {
    return ElMessage({ type: "warning", message: "已经是最后页" });
}, 200);
const changeReducePage = () => {
    if (cardList.value.length === 0) return false;
    if (currentCardIndex.value + 1 === cardList.value.length) {
        ToastLastPage();
        return false;
    }
    handleClick(currentCardIndex.value + 1, cardList.value[currentCardIndex.value + 1]);
};
const changeAddPage = () => {
    if (currentCardIndex.value === 0) {
        emit("updateFlag");
        ToastFirstPage();
        return false;
    }
    handleClick(currentCardIndex.value - 1, cardList.value[currentCardIndex.value - 1]);
};

defineExpose({
    changeReducePage,
    changeAddPage
});

</script>

<style lang="scss" scoped>
#nodata{
    cursor:not-allowed;
    pointer-events:none;
}
.me-card {
    position: relative;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
}
.me-card-item {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 48px;
    border: 1px solid #E0E2E7;
    background-color: #fff;
    margin-bottom: 12px;
    border-radius: 4px;
    font-size: 16px;
    color: var(--app-color-dark);
    @include text-ellipsis;
    cursor: pointer;
    position: relative;
    font-weight: 600;
    padding: 0 12px;
    span {
        @include text-ellipsis;
    }
    &:last-child {
        margin-bottom: 0;
    }
}

.me-card-item.active {
    color: var(--app-color-primary);
    border: 2px solid var(--app-color-primary);
    background-color: #F0F4FF;
}

</style>
