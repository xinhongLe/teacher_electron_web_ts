<template>
    <div class="wrongbook-wrapper" v-if="!state.isShowDetails">
        <header class="wrongbook-header">
            <div class="header-left">
                <div
                    @click="switchClass(item)"
                    class="class-item"
                    :class="item.ID == state.currentClassId ? 'isActive' : ''"
                    v-for="item in classList"
                >
                    <span>{{ item.Name }}</span>
                </div>
            </div>
            <div class="header-right">
                <el-select
                    size="small"
                    style="width: 140px; margin-right: 16px"
                    v-model="state.QuestionType"
                >
                    <el-option
                        v-for="item in questionTypeList"
                        :label="item.Name"
                        :value="item.ID"
                        :key="item.ID"
                    >
                    </el-option>
                </el-select>
                <el-button-group style="margin-right: 16px">
                    <el-button
                        size="small"
                        @click="
                            toFormatDate(item.id);
                            state.currentDateIndex = item.id;
                        "
                        v-for="item in state.dateButtonList"
                        :key="item.id"
                        :class="{
                            dateActive: item.id == state.currentDateIndex,
                        }"
                        >{{ item.name }}</el-button
                    >
                    <!-- <el-button size="small" @click="toFormatDate(1)"
                        >今日</el-button
                    >
                    <el-button size="small" @click="toFormatDate(3)"
                        >本周</el-button
                    > -->
                </el-button-group>
                <el-date-picker
                    size="small"
                    style="width: 225px"
                    v-model="state.dateRange"
                    type="daterange"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                    value-format="YYYY-MM-DD HH:mm:ss"
                    format="YYYY-MM-DD HH:mm:ss"
                />
            </div>
        </header>
        <main class="wrongbook-main">
            <header class="top-search">
                <div class="left-btn">
                    <el-button
                        size="small"
                        v-for="item in state.wrongTypeButtonList"
                        :key="item.id"
                        @click="
                            state.currentWrongType = item.id;
                            state.currentWrongTypeIndex = item.id;
                        "
                        :class="{
                            isActive: item.id == state.currentWrongTypeIndex,
                        }"
                        >{{ item.name }}</el-button
                    >
                </div>
                <div class="right-sel">
                    <!-- <el-dropdown trigger="click">
                        <span style="color: #19203d">
                            平均错误率由高到低<el-icon class="el-icon--right"
                                ><arrow-down
                            /></el-icon>
                        </span>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item>Action 1</el-dropdown-item>
                                <el-dropdown-item> Action 2 </el-dropdown-item>
                                <el-dropdown-item>Action 3</el-dropdown-item>
                                <el-dropdown-item>Action 4</el-dropdown-item>
                                <el-dropdown-item>Action 5</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown> -->
                    <el-popover
                        trigger="hover"
                        v-model:visible="state.visible"
                        placement="bottom-start"
                        :width="250"
                    >
                        <div class="sortcontent">
                            <div class="sortcontent-list">
                                <p
                                    @click="state.currentSortCon = item.value"
                                    v-for="item in state.SortContentList"
                                    :key="item.value"
                                    :class="{
                                        isActive:
                                            item.value == state.currentSortCon,
                                    }"
                                >
                                    {{ item.name }}
                                </p>
                            </div>
                            <div class="sortcontent-list">
                                <p
                                    @click="state.currentLevel = item.value"
                                    v-for="item in (state.SortTagLevelList as any)"
                                    :key="item.value"
                                    :class="{
                                        isActive:
                                            item.value == state.currentLevel,
                                    }"
                                >
                                    <span>
                                        {{ item.name }}
                                    </span>
                                    <el-icon
                                        @click.stop="state.currentLevel = 0"
                                        v-if="item.value == state.currentLevel"
                                        ><CircleClose
                                    /></el-icon>
                                </p>
                            </div>
                            <div class="sortcontent-list">
                                <p
                                    @click="state.currentSortType = item.value"
                                    v-for="item in (state.SortTypeList as any)"
                                    :key="item.value"
                                    :class="{
                                        isActive:
                                            item.value == state.currentSortType,
                                    }"
                                >
                                    <span>
                                        {{ item.name }}
                                    </span>
                                    <!-- <el-icon
                                        @click.stop="state.currentSortType = 0"
                                        v-if="
                                            item.value == state.currentSortType
                                        "
                                        ><CircleClose
                                    /></el-icon> -->
                                </p>
                            </div>
                        </div>

                        <template #reference>
                            <div
                                style="
                                    display: flex;
                                    align-items: center;
                                    cursor: pointer;
                                "
                            >
                                <span style="color: #19203d; padding-right: 5px"
                                    >平均错误率由高到低</span
                                >
                                <img
                                    src="~@/assets/images/wrongbook/arrow_next.png"
                                    alt=""
                                />
                            </div>
                        </template>
                    </el-popover>
                </div>
            </header>
            <div class="top-line"></div>
            <div class="content">
                <div class="con-left">
                    <LeftOne
                        v-if="state.currentWrongType == 1"
                        :parentSearch="searchForm"
                    ></LeftOne>
                    <LeftTwo
                        v-if="state.currentWrongType == 2"
                        :parentSearch="searchForm"
                    ></LeftTwo>
                    <LeftThree
                        v-if="
                            state.currentWrongType == 3 ||
                            state.currentWrongType == 4
                        "
                        :currentWrongType="state.currentWrongType"
                        :parentSearch="searchForm"
                        :gradeId="gradeId"
                    ></LeftThree>
                </div>
                <div class="con-right" v-if="!state.isShowDetails">
                    <LessonList
                        v-if="state.isEmpty"
                        @openWrongDetails="openWrongDetails"
                        :currentWrongType="state.currentWrongType"
                    ></LessonList>
                    <div v-else class="empty">
                        <div
                            v-if="state.currentWrongType == 4"
                            class="knowpoint"
                        >
                            <p class="count">
                                收录错题：<span style="color: #4b71ee">{{
                                    0
                                }}</span
                                >题
                            </p>
                            <p class="rate">
                                班级平均知识点掌握度：<span
                                    style="color: #4b71ee"
                                    >30%</span
                                >
                                <span style="color: #a7aab4"
                                    >（其中A层知识点掌握度<span
                                        style="color: #4b71ee"
                                        >90%</span
                                    >，B层知识点掌握度 70%，C层知识点掌握度
                                    10%）</span
                                >
                            </p>
                        </div>
                        <div class="emptyimg">
                            <div class="img-text">
                                <img
                                    src="~@/assets/images/wrongbook/pic_kongtai1.png"
                                    alt=""
                                />
                                <p>暂无收录错题</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
    <WrongDetails
        v-if="state.isShowDetails"
        v-model:isShowDetails="state.isShowDetails"
        :currentWrongType="state.currentWrongType"
    ></WrongDetails>
</template>

<script lang="ts" setup>
import {
    onMounted,
    reactive,
    ref,
    defineExpose,
    watch,
    onActivated,
    nextTick,
} from "vue";
import { ArrowDown, Search, CircleClose } from "@element-plus/icons-vue";
import LeftOne from "./components/LeftOne.vue";
import LeftTwo from "./components/LeftTwo.vue";
import LeftThree from "./components/LeftThree.vue";
import LessonList from "./components/LessonList.vue";
import WrongDetails from "./components/WrongDetails.vue";
import { get, STORAGE_TYPES } from "@/utils/storage";
import { getFormatDate } from "@/utils";
import useWrongBook from "./hooks/useWrongBook";
const { questionTypeList } = useWrongBook();
const classList = get(STORAGE_TYPES.USER_INFO).Classes;
const gradeId = ref(classList.length ? classList[0]?.GradeID : "");
const state = reactive({
    //顶部时间选择区间
    dateRange: [],
    //顶部年级列表
    classList: "",
    //当前选中的班级
    currentClassId: classList.length ? classList[0]?.ID : "",
    //题型数据源
    // questionTypeList: [
    //     {
    //         ID: [1, 2],
    //         Name: "选择题",
    //     },
    //     {
    //         ID: [3, 4],
    //         Name: "判断题",
    //     },
    //     {
    //         ID: [5],
    //         Name: "填空题",
    //     },
    //     {
    //         ID: [6],
    //         Name: "应用题",
    //     },
    //     {
    //         ID: [7],
    //         Name: "语音题",
    //     },
    //     {
    //         ID: [8],
    //         Name: "解答题",
    //     },
    // ],
    //是否显示详情页面
    isShowDetails: false,
    //当前选择的那个类型展示错题本
    currentWrongType: 1,
    //是否是空态
    isEmpty: true,
    //问题类型
    QuestionType: "",
    currentWrongTypeIndex: 1, //当前选中的按钮类型index
    //错题类型按钮list
    wrongTypeButtonList: [
        {
            id: 1,
            name: "按作业",
        },
        {
            id: 2,
            name: "按试卷",
        },
        {
            id: 3,
            name: "按章节",
        },
        {
            id: 4,
            name: "按知识点",
        },
    ],
    //当前日期选中的类型
    currentDateIndex: 0,
    //时间类型按钮list
    dateButtonList: [
        {
            id: 1,
            name: "今日",
        },
        {
            id: 2,
            name: "昨日",
        },
        {
            id: 3,
            name: "本周日",
        },
    ],
    //弹出层
    visible: false,
    //排序字段 1 平均错误率 2分层错误率 3完成率
    SortContentList: [
        {
            name: "平均错误率",
            value: 1,
        },
        {
            name: "分层错误率",
            value: 2,
        },
        {
            name: "完成率",
            value: 3,
        },
    ],
    //当前选择的排序字段
    currentSortCon: 1,
    //排序分层等级 100 C层，200 B层，300 A层
    SortTagLevelList: [
        {
            name: "A层",
            value: 300,
        },
        {
            name: "B层",
            value: 200,
        },
        {
            name: "C层",
            value: 100,
        },
    ],
    //当前选择的分层登记
    currentLevel: 0,
    //排序类型 1 asc正序 2 desc倒叙
    SortTypeList: [
        {
            name: "正序",
            value: 1,
        },
        {
            name: "倒序",
            value: 2,
        },
    ],
    currentSortType: 1,
});

watch(
    () => state.dateRange,
    (value) => {
        if (value) {
            searchForm.value.StartTime = value[0];
            searchForm.value.EndTime = value[1];
        } else {
            searchForm.value.StartTime = "";
            searchForm.value.EndTime = "";
            state.currentDateIndex = 0;
        }
    }
);
watch(
    () => state.currentWrongType,
    (val) => {
        console.log(val);
    }
);
// onMounted(() => {
//     nextTick(() => {
//         state.currentClassId = classList.length ? classList[0]?.ID : "";
//         searchForm.value.ClassId = classList.length ? classList[0]?.ID : "";
//     });
// });
//顶部的昨日，今日，本周时间过滤
const toFormatDate = (type: number) => {
    const data: any = getFormatDate(type);
    console.log(data);
    if (data) {
        state.dateRange = data;
    }
};
//顶部表单搜索项
const searchForm = ref({
    ClassId: classList.length ? classList[0]?.ID : "", //班级Id
    EndTime: "",
    StartTime: "", //日期范围
});
//切换顶部选中的班级
const switchClass = (value: any) => {
    state.currentClassId = value.ID;
    searchForm.value.ClassId = value.ID;
    //传年级id
    gradeId.value = value.GradeID;
    console.log("gradeId.value", gradeId.value);
};
//打开错题本详情页面
const openWrongDetails = (data: any) => {
    state.isShowDetails = true;
    console.log(data);
};

defineExpose(openWrongDetails);
</script>

<style lang="scss" scoped>
.wrongbook-wrapper {
    width: 100%;
    height: 100%;
    min-width: 0;
    min-height: 0;
    background: #f5f6fa;
    .wrongbook-header {
        width: 100%;
        height: 58px;
        background: #ffffff;
        padding: 0 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .header-left {
            height: 100%;
            display: flex;
            align-items: center;
            width: 60%;
            font-size: 14px;
            color: #a7aab4;
            font-family: HarmonyOS_Sans_SC;
            overflow: auto;
            padding: 5px 0;
            .class-item {
                margin-right: 32px;
                cursor: pointer;
                white-space: nowrap;
            }
            .isActive {
                font-size: 16px;
                color: #19203d;
                font-weight: bold;
                transition: 0.2s;
            }
            .isActive::after {
                content: "";
                display: block;
                position: relative;
                width: 100%;
                height: 3px;
                background: #4b71ee;
                bottom: -16px;
                /* left: -74px; */
                right: 0;
                transition: 0.2s;
            }
        }
        .header-right {
            width: 50%;
            display: flex;
            justify-content: flex-end;
            :deep(.el-button:focus, .el-button:hover),
            :deep(.el-button-group) {
                .el-button--small.dateActive {
                    background-color: #f3f7ff;
                    border: 1px solid rgba(75, 113, 238, 0.5);
                    color: #4b71ee;
                }
            }
        }
    }
    .wrongbook-main {
        margin-top: 8px;
        background-color: #ffffff;
        height: calc(100% - 66px);
        .top-search {
            height: 56px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 16px;

            .left-btn {
                :deep(.el-button--small) {
                    min-width: 88px;
                    background: #f3f7ff;
                    border-radius: 4px;
                    border: none;
                    // border: 1px solid rgba(75, 113, 238, 0.5);
                    color: #19203d;
                    font-size: 13px;
                }
                :deep(.el-button--small.isActive) {
                    color: #4b71ee;
                    border: 1px solid rgba(75, 113, 238, 0.5);
                }
                :deep(.el-button:focus, .el-button:hover, .isActive) {
                    color: #4b71ee;
                    border: 1px solid rgba(75, 113, 238, 0.5);
                }
            }
        }
        .top-line {
            width: 100%;
            height: 1px;
            background: #f3f4f4;
        }
        .content {
            background-color: #ffffff;
            display: flex;
            height: calc(100% - 57px);
            .con-left {
                width: 20%;
                background: #ffffff;
                border-right: 1px solid #f3f4f4;
            }
            .con-right {
                flex: 1;
                background: #ffffff;
                .empty {
                    padding: 16px;
                    height: 100%;
                    .knowpoint {
                        display: flex;
                        .count {
                            margin-right: 24px;
                            font-size: 12px;
                            font-family: HarmonyOS_Sans_SC;
                            color: #5f626f;
                        }
                        .rate {
                            font-size: 12px;
                            font-family: HarmonyOS_Sans_SC;
                            color: #5f626f;
                        }
                    }
                    .emptyimg {
                        height: calc(100% - 12px);
                        position: relative;
                        .img-text {
                            width: 230px;
                            height: 160px;
                            background-color: #fff;
                            position: absolute;
                            top: 0;
                            bottom: 10%;
                            left: 0;
                            right: 0;
                            margin: auto;
                            img {
                            }
                            p {
                                font-size: 14px;
                                font-family: HarmonyOS_Sans_SC;
                                color: #a7aab4;
                                margin-top: 15px;
                                text-align: center;
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>
<style lang="scss">
.el-popover {
    .sortcontent {
        display: flex;
        // width: 250px;
        justify-content: space-around;
        .sortcontent-list {
            width: 33%;
            // display: flex;
            font-size: 13px;
            p {
                cursor: pointer;
                background-color: #fff;
                padding: 2px;
                display: flex;
                align-items: center;
                justify-content: space-around;
            }
            .isActive {
                background-color: #4b71ee;
                color: #fff;
            }
        }
    }
}
</style>
