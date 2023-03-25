<template>
    <div class="detail" style="height: 100%;" v-if="dialogVisible">
        <div class="upper align-center">
            <div class="back" @click="close">
                <img src="../../../assets/composition/icon_back@2x.png" alt="" />
            </div>
            <!-- <el-pagination background layout="prev, pager, next" :total="1000" />
            <div class="top">查看下一篇</div> -->
        </div>

        <div class="box align-center">
            <div class="left">
                <div class="head align-center">
                    <div :class="['img-wrapper', idx === active && 'active']" v-for="(item, idx) in photoList" :key="idx"
                        @click="switchPic(item, idx)">
                        <img :src="item.url" alt="" />
                    </div>
                </div>
                <div class="img-box">
                    <img :src="mainPic" alt="" />
                </div>
            </div>
            <div class="right">
                <div class="head align-center">
                    <span>{{ state.author }}的评价报告</span>
                    <div class="round">
                        <!-- const value = 43
                        const angle = -135 + (value / 100) * 180
                        progress.style.transform = `rotate(${angle}deg)` -->
                        <div class="block" style="transform: rotate(-135 + ({{score}} / 100) * 180);"></div>
                        <p>
                            <span class="score">{{ score }}</span>
                            <span class="tip">{{ state.assessment }}</span>
                        </p>
                    </div>
                    <!-- 编辑 -->
                    <el-popover :visible="popoverVisible" placement="top" :width="160">
                        <div class="align-center">
                            <el-input v-model="state.inputScore" />
                            <el-select v-model="assess" style="margin-left: 8px;">
                                <el-option v-for="item in assessList" :key="item.value" :label="item.name"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                        <div style="text-align: right; margin-top: 20px;">
                            <el-button size="small" @click="state.popoverVisible = false">取消</el-button>
                            <el-button size="small" color="#4B71EE" type="primary" @click="saveScore">保存</el-button>
                        </div>
                        <template #reference>
                            <img class="edit" @click="state.inputScore = score, state.popoverVisible = true"
                                src="../../../assets/composition/icon_deit_cebianlan@2x.png" alt="" />
                        </template>
                    </el-popover>

                </div>
                <div class="lines">
                    <div class="line-item" v-for="(item, idx) in lineList" :key="idx">
                        <img class="edit" @click="editLine(item, idx)" v-if="item.status === 0"
                            src="../../../assets/composition/icon_deit_cebianlan@2x.png" alt="" />
                        <div class="tit align-center">
                            <div class="dot"></div>
                            {{ item.title }}
                        </div>
                        <div class="content" v-if="item.status === 0">
                            {{ item.content }}
                        </div>
                        <el-input class="input" autofocus v-else v-model="item.content" :rows="3" type="textarea"
                            @blur="inputBlur(idx)" />
                    </div>
                </div>
            </div>
        </div>
        <div class="bottom align-center">
            <div class="view" @click="viewArticle">查看原文</div>
            <div class="export" @click="exportPDF">导出为pdf</div>
        </div>
    </div>
    <!-- 查看原文 -->
    <Article ref="articleRef" />
</template>
<script setup lang="ts">
import { getOssUrl } from '@/utils/oss';
import { ElMessage } from 'element-plus';
import moment from 'moment';
import { reactive, ref, toRefs } from 'vue';
import { downloadPDF, editReportDetail, searchReportDetail } from '../api';
import Article from './article.vue';

const articleRef = ref()

const dialogVisible = ref(false);

const state = reactive({
    assessment: '',
    popoverVisible: false,
    gradeList: [{
        label: '全部',
        value: 0
    }],
    assess: 2,
    score: 0,
    inputScore: 0,
    StudentCompositionId: '',
    assessList: [
        {
            name: '一般',
            value: 1
        },
        {
            name: '良好',
            value: 2
        },
        {
            name: '优秀',
            value: 3
        }
    ],
    photoList: [] as any,
    mainPic: '',
    active: 0,
    lineList: [
        {
            title: '综合点评',
            status: 0,
            key: 'Evaluation',
            content: ''
        },
        {
            title: '优点',
            key: 'Advantage',
            status: 0,
            content: ''
        }, {
            title: '不足',
            key: 'ShortComing',
            status: 0,
            content: ''
        }, {
            title: '改进建议',
            key: 'Suggestions',
            status: 0,
            content: ''
        }
    ],
    grade: null,
    title: '',
    author: '',
    stuList: []
})

const emit = defineEmits(['close', 'save']);

const { gradeList, photoList, mainPic, active, score, grade, stuList, title, lineList, assessList, assess, popoverVisible } = toRefs(state)

const switchPic = (item: any, idx: number) => {
    state.active = idx
    state.mainPic = item.url
}

// exportPDF
const exportPDF = () => {
    downloadPDF({ StudentCompositonId: state.StudentCompositionId }).then((res: any) => {
        if (res && res.success) {
            let blob = new Blob([res]);
            let objectUrl = window.URL.createObjectURL(blob); //生成一个url
            const a = document.createElement('a');
            const filename = moment().format('YYYY-MM-DD') + '.pdf';
            a.download = filename;
            a.href = objectUrl;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            ElMessage({ type: 'success', message: '下载成功' });
        }
    })
}

// 查看原文
const viewArticle = () => {
    articleRef.value.openDialog({ StudentCompositionId: state.StudentCompositionId })
}

// 保存分数
const saveScore = () => {
    exeSave(1, state.inputScore, () => {
        state.score = state.inputScore
        state.assessment = judgeScore(state.score)
        state.assess = state.assessList.findIndex(v => v.name == state.assessment) + 1
        state.popoverVisible = false
    })
}

// 失去焦点
const inputBlur = (idx: number) => {
    console.log('idx:', idx);
    let num = idx + 3
    exeSave(num, state.lineList[idx]['content'], () => {
        state.lineList[idx]['status'] = 0
    })
}

const exeSave = (type: number, info: any, cb?: any) => {
    editReportDetail({ StudentCompositonId: state.StudentCompositionId, SaveType: type, SaveInfo: info }).then(async (res: any) => {
        if (res.success) {
            ElMessage.success('保存成功')
            if (cb) {
                cb()
            }
        }
    })
}

// 编辑行
const editLine = (item: any, idx: number) => {
    state.lineList[idx]['status'] = 1
}

// 关闭
const close = () => {
    dialogVisible.value = false
    emit('close')
}

const openDialog = async (info?: any) => {
    const { StudentCompositionId } = info
    state.StudentCompositionId = StudentCompositionId
    getDetail(StudentCompositionId)
}

const getDetail = (id: string) => {
    searchReportDetail({ StudentCompositonId: id }).then(async (res: any) => {
        if (res.success) {
            //FileList
            let result = res.result
            state.score = result.Score
            state.assessment = judgeScore(state.score)
            state.assess = state.assessList.findIndex(v => v.name == state.assessment)
            state.author = result.StudentName || ''
            state.lineList.forEach((ele: any) => {
                ele.content = result[ele.key]
            })
            state.photoList = result.FileList
            await state.photoList.forEach(async (ele: any, i: number) => {
                const { FileExtention, FilePath, FileMD5, FileBucket } = ele;
                const key = FileExtention
                    ? `${FilePath}/${FileMD5}.${FileExtention}`
                    : `${FilePath}/${FileMD5}`;
                ele.url = await getOssUrl(key, FileBucket)
                if (i === 0) {
                    state.mainPic = ele.url;
                }
            })
            dialogVisible.value = true
        }
    })
}

const judgeScore = (score: number) => {
    // 0-59   一般60-89 良好90-100 优秀
    let str
    if (score < 59) {
        str = '一般'
    } else if (score < 89) {
        str = '良好'
    } else {
        str = '优秀'
    }
    return str
}

defineExpose({
    openDialog,
})
</script>
<style lang="scss" scoped>
:deep(.el-pagination.is-background .el-pager li:not(.is-disabled).is-active) {
    background-color: #fff !important;
    color: #3AD393 !important;
}

:deep(.el-pagination) {

    .btn-next,
    .btn-prev,
    .el-pager li {
        background-color: #3AD393 !important;
        color: #fff !important;
        border: 1px solid rgba(255, 255, 255, 0.5) !important;
        cursor: pointer !important;
    }
}

.detail {
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
    width: 100%;
    height: 56px;
    padding: 0 16px;
    box-sizing: border-box;
    background-color: #3AD393;
    font-size: 20px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #FFFFFF;
    position: relative;

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

    .top {
        position: absolute;
        right: 16px;
        top: 50%;
        transform: translateY(-50%);
        width: 102px;
        height: 32px;
        line-height: 32px;
        text-align: center;
        border-radius: 4px;
        border: 1px solid rgba(255, 255, 255, 0.5);
        font-size: 14px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 500;
        color: #FFFFFF;
        cursor: pointer;
    }
}


.box {
    height: calc(100% - 56px);
    overflow-y: auto;
    background-color: #F5F6FA;
    padding: 16px 16px 72px 16px;
    box-sizing: border-box;

    &>div {
        background-color: #fff;
        width: calc(50% - 8px);
        height: 100%;
        border-radius: 4px;
    }

    .left {
        margin-right: 16px;
        padding: 24px;
        box-sizing: border-box;

        .head {
            padding-bottom: 24px;
            border-bottom: 1px solid fade-out($color: #E0E2E7, $amount: 0.5);

            .img-wrapper {
                width: 56px;
                height: 56px;
                margin-right: 12px;
                border-radius: 4px;
                overflow: hidden;
                position: relative;
                box-sizing: border-box;

                &.active {
                    border: 2px solid #4B71EE;
                }

                .tag {
                    position: absolute;
                    left: 4px;
                    bottom: 4px;
                    width: 16px;
                    height: 16px;
                    line-height: 16px;
                    text-align: center;
                    background: fade-out($color: #000000, $amount: 0.8);
                    border-radius: 2px;
                    font-size: 12px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #F5F6FA;
                }

                &>img {
                    width: 100%;
                    height: 100%;

                }
            }
        }

        .img-box {
            padding-top: 24px;
            padding-bottom: 30px;
            box-sizing: border-box;
            height: 100%;
            overflow-y: auto;

            img {
                width: 100%;
                height: auto;
                display: block;
            }
        }
    }

    .right {
        padding: 16px 24px;
        box-sizing: border-box;
        overflow-y: auto;

        .round {
            position: relative;
            width: 120px;
            height: 60px;
            overflow: hidden;
            border-bottom-left-radius: 4px;
            border-bottom-right-radius: 4px;

            .block {
                position: absolute;
                width: 120px;
                height: 120px;
                border-left: 8px solid #3AD393;
                border-top: 8px solid #3AD393;
                border-right: 8px solid #EEEEF0;
                border-bottom: 8px solid #EEEEF0;
                border-radius: 50%;
                transform-origin: 50%;
                box-sizing: border-box;
            }

            &>p {
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;

                .score {
                    font-size: 20px;
                    font-family: HarmonyOS_Sans_SC_Bold;
                    color: #3AD393;
                    line-height: 24px;
                    font-weight: 600;
                }

                .tip {
                    font-size: 12px;
                    font-family: HarmonyOS_Sans_SC;
                    color: #A7AAB4;
                    line-height: 16px;
                }
            }
        }

        .words {
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #19203D;
            line-height: 22px;
            padding: 24px 18px 0 18px;
            height: 100%;
            width: 100%;
            overflow-y: auto;
        }

        .head {
            padding-bottom: 16px;
            position: relative;
            justify-content: space-between;

            &>span {
                font-size: 20px;
                font-family: PingFangSC-Semibold, PingFang SC;
                font-weight: 600;
                color: #19203D;
            }

            .edit {
                position: absolute;
                right: -16px;
                top: 0;
                width: 16px;
                height: 16px;
                cursor: pointer;
            }
        }

        .lines {
            .line-item {
                width: 100%;
                position: relative;
                padding: 16px;
                box-sizing: border-box;
                margin-bottom: 12px;
                border-radius: 4px;

                .tit {
                    font-size: 16px;
                    font-family: PingFangSC-Semibold, PingFang SC;
                    font-weight: 600;
                    color: #19203D;
                    margin-bottom: 12px;

                    .dot {
                        width: 6px;
                        height: 6px;
                        background: #4B71EE;
                        margin-right: 8px;
                        transform: rotate(45deg);
                    }
                }

                .edit {
                    position: absolute;
                    right: 11px;
                    top: 11px;
                    width: 16px;
                    height: 16px;
                    cursor: pointer;
                }

                &:nth-of-type(1) {
                    background-color: fade-out($color: #4B71EE, $amount: 0.92);



                }

                &:nth-of-type(2) {
                    background-color: fade-out($color: #3AD393, $amount: 0.92);

                    .dot {
                        background-color: #3AD393;
                    }
                }

                &:nth-of-type(3) {
                    background-color: fade-out($color: #FF6B6B, $amount: 0.92);

                    .dot {
                        background-color: #FF6B6B;
                    }
                }

                &:nth-of-type(4) {
                    background-color: #F9FAFC;

                    .dot {
                        background-color: #4B71EE;
                    }
                }

                .content {
                    font-size: 14px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #19203D;
                    line-height: 22px;
                }

                .input {
                    width: 100%;
                    background: #FFFFFF;
                    border-radius: 4px;
                    border: 1px solid #E0E2E7;
                    font-size: 14px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #19203D;
                }
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
    justify-content: flex-end;
    padding: 0 16px;
    box-sizing: border-box;

    .view {
        width: 100px;
        height: 32px;
        line-height: 32px;
        text-align: center;
        background: #FFFFFF;
        border-radius: 4px;
        border: 1px solid #E0E2E7;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #19203D;
        cursor: pointer;
    }

    .export {
        width: 100px;
        height: 32px;
        line-height: 32px;
        text-align: center;
        background: #FFFFFF;
        border-radius: 4px;
        border: 1px solid #4B71EE;
        margin-left: 16px;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #4B71EE;
    }

}
</style>