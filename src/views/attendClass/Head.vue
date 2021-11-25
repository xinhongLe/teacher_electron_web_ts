<template>
    <div class="tab">
        <span
            :class="activeIndex === 0 ? 'active' : ''"
            @click="$emit('update:activeIndex', 0)"
            >待上课程</span
        >
        <span
            :class="activeIndex === 1 ? 'active' : ''"
            @click="$emit('update:activeIndex', 1)"
            >历史课程</span
        >
        <div class="btns">
            <el-button type="primary" @click="$router.push('preparation')"
                >去排课</el-button
            >
            <el-button type="primary" @click="$emit('refresh')">刷新</el-button>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
    props: {
        activeIndex: {
            type: Number,
            default: 0
        }
    }
});
</script>

<style lang="scss" scoped>
.tab {
    padding: 15px 0;
    span {
        font-size: 22px;
        margin: 0 40px;
        color: #a7aab4;
        cursor: pointer;
        user-select: none;
    }
    .active {
        font-size: 24px;
        color: #6c7183;
        font-weight: 600;
        position: relative;
    }
    .active:after {
        position: absolute;
        left: 0;
        right: 0;
        margin: auto;
        content: "";
        width: 40px;
        height: 3px;
        background: #6c7183;
        bottom: -15px;
    }
    .btns {
        float: right;
        margin-right: 15px;
    }
}
</style>
