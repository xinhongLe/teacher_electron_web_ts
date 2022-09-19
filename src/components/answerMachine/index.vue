<template>
    <div class="answer-box">
        <start-answer
            :currentUserInfo="currentUserInfo"
            :allStudentList="allStudentList"
            v-if="!(isShowTimer || isShowAnswerResult)"
            @start="start"
            :lessonId="lessonId"
            v-model:answerMode="answerMode"
        />

        <answer-timer
            v-if="isShowTimer"
            :currentUserInfo="currentUserInfo"
            :studentList="selectStudentList"
            :questionType="selectQuestionType"
            @endAnswer="endAnswer"
            :AnswerMachineID="AnswerMachineID"
        />

        <answer-result
            v-if="isShowAnswerResult"
            :time="answerTime"
            :lessonId="lessonId"
            :unAnswerStudentList="unAnswerStudentList"
            :studentAnswerInfoList="studentAnswerInfoList"
            :answerDetail="answerDetail"
            :studentList="selectStudentList"
            :questionType="selectQuestionType"
            :questionOption="questionOption"
        />
    </div>
</template>

<script lang="ts">
import StartAnswer from "@/childWindow/answerMachine/startAnswer.vue";
import { computed, defineComponent, provide, reactive, ref, toRefs } from "vue";
import { get, STORAGE_TYPES } from "@/utils/storage";
import { AnswerMode, MachineModeQuestionType, PADModeQuestionType } from "@/childWindow/answerMachine/enum";
import { Student } from "@/types/labelManage";
import {
    getStudentQuestionResult,
    MQTTInfoData,
    StudentAnswerInfo,
    StudentAnswerInfoList
} from "@/childWindow/answerMachine/api";
import AnswerTimer from "@/childWindow/answerMachine/answerTimer.vue";
import AnswerResult from "@/childWindow/answerMachine/answerResult.vue";

interface State {
    isShowTimer: boolean,
    isShowAnswerResult: boolean,
    allStudentList: Student[],
    answerMode: number,
    selectQuestionType: string,
    AnswerMachineID: string,
    selectStudentList: Student[],
    answerTime: string,
    questionOption: string,
    unAnswerStudentList: Student[],
    studentAnswerInfoList: StudentAnswerInfo[],
}

export default defineComponent({
    name: "answerMachine",
    components: { AnswerResult, AnswerTimer, StartAnswer },
    props: {
        lessonId: {
            type: String,
            required: true
        }
    },
    setup() {
        const currentUserInfo = get(STORAGE_TYPES.CURRENT_USER_INFO);
        const mqttInfo = ref<MQTTInfoData>();
        const state = reactive<State>({
            isShowTimer: false,
            isShowAnswerResult: false,
            allStudentList: [],
            answerMode: AnswerMode.PAD,
            selectQuestionType: "",
            AnswerMachineID: "",
            selectStudentList: [],
            answerTime: "",
            unAnswerStudentList: [],
            studentAnswerInfoList: [],
            questionOption: ""
        });
        const answerDetail = ref<StudentAnswerInfoList>({
            AnswerMachineID: "",
            AllUserCount: 0,
            CommitUserCount: 0,
            StudentQuestionResults: []
        });
        const QuestionType = computed(() => state.answerMode === AnswerMode.PAD ? PADModeQuestionType : MachineModeQuestionType);

        const start = (studentList: Student[], data: MQTTInfoData, answerMachineID:string) => {
            if (data.QuestionDetail?.length === 1) {
                state.selectQuestionType = QuestionType.value[data.QuestionDetail[0].QuestionType];
            } else {
                state.selectQuestionType = `${data.QuestionDetail?.length}题`;
            }
            mqttInfo.value = data;
            state.AnswerMachineID = answerMachineID;
            state.selectStudentList = studentList;
            state.isShowTimer = true;
            // questionOption.value = data.QuestionOption;
        };

        const endAnswer = async (time: string, studentList: Student[]) => {
            state.answerTime = time;
            mqttInfo.value!.IsEnd = true;
            state.unAnswerStudentList = studentList;
            // const res = await getStudentAnswerEndInfo(mqttInfo.value);
            const res = await getStudentQuestionResult({ AnswerMachineID: state.AnswerMachineID });
            // const res = await getStudentQuestionResult({ AnswerMachineID: "C696DA084848C9E8B2D0A2CB00853504" });
            if (res.resultCode === 200) {
                state.isShowTimer = false;
                state.isShowAnswerResult = true;
                console.log(res.result, "=======");
                // studentAnswerInfoList.value = res.result;
                answerDetail.value = res.result;
            }
        };
        return {
            ...toRefs(state),
            currentUserInfo,
            answerDetail,
            start,
            endAnswer
        };
    }
});
</script>

<style scoped lang="scss">
.answer-box{
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
    min-height: 0;
}
</style>
