<template>
    <div class="me-tools" ref="metools">
        <div class="me-tools-set">
            <div class="setting" v-show="isShowMenu">
                <span @click.stop="isShowSubMenu = true" class="setting-item"
                    >【下一步】位置设置 ></span
                >
                <div class="setting-sub-menu" v-show="isShowSubMenu">
                    <div
                        v-for="item in nextSettingTypeList"
                        :key="item.text"
                        class="menu"
                        @click="changeNextType(item.type)"
                    >
                        {{ item.text }}
                    </div>
                </div>
            </div>
            <div
                class="me-tool-btn setting-btn"
                @click.stop="isShowMenu = true"
            >
                <img src="../../images/btn_more.png" />
            </div>
            <div
                class="me-tool-btn setting-btn"
                @click="nextStep"
                v-show="
                    selectNextType === NextSettingType.Left ||
                    selectNextType === NextSettingType.All
                "
            >
                <img src="../../images/btn_next.png" />
            </div>
        </div>
        <!-- <div class="me-tool-btn invoking-btn-warp" @click="showResourceDialog = true">
            <img src="../../images/btn_diaoyong@2x.png"/>
        </div> -->
        <div class="me-tools-screen"></div>
        <div class="me-tools-canvas">
            <div
                class="me-tool-btn"
                :class="type === 'mouse' && 'active'"
                @click="hideWriteBoard"
            >
                <img
                    v-if="type !== 'mouse'"
                    src="../../images/shubiao_rest.png"
                    alt=""
                />
                <img
                    v-if="type === 'mouse'"
                    src="../../images/shubiao_selected.png"
                    alt=""
                />
            </div>
            <div
                class="me-tool-btn"
                :class="type === 'pen' && 'active'"
                @click="showWriteBoard"
            >
                <img
                    v-if="type !== 'pen'"
                    src="../../images/huabi_rest.png"
                    alt=""
                />
                <img
                    v-if="type === 'pen'"
                    src="../../images/huabi_selected.png"
                    alt=""
                />
            </div>
            <div
                class="me-tool-btn"
                @click="openShape"
            >
                <img
                    src="../../images/icon_rest_xz_big.png"
                    alt=""
                />
            </div>
        </div>
        <div class="me-tools-system">
            <template v-if="isShowFullscreen && !dialog">
                <div class="me-tool-btn" @click="fullScreen" v-if="!activeFlag">
                    <img src="../../images/quanping_rest.png" alt="" />
                </div>
                <div class="me-tool-btn" @click="fillScreen" v-else>
                    <img src="../../images/tuichuquanping_rest.png" alt="" />
                </div>
            </template>

            <div @click.stop="closeWincard" v-if="!dialog" class="me-tool-btn close-button">
                <p>关闭</p>
            </div>

            <div
                class="me-tool-btn"
                @click="toggleRemark"
                v-if="isShowRemarkBtn"
            >
                <img
                    v-if="!showremark"
                    src="../../images/xianshibeizhu_rest.png"
                    alt=""
                />
                <img
                    v-if="showremark"
                    src="../../images/yincangbeizhu_rest.png"
                    alt=""
                />
            </div>
        </div>
        <div class="me-tools-steps">
            <div class="me-tool-btn" :disabled="isFirst" @click="prevStep">
                <img
                    v-if="!isFirst"
                    src="../../images/shangyiye_rest.png"
                    alt=""
                />
                <img
                    v-if="isFirst"
                    src="../../images/shangyiye_disabled.png"
                    alt=""
                />
            </div>
            <div
                class="me-tool-btn next-step"
                :disabled="isLast"
                @click="nextStep"
                v-show="
                    selectNextType === NextSettingType.Right ||
                    selectNextType === NextSettingType.All
                "
            >
                <img
                    v-if="!isLast"
                    src="../../images/xiayiye_rest.png"
                    alt=""
                />
                <img
                    v-if="isLast"
                    src="../../images/xiayiye_disabled.png"
                    alt=""
                />
            </div>
        </div>
        <div class="me-tool-btn" v-if="isShowClose" @click="$emit('close')">
            <img src="../../images/guanbi_rest.png" />
        </div>
        <ResourceDialog v-if="showResourceDialog" v-model="showResourceDialog"/>
    </div>

</template>

<script lang="ts">
import { ref, defineComponent, watch, onMounted, onUnmounted, computed, onActivated, onDeactivated } from "vue";
import {
    enterFullscreen,
    exitFullscreen,
    isFullscreen
} from "@/utils/fullscreen";
import { useRouter } from "vue-router";
import isElectron from "is-electron";
import { sleep } from "@/utils/common";
import { STORAGE_TYPES, set, get } from "@/utils/storage";
import { MutationTypes, store } from "@/store";
import { NextSettingType } from "@/types/preparation";
import ResourceDialog from "./resourceDialog.vue";
export default defineComponent({
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
        isShowClose: {
            type: Boolean,
            default: false
        },
        dialog: {
            type: Boolean,
            default: false
        }
    },
    setup(props, { emit }) {
        const router = useRouter();
        const type = ref("mouse");
        const isLast = ref(false);
        const isFirst = ref(false);
        const showremark = ref(true);
        const scale = ref(1);
        const selectNextType = computed(() => store.state.preparation.selectNextType);
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
                type: NextSettingType.Right
            },
            {
                text: "仅左侧",
                type: NextSettingType.Left
            },
            {
                text: "左右侧",
                type: NextSettingType.All
            }
        ];
        watch(() => props.showRemark, () => {
            showremark.value = props.showRemark;
        });
        const changeNextType = (type: NextSettingType) => {
            store.commit(MutationTypes.SET_SELECT_NEXT_TYPE, type);
            set(STORAGE_TYPES.NEXT_SETTING + store.state.userInfo.id, type);
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
        });
        onUnmounted(() => {
            removeEvent();
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
                if (isElectron()) { return false; }
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
            if (!isElectron()) { return false; }
            if (e.keyCode === 27) {
                if (!activeFlag.value) { return false; }
                activeFlag.value = false;
                if (!isFullscreen()) { return false; }
                exitFullscreen();
                emit("clockFullScreen");
            }
        };
        // 点击全屏
        const fullScreen = async () => {
            if ((window as any).electron &&
                !(window as any).electron.isFullScreen() &&
                !(window as any).electron.isMac()) {
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
        const hideWriteBoard = () => {
            emit("hideWriteBoard");
        };
        function getLocalNextType() {
            const type = get(STORAGE_TYPES.NEXT_SETTING + store.state.userInfo.id);
            changeNextType(type || NextSettingType.All);
        }
        getLocalNextType();

        const closeWincard = () => {
            store.commit(MutationTypes.SET_IS_WINCARD, { flag: false,  id: "", isSystem: false });
        }

        return {
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
            closeWincard
        };
    },
    components: { ResourceDialog }
});
</script>

<style lang="scss" scoped>
.me-tools {
    background-color: #BED2FF;
    padding: 14px;
    display: flex;
    position: relative;
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
        .setting {
            position: absolute;
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
    justify-content: flex-end;
    margin-right: 50px;
    flex: 3;
}

.me-tools-canvas,
.me-tools-screen,
.me-tools-system,
.me-tools-set,
.me-tools-steps {
    display: flex;
}

.me-tools-steps {
    flex: 1;
    margin-left: 50px;
}

.me-tool-btn {
    margin: 0 10px;
    border: 2px solid #77a1ed;
    box-sizing: border-box;
    border-radius: 14px;
    overflow: hidden;
    box-shadow: 0 3px 0 #77a1ed;
    cursor: pointer;
    position: relative;
    top: 0;
    transition: all 0.1s;
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
