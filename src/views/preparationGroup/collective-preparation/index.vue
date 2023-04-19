<template>
    <el-dialog
        v-model="dialogVisible"
        title="集体备课小组邀请"
        width="600px"
        :before-close="handleClose"
        center
    >
        <template #header>
            <span class="dialog-header">集体备课小组邀请</span>
        </template>
        <div class="dialog-img auto">
            <img src="@/assets/preparationGroup/pic_join.png" alt="">
        </div>
        <div class="dialog-teachinfo auto" v-if="collectivePreparationItem.InTeam">
            系统检测到您已经在集体备课小组：【
            <span>{{collectivePreparationItem.PreTitle}}</span>
            】,<br>点击确认按钮，进入详情页
        </div>
        <div class="dialog-teachinfo auto" v-else>
            <span>{{collectivePreparationItem.InviteeTeacherName}}</span>
            邀请您参加集体备课，备课主题为：【
            <span>{{collectivePreparationItem.PreTitle}}</span>
            】,<br>请确认是否加入该小组？
        </div>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirm(true)" v-if="collectivePreparationItem.InTeam">确 定</el-button>
                <el-button type="primary" @click="confirm(false)" v-else>确 定</el-button>
            </span>
        </template>
    </el-dialog>
</template>
<script>
import { defineComponent, ref } from "vue";
export default defineComponent({
    name: "coreparationItem",
    props: {
        collectivePreparationItem: {
            type: Object,
            default: () => {
                return {
                    InTeam: false,
                    PreTitle: "",
                    InviteeTeacherName: "",
                    GroupLessonPreparateID: ""
                };
            }
        }
    },
    setup(props, { emit }) {
        const dialogVisible = ref(false);
        const handleClose = () => {
            dialogVisible.value = false;
        };
        const confirm = (isTurn) => {
            dialogVisible.value = false;
            emit("submit", isTurn);
        };
        return {
            dialogVisible,
            handleClose,
            confirm
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
    .dialog-teachinfo{
        width: 470px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #19203D;
        margin-bottom: 10px;
        line-height: 24px;
        span{
            color:#4B71EE;
        }
    }
    .dialog-img{
        margin-bottom: 30px;
        img{
            width: 100px;
            height: 100px;
        }
    }
</style>
