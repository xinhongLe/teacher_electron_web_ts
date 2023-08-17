<template>
    <div
        class="container"
        @click="
            isShowBroadList = false;
            isShowHistoryBroadList = false;
        "
    >
        <div class="canvas-warp" ref="boxRef" id="canvaswarp">
            <canvas ref="canvasRef"></canvas>
            <div
                class="move"
                v-show="ActiveType.Move === activeType"
                @mousedown="mousedown"
                @mousemove="mousemove"
                @mouseup="mouseup"
                @touchstart="touchStart"
                @touchmove="touchMove"
                @touchend="mouseup"
            />
            <transition name="fade">
                <BoardList
                    v-if="isShowBroadList"
                    v-model:pageIndex="pageIndex"
                    :boardList="storageCanvasData"
                    v-model:isShowBroadList="isShowBroadList"
                    @createBroad="createBroad"
                    @deleteBoard="deleteBoard"
                />
            </transition>
            <transition name="fade">
                <BoardHistoryList
                    v-show="isShowHistoryBroadList"
                    v-model:isShowHistoryBroadList="isShowHistoryBroadList"
                />
            </transition>
            <!--            <div>-->
            <!--                <img src="./ico/view.jpg" alt="">-->
            <!--            </div>-->
        </div>
        <div class="btn-bar">
            <div
                class="btn"
                :class="{ disabled: disabledUndoBtn }"
                @click="undoClick"
            >
                <img
                    src="./ico/icon_chexiao_disabled.png"
                    alt=""
                    v-if="disabledUndoBtn"
                />
                <img src="./ico/icon_chexiao.png" alt="" v-else/>
                <span>撤销</span>
            </div>
            <div
                class="btn"
                :class="{ disabled: disabledRecoverBtn }"
                @click="recoverClick"
            >
                <img
                    src="./ico/icon_huifu_disabled.png"
                    alt=""
                    v-if="disabledRecoverBtn"
                />
                <img src="./ico/icon_huifu.png" alt="" v-else/>
                <span>恢复</span>
            </div>
            <div
                class="btn"
                :class="{ active: ActiveType.Move === activeType }"
                @click="moveClick"
            >
                <img
                    src="./ico/icon_moveto_selected.png"
                    alt=""
                    v-if="ActiveType.Move === activeType"
                />
                <img src="./ico/icon_moveto.png" alt="" v-else/>
                <span>移动</span>
            </div>
            <div
                class="btn"
                :class="{ active: ActiveType.Choose === activeType }"
                @click="chooseClick"
            >
                <img
                    src="./ico/icon_choose_selected.png"
                    alt=""
                    v-if="ActiveType.Choose === activeType"
                />
                <img src="./ico/icon_choose.png" alt="" v-else/>
                <span>选择</span>
            </div>
            <el-popover
                trigger="click"
                placement="top"
                :style="{ background: 'rgb(40, 40, 40)' }"
                popper-class="brushPopup"
                width="240px"
            >
                <div>
                    <div class="color-box">
                        <span>画笔颜色：</span>
                        <ul class="color-list">
                            <li
                                :style="{ backgroundColor: PenColorMap.White }"
                                :class="{
                                    active: penColor === PenColorMap.White,
                                }"
                                @click="changeStrokeStyle(PenColorMap.White)"
                            ></li>
                            <li
                                :style="{ backgroundColor: PenColorMap.Black }"
                                :class="{
                                    active: penColor === PenColorMap.Black,
                                }"
                                @click="changeStrokeStyle(PenColorMap.Black)"
                            ></li>
                            <li
                                :style="{ backgroundColor: PenColorMap.Red }"
                                :class="{
                                    active: penColor === PenColorMap.Red,
                                }"
                                @click="changeStrokeStyle(PenColorMap.Red)"
                            ></li>
                            <li
                                :style="{ backgroundColor: PenColorMap.Orange }"
                                :class="{
                                    active: penColor === PenColorMap.Orange,
                                }"
                                @click="changeStrokeStyle(PenColorMap.Orange)"
                            ></li>
                            <li
                                :style="{ backgroundColor: PenColorMap.Blue }"
                                :class="{
                                    active: penColor === PenColorMap.Blue,
                                }"
                                @click="changeStrokeStyle(PenColorMap.Blue)"
                            ></li>
                        </ul>
                    </div>
                    <div class="size-box">
                        <span>画笔大小：</span>
                        <ul class="sizes-list">
                            <li
                                class="small"
                                :class="{ active: penSize === 2 }"
                                @click="changeLineWidth(2)"
                            ></li>
                            <li
                                class="medium"
                                :class="{ active: penSize === 6 }"
                                @click="changeLineWidth(6)"
                            ></li>
                            <li
                                class="max"
                                :class="{ active: penSize === 10 }"
                                @click="changeLineWidth(10)"
                            ></li>
                        </ul>
                    </div>
                </div>
                <template #reference>
                    <div
                        class="btn"
                        :class="{ active: ActiveType.Brush === activeType }"
                        @click="brushClick"
                    >
                        <img
                            src="./ico/icon_brush_selected.png"
                            alt=""
                            v-if="ActiveType.Brush === activeType"
                        />
                        <img src="./ico/icon_brush.png" alt="" v-else/>
                        <span class="active"
                        >画笔
                            <img
                                id="brush_Du"
                                class="ico_Du"
                                src="./ico/arrow_down.png"
                                alt=""
                            /></span>
                    </div>
                </template>
            </el-popover>

            <div
                class="btn"
                :class="{ active: ActiveType.Eraser === activeType }"
                @click="eraserClick"
            >
                <img
                    id="eraserImg"
                    src="./ico/icon_eraser_selected.png"
                    alt=""
                    v-if="ActiveType.Eraser === activeType"
                />
                <img id="eraserImg" src="./ico/icon_eraser.png" alt="" v-else/>
                <span id="eraser">橡皮</span>
            </div>

            <div class="btn" @click="clearClick">
                <img id="eraserImg" src="./ico/icon_qingchu.png" alt=""/>
                <span id="eraser">清除</span>
            </div>
            <div
                class="btn-container history"
                @click.stop="isShowHistoryBroadList = true;isShowBroadList = false"
            >
                <div class="btn-warp" @click="prevPage">
                    <img
                        id="arrowLast"
                        src="./ico/icon_lishi_rest@2x.png"
                        alt=""
                    />
                    <span class="text">历史黑板1</span>
                </div>
            </div>
            <div class="btn-container">
                <div class="btn-warp" @click="prevPage">
                    <img
                        id="arrowLast"
                        src="./ico/arrow_last_disabled.png"
                        alt=""
                        v-if="disabledPrevPage"
                    />
                    <img
                        id="arrowLast"
                        src="./ico/arrow_last.png"
                        alt=""
                        v-else
                    />
                    <span class="text">上一页</span>
                </div>
                <div class="btn-warp" @click.stop="showBoardList">
                    <div class="page-number">{{ pageIndex + 1 }}</div>
                    <span class="text">页码</span>
                </div>
                <div class="btn-warp" @click="nextPage">
                    <img
                        id="arrowNext"
                        src="./ico/arrow_next_disabled.png"
                        alt=""
                        v-if="disabledNextPage"
                    />
                    <img
                        id="arrowNext"
                        src="./ico/arrow_next.png"
                        alt=""
                        v-else
                    />
                    <span class="text">下一页</span>
                </div>
                <div class="btn-warp page-add" @click="addPage">
                    <img id="addBtn" src="./ico/icon_add.png" alt=""/>
                    <span class="text">加页</span>
                </div>
            </div>
            <div class="btn-container change-board">
                <div class="btn-warp" @click="changeBoard">
                    <img src="./ico/icon_qiehuan.png" alt="" v-if="isBlack"/>
                    <img src="./ico/icon_qiehuan_selected.png" alt="" v-else/>
                    <span class="text">{{
                            isBlack ? "切换白板" : "切换黑板"
                        }}</span>
                </div>
                <div class="btn-warp" @click="changeTianZiOrLineGrid">
                    <img src="./ico/icon_qiehuan.png" alt="" v-if="!isTzOrLine || isTzOrLine === 'TZ'"/>
                    <img src="./ico/icon_qiehuan_selected.png" alt="" v-else/>
                    <span class="text">{{
                            (isTzOrLine === "TZ" || !isTzOrLine) ? "田字格" : "四线格"
                        }}</span>
                </div>
            </div>
            <div class="btn-container">
                <div class="btn-warp" @click="smallClick">
                    <img src="./ico/btn_zuixiaohua.png" alt=""/>
                    <span class="text">最小化</span>
                </div>
                <div class="btn-warp" @click="closeClick">
                    <img src="./ico/close.png" alt=""/>
                    <span class="text">关闭</span>
                </div>
                <div class="btn-warp" @click="fillScreen" v-if="fullFlag">
                    <img src="./ico/off_screen.png" alt=""/>
                    <span class="text">退出全屏</span>
                </div>
                <div class="btn-warp" @click="fullScreen" v-else>
                    <img src="./ico/full_screen.png" alt=""/>
                    <span class="text">全屏</span>
                </div>

            </div>
        </div>
        <CloseDialog v-if="isShowCloseDialog" v-model:isShowCloseDialog="isShowCloseDialog"
                     @saveBoardList="saveBoardList"/>
    </div>
</template>

<script lang="ts">
import {computed, defineComponent, nextTick, onMounted, ref, watch} from "vue";
import BoardList from "./boardList.vue";
import BoardHistoryList from "./boardHistoryList.vue";
import useUploadFile from "@/hooks/useUploadFile";
import {BlackboardFile, submitBlackboardHistory} from "./api";
import CloseDialog from "./closeDialog.vue";
import useMove from "./hooks/useMove";
import usePen from "./hooks/usePen";
import useErase from "./hooks/useErase";
import usePage from "./hooks/usePage";
import useUndoOrRecover from "./hooks/useUndoOrRecover";
import useClear from "./hooks/useClear";
import {ActiveType, PenColorMap} from "./enum";
import {enterFullscreen, exitFullscreen, isFullscreen} from "@/utils/fullscreen";

export default defineComponent({
    setup() {
        const fullFlag = ref(false);
        const canvasRef = ref<HTMLCanvasElement>();
        const fabCanvas = ref();
        const boxRef = ref<HTMLDivElement>();
        const isShowBroadList = ref(false);
        const activeType = ref(ActiveType.Brush);
        const isBlack = ref(true);
        const blackColor = "#0C3E31";
        const whiteColor = "#F5F6FA";
        const isTzOrLine = ref("");
        const isShowHistoryBroadList = ref(false);
        const {uploadFile} = useUploadFile("TeacherBlackboardFile");
        const isShowCloseDialog = ref(false);
        const {clear, clearClick} = useClear(fabCanvas, blackColor);
        const {mousedown, mousemove, mouseup, touchStart, touchMove} = useMove(fabCanvas);
        const {
            penColor,
            penSize,
            selectPenMode,
            brushClick,
            changeLineWidth,
            changeStrokeStyle
        } = usePen(fabCanvas, activeType);
        const {eraserClick} = useErase(fabCanvas, activeType);
        const {
            prevPage,
            nextPage,
            pageIndex,
            storageCanvasData,
            disabledNextPage,
            disabledPrevPage,
            saveCurrentCanvasData,
            addPage,
            createBroad,
            deleteBoard
        } = usePage(fabCanvas, clear);
        const {undoClick, recoverClick, isAction, deleteState, currentState} = useUndoOrRecover(fabCanvas, clear);

        function init() {
            fabCanvas.value = new window.fabric.Canvas(canvasRef.value, {
                backgroundColor: blackColor,
                width: Number(boxRef.value?.offsetWidth),
                height: Number(boxRef.value?.offsetHeight),
                // width:100%,
                // height:100%
            });
            // 禁止橡皮擦除背景色
            fabCanvas.value.get("backgroundColor").set({erasable: false});
            fabCanvas.value.freeDrawingBrush.width = 2;
            selectPenMode();
        }

        const moveClick = () => {
            activeType.value = ActiveType.Move;
        };
        const chooseClick = () => {
            activeType.value = ActiveType.Choose;
            fabCanvas.value.isDrawingMode = false;
        };

        const showBoardList = () => {
            saveCurrentCanvasData();
            isShowBroadList.value = true;
            isShowHistoryBroadList.value = false;
        };

        // 切换田字格/四线格
        const changeTianZiOrLineGrid = () => {
            // isTzOrLine.value = !isTzOrLine.value ? "TZ" : isTzOrLine.value === "TZ" ? "LINE" : "TZ";

            if (!isTzOrLine.value || isTzOrLine.value === "TZ") {
                boxRef.value!.style.backgroundImage = "url(" + require("./ico/view.jpg") + ")";
                isTzOrLine.value = "LINE"
            } else {
                boxRef.value!.style.backgroundImage = "url(" + require("./ico/line.jpg") + ")";
                isTzOrLine.value = "TZ"

            }
            fabCanvas.value.setBackgroundColor(
                "transparent"
            );
            fabCanvas.value.get("backgroundColor").set({erasable: false});
            fabCanvas.value.renderAll();
            penColor.value = PenColorMap.Black;
        }

        const changeBoard = () => {
            console.log('fabCanvas.value', fabCanvas.value)
            fabCanvas.value.setBackgroundColor(
                isBlack.value ? whiteColor : blackColor
            );
            fabCanvas.value.get("backgroundColor").set({erasable: false});
            fabCanvas.value.renderAll();
            isBlack.value = !isBlack.value;
            console.log('isBlack.value', isBlack.value, penColor.value)
            if (!isBlack.value && penColor.value === PenColorMap.White) {
                penColor.value = PenColorMap.Black;
            } else {
                penColor.value = PenColorMap.White;

            }
            // if (!isBlack.value && penColor.value === PenColorMap.White) {
            //     penColor.value = PenColorMap.Black;
            // }
        };

        const smallClick = () => {
            window.electron.ipcRenderer.send("smallBlackboard");
        };

        const saveBoardList = async () => {
            saveCurrentCanvasData();

            const fileInfoList = await Promise.all(storageCanvasData.value.map((item, index) => {
                const base64Data = item.img.replace(/^data:image\/\w+;base64,/, "");
                return uploadFile({file: new File([Buffer.from(base64Data, "base64")], `${index}.png`)});
            }));

            const blackboardFiles = fileInfoList.map(file => ({
                name: file.name,
                mD5: file.md5,
                ossExtention: file.fileExtension,
                bucketName: file.bucket,
                ossName: file.name
            })) as BlackboardFile[];

            await submitBlackboardHistory({
                blackboardFiles
            });
            window.electron.destroyWindow();
        };

        const closeClick = () => {
            isShowCloseDialog.value = true;
        };

        onMounted(() => {
            init();
            fabCanvas.value.on("object:added", function (e: any) {
                console.log('123')
                if (isAction.value) {
                    return;
                }
                deleteState.value = [];
                const json = fabCanvas.value.toDatalessJSON(["clipPath"]);
                currentState.value.push(JSON.stringify(json));
            });
            fabCanvas.value.on("object:modified", function (e: any) {
                if (isAction.value) {
                    return;
                }
                deleteState.value = [];
                const json = fabCanvas.value.toDatalessJSON(["clipPath"]);
                currentState.value.push(JSON.stringify(json));
            });
            window.addEventListener("resize", () => {
                // init();
                nextTick(() => {
                    fabCanvas.value.setDimensions({
                        width: boxRef.value?.offsetWidth,
                        height: boxRef.value?.offsetHeight,
                    });
                    fabCanvas.value.get("backgroundColor").set({
                        width: boxRef.value?.offsetWidth,
                        height: boxRef.value?.offsetHeight,
                    })
                })
            });
        });
        watch(pageIndex, (v) => {
            deleteState.value = [];
            currentState.value = [];
            fabCanvas.value.loadFromJSON(storageCanvasData.value[v].data).renderAll();
        });
        // 全屏
        const fullScreen = () => {
            enterFullscreen();
            fullFlag.value = true;
        };
        // 退出全屏
        const fillScreen = () => {
            exitFullscreen();
            fullFlag.value = false;
        };
        return {
            isBlack,
            canvasRef,
            undoClick,
            recoverClick,
            activeType,
            ActiveType,
            moveClick,
            mousedown,
            mousemove,
            mouseup,
            chooseClick,
            brushClick,
            penColor,
            boxRef,
            penSize,
            changeStrokeStyle,
            changeLineWidth,
            eraserClick,
            clearClick,
            pageIndex,
            addPage,
            prevPage,
            nextPage,
            showBoardList,
            createBroad,
            deleteBoard,
            isShowBroadList,
            disabledPrevPage,
            disabledNextPage,
            saveBoardList,
            storageCanvasData,
            changeBoard,
            smallClick,
            closeClick,
            isShowCloseDialog,
            isShowHistoryBroadList,
            PenColorMap,
            touchStart,
            touchMove,
            disabledRecoverBtn: computed(() => deleteState.value.length === 0),
            disabledUndoBtn: computed(() => currentState.value.length === 0),
            fullFlag,
            fullScreen,
            fillScreen,
            enterFullscreen,
            exitFullscreen,
            changeTianZiOrLineGrid,
            isTzOrLine
        };
    },
    components: {BoardList, BoardHistoryList, CloseDialog}
});
</script>

<style lang="scss" scoped>
.container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    * {
        -webkit-user-drag: none;
    }

    .fade-enter-active,
    .fade-leave-active {
        transition: width 0.3s ease;
    }

    .fade-enter-from,
    .fade-leave-to {
        width: 0;
    }

    .canvas-warp {
        position: relative;
        flex: 1;
        width: 100%;
        height: calc(100% - 60px);
        background-image: url("~@/childWindow/blackboard/ico/view.jpg");
        //background-image: url("~@/childWindow/blackboard/ico/line.jpg");


        background-size: contain;

        canvas {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }
    }

    * {
        user-select: none;
    }

    .move {
        position: absolute;
        z-index: 10;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }

    .btn-bar {
        -webkit-app-region: drag;
        width: 100%;
        height: 92px;
        background: black;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .btn {
            -webkit-app-region: no-drag;
            width: 84px;
            display: flex;
            flex-direction: column;
            align-items: center;
            color: #fff;
            font-size: 16px;
            height: 76px;
            justify-content: space-around;
            cursor: pointer;

            &.disabled {
                color: #999;
            }

            &.active {
                border-radius: 4px;
                background: rgba(255, 255, 255, 0.1);
                color: rgb(48, 235, 194);

                img.ico_Du {
                    transform: rotate(180deg);
                }
            }

            img {
                width: 40px;

                &.ico_Du {
                    width: 8px;
                    height: 8px;
                }
            }

            span {
                white-space: nowrap;
            }
        }

        .btn-container {
            -webkit-app-region: no-drag;
            background: rgba(255, 255, 255, 0.08);
            display: flex;
            padding: 0 30px;
            align-items: center;
            height: 100%;
            margin-left: 40px;

            &.change-board,
            &.history {
                padding: 0 22px;
            }

            .btn-warp {
                display: flex;
                flex-direction: column;
                align-items: center;
                margin-right: 24px;
                font-size: 16px;
                font-weight: 400;
                color: #ffffff;
                cursor: pointer;

                .page-number {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 28px;
                    height: 28px;
                    border-radius: 4px;
                    border: 2px solid #ffffff;
                    font-size: 14px;
                }

                img {
                    width: 28px;
                }

                .text {
                    margin-top: 5px;
                }

                &.page-add {
                    margin-right: 0;
                    margin-left: 40px;
                }

                &:last-child {
                    margin-right: 0;
                }

                span {
                    white-space: nowrap;
                }
            }
        }
    }

    /* 在小屏幕上调整字体和图片大小 */
    @media (max-width: 1350px) {
        .btn-bar {
            height: 60px;

            .btn {
                font-size: 12px;
                height: 60px;

                img {
                    width: 26px;

                    &.ico_Du {
                        width: 4px;
                        height: 4px;
                    }
                }
            }

            .btn-container {
                margin-left: 20px;
                padding: 0 20px;

                &.change-board,
                &.history {
                    padding: 0 10px;
                }

                .btn-warp {
                    font-size: 12px;

                    img {
                        width: 22px;
                    }

                    .page-number {
                        idth: 22px;
                        height: 22px;
                        font-size: 12px;
                    }

                    &.page-add {
                        margin-right: 0;
                        margin-left: 10px;
                    }
                }
            }
        }
    }
}
</style>
