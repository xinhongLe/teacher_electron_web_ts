<template>
    <div class="preparation-group">
        <Search @requestParams="requestParams"/>
        <div class="content-wrapper" v-if="cardList.length > 0">
            <div class="card-wrapper">
                <Card :cardList="cardList"></Card>
            </div>
            <div class="card-pagination">
                <el-pagination background layout="total, sizes, prev, pager, next, jumper" :total="1000"></el-pagination>
            </div>
        </div>
        <div class="empty-wrapper" v-else>
            <Empty></Empty>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, onMounted } from "vue";
import { FetchPreparateListPageData } from "@/types/preparationGroup";
import Search from "./search/index.vue";
import Card from "./card/index.vue";
import Empty from "./empty/index.vue";
import useCardList from "./card/useCardList";
export default defineComponent({
    name: "preparation-group",
    setup(props, { emit }) {
        console.log(props);
        console.log(emit);
        const state = reactive({
            filterParams: {
                preTitle: "",
                status: 0,
                createStartTime: "",
                createEndTime: "",
                pager: {
                    pageNumber: 1,
                    pageSize: 10,
                    pageChoose: [10, 20, 30, 50],
                    total: 0
                }
            }
        });
        const requestParams = (params: FetchPreparateListPageData) => {
            console.log(params);
            // if (params) {
            //     if (params.createTime && params.createTime.length > 0) {
            //         console.log(params);
            //     }
            // }
            getCardList(state.filterParams);
        };
        const { cardList, getCardList } = useCardList();
        onMounted(() => {
            getCardList(state.filterParams);
        });
        return {
            ...toRefs(state),
            requestParams,
            cardList,
            getCardList
        };
    },
    components: { Search, Card, Empty }
});
</script>

<style lang="scss" scoped>
.preparation-group {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    min-width: 0;
    min-height: 0;
    background-color: #f5f6fa;
    .content-wrapper {
        height: calc(100% - 148px);
        padding: 16px 24px;
        .card-wrapper {
            height: calc(100% - 32px);
            overflow-y: auto;
        }
        .card-pagination {
            text-align: right;
            margin-top: 10px;
        }
    }
    .empty-wrapper {
        height: calc(100% - 148px);
        display: flex;
        align-items: center;
        justify-content: center;
    }
}
</style>
