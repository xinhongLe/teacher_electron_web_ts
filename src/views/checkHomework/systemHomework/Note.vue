<template>
    <div class="write-box">
        <canvas
            ref="canvasRef"
            :width="width + 'px'"
            :height="height + 'px'"
        ></canvas>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, nextTick, watch } from "vue";
import { dealPoints } from "../logic";
export default defineComponent({
    props: {
        width: {
            type: Number,
            default: 900
        },
        height: {
            type: Number,
            default: 612
        },
        data: {
            type: Array,
            default: () => []
        },
        scale: {
            type: Number,
            default: 0.87890625
        },
        isWrite: {
            type: Boolean,
            default: true
        },
        isRead: {
            type: Boolean,
            default: true
        }
    },
    setup(props) {
        const ctx = ref<CanvasRenderingContext2D>();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let notePoints: any[] = [];
        const canvasRef = ref<HTMLCanvasElement>();

        watch(() => props.data, () => {
            if (props.data.length > 0) {
                init();
            } else {
                canvasClear();
            }
        });

        nextTick(() => {
            ctx.value = canvasRef.value!.getContext("2d")!;
        });

        const init = () => {
            canvasClear();
            notePoints = dealPoints(props.data, props.scale);
            draw();
        };
        const canvasClear = () => {
            ctx.value && ctx.value.clearRect(
                0,
                0,
                canvasRef.value!.clientWidth,
                canvasRef.value!.clientHeight
            );
        };
        const draw = () => {
            notePoints.map((note) => {
                nextTick(() => {
                    ctx.value!.strokeStyle = note.mode === "0-1" ? "blue" : "red";
                    ctx.value!.lineWidth = 1;
                    ctx.value!.beginPath();
                    ctx.value!.moveTo(note.points[0].x, note.points[0].y);
                    let i = 1;
                    for (; i < note.points.length; i++) {
                        ctx.value!.lineTo(note.points[i].x, note.points[i].y);
                    }
                    ctx.value!.stroke();
                });
            });
        };

        if (props.data.length > 0) {
            init();
        } else {
            canvasClear();
        }
        return {
            canvasRef
        };
    }
});
</script>

<style scoped>
.write-box {
    position: absolute;
    left: 30px;
    right: 30px;
    top: 30px;
    bottom: 30px;
}
</style>
