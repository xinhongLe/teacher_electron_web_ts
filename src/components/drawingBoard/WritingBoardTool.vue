<template>
    <div class="writing-board-tool">
        <div
            class="tools"
            :style="{left: writingBoardPosition.x + 'px', bottom: writingBoardPosition.y + 'px'}"
            @mousedown="$event => handleMousedown($event)"
            @mousemove="$event => handleMousemove($event)"
            @mouseup="handleMouseup()"
            @touchstart="$event => handleMousedown($event)"
            @touchmove="$event => handleMousemove($event)"
            @mouseleave="handleMouseup()"
        >
            <a-tooltip
                :mouseLeaveDelay="0"
                :mouseEnterDelay="0.3"
                title="撤销"
                overlayClassName="tipZIndex"
            >
                <div
                    class="btn"
                    :class="{ disabled: !canUndo }"
                    @click="undo()"
                >
                    <IconBack class="icon" />
                </div>
            </a-tooltip>
            <a-tooltip
                :mouseLeaveDelay="0"
                :mouseEnterDelay="0.3"
                title="恢复"
                overlayClassName="tipZIndex"
            >
                <div
                    class="btn"
                    :class="{ disabled: !canRedo }"
                    @click="redo()"
                >
                    <IconNext class="icon" />
                </div>
            </a-tooltip>
            <a-tooltip
                :mouseLeaveDelay="0"
                :mouseEnterDelay="0.3"
                title="移动"
                overlayClassName="tipZIndex"
            >
                <div
                    class="btn"
                    :class="{ active: writingBoardModel === 'mouse' }"
                    @click="changeMouse()"
                >
                    <IconMove class="icon" />
                </div>
            </a-tooltip>
            <a-popover v-model:visible="penCardVisible" title="画笔" trigger="click">
                <template #content>
                    <div class="pen-radius-box">
                        <div class="pen-radius pen-radius-1" @click="setPenSize(2)" :style="{ backgroundColor: penSize === 2 ? writingBoardColor : '#ccc' }"></div>
                        <div class="pen-radius pen-radius-2" @click="setPenSize(6)" :style="{ backgroundColor: penSize === 6 ? writingBoardColor : '#ccc' }"></div>
                        <div class="pen-radius pen-radius-3" @click="setPenSize(12)" :style="{ backgroundColor: penSize === 12 ? writingBoardColor : '#ccc' }"></div>
                        <div class="pen-radius pen-radius-4" @click="setPenSize(20)" :style="{ backgroundColor: penSize === 20 ? writingBoardColor : '#ccc' }"></div>
                        <div class="pen-radius pen-radius-5" @click="setPenSize(25)" :style="{ backgroundColor: penSize === 25 ? writingBoardColor : '#ccc' }"></div>
                    </div>
                </template>
                <a-tooltip
                    :mouseLeaveDelay="0"
                    :mouseEnterDelay="0.3"
                    title="画笔"
                    overlayClassName="tipZIndex"
                >
                    <div
                        class="btn"
                        :class="{ active: writingBoardModel === 'pen' }"
                        @click="changePen()"
                    >
                        <IconWrite class="icon" />
                    </div>
                </a-tooltip>
            </a-popover>

            <a-tooltip
                :mouseLeaveDelay="0"
                :mouseEnterDelay="0.3"
                title="橡皮"
                overlayClassName="tipZIndex"
            >
                <div
                    class="btn"
                    :class="{ active: writingBoardModel === 'eraser' }"
                    @click="changeEraser()"
                >
                    <IconErase class="icon" />
                </div>
            </a-tooltip>

            <a-tooltip
                :mouseLeaveDelay="0"
                :mouseEnterDelay="0.3"
                title="清除墨迹"
                overlayClassName="tipZIndex"
            >
                <div class="btn" @click="clearCanvas()">
                    <IconClear class="icon" />
                </div>
            </a-tooltip>

            <a-tooltip
                :mouseLeaveDelay="0"
                :mouseEnterDelay="0.3"
                title="直尺"
                overlayClassName="tipZIndex"
            >
                <div class="btn" @click="openTool(OPTION_TYPE.RULER)">
                    <IconRuler class="icon" />
                </div>
            </a-tooltip>

            <a-tooltip
                :mouseLeaveDelay="0"
                :mouseEnterDelay="0.3"
                title="量角器"
                overlayClassName="tipZIndex"
            >
                <div class="btn" @click="openTool(OPTION_TYPE.PROTRACTOR)">
                    <IconProtractor class="icon" />
                </div>
            </a-tooltip>

            <a-tooltip
                :mouseLeaveDelay="0"
                :mouseEnterDelay="0.3"
                title="圆规"
                overlayClassName="tipZIndex"
            >
                <div class="btn" @click="openTool(OPTION_TYPE.COMPASS)">
                    <IconCompass class="icon" />
                </div>
            </a-tooltip>
            <!-- <a-tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.3" title="黑板" overlayClassName="tipZIndex">
                <div
                    class="btn"
                    :class="{ active: blackboard }"
                    @click="blackboard = !blackboard"
                >
                    <IconFill class="icon" />
                </div>
            </a-tooltip> -->
            <div class="colors">
                <div
                    class="color"
                    :class="{ active: color === writingBoardColor }"
                    v-for="color in writingBoardColors"
                    :key="color"
                    :style="{ backgroundColor: color }"
                    @click="changeColor(color)"
                ></div>
            </div>
            <a-tooltip
                :mouseLeaveDelay="0"
                :mouseEnterDelay="0.3"
                title="关闭画笔"
                overlayClassName="tipZIndex"
            >
                <div class="btn" @click="closeWritingBoard()">
                    <IconClose class="icon" />
                </div>
            </a-tooltip>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { OPTION_TYPE } from "mwhiteboard";

const writingBoardColors = [
    "#000000",
    "#ffffff",
    "#1e497b",
    "#4e81bb",
    "#f60000",
    "#9aba60",
    "#8165a0",
    "#47acc5",
    "#f9974c"
];

export default defineComponent({
    name: "writing-board-tool",
    emits: ["close", "setPenSize", "setEraser", "clear", "setPenColor", "setMouse", "openTool", "undo", "redo"],
    props: {
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
        const writingBoardColor = ref("#f60000");
        const writingBoardModel = ref("pen");
        const blackboard = ref(false);

        // 切换到画笔状态
        const changePen = () => {
            writingBoardModel.value = "pen";
            emit("setPenSize", penSize.value);
        };

        // 清除画布上的墨迹
        const clearCanvas = () => {
            emit("clear");
        };

        // 修改画笔颜色，如果当前不处于画笔状态则先切换到画笔状态
        const changeColor = (color: string) => {
            if (writingBoardModel.value !== "pen") writingBoardModel.value = "pen";
            writingBoardColor.value = color;
            emit("setPenColor", color);
        };

        // 关闭写字板
        const closeWritingBoard = () => {
            changePen();
            emit("close");
        };

        const penCardVisible = ref(false);
        const penSize = ref(2);
        const setPenSize = (size: number) => {
            penSize.value = size;
            penCardVisible.value = false;
            emit("setPenSize", size);
        };

        const changeEraser = () => {
            writingBoardModel.value = "eraser";
            emit("setEraser");
        };

        const changeMouse = () => {
            writingBoardModel.value = "mouse";
            emit("setMouse");
        };

        const openTool = (tool: string) => {
            emit("openTool", tool);
        };

        let isMouseDown = false;
        let lastPos = { x: 0, y: 0 };
        const writingBoardPosition = ref({ x: window.innerWidth / 2 - 100, y: 120 });

        const handleMousedown = (e: MouseEvent | TouchEvent) => {
            const x = e instanceof MouseEvent ? e.pageX : e.changedTouches[0].pageX;
            const y = e instanceof MouseEvent ? e.pageY : e.changedTouches[0].pageY;

            isMouseDown = true;
            lastPos = { x, y };
        };

        const handleMousemove = (e: MouseEvent | TouchEvent) => {
            if (isMouseDown) {
                const x = e instanceof MouseEvent ? e.pageX : e.changedTouches[0].pageX;
                const y = e instanceof MouseEvent ? e.pageY : e.changedTouches[0].pageY;
                const moveX = x - lastPos.x;
                const moveY = y - lastPos.y;
                handleMove(moveX, moveY);
                lastPos = { x, y };
            }
        };

        const handleMove = (x: number, y: number) => {
            const changeX = writingBoardPosition.value.x + x;
            const changeY = writingBoardPosition.value.y - y;
            writingBoardPosition.value = { x: changeX, y: changeY };
        };

        const handleMouseup = () => {
            if (!isMouseDown) return;
            isMouseDown = false;
        };

        const undo = () => {
            emit("undo");
        };

        const redo = () => {
            emit("redo");
        };

        return {
            writingBoardColors,
            writingBoardColor,
            writingBoardModel,
            blackboard,
            changePen,
            changeEraser,
            clearCanvas,
            changeColor,
            closeWritingBoard,
            handleMousedown,
            handleMousemove,
            handleMouseup,
            setPenSize,
            changeMouse,
            writingBoardPosition,
            penCardVisible,
            penSize,
            openTool,
            OPTION_TYPE,
            undo,
            redo
        };
    }
});
</script>

<style lang="scss" scoped>
$borderRadius: 2px;
$themeColor: #1890ff;
.writing-board-tool {
    font-size: 12px;

    .tools {
        height: 50px;
        position: fixed;
        bottom: 120px;
        left: 5px;
        padding: 12px;
        background-color: #eee;
        border-radius: $borderRadius;
        display: flex;
        align-items: center;
        cursor: move;
        z-index: 99999;
    }
    .btn {
        padding: 5px 10px;
        cursor: pointer;

        &:hover {
            color: $themeColor;
        }
        &.active {
            background-color: rgba($color: $themeColor, $alpha: 0.5);
            color: #fff;
        }
        &.disabled {
            color: #aaa;
            cursor: not-allowed;
        }
    }
    .icon {
        font-size: 20px;
    }
    .colors {
        display: flex;
        padding: 0 10px;
    }
    .color {
        width: 16px;
        height: 16px;
        border-radius: $borderRadius;
        cursor: pointer;

        &:hover {
            transform: scale(1.15);
        }
        &.active {
            transform: scale(1.3);
        }

        & + .color {
            margin-left: 8px;
        }
    }
}
</style>

<style lang="scss">
.tipZIndex {
    z-index: 10001;
}

.pen-radius-box, .eraser-radius-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.pen-radius, .eraser-radius {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #ccc;
    cursor: pointer;
}
.pen-radius-2 {
    width: 12px;
    height: 12px;
}
.pen-radius-3 {
    width: 16px;
    height: 16px;
}
.pen-radius-4 {
    width: 20px;
    height: 20px;
}
.pen-radius-5 {
    width: 24px;
    height: 24px;
}
.eraser-radius-1 {
    width: 8px;
    height: 8px;
}
.eraser-radius-2 {
    width: 16px;
    height: 16px;
}
.eraser-radius-3 {
    width: 24px;
    height: 24px;
}
.eraser-radius-4 {
    width: 32px;
    height: 32px;
}
.eraser-radius-5 {
    width: 40px;
    height: 40px;
}
</style>
