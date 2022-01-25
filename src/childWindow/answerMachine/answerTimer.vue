<template>
    <div class="answer-timer-warp">
        <div class="title-warp">
            <el-icon :size="20"><alarm-clock /></el-icon>
            <span class="title">计时</span>
            <span class="question-type">{{QuestionType[questionType]}}</span>
        </div>
        <div class="content-warp">
            <span class="time">{{showTime}}</span>
            <div class="toll">
                <div class="number-warp">
                    <el-icon :size="16" color="#EE6058"><warning /></el-icon>
                    <span class="number">未答人数：{{unAnswerStudentList.length}}</span>
                </div>
                <div class="number-warp">
                    <el-icon :size="16" color="#83CC53"><circle-check /></el-icon>
                    <span class="number">已答人数：{{studentList.length - unAnswerStudentList.length}}</span>
                </div>
            </div>
        </div>
        <div class="footer" @click="endAnswer">
            收题
        </div>
    </div>
</template>

<script lang="ts">
import { screen } from "@electron/remote";
import { defineComponent, inject, onMounted, onUnmounted, PropType, ref } from "vue";
import useCountDown from "@/hooks/useCountDown";
import { Student } from "@/types/labelManage";
import { remove } from "lodash";
import { PADModeQuestionType } from "./enum";
export default defineComponent({
    props: {
        studentList: {
            type: Array as PropType<Student[]>,
            default: () => []
        },
        questionType: {
            type: Number,
            default: -1
        }
    },
    setup(props, { emit }) {
        const size = screen.getPrimaryDisplay().workAreaSize;
        const unAnswerStudentList = ref([...props.studentList]);
        const QuestionType = inject(
            "QuestionType",
            ref(PADModeQuestionType)
        );
        const { showTime, startCountDown, endCountDown } = useCountDown();

        const answerJection = (_:unknown, data:any) => {
            remove(unAnswerStudentList.value, (student) => {
                return student.StudentID === data.studentId;
            });
        };

        const endAnswer = () => {
            emit("endAnswer", showTime.value, unAnswerStudentList.value);
        };

        onMounted(() => {
            startCountDown();
            window.electron.ipcRenderer.on("answer-jection", answerJection);
        });

        onUnmounted(() => {
            endCountDown();
            window.electron.ipcRenderer.off("answer-jection", answerJection);
        });

        window.electron.setContentSize(383, 253);
        window.electron.setPositionWin(size.width - 24 - 383, 84);
        return	{
            showTime,
            endAnswer,
            QuestionType,
            unAnswerStudentList
        };
    }
});
</script>

<style lang="scss" scoped>
.answer-timer-warp {
    width: 383px;
    height: 253px;
    background: rgba(5, 5, 5, 0.8);
    box-shadow: 0px 6px 16px -8px rgba(0, 0, 0, 0.12), 0px 9px 28px 0px rgba(0, 0, 0, 0.08), 0px 12px 48px 16px rgba(0, 0, 0, 0.05);
    border-radius: 8px;
    color: rgba(255, 255, 255, 0.8);
    display: flex;
    flex-direction: column;
    .title-warp {
        height: 60px;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        font-size: 20px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        .title {
            margin-left: 8px;
        }
        .question-type {
            position: absolute;
            top: 0;
            left: 0;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0 12px;
            background: #4B71EE;
            border-radius: 8px 4px 4px 0px;
            font-size: 14px;
        }
    }
    .content-warp {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        padding: 24px 0 16px;
        .time {
            font-size: 40px;
            font-weight: bold;
        }
        .toll {
            margin-top: 24px;
            display: flex;
            width: 100%;
            padding: 0 42px;
            font-size: 16px;
            align-items: center;
            justify-content: space-between;
            .number-warp {
                display: flex;
            }
            .number {
                margin-left: 8px;
            }
        }
    }
    .footer {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 54px;
        background: rgba(75, 113, 238, 0.8);
        font-size: 16px;
        border-radius: 0px 0px 8px 8px;
        box-shadow: 0px 6px 16px -8px rgba(0, 0, 0, 0.12), 0px 9px 28px 0px rgba(0, 0, 0, 0.08), 0px 12px 48px 16px rgba(0, 0, 0, 0.05);
        opacity: 0.8;
        cursor: pointer;
    }
}
</style>
