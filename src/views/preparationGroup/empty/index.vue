<template>
    <div class="empty-card">
        <img class="preparation" v-if="type === 'preparation'" src="../../../assets/preparationGroup/pic_wuneirong.png" alt="暂无数据">
        <img v-else src="../../../assets/preparationGroup/pic_noresult.png" alt="暂无数据">
        <p>{{ tip }}</p>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
    name: "empty-card",
    props: {
        type: {
            type: String,
            default: () => {
                return "";
            }
        },
        tip: {
            type: String,
            default: () => {
                return "暂无搜索结果";
            }
        }
    },
    setup() {
        return {};
    },
    components: { }
});
</script>

<style lang="scss" scoped>
.empty-card {
    width: auto;
    height: 182px;
    margin: 0 auto;
    text-align: center;
    img {
        display: inline-block;
        width: 198px;
        height: auto;
    }
    .preparation {
        width: 136px;
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
