<script lang="ts" setup>
import { windowInfoKey } from "@/hooks/useWindowInfo";
import { useElementSize, useTemplateRefsList } from "@vueuse/core";
import { computed, inject, ref, watch } from "vue";

const windowListRef = ref<HTMLDivElement>();
const windowListWarpRef = ref<HTMLDivElement>();
const isShowSlideBtn = ref(false);
const translateX = ref(0);
const slideIndex = ref(0);
const windowItemRefs = useTemplateRefsList<HTMLDivElement>();
const { width } = useElementSize(windowListRef);

const maxTranslateX = computed(() => width.value - (windowListWarpRef.value?.offsetWidth || 0));
const isDisablePrev = computed(() => translateX.value === 0);
const isDisableNext = computed(() => translateX.value >= maxTranslateX.value);

const { winList, currentWindowInfo, updateCurrentWindow } = inject(windowInfoKey)!;

const slidePrev = () => {
    if (isDisablePrev.value) return;
    const x = translateX.value - windowItemRefs.value[slideIndex.value].offsetWidth;
    translateX.value = x < 0 ? 0 : x;
    if (translateX.value === 0) {
        slideIndex.value = 0;
    } else {
        slideIndex.value--;
    }
};

const slideNext = () => {
    if (isDisableNext.value) return;
    const x = translateX.value + windowItemRefs.value[slideIndex.value].offsetWidth;
    translateX.value = x > maxTranslateX.value ? maxTranslateX.value : x;
    slideIndex.value++;
};

watch(width, (v) => {
    isShowSlideBtn.value = v > windowListWarpRef.value!.offsetWidth;
});
</script>

<template>
    <div class="window-list-warp">
            <div class="slide-btn prev" :class="{ hidden: !isShowSlideBtn, 'disable': isDisablePrev }" @click="slidePrev">
                <i class="el-icon-arrow-left"></i>
            </div>
            <div class="window-list" ref="windowListWarpRef">
                <div class="window-list-swiper" ref="windowListRef" :style="{'transform': `translateX(-${translateX}px)`}">
                    <div
                        class="window-item"
                        v-for="item in winList"
                        :key="item.WindowID"
                        :class="{ active: currentWindowInfo.WindowID === item.WindowID }"
                        @click="updateCurrentWindow(item)"
                        :ref="windowItemRefs.set"
                    >
                        {{ item.WindowName }}
                    </div>
                </div>
            </div>
            <div class="slide-btn next" :class="{ hidden: !isShowSlideBtn, 'disable': isDisableNext }" @click="slideNext">
                <i class="el-icon-arrow-right"></i>
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
