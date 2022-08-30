<template>
    <div class="wrongbook-wrapper" v-if="!state.isShowDetails">
        <header class="wrongbook-header">
            <div class="header-left">
                <div
                    @click="switchClass(item.id)"
                    class="class-item"
                    :class="item.id == state.currentClassId ? 'isActive' : ''"
                    v-for="item in state.classList"
                >
                    <span>{{ item.name }}</span>
                </div>
            </div>
            <div class="header-right">
                <el-select
                    size="small"
                    style="width: 140px; margin-right: 16px"
                    v-model="searchForm.questionType"
                >
                    <el-option
                        v-for="item in state.questionTypeList"
                        :label="item.Name"
                        :value="item.ID"
                        :key="item.ID"
                    >
                    </el-option>
                </el-select>
                <!-- <el-radio-group
                    style="margin-right: 16px"
                    v-model="searchForm.dateType"
                    label="size control"
                >
                    <el-radio-button label="large">昨日</el-radio-button>
                    <el-radio-button label="default">今日</el-radio-button>
                    <el-radio-button label="small">本周</el-radio-button>
                </el-radio-group> -->
                <el-button-group style="margin-right: 16px">
                    <el-button size="small">昨日</el-button>
                    <el-button size="small">今日</el-button>
                    <el-button size="small">本周</el-button>
                </el-button-group>
                <el-date-picker
                    size="small"
                    style="width: 225px"
                    v-model="searchForm.date"
                    type="daterange"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                />
            </div>
        </header>
        <main class="wrongbook-main">
            <header class="top-search">
                <div class="left-btn">
                    <el-button size="small">按作业</el-button>
                    <el-button size="small">按试卷</el-button>
                    <el-button size="small">按章节</el-button>
                    <el-button size="small">按知识点</el-button>
                </div>
                <div class="right-sel">
                    <el-dropdown trigger="click">
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
                    </el-dropdown>
                </div>
            </header>
            <div class="top-line"></div>
            <div class="content">
                <div class="con-left">
                    <LeftOne></LeftOne>
                </div>
                <div class="con-right">
                    <LessonList
                        @openWrongDetails="openWrongDetails"
                    ></LessonList>
                </div>
            </div>
        </main>
    </div>
    <WrongDetails
        v-if="state.isShowDetails"
        v-model:isShowDetails="state.isShowDetails"
    ></WrongDetails>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, defineExpose } from "vue";
import { ArrowDown, Search } from "@element-plus/icons-vue";
import LeftOne from "./components/LeftOne.vue";
import LessonList from "./components/LessonList.vue";
import WrongDetails from "./components/WrongDetails.vue";
const state = reactive({
    //顶部年级列表
    classList: [
        {
            name: "一年级1班",
            id: 1,
        },
        {
            name: "一年级2班",
            id: 2,
        },
        {
            name: "一年级3班",
            id: 3,
        },
    ],
    //当前选中的班级
    currentClassId: 1,
    //题型数据源
    questionTypeList: [
        {
            ID: 1,
            Name: "全部题型",
        },
    ],
    //是否显示详情页面
    isShowDetails: false,
});
//顶部表单搜索项
const searchForm = ref({
    questionType: "", //题型
    date: "", //日期范围
    dateType: "", //日期类型
});
//左侧搜索表单
const leftSearch = ref({
    questionType: "",
    keyword: "",
});
//切换顶部选中的班级
const switchClass = (value: number) => {
    state.currentClassId = value;
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
        height: 56px;
        background: #ffffff;
        padding: 0 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .header-left {
            height: 100%;
            display: flex;
            align-items: center;
            width: 40%;
            font-size: 14px;
            color: #a7aab4;
            font-family: HarmonyOS_Sans_SC;
            .class-item {
                margin-right: 32px;
                cursor: pointer;
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
                width: 74px;
                height: 3px;
                background: #4b71ee;
                bottom: -19px;
                /* left: -74px; */
                right: 0;
                transition: 0.2s;
            }
        }
        .header-right {
            width: 50%;
            display: flex;
            justify-content: flex-end;
        }
    }
    .wrongbook-main {
        margin-top: 8px;
        background-color: #ffffff;
        height: calc(100% - 64px);
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
                :deep(.el-button:focus, .el-button:hover) {
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
            }
        }
    }
}
</style>
