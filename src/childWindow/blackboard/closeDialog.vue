<template>
    <div class="close-dialog-warp">
        <div class="close-content-warp">
            <div class="close-btn" @click="close">
                <el-icon :size="12" color="#9C9FAA"><close/></el-icon>
            </div>
            <img src="./ico/pic_xiaojianjian.svg" alt="" class="pic">
            <div class="content-warp">
                <div class="title">确定关闭黑板吗？</div>
                <div class="check-warp" @click="isSave = !isSave">
                    <span class="check-btn" :class="{check: isSave}"></span>
                    <span class="label">保存本次笔记</span>
                </div>
                <div class="btn-warp">
                    <span class="btn" @click="close">取消</span>
                    <span class="btn" @click="save">关闭</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
export default defineComponent({
    setup(props, { emit }) {
        const isSave = ref(true);
        const close = () => {
            emit("update:isShowCloseDialog", false);
        };
        const save = () => {
            if (isSave.value) {
                return emit("saveBoardList");
            }
            window.electron.destroyWindow();
        };
        return	{
            close,
            save,
            isSave
        };
    }
});
</script>

<style lang="scss" scoped>
.close-dialog-warp {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.4);
    .close-content-warp {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 476px;
        height: 252px;
        border-radius: 8px;
        background-color: #fff;
        box-shadow: 0px 6px 16px -8px rgba(0, 0, 0, 0.12), 0px 9px 28px 0px rgba(0, 0, 0, 0.08), 0px 12px 48px 16px rgba(0, 0, 0, 0.05);
        display: flex;
        align-items: center;
        padding-left: 30px;
        .content-warp {
            margin-left: 30px;
            .title {
                font-size: 20px;
                font-weight: 500;
                color: #19203D;
                line-height: 32px;
            }
            .check-warp {
                display: flex;
                margin: 8px 0 16px;
                align-items: center;
                .check-btn {
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    border: 1px solid rgba(75, 113, 238, 0.5);
                    margin-right: 4px;
                    position: relative;
                    &.check::before {
                        content: "";
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        width: 10px;
                        height: 10px;
                        background: #4B71EE;
                        border-radius: 50%;
                    }
                }
                .label {
                    font-size: 14px;
                    font-weight: 400;
                    color: #A5ACC8;
                }
            }
            .btn-warp {
                display: flex;
                .btn {
                    height: 36px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border-radius: 4px;
                    font-size: 16px;
                    cursor: pointer;
                    &:first-child {
                        width: 80px;
                        border: 1px solid #E0E2E7;
                        background: #FFFFFF;
                        color: #19203D;
                    }
                    &:last-child {
                        width: 120px;
                        background: #4B71EE;
                        color: #FFFFFF;
                        margin-left: 24px;
                    }
                }
            }
        }
        .close-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            position: absolute;
            right: 16px;
            top: 16px;
            width: 30px;
            border-radius: 50%;
            height: 30px;
            background-color: #F6F6FA;
            cursor: pointer;
        }
        .pic {
            width: 130px;
            height: 130px;
        }
    }
}
</style>
