<template>
    <el-dialog
        custom-class="custom-dialog"
        center
        title="提示"
        width="450px"
        :model-value="visible"
        @close="close()"
    >
        <div class="tip-box">
            <img src="@/assets/images/preparation/icon_tips_popup.png" alt="">
            该资源不可编辑，<br />
            需要【保存为我的文件】才可编辑哦。
        </div>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="close()">取消</el-button>
                <el-button type="primary"> 保存为我的文件 </el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script lang="ts">
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
        return {
            close
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
    line-height: 22px;
    img {
        display: block;
        width: 50px;
        margin-right: 20px;
    }
}
</style>
