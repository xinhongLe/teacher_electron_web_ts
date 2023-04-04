<template>
    <div class="whiteboard-box" :class="{ active: show }" ref="whiteboardBox">
        <WhiteBoard :options="options" ref="whiteboard" />
    </div>

    <WritingBoardTool
        v-show="show"
        @close="closeWriteBoard()"
        @clear="whiteboardOption('clear')"
        @setPenSize="(value) => whiteboardOption('setPenSize', value)"
        @setPenColor="(value) => whiteboardOption('setPenColor', value)"
        @setEraser="whiteboardOption('setEraser')"
        @setMouse="whiteboardOption('setMouse')"
        @openTool="(value) => whiteboardOption('openTool', value)"
        @undo="undo()"
        @redo="redo()"
        :canUndo="canUndo"
        :canRedo="canRedo"
    />
</template>

<script lang="ts" setup>
import {
    computed,
    ref,
    onMounted,
    watch,
    nextTick,
} from "vue";
import WritingBoardTool from "./WritingBoardTool.vue";
import WhiteBoard, { OPTION_TYPE } from "mwhiteboard";

const props = defineProps({
    show: {
        type: Boolean,
        default: false,
    },
});

const emits = defineEmits(["closeWriteBoard"]);

const writingBoardNotMouse = ref(true);

const options = ref({
    offsetX: 0,
    offsetY: 0,
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
    setTimeout(() => {
        if (whiteboardBox.value) {
            const { x, y } = whiteboardBox.value.getBoundingClientRect();
            options.value = {
                offsetX: x,
                offsetY: y,
            };
        }
    }, 100);
};

watch(
    () => props.show,
    (val) => {
        if (!val) return;
        whiteboard.value.setLineWidth(2);
        whiteboard.value.setOptionType(OPTION_TYPE.PEN);
    }
);

onMounted(() => {
    nextTick(() => {
        if (whiteboardBox.value) {
            const { x, y } = whiteboardBox.value.getBoundingClientRect();
            options.value = {
                offsetX: x,
                offsetY: x == 0 && y == 0 ? y : y + 20, //初始化加载画笔偏移 + 20
            };
        }
        window.addEventListener("resize", resize);
    });
});
</script>

<style scoped lang="scss">
.whiteboard-box {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 99998;
    pointer-events: none;

    &.active {
        pointer-events: all;
    }
}
</style>
