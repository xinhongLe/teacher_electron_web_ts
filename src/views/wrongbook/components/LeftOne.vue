<template>
    <div class="leftone">
        <div>
            <el-select
                size="small"
                style="width: 100%; margin-right: 16px"
                v-model="form.questionType"
            >
                <el-option
                    v-for="item in state.list"
                    :label="item.Name"
                    :value="item.ID"
                    :key="item.ID"
                >
                </el-option>
            </el-select>
        </div>
        <div class="leftone-input">
            <el-input
                size="small"
                style="width: 100%"
                v-model="form.keyword"
                class="w-50 m-2"
                placeholder="请输入关键词"
            >
                <template #prefix>
                    <el-icon><search /></el-icon>
                </template>
            </el-input>
        </div>
        <div class="leftone-list">
            <div
                class="list-item"
                :class="item.id == state.currentLessonIndex ? 'isActive' : ''"
                v-for="item in state.lessonList"
                :key="item.id"
                @click="switchLessonCard(item)"
            >
                <div class="item-top">
                    <div style="display: flex; align-items: center">
                        <div class="top-icon">
                            <img
                                v-if="item.id == state.currentLessonIndex"
                                src="~@/assets/images/wrongbook/icon_timu_active.png"
                                alt=""
                            />
                            <img
                                v-else
                                src="~@/assets/images/wrongbook/icon_timu.png"
                                alt=""
                            />
                        </div>
                        <div class="top-title">{{ item.title }}</div>
                    </div>

                    <div class="top-count">{{ item.count }}题</div>
                </div>
                <div class="item-bto">
                    <span>{{ item.date }}</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { reactive, ref } from "vue";
import { Search } from "@element-plus/icons-vue";

//搜索区域表单
const form = ref({
    questionType: "",
    keyword: "",
});
//数据源
const state = reactive({
    currentLessonIndex: 1,
    list: [
        {
            Name: "数学 苏教版 一上",
            ID: 1,
        },
    ],
    lessonList: [
        {
            id: 1,
            title: "求倍数的实际应用",
            count: 3,
            date: "2022-08-16 周二",
        },
        {
            id: 2,
            title: "倍数的巩固训练",
            count: 2,
            date: "2022-08-16 周二",
        },
        {
            id: 3,
            title: "圆的体积公式求和",
            count: 3,
            date: "2022-08-16 周二",
        },
        {
            id: 4,
            title: "最小公约数",
            count: 3,
            date: "2022-08-16 周二",
        },
    ],
});

//下面是请求方法
//切换左侧课程卡片
const switchLessonCard = (item: any) => {
    console.log(item);
    state.currentLessonIndex = item.id;
};
</script>
<style lang="scss" scoped>
.leftone {
    background-color: #fff;
    padding: 12px 16px;
    width: 100%;
    .leftone-input,
    .leftone-list {
        margin-top: 8px;
        .list-item {
            cursor: pointer;
            width: 100%;
            // height: 52px;
            background: #f9fafc;
            border-radius: 4px;
            margin-bottom: 8px;

            padding: 10px 14px;
            .item-top {
                display: flex;
                justify-content: space-between;
                align-items: center;
                .top-icon {
                    display: flex;
                    align-items: center;
                }
                .top-title {
                    margin-left: 8px;
                    font-size: 15px;
                    font-family: HarmonyOS_Sans_SC;
                    color: #19203d;
                }
                .top-count {
                    font-size: 13px;
                    font-family: HarmonyOS_Sans_SC;
                    color: #a7aab4;
                }
            }
            .item-bto {
                margin-top: 7px;
                font-size: 13px;
                font-family: HarmonyOS_Sans_SC;
                color: #a7aab4;
                padding-left: 25px;
            }
        }
        .isActive {
            transition: 0.3s;
            background-color: #4b71ee;
            .top-title,
            .item-bto,
            .top-count {
                color: #fff !important;
            }
        }
    }
}
</style>
