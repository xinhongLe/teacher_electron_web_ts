<template>
    <div class="warp">
        <div class="frames-box">
            <span class="file-sn" v-if="!dialog">{{ questionSn }}</span>
            <slot name="title"/>
            <div class="count">{{ number }} / {{ sum }}</div>
            <div class="material-box">
                <audio
                    ref="audioRef"
                    :src="
                        voiceUrlMap[nextIndex - 1 === 0 ? 'question' : 'answer']
                    "
                    :controls="true"
                    @canplay="playAudio"
                    style="display: none"
                >
                    亲 您的浏览器不支持html5的audio标签
                </audio>
                <div class="editd-data" v-if="questionEditList.length">
                    <div class="items">
                        <div class="text">
                            题目：
                        </div>
                        <MathJax :text="questionEditList[0]?.QuestionContent"></MathJax>
                    </div>
                    <div class="answers">
                        <div class="text">
                            答案：
                        </div>
                        <MathJax :text="questionEditList[0]?.AnswerContent"></MathJax>
                    </div>

                </div>
                <img
                    v-else
                    ref="imageRef"
                    class="question-img"
                    :src="imageUrl[nextIndex - 1]"
                    alt=""
                />
            </div>
        </div>
        <div>
            <div v-dragLine="'left'" class="nextpage">
                <div class="me-tools-steps-new">
                    <div class="me-tool-btn-new" @click="lastPage">
                        <div class="icon-text">
                            <img src="@/views/preparation/intelligenceClassroom/images/slices/arrow_left.png" alt=""/>
                            <span class="text">上一页</span>
                        </div>
                    </div>
                    <div
                        @click="nextPage"
                        class="me-tool-btn-new next-step"
                    >
                        <div class="icon-text">
                            <div class="next-icon"></div>
                            <span class="text">下一页</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="me-tools" :class="toolClass" ref="metools" v-drag>
                <div class="me-tools-draw">
                    <!-- 左边可收起的按钮 -->
                    <div class="draw-content">
                        <div style="display: flex">
                            <!-- 展开后工具栏最左边按钮 -->
                            <div class="me-tools-canvas">
                                <slot
                                    name="footerBtn"
                                    :sum="sum"
                                    :removeQuestion="removeQuestion"
                                />
                                <!-- 听题音-->
                                <div class="me-tool-btn-new" @click.stop="playSounds(0)">
                                    <div class="icon-text">
                                        <img src="@/views/preparation/intelligenceClassroom/images/slices/icon_tyy.png"
                                             alt=""/>
                                        <span class="text">听题音</span>
                                    </div>
                                </div>
                                <!-- 听解析-->
                                <div class="me-tool-btn-new" @click.stop="playSounds(1)">
                                    <div class="icon-text">
                                        <img src="@/views/preparation/intelligenceClassroom/images/slices/icon_tjx.png"
                                             alt=""/>
                                        <span class="text">听解析</span>
                                    </div>
                                </div>
                                <div class="me-tool-btn-line"></div>

                                <el-popover
                                    :width="140"
                                    placement="top" trigger="click">
                                    <el-input-number
                                        :min="2"
                                        :max="999"
                                        v-model="eraserLineWidth"
                                        @change="setEraserSize"
                                        style="width: 125px"
                                    />
                                    <template #reference>
                                        <div
                                            class="me-tool-btn-new"
                                            :class="toolType === 'eraser' && 'btn-active'"
                                            @click="openPaintTool($event, 'eraser'),(toolType = 'eraser')"
                                        >
                                            <div class="icon-text">
                                                <img v-if="toolType !== 'eraser'"
                                                     src="@/views/preparation/intelligenceClassroom/images/slices/icon_xp.png"
                                                     alt=""/>
                                                <img v-if="toolType === 'eraser'"
                                                     src="@/views/preparation/intelligenceClassroom/images/slices/icon_xp_white.png"
                                                     alt=""/>
                                                <span class="text">橡皮</span>
                                            </div>
                                        </div>
                                    </template>
                                </el-popover>
                                <!-- 橡皮擦 -->

                                <!-- 尺规:三合一-->
                                <div
                                    class="me-tool-btn-new"
                                    :class="toolType === 'rulers' && 'btn-active'"
                                    @click="openPaintTool($event, 'rulers'),(toolType = 'rulers')"
                                >
                                    <div class="icon-text">
                                        <img v-if="toolType !== 'rulers'"
                                             src="@/views/preparation/intelligenceClassroom/images/slices/icon_cg.png"
                                             alt=""/>
                                        <img v-if="toolType === 'rulers'"
                                             src="@/views/preparation/intelligenceClassroom/images/slices/icon_cg_white.png"
                                             alt=""/>
                                        <span class="text">尺规</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- 右边固定展开的按钮 -->
                    <div class="me-tools-righttool">
                        <!-- 展开/收起 -->
                        <div @click="showDrawToos" class="arrows">
                            <img v-if="!isOpen"
                                 src="@/views/preparation/intelligenceClassroom/images/slices/icon_zhankai.png" alt=""/>
                            <img v-else src="@/views/preparation/intelligenceClassroom/images/slices/icon_shouqi.png"
                                 alt=""/>
                            <span class="text" v-if="!isOpen">展开</span>
                            <span class="text" v-else>收起</span>
                        </div>
                        <div class="me-tool-btn-line"></div>
                        <!-- 鼠标 -->
                        <div
                            class="me-tool-btn-new"
                            :class="toolType === 'mouse' && 'btn-active'"
                            @click="openPaintTool($event, 'mouse'),(toolType = 'mouse')"
                        >
                            <div class="icon-text">
                                <img v-if="toolType !== 'mouse'"
                                     src="@/views/preparation/intelligenceClassroom/images/slices/icon_shubiao.png"
                                     alt=""/>
                                <img v-if="toolType === 'mouse'"
                                     src="@/views/preparation/intelligenceClassroom/images/slices/icon_shubiao_white.png"
                                     alt=""/>
                                <span class="text">鼠标</span>
                            </div>
                        </div>
                        <!-- 画笔 -->
                        <div
                            class="me-tool-btn-new"
                            :class="toolType === 'pen' && 'btn-active'"
                            @click="openPaintTool($event, 'paint'),(toolType = 'pen')"
                        >
                            <div class="icon-text">
                                <img v-if="toolType !== 'pen'"
                                     src="@/views/preparation/intelligenceClassroom/images/slices/icon_hb.png" alt=""/>
                                <img v-if="toolType === 'pen'"
                                     src="@/views/preparation/intelligenceClassroom/images/slices/icon_hb_white.png"
                                     alt=""/>
                                <span class="text">画笔</span>
                            </div>
                        </div>
                        <!-- 上一页 -->
                        <div class="me-tool-btn-new" @click="lastPage">
                            <div class="icon-text">
                                <img src="@/views/preparation/intelligenceClassroom/images/slices/arrow_left.png"
                                     alt=""/>
                                <span class="text">上一页</span>
                            </div>
                        </div>
                        <!-- 下一页 -->
                        <div
                            @click="nextPage"

                            style="width: 90px;"
                            class="me-tool-btn-new next-step"
                        >
                            <div class="icon-text">
                                <div class="next-icon"></div>
                                <span class="text">下一页</span>
                            </div>
                        </div>
                        <!-- 关闭 -->
                        <div class="me-tool-btn-new" @click="closeQuestion">
                            <div class="icon-text">
                                <img src="@/views/preparation/intelligenceClassroom/images/slices/close.png" alt=""/>
                                <span class="text">关闭</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
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
        :eraserLineWidth="eraserLineWidth"
        @clear="whiteboardOption('clear')"
        @setEraser="whiteboardOption('setEraser')"
        @setEraserSize="setEraserSize"
        @setPenSize="(value) => whiteboardOption('setPenSize', value)"
        @setPenColor="(value) => whiteboardOption('setPenColor', value)"
    />
    <RulersTool
        v-if="isShowRulers"
        :rulersTop="rulersTop"
        :rulersLeft="rulersLeft"
        @setRulersTool="setRulersTool"
        v-model:isShowRulers="isShowRulers"
    />
    <drawing-board :show="drawingShow" @closeWriteBoard="drawingShow = false" :isOldTool="false" ref="drawingBoardRef"
                   v-model:isCanUndo="isCanUndo" v-model:isCanRedo="isCanRedo"
                   v-model:currentDrawColor="currentDrawColor"
                   v-model:currentLineWidth="currentLineWidth"
                   v-model:eraserLineWidth="eraserLineWidth"/>
</template>

<script lang="ts">
import {
    computed,
    defineComponent,
    inject, nextTick,
    onMounted,
    onUnmounted,
    PropType,
    Ref,
    ref,
    watch,
} from "vue";
import isElectronFun from "is-electron";
import useDetail from "./hooks/useDetail";
import { set, STORAGE_TYPES } from "@/utils/storage";
import emitter from "@/utils/mitt";
import { IViewResourceData } from "@/types/store";
import DrawingBoard from "@/components/drawingBoard/index.vue";
import { KEYS } from "@/config/hotkey";
import PenTool from "@/views/preparation/intelligenceClassroom/components/preview/PenTool.vue";
import RulersTool from "@/views/preparation/intelligenceClassroom/components/preview/RulersTool.vue";
import MathJax from "@/components/MathJax/index.vue";

export default defineComponent({
    props: {
        close: {
            type: Function,
            required: true,
        },

        isPureQuestion: {
            type: Boolean,
            default: false,
        },

        dialog: {
            type: Boolean,
            default: false,
        },

        resource: {
            type: Object as PropType<IViewResourceData>,
            required: true,
        },
        question: {
            type: Object,
            default: () => {
            },
        },
        toolClass: {
            type: String,
            default: 'question'
        }
    },
    setup(props, { emit }) {
        const drawingBoardRef = ref();
        const type = computed(() => props.resource.type);
        const btnType = ref(-1);
        const childRef = ref();
        const isElectron = isElectronFun();
        const noMinix = computed(() => !!props.resource.openMore);
        const questionID = inject("nowQuestionID") as Ref<string>;
        const toolType = ref("mouse");
        const isShowRulers = ref(false);
        const rulersLeft = ref(0);
        const rulersTop = ref(0);
        const isShowPen = ref(false);
        const penLeft = ref(0);
        const penTop = ref(0);
        const isCanUndo = ref(false);
        const isCanRedo = ref(false);
        const currentDrawColor = ref("#f60000");
        const currentLineWidth = ref(2);
        const eraserLineWidth = ref(30);
        const {
            questionEditList,
            imageUrl,
            voiceUrl,
            sum,
            isBlackboard,
            nextIndex,
            isLastBtn,
            isNextBtn,
            number,
            lastPage,
            imageRef,
            audioRef,
            removeQuestion,
            playSounds,
            nowQuestionID,
            resolutionSwitchValue,
            questionSwitchValue,
            voiceUrlMap,
            nextPage,
            questionSn,
            getQuestionEditList
        } = useDetail(
            props.isPureQuestion,
            questionID.value,
            emit,
            childRef,
            props.resource,
        );
        watch(() => props.question, (val: any) => {
            if (val) {
                getQuestionEditList(val.QuestionFlowText)
            }
        }, { deep: true, immediate: true })

        const brushHandle = () => {
            btnType.value = 1;
            childRef.value?.brushOn();
        };

        const clearBoard = () => {
            btnType.value = 3;
            childRef.value?.clearBrush();
        };

        const eraserHandle = () => {
            btnType.value = 2;
            childRef.value?.eraserOn();
        };

        const lookSimilarQuestions = () => {
            audioRef.value!.pause();
        };

        const closeQuestion = () => {
            audioRef.value!.pause();
            props.close();
        };

        const smallQuestion = () => {
            audioRef.value!.pause();
            emit("update:isMinimized", true);
        };

        const playAudio = () => {
            const isPlay =
                nextIndex.value === 1
                    ? questionSwitchValue.value
                    : resolutionSwitchValue.value;
            if (isPlay && audioRef.value) {
                audioRef.value.play();
            }
        };
        const canvasDataMap = new Map();
        const canvasData = ref();
        watch(nowQuestionID, (v, ov) => {
            canvasData.value = canvasDataMap.get(
                v || ""
            )
            const elements = drawingBoardRef.value.whiteboard.getElements();
            ov && canvasDataMap.set(ov, elements);
            drawingBoardRef.value.whiteboard.clear();
            childRef.value?.clearBrush();
            emit("update:nowQuestionID", v);
        });

        watch(() => canvasData.value, (v) => {
            drawingBoardRef.value.whiteboard.reset();
            drawingBoardRef.value.whiteboard.clear();
            drawingBoardRef.value.whiteboard.setElements(v);
            drawingBoardRef.value.whiteboard.render();
        }, { deep: true })

        watch(questionSwitchValue, (v) => {
            set(STORAGE_TYPES.AUTO_PALY_QUESTION_SWITCH, String(v));
        });

        watch(resolutionSwitchValue, (v) => {
            set(STORAGE_TYPES.AUTO_PALY_RESOLUTION_SWITCH, String(v));
        });

        onMounted(() => {
            document.addEventListener("keydown", keydownListener);
            if (!props.isPureQuestion) {
                emitter.on("smallQuestion", smallQuestion);
            }
        });

        onUnmounted(() => {
            document.removeEventListener("keydown", keydownListener);
            emitter.off("smallQuestion");
        });

        // 快捷键翻页
        const keydownListener = (e: KeyboardEvent) => {
            const key = e.key.toUpperCase();
            if (key === KEYS.UP || key === KEYS.PAGEUP || key === KEYS.LEFT) {
                lastPage();
            } else if (
                key === KEYS.DOWN ||
                key === KEYS.RIGHT ||
                // key === KEYS.SPACE ||
                // key === KEYS.ENTER ||
                key === KEYS.PAGEDOWN) {
                if (isNextBtn.value) return;
                nextPage();
            }
        };

        const drawingShow = ref(false);
        const isOpen = ref(false);
        const showDrawToos = () => {
            const dom: HTMLElement = document.querySelector(`.${props.toolClass} .draw-content`) as HTMLElement;
            const outdom: HTMLElement = document.querySelector(`.${props.toolClass}.me-tools`) as HTMLElement;
            if (outdom?.style.width === "786px") {
                isOpen.value = false;
                outdom.style.width = "378px";
            } else {
                isOpen.value = true;
                outdom.style.width = "786px";
            }
            const width2 = 786 - 378;
            if (dom?.style.width === width2 + "px") {
                dom.style.width = "0px";
            } else {
                dom.style.width = width2 + "px";
            }
        };

        // 工具栏
        const openPaintTool = (event: MouseEvent, type: string) => {
            const target = event.target as HTMLDivElement;
            const { left, top } = target.getBoundingClientRect();
            if (type === "paint") {
                drawingShow.value = true;
                isShowPen.value = true;
                nextTick(() => {
                    whiteboardOption("setPenSize", currentLineWidth.value);
                    whiteboardOption("setPenColor", currentDrawColor.value);
                })
                penLeft.value = left;
                penTop.value = top;
            }
            if (type === "eraser") {
                drawingShow.value = true;
                nextTick(() => {
                    drawingBoardRef.value.whiteboardOption("setEraser")
                })
            }
            if (type === "mouse") {
                drawingShow.value = false;
                drawingBoardRef.value.whiteboardOption("setMouse")
            }
            if (type === "rulers") {
                drawingShow.value = true;
                isShowRulers.value = true;
                rulersLeft.value = left;
                rulersTop.value = top;
            }

        };
        // 尺规工具点击回调
        const setRulersTool = (value: any) => {
            isShowRulers.value = true;
            drawingBoardRef.value.whiteboardOption("openTool", value)
        };
        // 撤销
        const undo = () => {
            drawingBoardRef.value.undo()
        };
        // 回退
        const redo = () => {
            drawingBoardRef.value.redo()
        };
        // 画笔其它配置
        const whiteboardOption = (option: string, value?: number | string) => {
            // emit("whiteboardOption", option, value);
            drawingBoardRef.value.whiteboardOption(option, value)
        };
        const setEraserSize = (value: number) => {
            drawingBoardRef.value.whiteboardOption("setEraserSize", value)
        };

        return {
            noMinix,
            resolutionSwitchValue,
            questionSwitchValue,
            imageUrl,
            questionEditList,
            sum,
            number,
            nextIndex,
            isNextBtn,
            isLastBtn,
            isBlackboard,
            btnType,
            voiceUrl,
            nextPage,
            brushHandle,
            closeQuestion,
            type,
            lastPage,
            childRef,
            playSounds,
            clearBoard,
            eraserHandle,
            lookSimilarQuestions,
            smallQuestion,
            removeQuestion,
            playAudio,
            imageRef,
            voiceUrlMap,
            questionSn,
            audioRef,
            isElectron,
            drawingShow,
            keydownListener,
            canvasData,
            drawingBoardRef,
            showDrawToos,
            isOpen,
            openPaintTool,
            toolType,
            setRulersTool,
            isShowRulers,
            rulersLeft,
            rulersTop,
            isShowPen,
            penLeft,
            penTop,
            whiteboardOption,
            undo,
            redo,
            isCanUndo,
            isCanRedo,
            currentDrawColor,
            currentLineWidth,
            eraserLineWidth,
            setEraserSize,
            getQuestionEditList
        };
    },
    components: { DrawingBoard, PenTool, RulersTool, MathJax }
});
</script>

<style lang="scss" scoped>
.active {
    border: 3px solid #4b71ee;
    border-radius: 10px;
}

.warp {
    height: 100%;
    display: flex;
    flex-direction: column;
}

.frames-box {
    width: 100%;
    height: 100%;
    position: relative;
    flex: 1;
    display: flex;
    flex-direction: column;

    .file-sn {
        position: absolute;
        left: 20px;
        top: -20px;
        color: #999;
        font-size: 16px;
    }

    > p {
        font-size: 20px;
        font-weight: 600;
        color: #19203d;
        line-height: 28px;
        text-align: center;
        margin-top: 16px;
    }

    .count {
        position: absolute;
        top: 0px;
        right: 20px;
    }

    .material-box {
        height: 90%;
        overflow: auto;

        width: 90%;
        margin: 36px auto 0;
        border: solid 1px #ccc;
        position: relative;
        //flex: 1;

        .question-img {
            width: 100%;
            height: 100%;
            position: absolute;
        }

        .editd-data {
            padding: 20px;

            .items {
                .text {
                    margin-bottom: 10px;
                }
            }

            .answers {
                .text {
                    margin-bottom: 10px;
                }

                margin-top: 20px;
            }

        }
    }
}

.dialog-footer {
    width: 100%;
    height: 80px;
    padding: 12px;
    background: rgb(125, 164, 236);
    display: flex;
    align-items: center;
    position: relative;

    .switch-box {
        margin-right: 100px;

        > div {
            display: inline-block;
            text-align: center;
            margin-right: 20px;

            p {
                text-align: center;
                margin-top: 10px;
            }
        }
    }

    .btn-warp {
        flex: 1;
        display: flex;
        justify-content: flex-end;
    }

    .btn-list {
        display: flex;

        .button {
            width: 64px;
            height: 64px;
            cursor: pointer;
            margin-right: 20px;

            p {
                text-align: center;
                font-size: 12px;
                color: #4b71ee;
                line-height: 24px;
                margin-top: 40px;
                font-weight: 550;
            }

            &:nth-child(1) {
                background: url("./../../assets/look/btn_tiyin@2x.png");
                background-size: 100% 100%;
            }

            &:nth-child(2) {
                background: url("./../../assets/look/btn_jiexi@2x.png");
                background-size: 100% 100%;
            }

            &.pen {
                background: url("./../../assets/look/btn_huabi@2x.png");
                background-size: 100% 100%;
            }

            &.close {
                background: url("./../../assets/look/btn_guanbi@2x.png");
                background-size: 100% 100%;

                p {
                    color: #fff;
                }
            }

            &.mini {
                background: url("./../../assets/look/btn_zuixiaohua@2x.png");
                background-size: 100% 100%;
            }

            &.prev {
                background: url("./../../assets/look/btn_shangyiye@2x.png");
                background-size: 100% 100%;
            }

            &.prev.disabled {
                background: url("./../../assets/look/btn_shangyiye_disabled@2x.png");
                background-size: 100% 100%;

                p {
                    color: #4b71ee;
                }
            }

            &.next {
                background: url("./../../assets/look/btn_xiayiye@2x.png");
                background-size: 100% 100%;
                width: 120px;

                p {
                    color: #fff;
                }
            }

            &.next.disabled {
                background: url("./../../assets/look/btn_xiayiye_disabled@2x.png");
                background-size: 100% 100%;

                p {
                    color: #4b71ee;
                }
            }
        }
    }
}

// 左边-新的按钮样式
.nextpage {
    cursor: move;
    position: fixed;
    left: 3vw;
    bottom: 4vh;
    z-index: 99999;

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

        img {
            width: 18px;
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
            background: url("~@/views/preparation/intelligenceClassroom/images/slices/arrow_right_blue.png");
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
            background: url("~@/views/preparation/intelligenceClassroom/images/slices/arrow_right_white.png");
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
    z-index: 99999;
    cursor: move;
    height: 64px;
    display: flex;
    overflow: auto;
    bottom: 4vh;
    right: 6vw;
    width: 378px;
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
            right: 378px;
            height: 100%;
            transition: width 0.5s, transform 0.5s;
        }

        .me-tools-righttool {
            position: absolute;
            right: 0;
            width: 378px;
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
    width: 406px;
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
