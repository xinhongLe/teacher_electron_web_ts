<script lang="ts" setup>
defineProps({
    percentage: {
        type: Number
    }
});
</script>

<template>
    <div class="clear-caching-warp">
        <img src="./img/pic_rocket@2x.png" class="loading-img" />
        <div class="progress-warp">
            <el-progress :percentage="percentage" :show-text="false" />
        </div>
        <span class="text">清除缓存中，请耐心等候～</span>
    </div>
</template>

<style lang="scss" scoped>
.clear-caching-warp {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 464px;
    height: 311px;
    .text {
        margin-top: 18px;
        font-size: 16px;
        font-weight: 400;
        color: #5f626f;
    }
    .loading-img {
        width: 220px;
        height: 139px;
        margin-bottom: 28px;
    }
    .progress-warp {
        width: 220px;
    }
    .text {
        margin-top: 18px;
    }
}
</style>
