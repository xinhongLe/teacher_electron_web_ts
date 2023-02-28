<template>
    <div v-dragLine="'left'" class="nextpage">
        <!-- :style="{
            left: '30px',
            bottom: isTKdialog
                ? '56px'
                : isFullScreenStatus || isShowFullscreen
                ? '30px'
                : 0,
        }" -->
        <div class="me-tools-steps-new">
            <div class="me-tool-btn-new" :disabled="isFirst" @click="prevStep">
                <div class="icon-text">
                    <img src="../../images/slices/arrow_left.png" alt="" />
                    <span class="text">上一页</span>
                </div>
                <!-- <img v-if="!isFirst" src="../../images/shangyiye_rest.png" alt="" />
                <img v-if="isFirst" src="../../images/shangyiye_disabled.png" alt="" /> -->
            </div>
            <div class="me-tool-btn-new next-step" @click="nextStep" v-show="
                selectNextType === NextSettingType.Left ||
                selectNextType === NextSettingType.All
            ">
                <div class="icon-text">
                    <!-- <img src="../../images/slices/arrow_right_blue.png" alt="" /> -->
                    <div class="next-icon">
                    </div>
                    <span class="text">下一页</span>
                </div>
            </div>
        </div>
    </div>
    <div class="me-tools" ref="metools" v-drag>
        <!-- <div class="me-tool-btn invoking-btn-warp" @click="showResourceDialog = true">
            <img src="../../images/btn_diaoyong@2x.png"/>
        </div> -->
        <div class="me-tools-draw">
            <!-- 左边可收起的按钮 -->
            <div class="draw-content">
                <!-- <el-scrollbar :always="true"> -->
                <div class="me-tools-drag" style="display: flex">

                    <!-- 展开后工具栏最左边按钮 -->
                    <div class="me-tools-set">
                        <div class="setting" v-show="isShowMenu">
                            <span @click.stop="isShowSubMenu = true" class="setting-item">【下一步】位置设置 ></span>
                            <div class="setting-sub-menu" v-show="isShowSubMenu">
                                <div v-for="item in nextSettingTypeList" :key="item.text" class="menu"
                                    @click="changeNextType(item.type)">
                                    {{ item.text }}
                                </div>
                            </div>
                        </div>
                        <!-- 更多设置 -->
                        <div class="me-tool-btn-new" @click.stop="moreSet($event)">
                            <!-- <img src="../../images/btn_more.png" /> -->
                            <div class="icon-text">
                                <img src="../../images/slices/icon_gdsz.png" alt="" />
                                <span class="text">更多设置</span>
                            </div>
                        </div>

                        <!-- 隐藏显示教案 -->
                        <div class="me-tool-btn-new" @click="toggleRemark()" v-if="isShowRemarkBtn">
                            <div class="icon-text">
                                <img v-if="!showremark" src="../../images/slices/icon_pbja.png" alt="" />
                                <img v-if="showremark" src="../../images/slices/icon_xsja.png" alt="" />
                                <span class="text">{{ showremark ? '隐藏教案' : '显示教案' }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- 展开后工具栏中间四个按钮 -->
                    <div class="me-tools-canvas">
                        <!-- <div class="me-tool-btn" @click="openPaintTool($event, 'undo')">
                            <div class="icon-text" :class="{ disabled: !isCanUndo }">
                                <IconBack />
                                <span class="text">撤销</span>
                            </div>
                        </div>
                        <div class="me-tool-btn" @click="openPaintTool($event, 'redo')">
                            <div class="icon-text" :class="{ disabled: !isCanRedo }">
                                <IconNext />
                                <span class="text">恢复</span>
                            </div>
                        </div> -->
                        <!-- 鼠标 -->
                        <div class="me-tool-btn-new" :class="type === 'mouse' && 'btn-active'" @click="
                            hideWriteBoard(),
                            openPaintTool($event, 'mouse'),
                            (type = 'mouse')
                        ">
                            <div class="icon-text">
                                <img v-if="type !== 'mouse'" src="../../images/slices/icon_shubiao.png" alt="" />
                                <img v-if="type === 'mouse'" src="../../images/slices/icon_shubiao_white.png" alt="" />
                                <span class="text">鼠标</span>
                            </div>
                        </div>
                        <!-- 画笔 -->
                        <!-- <div class="me-tool-btn" :class="type === 'pen' && 'active'" @click="
                                openPaintTool($event, 'paint'),
                                (type = 'pen')
                            ">
                                <img v-if="type !== 'pen'" src="../../images/huabi_rest.png" alt="" />
                                <img v-if="type === 'pen'" src="../../images/huabi_selected.png" alt="" />
                            </div> -->

                        <!-- 橡皮擦 -->
                        <div class="me-tool-btn-new" :class="type === 'eraser' && 'btn-active'" @click="
                            openPaintTool($event, 'eraser'),
                            (type = 'eraser')
                        ">
                            <div class="icon-text">
                                <img v-if="type !== 'eraser'" src="../../images/slices/icon_xp.png" alt="" />
                                <img v-if="type === 'eraser'" src="../../images/slices/icon_xp_white.png" alt="" />
                                <span class="text">橡皮</span>
                            </div>
                        </div>
                        <!-- 清空笔记 -->
                        <!-- <div class="me-tool-btn" @click="openPaintTool($event, 'rest')">
                            <img src="../../images/qingkong_rest.png" alt="" />
                        </div> -->
                        <!-- 尺规:三合一-->
                        <div class="me-tool-btn-new" :class="type === 'rulers' && 'btn-active'" @click="
                            openPaintTool($event, 'rulers'),
                            (type = 'rulers')
                        ">
                            <div class="icon-text">
                                <img v-if="type !== 'rulers'" src="../../images/slices/icon_cg.png" alt="" />
                                <img v-if="type === 'rulers'" src="../../images/slices/icon_cg_white.png" alt="" />
                                <span class="text">尺规</span>
                            </div>
                        </div>
                        <!-- 形状 -->
                        <div class="me-tool-btn-new" @click="
                            openPaintTool($event, 'mouse'),
                            (type = 'mouse'),
                            openShape($event)
                        ">
                            <!-- <img src="../../images/icon_rest_xz_big.png" alt="" /> -->
                            <div class="icon-text">
                                <img src="../../images/slices/icon_xz.png" alt="" />
                                <span class="text">形状</span>
                            </div>
                        </div>
                    </div>


                    <!-- <div class="me-tools-system">
                        <div class="me-tool-btn" @click="toggleRemark" v-if="isShowRemarkBtn">
                            <img v-if="!showremark" src="../../images/xianshibeizhu_rest.png" alt="" />
                            <img v-if="showremark" src="../../images/yincangbeizhu_rest.png" alt="" />
                        </div>
                        <template v-if="isShowFullscreen && !dialog">
                            <div class="me-tool-btn" @click="fullScreen" v-if="!activeFlag">
                                <img src="../../images/quanping_rest.png" alt="" />
                            </div>
                            <div class="me-tool-btn" @click="fillScreen" v-else>
                                <img src="../../images/tuichuquanping_rest.png" alt="" />
                            </div>
                        </template>
                        <div @click.stop="closeWincard" v-if="showClose && !dialog" class="me-tool-btn close-button">
                            <p>关闭</p>
                        </div>
                    </div> -->
                    <!-- <div class="me-tools-steps">
                            <div class="me-tool-btn" :disabled="isFirst" @click="prevStep">
                                <img v-if="!isFirst" src="../../images/shangyiye_rest.png" alt="" />
                                <img v-if="isFirst" src="../../images/shangyiye_disabled.png" alt="" />
                            </div>
                        </div> -->
                    <div style="display: flex">
                        <div class="me-tool-btn" v-if="isShowClose" @click="$emit('close')">
                            <img src="../../images/guanbi_rest.png" />
                        </div>
                    </div>
                </div>
                <!-- </el-scrollbar> -->
            </div>
            <!-- 右边固定展开的按钮 -->
            <div class="me-tools-righttool">
                <!-- 展开/收起 -->
                <div @click.prevent.stop="showDrawToos" class="arrows">
                    <!-- <el-icon v-if="!isOpen">
                        <ArrowLeftBold />
                    </el-icon>
                    <el-icon v-else>
                        <ArrowRightBold />
                    </el-icon> -->
                    <img v-if="!isOpen" src="../../images/slices/icon_zhankai.png" alt="" />
                    <img v-else src="../../images/slices/icon_shouqi.png" alt="" />
                    <span class="text" v-if="!isOpen">展开</span>
                    <span class="text" v-else>收起</span>
                </div>

                <div class="me-tool-btn-line">
                </div>
                <!-- 画笔 -->
                <div class="me-tool-btn-new" :class="type === 'pen' && 'btn-active'" @click="
                    openPaintTool($event, 'paint'),
                    (type = 'pen')
                ">
                    <div class="icon-text">
                        <img v-if="type !== 'pen'" src="../../images/slices/icon_hb.png" alt="" />
                        <img v-if="type === 'pen'" src="../../images/slices/icon_hb_white.png" alt="" />
                        <span class="text">画笔</span>
                    </div>
                    <!-- <img v-if="type !== 'pen'" src="../../images/huabi_rest.png" alt="" />
                    <img v-if="type === 'pen'" src="../../images/huabi_selected.png" alt="" /> -->
                </div>
                <!-- 上一页 -->
                <div class="me-tool-btn-new" :disabled="isFirst" @click="prevStep">
                    <div class="icon-text">
                        <img src="../../images/slices/arrow_left.png" alt="" />
                        <span class="text">上一页</span>
                    </div>
                    <!-- <img v-if="!isFirst" src="../../images/shangyiye_rest.png" alt="" />
                <img v-if="isFirst" src="../../images/shangyiye_disabled.png" alt="" /> -->
                </div>
                <!-- 下一页 -->
                <div class="me-tool-btn-new next-step" style="width: 120px;" :disabled="isLast" @click="nextStep" v-show="
                    selectNextType === NextSettingType.Right ||
                    selectNextType === NextSettingType.All
                ">
                    <!-- <img v-if="!isLast" src="../../images/xiayiye_rest.png" alt="" />
                    <img v-if="isLast" src="../../images/xiayiye_disabled.png" alt="" /> -->
                    <div class="icon-text">
                        <!-- <img src="../../images/slices/arrow_right_blue.png" alt="" /> -->
                        <div class="next-icon">
                        </div>
                        <span class="text">下一页</span>
                    </div>
                </div>
                <!-- 全屏/退出全屏 -->
                <template v-if="isShowFullscreen && !dialog">
                    <div class="me-tool-btn-new" @click="fullScreen" v-if="!activeFlag">
                        <div class="icon-text">
                            <img src="../../images/slices/icon_qp.png" alt="" />
                            <span class="text">全屏</span>
                        </div>
                    </div>
                    <div class="me-tool-btn-new" @click="fillScreen" v-else>
                        <div class="icon-text">
                            <img src="../../images/slices/icon_suoxiao.png" alt="" />
                            <span class="text">退出全屏</span>
                        </div>
                    </div>
                </template>
                <!-- 关闭 -->
                <div @click.stop="closeWincard" v-if="showClose && !dialog" class="me-tool-btn-new">
                    <div class="icon-text">
                        <img src="../../images/slices/close.png" alt="" />
                        <span class="text">关闭</span>
                    </div>
                </div>
            </div>
        </div>

        <ResourceDialog v-if="showResourceDialog" v-model="showResourceDialog" />
    </div>
</template>

<script lang="ts">
import {
    ref,
    defineComponent,
    watch,
    onMounted,
    onUnmounted,
    computed,
    onActivated,
    onDeactivated,
} from "vue";
import { ArrowLeftBold, ArrowRightBold } from "@element-plus/icons-vue";
import {
    enterFullscreen,
    exitFullscreen,
    isFullscreen,
} from "@/utils/fullscreen";
import { useRouter } from "vue-router";
import isElectron from "is-electron";
import { sleep } from "@/utils/common";
import { STORAGE_TYPES, set, get } from "@/utils/storage";
import { MutationTypes, store } from "@/store";
import { NextSettingType } from "@/types/preparation";
import ResourceDialog from "./resourceDialog.vue";
import emitter from "@/utils/mitt";

export default defineComponent({
    props: {
        showRemark: {
            type: Boolean,
            default: true,
        },
        isShowRemarkBtn: {
            type: Boolean,
            default: true,
        },
        isShowFullscreen: {
            type: Boolean,
            default: true,
        },
        isFullScreenStatus: {
            type: Boolean,
            default: true,
        },
        isShowClose: {
            type: Boolean,
            default: false,
        },
        dialog: {
            type: Boolean,
            default: false,
        },
        showClose: {
            type: Boolean,
            default: true,
        },
        id: {
            type: String,
            default: "",
        },
        isCanUndo: {
            type: Boolean,
            default: false,
        },
        isCanRedo: {
            type: Boolean,
            default: false,
        },
        isTKdialog: {
            type: Boolean,
            default: false,
        },
        cardClass: {
            type: String,
            default: "intelligence",
        },
    },
    setup(props, { emit }) {
        const isOpen = ref(false);
        const showDrawToos = () => {
            const dom: any = document.querySelector(".draw-content");
            const outdom: any = document.querySelector(".me-tools");

            // const btn_class =
            //     "." + props.cardClass + " " + ".me-tools-drag .me-tool-btn";
            // const btndom: any = document.querySelectorAll(btn_class);
            // const widths = btndom.length * 81 + 532;
            // if(props.isShowClose){

            // }
            if (outdom.style.width == "1036px") {
                isOpen.value = false;
                outdom.style.width = "532px";
            } else {
                isOpen.value = true;
                outdom.style.width = "1036px";
            }
            const width2 = 1036 - 532;
            if (dom.style.width == width2 + "px") {
                dom.style.width = 0;
            } else {
                dom.style.width = width2 + "px";
            }
        };
        const router = useRouter();
        const type = ref("mouse");
        const isLast = ref(false);
        const isFirst = ref(false);
        const showremark = ref(true);
        const scale = ref(1);
        const selectNextType = computed(
            () => store.state.preparation.selectNextType
        );
        const goback = () => {
            router.push("/");
        };
        const switchFlag = ref(false);
        const activeFlag = ref(false);
        const isShowMenu = ref(false);
        const isShowSubMenu = ref(false);
        const showResourceDialog = ref(false);
        const nextSettingTypeList = [
            {
                text: "仅右侧",
                type: NextSettingType.Right,
            },
            // {
            //     text: "仅左侧",
            //     type: NextSettingType.Left,
            // },
            {
                text: "左右侧",
                type: NextSettingType.All,
            },
        ];
        watch(
            () => props.showRemark,
            () => {
                showremark.value = props.showRemark;
            }
        );
        watch(
            () => props.isFullScreenStatus,
            (val: any) => {
                // console.log(
                //     "---------------isFullScreenStatus",
                //     props.isFullScreenStatus
                // );
            },
            { deep: true }
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
            if (
                (window as any).electron &&
                !(window as any).electron.isFullScreen() &&
                !(window as any).electron.isMac()
            ) {
                (window as any).electron.setFullScreen();
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
        const showWriteBoard = () => {
            emit("showWriteBoard");
        };
        const openShape = (event: MouseEvent) => {
            emit("openShape", event);
        };
        //橡皮擦
        const openPaintTool = (event: MouseEvent, type: string) => {
            // console.log("event, type", event, type);
            emit("openPaintTool", event, type);
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

        const closeWincard = () => {
            store.commit(MutationTypes.REMOVE_FULLSCREEN_RESOURCE, {
                id: props.id,
                openMore: true,
            });
            emit("closeWincard");
        };
        //更多设置时 改变固定定位位置
        const moreSet = (e: any) => {
            const dom: any = document.querySelector(".setting");
            dom.style.left = e.clientX + "px";
            dom.style.top = e.clientY - 82 + "px";
            isShowMenu.value = true;
        };
        //关闭工具
        const closeRulersTool = (e: any) => {
            openPaintTool(e, "paint");
            type.value = "pen";
        };

        return {
            isOpen,
            scale,
            type,
            isLast,
            isFirst,
            activeFlag,
            showremark,
            goback,
            toggleRemark,
            showResourceDialog,
            prevStep,
            nextStep,
            fullScreen,
            fillScreen,
            changeNextType,
            isShowSubMenu,
            nextSettingTypeList,
            showWriteBoard,
            NextSettingType,
            isShowMenu,
            selectNextType,
            openShape,
            hideWriteBoard,
            closeWincard,
            openPaintTool,
            showDrawToos,
            moreSet,
        };
    },
    components: { ResourceDialog, ArrowLeftBold, ArrowRightBold },
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
        width: 164px;
        height: 88px;
        background: rgba(15, 39, 91, 0.15);
        border-radius: 12px;
        display: flex;
        justify-content: space-evenly;
        align-items: center;
    }
}

.me-tool-btn-new {
    cursor: pointer;
    width: 64px;
    height: 64px;
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
            font-size: 12px;
            font-family: HarmonyOS_Sans_SC_Medium;
            color: #414E65;
        }
    }
}

.me-tool-btn-line {
    width: 1px;
    height: 64px;
    background: rgba(65, 78, 101, 0.1);
    margin: 0px 5px;
}

.next-step {
    background: #F8F9FF;
    border: 2px solid #4B71EE;
    .icon-text {
        .next-icon {
            width: 24px;
            height: 24px;
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
    height: 88px;
    display: flex;
    overflow: auto;
    bottom: 9vh;
    right: 6vw;
    width: 532px;
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
            right: 532px;
            height: 100%;
            transition: width 0.5s, transform 0.5s;
        }

        .me-tools-righttool {
            position: absolute;
            right: 0;
            width: 532px;
            height: 88px;
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
                    font-size: 12px;
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
        width: fit-content;
        position: relative;
        width: 164px;
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
    width: 318px;
    align-items: center;
    margin-left: 24px;
    justify-content: space-evenly;
}

.me-tools-canvas,
.me-tools-screen,
.me-tools-system,
.me-tools-set,
.me-tools-steps {
    display: flex;
}

.me-tools-steps {
    // flex: 1;
    // margin-left: 50px;
}

.me-tool-btn {
    // margin: 0 10px;
    margin: 10px 10px;
    border: 2px solid #77a1ed;
    box-sizing: border-box;
    border-radius: 14px;
    overflow: hidden;
    box-shadow: 0 3px 0 #77a1ed;
    cursor: pointer;
    position: relative;
    top: 0;
    transition: all 0.1s;

    width: 59px;
    height: 59px;
}

.me-tool-btn.next-step {
    border: 2px solid #2f4fd8;
    box-shadow: 0 3px 0 #2f4fd8;
    height: 55px;
    width: 110px;
}

.me-tool-btn.next-step img {
    width: auto;
    position: relative;
    top: -1px;
    left: -1px;
}

.me-tool-btn.close {
    border: 2px solid #f04141;
    box-shadow: 0 3px 0 #f04141;
}

.me-tool-btn:active {
    top: 2px;
    box-shadow: 0 0 0 !important;
}

.me-tool-btn[disabled="disabled"] {
    top: 0;
    border: 2px solid #bdc0c5 !important;
    box-shadow: 0 3px 0 #bdc0c5 !important;
}

.me-tool-btn img {
    display: block;
    width: 55px;
    height: 55px;
}

.me-draw-board {
    position: fixed;
    z-index: 100;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    /* transform: translate(83px, -43px); */
    margin: auto;
}

.me-tool-btn.active {
    border-color: #4b71ee;
    box-shadow: 0 3px 0 #4b71ee;
}

.me-tool-btn {
    .icon-text {
        background: #e5eeff;
        width: 55px;
        height: 55px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
        padding: 4px 0;

        .i-icon {
            font-size: 28px;
        }

        .text {
            font-size: 12px;
            font-weight: bold;
            color: #4467a9;
        }

        &.disabled {
            color: #aaa;
            cursor: not-allowed;
        }
    }
}

.me-draw-board.move {
    pointer-events: none;
}

.me-draw-board.cursor-pen {
    cursor: url("../../images/mouse_pic.png"), auto;
}

.me-draw-board.cursor-eraser {
    cursor: url("../../images/mouse_xiangpi.png"), auto;
}

.invoking-btn-warp {
    display: flex;
    width: 180px;
    height: 64px;
    border-color: #2085ef;
    box-shadow: 0 3px 0 #2085ef;
    margin-left: 20px;

    img {
        width: 180px;
        height: 64px;
    }
}

.close-button {
    background: url("~@/assets/look/btn_guanbi@2x.png");
    background-size: 100% 100%;
    box-sizing: content-box;
    width: 55px;
    height: 55px;
    display: flex;
    align-items: flex-end;
    justify-content: center;

    p {
        color: #fff;
        font-size: 12px;
        font-weight: 600;
        margin-bottom: 5px;
    }
}
</style>
