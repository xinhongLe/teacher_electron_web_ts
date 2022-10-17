<template>
    <div>
        <div class="chart-once" :class="activeIndex == index ? 'active' : ''">
            <div class="chart-row" v-if="item.TotalRight === 0 && item.TotalWrong === 0 && item.TotalNoSure === 0" >
                <div>
                    <p>第{{ index + 1 }}题</p>
                    <P>无人作答</P>
                </div>
                <div class="no-chart" >
                    <img src="" alt="" />
                </div>
            </div>
           <div  class="chart-row"  v-else>
               <div>
                   <p>第{{ index + 1 }}题</p>
                   <p> 正确率 <span>{{ probability }}%</span></p>
               </div>
               <div class="chart">
                   <div :id="'main' + index" style="width: 50px; height: 50px" ref="chartRef"></div>
               </div>
           </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, watch, ref, nextTick } from "vue";
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
            if (props.item.TotalRight === 0 && props.item.TotalWrong === 0 && props.item.TotalNoSure === 0) {
                return;
            }

            probability.value = props.item.TotalRight === 0 ? 0 : Number(
                ((props.item.TotalRight / (props.item.TotalWrong + props.item.TotalRight)) * 100).toFixed(2)
            );
            var myChart = echarts.init(chartRef.value!);

            const option = {
                series: [
                    {
                        name: "",
                        type: "pie",
                        radius: ["40%", "70%"],
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

        watch(() => props.item, () => {
            nextTick(() => {
                initChart();
            });
        }, { immediate: true });

        return {
            probability,
            chartRef
        };
    }
});
</script>

<style lang="scss" scoped>
.chart-once {
  display: flex;
  justify-content:space-between;
  align-items: center;
  width: 100%;
  height: 62px;
  padding: 0px 20px;
  cursor: pointer;
  box-sizing: border-box;
  border: 1px solid #fff;
  border-radius: 4px;
  margin-bottom:20px;
  text-align: center;
  background: #fff;
    .chart-row{
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
    }
  .chart {
    width: 42px;
    height: 42px;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
  .no-chart {
      width: 32px;
      height: 32px;
      border: 6px solid #A9ACB3;
      border-radius: 50%;
  }
  p:nth-of-type(1) {
    font-size: 14px;
    font-weight: 600;
    color: #19203D;
    margin-bottom: 6px;
  }
  p:nth-of-type(2) {
    font-size: 12px;
      color: #5F626F;
  }
}
.active {
  border: 1px solid #98aef6;
  background: #E6ECFF;
}
</style>
