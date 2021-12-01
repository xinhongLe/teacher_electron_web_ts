<template>
    <div>
        <div class="frames-box">
            <slot name="title" />
            <p></p>
            <div class="count">{{ number }} / {{ sum }}</div>
            <div class="material-box">
                <Brush ref="childRef" v-if="isBlackboard"></Brush>
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
            <div class="btn-warp">
                <slot
                    name="footerBtn"
                    :sum="sum"
                    :removeQuestion="removeQuestion"
                />
                <div class="btn-list">
                    <div @click.stop="playSounds(0)" class="button">
                        <p>听题音</p>
                    </div>
                    <div @click.stop="playSounds(1)" class="button">
                        <p>听解析</p>
                    </div>
                    <div
                        :class="btnType == 1 ? 'active' : ''"
                        @click.stop="brushHandle"
                        class="button"
                    >
                        <p>画笔</p>
                    </div>
                    <div
                        :class="btnType == 2 ? 'active' : ''"
                        @click.stop="eraserHandle"
                        class="button"
                    >
                        <p>橡皮</p>
                    </div>
                    <div
                        :class="btnType == 3 ? 'active' : ''"
                        @click.stop="clearBoard"
                        class="button"
                    >
                        <p>清空</p>
                    </div>
                    <div @click.stop="closeQuestion" class="button">
                        <p>关闭</p>
                    </div>
                    <div
                        v-show="isElectron && type != 2"
                        @click.stop="smallQuestion"
                        class="button"
                    >
                        <p>最小化</p>
                    </div>
                    <div v-if="isLastBtn" class="disabled button">
                        <p>上一页</p>
                    </div>
                    <div v-else @click.stop="lastPage" class="button">
                        <p>上一页</p>
                    </div>
                    <div v-if="isNextBtn" class="disabled button">
                        <p>下一页</p>
                    </div>
                    <div v-else @click.stop="nextPage" class="button">
                        <p>下一页</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject, Ref, ref, watch } from "vue";
import isElectronFun from "is-electron";
import useDetail from "./hooks/useDetail";
import { useRoute } from "vue-router";
import Brush from "@/components/brush/index.vue";
export default defineComponent({
    props: {
        close: {
            type: Function,
            required: true
        },
        isPureQuestion: {
            type: Boolean,
            default: false
        }
    },
    setup(props, { emit }) {
        const route = useRoute();
        const type = computed(() => Number(route.params.type));
        const switchValue = ref(true);
        const btnType = ref(1);
        const childRef = ref<InstanceType<typeof Brush>>();
        const isElectron = isElectronFun();

        const questionID = inject("nowQuestionID") as Ref<string>;
        console.log(questionID.value);
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
            nowQuestionID,
            nextPage
        } = useDetail(props.isPureQuestion, questionID.value);

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
            props.close();
        };

        const smallQuestion = () => {
            audioRef.value!.pause();
            // if (isElectron) {
            //     ipcRenderer.send("smallQuestion");
            // }
        };

        watch(nowQuestionID, (v) => {
            emit("update:nowQuestionID", v);
        });

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
        position: relative;
        .question-img {
            width: 100%;
            height: 100%;
            min-height: 572px;
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
            &:nth-child(3) {
                background: url("./../../assets/look/btn_huabi@2x.png");
                background-size: 100% 100%;
            }
            &:nth-child(4) {
                background: url("./../../assets/look/btn_xiangpi@2x.png");
                background-size: 100% 100%;
            }
            &:nth-child(5) {
                background: url("./../../assets/look/btn_qingkong@2x.png");
                background-size: 100% 100%;
            }
            &:nth-child(6) {
                background: url("./../../assets/look/btn_guanbi@2x.png");
                background-size: 100% 100%;
                p {
                    color: #fff;
                }
            }
            &:nth-child(7) {
                background: url("./../../assets/look/btn_zuixiaohua@2x.png");
                background-size: 100% 100%;
            }
            &:nth-child(8) {
                background: url("./../../assets/look/btn_shangyiye@2x.png");
                background-size: 100% 100%;
            }
            &:nth-child(8).disabled {
                background: url("./../../assets/look/btn_shangyiye_disabled@2x.png");
                background-size: 100% 100%;
                p {
                    color: #4b71ee;
                }
            }
            &:nth-child(9) {
                background: url("./../../assets/look/btn_xiayiye@2x.png");
                background-size: 100% 100%;
                width: 120px;
                p {
                    color: #fff;
                }
            }
            &:nth-child(9).disabled {
                background: url("./../../assets/look/btn_xiayiye_disabled@2x.png");
                background-size: 100% 100%;
                p {
                    color: #4b71ee;
                }
            }
        }
    }
}
</style>
