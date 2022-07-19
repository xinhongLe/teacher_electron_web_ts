<template>
    <div class="view-box">
        <ScreenView ref="screenRef"  @openMenu="openMenu" @offScreen="offScreen" :keyDisabled="keyDisabled" :isInit="isInit" :slide="slideView"  @openCard="openCard"  @pagePrev="pagePrev()" @pageNext="pageNext()"/>

        <div class="right-fixed" v-if="showCollapse">
            <div class="right-content" >
                <div class="text title">页列表</div>
                <div :class="['text', index === i ? 'active': '']" @click="handleActive(i)" v-for="(item, i) in pageList" :KEY="item.ID">{{item.Name}}</div>
            </div>
        </div>
<!--        <div :class="['fixed-box', showCollapse ? 'showCollapseClass' : 'hideCollapseClass']" @click="showCollapse = !showCollapse">-->
<!--            <i class="el-icon-menu"></i>-->
<!--        </div>-->

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
import { exitFullscreen } from "@/utils/fullscreen";
export default defineComponent({
    name: "winCardViewDialog",
    components: { OpenCardViewDialog },
    props: {
        pageList: {
            type: Object
        },
        activePageIndex: {
            type: Number,
            default: () => 0
        }
    },
    emits: ["offScreen"],
    setup(props, { emit }) {
        const showCollapse = ref(false);
        const slideView = ref({});
        const pageList = ref([]);
        const index = ref(0);
        const isInit = ref(true);
        const keyDisabled = ref(false);
        const { getPageDetail } = useHome();
        onMounted(async () => {
            pageList.value = props.pageList;
            index.value = props.activePageIndex;
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

        const handleActive = (i) => {
            index.value = i;
            getSlideData();
        };

        const openMenu = () => {
            showCollapse.value = !showCollapse.value;
        };

        const getSlideData = async () => {
            const dbResArr = await getWinCardDBData(pageList.value[index.value].ID);
            if (dbResArr.length > 0) {
                slideView.value = JSON.parse(dbResArr[0].result);
            } else {
                await getPageDetail(pageList.value[index.value], 1, (res) => {
                    slideView.value = res;
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
                        pages.map(item => {
                            const value = res.result.find(page => page.ID === item.ID);
                            if (value) {
                                newPages.push({ Type: item.Type, ID: item.ID, Name: value.Name });
                            } else {
                                newPages.push({ Type: item.Type, ID: item.ID, Name: item.Name });
                            }
                        });

                        cardList.value = newPages;
                        dialogVisible.value = true;
                        keyDisabled.value = true;
                    } else {
                        keyDisabled.value = false;
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
        const offScreen = () => {
            emit("offScreen");
            // exitFullscreen();
        };
        return {
            keyDisabled,
            isInit,
            slideView,
            dialogVisible,
            cardList,
            showCollapse,
            index,
            openMenu,
            pageNext,
            pagePrev,
            openCard,
            screenRef,
            execPrev,
            execNext,
            closeOpenCard,
            offScreen,
            handleActive
        };
    }
});
</script>

<style scoped lang="scss">
.view-box{
    :deep(.el-overlay){
        z-index: 999999 !important;
    }
    :deep(.el-dialog){
        --el-dialog-margin-top: 5vh;
        .slide-list{
            background-color: #fff;
        }
    }
    :deep(.el-dialog__body){
        height: 80vh !important;
        width: 100%;
        overflow-y: auto;
    }
    .right-fixed{
        position: fixed;
        left: 0;
        top: 0;
        background-color: #fff;
        width: 240px;
        height: 100vh;
        z-index: 99999;
        .right-content{
            height: 100%;
            width: 100%;
            overflow: auto;
        }
        .text{
            padding: 0 20px;
            cursor: pointer;
            height: 40px;
            line-height: 40px;
            font-size: 14px;
            border-bottom: 0.1px solid #f0f0f0;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
            &.title{
                padding: 0 10px;
                font-size: 16px;
            }
            &.active{
                color: #409eff;
                background-color: #ecf5ff;
            }
        }
    }
    .fixed-box{
        position: fixed;
        left: 0px;
        bottom: 0px;
        width: 40px;
        height: 40px;
        border: 1px solid #666;
        border-radius: 50%;
        color: #666;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 99999;
        font-size: 18px;
        cursor: pointer;
        &:hover{
            border: 1px solid #333;
            color: #333;
        }
    }
    .showCollapseClass {
        left: 242px;
    }
    .hideCollapseClass {
        left: 0;
    }
}
</style>
