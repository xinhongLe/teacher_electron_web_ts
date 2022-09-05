<template>
    <div class="main" v-show="!isShowStudentList">
        <Title title="答题器" :close="close"/>
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
                            <el-select v-model="form.selectClass">
                                <el-option
                                    v-for="item in classList"
                                    :key="item.ID"
                                    :label="answerMode === AnswerMode.AnswerMachine
                                    ? `${item.Name}(${studentMachineListByClassIdMap[item.ID] ?.length > 0
                                              ? allStudentListMap[item.ID] ?.length || 0 : 0})`
                                    : `${item.Name}`"
                                    :value="item.ID"
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
                                        :options="item.option"
                                        v-model="item.selectSetting"
                                        :disabled="!(item.selectSetting.length > 0)"
                                        placeholder="请选择类型"
                                    />
                                </el-form-item>
                            </div>
                            <div v-if="form.topicList.length > 0" class="del-btn" @click="delRow(i)">
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
                <el-button @click="close">取消</el-button>
                <el-tooltip content="您可以提前准备好题目并【保存为草稿】下次打开可直接使用" placement="top">
                    <el-button type="primary" plain>保存为草稿</el-button>
                </el-tooltip>

                <el-tooltip content="您可以提前准备好题目并【加入当前备课包】上课时打开备课包可直接使用" placement="top">
                    <el-button type="primary" @click="start">确定</el-button>
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
import { get, STORAGE_TYPES } from "@/utils/storage";
import { LessonClasses } from "@/types/login";
import { Student } from "@/types/labelManage";
import { groupBy, uniqBy, cloneDeep } from "lodash";
import { sendMQTTInfo, MQTTInfoData } from "./api";
import { AnswerMode, PADModeQuestionType } from "./enum";
import useStudentMachine from "@/hooks/useStudentMachine";
import StudentList from "./studentList.vue";
import Title from "./title.vue";
function getChoiceQuestion() {
    const list = [];
    for (let i = 1; i <= 8; i++) {
        const item = {
            value: String(i),
            label: String(i),
            children: [
                {
                    value: "",
                    label: ""
                }
            ]
        };
        let numberChoice = "1";
        let englishChoice = "A";
        for (let j = 1; j < i; j++) {
            numberChoice += ` ${j + 1}`;
            englishChoice += ` ${String.fromCharCode(j + 65)}`;
        }
        item.children = [
            {
                value: englishChoice,
                label: englishChoice
            },
            {
                value: numberChoice,
                label: numberChoice
            }
        ];
        list.push(item);
    }
    return list;
}

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
        }
    },
    setup(props, { emit }) {
        const userInfo = get(STORAGE_TYPES.USER_INFO);
        const classList = userInfo?.Classes as LessonClasses[];
        const selectClass = ref("");
        const selectSetting = ref<string[]>([]);
        // const isSelected = ref(true);
        const isShowStudentList = ref(false);
        const choiceQuestion = getChoiceQuestion();
        const QuestionType = inject("QuestionType", ref(PADModeQuestionType));
        console.log(QuestionType, "QuestionType");
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
        const option = ref();
        const questionType = ref();
        const state = reactive({
            rules: {
                selectClass: [{ required: true, message: "请选择班级", trigger: "change" }],
                option: [{ required: true, message: "请选择类型", trigger: "change" }]
            },
            form: {
                selectClass: "",
                topicList: [{ questionType: 0, selectSetting: [], option: [] }]
            }
        });
        const topicList = ref(
            [
                { questionType: 0, selectSetting: [], option: [] }
            ]
        );
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
            getStudentMachineListMap(selectClass.value);
            return allStudentListMap.value[selectClass.value]?.filter(
                (item) => studentMachineListMap.value && studentMachineListMap.value[item.Account]);
        });

        const close = () => {
            window.electron.destroyWindow();
        };

        const formRef = ref();
        const start = async () => {
            console.log(topicList.value, "-----");
            formRef.value.validate((valid:boolean) => {
                if (valid) {
                    const data: MQTTInfoData = {
                        TeacherId: userInfo.ID,
                        ClassId: selectClass.value,
                        QuestionId: `question_${new Date().getTime()}`,
                        // QuestionType: questionType.value,
                        // QuestionOption: selectSetting.value[1].replaceAll(" ", ";"),
                        // QuestionNum: Number(selectSetting.value[0]),
                        IsEnd: false,
                        TimeStamp: null,
                        Topic: `answer_${selectClass.value}`,
                        TopicList: state.form.topicList.map((item: any) => {
                            return {
                                QuestionType: item.questionType,
                                QuestionOption: item.selectSetting[1].replaceAll(" ", ";"),
                                QuestionNum: Number(item.selectSetting[0])
                            };
                        })
                    };
                    console.log(data, "data-----");
                    if (props.answerMode === AnswerMode.PAD) {
                        // const res = await sendMQTTInfo(data);
                        const res = { resultCode: 200 };
                        if (res.resultCode === 200) {
                            emit("start",
                                allStudentListMap.value[selectClass.value] || [],
                                // questionType.value,
                                data
                            );
                        }
                    } else {
                        emit(
                            "start",
                            allStudentListMap.value[selectClass.value] || [],
                            // questionType.value,
                            data
                        );
                    }
                }
            });
        };

        const changeMode = () => {
            emit(
                "update:answerMode",
                props.answerMode === AnswerMode.PAD
                    ? AnswerMode.AnswerMachine
                    : AnswerMode.PAD
            );
        };

        const addRow = () => {
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

        watch(isShowStudentList, (v) => {
            if (v) {
                window.electron.setContentSize(846, 750);
            } else {
                window.electron.setContentSize(620, 422);
            }
            window.electron.setCenter();
        });

        return {
            close,
            ...toRefs(state),
            formRef,
            selectClass,
            allStudentListMap,
            option,
            selectSetting,
            // isSelected,
            topicList,
            addRow,
            delRow,
            choiceQuestionType,
            selectStudentList,
            questionType,
            QuestionType,
            AnswerMode,
            classList,
            changeMode,
            studentMachineListByClassIdMap,
            isShowStudentList,
            start
        };
    }
});
</script>

<style lang="scss" scoped>
$blue: #4b71ee;
.main {
    width: 620px;
    height: 550px;
    border-radius: 8px;
    background: #fff;
    box-shadow: 0px 6px 16px -8px rgba(0, 0, 0, 0.12),
    0px 9px 28px 0px rgba(0, 0, 0, 0.08),
    0px 12px 48px 16px rgba(0, 0, 0, 0.05);
    border: 1px solid #ccc;
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
