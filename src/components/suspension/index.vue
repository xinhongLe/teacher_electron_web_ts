<template>
    <div class="suspension-container">
        <div
            v-show="isShowTimer && !isShowHelper"
            :style="
                isElectron
                    ? undefined
                    : { bottom: `${bottom + 140}px`, right: `${right + 100}px` }
            "
            @mousedown="mouseDown"
            class="timer"
            ref="timerRef"
        >
            <span>{{ time }}</span>
            <i class="icon-close" ref="iconCloseRef"></i>
        </div>
        <div
            class="suspension"
            ref="susDom"
            @mousedown="mouseDown($event)"
            v-show="!isShowHelper && !isShowWelt"
            :style="
                isElectron
                    ? undefined
                    : { bottom: `${bottom}px`, right: `${right}px` }
            "
        >
            <img
                src="@/assets/images/suspension/btn_zhikezhushou@2x_Blue.png"
            />
        </div>
        <div
            class="welt"
            :style="isElectron ? undefined : { bottom: `${bottom}px` }"
            v-show="isShowWelt"
            @mouseover="onmouseover"
        >
            <img src="@/assets/images/suspension/pic_shouqi@2x_copy.png" />
        </div>
        <transition name="slide">
            <Helper v-if="isShowHelper" @close-helper="isShowHelper = false" />
        </transition>
    </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from "vue";
import isElectron from "is-electron";
import Helper from "./helper.vue";
export default defineComponent({
    components: {
        Helper
    },
    setup() {
        const bottom = ref(100);
        const right = ref(40);
        const dragePosition = reactive({
            x: 0,
            y: 0
        });
        const isShowHelper = ref(false);
        const isStartMove = ref(false);
        const isShowWelt = ref(false);
        const isShowTimer = ref(false);
        const isMove = ref(false);
        const susDom = ref(null);
        const time = ref();
        const timerRef = ref<HTMLDivElement>();
        const iconCloseRef = ref<HTMLLIElement>();

        const mouseDown = (event: MouseEvent) => {
            isStartMove.value = true;
            const { clientX, clientY } = event;
            dragePosition.x = clientX;
            dragePosition.y = clientY;
            if (isElectron()) {
                window.electron.ipcRenderer.invoke("window-move-open", true);
            }
            document.onmousemove = (event) => {
                if (isStartMove.value) {
                    const { clientX, clientY } = event;
                    const x = dragePosition.x - clientX;
                    const y = dragePosition.y - clientY;
                    if (x === 0 && y === 0) return;
                    dragePosition.x = clientX;
                    dragePosition.y = clientY;
                    if (!isElectron()) {
                        if (
                            bottom.value + y < -15 ||
                            right.value + x > document.body.clientWidth - 140 ||
                            bottom.value + y > document.body.clientHeight - 140
                        ) {
                            return;
                        }
                        right.value += x;
                        bottom.value += y;
                    }
                    isMove.value = true;
                }
            };
            document.onmouseup = () => {
                if (!isMove.value && isStartMove.value) {
                    if (isElectron()) {
                        if (event.target === timerRef.value) {
                            window.electron.ipcRenderer.invoke("openTimerWin");
                        } else if (event.target === iconCloseRef.value) {
                            window.electron.ipcRenderer.invoke("closeTimerWin");
                        } else {
                            window.electron.ipcRenderer.invoke(
                                "openUnfoldSuspension"
                            );
                        }
                    } else {
                        isShowHelper.value = true;
                    }
                }
                isElectron() &&
                    window.electron.ipcRenderer.invoke(
                        "window-move-open",
                        false
                    );
                isMove.value = false;
                isStartMove.value = false;
                if (right.value < 10) {
                    isShowWelt.value = true;
                }
                document.onmousemove = null;
                document.onmouseup = null;
            };
        };

        const onmouseover = () => {
            isShowWelt.value = false;
            right.value = 10;
            if (isElectron()) {
                window.electron.ipcRenderer.invoke("cancelWelt");
            }
        };

        onMounted(() => {
            if (isElectron()) {
                window.electron.ipcRenderer.on("showWelt", () => {
                    isShowWelt.value = true;
                });
                window.electron.ipcRenderer.on("timerWinHide", (_, _time) => {
                    isShowTimer.value = true;
                    time.value = _time;
                });
                window.electron.ipcRenderer.on("timerWinClose", () => {
                    isShowTimer.value = false;
                    time.value = null;
                });
                window.electron.ipcRenderer.on("timeChange", (_, _time) => {
                    time.value = _time;
                });
            }
        });
        return {
            bottom,
            right,
            dragePosition,
            isShowHelper,
            isStartMove,
            isShowWelt,
            isElectron: isElectron(),
            isMove,
            isShowTimer,
            susDom,
            timerRef,
            mouseDown,
            onmouseover,
            iconCloseRef,
            time
        };
    }
});
</script>

<style lang="scss" scoped>
.suspension-container {
    position: fixed;
    z-index: 9999;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    .timer {
        width: 75px;
        height: 75px;
        border-radius: 50%;
        background: palevioletred;
        position: fixed;
        z-index: 9999;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #ffffff;
        background: url("../../assets/images/suspension//btn_clock@2x.png") no-repeat center;
        background-size: contain;
        font-size: 16px;
        .icon-close {
            display: inline-block;
            position: absolute;
            width: 20px;
            height: 20px;
            right: 6px;
            top: 4px;
            background: rgb(245, 67, 67);
            cursor: pointer;
            border-radius: 50%;
            -webkit-app-region: no-drag;
            pointer-events: all;
        }
        .icon-close::before,
        .icon-close::after {
            position: absolute;
            content: " ";
            background-color: #ffffff;
            left: 10px;
            top: 5px;
            width: 2px;
            height: 10px;
        }
        .icon-close::before {
            transform: rotate(45deg);
        }
        .icon-close::after {
            transform: rotate(-45deg);
        }
        * {
            pointer-events: none;
        }
    }
    .suspension {
        position: fixed;
        cursor: pointer;
        width: 120px;
        z-index: 9999;
        bottom: 0;
        -webkit-app-region: no-drag;
        img {
            width: 100%;
            user-select: none;
            pointer-events: none;
        }
    }
    .welt {
        position: fixed;
        right: 0;
        z-index: 9999;
        height: 85px;
        cursor: pointer;
        img {
            height: 100%;
        }
    }
}
.slide-enter-active,
.slide-leave-active {
    transition: all 0.5s;
}
.slide-enter,
.slide-leave-to {
    transform: translateY(100%);
    opacity: 0;
}
</style>
