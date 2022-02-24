<template>
    <div class="me-card">
        <div
            class="me-card-item"
            :class="cardIndex === index && 'active'"
            v-for="(item, index) in currentCardList"
            :key="index"
            @click="handleClick(index, item)"
        >
            <span>{{ item.Name ? item.Name : "新卡" }}</span>
        </div>
    </div>
</template>

<script>
import { computed, defineComponent, ref, watch } from "vue";
import cardList from "../hooks/cardList";
import { ElMessage } from "element-plus";
import TrackService, { EnumTrackEventType } from "@/utils/common";
export default defineComponent({
    props: {
        cardList: {
            type: Array
        },
        LessonID: {
            type: String
        },
        winActiveId: {
            type: String
        },
        WindowName: {
            type: String
        }
    },
    setup(props, { emit }) {
        const { dealCardData } = cardList();
        const currentCardList = ref([]);
        const winActiveId = computed(() => props.winActiveId);
        const WindowName = computed(() => props.WindowName);
        watch(
            () => props.cardList,
            () => {
                currentCardList.value = props.cardList;
            }
        );
        const cardIndex = ref(0);
        const handleClick = (index, item) => {
            cardIndex.value = index;
            const pageDate = dealCardData(item, item.originType);
            emit("updatePageList", pageDate);
            TrackService.setTrack(EnumTrackEventType.SelectCard, winActiveId.value, WindowName.value, item.ID, item.Name, item.PageList.length > 0 ? item.PageList[0].ID : "", item.PageList.length > 0 ? item.PageList[0].Name : "", "选择卡", "", "");
        };
        const ToastFirstPage = debounce(() => {
            return ElMessage({ type: "warning", message: "已经是第一页了" });
        }, 200);
        const ToastLastPage = debounce(() => {
            return ElMessage({ type: "warning", message: "已经是最后页" });
        }, 200);
        const changeReducePage = () => {
            if (currentCardList.value.length === 0) return false;
            if (cardIndex.value + 1 === currentCardList.value.length) {
                ToastLastPage();
                return false;
            }
            handleClick(cardIndex.value + 1, currentCardList.value[cardIndex.value + 1]);
        };
        const changeAddPage = () => {
            if (cardIndex.value === 0) {
                emit("updateFlag");
                ToastFirstPage();
                return false;
            }
            handleClick(cardIndex.value - 1, currentCardList.value[cardIndex.value - 1]);
        };
        return {
            currentCardList,
            cardIndex,
            handleClick,
            changeReducePage,
            changeAddPage,
            ToastFirstPage,
            ToastLastPage
        };
    },
    activated () {
        if (this.currentCardList.length > 0) {
            this.handleClick(this.cardIndex, this.currentCardList[this.cardIndex]);
        }
    }
});
function debounce (fn, delay) {
    let timer;
    return function () {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            fn();
        }, delay);
    };
}
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
