<template>
    <div class="dialog-warp">
        <div class="dialog-content-warp">
            <div class="close-warp" v-if="isShowCloseBtn">
                <div class="close-btn" @click="close">
                    <el-icon :size="12" color="#9C9FAA"><Close/></el-icon>
                </div>
            </div>
            <slot/>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { Close } from "@element-plus/icons-vue";

defineProps({
    close: {
        type: Function as PropType<(payload: MouseEvent) => void>,
        required: true
    },
    isShowCloseBtn: {
        type: Boolean,
        default: true
    }
});

</script>

<style lang="scss" scoped>
.dialog-warp {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.4);
    z-index: 1999;
}
.dialog-content-warp {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    position: absolute;
    background: #fff;
    padding: 16px 0 24px;
    background: #FFFFFF;
    box-shadow: 0px 6px 16px -8px rgba(0, 0, 0, 0.12), 0px 9px 28px 0px rgba(0, 0, 0, 0.08), 0px 12px 48px 16px rgba(0, 0, 0, 0.05);
    border-radius: 8px;
    .close-warp {
        display: flex;
        justify-content: flex-end;
        padding-right: 16px;
    }
    .close-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 30px;
        border-radius: 50%;
        height: 30px;
        background-color: #F6F6FA;
        cursor: pointer;
    }
}
</style>
