<template>
    <div class="main" v-show="!isShowStudentList">
        <Title title="答题器" :close="close" />
        <div class="content">
            <!-- <div class="change-mode" @click="changeMode">
                <el-icon color="#4b71ee" class="change-icon"><sort /></el-icon
                >{{
                    answerMode === AnswerMode.PAD
                        ? "切换至答题器答题模式"
                        : "切换至pad答题模式"
                }}
            </div> -->
            <div class="select-warp">
                <span class="label">请选择班级：</span>
                <el-select v-model="selectClass">
                    <el-option
                        v-for="item in classList"
                        :key="item.ID"
                        :label="
                            answerMode === AnswerMode.AnswerMachine
                                ? `${item.Name}(${
                                      studentMachineListByClassIdMap[item.ID]
                                          ?.length > 0
                                          ? allStudentListMap[item.ID]
                                                ?.length || 0
                                          : 0
                                  })`
                                : `${item.Name}`
                        "
                        :value="item.ID"
                    />
                </el-select>
                <span
                    class="view-btn"
                    v-show="answerMode === AnswerMode.AnswerMachine"
                    @click="isShowStudentList = true"
                    >查看</span
                >
            </div>
            <div class="select-warp">
                <span class="label">请选择类型：</span>
                <el-button
                    @click="choiceQuestionType(QuestionType.单选题)"
                    :type="
                        questionType === QuestionType.单选题
                            ? 'primary'
                            : 'default'
                    "
                    >单选题</el-button
                >
                <el-button
                    @click="choiceQuestionType(QuestionType.多选题)"
                    :type="
                        questionType === QuestionType.多选题
                            ? 'primary'
                            : 'default'
                    "
                    >多选题</el-button
                >
                <el-button
                    @click="choiceQuestionType(QuestionType.判断题)"
                    :type="
                        questionType === QuestionType.判断题
                            ? 'primary'
                            : 'default'
                    "
                    >判断题</el-button
                >
            </div>
            <div class="select-warp" v-show="answerMode === AnswerMode.PAD">
                <span class="label">选项设置：</span>
                <el-cascader
                    :options="option"
                    v-model="selectSetting"
                    v-if="isSelected"
                    :disabled="!option"
                    placeholder="请选择类型"
                />
            </div>
        </div>
        <div class="footer">
            <el-button @click="close">取消</el-button>
            <el-button
                type="primary"
                @click="start"
                :disabled="
                    answerMode === AnswerMode.PAD
                        ? !(
                              selectClass &&
                              questionType &&
                              selectSetting.length !== 0
                          )
                        : !(
                              studentMachineListByClassIdMap[selectClass]
                                  ?.length > 0 && questionType
                          )
                "
                >确定</el-button
            >
        </div>
    </div>
    <StudentList
        v-if="isShowStudentList"
        v-model:isShowStudentList="isShowStudentList"
        :studentList="selectStudentList"
    />
</template>

<script lang="ts">
import { computed, defineComponent, inject, PropType, Ref, ref, watch } from "vue";
import { get, STORAGE_TYPES } from "@/utils/storage";
import { LessonClasses } from "@/types/login";
import { Student } from "@/types/labelManage";
import { groupBy, uniqBy } from "lodash";
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
        const isSelected = ref(true);
        const isShowStudentList = ref(false);
        const choiceQuestion = getChoiceQuestion();
        const QuestionType = inject(
            "QuestionType",
            ref(PADModeQuestionType)
        );
        const questionnaireOption = [
            {
                value: "2",
                label: "2",
                children: [
                    {
                        value: "√ ×",
                        label: "√ ×"
                    },
                    {
                        value: "T F",
                        label: "T F"
                    }
                ]
            }
        ];
        const option = ref();
        const questionType = ref();
        const {
            studentMachineListByClassIdMap,
            getStudentMachineListMap,
            studentMachineListMap
        } = useStudentMachine();

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
                (item) =>
                    studentMachineListMap.value &&
                    studentMachineListMap.value[item.Account]);
        });

        const close = () => {
            window.electron.destroyWindow();
        };

        const start = async () => {
            const data: MQTTInfoData = {
                TeacherId: userInfo.ID,
                ClassId: selectClass.value,
                QuestionId: `question_${new Date().getTime()}`,
                QuestionType: questionType.value,
                QuestionOption: selectSetting.value[1].replaceAll(" ", ";"),
                QuestionNum: Number(selectSetting.value[0]),
                IsEnd: false,
                TimeStamp: null,
                Topic: `answer_${selectClass.value}`
            };
            if (props.answerMode === AnswerMode.PAD) {
                const res = await sendMQTTInfo(data);
                if (res.resultCode === 200) {
                    emit(
                        "start",
                        allStudentListMap.value[selectClass.value] || [],
                        questionType.value,
                        data
                    );
                }
            } else {
                emit(
                    "start",
                    allStudentListMap.value[selectClass.value] || [],
                    questionType.value,
                    data
                );
            }
        };

        const changeMode = () => {
            emit(
                "update:answerMode",
                props.answerMode === AnswerMode.PAD
                    ? AnswerMode.AnswerMachine
                    : AnswerMode.PAD
            );
        };

        const choiceQuestionType = (type: PADModeQuestionType) => {
            console.log(type);
            if (questionType.value === type) return;
            questionType.value = type;
            if (type === QuestionType.value.判断题) {
                option.value = questionnaireOption;
                selectSetting.value = [
                    questionnaireOption[0].value,
                    questionnaireOption[0].children[0].value
                ];
            } else {
                option.value = choiceQuestion;
                selectSetting.value = [
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
            selectClass,
            allStudentListMap,
            option,
            selectSetting,
            isSelected,
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
    height: 422px;
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
        padding-left: 70px;
        margin-top: 48px;
        flex: 1;
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
            margin-bottom: 24px;
            align-items: center;
            :deep(.el-button) {
                width: 110px;
                + .el-button {
                    margin-left: 16px;
                }
            }
            .label {
                width: 100px;
                font-size: 16px;
                color: #5f626f;
                margin-right: 24px;
                text-align: right;
            }
            :deep(.el-select) {
                width: 362px;
            }
            .view-btn {
                cursor: pointer;
                margin-left: 16px;
                color: $blue;
                font-size: 14px;
            }
        }
    }
    .footer {
        display: flex;
        justify-content: center;
        flex-shrink: 0;
        :deep(.el-button) {
            width: 120px;
            + .el-button {
                margin-left: 24px;
            }
        }
    }
}
</style>
