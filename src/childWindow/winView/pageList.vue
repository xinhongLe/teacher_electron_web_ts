<template>
    <div class="pageListComponents">
        <div class="me-work" :class=" fullscreenStyle ? 'fullscreen' : ''"  :style="{width: width, left: isShowCardList ? '180px' : '0'}">
                <ScreenView
                class="me-work-screen"
                :inline="true"
                :isInit="isInitPage"
                ref="screenRef"
                :slide="page"
                :writeBoardVisible="writeBoardVisible"
                :keyDisabled="keyDisabled"
                :useScale="false"
                :winList="winList"
                @openCard="openCard"
                @pagePrev="pagePrev"
                @pageNext="pageNext"
                @closeWriteBoard="closeWriteBoard"
            />
            <open-card-view-dialog @closeOpenCard="closeOpenCard" v-if="dialogVisible" :cardList="cardList" v-model:dialogVisible="dialogVisible"></open-card-view-dialog>
            <div
                class="me-page"
            >
                <!-- :style="{ paddingBottom: hasCheck ? '40px' : '15px' }" -->
                <div
                    class="me-page-item"
                    :class="selected === index && 'active'"
                    v-for="(item, index) in pageList"
                    :key="index"
                    @click="selectPage(index,item)"
                >
                    {{ (item as any).Name }}
                    <div
                        class="page-checkbox"
                        v-if="hasCheck"
                        @click.stop="() => null"
                    >
                        <el-checkbox v-model="(item as any).isChecked"></el-checkbox>
                    </div>
                </div>
            </div>
            <div class="fold-btn" v-show="fullscreenStyle" @click="isShowCardList = !isShowCardList">
                <i :class="isShowCardList ? 'el-icon-arrow-left': 'el-icon-arrow-right'"></i>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject, ref, watch } from "vue";
import TrackService, { EnumTrackEventType } from "@/utils/common";
import pageListServer from "../../views/preparation/intelligenceClassroom/hooks/pageList";
import OpenCardViewDialog from "./openCardViewDialog.vue";
export default defineComponent({
    props: ["pageListOption", "showRemark", "WinActiveId", "WindowName", "LessonID", "CardName", "CardId", "winList"],
    components: { OpenCardViewDialog },
    setup(props, { emit }) {
        const pageList = ref([]);
        const page = ref({});
        const { hasCheck, selected } = pageListServer();
        const dialogVisible = ref(false);
        const prevPageFlag = ref(false);
        const showRemarks = ref(false);
        const keyDisabled = ref(false);
        const WinActiveId = computed(() => props.WinActiveId);
        const WindowName = computed(() => props.WindowName);
        const LessonID = computed(() => props.LessonID);
        const CardName = computed(() => props.CardName);
        const CardId = computed(() => props.CardId);
        const isShowCardList = inject("isShowCardList");
        const appjson: any = inject("appjson");
        const width = computed(() => {
            let width = "100%";
            if (showRemarks.value && (isShowCardList as any).value) {
                width = "calc(100% - 22rem - 180px)";
            } else if (showRemarks.value) {
                width = "calc(100% - 22rem)";
            } else if ((isShowCardList as any).value) {
                width = "calc(100% - 180px)";
            }
            return width;
        });
        watch(
            () => props.showRemark,
            () => {
                showRemarks.value = props.showRemark;
            }
        );
        watch(
            () => dialogVisible.value,
            () => {
                if (!dialogVisible.value) {
                    keyDisabled.value = false;
                }
                emit("update:hideTool", dialogVisible.value);
            }
        );
        watch(
            () => props.pageListOption,
            () => {
                if (prevPageFlag.value === true) {
                    prevPageFlag.value = false;
                    pageList.value = props.pageListOption;
                    selected.value = props.pageListOption.length - 1;
                    pageNextEnd();
                } else {
                    pageList.value = props.pageListOption;
                    selected.value = -1;
                    pageNext();
                }
            }
        );
        const writeBoardVisible = ref(false);
        const selectPage = (index: number, item: any) => {
            selected.value = index;
            const DataContext = {
                Type: EnumTrackEventType.SelectPage,
                LessonID: LessonID.value
            };
            getDataBase((pageList.value[index] as any).ID, pageList.value[index]);
            TrackService.setTrack(EnumTrackEventType.SelectPage, WinActiveId.value, WindowName.value, CardId.value, CardName.value, item.ID, item.Name, "选择页", JSON.stringify(DataContext), item.ID);
            emit("changeRemark", (pageList.value[index] as any).Remark || "");
        };
        const getDataBase = async (str: string, obj: any) => {
            if (appjson.value.slides) {
                page.value = appjson.value.slides.find((p: any) => p.id === str);
            }
        };
        const screenRef = ref();
        const isInitPage = ref(true);
        const prevCard = () => {
            isInitPage.value = false;
            screenRef.value.execPrev();
        };
        const showWriteBoard = () => {
            writeBoardVisible.value = true;
        };
        const hideWriteBoard = () => {
            writeBoardVisible.value = false;
        };
        const closeWriteBoard = () => {
            writeBoardVisible.value = false;
        };
        const openShape = (event: any) => {
            screenRef.value.openShape(event);
        };
        const pagePrev = async () => {
            if (selected.value > 0) {
                selected.value--;
                isInitPage.value = false;
                emit("changeRemark", (pageList.value[selected.value] as any).Remark);
                getDataBase((pageList.value[selected.value] as any).ID, pageList.value[selected.value]);
                return;
            }
            if (selected.value === 0) {
                isInitPage.value = false;
                prevPageFlag.value = true;
                emit("firstPage");
            }
        };

        const nextCard = () => {
            isInitPage.value = true;
            screenRef.value.execNext();
        };

        const pageNext = async () => {
            if (pageList.value.length === 0) {
                page.value = {};
            }
            if (selected.value === pageList.value.length - 1) {
                isInitPage.value = true;
                emit("lastPage");
            } else {
                selected.value++;
                isInitPage.value = true;
                const DataContext = {
                    Type: EnumTrackEventType.SelectPage,
                    LessonID: LessonID.value
                };
                TrackService.setTrack(EnumTrackEventType.SelectPage, WinActiveId.value, WindowName.value, CardId.value, CardName.value, 
                    (pageList.value[selected.value] as any).ID, (pageList.value[selected.value] as any).Name, "选择页", JSON.stringify(DataContext), (pageList.value[selected.value] as any).ID);
                emit("changeRemark", (pageList.value[selected.value] as any).Remark);
                getDataBase((pageList.value[selected.value] as any).ID, pageList.value[selected.value]);
            }
        };
        const updateFlags = () => {
            prevPageFlag.value = false;
        };
        const pageNextEnd = async () => {
            if (pageList.value.length > 0) {
                emit("changeRemark", (pageList.value[selected.value] as any).Remark);
                getDataBase((pageList.value[selected.value] as any).ID, pageList.value[selected.value]);
            } else {
                emit("changeRemark", " ");
                page.value = [];
            }
        };
        const fullscreenStyle = ref(false);
        const fullScreen = () => {
            emit("changeWinSize"); // 切换窗口大小，清除缓存的笔记列表
            fullscreenStyle.value = true;
        };
        const clockFullScreen = () => {
            emit("changeWinSize");
            fullscreenStyle.value = false;
        };
        const cardList: any = ref([]);
        const openCard = async (wins: any) => {
            if (wins[0] && wins[0].cards) {
                keyDisabled.value = true;
                const cards = wins[0].cards;
                let pages: Array<any> = [];
                cards.map((card: any) => {
                    pages = pages.concat(card.slides.map((page: any) => {
                        return {
                            ID: page.id,
                            Type: page.type,
                            Name: page.name,
                            OriginType: card.type
                        };
                    }));
                });
                if (pages.length > 0) {
                    cardList.value = pages;
                    dialogVisible.value = true;
                }
            }
        };
        const closeOpenCard = () => {
            dialogVisible.value = false;
            keyDisabled.value = false;
        };
        return {
            screenRef,
            isInitPage,
            page,
            hasCheck,
            selected,
            pageList,
            dialogVisible,
            cardList,
            showRemarks,
            keyDisabled,
            writeBoardVisible,
            openCard,
            prevCard,
            pagePrev,
            selectPage,
            nextCard,
            fullScreen,
            fullscreenStyle,
            pageNext,
            clockFullScreen,
            updateFlags,
            isShowCardList,
            closeOpenCard,
            showWriteBoard,
            hideWriteBoard,
            width,
            openShape,
            closeWriteBoard
        };
    }
});
</script>

<style lang="scss" scoped>
.pageListComponents{
    :deep(.el-overlay){
        z-index: 9999 !important;
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
    }
}
.pageListComponents{
    display: flex;
    flex: 1;
    min-width: 0;
    ::v-deep .slide-list{
        background-color: #fff;
    }
}
.fullscreen{
    position: fixed;
    top: 0;
    left: 0;
    width: calc(100% - 22rem);
    height: calc(100% - 84px);
    transition-property: left, width;
    transition-duration: 0.3s;
}
.me-work {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    .fold-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: 0;
        height: 104px;
        width: 18px;
        border-radius: 0px 8px 8px 0px;
        background: #F5F6FA;
        cursor: pointer;
        i {
            color: #7E7F83;
            font-size: 18px;
            font-weight: 700;
        }
    }
}
.me-work-screen {
    width: 100%;
    height: 100%;
}
.me-page {
    min-width: 0;
    background-color: #fff;
    display: flex;
    flex-wrap: nowrap;
    padding: 15px;
    background-color: #fff;
    overflow-y: hidden;
    overflow-x: auto;
}

.me-page-item {
    background-color: #f0f3ff;
    color: #5560f1;
    padding: 0px 10px;
    box-sizing: border-box;
    text-align: center;
    height: 32px;
    display: flex;
    align-items: center;
    // min-width: 100px;
    font-size: 16px;
    white-space: nowrap;
    margin-right: 10px;
    border: 1px solid #f0f3ff;
    border-radius: 5px;
    cursor: pointer;
    position: relative;
}

.me-page-item.active {
    border: 2px solid #6675f4;
}

.page-checkbox {
    position: absolute;
    bottom: -30px;
    left: 50%;
    transform: translateX(-50%);
}
</style>
