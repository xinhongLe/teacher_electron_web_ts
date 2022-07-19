<template>
    <div class="me-timer-dialog">
        <div class="me-timer-header">
            <div class="me-timer-little">
                <p>计时器</p>
                <div class="rightbox">
                    <span class="minimize" @click.stop="minimizeHandle"
                        >最小化</span
                    >
                    <span class="colse" @click.stop="close"></span>
                </div>
            </div>
            <div class="me-timer-tab">
                <span
                    :class="activeIndex == 0 ? 'active' : ''"
                    @click="activeIndex = 0"
                    >倒计时</span
                >
                <span
                    :class="activeIndex == 1 ? 'active' : ''"
                    @click="activeIndex = 1"
                    >计时器</span
                >
            </div>
            <div style="margin: auto" v-if="activeIndex == 0">
                <div
                    class="me-timer-count-down"
                    v-show="!isPlay"
                    :class="isPlay ? 'me-timer-count-down-disabled' : ''"
                >
                    <div class="me-timer-count-down-num">
                        <div @click="add(0)">+</div>
                        <div>{{ countDownList[0] }}</div>
                        <div @click="reduce(0)">-</div>
                    </div>
                    <div class="me-timer-count-down-num">
                        <div @click="add(1)">+</div>
                        <div>{{ countDownList[1] }}</div>
                        <div @click="reduce(1)">-</div>
                    </div>
                    <div class="spot">:</div>
                    <div class="me-timer-count-down-num">
                        <div @click="add(2)">+</div>
                        <div>{{ countDownList[2] }}</div>
                        <div @click="reduce(2)">-</div>
                    </div>
                    <div class="me-timer-count-down-num">
                        <div @click="add(3)">+</div>
                        <div>{{ countDownList[3] }}</div>
                        <div @click="reduce(3)">-</div>
                    </div>
                </div>
                <div class="me-timer-count-down me-timer" v-show="isPlay">
                    <div class="me-timer-num">{{ countDownList[0] }}</div>
                    <div class="me-timer-num">{{ countDownList[1] }}</div>
                    <div class="spot">:</div>
                    <div class="me-timer-num">{{ countDownList[2] }}</div>
                    <div class="me-timer-num">{{ countDownList[3] }}</div>
                </div>
            </div>

            <div v-else class="me-timer-count-down me-timer">
                <div class="me-timer-num">{{ timeList[0] }}</div>
                <div class="spot">:</div>
                <div class="me-timer-num">{{ timeList[1] }}</div>
            </div>
            <div class="me-timer-btns">
                <div v-if="!isPause">
                    <span v-if="!isPlay" @click="play('0')">开始</span>
                    <span v-if="isPlay" @click="pauseTimer">暂停</span>
                </div>

                <div class="resetbox" v-if="isPause">
                    <span @click="reset">重置</span>
                    <span @click="play('1')">继续</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import isElectron from "is-electron";
import { computed, defineComponent, ref, watch } from "vue";

const { setInterval, clearInterval } = require("timers");
export default defineComponent({
    setup() {
        const activeIndex = ref(0);
        const isPlay = ref(false);
        const countDownList = ref([0, 5, 0, 0]);
        const timeList = ref(["00", "00"]);
        const isPause = ref(false);
        const second = ref(300);
        const timer = ref();
        const time = ref(0);
        const isHide = ref(false);

        const showTime = computed(() => {
            let showTime = "";
            if (activeIndex.value === 0) {
                showTime = `${countDownList.value[0]}${countDownList.value[1]}:${countDownList.value[2]}${countDownList.value[3]}`;
            } else {
                showTime = timeList.value.join(":");
            }

            return showTime;
        });

        const minimizeHandle = () => {
            isHide.value = true;
            window.electron.hideWindow();
            window.electron.ipcRenderer.invoke("timerWinHide", showTime.value);
        };

        const close = () => {
            window.electron.destroyWindow();
        };

        const add = (index: number) => {
            if (isPlay.value) return;
            if (index === 2) {
                if (countDownList.value[index] < 5) {
                    countDownList.value[index]++;
                } else {
                    countDownList.value[index] = 0;
                }
            } else {
                if (countDownList.value[index] < 9) {
                    countDownList.value[index]++;
                } else {
                    countDownList.value[index] = 0;
                }
            }
        };

        const reduce = (index: number) => {
            if (isPlay.value) return;
            if (index === 2) {
                if (
                    countDownList.value[index] < 6 &&
                    countDownList.value[index] > 0
                ) {
                    countDownList.value[index]--;
                } else {
                    countDownList.value[index] = 5;
                }
            } else {
                if (
                    countDownList.value[index] < 10 &&
                    countDownList.value[index] > 0
                ) {
                    countDownList.value[index]--;
                } else {
                    countDownList.value[index] = 9;
                }
            }
        };

        function setCountDownList() {
            countDownList.value[0] = Math.floor(second.value / 600);
            countDownList.value[1] = Math.floor(
                (second.value - countDownList.value[0] * 600) / 60
            );
            countDownList.value[2] = Math.floor(
                (second.value -
                    countDownList.value[0] * 600 -
                    countDownList.value[1] * 60) /
                    10
            );
            countDownList.value[3] =
                second.value -
                countDownList.value[0] * 600 -
                countDownList.value[1] * 60 -
                countDownList.value[2] * 10;
        }

        function setTimeList() {
            const h = Number(
                Math.floor(time.value / 600) < 10
                    ? "0" + String(Math.floor(time.value / 3600))
                    : Math.floor(time.value / 3600)
            );
            const m = String(
                Math.floor((time.value - h * 600) / 60) < 10
                    ? "0" + String(Math.floor((time.value - h * 600) / 60))
                    : Math.floor((time.value - h * 600) / 60)
            );
            timeList.value[0] = m;
            const s = String(
                time.value - h * 600 - Number(m) * 60 < 10
                    ? "0" + String(time.value - h * 600 - Number(m) * 60)
                    : time.value - h * 600 - Number(m) * 60
            );
            timeList.value[1] = s;
        }

        function reset() {
            isPlay.value = false;
            isPause.value = false;
            timer.value && clearInterval(timer.value);
            if (activeIndex.value === 0) {
                second.value = 300;
                setCountDownList();
            } else {
                time.value = 0;
                setTimeList();
            }
        }

        const play = (type: string) => {
            if (activeIndex.value === 0) {
                second.value =
                    countDownList.value[0] * 600 +
                    countDownList.value[1] * 60 +
                    countDownList.value[2] * 10 +
                    countDownList.value[3];
                if (second.value === 0) return;
                if (type === "0") {
                    isPlay.value = true;
                } else if (type === "1") {
                    isPlay.value = true;
                    isPause.value = false;
                }
                clearInterval(timer.value);
                timer.value = setInterval(() => {
                    if (second.value === 1) {
                        clearInterval(timer.value);
                        isPlay.value = false;
                        isElectron() && window.electron.showWindow();
                        isElectron() && window.electron.ipcRenderer.invoke("hideTimerWin");
                    }
                    second.value--;
                    setCountDownList();
                }, 1000);
            } else {
                if (type === "0") {
                    isPlay.value = true;
                } else if (type === "1") {
                    isPlay.value = true;
                    isPause.value = false;
                }
                clearInterval(timer.value);
                timer.value = setInterval(() => {
                    time.value++;
                    setTimeList();
                }, 1000);
            }
        };

        const pauseTimer = () => {
            isPlay.value = false;
            isPause.value = true;
            timer.value && clearInterval(timer.value);
        };

        watch(activeIndex, reset);

        watch(showTime, (v) => {
            if (isHide.value) {
                window.electron.ipcRenderer.invoke("timeChange", v);
            }
        });

        return {
            activeIndex,
            isPlay,
            timeList,
            isPause,
            close,
            minimizeHandle,
            add,
            reduce,
            play,
            reset,
            pauseTimer,
            countDownList
        };
    }
});
</script>

<style lang="scss">
#app {
    width: 100vw;
    height: 100vh;
    -webkit-app-region: drag;
}
.me-timer-dialog {
    width: 100%;
    height: 100%;
    background: rgb(22, 18, 53);
}
.me-timer-header {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}
.me-timer-little {
    background: rgb(44, 10, 122);
    display: flex;
    margin: 0;
    height: 60px;
    padding: 0 20px;
    align-items: center;
    justify-content: space-between;
}
.me-timer-little > p {
    font-size: 16px;
    text-align: center;
    color: #ffffff;
}
.rightbox {
    display: flex;
}
.colse {
    display: inline-block;
    position: relative;
    width: 50px;
    height: 30px;
    background: #666;
    cursor: pointer;
    -webkit-app-region: no-drag;
}
.colse::before,
.colse::after {
    position: absolute;
    content: " ";
    background-color: #ffffff;
    left: 25px;
    top: 5px;
    width: 2px;
    height: 20px;
}
.colse::before {
    transform: rotate(45deg);
}
.colse::after {
    transform: rotate(-45deg);
}

.minimize {
    display: inline-block;
    width: 50px;
    height: 30px;
    background: #666;
    color: #ffffff;
    text-align: center;
    line-height: 30px;
    margin-right: 16px;
    cursor: pointer;
    -webkit-app-region: no-drag;
}

.me-timer-tab {
    margin: 40px auto;
    display: flex;
    width: 200px;
    height: 30px;
    line-height: 30px;
    justify-content: space-between;
    border-radius: 4px;
}
.me-timer-tab span {
    width: 45%;
    display: block;
    text-align: center;
    color: rgb(221, 221, 221);
    font-size: 14px;
    border: 1px solid rgb(76, 74, 102);
    border-radius: 6px;
    cursor: pointer;
    -webkit-app-region: no-drag;
}
.me-timer-tab .active {
    color: #fff;
    background: #2a59da;
}
.me-timer-count-down {
    width: 480px;
    display: flex;
    height: 180px;
    margin: auto;
}
.me-timer-count-down-num {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    width: 100px;
    align-items: center;
    background: linear-gradient(
        180deg,
        rgba(238, 238, 238, 0) 0%,
        #2c294d 49%,
        rgba(13, 25, 58, 0) 100%
    );
}
.me-timer-count-down-num div:nth-of-type(1),
.me-timer-count-down-num div:nth-of-type(3) {
    width: 48px;
    user-select: none;
    height: 28px;
    text-align: center;
    line-height: 28px;
    font-size: 20px;
    border: 1px solid #ddd;
    border-radius: 22px;
    color: #ffffff;
    cursor: pointer;
    -webkit-app-region: no-drag;
}
.me-timer-count-down-num div:nth-of-type(2) {
    flex: 1;
    user-select: none;
    width: 100%;
    color: #ffffff;
    font-size: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
}

.me-timer-count-down .spot {
    font-size: 80px;
    line-height: 200px;
    flex: 1;
    margin-top: -15px;
    text-align: center;
    color: #ffffff;
}
.me-timer-btns {
    height: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 200px;
    background: rgb(44, 10, 122);
}
.resetbox {
    flex: 1;
    display: flex;
    justify-content: space-between;
}
.me-timer-btns span {
    display: inline-block;
    width: 120px;
    height: 40px;
    background: #077ce9;
    font-size: 16px;
    color: rgb(252, 250, 250);
    text-align: center;
    cursor: pointer;
    -webkit-app-region: no-drag;
    line-height: 40px;
}
.me-timer-btns i {
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    width: 110px;
    height: 110px;
    margin-top: -40px;
    display: flex;
    background: #fff;
    justify-content: center;
    align-items: center;
}

.me-timer {
    align-items: center;
    width: 240px;
    padding-bottom: 20px;
    box-sizing: border-box;
}
.me-timer .me-timer-num {
    font-size: 92px;
    color: #f8f6f6;
}
.me-timer .spot {
    font-size: 70px;
    margin-top: -15px;
}
</style>
