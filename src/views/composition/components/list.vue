<template>
    <div class="list" style="height: 100%;" v-if="dialogVisible">
        <div class="upper align-center">
            {{ '《' + Title + '》' }}
            <div class="back" @click="close(true)">
                <img src="../../../assets/composition/icon_back@2x.png" alt="" />
            </div>
        </div>
        <div class="tab align-center">
            <el-tabs v-model="state.tabName" @tab-change="tabChange">
                <el-tab-pane v-for="(item, idx) in tabList" :key="idx" :name="item.name">
                    <template #label>
                        <div class="custom-tab-label align-center">
                            {{ item.StatusDisplay }}
                            <span class="red" v-if="item.StatusCount > 0">({{ item.StatusCount }})</span>
                        </div>
                    </template>
                </el-tab-pane>
            </el-tabs>
            <div class="btns align-center">
                <div class="btn align-center typeIn" @click="goTypeIn">
                    <img src="../../../assets/composition/icon_luru@2x.png" alt="" />
                    录入
                </div>
                <div class="btn align-center refresh" @click="refresh">
                    <img src="../../../assets/composition/icon_shuaxin_rest@2x.png" alt="" />
                    刷新
                </div>
            </div>
        </div>
        <div class="box" v-if="stuList.length === 0">
            <div class="empty">暂无数据 </div>
        </div>
        <div class="box" v-else>
            <div class="article-line thead align-center">
                <div class="sort">序号</div>
                <div class="stu-name">姓名</div>
                <div class="status align-center">
                    状态
                </div>
                <div class="time">最近修改时间</div>
                <div class="opts"></div>
            </div>
            <div class="article-line align-center" v-for="(item, idx) of stuList" :key="idx">
                <div class="sort">{{ idx + 1 }}</div>
                <div class="stu-name">{{ item.StudentName }}</div>
                <div class="status align-center">
                    <div v-if="item.Status !== 3"
                        :class="['dot', item.Status === 1 && 'gray', item.Status === 2 && 'yel', item.Status === 4 && 'blue', item.Status === 5 && 'red', item.Status === 6 && 'green']">
                    </div>
                    <img v-if="item.Status === 3" class="yes" src="../../../assets/composition/icon_complete@2x.png"
                        alt="" />
                    {{ item.StatusDisplay }}
                    <el-tooltip effect="dark" :content="item.NotComposition" placement="top">
                        <img v-if="item.Status === 5" class="ask" src="../../../assets/composition/icon_wenhao@2x.png"
                            alt="" />
                    </el-tooltip>
                </div>
                <div class="time">{{ item.UpdateTime }}</div>
                <div class="opts align-center">
                    <div class="button" v-if="item.Status === 1" @click="goScan(item)">前往录入</div>
                    <div class="delete align-center" v-if="item.Status === 2" @click="delItem(item)">
                        <img src="../../../assets/composition/icon_delete_black@2x.png" alt="" />
                    </div>
                    <div class="button" v-if="item.Status === 5" @click="reCorrection(item)">重新批改</div>
                    <div class="button" v-if="item.Status === 2" @click="handOperate(item)">手动批改</div>
                    <div class="button" v-if="item.Status === 2" @click="checkOrigin(item)">检查原文</div>
                    <div class="button" v-if="item.Status === 3 || item.Status === 6" @click="showReport(item)">查看报告</div>
                    <div class="button"
                        v-if="item.Status === 3 || item.Status === 4 || item.Status === 5 || item.Status === 6"
                        @click="showArticle(item)">查看原文</div>
                </div>
            </div>
            <div class="page">
                <Pagination @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"
                    ref="PaginationRef" />
            </div>
        </div>
        <div class="bottom align-center">
            <div class="del" @click="delProject">删除项目</div>
            <div class="wrapper">
                <span>共{{ total }}篇</span>
                <el-button class="report" color="#3AD393" @click="sendReport">一键发送报告</el-button>
                <el-button color="#4B71EE" @click="correction">一键批改</el-button>
            </div>
        </div>
    </div>
    <!-- 删除 -->
    <Delete ref="deleteRef" @confirm="confirmDelProject" msg="删除后，相关的作文内容和照片以及报告都将删除！" />
    <Delete ref="deleteItemRef" @confirm="confirmDelItem" />
    <!-- 检查原文 -->
    <Origin ref="originRef" />
    <!-- 手动批改 -->
    <Assessment ref="assessmentRef" @success="refresh" @close="assessClose" />
    <!-- 查看原文 -->
    <Article ref="articleRef" @view-report="showReport" />
    <!-- 报告详情 -->
    <Detail ref="detailRef" @re-assess="handOperate" />
    <!-- 批改列表 -->
    <CorrectionList ref="correctionRef" @success="refresh" />
    <!-- 报告列表 -->
    <ReportList ref="reportRef" @success="refresh" />
</template>
<script setup lang="ts">
import { nextTick, reactive, ref, toRefs } from 'vue';
import Origin from './origin.vue';
import Assessment from './assessment.vue';
import Article from './article.vue';
import Detail from './detail.vue';
import CorrectionList from './correctionList.vue';
import ReportList from './reportList.vue'
import Delete from './deleteDialog.vue'
import Pagination from './pagination.vue'
import { deleteArticle, deleteStudentEntry, getStatusCountByTeacherComId, getStudentComByTeacherComId, resubmitCorrectComposition } from '../api';
import { ElMessage } from 'element-plus';
import { store } from '@/store';

const originRef = ref()
const assessmentRef = ref()
const articleRef = ref()
const deleteRef = ref()
const deleteItemRef = ref()
const detailRef = ref()
const reportRef = ref()
const PaginationRef = ref()

const correctionRef = ref()
const dialogVisible = ref(false)

const state = reactive({
    ClassId: null,
    TeacherCompositionId: null,
    Title: '',
    total: 0,
    page: {
        PageNumber: 1,
        PageSize: 10
    },
    gradeList: [{
        label: '全部',
        value: 0
    }],
    tabName: '0',
    // tabList: [] as any,
    grade: null,
    stuList: [] as any
})

const emit = defineEmits(['close', 'save', 'refresh', 'typein']);

const { gradeList, Title, total, grade, stuList } = toRefs(state)

const tabList = ref<any>([])
const tabChange = (name: any) => {
    state.page.PageNumber = 1
    state.tabName = name
    nextTick(() => {
        if (PaginationRef.value) {
            PaginationRef.value.page = 1
        }
    })
    getComList()
}

// 录入
const goTypeIn = () => {
    close()
    emit('typein', { TeacherCompositionId: state.TeacherCompositionId, Title: state.Title })
}


// 单个学生前往录入
const goScan = (item: any) => {
    close()
    emit('typein', { ...item, TeacherCompositionId: state.TeacherCompositionId, Title: state.Title })
}

// 刷新
const refresh = () => {
    getTabList()
    getComList()
}
const assessClose = (e?: any) => {
    console.log('assessClose:', e);
    if (e.isSaved && e.isFromDetail) {
        // 刷新
        detailRef.value.close()
        refresh()
    }
}

// 删除项目
const delProject = () => {
    deleteRef.value.openDialog({ TeacherCompositionId: state.TeacherCompositionId })
}
const confirmDelProject = (e: any) => {
    deleteArticle({ Id: state.TeacherCompositionId }).then((res: any) => {
        if (res.success) {
            ElMessage.success('操作成功')
            emit('refresh')
            close()
        }
    })
}

// 删除item
const delItem = (item: any) => {
    deleteItemRef.value.openDialog({ StudentCompositionId: item.StudentCompositionId })
}
const confirmDelItem = (e: any) => {
    deleteStudentEntry({ StudentCompositionId: e.StudentCompositionId, OperatorId: store.state.userInfo?.userCenterUserID }).then((res: any) => {
        if (res.success) {
            ElMessage.success('操作成功')
            getTabList(() => {
                getComList()
            })
        }
    })
}

// 手动批改
const handOperate = (item: any) => {
    // console.log('手动批改:', item);
    assessmentRef.value.openDialog({ StudentCompositionId: item.StudentCompositionId, isFromDetail: item.isFromDetail || false })
}

// 检查原文
const checkOrigin = (item: any) => {
    originRef.value.openDialog({ StudentCompositionId: item.StudentCompositionId })
}

// 查看原文
const showArticle = (item: any) => {
    articleRef.value.openDialog({ StudentCompositionId: item.StudentCompositionId })
}

// 查看报告
const showReport = (item: any) => {
    detailRef.value.openDialog({ StudentCompositionId: item.StudentCompositionId })
}

// 重新批改
const reCorrection = (item: any) => {
    resubmitCorrectComposition({ StudentCompositionId: item.StudentCompositionId }).then((res: any) => {
        if (res.success) {
            ElMessage.success('提交成功')
            refresh()
        }
    })
}

// 关闭
const close = (needRefresh?: any) => {
    dialogVisible.value = false
    state.page.PageNumber = 1
    state.tabName = '0'
    emit('close')
    if (needRefresh) {
        emit('refresh')
    }
}

// 一键发送报告
const sendReport = () => {
    reportRef.value.openDialog({ TeacherCompositionId: state.TeacherCompositionId })
}

// 一键批改
const correction = () => {
    correctionRef.value.openDialog({ TeacherCompositionId: state.TeacherCompositionId })
}

const openDialog = async (info?: any) => {
    console.log('-----info:', info);

    const { TeacherCompositionId, ClassId, Title, isTurnToWait } = info

    state.TeacherCompositionId = TeacherCompositionId
    state.ClassId = ClassId
    state.Title = Title

    getTabList(() => {
        if (isTurnToWait) {
            console.log('待批改');

            state.tabName = '2' // 待批改
        }
        getComList()
    })
}

/**
 * 获取列表
 */
const getComList = () => {
    let status = Number(state.tabName)
    getStudentComByTeacherComId({ TeacherCompositionId: state.TeacherCompositionId, Status: status, ClassId: state.ClassId, Pager: state.page }).then((res: any) => {
        if (res.success) {
            let { list = [], pager } = res.result
            if (list.length > 0) {
                list.forEach((ele: any) => {
                    ele.UpdateTime = ele.UpdateTime || '--'
                });
            }
            state.stuList = list
            dialogVisible.value = true
            nextTick(() => {
                if (PaginationRef.value) {
                    PaginationRef.value.total = pager.Total
                }
            })

            state.total = pager.Total
        }
    })
}

/**
 * 获取状态栏
 */
const getTabList = (cb?: any) => {
    getStatusCountByTeacherComId({ TeacherCompositionId: state.TeacherCompositionId, ClassId: state.ClassId, Pager: state.page }).then((res: any) => {
        if (res.success) {
            let list = res.result || []
            if (list.length > 0) {
                list = list.map((v: any) => {
                    return {
                        ...v,
                        name: JSON.stringify(v.Status)
                    }
                })
            }
            tabList.value = []
            setTimeout(() => {
                tabList.value = list
            }, 50);
            if (cb) {
                cb()
            }
        }
    })
}

const handleSizeChange = (val: number) => {
    state.page.PageSize = val;
    getComList()
}

const handleCurrentChange = (val: number) => {
    state.page.PageNumber = val;
    getComList()
}

defineExpose({
    openDialog,
})
</script>
<style lang="scss" scoped>
.empty {
    text-align: center;
    color: #5F626F;
    margin-top: 60px;
    font-size: 13px;
}

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

.page {
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
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
        top: 2px;
        padding: 9px;
        cursor: pointer;

        &>img {
            width: 35px;
            height: 35px;
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

        .time {
            width: 20%;
            color: #A7AAB4;
            font-size: 14px;
            font-family: PingFangSC-Semibold, PingFang SC;
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

                &.blue {
                    background-color: #4B71EE;
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

    .thead {
        &>div {
            font-size: 14px !important;
            font-weight: 500 !important;
            color: #A7AAB4 !important;
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