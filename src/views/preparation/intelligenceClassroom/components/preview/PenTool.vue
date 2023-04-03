<template>
    <div class="shape-pool-warp" ref="shapePoolWarp" v-click-outside="hide">
        <div class="shape-pool">
            <div class="pen-radius-box">
                <div class="pen-radius pen-radius-1" :class="{ active: penSize === 2 }" @click="setPenSize(2)" :style="{
                    backgroundColor:
                        penSize === 2 ? writingBoardColor : '#ccc'
                }"></div>
                <div class="pen-radius pen-radius-2" :class="{ active: penSize === 6 }" @click="setPenSize(6)" :style="{
                    backgroundColor:
                        penSize === 6 ? writingBoardColor : '#ccc'
                }"></div>
                <div class="pen-radius pen-radius-3" :class="{ active: penSize === 12 }" @click="setPenSize(12)" :style="{
                    backgroundColor:
                        penSize === 12 ? writingBoardColor : '#ccc'
                }"></div>
                <div class="pen-radius pen-radius-4" :class="{ active: penSize === 20 }" @click="setPenSize(20)" :style="{
                    backgroundColor:
                        penSize === 20 ? writingBoardColor : '#ccc'
                }"></div>
                <div class="pen-radius pen-radius-5" :class="{ active: penSize === 25 }" @click="setPenSize(25)" :style="{
                    backgroundColor:
                        penSize === 25 ? writingBoardColor : '#ccc'
                }"></div>

            </div>
            <div class="pen-line">
            </div>
            <div class="pen-reundo">
                <div @click="undo()">
                    <img v-if="canUndo" src="../../images/slices/icon_chexiao.png" alt="">
                    <img v-else src="../../images/slices/icon_chexiao_disabled.png" alt="">
                </div>
                <div @click="redo()">
                    <img v-if="canRedo" src="../../images/slices/icon_huitui.png" alt="">
                    <img v-else src="../../images/slices/icon_huitui_disabled.png" alt="">
                </div>

            </div>
            <div class="pen-line">
            </div>
            <div class="pen-eraser" @click="setEraser()">
                <img src="../../images/slices/icon_xp_white.png" alt="">
            </div>
        </div>
        <div class="shape-pool">
            <div class="colors">
                <div class="color" :class="{ active: color === writingBoardColor }" v-for="color in writingBoardColors"
                    :key="color" :style="{ backgroundColor: color }" @click="changeColor(color)"></div>
                <el-popover v-model:visible="penColorVisible" :persistent="false" :teleported="false" :width="266"
                    placement="top" trigger="click">
                    <template #reference>
                        <div class="btn">
                            <el-tooltip :hide-after="0" :show-after="0.5" placement="top" content="画笔颜色">
                                <!-- <IconText class="icon" style="font-size: 20px; cursor: pointer" /> -->
                                <img src="../../images/slices/icon_srwz.png" alt="">
                            </el-tooltip>
                        </div>
                    </template>
                    <ColorPicker :modelValue="writingBoardColor" @update:modelValue="(value: any) => changeColor(value)" />
                </el-popover>
            </div>
            <div class="clears" @click="clear()">
                <img src="../../images/slices/icon_qcbj.png" alt="">
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";

export default defineComponent({
    name: "shape-pool",
    emits: [
        "close",
        "setPenSize",
        "setEraser",
        "clear",
        "setPenColor",
        "setMouse",
        "openTool",
        "undo",
        "redo",
        "update:isShowPen"
    ],
    props: {
        penLeft: {
            type: Number,
            default: 0
        },
        penTop: {
            type: Number,
            default: 0
        },
        currentLineWidth: {
            type: Number,
            default: 2
        },
        currentDrawColor: {
            type: String,
            default: "#f60000"
        },
        canUndo: {
            type: Boolean,
            default: false
        },
        canRedo: {
            type: Boolean,
            default: false
        }
    },
    setup(props, { emit }) {
        const writingBoardColors = [
            "#FFFFFF",
            "#000000",
            "#F21E1E",
            "#E4AB07",
            "#4B71EE",
            "#9668CA",
            "#4BBDDA",
            "#72E452",
            "#CA3884"
        ];

        const shapePoolWarp = ref<HTMLDivElement>();
        const writingBoardColor = ref(props.currentDrawColor);

        const hide = () => {
            emit("update:isShowPen", false);
        };
        const penColorVisible = ref(false);
        const penCardVisible = ref(false);
        const penSize = ref(props.currentLineWidth);
        const setPenSize = (size: number) => {
            penSize.value = size;
            penCardVisible.value = false;
            emit("setPenSize", size);
        };
        // 修改画笔颜色，如果当前不处于画笔状态则先切换到画笔状态
        const changeColor = (color: string) => {
            // if (writingBoardModel.value !== "pen") writingBoardModel.value = "pen";
            writingBoardColor.value = color;
            penColorVisible.value = false;
            emit("setPenColor", color);
        };
        // 撤销
        const undo = () => {
            emit("undo");
        };
        // 退回
        const redo = () => {
            emit("redo");
        };
        // 选择橡皮
        const setEraser = () => {
            emit("setEraser");
        };
        // 清除
        const clear = () => {
            emit("clear");
        };
        onMounted(() => {
            if (shapePoolWarp.value) {
                penSize.value = props.currentLineWidth;
                writingBoardColor.value = props.currentDrawColor;
                const width = shapePoolWarp.value.offsetWidth;
                const height = shapePoolWarp.value.offsetHeight;
                const documentWidth = document.documentElement.clientWidth;
                const maxLeft = documentWidth - width;
                shapePoolWarp.value.style.left =
                    Math.min(props.penLeft - width / 2, maxLeft) + "px";
                shapePoolWarp.value.style.top =
                    props.penTop - height - 10 + "px";
            }
        });

        return {
            hide,
            shapePoolWarp,
            penCardVisible,
            penColorVisible,
            penSize,
            setPenSize,
            writingBoardColor,
            changeColor,
            writingBoardColors,
            undo,
            redo,
            setEraser,
            clear
        };
    }
});
</script>

<style lang="scss" scoped>
.shape-pool-warp {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
    background: #fff;
    width: 350px;
    height: 90px;
    background: #40495C;
    border-radius: 8px;
    padding: 12px 16px;
    box-shadow: 0 2px 8px #00000026;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
}

.shape-pool {
    display: flex;
    align-items: center;

    // max-height: 540px;
    // overflow: auto;
    // margin-bottom: -12px;
    // margin-right: -12px;
    // padding-right: 12px;
    .pen-radius-box {
        width: 170px;
        margin-right: 16px;
        .pen-radius{
            &.active {
                border: 2px solid #4BEEE4;
            }
        }
    }

    .pen-line {
        width: 1px;
        height: 22px;
        background: rgba(255, 255, 255, 0.2);
    }

    .pen-reundo {
        cursor: pointer;
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        width: 82px;
    }

    .pen-eraser {
        cursor: pointer;
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .colors {
        display: flex;

        .color {
            width: 20px;
            height: 20px;
            border-radius: 4px;
            cursor: pointer;

            &:hover {
                transform: scale(1.15);
            }

            &.active {
                transform: scale(1.3);
                border: 2px solid #4BEEE4;
            }

            &+.color {
                margin-left: 8px;
            }
        }

        .btn {
            cursor: pointer;
            width: 20px;
            height: 20px;
            margin-left: 8px;
        }
    }

    .clears {
        cursor: pointer;
        margin-left: 12px;
        width: 20px;
        height: 20px;
    }

}

.category-name {
    width: 100%;
    font-size: 13px;
    margin-bottom: 10px;
    border-left: 4px solid #aaa;
    background-color: #eee;
    padding: 2px 0 2px 10px;
}
</style>
