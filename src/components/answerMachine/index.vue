<template>
    <div :class="['answer-box', fixed ? 'fixed-box' : '']">
        <start-answer
            :currentUserInfo="currentUserInfo"
            :yunInfo="yunInfo"
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
            :answerDetail="answerDetail"
            :questionType="selectQuestionType"
        />
        <div class="iframe-footer" v-if="fixed">
            <div class="iframe-footer-btn" @click="close">
                <p>关闭</p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import StartAnswer from "@/childWindow/answerMachine/startAnswer.vue";
import { computed, defineComponent, provide, reactive, ref, toRefs } from "vue";
import { get, STORAGE_TYPES } from "@/utils/storage";
import { AnswerMode, MachineModeQuestionType, PADModeQuestionType } from "@/childWindow/answerMachine/enum";
import { Student } from "@/types/labelManage";
import { MutationTypes, useStore } from "@/store";
import {
    getStudentQuestionResult,
    MQTTInfoData,
    StudentAnswerInfo,
    StudentAnswerInfoList
} from "@/childWindow/answerMachine/api";
import AnswerTimer from "@/childWindow/answerMachine/answerTimer.vue";
import AnswerResult from "@/childWindow/answerMachine/answerResult.vue";
import { IYunInfo } from "@/types/login";
import { fetchAllStudents } from "@/views/labelManage/api";

interface State {
    isShowTimer: boolean,
    isShowAnswerResult: boolean,
    allStudentList: Student[],
    answerMode: number,
    selectQuestionType: string,
    AnswerMachineID: string,
    selectStudentList: Student[],
    answerTime: string,
}

export default defineComponent({
    name: "answerMachine",
    components: { AnswerResult, AnswerTimer, StartAnswer },
    props: {
        lessonId: {
            type: String,
            required: true
        },
        fixed: {
            type: Boolean,
            default: false
        },
        index: {
            type: Number,
            default: 0
        }
    },
    setup(props) {
        const currentUserInfo = get(STORAGE_TYPES.CURRENT_USER_INFO);
        const yunInfo: IYunInfo = get(STORAGE_TYPES.YUN_INFO);
        const mqttInfo = ref<MQTTInfoData>();
        const state = reactive<State>({
            isShowTimer: false,
            isShowAnswerResult: false,
            allStudentList: [],
            answerMode: AnswerMode.PAD,
            selectQuestionType: "",
            AnswerMachineID: "",
            selectStudentList: [],
            answerTime: ""
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
            console.log(state.selectStudentList, "state.selectStudentList====");
            state.isShowTimer = true;
        };

        const endAnswer = async (time: string, studentList: Student[]) => {
            state.answerTime = time;
            mqttInfo.value!.IsEnd = true;
            // const res = await getStudentAnswerEndInfo(mqttInfo.value);
            const res = await getStudentQuestionResult({ AnswerMachineID: state.AnswerMachineID });
            // const res = await getStudentQuestionResult({ AnswerMachineID: "C696DA084848C9E8B2D0A2CB00853504" });
            if (res.resultCode === 200) {
                state.isShowTimer = false;
                state.isShowAnswerResult = true;
                answerDetail.value = res.result;
            }
        };

        const store = useStore();
        const resource = computed(() => store.state.common.showResourceFullScreen.length > 0 ? store.state.common.showResourceFullScreen[props.index].resource : null);
        const close = () => {
            store.commit(MutationTypes.REMOVE_FULLSCREEN_RESOURCE, { id: resource.value?.id, openMore: resource.value?.openMore });
        };

        const getStudentList = async () => {
            state.allStudentList = [];
            const data = {
                TeacherId: currentUserInfo.userCenterUserID,
                OrgId: currentUserInfo.schoolId
            };
            const res = await fetchAllStudents(data);
            if (res.resultCode === 200) {
                state.allStudentList = res.result;
            }
        };
        getStudentList();
        return {
            ...toRefs(state),
            currentUserInfo,
            yunInfo,
            answerDetail,
            start,
            endAnswer,
            close
        };
    }
});
</script>

<style scoped lang="scss">
.answer-box{
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    flex: 1;
    min-height: 0;
    overflow: hidden;
    background: #fff;
}
.fixed-box{
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 10000;
    background-color: #fff;
}
.iframe-footer {
    width: 100%;
    height: 80px;
    padding: 12px;
    background: rgb(125, 164, 236);
    display: flex;
    align-items: center;
    justify-content: center;
    .iframe-footer-btn {
        width: 64px;
        height: 64px;
        cursor: pointer;
        margin-right: 20px;
        background: url("~@/assets/look/btn_guanbi@2x.png");
        background-size: 100% 100%;
        p {
            color: #fff;
            text-align: center;
            font-size: 12px;
            line-height: 24px;
            margin-top: 40px;
            font-weight: 550;
        }
    }
}
</style>
