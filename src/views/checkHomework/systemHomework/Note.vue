<template>
    <div class="write-box">
        <canvas
            ref="canvas"
            :width="width + 'px'"
            :height="height + 'px'"
        ></canvas>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, nextTick, toRefs, watch } from "vue";
import { dealPoints } from "../logic";
export default defineComponent({
    setup(props) {
        let ctx = ref(null);
        let notePoints: any[] = [];
        const canvas = ref(null);
        const { width, height, data, scale } = toRefs(props);

        watch(data, () => {
            if (data.value.length > 0) {
                init();
            } else {
                canvasClear();
            }
        });

        nextTick(() => {
            ctx.value = canvas.value.getContext("2d");
        });

        const init = () => {
            canvasClear();
            notePoints = dealPoints(data.value, scale.value);
            draw();
        };
        const canvasClear = () => {
            ctx.value && ctx.value.clearRect(
                0,
                0,
                canvas.value.clientWidth,
                canvas.value.clientHeight
            );
        };
        const draw = () => {
            notePoints.map((note) => {
                nextTick(() => {
                    ctx.value.strokeStyle = note.mode === "0-1" ? "blue" : "red";
                    ctx.value.lineWidth = 1;
                    ctx.value.beginPath();
                    ctx.value.moveTo(note.points[0].x, note.points[0].y);
                    let i = 1;
                    for (; i < note.points.length; i++) {
                        ctx.value.lineTo(note.points[i].x, note.points[i].y);
                    }
                    ctx.value.stroke();
                });
            });
        };

        if (data.value.length > 0) {
            init();
        } else {
            canvasClear();
        }
        return {
            width,
            height
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
