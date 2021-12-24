<template>
    <div class="me-tools" ref="metools">
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
        </div>
        <div class="me-tools-system">
            <div class="me-tool-btn" @click="fullScreen" v-if="!activeFlag">
                <img src="../../images/quanping_rest.png" alt="" />
            </div>
            <div class="me-tool-btn" @click="fillScreen" v-else>
                <img src="../../images/tuichuquanping_rest.png" alt="" />
            </div>
            <div class="me-tool-btn" @click="toggleRemark">
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
    </div>
</template>

<script lang="ts">
import { ref, defineComponent, watch, onMounted, onUnmounted } from "vue-demi";
import { enterFullscreen, exitFullscreen, isFullscreen } from "@/utils/fullscreen";
import { useRouter } from "vue-router";
import isElectron from "is-electron";
import { sleep } from "@/utils/common";
export default defineComponent({
    props: ["showRemark"],
    setup(props, { emit }) {
        const router = useRouter();
        const type = ref("mouse");
        const isLast = ref(false);
        const isFirst = ref(false);
        const showremark = ref(true);
        const scale = ref(1);
        const goback = () => {
            router.push("/");
        };
        const switchFlag = ref(false);
        const activeFlag = ref(false);
        watch(
            () => props.showRemark,
            () => {
                showremark.value = props.showRemark;
            }
        );
        onMounted(() => {
            window.addEventListener("keydown", keyDown);
            window.addEventListener("resize", onResize);
        });
        onUnmounted(() => {
            window.removeEventListener("resize", onResize);
            window.removeEventListener("keydown", keyDown);
        });
        const onResize = async () => {
            if (switchFlag.value && isFullscreen()) {
                switchFlag.value = false;
            } else if (!switchFlag.value && isFullscreen()) {
            } else {
                if (isElectron()) return false;
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
        const keyDown = async (e:any) => {
            if (!isElectron()) return false;
            if (e.keyCode === 27) {
                if (!activeFlag.value) return false;
                activeFlag.value = false;
                if (!isFullscreen()) return false;
                exitFullscreen();
                emit("clockFullScreen");
            }
        };
        // 点击全屏
        const fullScreen = async () => {
            if ((window as any).electron && !(window as any).electron.isFullScreen() && !(window as any).electron.isMac()) {
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
        const hideWriteBoard = () => {
            emit("hideWriteBoard");
        };
        return {
            scale,
            type,
            isLast,
            isFirst,
            activeFlag,
            showremark,
            goback,
            toggleRemark,
            prevStep,
            nextStep,
            fullScreen,
            fillScreen,
            showWriteBoard,
            hideWriteBoard
        };
    }
});
</script>

<style lang="scss" scoped>
.me-tools {
    background-color: #bccfff;
    padding: 10px;
    display: flex;
}

.me-tools-canvas {
    justify-content: flex-end;
    margin-right: 50px;
    flex: 3;
}

.me-tools-canvas,
.me-tools-screen,
.me-tools-system,
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
    height: 60px;
    width: 120px;
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
    width: 60px;
    height: 60px;
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
</style>
