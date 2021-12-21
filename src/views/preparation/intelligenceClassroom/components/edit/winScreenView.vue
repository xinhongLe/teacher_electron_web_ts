<template>
    <div class="view-box">
        <ScreenView ref="screenRef" :keyDisabled="keyDisabled" :isInit="isInit" :slide="slideView"  @openCard="openCard"  @pagePrev="pagePrev()" @pageNext="pageNext()"/>
       <!-- 弹卡-->
        <open-card-view-dialog v-if="dialogVisible" :cardList="cardList"
          @closeOpenCard="closeOpenCard" v-model:dialogVisible="dialogVisible"></open-card-view-dialog>
    </div>
</template>

<script>
import { defineComponent, onMounted, ref } from "vue";
import { getCardDetail } from "@/api/home";
import { getWinCardDBData } from "@/utils/database";
import useHome from "@/hooks/useHome";
import { ElMessage } from "element-plus";
import OpenCardViewDialog from "./openCardViewDialog";
export default defineComponent({
    name: "winCardViewDialog",
    components: { OpenCardViewDialog },
    props: {
        pageList: {
            type: Object
        }
    },
    emits: ["stopGetAllPageList"],
    setup(props) {
        const slideView = ref({});
        const pageList = ref([]);
        const index = ref(0);
        const isInit = ref(true);
        const keyDisabled = ref(false);
        const { getPageDetail } = useHome();
        onMounted(async () => {
            pageList.value = props.pageList;
            getSlideData();
        });

        const pagePrev = async () => {
            if (index.value === 0) {
                return ElMessage({ type: "warning", message: "已经是第一页" });
            }
            index.value--;
            isInit.value = false;
            getSlideData();
        };

        const pageNext = async () => {
            if (index.value === pageList.value.length - 1) {
                return ElMessage({ type: "warning", message: "已经是最后页" });
            }
            index.value++;
            isInit.value = true;
            getSlideData();
        };

        const getSlideData = async () => {
            const dbResArr = await getWinCardDBData(pageList.value[index.value].ID);
            if (dbResArr.length > 0) {
                slideView.value = JSON.parse(dbResArr[0].result);
            } else {
                await getPageDetail(pageList.value[index.value], 1, (res) => {
                    if (res && res.id) {
                        slideView.value = res;
                    }
                });
            }
        };

        const dialogVisible = ref(false);
        const cardList = ref([]);
        const openCard = async (wins) => {
            if (wins[0] && wins[0].cards) {
                const cards = wins[0].cards;
                let pages = [];
                const newPages = [];
                cards.map(card => {
                    pages = pages.concat(card.slides.map(page => {
                        return {
                            ID: page.id,
                            Type: page.type,
                            Name: page.name
                        };
                    }));
                });
                if (pages.length > 0) {
                    const pageIDs = pages.map(page => page.ID);
                    const res = await getCardDetail({ pageIDs });
                    if (res.resultCode === 200 && res.result && res.result.length > 0) {
                        // 页名称可能会修改
                        res.result.map(item => {
                            pages.map(page => {
                                if (page.ID === item.ID) {
                                    newPages.push(
                                        { Type: page.Type, ID: page.ID, Name: item.Name }
                                    );
                                }
                            });
                        });
                        cardList.value = newPages;
                        dialogVisible.value = true;
                        keyDisabled.value = true;
                    }
                }
            }
        };

        const closeOpenCard = () => {
            dialogVisible.value = false;
            keyDisabled.value = false;
        };

        const screenRef = ref();
        const execPrev = () => {
            screenRef.value.execPrev();
        };

        const execNext = () => {
            screenRef.value.execNext();
        };

        return {
            keyDisabled,
            isInit,
            slideView,
            dialogVisible,
            cardList,
            pageNext,
            pagePrev,
            openCard,
            screenRef,
            execPrev,
            execNext,
            closeOpenCard
        };
    }
});
</script>

<style scoped lang="scss">
.view-box{
    :deep(.el-overlay){
        z-index: 999999 !important;
    }
    :deep(.el-dialog.is-fullscreen){
        --el-dialog-width: 94%;
        --el-dialog-margin-top: 0;
        margin-bottom: 0;
        height: 96%;
        overflow: auto;
        margin-top: 20px;
        display: flex;
        flex-direction: column;
        flex: 1;
    }
    :deep(.el-dialog__body){
        width: 100%;
        display: flex;
        flex: 1;
        min-width: 0;
        min-height: 0;
        overflow-y: auto;
        :deep(.slide-list){
            background: #fff;
        }
    }
}
</style>
