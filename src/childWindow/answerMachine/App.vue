<template>
    <el-config-provider :locale="locale">
        <div>
            <StartAnswer
                :allStudentList="allStudentList"
                v-if="!(isShowTimer || isShowAnswerResult)"
                @start="start"
                v-model:answerMode="answerMode"
            />
            <answer-timer
                v-if="isShowTimer"
                :studentList="selectStudentList"
                :questionType="selectQuestionType"
                @endAnswer="endAnswer"
            />
            <answer-result
                v-if="isShowAnswerResult"
                :time="answerTime"
                :unAnswerStudentList="unAnswerStudentList"
                :studentAnswerInfoList="studentAnswerInfoList"
                :studentList="selectStudentList"
                :questionType="selectQuestionType"
                :questionOption="questionOption"
            />
        </div>
    </el-config-provider>
</template>

<script lang="ts">
import { computed, defineComponent, provide, ref } from "vue";
import StartAnswer from "./startAnswer.vue";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import { Student } from "@/types/labelManage";
import AnswerTimer from "./answerTimer.vue";
import {
    getStudentAnswerEndInfo,
    MQTTInfoData,
    StudentAnswerInfo
} from "./api";
import AnswerResult from "./answerResult.vue";
import { AnswerMode, MachineModeQuestionType, PADModeQuestionType } from "./enum";
export default defineComponent({
    components: {
        StartAnswer,
        AnswerTimer,
        AnswerResult
    },
    setup() {
        const allStudentList = ref<Student[]>([]);
        const isShowTimer = ref(false);
        const isShowAnswerResult = ref(false);
        const selectStudentList = ref<Student[]>([]);
        const selectQuestionType = ref();
        const answerTime = ref("");
        const mqttInfo = ref<MQTTInfoData>();
        const unAnswerStudentList = ref();
        const studentAnswerInfoList = ref<StudentAnswerInfo[]>([]);
        const questionOption = ref("");
        const answerMode = ref(AnswerMode.PAD);
        const QuestionType = computed(() => answerMode.value === AnswerMode.PAD ? PADModeQuestionType : MachineModeQuestionType);

        provide("QuestionType", QuestionType);

        const start = (
            studentList: Student[],
            type: number,
            data: MQTTInfoData
        ) => {
            isShowTimer.value = true;
            selectStudentList.value = studentList;
            selectQuestionType.value = type;
            mqttInfo.value = data;
            questionOption.value = data.QuestionOption;
        };

        const endAnswer = async (time: string, studentList: Student[]) => {
            answerTime.value = time;
            mqttInfo.value!.IsEnd = true;
            unAnswerStudentList.value = studentList;
            const res = await getStudentAnswerEndInfo(mqttInfo.value);
            if (res.resultCode === 200) {
                isShowTimer.value = false;
                isShowAnswerResult.value = true;
                studentAnswerInfoList.value = res.result;
            }
        };

        window.electron.ipcRenderer.on(
            "sendAllStudentList",
            (_, studentList) => {
                allStudentList.value = studentList;
            }
        );
        return {
            locale: zhCn,
            allStudentList,
            start,
            isShowAnswerResult,
            selectStudentList,
            selectQuestionType,
            endAnswer,
            answerMode,
            unAnswerStudentList,
            studentAnswerInfoList,
            questionOption,
            answerTime,
            isShowTimer
        };
    }
});
</script>

<style lang="scss">
body {
    overflow: hidden;
    user-select: none;
    .el-button--primary {
        --el-button-background-color: #4b71ee;
        --el-button-border-color: #4b71ee;
    }
}
</style>
