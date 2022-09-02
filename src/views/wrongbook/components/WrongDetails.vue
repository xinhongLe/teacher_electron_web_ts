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
                        <div
                            class="ratedata"
                            v-if="
                                props.currentWrongType == 1 ||
                                props.currentWrongType == 2
                            "
                        >
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
                        <div class="ratedata-two">
                            <p>出现频次<span>2</span></p>
                            <div class="wrong-rate">
                                最近错误率<span>90%</span>
                                <!-- <div class="arrow">
                                        <img
                                            src="~@/assets/images/wrongbook/arrow_next_rest1.png"
                                            alt=""
                                        />
                                        <div class="bg"></div>
                                    </div> -->
                                <div class="arrowtwo">
                                    <img
                                        src="~@/assets/images/wrongbook/arrow_next_rest.png"
                                        alt=""
                                    />
                                    <div class="bg"></div>
                                </div>
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
                            <el-button
                                type="primary"
                                plain
                                size="small"
                                @click="explainQuestion()"
                                >讲解题目</el-button
                            >
                            <el-button
                                type="primary"
                                plain
                                size="small"
                                @click="state.pureQuestionVisible = true"
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
                    <div
                        class="top-title"
                        v-if="
                            props.currentWrongType == 1 ||
                            props.currentWrongType == 2
                        "
                    >
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
                    <div v-else class="top-title-two">
                        <div class="title">
                            <p class="text">学生答题详情</p>
                            <p class="switch">
                                仅看重复错误的学生<el-switch
                                    size="small"
                                    style="padding-left: 8px"
                                    v-model="state.isRepeat"
                                />
                            </p>
                        </div>
                        <div class="statistics">
                            <div
                                class="statistics-list"
                                v-for="item in state.statisticsList"
                                :key="item.id"
                                @click="state.currentStatisticIndex = item.id"
                                :class="{
                                    isActive:
                                        state.currentStatisticIndex == item.id,
                                }"
                            >
                                <div class="statistics-title">
                                    <img
                                        src="~@/assets/images/wrongbook/icon_timu.png"
                                        alt=""
                                    />
                                    <p>{{ item.name }}</p>
                                </div>
                                <div class="dates">{{ item.date }}</div>
                                <div class="bot-rate">
                                    <div class="count-text">
                                        <p class="count">30</p>
                                        <p class="text">总答</p>
                                    </div>
                                    <div class="count-text">
                                        <p class="count">1</p>
                                        <p class="text">答错</p>
                                    </div>
                                    <div class="count-text">
                                        <p class="count">10</p>
                                        <p class="text">未答</p>
                                    </div>
                                    <div class="count-text">
                                        <p class="count">66%</p>
                                        <p class="text">完成率</p>
                                    </div>
                                    <div class="count-text">
                                        <p class="count" style="color: #f76b6b">
                                            90%
                                        </p>
                                        <p class="text">平均错误率</p>
                                    </div>
                                </div>
                                <div class="bto-arrow"></div>
                            </div>
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
                            <div @click="expendStudent(item)">
                                <img
                                    :src="
                                        item.isExpend
                                            ? require('../../../assets/images/wrongbook/icon_shouqi.png')
                                            : require('../../..//assets/images/wrongbook/icon_xiala.png')
                                    "
                                    alt=""
                                />
                            </div>
                        </div>
                        <div
                            class="person-list"
                            v-if="item.list?.length && item.isExpend"
                        >
                            <div
                                class="list-item"
                                v-for="person in item.list"
                                :key="person.number"
                            >
                                <div class="top-data">
                                    <div class="images">
                                        <img
                                            src="~@/assets/images/wrongbook/ps1.png"
                                            alt=""
                                        />
                                    </div>
                                    <div class="name-number">
                                        <p class="name">{{ person.name }}</p>
                                        <p class="number">
                                            {{ person.number }}
                                        </p>
                                    </div>
                                </div>

                                <div class="wrong-repeat" v-if="state.isRepeat">
                                    <div class="wrong-count">
                                        答错<span>{{ 2 }}</span
                                        >次
                                    </div>
                                    <div class="line"></div>
                                    <div class="practise-count">
                                        练习<span>{{ 2 }}</span
                                        >次
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
    <!-- <div class="question-dialog">
        <el-dialog
            v-model="state.visible"
            :show-close="false"
            :close-on-click-modal="false"
            width="80%"
        >
            <template #title>
                <div class="my-header">讲解题目</div>
            </template>
            <lookQuestion
                v-if="state.isShowQuestion"
                :dialog="true"
                :close="close"
            >
            </lookQuestion>
        </el-dialog>
    </div>
    -->
    <PureQuestionDialog
        v-if="state.pureQuestionVisible"
        v-model:visible="state.pureQuestionVisible"
    />
</template>

<script lang="ts" setup>
import { ref, reactive, defineEmits, defineProps, watch } from "vue";
import lookQuestion from "@/components/lookQuestion/index.vue";
import PureQuestionDialog from "@/components/lookQuestion/PureQuestionDialog.vue";
import { MutationTypes, useStore } from "@/store";

const props = defineProps({
    currentWrongType: {
        type: Number,
        default: null,
        required: true,
    },
});
const emit = defineEmits(["update:isShowDetails"]);
//题型
const questionType = ref("");
const state = reactive({
    isRepeat: false, //时候查看重复错误的学生
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
            isExpend: false,
        },
        {
            id: 2,
            name: "B层",
            count: 9,
            isExpend: false,

            list: [
                {
                    img: "~@/assets/images/wrongbook/ps1.png",
                    name: "巢浩真",
                    number: "mg57086112",
                },
                {
                    img: "~@/assets/images/wrongbook/ps1.png",
                    name: "岩炎岩",
                    number: "mg57086113",
                },
                {
                    img: "~@/assets/images/wrongbook/ps1.png",
                    name: "万东伯",
                    number: "mg57086114",
                },
                {
                    img: "~@/assets/images/wrongbook/ps1.png",
                    name: "居建冰",
                    number: "mg57086115",
                },
                {
                    img: "~@/assets/images/wrongbook/ps1.png",
                    name: "洪莉",
                    number: "mg57086116",
                },
                {
                    img: "~@/assets/images/wrongbook/ps1.png",
                    name: "宰茜",
                    number: "mg57086117",
                },
                {
                    img: "~@/assets/images/wrongbook/ps1.png",
                    name: "欧岚",
                    number: "mg57086118",
                },
                {
                    img: "~@/assets/images/wrongbook/ps1.png",
                    name: "樊琳",
                    number: "mg57086119",
                },
                {
                    img: "~@/assets/images/wrongbook/ps1.png",
                    name: "段舒园",
                    number: "mg57086120",
                },
            ],
        },
        {
            id: 3,
            name: "C层",
            count: 11,
            isExpend: false,
        },
        {
            id: 4,
            name: "未标记",
            count: 0,
            isExpend: false,
        },
    ],
    //答题详情统计卡片list
    statisticsList: [
        {
            id: 1,
            name: "求倍数的错题巩固联系",
            date: "2022-07-05 (周二)",
        },
        {
            id: 2,
            name: "求倍数的错题巩固联系",
            date: "2022-07-05 (周二)",
        },
        {
            id: 3,
            name: "求倍数的错题巩固联系",
            date: "2022-07-05 (周二)",
        },
    ],
    //当前选中的答题详情卡片
    currentStatisticIndex: 1,
    //讲解题目 公共组件显示
    isShowQuestion: false,
    //弹框
    visible: false,
    //查看同类问题
    pureQuestionVisible: false,
});
//监听是否仅看重复错误的学生
watch(
    () => state.isRepeat,
    (value) => {
        console.log(value);
    }
);
//关闭
const close = () => {
    console.log(12);
    state.isShowQuestion = false;
    state.visible = false;
};
//切换左侧错题项
const switchWrongItem = (item: any) => {
    state.currentIndex = item.id;
};
//返回列表页
const backList = () => {
    emit("update:isShowDetails", false);
};
//展开收起学生列表
const expendStudent = (item: any) => {
    console.log(item);
    item.isExpend = !item.isExpend;
};
const store = useStore();

//讲解题目
const explainQuestion = () => {
    // state.visible = true;
    // state.isShowQuestion = true;
    store.commit(MutationTypes.SET_IS_SHOW_QUESTION, {
        flag: true,
        info: {
            id: "",
            courseBagId: "",
            deleteQuestionIds: [],
            type: 1,
        },
    });
    // console.log(1);
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
                    .ratedata-two {
                        padding: 10px 12px;
                        display: flex;
                        align-items: center;
                        p {
                            font-size: 12px;
                            color: #5f626f;
                            span {
                                padding-left: 3px;
                                color: #19203d;
                            }
                        }
                        .wrong-rate {
                            font-size: 12px;
                            color: #5f626f;
                            margin-left: 20px;
                            display: flex;
                            align-items: center;
                            span {
                                padding-left: 3px;
                                color: #f76b6b;
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
                    .ratedata-two {
                        p {
                            color: #ffffff !important;
                            span {
                                color: #ffffff !important;
                            }
                        }
                        .wrong-rate {
                            color: #ffffff !important;
                            span {
                                color: #ffffff !important;
                            }
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
                .top-title-two {
                    padding: 16px 0;
                    .title {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        .text {
                            font-size: 16px;
                            font-family: HarmonyOS_Sans_SC_Bold;
                            color: #19203d;
                            font-weight: bold;
                            margin-right: 12px;
                        }
                        .switch {
                            font-size: 12px;
                            font-family: HarmonyOS_Sans_SC;
                            color: #19203d;
                        }
                    }
                    .statistics {
                        margin-top: 12px;
                        display: flex;
                        .statistics-list {
                            cursor: pointer;
                            width: 264px;
                            // height: 92px;
                            background: #ffffff;
                            border: 1px solid #e0e2e7;
                            padding: 8px 12px;
                            border-radius: 4px;
                            margin-right: 20px;
                            .statistics-title {
                                display: flex;
                                align-items: center;
                                p {
                                    margin-left: 5px;
                                    font-size: 14px;
                                    font-family: HarmonyOS_Sans_SC;
                                    color: #19203d;
                                }
                            }
                            .dates {
                                margin-top: 8px;
                                font-size: 12px;
                                font-family: HarmonyOS_Sans_SC;
                                color: #a7aab4;
                                padding-left: 22px;
                            }
                            .bot-rate {
                                margin-top: 8px;
                                display: flex;
                                align-items: center;
                                justify-content: space-around;
                                padding-left: 16px;
                                .count-text {
                                    display: flex;
                                    flex-direction: column;
                                    justify-content: center;
                                    align-items: center;
                                    font-size: 12px;
                                    .text {
                                        margin-top: 2px;
                                    }
                                }
                            }
                        }
                        .isActive {
                            position: relative;
                            background: #e6ecff;
                            border: 1px solid #4b71ee;
                            transition: 0.3s;
                            .bto-arrow {
                                position: absolute;
                                bottom: -20px;
                                left: 47%;
                                display: block;
                                width: 0;
                                height: 0;
                                border: 10px solid transparent;
                                border-top-color: #4b71ee;
                            }
                            .bto-arrow:after {
                                content: "";
                                width: 0;
                                height: 0;
                                position: absolute;
                                left: -9px;
                                top: -10px;
                                border: 9px solid transparent;
                                border-top-color: #e6ecff;
                            }
                        }
                    }
                }
                .A-floor {
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
                        cursor: pointer;
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
                        transition: 0.5s;
                        margin-top: 14px;
                        display: flex;
                        flex-wrap: wrap;
                        .list-item {
                            cursor: pointer;

                            background-color: #ffffff;
                            width: 167px;
                            border-radius: 5px;
                            margin-right: 12px;
                            margin-bottom: 12px;
                            .top-data {
                                padding: 10px 12px;
                                display: flex;
                                .images {
                                    width: 36px;
                                    height: 36px;
                                    img {
                                        width: 100%;
                                        height: 100%;
                                        border-radius: 50%;
                                    }
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

                            .wrong-repeat {
                                display: flex;
                                justify-content: space-around;
                                align-items: center;
                                // padding: 05px;
                                padding: 5px 8px;
                                font-size: 12px;
                                color: #a7aab4;
                                border-top: 1px solid #f3f4f4;
                                .wrong-count {
                                    span {
                                        color: #ff6b6b;
                                    }
                                }
                                .line {
                                    width: 1px;
                                    height: 12px;
                                    background: #e7e7e7;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    .arrow {
        position: relative;
        img {
            position: absolute;
            bottom: 0px;
            left: 3px;
        }
        .bg {
            width: 1px;
            height: 9px;
            border: 1px solid #2ee18e;
            position: absolute;
            top: 1px;
            left: 5px;
        }
    }
    .arrowtwo {
        position: relative;
        img {
            position: absolute;
            top: -7px;
            left: 4px;
        }
        .bg {
            width: 1px;
            height: 9px;
            border: 1px solid #ff6b6b;
            position: absolute;
            bottom: -5px;
            left: 5px;
        }
    }
}
.question-dialog {
    :deep(.el-dialog) {
        .el-dialog__header {
            // padding: 0;
        }
        .el-dialog__body {
            padding: 0;
        }
    }
    .my-header {
        font-size: 16px;
        font-family: HarmonyOS_Sans_SC_Bold;
        color: #19203d;
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
    }
}
</style>
