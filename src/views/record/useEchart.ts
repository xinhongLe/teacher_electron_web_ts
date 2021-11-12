import { ref, nextTick, watch } from "vue";
import { fetchStudyHistoryGroupBySubject, FetchStudyHistoryGroupBySubjectData, StudyHistory } from "./api";
import * as echarts from "echarts";
import router from "@/router";
import { get, STORAGE_TYPES } from "@/utils/storage";

export default () => {
    const activeIndex = ref(0);
    const list = ref<StudyHistory[]>([]);
    const echartRef = ref<HTMLDivElement>();

    const updateEchart = () => {
        const xData = list.value[activeIndex.value].Days.map(v => v.Day.substr(0, 10));
        const y1Data = list.value[activeIndex.value].Days.map(v => v.NoSure + v.Right + v.Wrong);
        const y2Data = list.value[activeIndex.value].Days.map(v => Number((v.Right / (v.NoSure + v.Right + v.Wrong)) * 100));
        nextTick(() => {
            if (xData.length === 0) return;
            const myChart = echarts.init(echartRef.value as HTMLDivElement);
            const options = {
                grid: {
                    left: "5%",
                    top: "10%",
                    bottom: "10%",
                    right: "5%"
                },
                xAxis: {
                    data: xData,
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        lineHeight: 30
                    },
                    axisLine: {
                        show: false
                    }
                },
                yAxis: [
                    {
                        name: "题量",
                        nameTextStyle: {
                            padding: [0, 60, 10, 0],
                            color: "#4B71EE"
                        },
                        axisLabel: {
                            align: "center",
                            margin: 30
                        }
                    },
                    {
                        name: "正确率",
                        nameTextStyle: {
                            padding: [0, 0, 10, 60],
                            color: "#34E1B6"
                        },
                        axisLabel: {
                            align: "center",
                            margin: 30,
                            formatter: (v: string) => {
                                return v + "%";
                            }
                        }
                    }
                ],
                series: [
                    {
                        name: "题量",
                        type: "bar",
                        data: y1Data,
                        yAxisIndex: 0,
                        tooltip: {
                            formatter:
                                " {a}<br />{b}<span style='margin-left: 15px'></span><span style='font-weight: 800'>{c}</span>"
                        },
                        itemStyle: {
                            color: "#4B71EE"
                        }
                    },
                    {
                        name: "正确率",
                        type: "line",
                        data: y2Data,
                        yAxisIndex: 1,
                        tooltip: {
                            formatter:
                                " {a}<br />{b}<span style='margin-left: 15px'></span><span style='font-weight: 800'>{c}%</span>"
                        },
                        itemStyle: {
                            color: "#34E1B6"
                        },
                        symbol: "circle",
                        symbolSize: 8
                    }
                ]
            };
            myChart.setOption(options);
        });
    };

    const data: FetchStudyHistoryGroupBySubjectData = {
        id: router.currentRoute.value.params.studentId as string,
        teacherId: get(STORAGE_TYPES.USER_INFO).ID
    };

    fetchStudyHistoryGroupBySubject(data).then(res => {
        if (res.resultCode === 200) {
            res.result.map((v) => {
                if (v.SubjectName === "全部") {
                    list.value.unshift(v);
                } else {
                    list.value.push(v);
                }
            });
            updateEchart();
        }
    });

    watch(activeIndex, updateEchart);

    return {
        list,
        echartRef,
        activeIndex
    };
};
