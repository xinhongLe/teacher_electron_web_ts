<template>
    <div class="look-question" v-show="!isMinimized">
        <el-dialog
            :fullscreen="true"
            :model-value="true"
            :show-close="false"
            custom-class="look-question-dialog"
            v-if="isShowDialog"
        >
            <template #title>
                <p class="title">查看题目</p>
            </template>
            <Question
                :close="close"
                ref="questionRef"
                v-model:nowQuestionID="nowQuestionID"
                v-model:isMinimized="isMinimized"
            >
                <template v-slot:footerBtn="slotProps">
                    <div class="btn-list">
                        <div
                            v-show="type !== 2 && slotProps.sum > 1"
                            class="btn"
                            @click.stop="viewPureQuestion"
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
        </el-dialog>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, onMounted, onUnmounted, provide, ref, watch } from "vue";
import Question from "./Question.vue";
import PureQuestionDialog from "./PureQuestionDialog.vue";
import { checkPureQuestionByQuestionID } from "./api";
import { ElMessage } from "element-plus";
import { MutationTypes, store } from "@/store";
import isElectron from "is-electron";
export default defineComponent({
    name: "LookQuestion",
    setup() {
        const type = computed(() => store.state.common.viewQuestionInfo.type);
        const isShowDialog = ref(true);
        const dialogVisible = ref(false);
        const nowQuestionID = ref("");
        const isMinimized = ref(false);

        const viewPureQuestion = async () => {
            const check = await checkPureQuestionByQuestionID({
                questionID: nowQuestionID.value
            });
            if (check.resultCode === 200) {
                if (check.result) {
                    dialogVisible.value = true;
                } else {
                    ElMessage.warning("无同类题");
                }
            }
        };

        const close = () => {
            isShowDialog.value = false;
            nextTick(() => {
                store.commit(MutationTypes.SET_IS_SHOW_QUESTION, {
                    flag: false,
                    info: {}
                });
            });
        };

        provide("nowQuestionID", nowQuestionID);

        const openQuestion = () => {
            isMinimized.value = false;
        };

        const closeQuestion = () => {
            window.electron.ipcRenderer.invoke("hideSuspensionQuestion");
            close();
        };

        watch(isMinimized, (v) => {
            if (v) {
                window.electron.ipcRenderer.invoke("questionMinimized");
            } else {
                window.electron.ipcRenderer.invoke("hideSuspensionQuestion");
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
                window.electron.ipcRenderer.removeListener("openQuestion", openQuestion);
                window.electron.ipcRenderer.removeListener("closeQuestion", closeQuestion);
            }
        });

        return {
            type,
            viewPureQuestion,
            close,
            isShowDialog,
            isMinimized,
            nowQuestionID,
            dialogVisible
        };
    },

    components: { Question, PureQuestionDialog }
});
</script>

<style lang="scss" scoped>
.look-question {
    background: #fff;
    :deep(.look-question-dialog) {
        -webkit-app-region: no-drag;
        &.el-dialog {
            display: flex;
            flex-direction: column;
        }
        .el-dialog__body {
            padding: 0;
            flex: 1;
        }
    }

    .btn-list {
        display: flex;
    }
    .btn {
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
            background: url("./../../assets/look/btn_tongleiti@2x.png");
            background-size: 100% 100%;
        }
        &:nth-child(2) {
            background: url("./../../assets/look/btn_yichu@2x.png");
            background-size: 100% 100%;
        }
    }
    .title {
        font-size: 20px;
        font-weight: 600;
        color: #19203d;
        line-height: 28px;
        text-align: center;
    }
}
</style>
