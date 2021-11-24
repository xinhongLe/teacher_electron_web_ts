<template>
    <div class="write-box black_cursor">
        <canvas
            ref="canvasRef"
            @mousedown="mousedown"
            @mousemove="mousemove"
            @mouseup="mouseup"
        ></canvas>
    </div>
</template>

<script lang="ts">
import { defineComponent, nextTick, onMounted, reactive, ref } from "vue";
export default defineComponent({
    name: "brush",
    setup() {
        const canvasRef = ref<HTMLCanvasElement>();
        const ctx = ref<CanvasRenderingContext2D>();
        const painting = ref(false);
        const eraserEnabled = ref(false);
        const startPoint = reactive({
            x: 0,
            y: 0
        });

        onMounted(() => {
            nextTick(() => {
                ctx.value = canvasRef.value!.getContext("2d")!;
                canvasRef.value!.width = window.innerWidth - 50;
                canvasRef.value!.height = window.innerHeight - 200;
            });
        });

        function drawLine(
            xStart: number,
            yStart: number,
            xEnd: number,
            yEnd: number
        ) {
            // 开始绘制路径
            ctx.value!.beginPath();
            // 起始位置
            ctx.value!.moveTo(xStart, yStart);
            // 停止位置
            ctx.value!.lineTo(xEnd, yEnd);
            // 描绘线路
            ctx.value!.stroke();
            // 结束绘制
            ctx.value!.closePath();
        }

        const mousedown = (e: MouseEvent) => {
            const x = e.offsetX;
            const y = e.offsetY;
            painting.value = true;
            if (eraserEnabled.value) {
                ctx.value!.clearRect(x - 15, y - 15, 30, 30);
            }
            startPoint.x = x;
            startPoint.y = y;
            ctx.value!.beginPath();
            if (eraserEnabled.value) {
                ctx.value!.lineCap = "round";
                ctx.value!.lineJoin = "round";
                ctx.value!.moveTo(x, y);
                ctx.value!.lineTo(x, y);
                ctx.value!.stroke();
            }
        };

        const mousemove = (e: MouseEvent) => {
            const x = e.offsetX;
            const y = e.offsetY;
            const newPoint = { x: x, y: y };
            if (painting.value) {
                if (eraserEnabled.value) {
                    ctx.value!.clearRect(x - 15, y - 15, 30, 30);
                } else {
                    drawLine(
                        startPoint.x,
                        startPoint.y,
                        newPoint.x,
                        newPoint.y
                    );
                }
                startPoint.x = newPoint.x;
                startPoint.y = newPoint.y;
            }
        };

        const mouseup = () => {
            painting.value = false;
            ctx.value!.closePath();
        };

        const clearBrush = () => {
            ctx.value!.clearRect(
                0,
                0,
                canvasRef.value!.width,
                canvasRef.value!.height
            );
        };

        const eraserOn = () => {
            canvasRef.value!.classList.remove("black_cursor");
            canvasRef.value!.classList.add("xiangpica");
            eraserEnabled.value = true;
        };

        const brushOn = () => {
            canvasRef.value!.classList.remove("xiangpica");
            canvasRef.value!.classList.add("black_cursor");
            eraserEnabled.value = false;
        };

        return {
            canvasRef,
            mousemove,
            mouseup,
            eraserOn,
            clearBrush,
            brushOn,
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
}
.xiangpica {
    cursor: url("./../../assets/look/icon-rubber.png"), pointer;
}
.black_cursor {
    cursor: url("./../../assets/look/chalk_black.png"), pointer;
}
</style>
