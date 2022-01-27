<template>
    <div class="title-warp">
        <span class="title">{{title}}</span>
        <el-icon :size="24" color="#19203D" class="icon" @click="close"><close/></el-icon>
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
.title-warp {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px;
    .title {
        font-size: 24px;
        font-weight: 600;
        color: #19203D;
        flex-shrink: 0;
    }
    .icon {
        cursor: pointer;
    }
}
</style>
