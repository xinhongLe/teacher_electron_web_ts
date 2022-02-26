<template>
    <div
        class="container"
        @click="
            isShowBroadList = false;
            isShowHistoryBroadList = false;
        "
    >
        <div class="canvas-warp" ref="boxRef">
            <canvas ref="canvasRef"></canvas>
            <div
                class="move"
                v-show="ActiveType.Move === activeType"
                @mousedown="mousedown"
                @mousemove="mousemove"
                @mouseup="mouseup"
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
                <img src="./ico/icon_chexiao.png" alt="" v-else />
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
                <img src="./ico/icon_huifu.png" alt="" v-else />
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
                <img src="./ico/icon_moveto.png" alt="" v-else />
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
                <img src="./ico/icon_choose.png" alt="" v-else />
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
                        <img src="./ico/icon_brush.png" alt="" v-else />
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
                <img id="eraserImg" src="./ico/icon_eraser.png" alt="" v-else />
                <span id="eraser">橡皮</span>
            </div>

            <div class="btn" @click="clearClick">
                <img id="eraserImg" src="./ico/icon_qingchu.png" alt="" />
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
                    <span class="text">历史黑板</span>
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
                    <img id="addBtn" src="./ico/icon_add.png" alt="" />
                    <span class="text">加页</span>
                </div>
            </div>
            <div class="btn-container change-board">
                <div class="btn-warp" @click="changeBoard">
                    <img src="./ico/icon_qiehuan.png" alt="" v-if="isBlack" />
                    <img src="./ico/icon_qiehuan_selected.png" alt="" v-else />
                    <span class="text">{{
                        isBlack ? "切换白板" : "切换黑板"
                    }}</span>
                </div>
            </div>
            <div class="btn-container">
                <div class="btn-warp" @click="smallClick">
                    <img src="./ico/btn_zuixiaohua.png" alt="" />
                    <span class="text">最小化</span>
                </div>
                <div class="btn-warp" @click="closeClick">
                    <img src="./ico/close.png" alt="" />
                    <span class="text">关闭</span>
                </div>
            </div>
        </div>
        <CloseDialog v-if="isShowCloseDialog" v-model:isShowCloseDialog="isShowCloseDialog" @saveBoardList="saveBoardList"/>
    </div>
</template>

<script lang="ts">
import { ElMessageBox } from "element-plus";
import { computed, defineComponent, onMounted, ref, watch } from "vue";
import BoardList from "./boardList.vue";
import BoardHistoryList from "./boardHistoryList.vue";
import useUploadFile from "@/hooks/useUploadFile";
import { BlackboardFile, submitBlackboardHistory } from "./api";
import CloseDialog from "./closeDialog.vue";
const chalKBlack = require("./ico/chalk_black.cur");
const chalKBlue = require("./ico/chalk_blue.cur");
const chalKOrange = require("./ico/chalk_orange.cur");
const chalKRed = require("./ico/chalk_red.cur");
const chalKWhite = require("./ico/chalk_white.cur");
const rubber2 = require("./ico/icon-rubber2.cur");
enum ActiveType {
    Move,
    Choose,
    Brush,
    Eraser,
}

enum PenColorMap {
    White = "#FFFFFF",
    Black = "#000000",
    Red = "#F21E1E",
    Orange = "#E4AB07",
    Blue = "#4B71EE",
}
export default defineComponent({
    setup() {
        const canvasRef = ref<HTMLCanvasElement>();
        const penSize = ref(2);
        const penColor = ref(PenColorMap.White);
        const storageCanvasData = ref<
            {
                data: string;
                img: string;
            }[]
        >([
            {
                data: "",
                img: ""
            }
        ]);
        const pageIndex = ref(0);
        let fabCanvas: any;
        const chalKColorMap: Record<string, unknown> = {
            "#000000": chalKBlack,
            "#4B71EE": chalKBlue,
            "#E4AB07": chalKOrange,
            "#F21E1E": chalKRed,
            "#FFFFFF": chalKWhite
        };
        // 记录黑板数据
        const currentState = ref<string[]>([]);
        // 记录删除黑板数据
        const deleteState = ref<string[]>([]);
        const boxRef = ref<HTMLDivElement>();
        const isShowBroadList = ref(false);
        const activeType = ref(ActiveType.Brush);
        let isAction = false;
        const origin = { x: 0, y: 0 };
        let isMoving = false;
        let actionSleep: any;
        const disabledPrevPage = computed(() => pageIndex.value === 0);
        const disabledNextPage = computed(
            () => pageIndex.value === storageCanvasData.value.length - 1
        );
        const isBlack = ref(true);
        const blackColor = "#0C3E31";
        const whiteColor = "#F5F6FA";
        const isShowHistoryBroadList = ref(false);
        const { uploadFile } = useUploadFile("TeacherBlackboardFile");
        const isShowCloseDialog = ref(false);

        function init() {
            fabCanvas = new window.fabric.Canvas(canvasRef.value, {
                backgroundColor: blackColor,
                width: Number(boxRef.value?.offsetWidth),
                height: Number(boxRef.value?.offsetHeight)
            });
            // 禁止橡皮擦除背景色
            fabCanvas.get("backgroundColor").set({ erasable: false });
            fabCanvas.freeDrawingBrush.width = 2;
            selectPenMode();
        }
        // 画笔模式
        function selectPenMode() {
            fabCanvas.freeDrawingBrush = new window.fabric.PencilBrush(
                fabCanvas
            );
            fabCanvas.isDrawingMode = true;
            fabCanvas.freeDrawingBrush.color =
                penColor.value || PenColorMap.White;
            fabCanvas.freeDrawingBrush.width = penSize.value || 2;
            const cursor = `url(${
                penColor.value
                    ? chalKColorMap[penColor.value]
                    : chalKColorMap.white
            }),auto`;
            fabCanvas.freeDrawingCursor = cursor;
        }
        // 橡皮模式
        function selectEraseMode() {
            fabCanvas.freeDrawingBrush = new window.fabric.EraserBrush(
                fabCanvas
            );
            fabCanvas.freeDrawingBrush.width = 30;
            fabCanvas.isDrawingMode = true;
            fabCanvas.freeDrawingCursor = `url(${rubber2}),auto`;
        }
        function getCanvasData() {
            const dataUrl = fabCanvas.toJSON();
            const canvasimg = fabCanvas.toDataURL();
            const data = { data: dataUrl, img: canvasimg };
            return data;
        }
        function saveCurrentCanvasData() {
            storageCanvasData.value[pageIndex.value] = getCanvasData();
        }
        function clear() {
            fabCanvas.clear();
            fabCanvas.setBackgroundColor(blackColor);
            fabCanvas.get("backgroundColor").set({ erasable: false });
            fabCanvas.renderAll();
        }
        const undoClick = () => {
            isAction = true;
            if (currentState.value.length > 1) {
                const deleteJson = currentState.value.pop();
                deleteState.value.push(deleteJson!);
                const jsonString =
                    currentState.value[currentState.value.length - 1];
                const json = JSON.parse(jsonString);
                fabCanvas.loadFromJSON(json).renderAll();
            } else {
                if (currentState.value.length === 1) {
                    const deleteJson = currentState.value.pop();
                    deleteState.value.push(deleteJson!);
                }
                currentState.value = [];
                clear();
            }
            clearTimeout(actionSleep);
            actionSleep = setTimeout(() => {
                isAction = false;
            }, 500);
        };
        const recoverClick = () => {
            isAction = true;
            if (deleteState.value.length > 0) {
                const deleteJson = deleteState.value.pop();
                currentState.value.push(deleteJson!);
                const json = JSON.parse(deleteJson!);
                fabCanvas.loadFromJSON(json).renderAll();
            }
            clearTimeout(actionSleep);
            actionSleep = setTimeout(() => {
                isAction = false;
            }, 500);
        };
        const moveClick = () => {
            activeType.value = ActiveType.Move;
        };
        const chooseClick = () => {
            activeType.value = ActiveType.Choose;
            fabCanvas.isDrawingMode = false;
        };
        const brushClick = () => {
            activeType.value = ActiveType.Brush;
            selectPenMode();
        };
        const eraserClick = () => {
            activeType.value = ActiveType.Eraser;
            selectEraseMode();
        };
        const clearClick = () => {
            ElMessageBox.confirm("是否清空黑板?", "警告", {
                type: "warning",
                confirmButtonText: "确定",
                cancelButtonText: "取消"
            }).then(() => {
                clear();
            });
        };
        const mousedown = (e: MouseEvent) => {
            origin.x = e.x;
            origin.y = e.y;
            isMoving = true;
        };
        const mousemove = (e: MouseEvent) => {
            if (!isMoving) {
                return;
            }
            const left = e.x - origin.x;
            const top = e.y - origin.y;
            origin.x = e.x;
            origin.y = e.y;
            const objects = fabCanvas.getObjects();
            objects.map((obj: any) => {
                obj.set({
                    left: obj.left + left,
                    top: obj.top + top
                });
            });
            fabCanvas.renderAll();
        };
        const mouseup = () => {
            isMoving = false;
        };
        const changeStrokeStyle = (color: PenColorMap) => {
            penColor.value = color;
        };
        const changeLineWidth = (width: number) => {
            penSize.value = width;
        };
        const createBroad = () => {
            clear();
            storageCanvasData.value.push(getCanvasData());
            pageIndex.value = storageCanvasData.value.length - 1;
        };
        const addPage = () => {
            saveCurrentCanvasData();
            createBroad();
        };

        const showBoardList = () => {
            saveCurrentCanvasData();
            isShowBroadList.value = true;
            isShowHistoryBroadList.value = false;
        };
        const prevPage = () => {
            if (disabledPrevPage.value) {
                return;
            }
            saveCurrentCanvasData();
            pageIndex.value--;
        };
        const nextPage = () => {
            if (disabledNextPage.value) {
                return;
            }
            saveCurrentCanvasData();
            pageIndex.value++;
        };

        const changeBoard = () => {
            fabCanvas.setBackgroundColor(
                isBlack.value ? whiteColor : blackColor
            );
            fabCanvas.get("backgroundColor").set({ erasable: false });
            fabCanvas.renderAll();
            isBlack.value = !isBlack.value;
            if (!isBlack.value && penColor.value === PenColorMap.White) {
                penColor.value = PenColorMap.Black;
            }
        };

        const smallClick = () => {
            window.electron.ipcRenderer.send("smallBlackboard");
        };

        const saveBoardList = async () => {
            saveCurrentCanvasData();

            const fileInfoList = await Promise.all(storageCanvasData.value.map((item, index) => {
                const base64Data = item.img.replace(/^data:image\/\w+;base64,/, "");
                return uploadFile({ file: new File([Buffer.from(base64Data, "base64")], `${index}.png`) });
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

        const deleteBoard = (index: number) => {
            if (index === pageIndex.value) {
                pageIndex.value = 0;
            } else if (pageIndex.value > index) {
                pageIndex.value--;
            }
            storageCanvasData.value.splice(index, 1);
        };
        onMounted(() => {
            init();
            fabCanvas.on("object:added", function (e: any) {
                if (isAction) {
                    return;
                }
                deleteState.value = [];
                const json = fabCanvas.toDatalessJSON(["clipPath"]);
                currentState.value.push(JSON.stringify(json));
            });
            fabCanvas.on("object:modified", function (e: any) {
                if (isAction) {
                    return;
                }
                deleteState.value = [];
                const json = fabCanvas.toDatalessJSON(["clipPath"]);
                currentState.value.push(JSON.stringify(json));
            });
        });
        watch([penColor, penSize], () => {
            selectPenMode();
        });
        watch(pageIndex, (v) => {
            deleteState.value = [];
            currentState.value = [];
            fabCanvas.loadFromJSON(storageCanvasData.value[v].data).renderAll();
        });
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
            disabledRecoverBtn: computed(() => deleteState.value.length === 0),
            disabledUndoBtn: computed(() => currentState.value.length === 0)
        };
    },
    components: { BoardList, BoardHistoryList, CloseDialog }
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
        width: 100%;
        height: 92px;
        background: black;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        .btn {
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
        }
        .btn-container {
            background: rgba(255, 255, 255, 0.08);
            display: flex;
            padding: 0 40px;
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
            }
        }
    }
}
</style>
