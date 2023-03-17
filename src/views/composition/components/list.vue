<template>
    <div class="list" style="height: 100%;" v-if="dialogVisible">
        <div class="upper align-center">
            {{ '《' + '将已知的事物陌生化，更是一种创造' + '》' }}
            <div class="back" @click="close">
                <img src="../../../assets/composition/icon_back@2x.png" alt="" />
            </div>
        </div>
        <div class="tab align-center">
            <el-tabs>
                <el-tab-pane v-for="(item, idx) in tabList" :key="idx">
                    <template #label>
                        <div class="custom-tab-label align-center">
                            {{ item.name }}
                            <span class="red">(12)</span>
                        </div>
                    </template>
                </el-tab-pane>
            </el-tabs>
            <div class="btns align-center">
                <div class="btn align-center typeIn">
                    <img src="../../../assets/composition/icon_luru@2x.png" alt="" />
                    录入
                </div>
                <div class="btn align-center refresh">
                    <img src="../../../assets/composition/icon_shuaxin_rest@2x.png" alt="" />
                    刷新
                </div>
            </div>
        </div>
        <div class="box">
            <div class="article-line align-center" v-for="(item, idx) of stuList" :key="idx">
                <div class="sort">{{ idx + 1 }}</div>
                <div class="stu-name">{{ item.Name }}</div>
                <div class="grade">{{ item.Grade }}</div>
                <div class="status align-center">
                    <div class="dot red"></div>
                    <!-- <img class="yes" src="../../../assets/composition/icon_complete@2x.png" alt="" /> -->
                    已完成
                    <el-tooltip effect="dark" content="经检测您提交的内容不是作文，
            若您确认为作文请点击重新批改" placement="top">
                        <img class="ask" src="../../../assets/composition/icon_wenhao@2x.png" alt="" />
                    </el-tooltip>
                </div>
                <div class="opts align-center">
                    <div class="delete align-center">
                        <img src="../../../assets/composition/icon_delete_black@2x.png" alt="" />
                    </div>
                    <div class="button" @click="showDetail">重新批改</div>
                    <!-- <div class="button">前往录入</div> -->
                    <div class="button" @click="showOrigin">检查原文</div>
                    <div class="button" @click="showArticle">查看原文</div>
                </div>
            </div>
        </div>
        <div class="bottom align-center">
            <div class="del" @click="delProject">删除项目</div>
            <div class="wrapper">
                <span>共35篇</span>
                <el-button class="report" color="#3AD393" @click="sendReport">一键发送报告</el-button>
                <el-button color="#4B71EE" @click="correction">一键批改</el-button>
            </div>
        </div>
    </div>
    <!-- 删除 -->
    <Delete ref="deleteRef" /> 
    <!-- 检查原文 -->
    <Origin ref="originRef" />
    <!-- 查看原文 -->
    <Article ref="articleRef" />
    <!-- 报告详情 -->
    <Detail ref="detailRef" />
    <!-- 批改列表 -->
    <CorrectionList ref="correctionRef" />
    <!-- 报告列表 -->
    <ReportList ref="reportRef" />
</template>
<script setup lang="ts">
import { reactive, ref, toRefs } from 'vue';
import Origin from './origin.vue';
import Article from './article.vue';
import Detail from './detail.vue';
import CorrectionList from './correctionList.vue';
import ReportList from './reportList.vue'
import Delete from './deleteDialog.vue'

const originRef = ref()
const articleRef = ref()
const deleteRef = ref()
const detailRef = ref()
const reportRef = ref()
const correctionRef = ref()
const dialogVisible = ref(false)

const state = reactive({
    gradeList: [{
        label: '全部',
        value: 0
    }],
    tabList: [
        {
            name: '全部'
        },
        {
            name: '待录入'
        },
        {
            name: '待批改'
        },
        {
            name: '批改中'
        },
        {
            name: '批改失败'
        },
        {
            name: '批改完成'
        }
    ],
    grade: null,
    stuList: [{
        Name: '我的中国心',
        Grade: '三年级1班',
        Status: 1
    },
    {
        Name: '我的中国心',
        Grade: '三年级1班',
        Status: 1
    },
    {
        Name: '我的中国心',
        Grade: '三年级1班',
        Status: 1
    },
    {
        Name: '我的中国心',
        Grade: '三年级1班',
        Status: 1
    }, {
        Name: '我的中国心',
        Grade: '三年级1班',
        Status: 1
    }, {
        Name: '我的中国心',
        Grade: '三年级1班',
        Status: 1
    },
    {
        Name: '我的中国心',
        Grade: '三年级1班',
        Status: 1
    }, {
        Name: '我的中国心',
        Grade: '三年级1班',
        Status: 1
    },
    {
        Name: '我的中国心',
        Grade: '三年级1班',
        Status: 1
    }]
})

const emit = defineEmits(['close', 'save']);

const { gradeList, grade, tabList, stuList } = toRefs(state)

// 删除项目
const delProject = ()=>{
    deleteRef.value.openDialog()
}

// 检查原文
const showOrigin = () => {
    originRef.value.openDialog()
}

// 查看原文
const showArticle = () => {
    articleRef.value.openDialog()
}

// 报告详情
const showDetail = () => {
    detailRef.value.openDialog()
}

// 关闭
const close = () => {
    dialogVisible.value = false
    emit('close')
}

// 一键发送报告
const sendReport = () => {
    reportRef.value.openDialog()
}

// 一键批改
const correction = () => {
    correctionRef.value.openDialog()
}

const openDialog = async (info?: any) => {
    dialogVisible.value = true
}

defineExpose({
    openDialog,
})
</script>
<style lang="scss" scoped>
:deep(.el-tabs__header) {
    margin: 0;
}

:deep(.el-tabs__active-bar) {
    background-color: #4B71EE;
    height: 3px;
}

:deep(.el-tabs__item) {
    font-size: 16px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #A7AAB4;
}

:deep(.el-tabs__item.is-active, .el-tabs__item:hover) {
    color: #19203D;
}

:deep(.el-tabs__nav-wrap::after) {
    position: static !important;
}

.list {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 888;
    display: flex;
    flex-direction: column;
    min-height: 0px;
    flex: 1;
    background-color: #F5F6FA;
}

.align-center {
    display: flex;
    align-items: center;
}

.upper {
    justify-content: center;
    position: relative;
    width: 100%;
    height: 56px;
    padding: 0 16px;
    box-sizing: border-box;
    background-color: #4B71EE;
    font-size: 20px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #FFFFFF;

    .back {
        position: absolute;
        left: 0;
        top: 0;
        padding: 16px;
        cursor: pointer;

        &>img {
            width: 24px;
            height: 24px;
        }
    }
}

.red {
    font-size: 12px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #FF6B6B;
    margin-left: 4px;
}

.btns {
    .btn {
        cursor: pointer;
        width: 76px;
        height: 32px;
        border-radius: 4px;
        justify-content: center;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;

        &>img {
            width: 12px;
            height: 12px;
            margin-right: 5px;
        }
    }

    .typeIn {
        color: #4B71EE;
        border: 1px solid rgba(75, 113, 238, 0.5);
    }

    .refresh {
        color: #19203D;
    }
}

.tab {
    height: 56px;
    justify-content: space-between;
    margin-bottom: 8px;
    background-color: #fff;
    padding: 0 16px;
    box-sizing: border-box;
}

.box {
    height: calc(100% - 112px);
    overflow-y: auto;
    background-color: #fff;
    padding: 12px 16px 66px 12px;
    box-sizing: border-box;

    .article-line {
        width: 100%;
        height: 56px;
        background-color: #F9FAFC;
        padding: 0 16px;
        box-sizing: border-box;
        margin-bottom: 8px;

        .sort {
            width: 80px;
            font-size: 16px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #19203D;
        }

        .stu-name {
            width: 20%;
            font-size: 16px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #19203D;
            padding-right: 30px;
            box-sizing: border-box;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }

        .grade {
            width: 20%;
            font-size: 14px;
            font-family: PingFangSC-Semibold, PingFang SC;
            // font-weight: 600;
            color: #A7AAB4;
        }

        .status {
            width: 20%;
            font-size: 14px;
            font-family: PingFangSC-Semibold, PingFang SC;
            // font-weight: 600;
            color: #A7AAB4;

            .yes {
                width: 14px;
                height: 10px;
                margin-right: 8px;
            }

            .dot {
                width: 6px;
                height: 6px;
                border-radius: 50%;
                margin-right: 8px;

                &.red {
                    background-color: #FF6B6B;
                }

                &.yel {
                    background-color: #FBC54D;
                }

                &.green {
                    background-color: #3AD393;
                }

                &.gray {
                    background-color: #A7AAB4;
                }
            }


            .ask {
                width: 14px;
                height: 14px;
                margin-left: 4px;
            }
        }

        .opts {
            flex: 1;
            justify-content: flex-end;

            .delete {
                cursor: pointer;
                width: 28px;
                height: 28px;
                background: #FFFFFF;
                border-radius: 4px;
                justify-content: center;

                &>img {
                    width: 12px;
                    height: 11px;
                }
            }

            .button {
                width: 80px;
                height: 28px;
                line-height: 28px;
                text-align: center;
                border-radius: 4px;
                border: 1px solid rgba(75, 113, 238, 0.5);
                font-size: 12px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #4B71EE;
                margin-left: 12px;
                cursor: pointer;
            }
        }
    }
}

.bottom {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 56px;
    background: #FFFFFF;
    box-shadow: inset 0px 1px 0px 0px rgba(224, 226, 231, 0.5);
    justify-content: space-between;
    padding: 0 16px;
    box-sizing: border-box;

    .del {
        width: 100px;
        height: 32px;
        line-height: 32px;
        text-align: center;
        background: #FFFFFF;
        border-radius: 4px;
        border: 1px solid #FF8181;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #FF6B6B;
        cursor: pointer;
    }

    .wrapper {
        &>span {
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #19203D;
            margin-right: 24px;
        }

        .report {
            color: #fff;
        }
    }
}
</style>