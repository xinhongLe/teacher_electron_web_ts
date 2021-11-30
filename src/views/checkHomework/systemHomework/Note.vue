<template>
    <div class="write-box">
        <canvas
            ref="canvas"
            :width="width + 'px'"
            :height="height + 'px'"
        ></canvas>
    </div>
</template>

<script>
import { dealPoints } from "../logic";
export default {
    name: "Write",
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
    data() {
        return {
            ctx: null,
            // 做题 订正笔记
            notePoints: []
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
            this.canvasClear();
            this.notePoints = dealPoints(this.data, this.scale);
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

        draw() {
            this.notePoints.map((note) => {
                this.$nextTick(() => {
                    this.ctx.strokeStyle = note.mode === "0-1" ? "blue" : "red";
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(note.points[0].x, note.points[0].y);
                    let i = 1;
                    for (; i < note.points.length; i++) {
                        this.ctx.lineTo(note.points[i].x, note.points[i].y);
                    }
                    this.ctx.stroke();
                });
            });
        }
    }
};
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
