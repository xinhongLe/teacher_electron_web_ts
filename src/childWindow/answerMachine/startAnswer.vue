<template>
    <div :class="['main', lessonId ? '' : 'main_bg']" v-show="!isShowStudentList">
        <Title title="答题器" :close="close" :lessonId="lessonId"/>
        <div class="content">
            <!-- <div class="change-mode" @click="changeMode">
                <el-icon color="#4b71ee" class="change-icon"><sort /></el-icon
                >{{
                    answerMode === AnswerMode.PAD
                        ? "切换至答题器答题模式"
                        : "切换至pad答题模式"
                }}
            </div> -->
            <el-form ref="formRef" :model="form" :rules="rules">
                    <div class="select-warp">
                        <span class="label p_b_20">请选择班级：</span>
                        <el-form-item label="" prop="selectClass">
                            <el-select popper-class="answer-select" v-model="form.selectClass" @change="_getAnswerMachineQuestionList">
                                <el-option
                                    v-for="item in classList"
                                    :key="item.ClassId"
                                    :label="item.ClassName"
                                    :value="item.ClassId"
                                />
                            </el-select>
                        </el-form-item>
                        <span class="view-btn" v-show="answerMode === AnswerMode.AnswerMachine" @click="isShowStudentList = true">查看</span>
                    </div>
                <div v-for="(item, i) in form.topicList" :key="i">
                        <div class="row">
                            <div class="select-warp m_b_22">
                                <span class="label">
                                    <span style="float: left">题{{ i + 1 }}</span>
                                    <span>类型：</span>
                                </span>
                                <el-button
                                    @click="choiceQuestionType(item, QuestionType.单选题)"
                                    :type="item.questionType === QuestionType.单选题 ? 'primary' : 'default'"
                                >单选题
                                </el-button>
                                <el-button
                                    @click="choiceQuestionType(item, QuestionType.多选题)"
                                    :type="item.questionType === QuestionType.多选题 ? 'primary' : 'default'"
                                >多选题
                                </el-button
                                >
                                <el-button
                                    @click="choiceQuestionType(item, QuestionType.判断题)"
                                    :type="item.questionType === QuestionType.判断题 ? 'primary' : 'default'"
                                >判断题
                                </el-button
                                >
                            </div>
                            <div class="select-warp" v-show="answerMode === AnswerMode.PAD">
                                <span class="label p_b_20">选项：</span>
                                <el-form-item label="" :prop="`topicList[${i}].selectSetting`" :rules="rules.option">
                                    <el-cascader
                                        popper-class="answer-select"
                                        :options="item.option"
                                        v-model="item.selectSetting"
                                        :disabled="!(item.selectSetting.length > 0)"
                                        placeholder="请选择类型"
                                    />
                                </el-form-item>
                            </div>
                            <div v-if="form.topicList.length > 1" class="del-btn" @click="delRow(i)">
                                <img src="@/assets/images/suspension/icon_delete.png" alt="">
                            </div>
                        </div>
                </div>
            </el-form>
        </div>
        <div class="add-btn" @click="addRow">
            <img src="@/assets/images/suspension/icon_add.png" alt="">
            <span>添加题目</span>
        </div>
        <div class="footer">
            <div>
                <el-button v-if="!lessonId" @click="close">取消</el-button>
                <el-tooltip content="您可以提前准备好题目并【保存为草稿】下次打开可直接使用" placement="top">
                    <el-button type="primary"  @click="start(0)" plain>保存为草稿</el-button>
                </el-tooltip>

                <el-tooltip content="您可以提前准备好题目并【加入当前备课包】上课时打开备课包可直接使用" placement="top">
                    <el-button type="primary" @click="start(1)">确定</el-button>
                </el-tooltip>
            </div>
        </div>
    </div>
    <StudentList
        v-if="isShowStudentList"
        v-model:isShowStudentList="isShowStudentList"
        :studentList="selectStudentList"
    />
</template>

<script lang="ts">
import { computed, defineComponent, inject, PropType, reactive, ref, toRefs, watch } from "vue";
import { Student } from "@/types/labelManage";
import { groupBy, uniqBy, cloneDeep } from "lodash";
import { MQTTInfoData, getAnswerMachineQuestionList, saveAnswerMachineQuestion } from "./api";
import { AnswerMode, PADModeQuestionType, getChoiceQuestion } from "./enum";
import useStudentMachine from "@/hooks/useStudentMachine";
import StudentList from "./studentList.vue";
import Title from "./title.vue";
import { UserInfoState } from "@/types/store";
import { getTeacherClassList } from "@/views/login/api";
import { IClassItem, IGradeItem } from "@/types/quickAnswer";
import { ElMessage } from "element-plus";

export default defineComponent({
    components: {
        StudentList,
        Title
    },
    props: {
        allStudentList: {
            type: Array as PropType<Student[]>,
            default: () => []
        },
        answerMode: {
            type: Number as PropType<AnswerMode>,
            required: true
        },
        currentUserInfo: {
            type: Object as PropType<UserInfoState>,
            required: true
        },
        lessonId: {
            type: String,
            default: () => ""
        }
    },
    setup(props, { emit }) {
        const isShowStudentList = ref(false);
        const choiceQuestion = getChoiceQuestion();
        const QuestionType = inject("QuestionType", ref(PADModeQuestionType));
        const questionnaireOption = [
            {
                value: "2",
                label: "2",
                children: [
                    { value: "√ ×", label: "√ ×" },
                    { value: "T F", label: "T F" }
                ]
            }
        ];
        const state = reactive({
            rules: {
                selectClass: [{ required: true, message: "请选择班级", trigger: "change" }],
                option: [{ required: true, message: "请选择类型", trigger: "change" }]
            },
            form: {
                selectClass: "",
                topicList: [{ questionType: 0, selectSetting: [], option: [] }]
            },
            classList: [] as IClassItem[]
        });
        const { studentMachineListByClassIdMap, getStudentMachineListMap, studentMachineListMap } = useStudentMachine();

        const allStudentListMap = computed(() => {
            const allListMap = groupBy(props.allStudentList, "ClassID");
            const listMap: Record<string, Student[]> = {};
            Object.keys(allListMap).forEach((key) => {
                listMap[key] = uniqBy(allListMap[key], "StudentID");
            });
            return listMap;
        });

        const selectStudentList = computed(() => {
            getStudentMachineListMap(state.form.selectClass);
            return allStudentListMap.value[state.form.selectClass]?.filter(
                (item) => studentMachineListMap.value && studentMachineListMap.value[item.Account]);
        });

        watch(isShowStudentList, (v) => {
            if (v) {
                window.electron.setContentSize(846, 750);
            } else {
                window.electron.setContentSize(620, 422);
            }
            window.electron.setCenter();
        });

        const close = () => {
            window.electron.destroyWindow();
        };

        const formRef = ref();
        const start = (type:number) => {
            if (type === 0) {
                handleConfirm(type);
            } else {
                formRef.value.validate(async (valid:boolean) => {
                    if (valid) {
                        handleConfirm(type);
                    }
                });
            }
        };

        const handleConfirm = async(type:number) => {
            const data: MQTTInfoData = {
                TeacherID: props.currentUserInfo!.userCenterUserID,
                OrgID: props.currentUserInfo!.schoolId,
                ClassID: state.form.selectClass,
                QuestionId: `question_${new Date().getTime()}`,
                Type: 0,
                SaveType: type,
                IsEnd: false,
                TimeStamp: null,
                Topic: `answer_${state.form.selectClass}`,
                QuestionDetail: state.form.topicList.map((item: any, index:number) => {
                    return {
                        ID: item.ID,
                        Sort: index,
                        QuestionType: item.questionType,
                        QuestionOption: item.selectSetting.length > 0 ? item.selectSetting[1].replaceAll(" ", ";") : null,
                        QuestionNum: item.selectSetting.length > 0 ? Number(item.selectSetting[0]) : 0
                    };
                })
            };
            if (props.answerMode === AnswerMode.PAD) {
                // const res = await sendMQTTInfo(data);
                const res = await saveAnswerMachineQuestion({ ...data, LessonId: props.lessonId ? props.lessonId : null });
                if (res.resultCode === 200) {
                    if (type === 1) {
                        emit("start",
                            allStudentListMap.value[state.form.selectClass] || [],
                            data,
                            res.result.AnswerMachineID
                        );
                    } else {
                        ElMessage.success("保存草稿成功");
                    }
                }
            }
        };

        const changeMode = () => {
            emit("update:answerMode", props.answerMode === AnswerMode.PAD ? AnswerMode.AnswerMachine : AnswerMode.PAD);
        };

        const addRow = () => {
            if (state.form.topicList.length === 10) return ElMessage.warning("最多添加10道题");
            state.form.topicList.push(cloneDeep({ questionType: 0, selectSetting: [], option: [] }));
        };

        const delRow = (index: number) => {
            state.form.topicList.splice(index, 1);
        };

        const choiceQuestionType = (item: any, type: PADModeQuestionType) => {
            if (item.questionType === type) return;
            item.questionType = type;
            if (type === QuestionType.value.判断题) {
                // option.value = questionnaireOption;
                // selectSetting.value = [
                //     questionnaireOption[0].value,
                //     questionnaireOption[0].children[0].value
                // ];
                item.option = questionnaireOption;
                item.selectSetting = [
                    questionnaireOption[0].value,
                    questionnaireOption[0].children[0].value
                ];
            } else {
                // option.value = choiceQuestion;
                // selectSetting.value = [
                //     choiceQuestion[3].value,
                //     choiceQuestion[3].children[0].value
                // ];
                item.option = choiceQuestion;
                item.selectSetting = [
                    choiceQuestion[3].value,
                    choiceQuestion[3].children[0].value
                ];
            }
        };
        const _getAnswerMachineQuestionList = () => {
            const data = {
                TeacherID: props.currentUserInfo!.userCenterUserID,
                OrgID: props.currentUserInfo!.schoolId,
                ClassID: state.form.selectClass,
                LessonId: props.lessonId ? props.lessonId : null
            };
            getAnswerMachineQuestionList(data).then(res => {
                if (res.resultCode === 200) {
                    const topicList = (res.result && res.result.QuestionDetail) ? res.result.QuestionDetail.map((item:any) => {
                        return {
                            questionType: item.QuestionType,
                            selectSetting: item.QuestionType ? [item.QuestionNum.toString(), item.QuestionOption.replaceAll(";", " ")] : [],
                            option: item.QuestionType === QuestionType.value.判断题 ? questionnaireOption : choiceQuestion

                        };
                    }) : [{ questionType: 0, selectSetting: [], option: [] }];
                    state.form.topicList = topicList;
                    if (res.result && res.result.ClassID) state.form.selectClass = res.result.ClassID;
                }
            });
        };
        const _getTeacherClassList = () => {
            const data = {
                Base_OrgId: props.currentUserInfo!.schoolId,
                TeacherId: props.currentUserInfo!.userCenterUserID
            };
            getTeacherClassList(data).then(res => {
                if (res.resultCode === 200) {
                    const gradeList = res.result || [];
                    let classList:IClassItem[] = [];
                    gradeList.forEach((item:IGradeItem) => {
                        classList = classList.concat(item.ClassList);
                    });
                    state.classList = classList;
                    _getAnswerMachineQuestionList(); // 不传ClassID 获取上次的草稿记录
                }
            });
        };

        _getTeacherClassList();

        return {
            close,
            ...toRefs(state),
            formRef,
            allStudentListMap,
            addRow,
            delRow,
            choiceQuestionType,
            selectStudentList,
            QuestionType,
            AnswerMode,
            changeMode,
            studentMachineListByClassIdMap,
            isShowStudentList,
            start,
            _getAnswerMachineQuestionList
        };
    }
});
</script>

<style lang="scss" scoped>
$blue: #4b71ee;
.main_bg{
    height: 550px!important;
    border-radius: 8px;
    //background: #fff;
    box-shadow: 0px 6px 16px -8px rgba(0, 0, 0, 0.12),
    0px 9px 28px 0px rgba(0, 0, 0, 0.08),
    0px 12px 48px 16px rgba(0, 0, 0, 0.05);
    border: 1px solid #ccc;
}
.main {
    width: 620px;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding-bottom: 24px;
    -webkit-app-region: no-drag;

    .content {
        padding-left: 50px;
        margin-top: 48px;
        flex: 1;
        overflow-y: auto;

        .change-mode {
            display: flex;
            padding-right: 60px;
            justify-content: flex-end;
            align-items: center;
            color: $blue;
            font-size: 14px;
            justify-self: flex-end;
            margin-bottom: 24px;
            cursor: pointer;

            .change-icon {
                transform: rotate(90deg);
                margin-right: 5px;
            }
        }

        .select-warp {
            display: flex;
            align-items: center;

            :deep(.el-button) {
                width: 110px;

                + .el-button {
                    margin-left: 16px;
                }
            }

            .el-button--primary:focus, .el-button--primary:hover {
                background: #4b71ee;
                border-color: #4b71ee;
            }

            .label {
                width: 100px;
                font-size: 16px;
                color: #5f626f;
                margin-right: 24px;
                text-align: right;
            }
            .p_b_20 {
                padding-bottom: 20px;
            }

            :deep(.el-select) {
                width: 362px;
            }

            :deep(.el-cascader) {
                width: 362px;
            }

            .view-btn {
                cursor: pointer;
                margin-left: 16px;
                color: $blue;
                font-size: 14px;
            }
        }

        .m_b_22 {
            margin-bottom: 22px;
        }

        .row {
            position: relative;
        }

        .del-btn {
            position: absolute;
            right: 30px;
            top: 40px;
            cursor: pointer;
        }
    }

    .add-btn {
        display: flex;
        align-items: center;
        cursor: pointer;
        font-size: 14px;
        color: #4B71EE;
        margin: 20px 0 20px 50px;

        span {
            margin-left: 8px;
        }
    }

    .footer {
        display: flex;
        justify-content: flex-end;
        flex-shrink: 0;
        margin-right: 20px;

        :deep(.el-button) {
            width: 120px;
            margin-left: 24px;
        }

        //:deep(.el-popper.is-customized) {
        //    padding: 6px 12px;
        //    background-color: rgba(0,0,0,0.3);
        //}
    }
}
</style>
