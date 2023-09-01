<template>
    <div class="intelligence">
        <NavBar :resourceName="windowName"/>
        <win-preview
            ref="previewRef"
            :pages="pageList"
            :cards="cardList"
            :resource="{id:windowId}"
            v-model:index="index"
            v-model:r-visit="rVisit"
            v-model:l-visit="lVisit"
            v-model:mode="previewMode"
            v-model:isCanUndo="isCanUndo"
            v-model:isCanRedo="isCanRedo"
            style="height: calc(100% - 48px)"
            v-model:eraserLineWidth="eraserLineWidth"
            v-model:currentDrawColor="currentDrawColor"
            v-model:currentLineWidth="currentLineWidth"
        />
        <Tools
            :isOutLine="true"
            @redo="redo"
            @undo="undo"
            :dialog="false"
            :id="windowId"
            :showRemark="rVisit"
            @prevStep="prevStep"
            @nextStep="nextStep"
            :isCanUndo="isCanUndo"
            :isCanRedo="isCanRedo"
            @openShape="openShape"
            @fullScreen="fullScreen"
            @toggleRemark="toggleRemark"
            :currentSlide="currentSlide"
            @openPaintTool="openPaintTool"
            @handleMinSize="useMinimizeWindow"
            @clockFullScreen="clockFullScreen"
            :eraserLineWidth="eraserLineWidth"
            :currentDrawColor="currentDrawColor"
            :currentLineWidth="currentLineWidth"
            @whiteboardOption="whiteboardOption"
            :isFullScreenStatus="false"
            @closeWinCard="closeWinCard"
        />
    </div>
</template>

<script lang="ts">
import {store} from "@/store";
import NavBar from "./NavBar.vue";
import {ElMessage} from "element-plus";
import {set, STORAGE_TYPES} from "@/utils/storage";
import useMinimizeWindow from "@/hooks/useMinimizeWindow";
import {computed, defineComponent, onMounted, ref} from "vue";
import WinPreview from "@/views/preparation/intelligenceClassroom/preview/index.vue";
import Tools from "@/views/preparation/intelligenceClassroom/components/preview/tools.vue";
import {CardProps, PageProps} from "@/views/preparation/intelligenceClassroom/api/props";

export default defineComponent({
    components: {WinPreview, NavBar, Tools},
    setup() {
        const index = ref(0);
        const lVisit = ref(true);
        const rVisit = ref(false);
        const previewRef = ref();
        const previewMode = ref(true);
        const isCanUndo = ref(false);
        const isCanRedo = ref(false);
        const currentDrawColor = ref("#f60000");
        const currentLineWidth = ref(2);
        const eraserLineWidth = ref(30);
        // 默认开启缓存
        set(STORAGE_TYPES.SET_ISCACHE, true);
        const isFullScreen = ref(false);
        const cardListComponents = ref();
        const windowId = ref("");
        const windowName = ref("");
        const cardList = ref<CardProps[]>([]);
        const pageList = ref<PageProps[]>([]);

        const currentSlide = computed(() => pageList.value.filter(item => item.State)[index.value]?.Json);

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
            lVisit.value = false;
            rVisit.value = false;
        };
        const clockFullScreen = () => {
            lVisit.value = true;
            rVisit.value = false;
        };

        const toggleRemark = () => {
            rVisit.value = !rVisit.value;
            if (Number(store.state.common.resourceIntoType) === 1) {
                store.state.common.currentBeikeResource = rVisit.value;
            } else {
                store.state.common.currentKebiaoResource = rVisit.value;
            }
        };

        const prevStep = () => {
            previewRef.value.previewHandle({
                type: 7
            });
        };

        const nextStep = () => {
            previewRef.value.previewHandle({
                type: 6
            });
        };

        // 工具栏-形状
        const openShape = (event: MouseEvent) => {
            previewRef.value.previewHandle({
                type: 1,
                e: event
            });
        };

        // 工具栏-画笔
        const openPaintTool = (event: MouseEvent, type: string) => {
            previewRef.value.previewHandle({
                type: 2,
                e: event,
                option: type
            });
        };

        // 工具栏 画笔配置
        const whiteboardOption = (option: string, value?: number) => {
            previewRef.value.previewHandle({
                type: 3,
                option,
                value
            });
        };

        // 退回
        const redo = () => {
            previewRef.value.previewHandle({
                type: 4
            });
        };

        // 撤回
        const undo = () => {
            previewRef.value.previewHandle({
                type: 5
            });
        };

        const closeWinCard = () => {
            window.electron.remote.getCurrentWindow().close();
        };

        onMounted(async () => {
            const urlSearchParams = new URLSearchParams(window.location.search.replace(/\\&/g, "%26"));
            const params = Object.fromEntries(urlSearchParams.entries());
            const json = await window.electron.unpackCacheFile(params.file);
            if (!json) return;
            if (json.slides) {
                ElMessage.warning("请重新下载课件");
                return;
            }

            windowId.value = json.windowId;
            windowName.value = json.windowName;
            document.title = json.windowName;
            cardList.value = json.cards;
            console.log(json.pages);
            pageList.value = json.pages.filter((item: any) => item.State);
        });

        return {
            lastPage,
            firstPage,
            previewSectionRef,
            updateFlag,
            isFullScreen,
            fullScreen,
            clockFullScreen,
            toggleRemark,
            closeWinCard,
            prevStep,
            nextStep,
            openShape,
            cardListComponents,
            cardList,
            windowId,
            windowName,
            isCanUndo,
            isCanRedo,
            openPaintTool,
            currentDrawColor,
            currentLineWidth,
            eraserLineWidth,
            whiteboardOption,
            redo,
            undo,
            pageList,
            currentSlide,
            index,
            lVisit,
            rVisit,
            previewMode,
            previewRef,
            useMinimizeWindow
        };
    }
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

            > p {
                float: left;
            }

            > div {
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
                    border-radius: 0 8px 8px 0;
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
                min-width: 0;
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
