<template>
    <div class="detail" style="height: 100%;" v-if="dialogVisible">
        <div class="upper align-center">
            <div class="back" @click="close">
                <img src="../../../assets/composition/icon_back@2x.png" alt="" />
            </div>
            <el-pagination background layout="prev, pager, next" :total="1000" />
        </div>

        <div class="box align-center">
            <div class="left">
                <div class="tab align-center">
                    <el-tabs v-model="state.tabName" @tab-change="tabChange">
                        <el-tab-pane name="照片">
                            <template #label>
                                <div class="custom-tab-label">
                                    照片
                                </div>
                            </template>
                        </el-tab-pane>
                        <el-tab-pane name="原文">
                            <template #label>
                                <div class="custom-tab-label">
                                    原文
                                </div>
                            </template>
                        </el-tab-pane>
                    </el-tabs>
                </div>
                <template v-if="state.tabName === '照片'">
                    <div class="head align-center">
                        <div :class="['img-wrapper', idx === active && 'active']" v-for="(item, idx) in photoList"
                            :key="idx" @click="switchPic(item, idx)">
                            <img :src="item.url" alt="" />
                        </div>
                    </div>
                    <div class="img-box">
                        <img :src="mainPic" alt="" />
                    </div>
                </template>
                <div class="article-box" v-else>
                    <div class="article-box-head align-center">
                        <div class="title-box">
                            <div class="title">《我的母亲》</div>
                            <div class="time">最近修改：2023/4/14 19:00:00</div>
                        </div>
                        <div class="author align-center">
                            <span class="name">{{ '梁可' }}</span>
                            <span class="count">{{ '50' }}字</span>
                        </div>
                    </div>
                    <div class="article-box-words">
                        熊猫不似猫是熊，那为什么要叫大熊猫呢？原来这是它本身学名，意思是像猫一样的熊，当然也符合它自身外貌特征，脸像猫，体型像熊。作为国宝，大熊猫只生长在中国，主要分布在四川、陕西、干肃，并且它们栖息在森林，那里气候潮湿且水资源丰富，最重要的是竹叶管够。

                        那这货怎么就成为国宝了？原来它们已经存在至少几百万年，且数量极少，物以稀为贵嘛。但我认为关键是它真的很可爱很讨人喜欢，并且不是所有的动物都能消化竹子的。再来说说它不为人知的一面，作为国宝，大熊猫只生长在中国，主要分布在四川、陕西、干肃，并且它们栖息在欢，并且不是所有的动物都能消化竹子的。

                        熊猫不似猫是熊，那为什么要叫大熊猫呢？原来这是它本身学名，意思是像猫一样的熊，当然也符合它自身外貌特征，脸像猫，体型像熊。作为国宝，大熊猫只生长在中国，主要分布在四川、陕西、干肃，并且它们栖息在森林，那里气候潮湿且水资源丰富，最重要的是竹叶管够。

                        那这货怎么就成为国宝了？原来它们已经存在至少几百万年，且数量极少，物以稀为贵嘛。但我认为关键是它真的很可爱很讨人喜欢，并且不是所有的动物都能消化竹子的。再来说说它不为人知的一面，作为国宝，大熊猫只生长在中国，主要分布在四川、陕西、干肃，并且它们栖息在欢，并且不是所有的动物都能消化竹子的。

                        熊猫不似猫是熊，那为什么要叫大熊猫呢？原来这是它本身学名，意思是像猫一样的熊，当然也符合它自身外貌特征，脸像猫，体型像熊。作为国宝，大熊猫只生长在中国，主要分布在四川、陕西、干肃，并且它们栖息在森林，那里气候潮湿且水资源丰富，最重要的是竹叶管够。

                        那这货怎么就成为国宝了？原来它们已经存在至少几百万年，且数量极少，物以稀为贵嘛。但我认为关键是它真的很可爱很讨人喜欢，并且不是所有的动物都能消化竹子的。再来说说它不为人知的一面，作为国宝，大熊猫只生长在中国，主要分布在四川、陕西、干肃，并且它们栖息在欢，并且不是所有的动物都能消化竹子的。
                    </div>
                </div>
            </div>
            <div class="right">
                <div class="head">
                    <div class="tit">评价量规</div>
                    <div class="tip">您选择的标签将帮助AI评价的更加精准。若未选择标签，AI将自主判断。</div>
                </div>
                <div class="wrapper">

                    <div class="wrapper-tag">常用</div>
                    <div class="wrapper-item">
                        <div class="wrapper-head align-center">
                            <img src="../../../assets/composition/icon_yuan@2x.png" alt="" />
                            <span>明确的中心</span>
                            <el-tooltip effect="dark" content="由句法上有关连的一组词构成，表达一种主张、疑问、命令、愿望或感叹等。" placement="bottom">
                                <img src="../../../assets/composition/icon_wenhao@2x.png" alt="" />
                            </el-tooltip>
                        </div>
                        <div class="wrapper-box">
                            <div v-for="(item, idx) of 4" class="square">
                                没有明确的主题，缺乏重点
                                <img :src='require(`../../../assets/composition/square${idx}.png`)' alt="" />
                            </div>
                        </div>
                    </div>

                    <div class="wrapper-item">
                        <div class="wrapper-head align-center">
                            <img src="../../../assets/composition/icon_yuan@2x.png" alt="" />
                            <span>明确的中心</span>
                            <el-tooltip effect="dark" content="由句法上有关连的一组词构成，表达一种主张、疑问、命令、愿望或感叹等。" placement="bottom">
                                <img src="../../../assets/composition/icon_wenhao@2x.png" alt="" />
                            </el-tooltip>
                        </div>
                        <div class="wrapper-box">
                            <div v-for="(item, idx) of 4" class="square active">
                                没有明确的主题，缺乏重点
                                <img :src='require(`../../../assets/composition/square${idx}-active.png`)' alt="" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="bottom align-center">
            <div class="continue align-center" @click="selectContinue">
                <img v-if="!state.isContinue" src="../../../assets/composition/icon_unchecked@2x.png" alt="" />
                <img v-else src="../../../assets/composition/icon_checked@2x.png" alt="" />
                继续评价下一篇
            </div>
            <el-button class="view" @click="viewArticle">取消</el-button>
            <el-button color="#4B71EE" @click="exportPDF">生成新报告</el-button>
        </div>
    </div>
</template>
<script setup lang="ts">
import { getOssUrl } from '@/utils/oss';
import { ElMessage } from 'element-plus';
import moment from 'moment';
import { reactive, ref, toRefs } from 'vue';
import { saveAs as FileSaver } from 'file-saver'
import { downloadPDF, editReportDetail, lookNextContent, searchReportDetail } from '../api';

const articleRef = ref()

const dialogVisible = ref(false);

const state = reactive({
    isContinue: false,
    StudentCompositionId: '',
    photoList: [] as any,
    mainPic: '',
    active: 0,
    title: '',
    tabName: '照片',
    author: '',
    stuList: [],
    IsHaveNext: false,
    NextStudentCompositionId: ''
})

const emit = defineEmits(['close', 'save']);

const { photoList, mainPic, active } = toRefs(state)

const selectContinue = ()=>{
    state.isContinue = !state.isContinue
}

const tabChange = (name: any) => {
    state.tabName = name
}

const switchPic = (item: any, idx: number) => {
    state.active = idx
    state.mainPic = item.url
}

// exportPDF
const exportPDF = () => {
    downloadPDF({ StudentCompositionId: state.StudentCompositionId }).then((res: any) => {
        if (res) {
            let blob = new Blob([res], { type: "application/pdf" });
            const filename = state.author + '的评价报告.pdf';
            //直接下载而不预览
            FileSaver.saveAs(blob, filename)
        }
    })
}

// 
const closeArticle = () => {
    articleRef.value.close()
}

// 查看原文
const viewArticle = () => {
    articleRef.value.openDialog({ StudentCompositionId: state.StudentCompositionId })
}

const exeSave = (type: number, info: any, cb?: any) => {
    editReportDetail({ StudentCompositionId: state.StudentCompositionId, SaveType: type, SaveInfo: info }).then(async (res: any) => {
        if (res.success) {
            if (cb) {
                cb()
            }
        }
    })
}

// 关闭
const close = () => {
    state.tabName = '照片'
    dialogVisible.value = false
    emit('close')
}

const openDialog = async (info?: any) => {
    const { StudentCompositionId } = info
    state.StudentCompositionId = StudentCompositionId
    getDetail(StudentCompositionId, false)
}

const getDetail = (id: string, isRequestNext?: boolean) => {
    if (isRequestNext) {
        state.StudentCompositionId = id
    }
    searchReportDetail({ StudentCompositionId: id }).then(async (res: any) => {
        if (res.success) {
            dialogVisible.value = true
        }
    })
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

.article-box {
    height: calc(100% - 46px);
    overflow-y: auto;
    padding: 16px 5px 16px 0;
    box-sizing: border-box;

    .article-box-words {
        width: 100%;
        // height: calc(100% - 90px);
        // overflow: auto;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #19203D;
        line-height: 22px;
        // padding: 18px;
        white-space: pre-wrap;
        border-radius: 4px;
        // border: 1px solid #E0E2E7;
    }

    .article-box-head {
        margin-bottom: 28px;
        // border-bottom: 1px solid fade-out($color: #E0E2E7, $amount: 0.5);
        position: relative;
        justify-content: center;

        .title-box {
            width: fit-content;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .time {
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #A7AAB4;
            margin-top: 8px;
        }

        .title {
            // min-width: 168px;
            // max-width: 300px;
            text-align: center;
            margin-bottom: 6px;
            background: #FFFFFF;
            // border-radius: 4px;
            // border: 1px solid #E0E2E7;
            font-size: 20px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #19203D;
        }

        .author {
            position: absolute;
            right: 0;
            top: 50%;
            transform: translateY(-50%);

            .name {
                font-size: 16px;
                font-family: PingFangSC-Semibold, PingFang SC;
                font-weight: 600;
                color: #A7AAB4;
                padding-right: 12px;
                position: relative;
                border-right: 1px solid #EFF0F3;
            }

            .count {
                margin-left: 12px;
                font-size: 14px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #A7AAB4;
            }
        }
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
        top: 2px;
        padding: 9px;
        cursor: pointer;

        &>img {
            width: 35px;
            height: 35px;
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


:deep(.el-tabs__header) {
    margin: 0;
}

:deep(.el-tabs) {
    width: 100%;
    border-bottom: 1px solid fade-out($color: #E0E2E7, $amount: 0.5);
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
        padding: 0 24px 24px 24px;
        box-sizing: border-box;

        .tab {
            height: 56px;
            justify-content: space-between;
            // margin-bottom: 8px;
            background-color: #fff;
            // padding: 0 16px;
            // box-sizing: border-box;
        }

        .head {
            padding-bottom: 16px;
            // border-bottom: 1px solid fade-out($color: #E0E2E7, $amount: 0.5);

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
            // padding-top: 24px;
            padding-bottom: 30px;
            box-sizing: border-box;
            height: calc(100% - 137px);
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

        .head {
            padding-bottom: 16px;
            border-bottom: 1px solid fade-out($color: #E0E2E7, $amount: 0.5);
            margin-bottom: 15px;

            .tit {
                font-size: 20px;
                font-family: PingFangSC-Semibold, PingFang SC;
                font-weight: 600;
                color: #19203D;
            }

            .tip {
                font-size: 14px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #A7AAB4;
                margin-top: 8px;
            }
        }

        .wrapper {
            .wrapper-tag {
                width: 183px;
                height: 28px;
                line-height: 28px;
                padding-left: 20px;
                box-sizing: border-box;
                background-image: url('../../../assets/composition/pic_title@2x.png');
                background-repeat: no-repeat;
                background-size: 100% 100%;
                font-size: 16px;
                font-family: PingFangSC-Semibold, PingFang SC;
                font-weight: 600;
                color: #3AD393;
            }

            .wrapper-item {
                margin-bottom: 20px;



                .wrapper-box {
                    width: 100%;
                    display: flex;
                    justify-content: space-around;

                    .square {
                        position: relative;
                        width: calc((100% - 51px) / 4);
                        height: 140px;
                        border-radius: 8px;
                        font-size: 12px;
                        font-family: PingFangSC-Regular, PingFang SC;
                        font-weight: 400;
                        color: #19203D;
                        line-height: 20px;
                        display: flex;
                        align-items: center;
                        text-align: center;
                        margin-right: 17px;
                        padding: 13px;
                        box-sizing: border-box;
                        overflow: hidden;

                        &>img {
                            position: absolute;
                            bottom: -12px;
                            right: -5px;
                            width: 59px;
                            height: 59px;
                        }

                        &.active {
                            color: #FFFFFF;
                        }

                        &:nth-of-type(1) {
                            background-color: #F9FAFC;

                            &.active {
                                background-color: #858B9E;
                            }
                        }

                        &:nth-of-type(2) {
                            background-color: #FFF7EE;

                            &.active {
                                background-color: #FFBC68;
                            }
                        }

                        &:nth-of-type(3) {
                            background-color: #F1F4FE;

                            &.active {
                                background-color: #4B71EE;
                            }
                        }

                        &:nth-of-type(4) {
                            background-color: #F0FCF7;

                            &.active {
                                background-color: #3AD393;
                            }
                        }
                    }
                }

                .wrapper-head {
                    margin-top: 16px;
                    margin-bottom: 12px;

                    &>img {
                        &:nth-of-type(1) {
                            width: 8px;
                            height: 8px;
                            margin-right: 8px;
                        }

                        &:nth-of-type(2) {
                            width: 14px;
                            height: 14px;
                            margin-left: 8px;
                        }
                    }

                    &>span {
                        font-size: 16px;
                        font-family: PingFangSC-Semibold, PingFang SC;
                        font-weight: 600;
                        color: #19203D;
                    }
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

    .continue {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #19203D;
        margin-right: 32px;
        cursor: pointer;

        &>img {
            width: 16px;
            height: 16px;
            margin-right: 8px;
        }
    }

    .view {
        // width: 100px;
        height: 32px;
        line-height: 32px;
        text-align: center;
        background: #FFFFFF;
        border-radius: 4px;
        border: 1px solid #E0E2E7;
        // font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #19203D;
        // cursor: pointer;

        &:hover {
            background: #FFFFFF !important;
            color: #19203D !important;
        }
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