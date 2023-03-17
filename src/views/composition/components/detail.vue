<template>
    <div class="detail" style="height: 100%;" v-if="dialogVisible">
        <div class="upper align-center">
            <div class="back" @click="close">
                <img src="../../../assets/composition/icon_back@2x.png" alt="" />
            </div>
            <el-pagination background layout="prev, pager, next" :total="1000" />
            <div class="top">查看下一篇</div>
        </div>

        <div class="box align-center">
            <div class="left">
                <div class="head align-center">
                    <div class="img-wrapper active">
                        <img src="../../../assets/composition/banner.jpg" alt="" />
                    </div>
                    <div class="img-wrapper">
                        <img src="../../../assets/composition/555.jpg" alt="" />
                    </div>
                    <div class="img-wrapper">
                        <img src="../../../assets/composition/banner.jpg" alt="" />
                    </div>
                </div>
                <div class="img-box">
                    <img src="../../../assets/composition/banner.jpg" alt="" />
                </div>
            </div>
            <div class="right">
                <div class="head align-center">
                    <span>梁可的评价报告</span>
                    <div class="round">
                        <!-- const value = 43
                        const angle = -135 + (value / 100) * 180
                        progress.style.transform = `rotate(${angle}deg)` -->
                        <div class="block" style="transform: rotate(-135 + (80 / 100) * 180);"></div>
                        <p>
                            <span class="score">80</span>
                            <span class="tip">良好</span>
                        </p>
                    </div>
                    <!-- 编辑 -->
                    <el-popover :visible="popoverVisible" placement="top" :width="160">
                        <div class="align-center">
                            <el-input v-model="score" />
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
                            <img class="edit" @click="state.popoverVisible = true"
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
            <div class="export" @click="save">导出为pdf</div>
        </div>
    </div>
    <!-- 查看原文 -->
    <Article ref="articleRef" />
</template>
<script setup lang="ts">
import { reactive, ref, toRefs } from 'vue';
import Article from './article.vue';

const articleRef = ref()

const dialogVisible = ref(false);

const state = reactive({
    popoverVisible: false,
    gradeList: [{
        label: '全部',
        value: 0
    }],
    assess: 1,
    score: 60,
    assessList: [
        {
            name: '良好',
            value: 1
        }
    ],
    lineList: [
        {
            title: '综合点评',
            status: 0,
            content: '文章很有趣，你观察到了大熊猫的特征，并且用有趣的方式将它们描述出来。你还提到了它们之所以被称之为国宝，以及它们被人们喜爱的原因，这很有价值。'
        },
        {
            title: '优点',
            status: 0,
            content: '文章很有趣，你观察到了大熊猫的特征，并且用有趣的方式将它们描述出来。你还提到了它们之所以被称之为国宝，以及它们被人们喜爱的原因，这很有价值。'
        }, {
            title: '不足',
            status: 0,
            content: '文章很有趣，你观察到了大熊猫的特征，并且用有趣的方式将它们描述出来。你还提到了它们之所以被称之为国宝，以及它们被人们喜爱的原因，这很有价值。'
        }, {
            title: '改进建议',
            status: 0,
            content: '文章很有趣，你观察到了大熊猫的特征，并且用有趣的方式将它们描述出来。你还提到了它们之所以被称之为国宝，以及它们被人们喜爱的原因，这很有价值。'
        }
    ],
    grade: null,
    title: '我的母亲',
    stuList: []
})

const emit = defineEmits(['close', 'save']);

const { gradeList, score, grade, stuList, title, lineList, assessList, assess, popoverVisible } = toRefs(state)

// 查看原文
const viewArticle = ()=>{
    articleRef.value.openDialog()
}

// 保存分数
const saveScore = () => {
    state.popoverVisible = false
}

// 失去焦点
const inputBlur = (idx: number) => {
    console.log('idx:', idx);

    state.lineList[idx]['status'] = 0

}

// 编辑行
const editLine = (item: any, idx: number) => {
    state.lineList[idx]['status'] = 1
}

// 保存
const save = () => {

}

// 关闭
const close = () => {
    dialogVisible.value = false
    emit('close')
}

const openDialog = async (info?: any) => {
    dialogVisible.value = true
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