<template>
    <div class="container">
        <el-dialog
            :model-value="props.visible"
            title="本题历史"
            center
            :before-close="close"
        >
            <div class="error-history">
                <div class="history-title">
                    <h3>求倍数的错题巩固训练</h3>
                    <div class="error-icons">
                        <div class="bg-line"></div>
                        <div class="erroricon">
                            <div class="icons">
                                <div
                                    class="icon-text"
                                    v-for="item in state.errorHistoryList"
                                    :key="item.id"
                                >
                                    <img
                                        src="~@/assets/images/wrongbook/icon_cuo.png"
                                        alt=""
                                    />
                                    <p>{{ item.date }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script setup lang="ts">
import { ref, defineProps, reactive, nextTick, defineEmits } from "vue";

const props = defineProps({
    visible: {
        type: Boolean,
        default: false,
    },
});
const emit = defineEmits(["update:visible"]);
const state = reactive({
    errorHistoryList: [
        {
            id: 1,
            date: "08-27",
        },
        {
            id: 2,
            date: "08-28",
        },
        {
            id: 3,
            date: "08-29",
        },
        {
            id: 4,
            date: "08-30",
        },
        {
            id: 5,
            date: "08-31",
        },
        {
            id: 6,
            date: "08-32",
        },
    ],
});
//关闭弹框
const close = () => {
    nextTick(() => {
        emit("update:visible", false);
    });
};
</script>
<style scoped lang="scss">
.container {
    .error-history {
        .history-title {
            padding: 0 10%;
            h3 {
                font-size: 14px;
                font-family: HarmonyOS_Sans_SC;
                color: #19203d;
            }
            .error-icons {
                padding: 5rem 2.3rem;
                position: relative;
                .bg-line {
                    width: 100%;
                    height: 8px;
                    background: #ebf9fa;
                    border-radius: 7px;
                }
                .erroricon {
                    position: absolute;
                    top: 34px;
                    left: 0;
                    width: 100%;
                    .icons {
                        width: 100%;
                        display: flex;
                        justify-content: space-around;
                        padding: 0 6%;
                        // overflow-x: scroll;
                        .icon-text {
                            p {
                                margin-top: 7px;
                            }
                        }
                    }
                }
            }
        }
    }
    :deep(.el-dialog) {
        --el-dialog-width: 60%;
        margin: 0 auto;
        top: 6%;
        // transform: translateY(-50%);
    }
    :deep(.el-dialog__header) {
        padding: 16px;
        border-bottom: 1px solid #f3f4f4;
        .el-dialog__title {
            color: #19203d;
            font-weight: 600;
        }
        .el-dialog__headerbtn .el-dialog__close {
            font-size: 20px;
            color: #bdc4cf;
        }
    }
    :deep(.el-dialog__body) {
        height: 82vh;
        overflow: auto;
    }
}
</style>
