<template>
    <el-dialog
        class="custom-dialog"
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
import { defineComponent } from "vue";
export default defineComponent({
    props: {
        visible: {
            type: Boolean,
            default: false
        }
    },
    emits: ["onDeletePackage", "update:visible"],
    setup(props, { emit }) {
        const close = () => {
            emit("update:visible", false);
        };
        const sure = async () => {
            emit("onDeletePackage");
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
