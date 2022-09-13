<template>
    <div
        class="look-question"
        :class="dialog && 'dialog-type'"
        v-show="!isMinimized"
    >
        <div class="question-header" v-if="!dialog">
            <p>查看视频</p>
        </div>
        <div v-else style="height: 20px"></div>
        <Question
            dialog
            :close="dialog ? close : closeDialog"
            ref="questionRef"
            v-model:nowQuestionID="nowQuestionID"
            v-model:isMinimized="isMinimized"
        >
            <template v-slot:footerBtn="slotProps">
                <div class="btn-list">
                    <div
                        v-show="type !== 2 && slotProps.sum >= 1"
                        class="btn"
                        :class="!isHasSimilarQuestion && 'disabled'"
                        @click.stop="openSimilarQuestion"
                    >
                        <p>同类题</p>
                    </div>
                    <div
                        v-show="type !== 2"
                        @click.stop="slotProps.removeQuestion"
                        class="btn"
                    >
                        <p>移除题目</p>
                    </div>
                </div>
            </template>
        </Question>
        <PureQuestionDialog
            v-if="dialogVisible"
            v-model:visible="dialogVisible"
        />
    </div>
</template>

<script lang="ts">
import {
    computed,
    defineComponent,
    nextTick,
    onMounted,
    onUnmounted,
    provide,
    ref,
    watch,
} from "vue";
import Question from "./Question.vue";
import PureQuestionDialog from "./PureQuestionDialog.vue";
import { checkPureQuestionByQuestionID } from "./api";
import { MutationTypes, store } from "@/store";
import isElectron from "is-electron";
export default defineComponent({
    name: "LookQuestion",
    props: {
        dialog: {
            type: Boolean,
            default: false,
        },

        close: {
            type: Function,
            default: () => {},
        },
    },
    setup() {
        const type = computed(() => store.state.common.viewQuestionInfo.type);
        const isShowDialog = ref(true);
        const dialogVisible = ref(false);
        const nowQuestionID = ref("");
        const isMinimized = ref(false);
        const isHasSimilarQuestion = ref(false);

        const viewPureQuestion = async () => {
            const check = await checkPureQuestionByQuestionID({
                questionID: nowQuestionID.value,
            });
            if (check.resultCode === 200) {
                isHasSimilarQuestion.value = !!check.result;
            }
        };

        const openSimilarQuestion = () => {
            if (isHasSimilarQuestion.value) dialogVisible.value = true;
        };

        const closeDialog = () => {
            isShowDialog.value = false;
            nextTick(() => {
                store.commit(MutationTypes.SET_IS_SHOW_QUESTION, {
                    flag: false,
                    info: {},
                });
            });
        };

        provide("nowQuestionID", nowQuestionID);

        const openQuestion = () => {
            isMinimized.value = false;
        };

        const closeQuestion = () => {
            window.electron.ipcRenderer.invoke("hideSuspensionQuestion");
            closeDialog();
        };

        watch(isMinimized, (v) => {
            if (v) {
                window.electron.ipcRenderer.invoke("questionMinimized");
            } else {
                window.electron.ipcRenderer.invoke("hideSuspensionQuestion");
            }
        });

        watch(nowQuestionID, () => {
            if (nowQuestionID.value) {
                viewPureQuestion();
            }
        });

        onMounted(() => {
            if (isElectron()) {
                window.electron.ipcRenderer.on("openQuestion", openQuestion);
                window.electron.ipcRenderer.on("closeQuestion", closeQuestion);
            }
        });

        onUnmounted(() => {
            if (isElectron()) {
                window.electron.ipcRenderer.removeListener(
                    "openQuestion",
                    openQuestion
                );
                window.electron.ipcRenderer.removeListener(
                    "closeQuestion",
                    closeQuestion
                );
            }
        });

        return {
            type,
            viewPureQuestion,
            isHasSimilarQuestion,
            openSimilarQuestion,
            closeDialog,
            isShowDialog,
            isMinimized,
            nowQuestionID,
            dialogVisible,
        };
    },

    components: { Question, PureQuestionDialog },
});
</script>

<style lang="scss" scoped>
.look-question {
    background: #fff;
    width: 100vw;
    height: 100vh;
    position: fixed;
    z-index: 3000;
    overflow: hidden;
    background: #fff;
    -webkit-app-region: no-drag;
    display: flex;
    flex-direction: column;
    .question-header {
        p {
            font-size: 20px;
            font-weight: 600;
            color: #19203d;
            line-height: 28px;
            text-align: center;
            margin-top: 16px;
            margin-bottom: 16px;
        }
    }
    &.dialog-type {
        width: 100%;
        height: 100%;
        position: relative;
    }
    .btn-list {
        display: flex;
    }
    .btn {
        width: 64px;
        height: 64px;
        cursor: pointer;
        margin-right: 20px;
        &.disabled {
            p {
                color: #bdc0c5;
            }
        }
        p {
            text-align: center;
            font-size: 12px;
            color: #4b71ee;
            line-height: 24px;
            margin-top: 40px;
            font-weight: 550;
        }
        &:nth-child(1) {
            background: url("./../../assets/look/btn_tongleiti@2x.png");
            background-size: 100% 100%;
            &.disabled {
                background: url("./../../assets/look/btn_tlt_disabled3@2x.png");
                background-size: 100% 100%;
            }
        }
        &:nth-child(2) {
            background: url("./../../assets/look/btn_yichu@2x.png");
            background-size: 100% 100%;
        }
    }
}
</style>
