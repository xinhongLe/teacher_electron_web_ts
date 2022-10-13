<template>
    <div class="container">
        <el-dialog
            :model-value="props.visible"
            title="本题历史"
            center
            :before-close="close"
            :close-on-click-modal="false"
        >
            <div class="error-history">
                <div class="history-title">
                    <h3 v-if="props.errorTitle">{{ props.errorTitle }}</h3>
                    <div
                        class="error-icons"
                        v-if="state.errorHistoryList?.length"
                    >
                        <div class="bg-line"></div>
                        <div class="erroricon">
                            <div class="icons">
                                <div
                                    class="icon-text"
                                    v-for="item in (state.errorHistoryList as any)"
                                    :key="item.MissionStudyId"
                                    @click="
                                        switchMissionStudy(item.MissionStudyId)
                                    "
                                    :class="{
                                        isactive:
                                            state.currentIndex ==
                                            item.MissionStudyId,
                                    }"
                                >
                                    <img
                                        v-if="
                                            state.currentIndex ==
                                            item.MissionStudyId
                                        "
                                        src="~@/assets/images/wrongbook/icon_dui_checked.png"
                                        alt=""
                                    />
                                    <img
                                        v-else
                                        src="~@/assets/images/wrongbook/icon_cuo.png"
                                        alt=""
                                    />
                                    <p>{{ formatMonthDay(item.CreateTime) }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="detail">
                <Answer
                    v-if="detail?.Question?.QuestionFiles.length"
                    :data="detailData"
                    :questionType="detail.Question?.Type"
                    :question="question"
                    :answer="answer"
                    :isOrigin="true"
                    :isQuestion="true"
                    :writeList="detail?.Question?.QuestionBlanks"
                    :choiceValue="detail.Question?.ChoiceValue"
                ></Answer>
                <div v-else class="empty">
                    <div class="img-text">
                        <img
                            src="~@/assets/images/wrongbook/pic_kongtai2.png"
                            alt=""
                        />
                        <p>暂无图片</p>
                    </div>
                </div>
                <!-- :style="{ transform: 'scale(' + 288 / 900 + ')' }" -->
            </div>

            <template #footer>
                <div
                    class="dialog-footer"
                    v-if="
                        state.errorHistoryList?.length &&
                        state.errorHistoryList?.length > 1
                    "
                >
                    <el-button
                        size="small"
                        @click="preNextQuestion(0)"
                        :disabled="state.questionIndex == 1"
                        >上一题</el-button
                    >
                    <div class="num">
                        <span>{{ state.questionIndex }}</span
                        >/<span>{{ state.errorHistoryList?.length }}</span>
                    </div>
                    <el-button
                        size="small"
                        @click="preNextQuestion(1)"
                        :disabled="
                            state.questionIndex ==
                            state.errorHistoryList?.length
                        "
                        >下一题</el-button
                    >
                </div>
                <p class="resource">错题搜集来源：<span>系统采集</span></p>
            </template>
        </el-dialog>
    </div>
</template>
<script setup lang="ts">
import {
    ref,
    defineProps,
    reactive,
    nextTick,
    defineEmits,
    onMounted,
    computed,
    watch,
} from "vue";
import {
    getStudentQuestionMissionStudyIds,
    historyParams,
    getDetailByMissionStudyID,
    historyStudylParams,
} from "@/api/errorbook";
import { formatMonthDay } from "@/utils";
import Answer from "@/views/checkHomework/systemHomework/Answer.vue";
const props = defineProps({
    visible: {
        type: Boolean,
        default: false,
    },
    historyData: {
        type: Object,
        default: () => null,
    },
    errorTitle: {
        type: String,
        default: "",
    },
});

const emit = defineEmits(["update:visible"]);
const state = reactive({
    errorHistoryList: [],
    currentIndex: "",
    questionIndex: 1,
});
const detail = ref() as any;
const detailData = computed(() => detail.value.Study?.StudyFiles);
const question = computed(
    () =>
        detail.value?.Question?.Answers[0].AnswerFiles.find(
            (v: any) => v.Type === 3
        )?.File
);
const answer = computed(
    () =>
        detail.value?.Question?.Answers[0].AnswerFiles.find(
            (v: any) => v.Type === 3
        )?.File
);
//切换错题
const switchMissionStudy = (id: string) => {
    state.currentIndex = id;
    state.questionIndex =
        state.errorHistoryList.findIndex(
            (item: any) => item.MissionStudyId == id
        ) + 1;
    queryDetailByMissionStudyID({
        MissionStudyID: id,
    });
};
//上一题、下一题
const preNextQuestion = (type: number) => {
    console.log("下一题");
    if (type) {
        state.questionIndex += 1;
    } else {
        state.questionIndex -= 1;
    }
    const missionStudyID =
        state.errorHistoryList[state.questionIndex - 1].MissionStudyId;
    state.currentIndex = missionStudyID;
    queryDetailByMissionStudyID({
        MissionStudyID: missionStudyID,
    });
};
//关闭弹框
const close = () => {
    nextTick(() => {
        emit("update:visible", false);
    });
};
//查询学生做题历史
const queryStudenQuestiontHistoryStudy = async (params: historyParams) => {
    const res: any = await getStudentQuestionMissionStudyIds(params);
    console.log("查询学生做题历史", res);
    if (res.success && res.resultCode == 200) {
        state.errorHistoryList = res.result.list;
        if (state.errorHistoryList.length) {
            state.currentIndex = state.errorHistoryList[0].MissionStudyId;
            if (state.currentIndex) {
                queryDetailByMissionStudyID({
                    MissionStudyID: state.currentIndex,
                });
            }
        }
    }
};
//根据错题id查询错题详情
const queryDetailByMissionStudyID = async (params: historyStudylParams) => {
    const res: any = await getDetailByMissionStudyID(params);
    console.log("查询学生做题详情", res);
    if (res.success && res.resultCode == 200) {
        detail.value = res.result;
        // if (detail.value) {
        //     detailData.value = detail.value?.Study?.StudyFiles;
        //     question.value =
        //         detail.value?.Question?.Answers[0].AnswerFiles.find(
        //             (v: any) => v.Type === 3
        //         )?.File;
        //     answer.value = detail.value?.Question?.Answers[0].AnswerFiles.find(
        //         (v: any) => v.Type === 3
        //     )?.File;
        // }
    }
};
onMounted(() => {
    const data = props.historyData as historyParams;
    if (props.historyData) {
        queryStudenQuestiontHistoryStudy(data);
    }
});
</script>
<style scoped lang="scss">
.container {
    .error-history {
        .history-title {
            padding: 0 8%;
            margin-bottom: 20px;

            h3 {
                font-size: 15px;
                font-family: HarmonyOS_Sans_SC;
                color: #19203d;
                font-weight: bold;
            }
            .error-icons {
                padding: 4rem 2.2rem;
                position: relative;
                .bg-line {
                    width: 100%;
                    height: 8px;
                    background: #ebf9fa;
                    border-radius: 7px;
                }
                .erroricon {
                    position: absolute;
                    top: 24px;
                    left: 0;
                    width: 100%;
                    .icons {
                        width: 100%;
                        display: flex;
                        justify-content: space-around;
                        padding: 0 6%;
                        overflow: auto;
                        overflow-y: hidden;
                        .icon-text {
                            cursor: pointer;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            p {
                                margin-top: 7px;
                                font-size: 12px;
                                font-family: DINAlternate-Bold, DINAlternate;
                                font-weight: bold;
                                color: #727b91;
                            }
                        }
                        .isactive {
                            p {
                                font-size: 14px;
                                color: #0c234f;
                            }
                        }
                    }
                }
            }
        }
    }
    .empty {
        width: 100%;
        height: 364px;
        background: #f9fafc;
        display: flex;
        justify-content: center;
        align-items: center;

        .img-text {
            text-align: center;
        }
    }
    :deep(.el-dialog) {
        --el-dialog-width: 70%;
        margin: 0 auto;
        top: 6%;
        // transform: translateY(-50%);
    }
    :deep(.el-dialog__header) {
        padding: 16px;
        border-bottom: 1px solid #f3f4f4;
        .el-dialog__title {
            color: #19203d;
            font-weight: 600;
        }
        .el-dialog__headerbtn .el-dialog__close {
            font-size: 20px;
            color: #bdc4cf;
        }
    }
    :deep(.el-dialog__body) {
        // height: 73vh;
        // overflow: auto;
    }
    :deep(.el-dialog__footer) {
        .dialog-footer {
            display: flex;
            justify-content: center;
            align-items: center;
            .num {
                margin: 0 24px;
                font-size: 14px;
                font-family: HarmonyOS_Sans_SC_Medium;
                color: #727b91;
            }
        }
        .resource {
            text-align: right;
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #5f626f;
        }
    }
}
</style>
