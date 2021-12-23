<template>
    <div class="me-card">
        <div
            class="me-card-item"
            :class="cardIndex === index && 'active'"
            v-for="(item, index) in currentCardList"
            :key="index"
            @click="handleClick(index, item)"
        >
            <p>{{ item.Name ? item.Name : "新卡" }}</p>
        </div>
    </div>
</template>

<script>
import { computed, defineComponent, ref, watch } from "vue-demi";
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
            console.log(currentCardList.value[index], item);
            cardIndex.value = index;
            const pageDate = dealCardData(item, item.originType);
            emit("updatePageList", pageDate);
            TrackService.setTrack(EnumTrackEventType.SelectCard, winActiveId.value, WindowName.value, item.ID, item.Name, item.PageList.length > 0 ? item.PageList[0].ID : "", item.PageList.length > 0 ? item.PageList[0].Name : "", "选择卡", "", "");
        };
        const changeReducePage = () => {
            if (currentCardList.value.length === 0) return false;
            if (cardIndex.value + 1 === currentCardList.value.length) {
                return ElMessage({ type: "warning", message: "已经是最后一页" });
            }
            handleClick(cardIndex.value + 1, currentCardList.value[cardIndex.value + 1]);
        };
        const changeAddPage = () => {
            if (cardIndex.value === 0) {
                emit("updateFlag");
                return ElMessage({ type: "warning", message: "已经是第一页了" });
            }
            handleClick(cardIndex.value - 1, currentCardList.value[cardIndex.value - 1]);
        };
        return {
            currentCardList,
            cardIndex,
            handleClick,
            changeReducePage,
            changeAddPage
        };
    },
    activated () {
        if (this.currentCardList.length > 0) {
            this.handleClick(this.cardIndex, this.currentCardList[this.cardIndex]);
        }
    }
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
    padding: 0 15px;
    box-sizing: border-box;
}
.me-card-item {
    border: 1px solid #ddd;
    background-color: #fff;
    margin-bottom: 15px;
    box-sizing: border-box;
    border-radius: 5px;
    font-size: 14px;
    color: #444;
    white-space: nowrap;
    text-overflow: ellipsis;
    cursor: pointer;
    position: relative;
}

.me-card-item p{
  padding: 17px 10px;
  overflow: hidden;
  font-size: 16px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.me-card-item.active {
    border-color: #5560f1;
    background-color: #5560f1;
    color: #fff;
}

.me-card-item.active:after {
    display: block;
    content: "";
    width: 10px;
    height: 10px;
    background-color: #5560f1;
    transform: rotate(45deg);
    position: absolute;
    right: -5px;
    top: 19px;
}

.operation-button {
    border: 1px solid #b3d8ff;
    border-radius: 4px;
    padding: 10px;
    text-align: center;
    font-size: 20px;
    color: #409eff;
    font-weight: 800;

    span {
        cursor: pointer;

        &:first-of-type {
            margin-right: 20px;
        }
    }
}
</style>
