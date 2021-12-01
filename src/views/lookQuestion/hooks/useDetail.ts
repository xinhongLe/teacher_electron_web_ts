import router from "@/router";
import { FileInfo, Question } from "@/types/lookQuestion";
import { downloadFile } from "@/utils/oss";
import { ElMessage, ElMessageBox } from "element-plus";
import { ref } from "vue";
import { fetchPureQuestionByQuestionID, getCourseBagQuestionsByIds, getQuestionsByIds } from "../api";

export default (isPureQuestion: boolean, questionId = "") => {
    const imageUrl = ref<string[]>([]);
    const voiceUrl = ref<string[]>([]);
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

    function getUrl(file: FileInfo) {
        const { Extention, FilePath, FileName, Bucket } = file;
        const key = Extention
            ? `${FilePath}/${FileName}.${Extention}`
            : `${FilePath}/${FileName}`;
        return downloadFile(key, Bucket);
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
        voiceUrl.value.push(...(await Promise.all(voiceListProm)));
        imageUrl.value.push(...(await Promise.all(imageListProm)));
    }

    function playSounds(index: number) {
        if (audioRef.value) {
            audioRef.value.src = voiceUrl.value[index];
            audioRef.value.play();
        }
    }

    const getDetail = async () => {
        const type = Number(router.currentRoute.value.params.type);
        const id = router.currentRoute.value.params.id as string;
        const questionID = router.currentRoute.value.query.questionID;
        let res;
        if (isPureQuestion) {
            res = await fetchPureQuestionByQuestionID({
                questionID: questionId
            });
        } else {
            if (type === 3) {
                res = await getCourseBagQuestionsByIds({
                    courseWareTeacherID: id
                });
            } else {
                const data = {
                    paperID: type === 0 ? null : id,
                    questionIDs: [id]
                };
                res = await getQuestionsByIds(data);
            }
        }

        if (res.resultCode === 200) {
            if (type === 2) {
                questionList.value = res.result.filter(
                    ({ QuestionID }) => QuestionID !== questionID
                );
                sum.value = questionList.value.length;
            } else {
                const { result } = res;
                sum.value = result.length;
                questionList.value = result;
            }
            getFileList(questionList.value[0].QuestionFiles, 1);
            getFileList(questionList.value[0].AnswerFiles[0].Files, 2);
            nowQuestionID.value = questionList.value[0].QuestionID;
            isBlackboard.value = true;
        }
    };
    getDetail();

    const nextPage = () => {
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
                nowQuestionID.value = question.QuestionID;
            } else {
                isNextBtn.value = true;
            }
        }
        if (number.value > 1 || nextIndex.value > 1) {
            isLastBtn.value = false;
        }
    };

    const lastPage = () => {
        isNextBtn.value = false;
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
        ElMessageBox.confirm("在此处作业中移除此题目吗?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
        })
            .then(() => {
                // 接口不对，后期会改，先本地假删除
                ElMessage.success("移除成功!");
                audioRef.value!.pause();
                questionList.value = questionList.value.filter(
                    ({ QuestionID }) => QuestionID !== nowQuestionID.value
                );
                sum.value--;
                voiceUrl.value = [];
                imageUrl.value = [];
                nextIndex.value = 1;
                const question = questionList.value[0];
                const { QuestionFiles, AnswerFiles, QuestionID } = question;
                getFileList(QuestionFiles, 1);
                getFileList(AnswerFiles[0].Files, 2);
                nowQuestionID.value = QuestionID;
            })
            .catch();
    };

    return {
        imageUrl,
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
        nextIndex,
        questionList
    };
};
