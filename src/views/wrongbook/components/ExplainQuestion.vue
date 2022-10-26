<template>
    <div class="container">
        <el-dialog
            :model-value="visible"
            center
            v-if="isShowDialog"
            :before-close="close"
            :show-close="false"
        >
            <template #title>
                <p class="custitle">
                    <span></span>
                    <span class="text">讲解题目</span>
                    <el-button
                        v-if="formatInBasket(currentquestion)"
                        type="primary"
                        @click.stop="addQuestionBasket"
                        icon="el-icon-plus"
                        size="small"
                        >添加试题篮</el-button
                    >
                    <el-button
                        v-else
                        type="danger"
                        @click.stop="delQuestionBasket"
                        icon="el-icon-minus"
                        size="small"
                        >移出试题篮</el-button
                    >
                </p>
            </template>
            <!-- <Question :close="close" :isPureQuestion="false" /> -->
            <LookQuestion
                v-if="visible"
                :dialog="true"
                :close="close"
                :resource="resource"
            />
        </el-dialog>
    </div>
</template>

<script lang="ts">
import { defineComponent, nextTick, ref, PropType } from "vue";
import LookQuestion from "@/components/lookQuestion/index.vue";
import Question from "@/components/lookQuestion/Question.vue";
import { IViewResourceData } from "@/types/store";
import { MutationTypes, store, ActionTypes } from "@/store";
import useWrongBook from "../hooks/useWrongBook";
const { formatInBasket } = useWrongBook();
export default defineComponent({
    props: {
        visible: {
            type: Boolean,
            default: false,
        },
        resource: {
            type: Object as PropType<IViewResourceData>,
            required: true,
        },
        currentquestion: {
            type: Object,
            default: () => {},
        },
    },
    setup(props, { emit }) {
        const isShowDialog = ref(true);

        const close = () => {
            isShowDialog.value = false;
            nextTick(() => {
                emit("update:visible", false);
            });
        };
        //添加试题篮
        const addQuestionBasket = () => {
            const data: any = props.currentquestion;
            const params = {
                questions: [
                    {
                        questionId: data.QuestionId,
                        questionType: data.QuestionType,
                    },
                ],
                classId: store.state.wrongbook.currentClassId,
                bookId: store.state.wrongbook.currentBookId,
            };
            store.dispatch(ActionTypes.ADD_QUESTION_BASKET, params);
        };
        //移出试题篮
        //移出一条试题篮
        const delQuestionBasket = () => {
            // console.log("当前错题行数据", data);
            const data: any = props.currentquestion;
            const params = {
                isAllDel: 0,
                classId: store.state.wrongbook.currentClassId,
                bookId: store.state.wrongbook.currentBookId,
                questionIds: [data.QuestionId],
                questionType: data.QuestionType,
            };
            store.dispatch(ActionTypes.DEL_QUESTION_BASKET, params);
        };

        return {
            close,
            isShowDialog,
            addQuestionBasket,
            formatInBasket,
            delQuestionBasket,
        };
    },
    components: { Question, LookQuestion },
});
</script>

<style lang="scss" scoped>
.container {
    :deep(.el-dialog) {
        --el-dialog-width: 90%;
        margin: 0 auto;
        top: 50%;
        transform: translateY(-50%);
        .el-dialog__header {
            .custitle {
                display: flex;
                justify-content: space-between;
                align-items: center;
                .text {
                    font-size: 16px;
                    color: #19203d;
                    font-weight: bold;
                }
            }
        }
    }
    :deep(.el-dialog__body) {
        height: 90vh;
        padding: 0;
    }
}
</style>
