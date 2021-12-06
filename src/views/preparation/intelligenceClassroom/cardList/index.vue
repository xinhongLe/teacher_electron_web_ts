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
import { defineComponent, ref, watch } from "vue-demi";
import cardList from "../hooks/cardList";
export default defineComponent({
    props: {
        cardList: {
            type: Array
        }
    },
    setup(props, { emit }) {
        const { dealCardData } = cardList();
        const currentCardList = ref([]);
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
        };
        return {
            currentCardList,
            cardIndex,
            handleClick
        };
    }
});
</script>

<style lang="scss" scoped>
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
    font-size: 15px;
    color: #444;
    white-space: nowrap;
    text-overflow: ellipsis;
    cursor: pointer;
    position: relative;
}

.me-card-item p{
  padding: 17px 10px;
  overflow: hidden;
  font-size: 18px;
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
