<template>
    <div class="wrongdetail-wrapper">
        <header class="wrongdetail-header">
            <div class="header-left">
                <img
                    src="~@/assets/images/wrongbook/icon_back.png"
                    alt=""
                    @click="backList"
                />
                <div class="title">一年级一班错题本</div>
                <div class="desc">求倍数的实际应用</div>
                <span>(发布于2022-08-06 周三)</span>
            </div>
            <div class="header-right">
                <el-select
                    size="small"
                    style="width: 140px; margin-right: 16px"
                    v-model="questionType"
                >
                    <el-option
                        v-for="item in state.questionTypeList"
                        :label="item.Name"
                        :value="item.ID"
                        :key="item.ID"
                    >
                    </el-option>
                </el-select>
            </div>
        </header>
        <main class="wrongdetail-main">
            <div class="main-left">
                <div class="search">
                    <el-select
                        size="small"
                        style="width: 100%"
                        v-model="questionType"
                    >
                        <el-option
                            v-for="item in state.questionTypeList"
                            :label="item.Name"
                            :value="item.ID"
                            :key="item.ID"
                        >
                        </el-option>
                    </el-select>
                </div>
                <div class="left-content">
                    <div
                        class="list-item"
                        v-for="item in state.wrongList"
                        :key="item.id"
                        :class="item.id == state.currentIndex ? 'isActive' : ''"
                        @click="switchWrongItem(item)"
                    >
                        <div class="title">
                            <div class="top">
                                <span>1</span>
                                <p>选择题</p>
                            </div>
                            <div class="bto">先数一数，再照样子涂一涂</div>
                            <div class="line"></div>
                        </div>
                        <div class="ratedata">
                            <el-progress
                                :show-text="false"
                                type="circle"
                                :percentage="25"
                                :width="30"
                            />
                            <div class="content">
                                <p class="rate-title">平均错误率</p>
                                <p class="rate">90%</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="main-right">
                <div class="quersion-con">
                    <div class="con-top">
                        <div class="left">
                            <p class="types">选择题</p>
                            <div class="desc">
                                <img
                                    src="~@/assets/images/wrongbook/icon_zhishidian.png"
                                    alt=""
                                />
                                <span>关联知识点：倍的认识</span>
                            </div>
                        </div>
                        <div class="right">
                            <el-button type="primary" plain size="small"
                                >讲解题目</el-button
                            >
                            <el-button type="primary" plain size="small"
                                >查看同类题</el-button
                            >
                        </div>
                    </div>
                    <div class="contents">
                        先数一数，再照样子涂一涂 xxxxxxxxxxxxxx
                    </div>
                    <div class="line"></div>
                </div>
                <div class="answer-details">
                    <div class="top-title">
                        <p class="title">学生答题详情</p>
                        <div class="text-line">
                            <p class="text">答错 <span>1</span></p>
                            <div class="line"></div>
                            <p class="text">未答 <span>12</span></p>
                            <div class="line"></div>
                            <p class="text">总答 <span>30</span></p>
                            <div class="line"></div>
                            <p class="text">完成率 <span> 60%</span></p>
                            <div class="line"></div>
                            <p class="text">平均错误率 <span>90%</span></p>
                        </div>
                    </div>
                    <div class="A-floor" v-for="item in state.detailList">
                        <div class="top-area">
                            <div class="left">
                                <p class="title">
                                    {{ item.name }}(<span>{{ item.count }}</span
                                    >)
                                </p>
                                <p class="desc">
                                    ( 答错<span> 0</span> / 未答<span> 0</span>
                                    / 总<span style="padding-right: 8px">
                                        10</span
                                    >
                                    完成率<span> 100%</span> / 错误率<span>
                                        0%</span
                                    >
                                    )
                                </p>
                            </div>
                            <div>
                                <img
                                    src="~@/assets/images/wrongbook/icon_xiala.png"
                                    alt=""
                                />
                            </div>
                        </div>
                        <div class="person-list">
                            <div class="list-item">
                                <div class="images">
                                    <img
                                        src="~@/assets/images/wrongbook/ps1.png"
                                        alt=""
                                    />
                                </div>
                                <div class="name-number">
                                    <p class="name">巢浩真</p>
                                    <p class="number">mg57086112</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive, defineEmits } from "vue";
const emit = defineEmits(["update:isShowDetails"]);
//题型
const questionType = ref("");
const state = reactive({
    questionTypeList: [
        {
            ID: 1,
            Name: "全部题型",
        },
    ],
    //左边错题的列表
    wrongList: [
        {
            id: 1,
            title: "选择题",
            desc: "先数一数，再照样子涂一涂。",
            percentage: 32,
            rate: "32%",
        },
        {
            id: 2,
            title: "选择题",
            desc: "先数一数，再照样子涂一涂。",
            percentage: 32,
            rate: "32%",
        },
        {
            id: 3,
            title: "选择题",
            desc: "先数一数，再照样子涂一涂。",
            percentage: 32,
            rate: "32%",
        },
        {
            id: 4,
            title: "选择题",
            desc: "先数一数，再照样子涂一涂。",
            percentage: 32,
            rate: "32%",
        },
        {
            id: 4,
            title: "选择题",
            desc: "先数一数，再照样子涂一涂。",
            percentage: 32,
            rate: "32%",
        },
        {
            id: 4,
            title: "选择题",
            desc: "先数一数，再照样子涂一涂。",
            percentage: 32,
            rate: "32%",
        },
        {
            id: 4,
            title: "选择题",
            desc: "先数一数，再照样子涂一涂。",
            percentage: 32,
            rate: "32%",
        },
        {
            id: 4,
            title: "选择题",
            desc: "先数一数，再照样子涂一涂。",
            percentage: 32,
            rate: "32%",
        },
        {
            id: 4,
            title: "选择题",
            desc: "先数一数，再照样子涂一涂。",
            percentage: 32,
            rate: "32%",
        },
        {
            id: 4,
            title: "选择题",
            desc: "先数一数，再照样子涂一涂。",
            percentage: 32,
            rate: "32%",
        },
    ],
    //当前选中的错题项
    currentIndex: 1,
    //答题详情list
    detailList: [
        {
            id: 1,
            name: "A层",
            count: 0,
        },
        {
            id: 2,
            name: "B层",
            count: 9,
            list: [],
        },
        {
            id: 3,
            name: "C层",
            count: 11,
        },
        {
            id: 4,
            name: "未标记",
            count: 0,
        },
    ],
});
//切换左侧错题项
const switchWrongItem = (item: any) => {
    state.currentIndex = item.id;
};
//返回列表页
const backList = () => {
    emit("update:isShowDetails", false);
};
</script>
<style lang="scss" scoped>
.wrongdetail-wrapper {
    width: 100%;
    height: 100%;
    min-width: 0;
    min-height: 0;
    background: #f5f6fa;
    .wrongdetail-header {
        width: 100%;
        height: 56px;
        background: #ffffff;
        padding: 0 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .header-left {
            display: flex;
            align-items: center;
            img {
                cursor: pointer;
            }
            .title {
                margin-left: 20px;
                font-size: 18px;
                font-family: HarmonyOS_Sans_SC_Bold;
                color: #19203d;
                font-weight: bold;
            }
            .desc {
                margin-left: 57px;
                font-size: 15px;
                font-family: HarmonyOS_Sans_SC_Medium;
                color: #19203d;
            }
            span {
                padding-left: 8px;
                font-size: 13px;
                font-family: HarmonyOS_Sans_SC;
                color: #5f626f;
            }
        }
    }
    .wrongdetail-main {
        margin-top: 10px;
        display: flex;
        height: calc(100% - 66px);
        .main-left {
            width: 20%;
            .search {
                margin-bottom: 10px;
                padding: 0 1.6rem;
            }
            .left-content {
                height: calc(100% - 42px);
                overflow: auto;
                padding: 0 1.6rem;

                .list-item {
                    width: 100%;
                    background-color: #ffffff;
                    margin-bottom: 10px;
                    border-radius: 6px;
                    cursor: pointer;
                    .title {
                        padding: 14px 0 0 14px;
                        .top {
                            display: flex;
                            align-items: center;
                            margin-bottom: 10px;
                            font-size: 14px;
                            font-family: HarmonyOS_Sans_SC_Medium;
                            color: #19203d;
                            span {
                                padding-right: 3px;
                            }
                        }
                        .bto {
                            font-size: 12px;
                            font-family: HarmonyOS_Sans_SC;
                            color: #5f626f;
                            margin-bottom: 10px;
                        }
                        .line {
                            width: 100%;
                            height: 1px;
                            background: #f3f4f4;
                            // opacity: 0.11;
                        }
                    }
                    .ratedata {
                        padding: 10px 12px;
                        display: flex;
                        align-items: center;
                        .content {
                            margin-left: 12px;
                            font-size: 12px;
                            display: flex;
                            align-items: center;
                            .rate-title {
                                font-family: HarmonyOS_Sans_SC;
                                color: #5f626f;
                            }
                            .rate {
                                color: #fbc54c;
                                padding-left: 3px;
                            }
                        }
                    }
                }
                .isActive {
                    transition: 0.3s;
                    background-color: #4b71ee !important;
                    .title {
                        .top,
                        .bto {
                            color: #ffffff !important;
                        }
                        .line {
                            background: #ffffff !important;
                            opacity: 0.21;
                        }
                    }
                    .ratedata {
                        .rate-title {
                            color: #a7aab4 !important;
                        }
                        .rate {
                            color: #ffffff !important;
                        }
                    }
                }
            }
        }
        .main-right {
            flex: 1;
            height: calc(100% - 66px);
            overflow: auto;
            padding: 16px;
            background-color: #ffffff;
            .quersion-con {
                .con-top {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    .left {
                        display: flex;
                        align-items: flex-end;
                        .types {
                            font-size: 16px;
                            font-family: HarmonyOS_Sans_SC_Bold;
                            color: #19203d;
                            font-weight: bold;
                        }
                        .desc {
                            display: flex;
                            align-items: center;
                            margin-left: 12px;
                            font-size: 13px;
                            font-family: HarmonyOS_Sans_SC;
                            color: #5f626f;
                        }
                    }
                    .right {
                        :deep(.el-button.el-button--primary) {
                            background-color: #ffffff;
                            border: 1px solid #98aef6;
                            font-size: 12px;
                            font-family: PingFangSC-Regular, PingFang SC;
                            font-weight: 400;
                            color: #4b71ee;
                        }
                        :deep(.el-button--primary:focus, .el-button--primary:hover) {
                            background-color: #4b71ee;
                            border: none;
                            color: #ffffff;
                        }
                    }
                }
                .contents {
                    margin: 14px 0;
                }
                .line {
                    width: 100%;
                    height: 1px;
                    background: #f3f4f4;
                }
            }
            .answer-details {
                .top-title {
                    padding: 16px 0;
                    display: flex;
                    align-items: center;

                    .title {
                        font-size: 16px;
                        font-family: HarmonyOS_Sans_SC_Bold;
                        color: #19203d;
                        font-weight: bold;
                        margin-right: 12px;
                    }
                    .text-line {
                        display: flex;
                        align-items: center;
                        padding-top: 2px;
                        .text {
                            font-size: 12px;
                            color: #5f626f;
                            span {
                                padding-left: 3px;
                            }
                        }
                        .line {
                            width: 1px;
                            height: 12px;
                            background: #a7aab4;
                            opacity: 0.3;
                            margin: 0 12px;
                        }
                    }
                }
                .A-floor {
                    cursor: pointer;
                    width: 100%;
                    background: #f9fafc;
                    border-radius: 4px;
                    padding: 14px 16px;
                    margin-bottom: 12px;
                    box-sizing: border-box;
                    .top-area {
                        width: 100%;
                        // height: 42px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        .left {
                            display: flex;
                            align-items: center;
                            .title {
                                font-size: 14px;
                                font-family: HarmonyOS_Sans_SC_Medium;
                                color: #19203d;
                                font-weight: bold;
                                margin-right: 12px;
                            }
                            .desc {
                                font-size: 12px;
                                font-family: HarmonyOS_Sans_SC;
                                color: #a7aab4;
                            }
                        }
                    }
                    .person-list {
                        margin-top: 14px;
                        .list-item {
                            padding: 10px 12px;
                            background-color: #ffffff;
                            display: flex;
                            width: 167px;
                            border-radius: 5px;
                            .images {
                                width: 36px;
                                height: 36px;
                                border-radius: 50%;
                            }
                            .name-number {
                                margin-left: 16px;
                                .name {
                                    font-size: 14px;
                                    font-family: HarmonyOS_Sans_SC;
                                    color: #19203d;
                                }
                                .number {
                                    font-size: 12px;
                                    font-family: HarmonyOS_Sans_SC;
                                    color: #a7aab4;
                                    margin-top: 5px;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>
