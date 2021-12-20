<template>
    <div class="container" :class="{error: isError}">
        <span class="box">暂</span>
        <span class="box">无</span>
        <span class="box">图</span>
        <span class="box">片</span>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
    props: {
        isError: {
            type: Boolean,
            default: false
        }
    },
    setup() {
        return	{
        };
    }
});
</script>

<style lang="scss" scoped>
.container {
    width: 100%;
    height: 100%;
    padding: 0 25px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(188, 247, 221, 1);
    &.error {
        background: rgba(255, 217, 217, 1);
        .box {
            background: #fff5f5;
            color: #ff7070;
        }
    }
    .box {
        display: flex;
        justify-content: center;
        align-items: center;
        flex: 1;
        margin-left: 5px;
        background: #eefff7;
        color: #34e1b6;
        font-size: 24px;
        font-weight: 400;
    }
}
</style>
