<template>
    <div class="preparation-group">
        <Search @requestParams="requestParams"/>
        <div class="content-wrapper" v-if="cardList.length > 0">
            <div class="card-wrapper">
                <Card :cardList="cardList" @requestParams="requestParams"></Card>
            </div>
            <div class="card-pagination">
                <el-pagination
                    background
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="pageParams.Total"
                    :page-sizes="filterParams.pager.pageChoose"
                    :current-page="filterParams.pager.pageNumber"
                    :page-size="filterParams.pager.pageSize"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange">
                </el-pagination>
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
import moment from "moment";
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
            if (params) {
                if (params.createTime && params.createTime.length > 0) {
                    state.filterParams.createStartTime = `${moment(params.createTime[0]).format("YYYY-MM-DD")} 00:00:00`;
                    state.filterParams.createEndTime = `${moment(params.createTime[1]).format("YYYY-MM-DD")} 23:59:59`;
                } else {
                    state.filterParams.createStartTime = "";
                    state.filterParams.createEndTime = "";
                }
            }
            const queryParams = Object.assign(state.filterParams, params);
            delete queryParams.createTime;
            getCardList(queryParams);
        };
        const { cardList, getCardList, pageParams } = useCardList();

        const handleSizeChange = (e: number) => {
            state.filterParams.pager.pageNumber = 1;
            state.filterParams.pager.pageSize = e;
            getCardList(state.filterParams);
        };
        const handleCurrentChange = (e: number) => {
            state.filterParams.pager.pageNumber = e;
            getCardList(state.filterParams);
        };
        onMounted(() => {
            getCardList(state.filterParams);
        });
        return {
            ...toRefs(state),
            moment,
            requestParams,
            cardList,
            getCardList,
            pageParams,
            handleSizeChange,
            handleCurrentChange
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
