<template>
    <div class="container">
        <div
            class="content-warp"
            @touchstart="$event => touchStartListener($event)"
            @touchend="$event => touchEndListener($event)"
            @touchmove="$event => touchMoveListener($event)"
        >
            <div
                class="img-warp"
            >
                <div
                    ref="contentRef"
                    class="view-box"
                    @mousewheel="$event => handleMousewheelScreen($event)"
                    @mousedown="onMove"
                    :style="{
                        transform: `translate(${translateX}px, ${translateY}px) scale(${scale}) rotate(${rotate}deg)`,
                    }"
                >
                    <!-- <img
                        :src="imgList[currentIndex]"
                        class="img"
                        @load="imgOnLoad"
                    /> -->
                    <div class="layout-block-box" :class="layoutType.type">
                        <div class="layout-num-box view-layout-box" :class="viewImageIndex === index && 'view-image-dialog'" v-for="(num, index) in layoutType.num" :key="num">
                            <img
                                :src="layoutImages[index]"
                                class="img"
                                @click="viewImage(index)"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <Brush
                :isBrush="isBrush"
                ref="brushRef"
                :colorName="colorName"
                :penSize="penSize"
            />
            <div
                class="reset-btn"
                v-show="isShowResetBtn"
                @click="resetTransform"
            >
                <img
                    src="@/assets/projection/icon_dingwei@2x.png"
                    class="reset-img"
                />
                <span>归位</span>
            </div>

            <div
                class="close-btn"
                v-show="viewImageIndex > -1"
                @click="closeViewImage()"
            >
                <span>关闭</span>
            </div>
        </div>

        <div class="footer">
            <div class="left">
                <div class="box" @click="onZoomIn">
                    <img src="@/assets/projection/icon_big_rest@2x.png" />
                    放大
                </div>
                <div class="box" @click="onZoomOut">
                    <img src="@/assets/projection/icon_samll_rest@2x.png" />
                    缩小
                </div>
                <div class="box" @click="leftRotate">
                    <img src="@/assets/projection/icon_left_rest@2x.png" />
                    左旋
                </div>
                <div class="box" @click="rightRotate">
                    <img src="@/assets/projection/icon_right_rest@2x.png" />
                    右旋
                </div>
                <div class="box" @click="clickMouse">
                    <img
                        src="@/assets/projection/icon_mouse_selected@2x.png"
                        v-show="activeIndex === 1"
                    />
                    <img
                        src="@/assets/projection/icon_mouse_rest@2x.png"
                        v-show="activeIndex !== 1"
                    />
                    鼠标
                </div>
                <el-popover
                    trigger="click"
                    v-model:visible="isPopover"
                    :teleported="false"
                    placement="top"
                    :style="{ background: 'rgb(40, 40, 40)' }"
                    popper-class="brushPopup"
                    width="240px"
                    tooltipEffect="dark"
                >
                    <div>
                        <div class="color-box">
                            <span>画笔颜色：</span>
                            <ul class="color-list">
                                <li
                                    class="white"
                                    :class="{
                                        active: colorName === 'white',
                                    }"
                                    @click="changeStrokeStyle('white')"
                                ></li>
                                <li
                                    class="black"
                                    :class="{
                                        active: colorName === 'black',
                                    }"
                                    @click="changeStrokeStyle('black')"
                                ></li>
                                <li
                                    class="red"
                                    :class="{
                                        active: colorName === 'red',
                                    }"
                                    @click="changeStrokeStyle('red')"
                                ></li>
                                <li
                                    class="orange"
                                    :class="{
                                        active: colorName === 'orange',
                                    }"
                                    @click="changeStrokeStyle('orange')"
                                ></li>
                                <li
                                    class="blue"
                                    :class="{
                                        active: colorName === 'blue',
                                    }"
                                    @click="changeStrokeStyle('blue')"
                                ></li>
                            </ul>
                        </div>
                        <div class="size-box">
                            <span>画笔大小：</span>
                            <ul class="sizes-list">
                                <li
                                    class="small"
                                    :class="{ active: penSize === 2 }"
                                    @click="changeLineWidth(2)"
                                ></li>
                                <li
                                    class="medium"
                                    :class="{ active: penSize === 6 }"
                                    @click="changeLineWidth(6)"
                                ></li>
                                <li
                                    class="max"
                                    :class="{ active: penSize === 10 }"
                                    @click="changeLineWidth(10)"
                                ></li>
                            </ul>
                        </div>
                    </div>
                    <template #reference>
                        <div class="box" @click="brushHandle">
                            <img
                                src="@/assets/projection/icon_huabi_selected@2x.png"
                                v-show="activeIndex === 2"
                            />
                            <img
                                src="@/assets/projection/icon_huabi@2x.png"
                                v-show="activeIndex !== 2"
                            />
                            画笔
                        </div>
                    </template>
                </el-popover>

                <div class="box" @click="eraserHandle">
                    <img
                        src="@/assets/projection/icon_xiangpi_selected@2x.png"
                        v-show="activeIndex === 3"
                    />
                    <img
                        src="@/assets/projection/icon_xiangpi@2x.png"
                        v-show="activeIndex !== 3"
                    />
                    橡皮
                </div>
                <div class="box" @click="clearBoard">
                    <img src="@/assets/projection/icon_qingchu@2x.png" />
                    清除
                </div>
                <div class="page">
                    <div class="box" @click="lastPage">
                        <img
                            src="@/assets/projection/arrow_last_disabled@2x.png"
                            class="small"
                            v-show="currentIndex === 0"
                        />
                        <img
                            v-show="currentIndex !== 0"
                            src="@/assets/projection/arrow_last@2x.png"
                            class="small"
                        />
                        上一页
                    </div>
                    <div class="page-num">
                        <span>{{ currentIndex + 1 }} / {{ imgList.length }}</span>
                        <span>页码</span>
                    </div>
                    <div class="box" @click="nextPage">
                        <img
                            src="@/assets/projection/arrow_next_disabled@2x.png"
                            class="small"
                            v-show="currentIndex === imgList.length - 1"
                        />
                        <img
                            v-show="currentIndex !== imgList.length - 1"
                            src="@/assets/projection/arrow_next@2x.png"
                            class="small"
                        />
                        下一页
                    </div>
                </div>
                <el-popover
                    trigger="click"
                    v-model:visible="isLayoutPopover"
                    :teleported="false"
                    placement="top"
                    :style="{ background: 'rgb(40, 40, 40)' }"
                    popper-class="brushPopup"
                    width="480px"
                    tooltipEffect="dark"
                >
                    <div class="layout-box">
                        <div class="layout-block" :class="item.type === layoutType.type && 'active'" v-for="item in layoutTypes" :key="item.type" @click="setLayoutType(item)">
                            <div class="layout-block-box" :class="item.type">
                                <div class="layout-num-box" v-for="num in item.num" :key="num">
                                    {{ num }}
                                </div>
                            </div>
                        </div>
                    </div>
                    <template #reference>
                        <div class="box" :class="isLayoutPopover && 'active'">
                            <img v-if="!isLayoutPopover" style="width: 24px;margin-top: 8px;" src="@/assets/projection/icon_bj@2x.png" />
                            <img v-else style="width: 24px;margin-top: 8px;" src="@/assets/projection/icon_bj_green@2x.png" />
                            布局
                        </div>
                    </template>
                </el-popover>
            </div>
            <el-button type="danger" @click="$emit('update:isShow', false)">
                关闭投屏
            </el-button>
        </div>
    </div>
</template>

<script lang="ts">
import useTransform from "@/hooks/useTransform";
import { nextTick } from "process";
import { computed, defineComponent, PropType, ref, toRefs, watch } from "vue";
import Brush from "../brush/index.vue";
export default defineComponent({
    props: {
        index: {
            type: Number,
            default: 0
        },
        list: {
            type: Array as PropType<string[]>,
            default: () => []
        }
    },
    setup(props) {
        const imgList = computed(() => props.list);
        const currentIndex = ref(props.index);
        const isBrush = ref(false);
        const isPopover = ref(false);
        const activeIndex = ref(-1);
        const brushRef = ref<InstanceType<typeof Brush>>();
        const colorName = ref("black");
        const penSize = ref(2);
        const contentRef = ref();
        const showBrush = ref(false);
        const viewWidth = ref(0);
        const viewHeight = ref(0);
        const isLayoutPopover = ref(false);

        const layoutTypes = ref([
            {
                type: "layout-default",
                num: 1
            },
            {
                type: "layout-two-one",
                num: 2
            },
            {
                type: "layout-two-two",
                num: 2
            },
            {
                type: "layout-three-one",
                num: 3
            },
            {
                type: "layout-three-two",
                num: 3
            },
            {
                type: "layout-three-three",
                num: 3
            },
            {
                type: "layout-three-four",
                num: 3
            },
            {
                type: "layout-four-one",
                num: 4
            },
            {
                type: "layout-four-two",
                num: 4
            }
        ]);

        const layoutType = ref({
            type: "layout-default",
            num: 1
        });

        const layoutIndex = ref(0);

        const layoutImages = ref<string[]>(imgList.value.slice(layoutIndex.value, layoutType.value.num * (layoutIndex.value + 1)));
        watch(imgList, () => {
            layoutImages.value = imgList.value.slice(layoutIndex.value, layoutType.value.num * (layoutIndex.value + 1));
        });

        const setLayoutType = (type: { type: string, num: number }) => {
            layoutType.value = type;
            currentIndex.value = 0;
            layoutIndex.value = 0;
            isLayoutPopover.value = false;
            switchLayoutPage();
        };

        watch(() => props.index, () => {
            currentIndex.value = props.index;
        });
        const {
            transform,
            leftRotate,
            rightRotate,
            onMove,
            onZoomIn,
            onZoomOut,
            isShowResetBtn,
            resetTransform,
            handleMousewheelScreen,
            touchStartListener,
            touchEndListener,
            touchMoveListener
        } = useTransform(contentRef);

        const switchLayoutPage = () => {
            if (currentIndex.value % layoutType.value.num === 0) {
                layoutIndex.value = currentIndex.value / layoutType.value.num;
                // 处于边缘值，切换
                layoutImages.value = imgList.value.slice(layoutType.value.num * layoutIndex.value, layoutType.value.num * (layoutIndex.value + 1));
            }

            viewImageIndex.value = -1;
            resetTransform();
        }

        const lastPage = () => {
            if (currentIndex.value === 0) {
                return;
            }
            currentIndex.value = currentIndex.value - 1;
            switchLayoutPage();
        };
        const nextPage = () => {
            if (currentIndex.value === imgList.value.length - 1) {
                return;
            }
            currentIndex.value = currentIndex.value + 1;
            switchLayoutPage();
        };
        const brushHandle = () => {
            activeIndex.value = 2;
            isBrush.value = true;
            brushRef.value!.brushOn();
        };
        const clearBoard = () => {
            brushRef.value!.clearBrush();
        };
        const eraserHandle = () => {
            isBrush.value = true;
            activeIndex.value = 3;
            brushRef.value!.eraserOn();
        };
        const clickMouse = () => {
            isBrush.value = false;
            activeIndex.value = 1;
        };
        const changeStrokeStyle = (color: string) => {
            colorName.value = color;
        };
        const changeLineWidth = (width: number) => {
            penSize.value = width;
        };

        const imgOnLoad = () => {
            showBrush.value = true;
            viewWidth.value = contentRef.value.clientWidth;
            viewHeight.value = contentRef.value.clientHeight;
        };

        const viewImageIndex = ref(-1);
        const viewImage = (index: number) => {
            if (layoutType.value.num === 1) return;
            viewImageIndex.value = index;
        };

        const closeViewImage = () => {
            viewImageIndex.value = -1;
            resetTransform();
        }

        return {
            imgList,
            lastPage,
            nextPage,
            leftRotate,
            currentIndex,
            rightRotate,
            onMove,
            onZoomIn,
            onZoomOut,
            isBrush,
            isShowResetBtn,
            brushHandle,
            brushRef,
            clearBoard,
            clickMouse,
            eraserHandle,
            activeIndex,
            resetTransform,
            isPopover,
            penSize,
            colorName,
            changeStrokeStyle,
            changeLineWidth,
            contentRef,
            handleMousewheelScreen,
            touchStartListener,
            touchEndListener,
            touchMoveListener,
            showBrush,
            viewHeight,
            viewWidth,
            imgOnLoad,
            isLayoutPopover,
            layoutTypes,
            layoutType,
            layoutImages,
            setLayoutType,
            viewImage,
            viewImageIndex,
            closeViewImage,
            ...toRefs(transform)
        };
    },
    components: { Brush }
});
</script>

<style lang="scss" scoped>
.container {
    height: 100%;
    display: flex;
    flex-direction: column;
    .content-warp {
        background: #eef4ff;
        height: 100%;
        position: relative;
        overflow: hidden;
        .img-warp {
            height: 100%;
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            overflow: hidden;
            .view-box {
                position: relative;
                transform-origin: center center;
                height: 100%;
                width: 100%;
            }
            .img {
                max-width: 96%;
                max-height: 96%;
                display: block;
            }
        }
        .close-btn, .reset-btn {
            cursor: pointer;
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            background: #000000;
            color: #ffffff;
            border: 1px solid #2196f3;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 10px 30px;
            font-size: 20px;
            bottom: 20px;
            .reset-img {
                margin-right: 14px;
            }
        }

        .close-btn {
            bottom: 80px;
        }
    }
    .footer {
    height: 90px;
    background: #000000;
    flex-shrink: 0;
    display: flex;
    color: #ffffff;
    font-size: 16px;
    align-items: center;
    justify-content: flex-end;
    padding-right: 40px;
    position: relative;
    .left {
        display: flex;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        height: 100%;
        padding: 6px 0;
        .box {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 86px;
            justify-content: space-around;
            cursor: pointer;
            &:hover {
                background: #191919;
            }
            img {
                width: 40px;
                &.small {
                    width: 28px;
                    margin-top: 8px;
                }
            }
            &.active {
                color: #4BEEE4;
            }
        }
        .page {
            display: flex;
            .page-num {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-width: 50px;
            }
        }
    }
}
}

.set-layout {
    display: flex;
    align-items: center;
    padding: 0 20px;
    cursor: pointer;
}

.layout-box {
    display: flex;
    flex-wrap: wrap;
}

.layout-block {
    width: 33.33%;
    height: 120px;
    padding: 10px;
    &.active .layout-block-box {
        outline: 1px solid #4BEEE4;
    }
}

.layout-block-box {
    height: 100%;
    display: flex;
    cursor: pointer;
}

.layout-num-box {
    background: #4F4F4F;
    flex: 1;
    outline: 1px solid #949494;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    min-width: 0;
    min-height: 0;
}

.layout-two-two, .layout-three-two {
    flex-direction: column;
}

.layout-three-three {
    flex-wrap: wrap;
    .layout-num-box {
        flex: auto;
        height: 50%;
        width: 50%;
    }
    .layout-num-box:first-child {
        width: 100%;
    }
}

.layout-three-four {
    flex-direction: column;
    flex-wrap: wrap;
    .layout-num-box {
        flex: auto;
        width: 66.66%;
        height: 50%;
    }
    .layout-num-box:first-child {
        height: 100%;
        width: 33.33%;
    }
}

.layout-four-one {
    flex-wrap: wrap;
    .layout-num-box {
        flex: 50%;
        height: 50%;
    }
}

.view-layout-box {
    background-color: transparent;
    outline: 0;
    padding: 20px;
}

.view-image-dialog {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 10;
    background: #eef4ff;
    width: 100% !important;
    height: 100% !important;
}
</style>
