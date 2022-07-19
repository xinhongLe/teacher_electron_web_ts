<script lang="ts" setup>
import { defineProps, PropType } from "vue";

defineProps({
    fileTotalSize: {
        type: String
    },
    close: {
        type: Function as PropType<(payload: MouseEvent) => void>,
        required: true
    }
});
</script>

<template>
    <div class="clear-cache-end-warp">
            <span class="title">清理缓存</span>
            <div class="success-content">
                <div class="success-icon">
                    <span class="success"></span>
                </div>
                <div class="text">
                    <span >清除成功，已为您释放空间</span
                    ><span class="size">{{ fileTotalSize }}M</span>
                </div>
            </div>
            <div class="btn" @click="close">完成</div>
        </div>
</template>

<style lang="scss" scoped>
.clear-cache-end-warp {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 464px;
    justify-content: space-between;
    height: 281px;
    .title {
        font-size: 20px;
        font-weight: 600;
        color: #19203d;
    }
    .success-content {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .success-icon {
        width: 72px;
        height: 72px;
        background-color: #38d9b0;
        border-radius: 50%;
        margin-bottom: 32px;
        display: flex;
        justify-content: center;
        align-items: center;
        .success{
            display: inline-block;
            font-weight: 700;
            width: 15px;
            height: 32px;
            transform-origin: right;
            transform: rotate(45deg);
            border-style: solid;
            border-color: #ffffff;
            border-width:   0 4px 4px 0 ;
        }

    }
    .size {
        color: #4B71EE;
    }
    .btn {
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 16px;
        font-weight: 400;
        border-radius: 4px;
        height: 40px;
        color: #ffffff;
        background: #4b71ee;
        width: 160px;
    }
    .text {
        margin-top: 18px;
        font-size: 16px;
        font-weight: 400;
        color: #5f626f;
    }
}
</style>
