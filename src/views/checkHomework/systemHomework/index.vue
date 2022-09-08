<template>
    <div class="content-warp">
        <div class="left">
            <div class="access-system-select">
                <el-select v-model="selectClassId" placeholder="请选择">
                    <el-option
                        v-for="item in homeworkDetail.classInfo"
                        :key="item.classHomeworkPaperID"
                        :label="item.name"
                        :value="item.classHomeworkPaperID"
                    >
                    </el-option>
                </el-select>
            </div>
            <div class="access-system-chart">
                <Chart
                    :item="item"
                    :key="index"
                    :index="index"
                    :activeIndex="activeIndex"
                    v-for="(item, index) in questionList"
                    @click="selectQuestion(index)"
                ></Chart>
            </div>
            <div class="access-system-toast">
                <div>
                    <span style="background: #34e1b6"></span>
                    <p>答对</p>
                </div>
                <div>
                    <span style="background: #ff6b6b"></span>
                    <p>答错</p>
                </div>
                <div>
                    <span style="background: #4b71ee"></span>
                    <p>待批阅</p>
                </div>
            </div>
        </div>
        <div class="right">
            <ReviewHomework
                :MissionDetails="missionDetails"
                :questionDetailId="questionDetailId"
                :questionContent="questionContent"
                :answerContent="answerContent"
                :type="questionType"
            ></ReviewHomework>
        </div>
    </div>
</template>

<script lang="ts">
import {
    ClassHomeworkPaperQuestion,
    HomeworkDetail,
    MissionDetail
} from "@/types/checkHomework";
import { defineComponent, onMounted, onUnmounted, PropType, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { fetchClassHomeworkPaperQuestionList, fetchQuestinInfoByQuestionID } from "../api";
import Chart from "./Chart.vue";
import ReviewHomework from "./ReviewHomework.vue";
export default defineComponent({
    name: "systemHomework",
    props: {
        homeworkDetail: {
            type: Object as PropType<HomeworkDetail>,
            default: () => ({})
        }
    },
    setup() {
        const route = useRoute();
        const selectClassId = ref(
            route.params.classHomeworkPaperID as string
        );
        const questionList = ref<ClassHomeworkPaperQuestion[]>([]);
        const missionDetails = ref<MissionDetail[]>([]);
        const activeIndex = ref(0);
        const questionDetailId = ref("");
        const questionContent = ref("");
        const answerContent = ref("");
        const questionType = ref(-1);

        async function getQuestinInfoByQuestionID(questionID: string) {
            const res = await fetchQuestinInfoByQuestionID({
                questionID
            });
            if (res.resultCode === 200) {
                questionDetailId.value = res.result.Question.ID;
                questionContent.value = res.result.Question.FlowText?.QuestionContent || "";
                answerContent.value = res.result.Question.FlowText?.AnswerContent || "";
                questionType.value = res.result.Question.Type;
            }
        }

        const getClassHomeworkPaperQuestionList = async () => {
            const res = await fetchClassHomeworkPaperQuestionList({
                classHomeworkPaperID: selectClassId.value
            });
            if (res.resultCode === 200) {
                questionList.value = res.result;
                missionDetails.value = questionList.value[activeIndex.value].MissionDetails;
                getQuestinInfoByQuestionID(questionList.value[activeIndex.value].QuestionID);
            }
        };

        const selectQuestion = (index: number) => {
            activeIndex.value = index;
            missionDetails.value = questionList.value[index].MissionDetails;
            getQuestinInfoByQuestionID(questionList.value[index].QuestionID);
        };

        getClassHomeworkPaperQuestionList();

        watch(selectClassId, getClassHomeworkPaperQuestionList);

        onMounted(() => {
            document.addEventListener("updateSystemHomework", getClassHomeworkPaperQuestionList);
        });

        onUnmounted(() => {
            document.removeEventListener("updateSystemHomework", getClassHomeworkPaperQuestionList);
        });

        return {
            selectClassId,
            activeIndex,
            selectQuestion,
            questionDetailId,
            questionType,
            answerContent,
            missionDetails,
            questionContent,
            questionList
        };
    },
    components: { Chart, ReviewHomework }
});
</script>

<style lang="scss" scoped>
.content-warp {
    display: flex;
    height: calc(100% - 8.8rem);
    .left {
        display: flex;
        flex-direction: column;
        width: 260px;
        background: #f5f6fa;
        padding: 12px 16px 0 16px;
        .access-system-select {
            width: 282px;
            height: 40px;
            margin-bottom: 20px;
            :deep(.el-input__inner) {
                width: 230px;
            }
        }
        .access-system-chart {
             flex: 1;
             overflow-y: auto;
            //padding: 12px 0;
            //display: flex;
            //flex-wrap: wrap;
            //justify-content: space-between;
            //overflow-y: overlay;
        }
        .access-system-toast {
            height: 50px;
            bottom: 0;
            left: 0;
            display: flex;
            justify-content: space-around;
            align-items: center;
            //padding: 30px 44px 20px 44px;
            div {
                display: flex;
                align-items: center;
                span {
                    display: block;
                    width: 12px;
                    height: 12px;
                }
                p {
                    font-size: 14px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #5f626f;
                    line-height: 20px;
                    padding-left: 4px;
                }
            }
        }
    }
    .right {
        flex: 1;
        min-width: 0px;
        height: 100%;
        overflow-y: auto;
    }
}
</style>
