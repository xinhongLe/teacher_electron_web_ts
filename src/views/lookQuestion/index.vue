<template>
    <div class="look-question" @click="closeSmall">
        <div class="frames-box">
            <p>查看题目</p>
            <p></p>
            <div class="count">{{ number }} / {{ sum }}</div>
            <Brush ref="childRef" v-if="isBlackboard"></Brush>
            <div class="material-box">
                <audio
                    ref="audioRef"
                    :src="voiceUrl[nextIndex - 1]"
                    :controls="true"
                    :autoplay="true"
                    style="display: none"
                >
                    亲 您的浏览器不支持html5的audio标签
                </audio>
                <img
                    ref="imageRef"
                    class="question-img"
                    :src="imageUrl[nextIndex - 1]"
                    alt=""
                />
            </div>
        </div>
        <div class="dialog-footer">
            <div class="switch-box">
                <div>
                    <el-switch v-model="switchValue"> </el-switch>
                    <p>自动播放题音</p>
                </div>
                <div>
                    <el-switch v-model="switchValue"> </el-switch>
                    <p>自动播放解析</p>
                </div>
            </div>
            <div class="btn-list">
                <div
                    v-show="type !== 2 && sum > 1"
                    @click.stop="lookSimilarQuestions"
                >
                    <p>同类题</p>
                </div>
                <div v-show="type != 2" @click.stop="removeQuestion">
                    <p>移除题目</p>
                </div>
                <div @click.stop="playSounds(0)">
                    <p>听题音</p>
                </div>
                <div @click.stop="playSounds(1)">
                    <p>听解析</p>
                </div>
                <div
                    :class="btnType == 1 ? 'active' : ''"
                    @click.stop="brushHandle"
                >
                    <p>画笔</p>
                </div>
                <div
                    :class="btnType == 2 ? 'active' : ''"
                    @click.stop="eraserHandle"
                >
                    <p>橡皮</p>
                </div>
                <div
                    :class="btnType == 3 ? 'active' : ''"
                    @click.stop="clearBoard"
                >
                    <p>清空</p>
                </div>
                <div @click.stop="closeQuestion">
                    <p>关闭</p>
                </div>
                <div
                    v-show="isElectron && type != 2"
                    @click.stop="smallQuestion"
                >
                    <p>最小化</p>
                </div>
                <div v-if="isLastBtn" class="disabled">
                    <p>上一页</p>
                </div>
                <div v-else @click.stop="lastPage">
                    <p>上一页</p>
                </div>
                <div v-if="isNextBtn" class="disabled">
                    <p>下一页</p>
                </div>
                <div v-else @click.stop="nextPage">
                    <p>下一页</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import isElectronFun from "is-electron";
import useDetail from "./hooks/useDetail";
import { useRoute } from "vue-router";
import Brush from "@/components/brush/index.vue";
export default defineComponent({
    setup() {
        const route = useRoute();
        const type = computed(() => Number(route.params.type));
        const switchValue = ref(true);
        const btnType = ref(1);
        const childRef = ref<InstanceType<typeof Brush>>();
        const isElectron = isElectronFun();
        const {
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
            // nowQuestionID,
            nextPage
        } = useDetail();

        const closeSmall = () => {
            if (isElectron) {
                // type.value === 2 && ipcRenderer.send("closeSQuestion");
            }
        };

        const brushHandle = () => {
            btnType.value = 1;
            childRef.value!.brushOn();
        };

        const clearBoard = () => {
            btnType.value = 3;
            childRef.value!.clearBrush();
        };

        const eraserHandle = () => {
            btnType.value = 2;
            childRef.value!.eraserOn();
        };

        const lookSimilarQuestions = () => {
            audioRef.value!.pause();
            if (isElectron) {
                // ipcRenderer.send(
                //     "openSQuestion",
                //     route.params.id,
                //     2,
                //     nowQuestionID.value
                // );
            }
        };

        const closeQuestion = () => {
            audioRef.value!.pause();
            window.close();
            // if (isElectron) {
            //     type.value === 2
            //         ? ipcRenderer.send("closeSQuestion")
            //         : ipcRenderer.send("closeQuestion");
            // }
        };

        const smallQuestion = () => {
            audioRef.value!.pause();
            // if (isElectron) {
            //     ipcRenderer.send("smallQuestion");
            // }
        };

        return {
            switchValue,
            imageUrl,
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
            closeSmall,
            smallQuestion,
            removeQuestion,
            imageRef,
            audioRef,
            isElectron
        };
    },
    components: { Brush }
});
</script>

<style lang="scss" scoped>
.active {
    border: 3px solid #4b71ee;
    border-radius: 10px;
}
.look-question {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
}
.frames-box {
    width: 100%;
    height: 100%;
    position: relative;
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
        width: 90%;
        height: calc(100% - 220px);
        margin: 20px auto 0;
        border: solid 1px #ccc;
        .question-img {
            width: 100%;
            height: 100%;
        }
    }
}
.dialog-footer {
    width: 100%;
    height: 80px;
    padding: 12px;
    background: rgb(125, 164, 236);
    position: absolute;
    bottom: 0;
    left: 0px;
    right: 0px;
    z-index: 3;
    display: flex;
    align-items: center;
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
    .btn-list {
        flex: 1;
        display: flex;
        justify-content: flex-end;
        > div {
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
        }
        > div:nth-of-type(1) {
            background: url("./../../assets/look/btn_tongleiti@2x.png");
            background-size: 100% 100%;
        }
        > div:nth-of-type(2) {
            background: url("./../../assets/look/btn_yichu@2x.png");
            background-size: 100% 100%;
        }
        > div:nth-of-type(3) {
            background: url("./../../assets/look/btn_tiyin@2x.png");
            background-size: 100% 100%;
        }
        > div:nth-of-type(4) {
            background: url("./../../assets/look/btn_jiexi@2x.png");
            background-size: 100% 100%;
        }
        > div:nth-of-type(5) {
            background: url("./../../assets/look/btn_huabi@2x.png");
            background-size: 100% 100%;
        }
        > div:nth-of-type(6) {
            background: url("./../../assets/look/btn_xiangpi@2x.png");
            background-size: 100% 100%;
        }
        > div:nth-of-type(7) {
            background: url("./../../assets/look/btn_qingkong@2x.png");
            background-size: 100% 100%;
        }
        > div:nth-of-type(8) {
            background: url("./../../assets/look/btn_guanbi@2x.png");
            background-size: 100% 100%;
            p {
                color: #fff;
            }
        }
        > div:nth-of-type(9) {
            background: url("./../../assets/look/btn_zuixiaohua@2x.png");
            background-size: 100% 100%;
        }
        > div:nth-of-type(10) {
            background: url("./../../assets/look/btn_shangyiye@2x.png");
            background-size: 100% 100%;
        }
        > div:nth-of-type(10).disabled {
            background: url("./../../assets/look/btn_shangyiye_disabled@2x.png");
            background-size: 100% 100%;
            p {
                color: #4b71ee;
            }
        }
        > div:nth-of-type(11) {
            background: url("./../../assets/look/btn_xiayiye@2x.png");
            background-size: 100% 100%;
            width: 120px;
            p {
                color: #fff;
            }
        }
        > div:nth-of-type(11).disabled {
            background: url("./../../assets/look/btn_xiayiye_disabled@2x.png");
            background-size: 100% 100%;
            p {
                color: #4b71ee;
            }
        }
    }
}
</style>
