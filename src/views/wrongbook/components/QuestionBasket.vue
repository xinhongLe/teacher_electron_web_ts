<template>
    <div
        class="basket-dialog"
        draggable="true"
        @dragstart="dragstart($event)"
        @dragend="dragend($event)"
    >
        <el-badge
            v-if="isSmallBasket"
            :style="`right:${elRight}px;bottom:${elBottom}px`"
            :value="store.state.wrongbook.baskTotal"
            class="question-basket"
        >
            <div @click="isSmallBasket = false">
                <div class="basket">
                    <div class="images">
                        <img
                            src="~@/assets/images/wrongbook/icon_shitilan.png"
                            alt=""
                        />
                    </div>
                    <span class="text">试题篮</span>
                </div>
            </div>
        </el-badge>
        <div
            v-else
            class="question-large-basket"
            :style="`right:${elRight}px;bottom:${elBottom}px`"
        >
            <div class="basket-title">
                <div></div>
                <div class="titles">
                    <img
                        class="basket-img"
                        src="~@/assets/images/wrongbook/icon_shitilan.png"
                        alt=""
                    />
                    <span>试题篮</span>
                </div>
                <div
                    style="height: 100%; display: flex; align-items: center"
                    @click="isSmallBasket = true"
                >
                    <img
                        class="small-icon"
                        src="~@/assets/images/wrongbook/icon_zuixiaohua.png"
                        alt=""
                    />
                </div>
            </div>
            <div class="basket-con">
                <div class="con-title">
                    <div class="count">
                        共计<span>{{ store.state.wrongbook.baskTotal }}</span>
                        道题
                    </div>
                    <div class="clear" @click.stop="clearAll">清空</div>
                </div>
                <div class="title-line"></div>
                <div class="con-list" v-if="basketData?.length">
                    <div
                        class="list-item"
                        v-for="(item, index) in basketData"
                        :key="index"
                    >
                        <div class="item-left">
                            <div class="que-type">
                                {{ formatQuestionType(item.QuestionType) }}
                            </div>
                            <div class="que-count">{{ item.Count }}道</div>
                        </div>
                        <img
                            @click="delBasketQuestion(item)"
                            src="~@/assets/images/wrongbook/icon_delete.png"
                            class="del-btn"
                        />
                    </div>
                </div>
                <div class="con-list" v-else>这里空空如也</div>
                <div class="footer-btn" @click="generateExercise">生成练习</div>
            </div>
        </div>
    </div>
    <!-- 清空提示 -->
    <el-dialog
        v-model="dialogVisible"
        :show-close="false"
        width="360px"
        :append-to-body="true"
        custom-class="cus-basket-dialog"
    >
        <template #title>
            <span></span>
            <span class="my-header">提示</span>
            <span @click="dialogVisible = false">
                <img
                    src="~@/assets/images/wrongbook/icon_close_popup_gray.png"
                    alt=""
                />
            </span>
        </template>
        <div class="dialog-content">
            <img src="~@/assets/images/wrongbook/icon_tips_popup.png" alt="" />
            <span>是否确认清空题目</span>
        </div>
        <div class="dialog-footers">
            <div class="cobtn calcBtn" @click="dialogVisible = false">取消</div>
            <div
                class="cobtn sureBtn"
                @click="
                    delAllBasketData();
                    dialogVisible = false;
                "
            >
                确定清空
            </div>
        </div>
    </el-dialog>
    <!-- 删除提示 -->
    <!-- 删除提示 -->
    <el-dialog
        v-model="delDialogVisible"
        :show-close="false"
        width="360px"
        custom-class="homeworkDialog"
    >
        <template #title>
            <span></span>
            <span class="my-header">删除提示</span>
            <span @click="delDialogVisible = false">
                <img
                    src="~@/assets/images/wrongbook/icon_close_popup_gray.png"
                    alt=""
                />
            </span>
        </template>
        <div class="dialog-content" style="background-color: #fff">
            <img src="~@/assets/images/wrongbook/icon_tips_popup.png" alt="" />
            <span>是否删除所有该题型下的题目</span>
        </div>
        <div class="dialog-footers">
            <div class="cobtn calcBtn" @click="delDialogVisible = false">
                取消
            </div>
            <div class="cobtn sureBtn" @click="sureDelExerciseData">
                确定删除
            </div>
        </div>
    </el-dialog>
</template>
<script lang="ts" setup>
import { ref, watch, defineEmits, defineProps, computed } from "vue";
import { MutationTypes, store, ActionTypes } from "@/store";
import useWrongBook from "../hooks/useWrongBook";
const { formatQuestionType, delAllBasketData } = useWrongBook();
const emit = defineEmits(["update:isShowContent", "basketGenerateExercise"]);
const props = defineProps({
    isShowContent: {
        type: Number,
        default: 0,
    },
});

const isSmallBasket = ref(true); //是否是最小化的试题篮
const dialogVisible = ref(false); //是否清空题目？
const delDialogVisible = ref(false); //删除某道题的提示
//将要删除的题信息
const delExerciseData = ref<any>({});
//清空试题栏所有的试题
const clearAll = () => {
    if (store.state.wrongbook.baskTotal == 0) return;
    dialogVisible.value = true;
};
const basketData = computed(() => {
    return store.state.wrongbook.questionBasket;
});
//生成练习
const generateExercise = () => {
    if (store.state.wrongbook.baskTotal == 0) return;
    emit("update:isShowContent", 3);
    // const exerciseParams = {
    //     PaperName: store.state.wrongbook.currentPaperName,
    //     BasketPaperQuestions: basketData.value,
    // };
    emit("basketGenerateExercise", props.isShowContent);
};

//删除一条试题栏中的数据
const delBasketQuestion = async (data: any) => {
    delExerciseData.value = data;
    delDialogVisible.value = true;
};
//确认删除试题篮中的某一块
const sureDelExerciseData = async () => {
    const params = {
        isAllDel: 0,
        classId: store.state.wrongbook.currentClassId,
        bookId: store.state.wrongbook.currentBookId,
        questionIds: delExerciseData.value?.Questions.map(
            (item: any) => item.QuestionId
        ),
        questionType: delExerciseData.value?.QuestionType,
    };
    await store.dispatch(ActionTypes.DEL_QUESTION_BASKET, params);
    delDialogVisible.value = false;
};
const startclientX = ref(0);
const startclientY = ref(0);
const elRight = ref(50);
const elBottom = ref(70);
// 拖拽开始事件
const dragstart = (e: any) => {
    startclientX.value = e.clientX; // 记录拖拽元素初始位置
    startclientY.value = e.clientY;
};
// 拖拽完成事件
const dragend = (e: any) => {
    console.log("eeeeee", e);
    let x = startclientX.value - e.clientX; // 计算偏移量
    let y = startclientY.value - e.clientY;
    elRight.value += x; // 实现拖拽元素随偏移量移动
    elBottom.value += y;
};
</script>
<style lang="scss" scoped>
.basket-dialog {
    z-index: 999999;
    .question-basket {
        cursor: pointer;
        position: absolute;
        bottom: 70px;
        right: 50px;
        width: 158px;
        height: 46px;
        background: #242b3a;
        box-shadow: 0px 6px 16px -8px rgba(0, 0, 0, 0.08),
            0px 9px 28px 0px rgba(0, 0, 0, 0.05),
            0px 12px 48px 16px rgba(0, 0, 0, 0.03);
        border-radius: 23px;
        .basket {
            display: flex;
            /* align-items: center; */
            justify-content: space-around;
            padding: 10px 20px;
            .images {
                position: relative;
                bottom: 27px;
            }
            .text {
                position: relative;
                top: 3px;
                font-size: 15px;
                font-family: HarmonyOS_Sans_SC_Medium;
                color: #ffffff;
            }
        }
        :deep(.el-badge__content.is-fixed) {
            top: 0px;
            right: calc(10px + var(--el-badge-size) / 2);
        }
    }
    .question-large-basket {
        position: absolute;
        bottom: 70px;
        right: 50px;
        width: 276px;
        height: 393px;
        background: #242b3a;
        box-shadow: 0px 6px 16px -8px rgba(0, 0, 0, 0.08),
            0px 9px 28px 0px rgba(0, 0, 0, 0.05),
            0px 12px 48px 16px rgba(0, 0, 0, 0.03);
        border-radius: 8px;
        .basket-title {
            cursor: pointer;
            width: 100%;
            height: 48px;
            background: #2f3544;
            border-radius: 8px 8px 0px 0px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 20px;
            .titles {
                display: flex;
                align-items: center;
                .basket-img {
                    width: 22px;
                }
                span {
                    padding-left: 10px;
                    font-size: 15px;
                    font-family: HarmonyOS_Sans_SC_Bold;
                    color: #ffffff;
                }
            }
            .small-icon {
                cursor: pointer;
            }
        }
        .basket-con {
            padding: 16px;
            .con-title {
                display: flex;
                justify-content: space-between;
                font-size: 14px;
                .count {
                    font-family: HarmonyOS_Sans_SC;
                    color: rgba(255, 255, 255, 0.5);
                    span {
                        padding: 0 5px;
                        color: #ffffff;
                    }
                }
                .clear {
                    cursor: pointer;
                    color: #ff6b6b;
                }
            }
            .title-line {
                width: 100%;
                height: 1px;
                background: #ffffff;
                opacity: 0.1;
                margin: 16px 0;
            }
            .con-list {
                height: 234px;
                width: 100%;
                overflow: auto;
                .list-item {
                    color: #ffffff;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 13px;
                    .item-left {
                        display: flex;
                        align-items: center;
                        .que-count {
                            margin-left: 12px;
                        }
                    }
                    .del-btn {
                        cursor: pointer;
                    }
                }
            }
            .footer-btn {
                width: 100px;
                height: 32px;
                background: #4a70ed;
                border-radius: 4px;
                margin: auto;
                line-height: 32px;
                text-align: center;
                font-size: 14px;
                font-family: HarmonyOS_Sans_SC;
                color: #ffffff;
                cursor: pointer;
            }
        }
    }
}
</style>
<style lang="scss">
.cus-basket-dialog {
    border-radius: 8px;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    height: 245px;
    .el-dialog__header {
        padding: 15px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #f5f6fa;
        img {
            cursor: pointer;
        }
        .my-header {
            text-align: center;
            font-size: 16px;
            font-family: HarmonyOS_Sans_SC_Bold;
            color: #19203d;
            font-weight: 600;
        }
    }
    .el-dialog__body {
        .dialog-content {
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            font-family: HarmonyOS_Sans_SC_Medium;
            color: #212743;
            font-weight: 600;
            img {
                padding-right: 24px;
            }
        }
        .dialog-footers {
            margin-top: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            .cobtn {
                padding: 8px 20px;
                font-size: 12px;
                border-radius: 4px;
                border: 1px solid #e0e2e7;
                font-size: 12px;
                font-family: HarmonyOS_Sans_SC;
                cursor: pointer;
            }
            .calcBtn {
                background: #ffffff;
            }
            .sureBtn {
                margin-left: 16px;
                background: #ff6b6b;
                color: #ffffff;
            }
        }
    }
}
</style>
