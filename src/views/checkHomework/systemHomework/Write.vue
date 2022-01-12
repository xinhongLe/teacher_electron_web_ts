<template>
    <div class="write-box">
        <canvas
            ref="canvasRef"
            :style="{ left: panelOffsetX + 'px', top: panelOffsetY + 'px' }"
        ></canvas>
    </div>
</template>

<script lang="ts">
import { dealPoints } from "../logic";
import { defineComponent, ref, watch, nextTick } from "vue";
export default defineComponent({
    name: "Write",
    props: {
        data: {
            type: Array,
            default: () => []
        },
        writeList: {
            type: Array,
            default: () => []
        },
        panelHeight: {
            type: Number,
            default: 0
        },
        panelWidth: {
            type: Number,
            default: 0
        },
        panelOffsetX: {
            type: Number,
            default: 0
        },
        panelOffsetY: {
            type: Number,
            default: 0
        }
    },
    setup(props) {
        const height = ref(0);
        const width = ref(0);
        const ctx = ref<CanvasRenderingContext2D | null>();
        const writePoints = ref<any[]>([]);
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
            if (props.data.length > 0) {
                init();
            } else {
                canvasClear();
            }
        });

        function init () {
            writePoints.value = [];
            canvasRef.value!.width = props.panelWidth;
            canvasRef.value!.height = props.panelHeight;
            canvasClear();
            dealWriteFileData(props.data);
            draw();
        }

        function canvasClear () {
            ctx.value && ctx.value.clearRect(
                0,
                0,
                canvasRef.value!.clientWidth,
                canvasRef.value!.clientHeight
            );
        }

        function dealWriteFileData (fillBlankArr: any[]) {
            const _writePoints: unknown[] = [];
            const canvasWidth = 3700;
            const canvasHeight = 2048;
            width.value = props.panelWidth;
            let scale = width.value / canvasWidth;
            height.value = canvasHeight * scale;
            if (height.value > props.panelHeight) {
                height.value = props.panelHeight;
                scale = height.value / canvasHeight;
                width.value = canvasWidth * scale;
            }

            // 计算下来， canvas的高度和图片的高度应该是一样的 这里dom上直接使用图片的宽高度 上面的计算只为了得到scale 暂时保留

            fillBlankArr.map((item: any) => {
                const obj = props.writeList.find((w: any) => {
                    return w.ID === item.fillBlankId;
                }) as any;
                const isCorrect = item.answer
                    ? item.answer.trim().toLowerCase() ===
                      item.correctAnswer.toLowerCase()
                    : false;
                const offsetX = obj ? obj.RectX * scale : 0;
                const offsetY = obj ? obj.RectY * scale : 0;
                const width = obj ? obj.RectWidth * scale : 0;
                const height = obj ? obj.RectHeight * scale : 0;

                const inScale = width / item.data.panelWidth;
                const points = dealPoints(item.data.operations, inScale);
                // 对点进行偏移
                points.map((note) => {
                    note.points.map((item) => {
                        item.x = item.x + offsetX;
                        item.y = item.y + offsetY;
                    });
                });
                _writePoints.push({
                    x: offsetX,
                    y: offsetY,
                    isCorrect,
                    answer: item.answer,
                    width: width,
                    height: height,
                    points
                });
            });
            writePoints.value = _writePoints;
        }

        function drawUsingArc (rect: any, r: any, strokeStyle:any, fillStyle:any) {
            const path = new Path2D();
            ctx.value!.strokeStyle = strokeStyle;
            ctx.value!.lineWidth = 3;
            path.moveTo(rect.x + r, rect.y);
            path.lineTo(rect.x + rect.width - r, rect.y);
            path.arc(
                rect.x + rect.width - r,
                rect.y + r,
                r,
                (Math.PI / 180) * 270,
                0,
                false
            );
            path.lineTo(rect.x + rect.width, rect.y + rect.height - r);
            path.arc(
                rect.x + rect.width - r,
                rect.y + rect.height - r,
                r,
                0,
                (Math.PI / 180) * 90,
                false
            );
            path.lineTo(rect.x + r, rect.y + rect.height);
            path.arc(
                rect.x + r,
                rect.y + rect.height - r,
                r,
                (Math.PI / 180) * 90,
                (Math.PI / 180) * 180,
                false
            );
            path.lineTo(rect.x, rect.y + r);
            path.arc(
                rect.x + r,
                rect.y + r,
                r,
                (Math.PI / 180) * 180,
                (Math.PI / 180) * 270,
                false
            );

            ctx.value!.stroke(path);

            fillRoundRect(
                rect.x + 1,
                rect.y + 1,
                rect.width - 2,
                rect.height - 2,
                r,
                fillStyle
            );
        }

        function fillRoundRect (x: any, y: any, width: any, height: any, radius: any, fillStyle: any) {
            // 圆的直径必然要小于矩形的宽高
            if (2 * radius > width || 2 * radius > height) {
                return false;
            }

            ctx.value!.save();
            ctx.value!.translate(x, y);
            // 绘制圆角矩形的各个边
            drawRoundRectPath(width, height, radius);
            ctx.value!.fillStyle = fillStyle;
            ctx.value!.fill();
            ctx.value!.restore();
        }

        function drawRoundRectPath (width: any, height: any, radius: any) {
            ctx.value!.beginPath();
            // 从右下角顺时针绘制，弧度从0到1/2PI
            ctx.value!.arc(
                width - radius,
                height - radius,
                radius,
                0,
                Math.PI / 2
            );

            // 矩形下边线
            ctx.value!.lineTo(radius, height);

            // 左下角圆弧，弧度从1/2PI到PI
            ctx.value!.arc(radius, height - radius, radius, Math.PI / 2, Math.PI);

            // 矩形左边线
            ctx.value!.lineTo(0, radius);

            // 左上角圆弧，弧度从PI到3/2PI
            ctx.value!.arc(radius, radius, radius, Math.PI, (Math.PI * 3) / 2);

            // 上边线
            ctx.value!.lineTo(width - radius, 0);

            // 右上角圆弧
            ctx.value!.arc(
                width - radius,
                radius,
                radius,
                (Math.PI * 3) / 2,
                Math.PI * 2
            );

            // 右边线
            ctx.value!.lineTo(width, height - radius);
            ctx.value!.closePath();
        }

        function draw () {
            writePoints.value.map((item) => {
                const strokeStyle = item.isCorrect ? "#56b70d" : "#fd7878";
                const fillStyle = item.isCorrect ? "#b4eecb" : "#ffd9d9";
                drawUsingArc(
                    {
                        x: item.x,
                        y: item.y,
                        width: item.width,
                        height: item.height
                    },
                    10,
                    strokeStyle,
                    fillStyle
                );
                ctx.value!.font = "30px arial";
                ctx.value!.fillStyle = "#029cff";
                ctx.value!.textBaseline = "middle";
                ctx.value!.textAlign = "center";
                ctx.value!.fillText(item.answer, item.x + item.width / 2, item.y + item.height / 2);

                // // 未作答
                if (!item.isCorrect && item.points.length === 0) {
                    addNoAnswerText(item);
                }
            });
        }

        function addNoAnswerText (obj: any) {
            ctx.value!.font = "20px Arial";
            ctx.value!.fillStyle = "red";
            ctx.value!.textAlign = "center";
            ctx.value!.fillText(
                "未作答",
                obj.x + obj.width / 2,
                obj.y + obj.height / 2
            );
        }

        return	{
            canvasRef,
            writePoints
        };
    }
});
</script>

<style lang="scss" scoped>

</style>

<style scoped>
.write-box {
    position: absolute;
    left: 30px;
    top: 30px;
    bottom: 30px;
    display: flex;
    align-items: center;
    /* justify-content: center; */
    width: 900px;
}

.write-box canvas {
    position: absolute;
}
</style>
