<template>
    <el-dialog custom-class="delete-dialog" v-model="dialogVisible" title="提示" width="420px" center
               :close-on-click-modal="false">
        <div class="toast-content">
            <slot name="icon"></slot>
            <p style="white-space: pre-wrap;">{{ msg }}</p>
        </div>
        <template #footer>
            <el-button style="width: 120px;" @click="handleClose">
                {{ cancelText }}
            </el-button>
            <el-button style="width: 120px;" :type="backText === '删除' ? 'danger' : 'primary'" @click="returnClick">
                {{ backText }}
            </el-button>
        </template>
    </el-dialog>
</template>

<script>
import {defineComponent, ref, getCurrentInstance, watch} from "vue-demi";

export default defineComponent({
    props: {
        msg: {
            type: String,
            default: () => {
                return "确认删除？";
            }
        },
        cancelText: {
            type: String,
            default: () => {
                return "取消";
            }
        },
        backText: {
            type: String,
            default: () => {
                return "删除";
            }
        }
    },
    setup(props, {emit}) {
        // const { proxy } = getCurrentInstance() as any;
        const dialogVisible = ref(false);
        const info = ref();
        const openDialog = (row = null) => {
            info.value = row;
            dialogVisible.value = true;
        };
        const handleClose = () => {
            info.value = null;
            dialogVisible.value = false;
            emit("cancel");
        };
        const returnClick = () => {
            dialogVisible.value = false;
            emit("confirm", info.value);
            info.value = null;
        }
        return {
            dialogVisible,
            openDialog,
            handleClose,
            returnClick
        }
    }
});
</script>

<style lang="scss" scoped>
:deep(.delete-dialog, .el-dialog) {
    box-shadow: 0px 8px 24px 0px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    max-height: 820px;
    overflow: hidden;

    .el-dialog__header {
        font-size: 18px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #0D0B22;
        border-bottom: 1px solid #F3F5F6;
        line-height: 48px;
        padding: 0;
    }
}

:deep(.el-dialog__headerbtn) {
    top: 15px !important;
    height: 25px;
}

.toast-content {
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #242B3A;
    text-align: center;
    margin: 20px;
    margin-bottom: 30px;
    display: flex;
    align-items: center;

    img {
        margin-bottom: 20px;
    }

    p {
        line-height: 24px;
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #242B3A;
    }

    p:nth-of-type(2) {
        margin-bottom: 20px;
    }
}

.footer {
    display: flex;
    text-align: center;
    justify-content: center;

    .cancel {
        width: 140px;
        height: 48px;
        background: #FFFFFF;
        border-radius: 2px;
        border: 1px solid #D9D9D9;
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #242B3A;
        line-height: 48px;
        margin-right: 24px;
        cursor: pointer;
    }

    .back {
        width: 140px;
        height: 48px;
        background: #F64949;
        border-radius: 2px;
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #FFFFFF;
        line-height: 48px;
        cursor: pointer;
    }

    .confirm {
        width: 140px;
        height: 48px;
        background: #0057FE;
        border-radius: 2px;
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #FFFFFF;
        line-height: 48px;
        cursor: pointer;
    }
}</style>
