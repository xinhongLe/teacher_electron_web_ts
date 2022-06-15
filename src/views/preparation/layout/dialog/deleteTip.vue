<template>
    <el-dialog
        custom-class="custom-dialog"
        center
        title="提示"
        width="400px"
        :model-value="visible"
        @close="close()"
    >
        <div class="tip-box">
            <img src="@/assets/images/preparation/icon_tips_popup.png" alt="">
            确定要删除吗？
        </div>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="close()">取消</el-button>
                <el-button type="danger" @click="sure()"> 确定删除 </el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script lang="ts">
import { deleteResource } from "@/api/resource";
import { ElMessage } from "element-plus";
import { defineComponent } from "vue";

export default defineComponent({
    props: {
        target: {
            type: String,
            default: ""
        },
        visible: {
            type: Boolean,
            default: false
        }
    },
    setup(props, { emit }) {
        const close = () => {
            emit("update:visible", false);
        };

        const sure = async () => {
            const res = await deleteResource({
                id: props.target,
                type: 1
            });

            if (res.success) {
                ElMessage.success("删除成功！");
            }
            emit("onDeleteSuccess", props.target);
            emit("update:visible", false);
        }
        return {
            close,
            sure
        }
    }
});
</script>

<style lang="scss" scoped>
.tip-box {
    padding: 30px 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-weight: 600;
    img {
        display: block;
        width: 40px;
        margin-right: 20px;
    }
}
</style>
