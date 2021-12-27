<template>
    <el-dialog
        v-model="dialogVisible"
        title="集体备课小组邀请"
        width="600px"
        :before-close="handleClose"
        center
    >
        <template #title>
            <span class="dialog-header">集体备课小组邀请</span>
        </template>
        <div class="dialog-classinfo auto">第三单元 <span>长方形和正方形</span></div>
        <div class="dialog-teachinfo auto">某某邀请您参加集体备课</div>
        <div class="dialog-timeinfo auto">创建时间：2021/12/12 12:30</div>
        <div class="dialog-linkinfo auto">
            <span class="icon"><i class="el-icon-paperclip"></i></span>
            <span class="link">https://alidocs.dingtalk.com/i/team/OlnXhttps://alidocs.dingtalk.com/i/team/OlnX</span>
        </div>
        <div class="dialog-tipinfo auto">请用电脑端登陆【爱学仕】系统，再点击以上链接加入集体备课</div>
        <template #footer>
            <span class="dialog-footer">
                <el-button style="background-color:#4B71EE;color:#fff;" icon="el-icon-copy-document">复制邀请链接</el-button>
                <el-button style="background-color:#48DBBF;color:#fff;">复制成功</el-button>
            </span>
        </template>
    </el-dialog>
</template>
<script>
import { defineComponent, ref } from "vue";
export default defineComponent({
    setup() {
        const dialogVisible = ref(false);
        const handleClose = () => {
            dialogVisible.value = false;
        };
        return {
            dialogVisible,
            handleClose
        };
    }
});
</script>
<style lang="scss" scoped>
    .dialog-header{
        font-size: 20px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #19203D;
    }
    .auto{
        margin: 0 auto;
        text-align: center;
    }
    .dialog-classinfo{
        font-size: 20px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #19203D;
        margin-bottom: 16px;
    }
    .dialog-teachinfo{
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #19203D;
        margin-bottom: 10px;
    }
    .dialog-timeinfo{
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #5F626F;
        margin-bottom: 32px;
    }
    .dialog-linkinfo{
        width: 380px;
        height: 48px;
        background: #F5F6F9;
        border-radius: 4px;
        border: 1px solid #E0E2E7;
        display: flex;
        margin-bottom: 12px;
        .icon{
            width: 48px;
            height: 48px;
            display: flex;
            justify-content: space-around;
            align-items: center;
            font-size: 20px;
        }
        .link{
            display: flex;
            align-items: center;
            flex: 1;
            min-width: 0;
            justify-content: center;
        }
    }
    .dialog-tipinfo{
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #A7AAB4;
    }
</style>
