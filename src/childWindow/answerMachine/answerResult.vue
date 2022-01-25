<template>
    <div class="answer-result-warp">
        <div class="title-warp">
            <el-icon :size="24" color="#8B8B8F"><clock /></el-icon>
            <span class="title">答题计时：{{time}}</span>
            <div class="progress-warp">
                <span class="progress-text">提交 {{studentAnswerInfoList.length}}/{{studentList.length}}</span>
                <div :style="{width: '214px'}">
                    <el-progress :percentage="percentage" :color="customColorMethod"></el-progress>
                </div>
            </div>
            <div class="close-btn" @click="close">
                <el-icon :size="14" color="#9C9FAA"><close /></el-icon>
            </div>
        </div>
        <div class="content-warp">
            <div class="content-container">
                <span class="title">答题统计</span>
                <div class="statistics">
                    <div class="type">{{QuestionType[questionType]}}</div>
                    <div class="echart-warp" ref="echartRef"></div>
                </div>
            </div>
            <div class="content-container" v-for="value in questionOptionList" :key="value">
                <span class="title">选择{{value}}项</span>
                <StudentInfoList :studentList="studentAnswerInfoListMap.get(value) || []"/>
            </div>
            <div class="content-container">
                <span class="title">未完成</span>
                <StudentInfoList :studentList="unAnswerStudentList"/>
            </div>
        </div>
        <div class="footer">
            <el-button type="primary" @click="close" >关闭</el-button>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject, onMounted, PropType, ref } from "vue";
import { Student } from "@/types/labelManage";
import { StudentAnswerInfo } from "./api";
import { PADModeQuestionType } from "./enum";
import * as echarts from "echarts";
import StudentInfoList from "./studentInfoList.vue";
export default defineComponent({
    components: {
        StudentInfoList
    },
    props: {
        time: {
            type: String
        },
        unAnswerStudentList: {
            type: Array as PropType<Student[]>,
            default: () => []
        },
        studentAnswerInfoList: {
            type: Array as PropType<StudentAnswerInfo[]>,
            default: () => []
        },
        questionType: {
            type: Number,
            default: -1
        },
        questionOption: {
            type: String,
            default: ""
        },
        studentList: {
            type: Array as PropType<Student[]>,
            default: () => []
        }
    },
    setup(props) {
        const echartRef = ref<HTMLDivElement>();
        const QuestionType = inject(
            "QuestionType",
            ref(PADModeQuestionType)
        );
        const questionOptionList = computed(() => props.questionOption.split(";"));
        const studentAnswerInfoListMap = computed(() => {
            const map = new Map<string, Student[]>();
            props.studentAnswerInfoList.forEach((item) => {
                const questionDetailList = item.QuestionDetail.split(";").filter(value => value);
                questionDetailList.forEach(value => {
                    const student = props.studentList.find(({ StudentID }) => StudentID === item.StudentId);
                    if (map.has(value)) {
                        const mapData = map.get(value);
                        mapData!.push(student!);
                    } else {
                        map.set(value, [student!]);
                    }
                });
            });
            return map;
        });
        const close = () => {
            window.electron.destroyWindow();
        };

        const customColorMethod = (percentage: number) => {
            if (percentage < 50) {
                return "#FF6B6B";
            }
            return "#56CE71";
        };

        const initEchart = () => {
            const myChart = echarts.init(echartRef.value!);
            const xAxisData = [...questionOptionList.value, "未完成"];
            const seriesData = xAxisData.map((option) => {
                if (option === "未完成") {
                    return props.unAnswerStudentList.length;
                }
                return studentAnswerInfoListMap.value.get(option)?.length || 0;
            });
            const option: echarts.EChartsOption = {
                xAxis: {
                    type: "category",
                    axisLabel: {
                        color: "#5F626F",
                        fontSize: 16
                    },
                    data: xAxisData
                },
                tooltip: {
                    trigger: "axis"
                },
                yAxis: {
                    type: "value",
                    axisLabel: {
                        color: "#5F626F",
                        fontSize: 16
                    },
                    minInterval: 1
                },
                series: [
                    {
                        data: seriesData,
                        itemStyle: {
                            color: "#6686EE"
                        },
                        label: {
                            formatter: "{c}",
                            show: true,
                            fontSize: 16,
                            position: "top",
                            color: "#5F626F"
                        },
                        barWidth: 80,
                        type: "bar"
                    }
                ]
            };
            myChart.setOption(option);
        };

        onMounted(() => {
            initEchart();
        });

        window.electron.setContentSize(1240, 929);
        window.electron.setCenter();
        return	{
            close,
            QuestionType,
            percentage: computed(() => Math.round((props.studentAnswerInfoList.length / props.studentList.length) * 100)),
            echartRef,
            studentAnswerInfoListMap,
            questionOptionList,
            customColorMethod
        };
    }
});
</script>

<style lang="scss" scoped>
.answer-result-warp {
    width: 1240px;
    height: 929px;
    border-radius: 8px;
    background: #F5F6FA;
    box-shadow: 0px 6px 16px -8px rgba(0, 0, 0, 0.12), 0px 9px 28px 0px rgba(0, 0, 0, 0.08), 0px 12px 48px 16px rgba(0, 0, 0, 0.05);
    border: 1px solid #ccc;
    display: flex;
    flex-direction: column;
    .title {
            color: #19203D;
            font-weight: 600;
            font-size: 20px;
            margin-left: 8px;
        }
    .title-warp {
        position: relative;
        background: #fff;
        height: 60px;
        display: flex;
        align-items: center;
        padding-left: 24px;
        border-radius: 8px 8px 0px 0px;

        .progress-warp {
            display: flex;
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            align-items: center;
            .progress-text {
                color: #19203D;
                font-size: 16px;
                font-weight: 400;
                margin-right: 16px;
            }
        }
        .close-btn {
            cursor: pointer;
            -webkit-app-region: no-drag;
            position: absolute;
            width: 30px;
            height: 30px;
            background: #F6F6FA;
            border-radius: 50%;
            top: 50%;
            transform: translateY(-50%);
            right: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
    .content-warp {
        padding: 24px;
        overflow: overlay;
        flex: 1;
        .content-container {
            display: flex;
            flex-direction: column;
            margin-bottom: 24px;
            .title {
                margin-bottom: 16px;
            }
            .statistics {
                display: flex;
                flex-direction: column;
                height: 377px;
                padding: 24px 20px;
                background: #fff;
                .type {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 0 16px;
                    height: 38px;
                    font-size: 16px;
                    color: #4B71EE;
                    background: rgba(75, 113, 238, 0.1);
                    width: fit-content;
                    border-radius: 2px;
                    margin-bottom: 16px;
                }
                .echart-warp {
                    flex: 1;
                }
            }
        }
    }
    .footer {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 72px;
        border-radius: 0px 0px 8px 8px;
        background: #fff;
    }
}
</style>
