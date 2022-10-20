<template>
    <div class="wrongbook-dialog">
        <el-dialog
            :model-value="props.dialogVisible"
            width="90%"
            top="6vh"
            :close-on-click-modal="false"
            :destroy-on-close="true"
            v-if="props.dialogVisible"
        >
            <div class="closeIncon" @click="handleClose">
                <img
                    src="~@/assets/images/wrongbook/icon_close_popup_gray.png"
                    alt=""
                />
            </div>
            <WrongBook />
        </el-dialog>
    </div>
</template>
<script lang="ts" setup>
import { defineProps } from "vue";
import WrongBook from "@/views/wrongbook/index.vue";
const props = defineProps({
    dialogVisible: {
        type: Boolean,
        default: false,
    },
});
const emit = defineEmits(["update:dialogVisible"]);
const handleClose = () => {
    emit("update:dialogVisible", false);
};
</script>
<style scoped lang="scss">
.wrongbook-dialog {
    position: relative;
    .closeIncon {
        cursor: pointer;
        position: absolute;
        right: 10px;
        top: 10px;
    }
    :deep(.el-dialog) {
        .el-dialog__header {
            display: none;
        }
        .el-dialog__body {
            height: 87vh;
        }
    }
}
</style>
