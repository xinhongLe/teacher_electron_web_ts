<template>
  <div class="suspension-container">
    <div v-show="isShowTimer && !isShowHelper"
         :style="{ bottom: `${bottom + 140}px`, right: `${right +100}px` }"
         class="timer">
      <!-- <span>{{ TimerTime[0] }}</span>
      <span>:</span>
      <span>{{ TimerTime[1] }}</span> -->
    </div>
    <div class="suspension"
         ref="susDom"
         @mousedown="mouseDown($event)"
         v-show="!isShowHelper && !isShowWelt"
         :style="{ bottom: `${bottom}px`, right: `${right}px` }">
      <img src="@/assets/images/suspension/btn_zhikezhushou@2x_Blue.png" />
    </div>
    <div class="welt"
         :style="{ bottom: `${bottom}px` }"
         v-show="isShowWelt"
         @mouseover="onmouseover"
        >
      <img src="@/assets/images/suspension/pic_shouqi@2x_copy.png" />
    </div>
    <transition name="slide">
      <Helper v-if="isShowHelper"
              @close-helper="isShowHelper = false" />
    </transition>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
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
        const mouseDown = (event:MouseEvent) => {
            isStartMove.value = true;
            const { clientX, clientY } = event;
            dragePosition.x = clientX;
            dragePosition.y = clientY;
            document.onmousemove = (event) => {
                if (isStartMove.value) {
                    const { clientX, clientY } = event;
                    const x = dragePosition.x - clientX;
                    const y = dragePosition.y - clientY;
                    dragePosition.x = clientX;
                    dragePosition.y = clientY;
                    if (
                        bottom.value + y < -15 ||
                        right.value + x > document.body.clientWidth - 140 ||
                        bottom.value + y > document.body.clientHeight - 140
                    ) return;
                    right.value += x;
                    bottom.value += y;
                    isMove.value = true;
                }
            };
            document.onmouseup = () => {
                if (!isMove.value && isStartMove.value) {
                    isShowHelper.value = true;
                }
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
        };
        return {
            bottom,
            right,
            dragePosition,
            isShowHelper,
            isStartMove,
            isShowWelt,
            isMove,
            isShowTimer,
            susDom,
            mouseDown,
            onmouseover
        };
    }
});
</script>

<style lang="scss" scoped>
.suspension-container {
  position: fixed;
  z-index: 9999;
  .timer {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: palevioletred;
      position: fixed;
      z-index: 9999;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #ffffff;
    }
  .suspension {
    position: fixed;
    cursor: pointer;
    width: 140px;
    z-index: 9999;
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
