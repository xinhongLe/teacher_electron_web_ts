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
                <p class="custitle-pure">
                    <span class="text">正在查看同类题</span>
                    <!-- 错题本添加试题篮 -->
                    <span
                        class="btns"
                        v-if="isshowbasket && currentPureQuestion"
                    >
                        <el-button
                            v-if="formatInBasket(currentPureQuestion)"
                            type="primary"
                            @click.stop="addQuestionBasket(currentPureQuestion)"
                            icon="el-icon-plus"
                            size="small"
                            >添加试题篮</el-button
                        >
                        <el-button
                            v-else
                            type="danger"
                            @click.stop="delQuestionBasket(currentPureQuestion)"
                            icon="el-icon-minus"
                            size="small"
                            >移出试题篮</el-button
                        >
                    </span>
                </p>
            </template>
            <Question
                :resource="resource"
                :close="close"
                :isPureQuestion="true"
                :dialog="true"
            />
        </el-dialog>
    </div>
</template>

<script lang="ts">
import { defineComponent, nextTick, ref, computed, watch } from "vue";
import Question from "./Question.vue";
import useWrongBook from "@/views/wrongbook/hooks/useWrongBook";
import { MutationTypes, store, ActionTypes } from "@/store";

const { formatInBasket, addQuestionBasket, delQuestionBasket } = useWrongBook();
export default defineComponent({
    props: {
        visible: {
            type: Boolean,
            default: false,
        },

        resource: {
            type: Object,
            required: true,
        },
        currentquestion: {
            type: Object,
            default: () => {},
        },
        isshowbasket: {
            type: Boolean,
            default: false,
        },
    },
    setup(props, { emit }) {
        const currentPureQuestion = ref(null);
        watch(
            () => store.state.wrongbook.currentPureQuestion,
            (val) => {
                currentPureQuestion.value = val;
            },
            { deep: true }
        );
        setTimeout(() => {
            currentPureQuestion.value =
                store.state.wrongbook.currentPureQuestion;
        }, 300);
        const isShowDialog = ref(true);
        const close = () => {
            isShowDialog.value = false;
            nextTick(() => {
                emit("update:visible", false);
            });
        };
        return {
            close,
            isShowDialog,
            formatInBasket,
            addQuestionBasket,
            delQuestionBasket,
            store,
            currentPureQuestion,
        };
    },
    components: { Question },
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
            .custitle-pure {
                overflow: hidden;
                text-align: center;
                .text {
                    font-size: 18px;
                    color: #19203d;
                    font-weight: bold;
                }
                .btns {
                    float: right;
                }
            }
        }
    }
    :deep(.el-dialog__body) {
        height: 90vh;
    }
}
</style>
