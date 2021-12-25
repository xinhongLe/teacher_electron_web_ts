<template>
    <div class="empty-card">
        <img src="../../../assets/preparationGroup/pic_noresult.png" alt="暂无数据">
        <p>暂无搜索结果</p>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
    name: "empty-card",
    setup() {
        return {};
    },
    components: { }
});
</script>

<style lang="scss" scoped>
.empty-card {
    width: 198px;
    height: 182px;
    margin: 0 auto;
    text-align: center;
    img {
        display: inline-block;
        width: 198px;
        height: auto;
    }
    p {
        font-size: 20px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #5F626F;
        margin-top: 36px;
    }
}
</style>
