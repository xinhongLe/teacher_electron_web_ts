<template>
    <el-dialog
        custom-class="custom-dialog"
        center
        title="删除视频"
        width="450px"
        :model-value="visible"
        @close="close()"
    >
        <div class="tip-box">
            <img src="@/assets/images/preparation/icon_tips_popup.png" alt="" />
            <div>
                确定要删除吗？
                <div class="tip-bottom">资源将从所选目录中删除</div>
            </div>
        </div>
        <div class="checkbox-content">
            <div>
                <el-checkbox label="数学 人教版 一上 / 数一数 / 数一" />
            </div>
            <div>
                <el-checkbox label="数学 人教版 一上 / 数一数 / 数一" />
            </div>
            <div>
                <el-checkbox label="数学 人教版 一上 / 数一数 / 数一" />
            </div>
        </div>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="close()">取消</el-button>
                <el-button type="danger"> 确认删除 </el-button>
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
        };
    }
});
</script>

<style lang="scss" scoped>
.tip-box {
    padding: 30px 10px 10px 60px;
    display: flex;
    align-items: center;
    font-size: 16px;
    font-weight: 600;
    .tip-bottom {
        margin-top: 10px;
        font-size: 14px;
        color: #888;
    }
    img {
        display: block;
        width: 40px;
        margin-right: 20px;
    }
}

.checkbox-content {
    padding-left: 120px;
    .el-checkbox {
        height: 30px;
    }
}
</style>
