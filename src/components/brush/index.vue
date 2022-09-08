<template>
    <div class="write-box black_cursor" :class="{'no-brush': !isBrush}" ref="boxRef">
        <canvas
            ref="canvasRef"
            id="canvas"
            @mousedown="mousedown"
            @mousemove="mousemove"
            @mouseup="mouseup"
        ></canvas>
    </div>
</template>

<script lang="ts">
import { defineComponent, nextTick, onMounted, reactive, ref, watch } from "vue";
const huabi = require("./../../assets/look/icon-huabi.cur");
const rubber = require("./../../assets/look/icon-rubber2.cur");
export default defineComponent({
    name: "brush",
    props: {
        isBrush: {
            type: Boolean,
            default: true
        },
        colorName: {
            type: String,
            default: "#000000"
        },
        penSize: {
            type: Number,
            default: 1
        }
    },
    setup(props) {
        const canvasRef = ref<HTMLCanvasElement>();
        const boxRef = ref<HTMLDivElement>();
        const painting = ref(false);
        const eraserEnabled = ref(false);
        const startPoint = reactive({
            x: 0,
            y: 0
        });
        const fabCanvas = ref();

        onMounted(() => {
            nextTick(() => {
                fabCanvas.value = new window.fabric.Canvas(canvasRef.value, {
                    width: Number(boxRef.value?.offsetWidth),
                    height: Number(boxRef.value?.offsetHeight)
                });
                fabCanvas.value.freeDrawingBrush.width = props.penSize;
                selectPenMode();
            });
        });

        function selectPenMode () {
            fabCanvas.value!.freeDrawingBrush = new window.fabric.PencilBrush(fabCanvas.value!);
            fabCanvas.value!.isDrawingMode = true;
            fabCanvas.value!.freeDrawingBrush.color = props.colorName;
            fabCanvas.value!.freeDrawingBrush.width = props.penSize;
            fabCanvas.value.freeDrawingCursor = `url(${huabi}),auto`;
        }

        const mousedown = (e: MouseEvent) => {
            const x = e.x;
            const y = e.y;
            painting.value = true;
            startPoint.x = x;
            startPoint.y = y;
        };

        const mousemove = (e: MouseEvent) => {
            const x = e.x;
            const y = e.y;
            const newPoint = { x: x, y: y };
            if (painting.value) {
                const left = x - startPoint.x;
                const top = y - startPoint.y;
                const objects = fabCanvas.value!.getObjects();
                objects.map((obj: any) => {
                    obj.set({
                        left: obj.left + left,
                        top: obj.top + top
                    });
                });
                fabCanvas.value!.renderAll();
                startPoint.x = newPoint.x;
                startPoint.y = newPoint.y;
            }
        };

        const mouseup = () => {
            painting.value = false;
        };

        const clearBrush = () => {
            fabCanvas.value.clear();
            fabCanvas.value.renderAll();
        };

        const eraserOn = () => {
            eraserEnabled.value = true;
            fabCanvas.value!.freeDrawingBrush = new window.fabric.EraserBrush(fabCanvas.value!);
            fabCanvas.value!.freeDrawingBrush.width = 30;
            fabCanvas.value!.isDrawingMode = true;
            fabCanvas.value.freeDrawingCursor = `url(${rubber}),auto`;
        };

        const brushOn = () => {
            eraserEnabled.value = false;
            selectPenMode();
        };

        watch(() => props.colorName, (v) => {
            fabCanvas.value!.freeDrawingBrush.color = v;
        });

        watch(() => props.penSize, (v) => {
            fabCanvas.value!.freeDrawingBrush.width = v;
        });

        return {
            canvasRef,
            mousemove,
            mouseup,
            eraserOn,
            clearBrush,
            brushOn,
            boxRef,
            fabCanvas,
            mousedown
        };
    }
});
</script>

<style lang="scss" scoped>
.write-box {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 2;
    width: 100%;
}
// .xiangpica {
//     cursor: url("./../../assets/look/icon-rubber.png"), pointer;
// }
// .black_cursor {
//     cursor: url("./../../assets/look/icon-huabi.png"), pointer;
// }
.no-brush {
    cursor: pointer;
    pointer-events: none;
}
</style>
