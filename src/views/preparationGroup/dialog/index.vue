<template>
    <div class="dialog-box">
        <el-dialog
            :title="title"
            v-model="isShowDialog"
            :width="width"
            :before-close="handleClose"
            :close-on-click-modal="false"
            center
            destroy-on-close
        >
            <div class="dialog-container">
                <img src="../../../assets/preparationGroup/icon_tips_popup.png"/>
                <span>{{ msg }}</span>
            </div>
            <div class="dialog-footer">
                <div class="cancel" @click="handleClose">取 消</div>
                <div class="confirm" :loading="loading" type="primary" @click="submit">{{ confirmBtnText }}</div>
            </div>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import { getCurrentInstance, toRefs, reactive, defineComponent } from "vue";
export default defineComponent({
    name: "deleteConfirm",
    props: {
        title: {
            type: String,
            default: () => {
                return "确认删除";
            }
        },
        msg: {
            type: String,
            default: () => {
                return "是否删除此内容？";
            }
        },
        width: {
            type: String,
            default: () => {
                return "476px";
            }
        },
        confirmBtnText: {
            type: String,
            default: () => {
                return "删除";
            }
        },
        deleteResource: {
            type: Function,
            default: null
        }
    },
    setup() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { proxy } = getCurrentInstance() as any;
        const state = reactive({
            isShowDialog: false,
            loading: false
        });

        // 打开弹窗
        const openDialog = () => {
            state.isShowDialog = true;
        };

        const submit = () => {
            proxy.deleteResource();
            handleClose();
        };

        const handleClose = () => {
            state.isShowDialog = false;
        };

        return {
            openDialog,
            submit,
            handleClose,
            ...toRefs(state)
        };
    }
});
</script>

<style scoped lang="scss">
.dialog-box {
    :deep(.el-dialog) {
        box-shadow: 0px 8px 24px 0px rgba(0, 0, 0, 0.5);
        border-radius: 8px;
        width: 500px;
        height: 220px;
        overflow: hidden;
        .el-dialog__header {
            font-size: 18px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #0D0B22;
        }
        .el-dialog__body {
            min-height: 173px;
            height: auto;
            padding: 0;
            .dialog-container {
                display: flex;
                align-items: center;
                justify-content: left;
                margin: 20px 15px 0 30px;
                img {
                    width: 40px;
                    height: 40px;
                    margin-right: 24px;
                }
                span {
                    font-size: 20px;
                    font-weight: 600;
                    color: #212743;
                }
            }
            .dialog-footer {
                position: absolute;
                bottom: 20px;
                right: 20px;
                .cancel {
                    display: inline-block;
                    width: 100px;
                    height: 40px;
                    line-height: 40px;
                    text-align: center;
                    background: #FFFFFF;
                    border-radius: 6px;
                    border: 1px solid #E7E7E9;
                    font-size: 14px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #0D0B22;
                    margin-left: 20px;
                    &:hover {
                        cursor: pointer;
                        border: 1px solid #008DFF;
                    }
                }
                .confirm {
                    display: inline-block;
                    width: 120px;
                    height: 40px;
                    line-height: 40px;
                    text-align: center;
                    background: #FF6B6B;
                    border-radius: 6px;
                    font-size: 14px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #FFFFFF;
                    margin-left: 20px;
                    &:hover {
                        cursor: pointer;
                    }
                }
            }
        }
    }
}
</style>
