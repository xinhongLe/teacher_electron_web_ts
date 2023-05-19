<template>
    <div :class="['answer-result-warp', lessonId ? '' : 'answer-result-warp_bg']"
         :style="{width: width > 1240 ? '1240px' : (width - 100) + 'px',
          height: height > 929 ? '929px' : (height - 100) + 'px',
          flex: lessonId ? 1 : 'none'
    }">
        <div class="title-warp">
            <div class="progress-warp">
                <el-icon :size="22" color="#8B8B8F">
                    <clock/>
                </el-icon>
                <span class="text">答题计时：{{ time }}</span>
            </div>
            <div class="title-center ">答题统计</div>
            <div class="progress-warp">
                <span class="text">提交 {{ answerDetail.CommitUserCount }}/{{ answerDetail.AllUserCount }}</span>
                <div :style="{width: '214px'}">
                    <el-progress :percentage="percentage" :color="customColorMethod"></el-progress>
                </div>
            </div>
            <!--            <div class="close-btn" @click="close">-->
            <!--                <el-icon :size="14" color="#9C9FAA"><close /></el-icon>-->
            <!--            </div>-->
        </div>
        <div class="content-box">
            <div class="content-warp" v-for="(item,index) in answerDetail.StudentQuestionResults" :key="item">
                <div class="content-container">
                    <!--                <span class="title">答题统计</span>-->
                    <div class="statistics">
                        <!--                       <div class="type">{{QuestionType[questionType]}}</div>-->
                        <div class="type">{{ index + 1 }}、{{ QuestionType[item.Type] }}</div>
                        <div class="echart-warp" ref="echartRef"></div>
                    </div>
                </div>
                <div class="content-container" v-for="value in item.StudentQuestionOptionsResult" :key="value">
                    <div class="option">
                        <span class="title">{{ value.OptionName === "未选择" ? '未选择' : `选择${value.OptionName}项` }}</span>
                        <div class="zan">
                            <img @click="handlePraiseStudent(value)" v-if="!value.status"
                                 src="@/assets/images/suspension/icon_zan_default.png" alt="">
                            <img v-else src="@/assets/images/suspension/icon_zan.png" alt="">
                        </div>
                    </div>
                    <StudentInfoList :studentList="value.SelectStudent || []"/>
                </div>
                <!--               <div class="content-container">-->
                <!--                   <span class="title">未完成</span>-->
                <!--                   <StudentInfoList :studentList="unAnswerStudentList"/>-->
                <!--               </div>-->
            </div>
        </div>
        <div class="footer" v-if="!lessonId">
            <!--            <el-button @click="packUp">最小化</el-button>-->

            <!--            <el-button type="primary" @click="close">关闭</el-button>-->

            <el-button
                type="default"
                round
                plain
                class="min-btn"
                @click="packUp"
            >
                最小化
            </el-button>
            <el-button
                type="danger"
                round
                plain
                class="close-btn"
                @click="close"
            >
                关闭
            </el-button>
        </div>
    </div>
</template>

<script lang="ts">
import {computed, defineComponent, inject, nextTick, onMounted, onUnmounted, PropType, ref} from "vue";
import {StudentAnswerInfo, StudentAnswerInfoList} from "./api";
import {PADModeQuestionType} from "./enum";
import * as echarts from "echarts";
import StudentInfoList from "./studentInfoList.vue";
import {screen} from "@electron/remote";
import {praiseStudent, addRewardrecode} from "@/childWindow/quickAnswer/api";
import {UserInfoState} from "@/types/store";

export default defineComponent({
    components: {
        StudentInfoList
    },
    props: {
        time: {
            type: String
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
        answerDetail: {
            type: Object as PropType<StudentAnswerInfoList>
        },
        lessonId: {
            type: String,
            default: () => ""
        },
        currentUserInfo: {
            type: Object as PropType<UserInfoState>
        },
        AnswerMachineID: {
            type: String,
            default: ""
        }
    },
    setup(props) {
        const echartRef = ref<HTMLDivElement>();
        const QuestionType = inject("QuestionType", ref(PADModeQuestionType));
        const close = () => {
            window.electron.destroyWindow();
        };
        const packUp = () => {
            window.electron.minimizeWindow();
        }

        const handlePraiseStudent = async (value: any) => {
            const data = {
                Type: 1,
                SchoolID: props.currentUserInfo!.schoolId,
                TeacherID: props.currentUserInfo!.userCenterUserID,
                TeacherName: props.currentUserInfo!.name || "",
                StudentList: value.SelectStudent,
                LabelList: [{
                    LabelID: "ab299e61-bbbd-11ec-8bcf-00163e167f3f",
                    LabelName: "上课表现积极",
                    Score: 1,
                    ScoreType: 1
                }]
            };

            const praiseData = {
                StudentIdList: value.SelectStudent.map((item: any) => item.StudentID),
                AnswerMachineID: props.AnswerMachineID,
                TeacherID: props.currentUserInfo!.userCenterUserID
            };

            const res = await praiseStudent(praiseData);
            const res1 = await addRewardrecode(data);
            if (res.resultCode === 200 && res1.resultCode === 200) {
                value.status = true;
            }
        };

        const customColorMethod = (percentage: number) => {
            if (percentage < 50) {
                return "#FF6B6B";
            }
            return "#56CE71";
        };

        const initEchart = () => {
            const chartsDom = document.getElementsByClassName("echart-warp");
            for (let i = 0; i < props.answerDetail!.StudentQuestionResults.length; i++) {
                const myChart = echarts.init(chartsDom[i] as HTMLElement);
                const xAxisData = props.answerDetail!.StudentQuestionResults[i]?.StudentQuestionOptionsResult.map(item => item.OptionName);
                const seriesData = props.answerDetail!.StudentQuestionResults[i]?.StudentQuestionOptionsResult.map(item => {
                    if (item.OptionName === "未选择") {
                        return {
                            value: item.SelectUserCount,
                            itemStyle: {color: "#D3D8E1"}
                        };
                    } else {
                        return item.SelectUserCount;
                    }
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
                        trigger: "axis",
                        axisPointer: {
                            type: "shadow"
                        }
                        // formatter: (params:any) => {
                        //     console.log(params, "params");
                        //     return params[0].name + "<br/>" + params[0].data.studentList;
                        // },
                        // extraCssText: "max-width:200px;white-space:pre-wrap"
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
                            // emphasis: {
                            //     itemStyle: {
                            //         color: "#3EDD97" // 选中柱颜色
                            //     }
                            // },
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
            }
        };

        let timer: any;
        onMounted(() => {
            timer = setTimeout(() => {
                console.log(props.answerDetail!.StudentQuestionResults, "props.answerDetail!.StudentQuestionResults");
                initEchart();
            }, 1000);
        });

        onUnmounted(() => {
            timer && clearTimeout(timer);
        });

        const {width, height} = screen.getPrimaryDisplay().workAreaSize;
        // window.electron.setContentSize(size.width > 1240 ? 1240 : (size.width - 100), size.height > 929 ? 929 : (size.height - 100));
        window.electron.setContentSize(width, height);
        window.electron.setCenter();
        return {
            close,
            QuestionType,
            percentage: computed(() => props.answerDetail!.AllUserCount ? Math.round((props.answerDetail!.CommitUserCount / props.answerDetail!.AllUserCount) * 100) : 0),
            echartRef,
            customColorMethod,
            handlePraiseStudent,
            width,
            height,
            packUp
        };
    }
});
</script>

<style lang="scss" scoped>
.answer-result-warp_bg {
    //height: 929px;
    border-radius: 8px;
    background: #F5F6FA;
    box-shadow: 0px 6px 16px -8px rgba(0, 0, 0, 0.12), 0px 9px 28px 0px rgba(0, 0, 0, 0.08), 0px 12px 48px 16px rgba(0, 0, 0, 0.05);
    border: 1px solid #ccc;
}

.answer-result-warp {
    //width: 1240px;
    //height: 100%;
    display: flex;
    flex-direction: column;

    .title {
        color: #19203D;
        font-weight: 600;
        font-size: 20px;
        margin-left: 8px;
    }

    .title-warp {
        //position: relative;
        background: #fff;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-left: 24px;
        border-radius: 8px 8px 0px 0px;

        .title-center {
            font-size: 16px;
            color: #19203D;
            font-weight: 600;
        }

        .progress-warp {
            display: flex;
            align-items: center;

            .text {
                color: #19203D;
                font-size: 14px;
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

    .content-box {
        flex: 1;
        overflow-y: auto;
    }

    .content-warp {
        margin: 20px;
        padding: 10px;
        background: #fff;

        .content-container {
            display: flex;
            flex-direction: column;
            margin-bottom: 20px;

            .option {
                display: flex;
                align-items: center;
                justify-content: space-between;

                .zan {
                    cursor: pointer;
                }
            }

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
                    width: 100%;
                    height: 100%;
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

    }
}
</style>
