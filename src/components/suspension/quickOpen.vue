<script lang="ts" setup>

</script>

<template>
    <div class="quick-open-warp">
        <span class="title">快速调用</span>
        <div class="list">
            <div class="item active">
                <img src="@/assets/images/suspension/icon_chuangkaye_big.svg" class="icon"/>
                <span class="name">窗卡页名称1</span>
            </div>
            <div class="item">
                <img src="@/assets/images/suspension/icon_viedo_big.svg" class="icon"/>
                <span class="name">窗卡页名称1</span>
            </div>
            <div class="item">
                <img src="@/assets/images/suspension/icon_timu_big.svg" class="icon"/>
                <span class="name">窗卡页名称1窗卡页名称1窗卡页名称1</span>
            </div>
            <div class="item">

            </div>
            <div class="item">

            </div>
            <div class="item">

            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.quick-open-warp {
    margin-top: 14px;
    .title {
        font-size: 20px;
        font-weight: 600;
        color: #FFFFFF;
    }
    .list {
        margin-top: 14px;
        display: flex;
        overflow: auto;
        padding-bottom: 4px;
        .item {
            flex-shrink: 0;
            width: 120px;
            height: 80px;
            padding: 12px;
            background: rgba(255, 255, 255, 0.12);
            border-radius: 4px;
            margin-right: 12px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            cursor: pointer;
            .icon {
                width: 28px;
                height: 28px;
            }
            .name {
                font-size: 14px;
                font-weight: 400;
                color: #FFFFFF;
                @include text-ellipsis;
            }
            &.active {
                border: 2px solid var(--app-color-primary);
            }
        }
        &::-webkit-scrollbar {
            height: 12px;
        }
        /* 滚动条背景 */
        &::-webkit-scrollbar-track {
            background: #081134;
            border-radius: 2px;
        }
        /* 滚动条滑块 */
        &::-webkit-scrollbar-thumb {
            border: 4px solid #081134;
            background-clip: padding-box;
            border-radius: 9999px;
            background: rgba(255, 255, 255, 0.3);
        }
    }
}
</style>
