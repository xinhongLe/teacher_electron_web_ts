<template>
    <div class="intelligence">
        <NavBar :resourceName="WindowName" />
        <div class="right">
            <div class="right-bottom">
                <div class="card-box-left" :class="{
                    hidden: isFullScreen && !isShowCardList,
                }">
                    <div class="card-box-lefts">
                        <CardList ref="cardListComponents" :winActiveId="winActiveId" :WindowName="WindowName"
                            :cardList="cardList" @updatePageList="updatePageList" @updateFlag="updateFlag" />
                    </div>
                    <div class="card-box-outbottom" v-show="!isFullScreen || isShowCardList"></div>

                    <div class="fold-btn" v-show="isFullScreen" @click="isShowCardList = !isShowCardList">
                        <i :class="
                            isShowCardList
                                ? 'el-icon-arrow-left'
                                : 'el-icon-arrow-right'
                        "></i>
                    </div>
                </div>
                <div class="card-detail">
                    <div class="card-detail-content">
                        <PreviewSection ref="previewSectionRef" :options="previewOptions" :winActiveId="winActiveId"
                            :WindowName="WindowName" :winList="cardList" :isPreview="true" :isShowCardList="isShowCardList"
                            :isFullScreen="isFullScreen" @lastPage="lastPage" @firstPage="firstPage"
                            @changeWinSize="changeWinSize" @fullScreen="fullScreen" @clockFullScreen="clockFullScreen"
                            v-model:isCanUndo="isCanUndo" v-model:isCanRedo="isCanRedo"
                            v-model:currentDrawColor="currentDrawColor" v-model:currentLineWidth="currentLineWidth" />
                    </div>
                </div>
            </div>
        </div>
        <Tools :cardClass="'intelligence'" :id="winActiveId" :dialog="false" :showClose="true"
            :showRemark="previewSectionRef?.showRemark" @toggleRemark="toggleRemark" @prevStep="prevStep"
            @nextStep="nextStep" @fullScreen="fullScreen" @clockFullScreen="clockFullScreen"
            @showWriteBoard="showWriteBoard" @openShape="openShape" @hideWriteBoard="hideWriteBoard" @closeWincard="close"
            :isCanUndo="isCanUndo" :isCanRedo="isCanRedo" :isFullScreenStatus="true" @openPaintTool="openPaintTool"
            :currentDrawColor="currentDrawColor" :currentLineWidth="currentLineWidth" @whiteboardOption="whiteboardOption"
            @redo="redo" @undo="undo" />
    </div>
</template>

<script lang="ts">
import { defineComponent, nextTick, onMounted, provide, ref } from "vue";
import CardList from "./CardList.vue";
import PreviewSection from "./previewSection.vue";
import NavBar from "./NavBar.vue";
import Tools from "@/views/preparation/intelligenceClassroom/components/preview/tools.vue";
import { set, STORAGE_TYPES } from "@/utils/storage";
import useWindowInfo, { windowInfoKey } from "@/hooks/useWindowInfo";
export default defineComponent({
    components: {
        CardList,
        PreviewSection,
        NavBar,
        Tools,
    },
    setup() {
        const isCanUndo = ref(false);
        const isCanRedo = ref(false);
        // 默认开启缓存
        set(STORAGE_TYPES.SET_ISCACHE, true);
        const isFullScreen = ref(false);
        const isShowCardList = ref(true);
        const cardListComponents = ref();
        const winActiveId = ref("");
        const WindowName = ref("");
        const previewOptions = ref({});
        provide("isShowCardList", isShowCardList);
        const windowInfo = useWindowInfo(false);
        provide(windowInfoKey, windowInfo);
        const { cardList } = windowInfo;
        const appjson = ref<{
            cards?: any;
            pages?: any;
            slides?: any;
            windowId?: string;
            windowName?: string;
        }>({});
        provide("appjson", appjson);
        const updatePageList = (card: any) => {
            previewOptions.value = card;
        };

        const changeWinSize = () => { };

        const lastPage = () => {
            cardListComponents.value.changeReducePage();
        };
        const firstPage = () => {
            cardListComponents.value.changeAddPage();
        };
        const previewSectionRef = ref();
        const updateFlag = () => {
            previewSectionRef.value.updateFlag();
        };

        const fullScreen = () => {
            isFullScreen.value = true;
            isShowCardList.value = false;
            previewSectionRef.value && previewSectionRef.value.fullScreen();
        };
        const clockFullScreen = () => {
            isFullScreen.value = false;
            isShowCardList.value = true;
            previewSectionRef.value &&
                previewSectionRef.value.clockFullScreen();
        };

        const toggleRemark = () => {
            previewSectionRef.value && previewSectionRef.value.toggleRemark();
        };

        const prevStep = () => {
            previewSectionRef.value && previewSectionRef.value.prevStep();
        };

        const nextStep = () => {
            previewSectionRef.value && previewSectionRef.value.nextStep();
        };

        const showWriteBoard = () => {
            previewSectionRef.value && previewSectionRef.value.showWriteBoard();
        };

        const openShape = (event: MouseEvent) => {
            previewSectionRef.value && previewSectionRef.value.openShape(event);
        };

        const hideWriteBoard = () => {
            previewSectionRef.value && previewSectionRef.value.hideWriteBoard();
        };

        onMounted(async () => {
            const urlSearchParams = new URLSearchParams(
                window.location.search.replace(/\&/g, "%26")
            );
            const params = Object.fromEntries(urlSearchParams.entries());
            appjson.value = await window.electron.unpackCacheFile(params.file);
            if (appjson) {
                winActiveId.value = appjson.value.windowId!;
                WindowName.value = appjson.value.windowName!;
                appjson.value.cards.forEach((c: any) => {
                    c.PageList = c.PageList.filter(
                        (p: any) => p.State === true
                    );
                });
                console.log(appjson.value);
                cardList.value = appjson.value.cards;
                document.title = WindowName.value;
                await nextTick(() => {
                    cardListComponents.value.handleClick(0, cardList.value[0]);
                });
            }
        });

        const close = () => {
            window.electron.remote.getCurrentWindow().close();
        };
        //工具栏-画笔
        const openPaintTool = (event: MouseEvent, type: string) => {
            // console.log("previewSection.value", event, type);
            previewSectionRef.value &&
                previewSectionRef.value.openPaintTool(event, type);
        };
        const currentDrawColor = ref("#f60000");
        const currentLineWidth = ref(2);

        // 工具栏 画笔配置
        const whiteboardOption = (option: string, value?: number) => {
            previewSectionRef.value && previewSectionRef.value.whiteboardOption(option, value);
        };
        // 退回
        const redo = () => {
            previewSectionRef.value && previewSectionRef.value.redo();
        };
        // 撤回
        const undo = () => {
            previewSectionRef.value && previewSectionRef.value.undo();
        };

        return {
            lastPage,
            firstPage,
            previewSectionRef,
            updateFlag,
            updatePageList,
            changeWinSize,
            isFullScreen,
            fullScreen,
            isShowCardList,
            clockFullScreen,
            toggleRemark,
            prevStep,
            nextStep,
            showWriteBoard,
            openShape,
            hideWriteBoard,
            cardListComponents,
            cardList,
            previewOptions,
            winActiveId,
            WindowName,
            close,
            isCanUndo,
            isCanRedo,
            openPaintTool,
            currentDrawColor,
            currentLineWidth,
            whiteboardOption,
            redo,
            undo
        };
    },
});
</script>

<style lang="scss" scoped>
$border-color: #f5f6fa;

.intelligence {
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    min-height: 0;
    background-color: #f5f6fa;

    .right {
        display: flex;
        justify-content: space-between;
        flex: 1;
        min-height: 0;
        background-color: #fff;

        .right-top {
            height: 80px;
            line-height: 80px;
            border-bottom: 1px solid $border-color;
            text-align: center;
            padding: 0 20px;

            >p {
                float: left;
            }

            >div {
                cursor: pointer;
            }
        }

        .right-bottom {
            position: relative;
            display: flex;
            flex: 1;
            min-width: 0;
            justify-content: space-between;

            .card-box-away {
                position: absolute;
                top: calc(50% - 60px);
                left: -20px;
                width: 20px;
                height: 120px;
                background: #fff;
                display: flex;
                align-items: center;
                font-size: 20px;
            }

            .card-box-left {
                // position: relative;
                // height: 100%;
                // overflow-y: auto;
                width: 180px;
                text-align: center;
                padding: 20px 0 0 0;
                box-sizing: border-box;
                display: flex;
                min-width: 0;
                min-height: 0;
                flex-direction: column;
                background: #fff;
                transition: width 0.3s;
                position: relative;
                border-right: 1px solid #eee;

                // &.fullScreen {
                //     background: #f5f6fa;
                //     position: fixed;
                //     left: 0;
                //     top: 0;
                //     height: calc(100% - 84px);
                //     transition: width 0.3s;
                // }
                &.hidden {
                    width: 0;
                }

                .fold-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: absolute;
                    top: 50%;
                    transform: translateX(100%) translateY(-50%);
                    right: 0;
                    height: 104px;
                    width: 18px;
                    border-radius: 0px 8px 8px 0px;
                    background: #f5f6fa;
                    cursor: pointer;
                    z-index: 1;

                    i {
                        color: #7e7f83;
                        font-size: 18px;
                        font-weight: 700;
                    }
                }
            }

            .card-box-lefts {
                display: flex;
                flex: 1;
                min-width: 0px;
                min-height: 0;
                overflow-y: auto;
                margin-bottom: 20px;
            }

            .card-box-outbottom {
                width: calc(100% + 1px);
                height: 87px;
                background: #fff;
            }

            .card-detail {
                flex: 1;
                min-width: 0;
                display: flex;
                flex-direction: column;
                justify-content: space-between;

                .card-detail-content {
                    height: 100%;
                    display: flex;
                    flex: 1;
                    min-width: 0;
                    justify-content: space-between;
                }

                .me-page {
                    background-color: #fff;
                    display: flex;
                    flex-wrap: nowrap;
                    padding: 15px;
                    background-color: #fff;
                    border-top: 1px solid #ccc;

                    .me-page-item {
                        background-color: #f0f3ff;
                        color: #444;
                        padding: 10px 20px;
                        box-sizing: border-box;
                        text-align: center;
                        min-width: 100px;
                        font-size: 14px;
                        white-space: nowrap;
                        margin-right: 10px;
                        border: 2px solid #f0f3ff;
                        cursor: pointer;
                        position: relative;

                        &.active {
                            border: 2px solid #6675f4;
                        }
                    }
                }
            }
        }
    }
}
</style>
