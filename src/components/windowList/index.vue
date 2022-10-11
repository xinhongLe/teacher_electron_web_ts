<script lang="ts" setup>
import useSwiper from "@/hooks/useSwiper";
import { windowInfoKey } from "@/hooks/useWindowInfo";
import { inject, watch } from "vue";

const { slideNext, slidePrev, isDisableNext, isDisablePrev, isShowSlideBtn, translateX, listWarpRef, swiperItemRefs, swiperRef, slideIndex } = useSwiper();

const { winList, currentWindowInfo, updateCurrentWindow } = inject(windowInfoKey)!;

watch(winList, () => {
    slideIndex.value = 0;
    translateX.value = 0;
});

</script>

<template>
    <div class="window-list-warp">
            <div class="slide-btn prev" :class="{ hidden: !isShowSlideBtn, 'disable': isDisablePrev }" @click="slidePrev">
                <el-icon><ArrowLeft /></el-icon>
            </div>
            <div class="window-list" ref="listWarpRef">
                <div class="window-list-swiper" ref="swiperRef" :style="{'transform': `translateX(-${translateX}px)`}">
                    <div
                        class="window-item"
                        v-for="item in winList"
                        :key="item.WindowID"
                        :class="{ active: currentWindowInfo.WindowID === item.WindowID }"
                        @click="updateCurrentWindow(item)"
                        :ref="swiperItemRefs.set"
                        :title="item.WindowName"
                    >
                        {{ item.WindowName }}
                    </div>
                </div>
            </div>
            <div class="slide-btn next" :class="{ hidden: !isShowSlideBtn, 'disable': isDisableNext }" @click="slideNext">
                <el-icon><ArrowRight /></el-icon>
            </div>
        </div>
</template>

<style lang="scss" scoped>
    .window-list-warp {
        padding: 12px 76px;
        flex: 1;
        height: 100%;
        display: flex;
        justify-content: center;
        overflow: hidden;
        .slide-btn {
            height: 100%;
            width: 20px;
            border-radius: 4px;
            background-color: var(--app-color-primary);
            flex-shrink: 0;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;

            &.disable {
                color: #A7AAB4;
                background-color: #eff0f4;
            }
            &.hidden {
                visibility: hidden;
            }
            &.next {
                margin-left: 12px;
            }
            &.prev {
                margin-right: 12px;
            }
        }

        .window-list {
            height: 100%;
            display: flex;
            align-items: center;
            border-radius: 4px;
            overflow: hidden;
            flex: 1;
            .window-list-swiper {
                background: #f0f4ff;
                display: flex;
                transition: transform 0.3s;
                margin: 0 auto;
            }
            .window-item {
                max-width: 210px;
                @include text-ellipsis;
                padding: 0 20px;
                font-size: 16px;
                font-weight: 600;
                color: var(--app-color-primary);
                line-height: 20px;
                cursor: pointer;
                line-height: 36px;
                height: 100%;
                position: relative;
                flex-shrink: 0;
                &::before {
                    position: absolute;
                    content: "";
                    width: 1px;
                    height: 14px;
                    right: 0;
                    top: 50%;
                    transform: translateY(-50%);
                    background-color: var(--app-color-primary);
                    opacity: 0.2;
                }
                &:last-child {
                    &::before {
                        display: none;
                    }
                }
                &.active {
                    background-color: var(--app-color-primary);
                    color: #fff;
                    border-radius: 4px;
                }
            }
        }
    }
</style>
