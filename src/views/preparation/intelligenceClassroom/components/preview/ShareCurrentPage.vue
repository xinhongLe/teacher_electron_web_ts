<template>
    <div class="share-page" v-dragLine.stop="'left'">
        <div class="share-title">
            <div class="left">
                <img src="../../images/slices/icon_fenxiang.png" alt="">
                <span>正在分享该页</span>
            </div>
            <img v-if="isOpen" @click="isOpen = false" class="arrows" src="../../images/slices/icon_arrow1.png" alt="">
            <img v-else @click="isOpen = true" class="arrows" src="../../images/slices/icon_arrow2.png" alt="">
        </div>
        <div class="share-content" v-if="isOpen">
            <div class="content">
                <div class="time-num">
                    <span class="top">{{ showTime }}</span>
                    <span class="bottom">计时</span>
                </div>
                <div class="line"></div>
                <div class="time-num">
                    <span class="top">0/30</span>
                    <span class="bottom">提交人数</span>
                </div>
            </div>
            <div class="btns" @click.stop.prevent="collectQuestions">
                收题
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {onActivated, onDeactivated, onMounted, provide, ref, watchEffect, PropType, toRef, onUnmounted} from "vue";
import useCountDown from "@/hooks/useCountDown";

const {showTime, startCountDown, endCountDown} = useCountDown();

const props = defineProps({
    shareVisible: {
        type: Boolean,
        default: false
    }
});
const isOpen = ref(true);

onMounted(() => {
    startCountDown();
});
onUnmounted(() => {
    endCountDown();
});
//收题
const collectQuestions = () => {
    endCountDown();

}

</script>

<style scoped lang="scss">
.share-page {
    position: fixed;
    right: 10px;
    top: 10px;
    width: 276px;

    background: #FFFFFF;
    box-shadow: 0px 6px 16px -8px rgba(0, 0, 0, 0.12), 0px 9px 28px 0px rgba(0, 0, 0, 0.08), 0px 12px 48px 16px rgba(0, 0, 0, 0.05);
    border-radius: 8px;

    .share-title {
        padding: 16px 22px;
        width: 100%;
        height: 56px;
        background: #4b71ee1a;
        border-radius: 8px 8px 0px 0px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .left {
            display: flex;
            align-items: center;

            span {
                font-size: 20px;
                font-weight: 600;
                color: #4B71EE;
                margin-left: 2px;
            }
        }

        .arrows {
            cursor: pointer;
        }

    }

    .share-content {
        height: 206px;

        .content {
            padding: 46px 34px;
            display: flex;
            justify-content: space-around;

            .time-num {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;

                .top {
                    font-size: 28px;
                    font-weight: 600;
                    color: #19203D;
                }

                .bottom {
                    font-size: 16px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #5F626F;
                    margin-top: 8px;
                }
            }

            .line {
                width: 1px;
                height: 48px;
                background: #E9ECF0;
            }
        }

        .btns {
            cursor: pointer;
            width: 120px;
            height: 36px;
            background: #4B71EE;
            border-radius: 4px;
            font-size: 16px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #FFFFFF;
            text-align: center;
            line-height: 36px;
            margin: 0 auto;
        }

    }
}
</style>
