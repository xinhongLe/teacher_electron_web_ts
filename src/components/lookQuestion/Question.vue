<template>
    <div class="warp">
        <div class="frames-box">
            <span class="file-sn" v-if="!dialog">{{questionSn}}</span>
            <slot name="title" />
            <div class="count">{{ number }} / {{ sum }}</div>
            <div class="material-box">
                <audio
                    ref="audioRef"
                    :src="voiceUrlMap[nextIndex - 1 === 0 ? 'question' : 'answer']"
                    :controls="true"
                    @canplay="playAudio"
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
                    <el-switch v-model="questionSwitchValue"> </el-switch>
                    <p>自动播放题音</p>
                </div>
                <div>
                    <el-switch v-model="resolutionSwitchValue"> </el-switch>
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
                        @click.stop="drawingShow = true"
                        class="button pen"
                    >
                        <p>画笔</p>
                    </div>
<!--                    <div-->
<!--                        :class="btnType == 2 ? 'active' : ''"-->
<!--                        @click.stop="eraserHandle"-->
<!--                        class="button"-->
<!--                    >-->
<!--                        <p>橡皮</p>-->
<!--                    </div>-->
<!--                    <div-->
<!--                        :class="btnType == 3 ? 'active' : ''"-->
<!--                        @click.stop="clearBoard"-->
<!--                        class="button"-->
<!--                    >-->
<!--                        <p>清空</p>-->
<!--                    </div>-->
                    <div @click.stop="closeQuestion" class="button close">
                        <p>关闭</p>
                    </div>
                    <div
                        v-show="isElectron && type != 2 && !isPureQuestion && !dialog && !noMinix"
                        @click.stop="smallQuestion"
                        class="button mini"
                    >
                        <p>最小化</p>
                    </div>
                    <div v-if="isLastBtn" class="disabled button prev">
                        <p>上一页</p>
                    </div>
                    <div v-else @click.stop="lastPage" class="button next">
                        <p>上一页</p>
                    </div>
                    <div v-if="isNextBtn" class="disabled button next">
                        <p>下一页</p>
                    </div>
                    <div v-else @click.stop="nextPage" class="button next">
                        <p>下一页</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <drawing-board :show="drawingShow" @closeWriteBoard="drawingShow = false"/>
</template>

<script lang="ts">
import { computed, defineComponent, inject, onMounted, onUnmounted, PropType, Ref, ref, watch } from "vue";
import isElectronFun from "is-electron";
import useDetail from "./hooks/useDetail";
import { set, STORAGE_TYPES } from "@/utils/storage";
import emitter from "@/utils/mitt";
import { IViewResourceData } from "@/types/store";
import DrawingBoard from "@/components/drawingBoard/index.vue";
export default defineComponent({
    props: {
        close: {
            type: Function,
            required: true
        },

        isPureQuestion: {
            type: Boolean,
            default: false
        },

        dialog: {
            type: Boolean,
            default: false
        },

        resource: {
            type: Object as PropType<IViewResourceData>,
            required: true
        }
    },
    setup(props, { emit }) {
        const type = computed(() => props.resource.type);
        const btnType = ref(-1);
        const childRef = ref();
        const isElectron = isElectronFun();
        const noMinix = computed(() => !!props.resource.openMore);

        const questionID = inject("nowQuestionID") as Ref<string>;
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
            resolutionSwitchValue,
            questionSwitchValue,
            voiceUrlMap,
            nextPage,
            questionSn
        } = useDetail(props.isPureQuestion, questionID.value, emit, childRef, props.resource);

        const brushHandle = () => {
            btnType.value = 1;
            childRef.value?.brushOn();
        };

        const clearBoard = () => {
            btnType.value = 3;
            childRef.value?.clearBrush();
        };

        const eraserHandle = () => {
            btnType.value = 2;
            childRef.value?.eraserOn();
        };

        const lookSimilarQuestions = () => {
            audioRef.value!.pause();
        };

        const closeQuestion = () => {
            audioRef.value!.pause();
            props.close();
        };

        const smallQuestion = () => {
            audioRef.value!.pause();
            emit("update:isMinimized", true);
        };

        const playAudio = () => {
            const isPlay = nextIndex.value === 1 ? questionSwitchValue.value : resolutionSwitchValue.value;
            if (isPlay && audioRef.value) {
                audioRef.value.play();
            }
        };

        watch(nowQuestionID, (v) => {
            childRef.value?.clearBrush();
            emit("update:nowQuestionID", v);
        });

        watch(questionSwitchValue, (v) => {
            set(STORAGE_TYPES.AUTO_PALY_QUESTION_SWITCH, String(v));
        });

        watch(resolutionSwitchValue, (v) => {
            set(STORAGE_TYPES.AUTO_PALY_RESOLUTION_SWITCH, String(v));
        });

        onMounted(() => {
            if (!props.isPureQuestion) {
                emitter.on("smallQuestion", smallQuestion);
            }
        });

        onUnmounted(() => {
            emitter.off("smallQuestion");
        });

        const drawingShow = ref(false)

        return {
            noMinix,
            resolutionSwitchValue,
            questionSwitchValue,
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
            smallQuestion,
            removeQuestion,
            playAudio,
            imageRef,
            voiceUrlMap,
            questionSn,
            audioRef,
            isElectron,
            drawingShow
        };
    },
    components: { DrawingBoard }
});
</script>

<style lang="scss" scoped>
.active {
    border: 3px solid #4b71ee;
    border-radius: 10px;
}
.warp {
    height: 100%;
    display: flex;
    flex-direction: column;
}
.frames-box {
    width: 100%;
    height: 100%;
    position: relative;
    flex: 1;
    display: flex;
    flex-direction: column;
    .file-sn {
        position: absolute;
        left: 20px;
        top: -20px;
        color: #999;
        font-size: 16px;
    }
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
        margin: 36px auto 0;
        border: solid 1px #ccc;
        position: relative;
        flex: 1;
        .question-img {
            width: 100%;
            height: 100%;
            position: absolute;
        }
    }
}
.dialog-footer {
    width: 100%;
    height: 80px;
    padding: 12px;
    background: rgb(125, 164, 236);
    display: flex;
    align-items: center;
    position: relative;
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
            &.pen {
                background: url("./../../assets/look/btn_huabi@2x.png");
                background-size: 100% 100%;
            }
            &.close {
                background: url("./../../assets/look/btn_guanbi@2x.png");
                background-size: 100% 100%;
                p {
                    color: #fff;
                }
            }
            &.mini {
                background: url("./../../assets/look/btn_zuixiaohua@2x.png");
                background-size: 100% 100%;
            }
            &.prev {
                background: url("./../../assets/look/btn_shangyiye@2x.png");
                background-size: 100% 100%;
            }
            &.prev.disabled {
                background: url("./../../assets/look/btn_shangyiye_disabled@2x.png");
                background-size: 100% 100%;
                p {
                    color: #4b71ee;
                }
            }
            &.next {
                background: url("./../../assets/look/btn_xiayiye@2x.png");
                background-size: 100% 100%;
                width: 120px;
                p {
                    color: #fff;
                }
            }
            &.next.disabled {
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
