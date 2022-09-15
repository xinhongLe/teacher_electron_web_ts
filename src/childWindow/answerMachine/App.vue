<template>
    <el-config-provider :locale="locale">
        <div class="answer-app">
            <StartAnswer
                :currentUserInfo="currentUserInfo"
                :allStudentList="allStudentList"
                v-if="!(isShowTimer || isShowAnswerResult)"
                @start="start"
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
                :unAnswerStudentList="unAnswerStudentList"
                :studentAnswerInfoList="studentAnswerInfoList"
                :answerDetail="answerDetail"
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
    StudentAnswerInfo,
    getStudentQuestionResult,
    StudentAnswerInfoList
} from "./api";
import AnswerResult from "./answerResult.vue";
import { AnswerMode, MachineModeQuestionType, PADModeQuestionType } from "./enum";
import { get, STORAGE_TYPES } from "@/utils/storage";
export default defineComponent({
    components: {
        StartAnswer,
        AnswerTimer,
        AnswerResult
    },
    setup() {
        const currentUserInfo = get(STORAGE_TYPES.CURRENT_USER_INFO);
        console.log(currentUserInfo, "=====currentUserInfo");
        const allStudentList = ref<Student[]>([]);
        const isShowTimer = ref(false);
        const isShowAnswerResult = ref(false);
        const selectStudentList = ref<Student[]>([]);
        const selectQuestionType = ref();
        const answerTime = ref("");
        const mqttInfo = ref<MQTTInfoData>();
        const unAnswerStudentList = ref();
        const studentAnswerInfoList = ref<StudentAnswerInfo[]>([]);
        const answerDetail = ref<StudentAnswerInfoList>({
            AnswerMachineID: "",
            AllUserCount: 0,
            CommitUserCount: 0,
            StudentQuestionResults: []
        });
        const questionOption = ref("");
        const answerMode = ref(AnswerMode.PAD);
        const QuestionType = computed(() => answerMode.value === AnswerMode.PAD ? PADModeQuestionType : MachineModeQuestionType);
        const AnswerMachineID = ref("");

        provide("QuestionType", QuestionType);

        const start = (studentList: Student[], data: MQTTInfoData, answerMachineID:string) => {
            if (data.QuestionDetail?.length === 1) {
                selectQuestionType.value = QuestionType.value[data.QuestionDetail[0].QuestionType];
            } else {
                selectQuestionType.value = `${data.QuestionDetail?.length}题`;
            }
            mqttInfo.value = data;
            AnswerMachineID.value = answerMachineID;
            selectStudentList.value = studentList;
            isShowTimer.value = true;
            // questionOption.value = data.QuestionOption;
        };

        const endAnswer = async (time: string, studentList: Student[]) => {
            answerTime.value = time;
            mqttInfo.value!.IsEnd = true;
            unAnswerStudentList.value = studentList;
            // const res = await getStudentAnswerEndInfo(mqttInfo.value);
            const res = await getStudentQuestionResult({ AnswerMachineID: AnswerMachineID.value });
            // const res = await getStudentQuestionResult({ AnswerMachineID: "C696DA084848C9E8B2D0A2CB00853504" });
            if (res.resultCode === 200) {
                isShowTimer.value = false;
                isShowAnswerResult.value = true;
                console.log(res.result, "=======");
                // studentAnswerInfoList.value = res.result;
                answerDetail.value = res.result;
            }
        };

        window.electron.ipcRenderer.on("sendAllStudentList", (_, studentList) => {
            allStudentList.value = studentList;
            console.log(allStudentList.value, "allStudentList.value");
        }
        );
        return {
            locale: zhCn,
            currentUserInfo,
            allStudentList,
            start,
            isShowAnswerResult,
            selectStudentList,
            selectQuestionType,
            endAnswer,
            answerMode,
            unAnswerStudentList,
            studentAnswerInfoList,
            answerDetail,
            questionOption,
            answerTime,
            isShowTimer,
            AnswerMachineID
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
.answer-app{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0,0,0,0.4);
}
</style>
