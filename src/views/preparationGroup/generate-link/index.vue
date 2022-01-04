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
        <div class="dialog-classinfo auto">{{ currentItem.PreTitle }}</div>
        <div class="dialog-teachinfo auto">{{ currentItem.CreaterName }}邀请您参加集体备课</div>
        <div class="dialog-timeinfo auto">创建时间：{{ moment(currentItem.CreateTime).format("YYYY-MM-DD HH:mm:ss") }}</div>
        <div class="dialog-linkinfo auto">
            <span class="icon"><i class="el-icon-paperclip"></i></span>
            <span class="link ellipsis">{{ `${url}` }}</span>
        </div>
        <div class="dialog-tipinfo auto">请用电脑端登陆【爱学仕】系统，再点击以上链接加入集体备课</div>
        <template #footer>
            <span class="dialog-footer">
                <el-button style="background-color:#48DBBF;color:#fff;border: none;" v-if="isCopy" @click="dialogVisible = false">复制成功</el-button>
                <el-button style="background-color:#4B71EE;color:#fff;border: none;" icon="el-icon-copy-document" @click="copyText" v-else>复制邀请链接</el-button>
            </span>
        </template>
    </el-dialog>
</template>
<script>
import { defineComponent, ref, watch } from "vue";
import { makeInviteeLink } from "../api";
import moment from "moment";
export default defineComponent({
    props: {
        currentItem: {
            type: Object
        }
    },
    setup(props) {
        const dialogVisible = ref(false);
        const isCopy = ref(false);
        const origin = window.location.origin;
        const url = ref("");
        const handleClose = () => {
            dialogVisible.value = false;
        };
        const copyText = () => {
            const transfer = document.createElement("input");
            document.body.appendChild(transfer);
            transfer.value = url.value;
            transfer.focus();
            transfer.select();
            if (document.execCommand("copy")) {
                document.execCommand("copy");
            }
            transfer.blur();
            document.body.removeChild(transfer);
            isCopy.value = true;
        };
        const makeLink = async () => {
            console.log(props.currentItem);
            const res = await makeInviteeLink({
                groupLessonPreparateID: props.currentItem.Id
            });
            if (res.resultCode === 200) {
                url.value = `${origin}/preparation-edit/${props.currentItem.Id}`;
                console.log(res);
            }
        };
        watch(dialogVisible, (val) => {
            if (val) {
                setTimeout(() => {
                    makeLink();
                });
            }
        }, {
            deep: true
        });
        return {
            dialogVisible,
            isCopy,
            origin,
            url,
            handleClose,
            copyText,
            moment
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
            line-height: 46px;
        }
    }
    .dialog-tipinfo{
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #A7AAB4;
    }
    .ellipsis {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: inline-block;
        max-width: 300px;
    }
</style>
