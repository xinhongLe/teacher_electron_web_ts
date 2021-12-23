<template>
    <div class="write-box">
        <canvas
            ref="canvas"
            :width="panelWidth"
            :height="panelHeight"
            :style="{ left: panelOffsetX + 'px', top: panelOffsetY + 'px' }"
        ></canvas>
    </div>
</template>

<script>
import { dealPoints } from "../logic";
export default {
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
    data() {
        return {
            height: 0,
            width: 0,
            ctx: null,
            // 做题 订正笔记
            writePoints: []
        };
    },
    watch: {
        data() {
            if (this.data.length > 0) {
                this.init();
            } else {
                this.canvasClear();
            }
        }
    },
    created() {
        this.$nextTick(() => {
            this.ctx = this.$refs.canvas.getContext("2d");
        });
        if (this.data.length > 0) {
            this.init();
        } else {
            this.canvasClear();
        }
    },
    methods: {
        init() {
            this.writePoints = [];
            this.canvasClear();
            this.dealWriteFileData(this.data);
            this.draw();
        },

        canvasClear() {
            this.ctx &&
                this.ctx.clearRect(
                    0,
                    0,
                    this.$refs.canvas.clientWidth,
                    this.$refs.canvas.clientHeight
                );
        },

        dealWriteFileData(fillBlankArr) {
            const writePoints = [];
            const canvasWidth = 3700;
            const canvasHeight = 2048;
            this.width = this.panelWidth;
            let scale = this.width / canvasWidth;
            this.height = canvasHeight * scale;
            if (this.height > this.panelHeight) {
                this.height = this.panelHeight;
                scale = this.height / canvasHeight;
                this.width = canvasWidth * scale;
            }

            // 计算下来， canvas的高度和图片的高度应该是一样的 这里dom上直接使用图片的宽高度 上面的计算只为了得到scale 暂时保留

            fillBlankArr.map((item) => {
                const obj = this.writeList.find((w) => {
                    return w.ID === item.fillBlankId;
                });
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
                writePoints.push({
                    x: offsetX,
                    y: offsetY,
                    isCorrect,
                    width: width,
                    height: height,
                    points
                });
            });
            this.writePoints = writePoints;
        },

        addNoAnswerText(obj) {
            this.ctx.font = "20px Arial";
            this.ctx.fillStyle = "red";
            this.ctx.textAlign = "center";
            this.ctx.fillText(
                "未作答",
                obj.x + obj.width / 2,
                obj.y + obj.height / 2 + 8
            );
        },

        draw() {
            this.writePoints.map((item) => {
                const strokeStyle = item.isCorrect ? "#56b70d" : "#fd7878";
                const fillStyle = item.isCorrect ? "#b4eecb" : "#ffd9d9";
                this.drawUsingArc(
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
                item.points.map((note) => {
                    this.ctx.strokeStyle = "blue";
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(note.points[0].x, note.points[0].y);
                    let i = 1;
                    for (; i < note.points.length; i++) {
                        this.ctx.lineTo(note.points[i].x, note.points[i].y);
                    }
                    this.ctx.stroke();
                });
                // 未作答
                if (!item.isCorrect && item.points.length === 0) {
                    this.addNoAnswerText(item);
                }
            });
        },

        // 画圆角矩形
        drawUsingArc(rect, r, strokeStyle, fillStyle) {
            const path = new Path2D();
            this.ctx.strokeStyle = strokeStyle;
            this.ctx.lineWidth = 3;
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
                0,
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

            this.ctx.stroke(path);

            this.fillRoundRect(
                rect.x + 1,
                rect.y + 1,
                rect.width - 2,
                rect.height - 2,
                r,
                fillStyle
            );
        },

        fillRoundRect(x, y, width, height, radius, fillStyle) {
            // 圆的直径必然要小于矩形的宽高
            if (2 * radius > width || 2 * radius > height) {
                return false;
            }

            this.ctx.save();
            this.ctx.translate(x, y);
            // 绘制圆角矩形的各个边
            this.drawRoundRectPath(width, height, radius);
            this.ctx.fillStyle = fillStyle;
            this.ctx.fill();
            this.ctx.restore();
        },

        drawRoundRectPath(width, height, radius) {
            this.ctx.beginPath(0);
            // 从右下角顺时针绘制，弧度从0到1/2PI
            this.ctx.arc(
                width - radius,
                height - radius,
                radius,
                0,
                Math.PI / 2
            );

            // 矩形下边线
            this.ctx.lineTo(radius, height);

            // 左下角圆弧，弧度从1/2PI到PI
            this.ctx.arc(radius, height - radius, radius, Math.PI / 2, Math.PI);

            // 矩形左边线
            this.ctx.lineTo(0, radius);

            // 左上角圆弧，弧度从PI到3/2PI
            this.ctx.arc(radius, radius, radius, Math.PI, (Math.PI * 3) / 2);

            // 上边线
            this.ctx.lineTo(width - radius, 0);

            // 右上角圆弧
            this.ctx.arc(
                width - radius,
                radius,
                radius,
                (Math.PI * 3) / 2,
                Math.PI * 2
            );

            // 右边线
            this.ctx.lineTo(width, height - radius);
            this.ctx.closePath();
        }
    }
};
</script>

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
