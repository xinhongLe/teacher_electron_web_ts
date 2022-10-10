<template>
    <div class="whiteboard-box" ref="whiteboardBox">
        <WhiteBoard :options="options" ref="whiteboard" id="whiteboard"/>
    </div>

    <WritingBoardTool
        @close="closeWriteBoard()"
        @clear="whiteboardOption('clear')"
        @setPenSize="value => whiteboardOption('setPenSize', value)"
        @setPenColor="value => whiteboardOption('setPenColor', value)"
        @setEraser="whiteboardOption('setEraser')"
        @setMouse="whiteboardOption('setMouse')"
        @openTool="value => whiteboardOption('openTool', value)"
        @undo="undo()"
        @redo="redo()"
        :canUndo="canUndo"
        :canRedo="canRedo"
    />
</template>

<script lang="ts" setup>
import { computed, ref, defineEmits, onMounted } from "vue";
import WritingBoardTool from "./WritingBoardTool.vue";
import WhiteBoard, { OPTION_TYPE } from "mwhiteboard";

const emits = defineEmits(["closeWriteBoard"]);

const writingBoardNotMouse = ref(true);

const options = ref({
    offsetX: 0,
    offsetY: 0
});

const closeWriteBoard = () => {
    emits("closeWriteBoard");
};

const whiteboard = ref();
const whiteboardBox = ref();
const whiteboardOption = (option: string, value?: number) => {
    if (option === "clear") {
        whiteboard.value.clear();
    } else if (option === "setPenSize") {
        whiteboard.value.setOptionType(OPTION_TYPE.PEN);
        whiteboard.value.setLineWidth(value);
        writingBoardNotMouse.value = true;
    } else if (option === "setPenColor") {
        whiteboard.value.setOptionType(OPTION_TYPE.PEN);
        whiteboard.value.setDrawColor(value);
        writingBoardNotMouse.value = true;
    } else if (option === "setEraser") {
        whiteboard.value.setOptionType(OPTION_TYPE.ERASER);
        writingBoardNotMouse.value = true;
    } else if (option === "setMouse") {
        writingBoardNotMouse.value = false;
    } else if (option === "openTool") {
        writingBoardNotMouse.value = true;
        whiteboard.value.setOptionType(value);
    }
};

const undo = () => {
    whiteboard.value.undo();
};

const redo = () => {
    whiteboard.value.redo();
};

const canUndo = computed(() => whiteboard.value && whiteboard.value.canUndo);
const canRedo = computed(() => whiteboard.value && whiteboard.value.canRedo);

const resize = () => {
    // 窗口发生变化重新计算距离
    const { x, y } = whiteboardBox.value.getBoundingClientRect();
    options.value = {
        offsetX: x,
        offsetY: y
    };
};

onMounted(() => {
    resize();
    window.addEventListener("resize", resize);
    whiteboard.value.setOptionType(OPTION_TYPE.PEN);
});
</script>

<style scoped lang="scss">
    .whiteboard-box {
        width: 100%;
        height: 100vh;
        position: fixed;
        left: 0;
        right: 0;
        z-index: 99998;
    }
</style>
