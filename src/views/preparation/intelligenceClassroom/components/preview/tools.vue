<template>
    <div class="me-tools" ref="metools">
        <div class="me-tools-screen"></div>
        <div class="me-tools-canvas">
            <div
                class="me-tool-btn"
                :class="type === 'mouse' && 'active'"
                @click="type = 'mouse'"
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
                @click="type = 'pen'"
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
                :class="type === 'eraser' && 'active'"
                @click="type = 'eraser'"
            >
                <img
                    v-if="type !== 'eraser'"
                    src="../../images/xiangpi_rest.png"
                    alt=""
                />
                <img
                    v-if="type === 'eraser'"
                    src="../../images/xiangpi_selected.png"
                    alt=""
                />
            </div>
            <div class="me-tool-btn" @click="clear()">
                <img src="../../images/qingkong_rest.png" alt="" />
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
        <canvas
            class="me-draw-board"
            :class="
                { mouse: 'move', pen: 'cursor-pen', eraser: 'cursor-eraser' }[
                    type
                ]
            "
            ref="canvas"
            id="canvas"
            disable-scroll="true"
            @mousedown="mousedown"
            @mousemove="mousemove"
            @mouseup="mouseup"
        ></canvas>
    </div>
</template>

<script lang="ts">
import { ref, defineComponent, watch, onMounted } from "vue-demi";
import { enterFullscreen, exitFullscreen, isFullscreen } from "@/utils/fullscreen";
import { useRouter } from "vue-router";
export default defineComponent({
    props: ["showRemark"],
    setup(props, { emit }) {
        const router = useRouter();
        const type = ref("mouse");
        const painting = ref(false);
        const lastPoint = ref({ x: 0, y: 0 });
        const ctx = ref();
        const canvas = ref();
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
            window.addEventListener("resize", onResize);
            canvas.value = document.getElementById("canvas");
            canvas.value.setAttribute("width", document.getElementsByClassName("main-body")[0].clientWidth);
            canvas.value.setAttribute("height", document.getElementsByClassName("me-work")[0].clientHeight);
            ctx.value = canvas.value.getContext("2d");
        });
        const onResize = () => {
            canvas.value.setAttribute("width", document.getElementsByClassName("main-body")[0].clientWidth);
            canvas.value.setAttribute("height", document.getElementsByClassName("me-work")[0].clientHeight);
            if (switchFlag.value && isFullscreen()) {
                switchFlag.value = false;
            } else if (!switchFlag.value && isFullscreen()) {
            } else {
                activeFlag.value = false;
                emit("clockFullScreen");
            }
        };
        const mousedown = (e: any) => {
            if (type.value !== "mouse") {
                painting.value = true;
                const x = e.offsetX;
                const y = e.offsetY;
                lastPoint.value = { x, y };
                ctx.value.strokeStyle = "red";
                ctx.value.beginPath();
            }
        };
        const mousemove = (e: any) => {
            if (painting.value) {
                const x = e.offsetX;
                const y = e.offsetY;
                const newPoint = { x, y };
                type.value === "pen"
                    ? drawLine(
                        lastPoint.value.x,
                        lastPoint.value.y,
                        newPoint.x,
                        newPoint.y
                    )
                    : setDrawPathForEraser(x, y);
                lastPoint.value = newPoint;
            }
        };
        const mouseup = () => {
            painting.value = false;
        };
        const drawLine = (x1: number, y1: number, x2: number, y2: number) => {
            ctx.value.lineWidth = 3;
            ctx.value.lineCap = "round";
            ctx.value.lineJoin = "round";
            ctx.value.moveTo(x1, y1);
            ctx.value.lineTo(x2, y2);
            ctx.value.stroke();
            ctx.value.closePath();
        };
        const setDrawPathForEraser = (x: number, y: number) => {
            ctx.value.save();
            ctx.value.beginPath();
            ctx.value.arc(x + 10, y + 10, 30 / 2, 0, Math.PI * 2, false);
            ctx.value.clip();
            clear();
            ctx.value.restore();
        };
        const clear = () => {
            ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height);
        };
        const toggleRemark = () => {
            emit("toggleRemark");
        };
        const prevStep = () => {
            emit("prevStep");
        };
        const nextStep = () => {
            emit("nextStep");
        };
        const fullScreen = () => {
            activeFlag.value = true;
            switchFlag.value = true;
            emit("fullScreen");
            enterFullscreen();
        };
        const fillScreen = () => {
            activeFlag.value = false;
            exitFullscreen();
            emit("clockFullScreen");
        };
        return {
            scale,
            type,
            isLast,
            isFirst,
            activeFlag,
            goback,
            mousedown,
            mouseup,
            mousemove,
            clear,
            toggleRemark,
            prevStep,
            nextStep,
            fullScreen,
            fillScreen
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
