<template>
    <div>
        <div class="chart-once" :class="activeIndex == index ? 'active' : ''">
            <div class="chart">
                <div
                    :id="'main' + index"
                    style="width: 50px; height: 50px"
                    ref="chartRef"
                ></div>
            </div>
            <!-- <div class="no-chart">
                <img src="" alt="" />
            </div> -->
            <p>
                正确率 <span>{{ probability }}%</span>
            </p>
            <p>第{{ index + 1 }}题</p>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import * as echarts from "echarts";
export default defineComponent({
    props: {
        item: {
            type: Object,
            default: () => ({})
        },
        index: {
            type: Number,
            default: 0
        },
        activeIndex: {
            type: Number,
            default: 0
        }
    },
    setup(props) {
        const probability = ref(0);
        const chartRef = ref<HTMLDivElement>();

        const initChart = () => {
            probability.value =
                props.item.TotalRight === 0
                    ? 0
                    : Number(
                        (
                            (props.item.TotalRight /
                                  (props.item.TotalWrong +
                                      props.item.TotalRight)) *
                              100
                        ).toFixed(2)
                    );
            var myChart = echarts.init(chartRef.value!);
            const option = {
                series: [
                    {
                        name: "",
                        type: "pie",
                        radius: "100%",
                        data: [
                            {
                                value: props.item.TotalWrong,
                                itemStyle: {
                                    normal: { color: "#FF6B6B" },
                                    emphasis: { color: "#FF6B6B" }
                                }
                            },
                            {
                                value: props.item.TotalNoSure,
                                itemStyle: {
                                    normal: { color: "#4B71EE" },
                                    emphasis: { color: "#4B71EE" }
                                }
                            },
                            {
                                value: props.item.TotalRight,
                                itemStyle: {
                                    normal: { color: "#34E1B6" },
                                    emphasis: { color: "#34E1B6" }
                                }
                            }
                        ],
                        grid: {
                            top: "50px",
                            left: "50px",
                            right: "15px",
                            bottom: "50px"
                        },
                        label: { show: false }, // 不展示横线
                        animation: false, // 经常动画
                        hoverAnimation: false, // 鼠标移入不放大
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 1,
                                shadowOffsetX: 0,
                                shadowColor: "rgba(0, 0, 0,1)"
                            }
                        }
                    }
                ]
            };
            myChart.setOption(option);
        };

        onMounted(() => {
            initChart();
        });
        return {
            probability,
            chartRef
        };
    }
});
</script>

<style lang="scss" scoped>
.chart-once {
  width: 132px;
  cursor: pointer;
  height: 140px;
  box-sizing: border-box;
  border: 1px solid #fff;
  border-radius: 4px;
  margin: 0 0 22px 0;
  text-align: center;
  background: #fff;
  .chart {
    width: 100%;
    height: 80px;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
  .no-chart {
    width: 100%;
    height: 80px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    img {
      width: 50px;
      height: 50px;
      border-radius: 50px;
    }
  }
  p:nth-of-type(1) {
    font-size: 14px;
    font-weight: 500;
    color: #5f626f;
    margin-bottom: 6px;
    line-height: 20px;
  }
  p:nth-of-type(2) {
    font-size: 16px;
    font-weight: 500;
    color: #19203d;
    line-height: 22px;
  }
}
.active {
  border: 1px solid #98aef6;
  background: #e6ecff;
}
</style>
