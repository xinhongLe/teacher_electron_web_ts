<template>
    <div class="card-dialog">
        <screen-view
            :inline="true"
            ref="screenRef"
            @pagePrev="pagePrev"
            @pageNext="pageNext"
            :isInit="isInit"
            :slide="currentSlide"
            :is-show-pen-tools="false"
            v-model:isCanUndo="canUndo"
            v-model:isCanRedo="canRedo"
        />
        <Tools
            @redo="redo"
            @undo="undo"
            :dialog="false"
            @close="handleClose"
            @prevStep="prevStep"
            @nextStep="nextStep"
            :isCanUndo="canUndo"
            :isCanRedo="canRedo"
            @openShape="openShape"
            :is-show-close="true"
            @openPaintTool="openPaintTool"
            @whiteboardOption="whiteboardOption"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType, computed } from "vue";
import Tools from "../preview/tools.vue";
import { ElMessage } from "element-plus";
import { PageProps } from "@/views/preparation/intelligenceClassroom/api/props";

export default defineComponent({
    name: "OpenCardViewDialog",
    components: { Tools },
    props: {
        list: {
            type: Array as PropType<PageProps[]>,
            default: () => []
        },
        inline: {
            type: Boolean,
            default: true
        }
    },
    emits: ["closeOpenCard", "close"],
    setup(props, { emit }) {
        const screenRef = ref();
        const isInit = ref(true);
        const canUndo = ref(false);
        const canRedo = ref(false);

        const currentSlide = computed(() => props.list[index.value]?.Json);

        const index = ref(0);
        const pagePrev = () => {
            if (index.value === 0) {
                ElMessage.warning("已经第一页了");
                return;
            }
            isInit.value = false;
            index.value--;
        };

        const pageNext = () => {
            if (index.value === props.list.length - 1) {
                ElMessage.warning("已经最后一页了");
                return;
            }
            isInit.value = true;
            index.value++;
        };

        const prevStep = () => {
            screenRef.value.execPrev();
        };

        const nextStep = () => {
            screenRef.value.execNext();
        };

        // 退回
        const redo = () => {
            screenRef.value.redo();
        };

        // 撤回
        const undo = () => {
            screenRef.value.undo();
        };

        const openShape = (event: MouseEvent) => {
            screenRef.value.openShape(event);
        };

        // 工具栏-画笔
        const openPaintTool = (event: MouseEvent, type: string) => {
            screenRef.value.openPaintTool(event, type);
        };

        // 工具栏 画笔配置
        const whiteboardOption = (option: string, value?: number) => {
            screenRef.value.whiteboardOption(option, value);
        };

        const handleClose = () => {
            emit("close");
        };

        return {
            redo,
            undo,
            index,
            isInit,
            canUndo,
            canRedo,
            pagePrev,
            pageNext,
            nextStep,
            prevStep,
            screenRef,
            openShape,
            handleClose,
            currentSlide,
            openPaintTool,
            whiteboardOption
        };
    }
});
</script>

<style scoped lang="scss">
.card-dialog {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    background: #fff;
    z-index: 10000;

    :deep(.me-tools-set) {
        transform: none;
    }

    :deep(.me-tools-steps) {
        flex: 0.5;
    }
}

.cardLis-class {
    display: flex;
    justify-content: flex-start;
    overflow-y: hidden;
    padding: 10px 20px;

    .me-page-item {
        background-color: #f0f3ff;
        color: #444;
        padding: 10px 20px;
        box-sizing: border-box;
        text-align: center;
        font-size: 14px;
        white-space: nowrap;
        margin-right: 10px;
        border: 2px solid #f0f3ff;
        cursor: pointer;
        position: relative;
    }

    .me-page-item.active {
        border: 2px solid #6675f4;
    }
}
</style>
