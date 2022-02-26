<template>
    <div class="title">
        {{ title }}
        <div class="close-btn" @click="close">
            <el-icon :size="14" color="#9C9FAA"><close /></el-icon>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
export default defineComponent({
    props: {
        title: {
            type: String,
            default: ""
        },
        close: {
            type: Function as PropType<(payload: MouseEvent) => void>,
            required: true
        }
    },
    setup() {
        return {};
    }
});
</script>

<style lang="scss" scoped>
.title {
    font-size: 20px;
    // -webkit-app-region: drag;
    color: #19203d;
    font-weight: 600;
    height: 60px;
    border-bottom: 1px solid #e9ecf0;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    flex-shrink: 0;
    .close-btn {
        cursor: pointer;
        -webkit-app-region: no-drag;
        position: absolute;
        width: 30px;
        height: 30px;
        background: #f6f6fa;
        border-radius: 50%;
        top: 50%;
        transform: translateY(-50%);
        right: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}
</style>
