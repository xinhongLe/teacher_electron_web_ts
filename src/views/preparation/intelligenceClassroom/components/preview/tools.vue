<template>
    <div v-dragLine="'left'" class="nextpage">
        <div class="me-tools-steps-new">
            <div class="me-tool-btn-new" :disabled="isFirst" @click="prevStep">
                <div class="icon-text">
                    <img src="../../images/slices/arrow_left.png" alt=""/>
                    <span class="text">上一页</span>
                </div>
            </div>
            <div
                @click="nextStep"
                class="me-tool-btn-new next-step"
                v-show=" selectNextType === NextSettingType.Left || selectNextType === NextSettingType.All"
            >
                <div class="icon-text">
                    <div class="next-icon"></div>
                    <span class="text">下一页</span>
                </div>
            </div>
        </div>
    </div>
    <div class="me-tools" ref="metools" v-drag>
        <div class="me-tools-draw">
            <!-- 左边可收起的按钮 -->
            <div class="draw-content">
                <div class="me-tools-drag" style="display: flex">
                    <!-- 展开后工具栏最左边按钮 -->
                    <div class="me-tools-set">
                        <div class="setting" v-show="isShowMenu">
                            <span @click.stop="isShowSubMenu = true" class="setting-item">
                                【下一步】位置设置 >
                            </span>
                            <div class="setting-sub-menu" v-show="isShowSubMenu">
                                <div
                                    class="menu"
                                    :key="item.text"
                                    @click="changeNextType(item.type)"
                                    v-for="item in nextSettingTypeList"
                                >
                                    {{ item.text }}
                                </div>
                            </div>
                        </div>
                        <!-- 更多设置 -->
                        <div class="me-tool-btn-new" @click.stop="moreSet($event)">
                            <div class="icon-text">
                                <img src="../../images/slices/icon_gdsz.png" alt=""/>
                                <span class="text">更多设置</span>
                            </div>
                        </div>
                        <!-- 隐藏显示教案 -->
                        <div class="me-tool-btn-new" @click="toggleRemark()" v-if="isShowRemarkBtn">
                            <div class="icon-text">
                                <img v-if="showRemark" src="../../images/slices/icon_pbja.png" alt=""/>
                                <img v-else src="../../images/slices/icon_xsja.png" alt=""/>
                                <span class="text">{{ showRemark ? "隐藏教案" : "显示教案" }}</span>
                            </div>
                        </div>
                        <!-- 教具页发送-->
                        <div v-if="isTeach" class="me-tool-btn-new issend" @click="sendTeachTool">
                            <div class="icon-text">
                                <img src="../../images/slices/pic_send.png" alt=""/>
                                <span class="text">发送给学生</span>
                            </div>
                        </div>
                    </div>
                    <!-- 展开后工具栏中间四个按钮 -->
                    <div class="me-tools-canvas">

                        <!-- 橡皮擦 -->
                        <!--                        <div-->
                        <!--                            class="me-tool-btn-new"-->
                        <!--                            :class="type === 'eraser' && 'btn-active'"-->
                        <!--                            @click="openPaintTool($event, 'eraser'),(type = 'eraser')"-->
                        <!--                        >-->
                        <!--                            <div class="icon-text">-->
                        <!--                                <img v-if="type !== 'eraser'" src="../../images/slices/icon_xp.png" alt=""/>-->
                        <!--                                <img v-if="type === 'eraser'" src="../../images/slices/icon_xp_white.png" alt=""/>-->
                        <!--                                <span class="text">橡皮</span>-->
                        <!--                            </div>-->
                        <!--                        </div>-->

                        <el-popover
                            :width="140"
                            placement="top" trigger="click">
                            <el-input-number
                                :min="2"
                                :max="999"
                                v-model="toolEraserLineWidth"
                                @change="setEraserSize"
                                style="width: 125px"
                            />
                            <template #reference>
                                <div
                                    class="me-tool-btn-new"
                                    :class="type === 'eraser' && 'btn-active'"
                                    @click="openPaintTool($event, 'eraser'),(type = 'eraser')"
                                >
                                    <div class="icon-text">
                                        <img v-if="type !== 'eraser'"
                                             src="@/views/preparation/intelligenceClassroom/images/slices/icon_xp.png"
                                             alt=""/>
                                        <img v-if="type === 'eraser'"
                                             src="@/views/preparation/intelligenceClassroom/images/slices/icon_xp_white.png"
                                             alt=""/>
                                        <span class="text">橡皮</span>
                                    </div>
                                </div>
                            </template>
                        </el-popover>
                        <!-- 尺规:三合一-->
                        <div
                            class="me-tool-btn-new"
                            :class="type === 'rulers' && 'btn-active'"
                            @click="openPaintTool($event, 'rulers'),(type = 'rulers')"
                        >
                            <div class="icon-text">
                                <img v-if="type !== 'rulers'" src="../../images/slices/icon_cg.png" alt=""/>
                                <img v-if="type === 'rulers'" src="../../images/slices/icon_cg_white.png" alt=""/>
                                <span class="text">尺规</span>
                            </div>
                        </div>
                        <!-- 形状 -->
                        <div
                            class="me-tool-btn-new"
                            @click="openPaintTool($event, 'mouse'),(type = 'mouse'),openShape($event)"
                        >
                            <div class="icon-text">
                                <img src="../../images/slices/icon_xz.png" alt=""/>
                                <span class="text">形状</span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <!-- 右边固定展开的按钮 -->
            <div class="me-tools-righttool">
                <!-- 展开/收起 -->
                <div @click.prevent.stop="showDrawToos" class="arrows">
                    <img v-if="!isOpen" src="../../images/slices/icon_zhankai.png" alt=""/>
                    <img v-else src="../../images/slices/icon_shouqi.png" alt=""/>
                    <span class="text" v-if="!isOpen">展开</span>
                    <span class="text" v-else>收起</span>
                </div>
                <div class="me-tool-btn-line"></div>
                <!-- 鼠标 -->
                <div
                    class="me-tool-btn-new"
                    :class="type === 'mouse' && 'btn-active'"
                    @click="hideWriteBoard(),openPaintTool($event, 'mouse'),(type = 'mouse')"
                >
                    <div class="icon-text">
                        <img v-if="type !== 'mouse'" src="../../images/slices/icon_shubiao.png" alt=""/>
                        <img v-if="type === 'mouse'" src="../../images/slices/icon_shubiao_white.png" alt=""/>
                        <span class="text">鼠标</span>
                    </div>
                </div>
                <!-- 画笔 -->
                <div
                    class="me-tool-btn-new"
                    :class="type === 'pen' && 'btn-active'"
                    @click="openPaintTool($event, 'paint'),(type = 'pen')"
                >
                    <div class="icon-text">
                        <img v-if="type !== 'pen'" src="../../images/slices/icon_hb.png" alt=""/>
                        <img v-if="type === 'pen'" src="../../images/slices/icon_hb_white.png" alt=""/>
                        <span class="text">画笔</span>
                    </div>
                </div>
                <!-- 上一页 -->
                <div class="me-tool-btn-new" :disabled="isFirst" @click="prevStep">
                    <div class="icon-text">
                        <img src="../../images/slices/arrow_left.png" alt=""/>
                        <span class="text">上一页</span>
                    </div>
                </div>
                <!-- 下一页 -->
                <div
                    @click="nextStep"
                    :disabled="isLast"
                    style="width: 90px;"
                    class="me-tool-btn-new next-step"
                    v-show="selectNextType === NextSettingType.Right || selectNextType === NextSettingType.All"
                >
                    <div class="icon-text">
                        <div class="next-icon"></div>
                        <span class="text">下一页</span>
                    </div>
                </div>
                <!-- 全屏/退出全屏 -->
                <template v-if="isShowFullscreen && !dialog">
                    <div class="me-tool-btn-new" @click="fullScreen" v-if="!activeFlag">
                        <div class="icon-text">
                            <img src="../../images/slices/icon_qp.png" alt=""/>
                            <span class="text">全屏</span>
                        </div>
                    </div>
                    <div class="me-tool-btn-new" @click="fillScreen" v-else>
                        <div class="icon-text">
                            <img src="../../images/slices/icon_suoxiao.png" alt=""/>
                            <span class="text">退出全屏</span>
                        </div>
                    </div>
                </template>
                <!-- 关闭 -->
                <div class="me-tool-btn-new" @click="handleMinSize">
                    <div class="icon-text">
                        <img src="../../images/slices/icon_zxh.png" alt=""/>
                        <span class="text">最小化</span>
                    </div>
                </div>
                <div class="me-tool-btn-new" v-if="isShowClose" @click="handleClose">
                    <div class="icon-text">
                        <img src="../../images/slices/close.png" alt=""/>
                        <span class="text">关闭</span>
                    </div>
                </div>
                <div @click.stop="closeWinCard" v-if="!isShowClose && !dialog" class="me-tool-btn-new">
                    <div class="icon-text">
                        <img src="../../images/slices/close.png" alt=""/>
                        <span class="text">关闭</span>
                    </div>
                </div>
            </div>
        </div>

        <ResourceDialog v-if="showResourceDialog" v-model="showResourceDialog"/>


    </div>
    <PenTool
        @undo="undo()"
        @redo="redo()"
        :penTop="penTop"
        v-if="isShowPen"
        :penLeft="penLeft"
        :canUndo="isCanUndo"
        :canRedo="isCanRedo"
        v-model:isShowPen="isShowPen"
        :currentDrawColor="currentDrawColor"
        :currentLineWidth="currentLineWidth"
        :eraserLineWidth="toolEraserLineWidth"
        @clear="whiteboardOption('clear')"
        @setEraser="whiteboardOption('setEraser')"
        @setEraserSize="setEraserSize"
        @setPenSize="(value) => whiteboardOption('setPenSize', value)"
        @setPenColor="(value) => whiteboardOption('setPenColor', value)"
    />
</template>

<script lang="ts">
import emitter from "@/utils/mitt";
import PenTool from "./PenTool.vue";
import isElectron from "is-electron";
import {sleep} from "@/utils/common";
import {MutationTypes, store} from "@/store";
import ResourceDialog from "./resourceDialog.vue";
import {NextSettingType} from "@/types/preparation";
import {STORAGE_TYPES, set, get} from "@/utils/storage";
import {enterFullscreen, exitFullscreen, isFullscreen} from "@/utils/fullscreen";
import {ref, defineComponent, watch, onMounted, onUnmounted, computed, onActivated, onDeactivated} from "vue";

export default defineComponent({
    components: {ResourceDialog, PenTool},
    props: {
        showRemark: {
            type: Boolean,
            default: true
        },
        isShowRemarkBtn: {
            type: Boolean,
            default: true
        },
        isShowFullscreen: {
            type: Boolean,
            default: true
        },
        isFullScreenStatus: {
            type: Boolean,
            default: true
        },
        isShowClose: {
            type: Boolean,
            default: false
        },
        dialog: {
            type: Boolean,
            default: false
        },
        showClose: {
            type: Boolean,
            default: true
        },
        id: {
            type: String,
            default: ""
        },
        isCanUndo: {
            type: Boolean,
            default: false
        },
        isCanRedo: {
            type: Boolean,
            default: false
        },
        currentDrawColor: {
            type: String,
            default: "#f60000"
        },
        currentLineWidth: {
            type: Number,
            default: 2
        },
        eraserLineWidth: {
            type: Number,
            default: 30
        },
        isTKdialog: {
            type: Boolean,
            default: false
        },
        cardClass: {
            type: String,
            default: "intelligence"
        },
        currentSlide: {
            type: Object
        },
        isOutLine: {
            type: Boolean,
            default: false
        }
    },
    emits: [
        "undo",
        "redo",
        "close",
        "prevStep",
        "nextStep",
        "openShape",
        "ullScreen",
        "fullScreen",
        "toggleRemark",
        "closeWinCard",
        "openPaintTool",
        "hideWriteBoard",
        "openClassDialog",
        "clockFullScreen",
        "whiteboardOption",
        "handleMinSize",
        "setEraserSize"
    ],
    setup(props, {emit}) {
        const isShowPen = ref(false);
        const isShowRulers = ref(false);
        const penLeft = ref(0);
        const penTop = ref(0);
        const rulersLeft = ref(0);
        const rulersTop = ref(0);
        const isOpen = ref(false);
        const toolEraserLineWidth = computed(() => props.eraserLineWidth);
        const showDrawToos = () => {
            const dom: any = document.querySelector(".draw-content");
            const outdom: any = document.querySelector(".me-tools");
            const dominner: HTMLElement = document.querySelector(".me-tools-set") as HTMLElement;
            if (isTeach.value) {
                if (outdom.style.width === "834px") {
                    isOpen.value = false;
                    outdom.style.width = "478px";
                } else {
                    isOpen.value = true;
                    outdom.style.width = "834px";
                }
                const width2 = 834 - 478;
                if (dom.style.width === width2 + "px") {
                    dom.style.width = 0;
                } else {
                    dom.style.width = width2 + "px";
                }
                dominner.style.width = "180px";
            } else {
                if (outdom.style.width === "778px") {
                    isOpen.value = false;
                    outdom.style.width = "478px";
                } else {
                    isOpen.value = true;
                    outdom.style.width = "778px";
                }
                const width2 = 778 - 478;
                if (dom.style.width === width2 + "px") {
                    dom.style.width = 0;
                } else {
                    dom.style.width = width2 + "px";
                }
                dominner.style.width = "118px";
            }
        };
        const type = ref("mouse");
        const isLast = ref(false);
        const isFirst = ref(false);
        const scale = ref(1);
        const selectNextType = computed(() => store.state.preparation.selectNextType);
        const switchFlag = ref(false);
        const activeFlag = ref(false);
        const isShowMenu = ref(false);
        const isShowSubMenu = ref(false);
        const showResourceDialog = ref(false);
        const nextSettingTypeList = [
            {
                text: "仅右侧",
                type: NextSettingType.Right
            },
            {
                text: "左右侧",
                type: NextSettingType.All
            }
        ];
        const isTeach = ref(false);
        watch(
            () => props.currentSlide,
            (val: any) => {
                const dom: HTMLElement = document.querySelector(".me-tools-set") as HTMLElement;
                const dom2: HTMLElement = document.querySelector(".draw-content") as HTMLElement;
                const dom3: HTMLElement = document.querySelector(".me-tools") as HTMLElement;
                console.log('val', val)
                if (val && val.type === "teach") {
                    isTeach.value = true;
                    if (isOpen.value) {
                        dom.style.width = "180px";
                        dom2.style.width = "356px";
                        dom3.style.width = "834px";
                    } else {
                        dom.style.width = "0px";
                        dom2.style.width = "0px";
                        dom3.style.width = "478px";
                    }
                } else {
                    isTeach.value = false;
                    if (isOpen.value) {
                        dom.style.width = "118px";
                        dom2.style.width = "300px";
                        dom3.style.width = "778px";
                    } else {
                        if (dom) {
                            dom.style.width = "0px";
                        }
                        if (dom2) {
                            dom2.style.width = "0px";
                        }
                        if (dom3) {
                            dom3.style.width = "478px";
                        }
                    }
                }
            }, {deep: true, immediate: true}
        );
        const changeNextType = (type: NextSettingType) => {
            store.commit(MutationTypes.SET_SELECT_NEXT_TYPE, type);
            set(STORAGE_TYPES.NEXT_SETTING + store.state.userInfo.id, type);
            hideMenu();
        };
        const hideMenu = () => {
            isShowMenu.value = false;
            isShowSubMenu.value = false;
        };
        const addEvent = () => {
            window.addEventListener("keydown", keyDown);
            window.addEventListener("resize", onResize);
            document.addEventListener("click", hideMenu);
        };
        const removeEvent = () => {
            window.removeEventListener("resize", onResize);
            window.removeEventListener("keydown", keyDown);
            document.removeEventListener("click", hideMenu);
        };
        onMounted(() => {
            addEvent();
            emitter.on("closeTool", closeRulersTool);
        });
        onUnmounted(() => {
            removeEvent();
            emitter.off("closeTool");
        });
        onActivated(() => {
            addEvent();
        });
        onDeactivated(() => {
            removeEvent();
        });
        const onResize = async () => {
            if (switchFlag.value && isFullscreen()) {
                switchFlag.value = false;
            } else if (!switchFlag.value && isFullscreen()) {
            } else {
                if (isElectron()) {
                    return false;
                }
                activeFlag.value = false;
                await sleep(300);
                emit("clockFullScreen");
            }
        };
        // 切换建议
        const toggleRemark = () => {
            emit("toggleRemark");
        };
        // 上一步
        const prevStep = () => {
            emit("prevStep");
        };
        // 下一步
        const nextStep = () => {
            emit("nextStep");
        };
        const keyDown = async (e: any) => {
            if (!isElectron()) {
                return false;
            }
            if (e.keyCode === 27) {
                if (!activeFlag.value) {
                    return false;
                }
                activeFlag.value = false;
                if (!isFullscreen()) {
                    return false;
                }
                exitFullscreen();
                emit("clockFullScreen");
            }
        };
        // 点击全屏
        const fullScreen = async () => {
            if (window.electron && !window.electron.isFullScreen() && !window.electron.isMac()) {
                window.electron.setFullScreen(true);
                await sleep(300);
            }
            activeFlag.value = true;
            switchFlag.value = true;
            type.value = "mouse";
            emit("fullScreen");
            enterFullscreen();
        };
        // 退出全屏
        const fillScreen = () => {
            activeFlag.value = false;
            exitFullscreen();
            emit("clockFullScreen");
        };
        const openShape = (event: MouseEvent) => {
            emit("openShape", event);
        };
        // 橡皮擦
        const openPaintTool = (event: MouseEvent, type: string) => {
            if (type === "paint") {
                const target = event.target as HTMLDivElement;
                const {left, top} = target.getBoundingClientRect();
                isShowPen.value = true;
                penLeft.value = left;
                penTop.value = top;
            }
            emit("openPaintTool", event, type);
        };

        // 教具页发送
        const sendTeachTool = () => {
            emit("openClassDialog");
        };
        const hideWriteBoard = () => {
            emit("hideWriteBoard");
        };

        function getLocalNextType() {
            const type = get(
                STORAGE_TYPES.NEXT_SETTING + store.state.userInfo.id
            );
            changeNextType(type || NextSettingType.All);
        }

        getLocalNextType();

        const closeWinCard = () => {
            if (props.isOutLine) {
                emit("closeWinCard");
            } else {
                store.commit(MutationTypes.REMOVE_FULLSCREEN_RESOURCE, {
                    id: props.id,
                    openMore: true
                });
                window.electron.ipcRenderer.invoke("closeCourse");
            }
        };
        // 更多设置时 改变固定定位位置
        const moreSet = (e: any) => {
            const dom: any = document.querySelector(".setting");
            dom.style.left = e.clientX + "px";
            dom.style.top = e.clientY - 82 + "px";
            isShowMenu.value = true;
        };
        // 关闭工具
        const closeRulersTool = (e: any) => {
            openPaintTool(e, "paint");
            type.value = "pen";
        };
        const whiteboardOption = (option: string, value?: number) => {
            emit("whiteboardOption", option, value);
        };
        const setEraserSize = (value: number) => {
            emit("whiteboardOption", "setEraserSize", value);
        };
        const undo = () => {
            emit("undo");
        };
        const redo = () => {
            emit("redo");
        };

        const handleClose = () => {
            emit("close");
        };
        // 最小化
        const handleMinSize = () => {
            emit("handleMinSize");
        };

        return {
            isOpen,
            scale,
            type,
            isLast,
            isFirst,
            activeFlag,
            penLeft,
            penTop,
            isShowPen,
            isShowRulers,
            rulersLeft,
            rulersTop,
            isTeach,
            toolEraserLineWidth,
            toggleRemark,
            showResourceDialog,
            prevStep,
            nextStep,
            fullScreen,
            fillScreen,
            changeNextType,
            isShowSubMenu,
            nextSettingTypeList,
            NextSettingType,
            isShowMenu,
            selectNextType,
            openShape,
            hideWriteBoard,
            closeWinCard,
            openPaintTool,
            showDrawToos,
            moreSet,
            whiteboardOption,
            undo,
            redo,
            handleClose,
            sendTeachTool,
            handleMinSize,
            setEraserSize
        };
    }
});
</script>

<style lang="scss" scoped>
// 左边-新的按钮样式
.nextpage {
    cursor: move;
    position: fixed;
    left: 3vw;
    bottom: 4vh;

    .me-tools-steps-new {
        width: 116px;
        height: 64px;
        background: rgba(15, 39, 91, 0.15);
        border-radius: 12px;
        display: flex;
        justify-content: space-evenly;
        align-items: center;
    }
}

.me-tool-btn-new {
    cursor: pointer;
    width: 48px;
    height: 48px;
    background: #FFFFFF;
    border-radius: 8px;
    position: relative;
    top: 0;
    transition: all 0.1s;

    .icon-text {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        padding: 4px 0;

        .text {
            font-size: 9px;
            font-family: HarmonyOS_Sans_SC_Medium;
            color: #414E65;
        }
    }

    &.issend {
        width: 56px;
    }
}


.me-tool-btn-line {
    width: 1px;
    height: 48px;
    background: rgba(65, 78, 101, 0.1);
    margin: 0px 5px;
}

.next-step {
    background: #F8F9FF;
    border: 2px solid #4B71EE;

    .icon-text {
        .next-icon {
            width: 18px;
            height: 18px;
            background: url("../../images/slices/arrow_right_blue.png");
            background-size: 100% 100%;
        }
    }

    .text {
        color: #4B71EE !important;
    }
}

.next-step:active {
    .icon-text {
        .next-icon {
            background: url("../../images/slices/arrow_right_white.png");
        }
    }

    background: #4B71EE;

    .text {
        color: #fff !important;
    }
}

.me-tool-btn-new:active {
    top: 2px;
    box-shadow: 0 0 0 !important;
}

.me-tool-btn-new.btn-active {
    background: #4B71EE;

    .text {
        color: #fff;
    }
}

.me-tools {
    // background: rgba(15, 39, 91, 0.15);
    border-radius: 12px;

    // border-radius: 40px;
    // background: rgba(255, 255, 255, 0.3);
    z-index: 999;
    cursor: move;
    height: 64px;
    display: flex;
    overflow: auto;
    bottom: 4vh;
    right: 6vw;
    width: 478px;
    transition: width 0.5s, transform 0.5s;
    overflow-y: hidden;

    // width: 80%;
    .me-tools-draw {
        display: flex;
        position: relative;
        width: 100%;
        background: rgba(15, 39, 91, 0.15);

        .draw-content {
            display: flex;
            position: absolute;
            width: 0;
            overflow: hidden;
            right: 478px;
            height: 100%;
            transition: width 0.5s, transform 0.5s;
        }

        .me-tools-righttool {
            position: absolute;
            right: 0;
            width: 478px;
            height: 64px;
            // background: rgba(15, 39, 91, 0.15);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: space-evenly;

            .el-icon {
                cursor: pointer;
                font-size: 32px;
                display: flex;
                align-items: center;
                // color: #e0e2e7;
            }

            .arrows {
                cursor: pointer;
                font-size: 20px;
                display: flex;
                align-items: center;
                flex-direction: column;
                justify-content: center;
                height: 100%;

                .text {
                    padding-top: 8px;
                    font-size: 9px;
                    color: #414E65;
                }
            }
        }
    }

    &.tools-fullSrceen {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;

        .me-tools-set {
            transform: none;

            .setting {
                position: absolute;
            }
        }
    }

    .me-tools-set {
        position: relative;
        width: 118px;
        justify-content: space-evenly;
        align-items: center;

        .setting {
            position: fixed;
            top: -55px;
            left: 10px;
            color: #fff;
            background: #000;
            width: max-content;
            z-index: 1;

            .setting-item {
                padding: 0 16px;
                height: 50px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
            }

            .setting-sub-menu {
                position: absolute;
                right: -10px;
                transform: translateX(100%);
                bottom: 10px;

                .menu {
                    height: 40px;
                    padding: 0 16px;
                    color: #fff;
                    background: #000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    border-bottom: 1px solid #fff;

                    &:last-child {
                        border-bottom: none;
                    }
                }
            }
        }

        .setting-btn {
            display: flex;
            justify-content: center;
            color: #254d98;
            font-weight: 700;

            span {
                position: absolute;
                bottom: 0;
            }
        }
    }
}

.me-tools-canvas {
    flex: 1;
    width: 176px;
    align-items: center;
    // margin-left: 24px;
    justify-content: space-evenly;
}

.me-tools-canvas,
.me-tools-screen,
.me-tools-system,
.me-tools-set {
    display: flex;
}
</style>
