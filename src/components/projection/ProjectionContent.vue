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
                     :style="{
                        transform: `translate(${translateX + viewWidth / 2 * (scale - 1)}px, ${translateY + viewHeight / 2 * (scale - 1)}px) scale(${scale}) rotate(${rotate}deg)`,
                    }"
                >
                    <img
                        
                        @mousewheel="$event => handleMousewheelScreen($event)"
                        :src="imgList[currentIndex]"
                        @mousedown="onMove"
                        class="img"
                        @load="imgOnLoad"
                    />
                    <Brush
                        v-if="showBrush"
                        :isBrush="isBrush"
                        ref="brushRef"
                        :colorName="colorName"
                        :penSize="penSize"
                    />
                </div>
            </div>
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
                        <span
                            >{{ currentIndex + 1 }} / {{ imgList.length }}</span
                        >
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
            </div>
            <el-button type="danger" @click="$emit('update:isShow', false)">
                关闭投屏
            </el-button>
        </div>
    </div>
</template>

<script lang="ts">
import useTransform from "@/hooks/useTransform";
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
        const lastPage = () => {
            if (currentIndex.value === 0) {
                return;
            }
            currentIndex.value = currentIndex.value - 1;
        };
        const nextPage = () => {
            if (currentIndex.value === imgList.value.length - 1) {
                return;
            }
            currentIndex.value = currentIndex.value + 1;
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
            console.log(viewWidth.value)
        };

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
            }
            .img {
                height: 100%;
            }
        }
        .reset-btn {
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
        }
        .page {
            display: flex;
            .page-num {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
            }
        }
    }
}
}
</style>
