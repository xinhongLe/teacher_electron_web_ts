import { FileInfo, Question, FlowText } from "@/types/lookQuestion";
import emitter from "@/utils/mitt";
import { getOssUrl } from "@/utils/oss";
import { get, STORAGE_TYPES } from "@/utils/storage";
import { ElMessage, ElMessageBox } from "element-plus";
import { computed, ref, watchEffect, Ref } from "vue";
import { MutationTypes, store, ActionTypes } from "@/store";
import {
    fetchPureQuestionByQuestionID,
    getCourseBagQuestionsByIds,
    getQuestionsByIds,
} from "../api";
import { pullAllBy } from "lodash";

export default (
    isPureQuestion: boolean,
    questionId = "",
    emit: (event: string, ...args: any[]) => void,
    childRef: Ref<any>,
    resource: any,
) => {
    const imageUrl = ref<string[]>([]);
    const questionEditList = ref<FlowText[]>([]);
    const voiceUrl = ref<string[]>([]);
    const voiceUrlMap = ref({
        question: "",
        answer: "",
    });
    const sum = ref(0);
    const isBlackboard = ref(false);
    const nowQuestionID = ref("");
    const questionList = ref<Question[]>([]);
    const audioRef = ref<HTMLAudioElement>();
    const imageRef = ref<HTMLImageElement>();
    const nextIndex = ref(1);
    const isNextBtn = ref(false);
    const isLastBtn = ref(false);
    const number = ref(1);
    const resolutionSwitch = get(STORAGE_TYPES.AUTO_PALY_RESOLUTION_SWITCH);
    const questionSwitch = get(STORAGE_TYPES.AUTO_PALY_QUESTION_SWITCH);
    const resolutionSwitchValue = ref(
        resolutionSwitch === null ? true : Boolean(resolutionSwitch)
    );
    const questionSwitchValue = ref(
        questionSwitch === null ? true : Boolean(questionSwitch)
    );
    const lastId = ref("");

    function getUrl(file: FileInfo) {
        const { Extention, FilePath, FileName, Bucket } = file;
        const key = Extention
            ? `${FilePath}/${FileName}.${Extention}`
            : `${FilePath}/${FileName}`;
        return getOssUrl(key, Bucket);
    }

    async function getFileList(files: FileInfo[], type: number) {
        const imageListProm: Promise<string>[] = [];
        const voiceListProm: Promise<string>[] = [];
        files.forEach((file) => {
            if (type === 1) {
                if (file.Type === 3) {
                    voiceListProm.push(getUrl(file));
                } else if (file.Type === 1) {
                    imageListProm.push(getUrl(file));
                }
            } else {
                if (file.Type === 5) {
                    voiceListProm.push(getUrl(file));
                } else if (file.Type === 3) {
                    imageListProm.push(getUrl(file));
                }
            }
        });
        const voices = await Promise.all(voiceListProm);
        const images = await Promise.all(imageListProm);
        voiceUrl.value.push(...voices);
        imageUrl.value.push(...images);
        voiceUrlMap.value[type === 1 ? "question" : "answer"] = voices[0];
    }

    // 获取试题富文本
    async function getQuestionEditList(data: any) {
        questionEditList.value = [data];
    }

    function playSounds(index: number) {
        if (audioRef.value) {
            audioRef.value.src =
                voiceUrlMap.value[index === 0 ? "question" : "answer"];
            audioRef.value.play();
        }
    }

    const getDetail = async () => {
        const { type, id, deleteQuestionIds = [] } = resource;
        if (!id) return;
        emit("update:isMinimized", false);
        if (id === lastId.value) return;
        voiceUrl.value = [];
        imageUrl.value = [];
        isNextBtn.value = false;
        isLastBtn.value = false;
        number.value = 1;
        nextIndex.value = 1;
        sum.value = 1;
        voiceUrlMap.value = {
            question: "",
            answer: "",
        };
        questionList.value = [];
        let res;
        if (isPureQuestion) {
            res = await fetchPureQuestionByQuestionID({
                questionID: questionId || id,
            });
        } else {
            lastId.value = id;
            childRef.value && childRef.value.clearBrush();
            if (type === 3) {
                res = await getCourseBagQuestionsByIds({
                    courseWareTeacherID: id,
                });
            } else {
                const data = {
                    paperID: type === 0 ? null : id,
                    questionIDs: [id],
                };
                res = await getQuestionsByIds(data);
            }
        }

        if (res.resultCode === 200) {
            const { result } = res;
            !isPureQuestion &&
            pullAllBy(
                result,
                deleteQuestionIds.map((id: string) => ({ QuestionID: id })),
                "QuestionID"
            );
            sum.value = result.length;
            questionList.value = result;
            getFileList(questionList.value[0].QuestionFiles, 1);
            getFileList(questionList.value[0].AnswerFiles[0].Files, 2);
            if (questionList.value[0]?.QuestionFlowText) {
                getQuestionEditList(questionList.value[0].QuestionFlowText);
            }
            nowQuestionID.value = questionList.value[0].QuestionID;
            isBlackboard.value = true;
            //错题本试题篮-当前同类题
            store.state.wrongbook.currentPureQuestion = isPureQuestion
                ? questionList.value[0]
                : {};
            // console.log(
            //     "store.state.wrongbook.currentPureQuestion",
            //     isPureQuestion,
            //     store.state.wrongbook.currentPureQuestion
            // );
        }
    };

    watchEffect(getDetail);

    const nextPage = () => {
        if (isNextBtn.value) {
            ElMessage.warning("已经是最后一页了!");
            return;
        }
        if (nextIndex.value < imageUrl.value.length) {
            playSounds(1);
            imageRef.value &&
            (imageRef.value.src =
                imageUrl.value[imageUrl.value.length - 1]);
            nextIndex.value++;
            if (number.value === sum.value) {
                isNextBtn.value = true;
            }
        } else {
            voiceUrl.value = [];
            imageUrl.value = [];
            nextIndex.value = 1;
            number.value++;
            if (number.value <= sum.value) {
                const question = questionList.value[number.value - 1];

                getFileList(question.QuestionFiles, 1);
                getFileList(question.AnswerFiles[0].Files, 2);
                if (question?.QuestionFlowText) {
                    getQuestionEditList(question.QuestionFlowText);
                }
                nowQuestionID.value = question.QuestionID;
            } else {
                isNextBtn.value = true;
            }
        }
        if (number.value > 1 || nextIndex.value > 1) {
            isLastBtn.value = false;
        }
        //错题本试题篮-当前同类题
        store.state.wrongbook.currentPureQuestion = isPureQuestion
            ? questionList.value[nextIndex.value - 1]
            : {};
    };

    const lastPage = () => {
        isNextBtn.value = false;
        if (isLastBtn.value) {
            ElMessage.warning("已经是第一页了!");
            return;
        }
        if (number.value > 1) {
            isLastBtn.value = false;
            if (nextIndex.value < imageUrl.value.length) {
                number.value--;
                nextIndex.value++;
                if (number.value <= sum.value) {
                    voiceUrl.value = [];
                    imageUrl.value = [];
                    nextIndex.value = 2;
                    const question = questionList.value[number.value - 1];
                    getFileList(question.QuestionFiles, 1);
                    getFileList(question.AnswerFiles[0].Files, 2);
                    if (question?.QuestionFlowText) {
                        getQuestionEditList(question.QuestionFlowText);
                    }
                    nowQuestionID.value = question.QuestionID;
                    //错题本试题篮-当前同类题
                    store.state.wrongbook.currentPureQuestion = isPureQuestion
                        ? question
                        : {};
                } else {
                    isNextBtn.value = true;
                }

                if (
                    number.value === sum.value &&
                    nextIndex.value === imageUrl.value.length
                ) {
                    isNextBtn.value = true;
                }
            } else {
                playSounds(0);
                imageRef.value && (imageRef.value.src = imageUrl.value[0]);
                nextIndex.value--;
                if (
                    number.value === sum.value &&
                    nextIndex.value === imageUrl.value.length
                ) {
                    isNextBtn.value = true;
                }
            }
        } else {
            if (nextIndex.value < imageUrl.value.length) {
                isLastBtn.value = true;
            } else {
                playSounds(0);
                imageRef.value && (imageRef.value.src = imageUrl.value[0]);
                nextIndex.value--;

                if (nextIndex.value < imageUrl.value.length) {
                    isLastBtn.value = true;
                }
            }
        }
    };

    const removeQuestion = () => {
        if (sum.value === 1) {
            return ElMessage.info("至少保留一套题目哦~");
        }
        ElMessageBox.confirm("在此处作业中移除此题目吗?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
        })
            .then(() => {
                // 接口不对，后期会改，先本地假删除
                const { courseBagId, id, type } = resource;
                const questionID =
                    type === 3
                        ? questionList.value[number.value - 1]
                        .CoursebagQuestionID || ""
                        : nowQuestionID.value;
                emitter.emit("deleteQuestion", {
                    courseBagId,
                    paperId: id,
                    questionID,
                });
                ElMessage.success("移除成功!");
                audioRef.value!.pause();
                questionList.value.splice(number.value - 1, 1);
                if (sum.value === number.value) {
                    number.value--;
                }
                sum.value--;
                voiceUrl.value = [];
                imageUrl.value = [];
                nextIndex.value = 1;
                const question = questionList.value[number.value - 1];
                const { QuestionFiles, AnswerFiles, QuestionID } = question;
                getFileList(QuestionFiles, 1);
                getFileList(AnswerFiles[0].Files, 2);
                if (question?.QuestionFlowText) {
                    getQuestionEditList(question.QuestionFlowText);
                }
                nowQuestionID.value = QuestionID;
            })
            .catch();
    };

    const questionSn = computed(() => questionList.value[number.value - 1]?.SN);

    return {
        imageUrl,
        questionEditList,
        voiceUrl,
        sum,
        isBlackboard,
        nowQuestionID,
        playSounds,
        imageRef,
        audioRef,
        isLastBtn,
        number,
        lastPage,
        nextPage,
        isNextBtn,
        removeQuestion,
        voiceUrlMap,
        questionSn,
        resolutionSwitchValue,
        nextIndex,
        questionSwitchValue,
        questionList,
        getQuestionEditList
    };
};
