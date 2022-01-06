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
            <Empty :type="emptyItem.type" :tip="emptyItem.tip"></Empty>
        </div>
    </div>
    <CollectivePreparation ref="coRef" :collectivePreparationItem="collectivePreparationItem" @submit="addInviteeLink"></CollectivePreparation>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, onMounted, ref, nextTick } from "vue";
import { FetchPreparateListPageData } from "@/types/preparationGroup";
import { tryAddTeacherByInviteeLink, addTeacherByInviteeLink } from "./api";
import { useRoute } from "vue-router";
import moment from "moment";
import Search from "./search/index.vue";
import Card from "./card/index.vue";
import Empty from "./empty/index.vue";
import CollectivePreparation from "./collective-preparation/index.vue";
import useCardList from "./card/useCardList";
import { ElMessage } from "element-plus";
export default defineComponent({
    name: "preparationGroup",
    setup(props, { emit }) {
        console.log(props);
        console.log(emit);
        const collectivePreparationItem = ref();
        const coRef = ref();
        const route = useRoute();
        const state = reactive({
            filterParams: {
                preTitle: "",
                status: 0,
                createStartTime: "",
                createEndTime: "",
                pager: {
                    pageNumber: 1,
                    pageSize: 4,
                    pageChoose: [4, 8, 20, 50],
                    total: 0
                }
            },
            empty: [
                {
                    type: "preparation",
                    tip: "暂无集体备课活动，点击【发起集体备课】进行添加"
                },
                {
                    type: "",
                    tip: "暂无搜索结果"
                }
            ],
            emptyItem: {
                type: "",
                tip: ""
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
            nextTick(() => {
                if (cardList.value.length === 0 && (state.filterParams.preTitle.length > 0 || state.filterParams.createStartTime.length > 0)) {
                    state.emptyItem = state.empty[1];
                } else {
                    state.emptyItem = state.empty[0];
                }
            });
        };
        const { cardList, getCardList, pageParams } = useCardList();
        if (cardList.value.length === 0) {
            state.emptyItem = state.empty[0];
        }
        const handleSizeChange = (e: number) => {
            state.filterParams.pager.pageNumber = 1;
            state.filterParams.pager.pageSize = e;
            getCardList(state.filterParams);
        };
        const handleCurrentChange = (e: number) => {
            state.filterParams.pager.pageNumber = e;
            getCardList(state.filterParams);
        };
        const tryInviteeLink = async () => {
            if (!route.query.inviteID) return;
            const res = await tryAddTeacherByInviteeLink({
                ID: route.query.inviteID as string
            });
            if (res.resultCode === 200) {
                collectivePreparationItem.value = res.result;
                setTimeout(() => {
                    if (coRef.value) coRef.value.dialogVisible = true;
                });
            }
        };
        const addInviteeLink = async () => {
            const res = await addTeacherByInviteeLink({
                ID: route.query.inviteID as string
            });
            if (res.resultCode === 200) {
                ElMessage.success("加入成功，跳转中");
                setTimeout(() => {
                    window.open(`${window.location.origin}/preparation-edit/${collectivePreparationItem.value.GroupLessonPreparateID}`);
                }, 2000);
            }
        };
        onMounted(() => {
            getCardList(state.filterParams);
            tryInviteeLink();
        });
        return {
            ...toRefs(state),
            coRef,
            collectivePreparationItem,
            moment,
            requestParams,
            cardList,
            getCardList,
            pageParams,
            handleSizeChange,
            handleCurrentChange,
            addInviteeLink
        };
    },
    components: { Search, Card, Empty, CollectivePreparation }
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
        padding: 16px 24px 24px 24px;
        .card-wrapper {
            height: calc(100% - 42px);
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
