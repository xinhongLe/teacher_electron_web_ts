<template>
    <canvas class="canvas" ref="canvas"></canvas>
</template>

<script lang="ts">
import { defineComponent, ref, nextTick } from "vue";

export default defineComponent({
    setup() {
        const canvas = ref<HTMLCanvasElement | null>(null);
        let ctx: CanvasRenderingContext2D | null = null;
        let lastTime: any;

        const getRandom = (a: number, b: number) => {
            return Math.random() * (b - a) + a;
        };

        const drawBg = () => {
            for (let i = 0; i < 100; i++) {
                const r = Math.random() * maxRadius;
                const x = Math.random() * canvas.value!.width;
                const y =
                    Math.random() * 2 * canvas.value!.height -
                    canvas.value!.height;
                const star = new Star(x, y, r);
                stars.push(star);
                star.paint();
            }
        };

        class Frag {
            public tx;
            public ty;
            public x;
            public y;
            public dead;
            public centerX;
            public centerY;
            public radius;
            public color;
            constructor(
                centerX: any,
                centerY: any,
                radius: any,
                color: any,
                tx: any,
                ty: any
            ) {
                this.tx = tx;
                this.ty = ty;
                this.x = centerX;
                this.y = centerY;
                this.dead = false;
                this.centerX = centerX;
                this.centerY = centerY;
                this.radius = radius;
                this.color = color;
            }

            paint() {
                if (ctx) {
                    ctx.save();
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
                    ctx.fillStyle =
                        "rgba(" +
                        this.color.a +
                        "," +
                        this.color.b +
                        "," +
                        this.color.c +
                        ",1)";
                    ctx.fill();
                    ctx.restore();
                }
            }

            moveTo() {
                this.ty = this.ty + 0.3;
                const dx = this.tx - this.x;
                const dy = this.ty - this.y;
                this.x = Math.abs(dx) < 0.1 ? this.tx : this.x + dx * 0.1;
                this.y = Math.abs(dy) < 0.1 ? this.ty : this.y + dy * 0.1;
                if (dx === 0 && Math.abs(dy) <= 80) {
                    this.dead = true;
                }
                this.paint();
            }
        }

        class Star {
            public x;
            public y;
            public r;
            constructor(x: any, y: any, r: any) {
                this.x = x;
                this.y = y;
                this.r = r;
            }

            paint() {
                // if (ctx) {
                //     ctx.save();
                //     ctx.beginPath();
                //     ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
                //     ctx.fillStyle = "rgba(255,255,255," + this.r + ")";
                //     ctx.fill();
                //     ctx.restore();
                // }
            }
        }

        class Boom {
            public booms: Frag[] = [];
            public x;
            public y;
            public r;
            public c;
            public boomArea;
            public theta;
            public dead;
            public ba;
            constructor(x: any, r: any, c: any, boomArea: any) {
                this.booms = [];
                this.x = x;
                this.y = canvas.value!.height + r;
                this.r = r;
                this.c = c;
                this.boomArea = boomArea;
                this.theta = 0;
                this.dead = false;
                this.ba = parseInt(getRandom(80, 200).toString());
            }

            _paint() {
                if (ctx) {
                    ctx.save();
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
                    ctx.fillStyle = this.c;
                    ctx.fill();
                    ctx.restore();
                }
            }

            _move() {
                const dx = this.boomArea.x - this.x,
                    dy = this.boomArea.y - this.y;
                this.x = this.x + dx * 0.01;
                this.y = this.y + dy * 0.01;

                if (Math.abs(dx) <= this.ba && Math.abs(dy) <= this.ba) {
                    this._boom();
                    this.dead = true;
                } else {
                    this._paint();
                }
            }
            _drawLight() {
                if (ctx) {
                    ctx.save();
                    ctx.fillStyle = "rgba(255,228,150,0.3)";
                    ctx.beginPath();
                    ctx.arc(
                        this.x,
                        this.y,
                        this.r + 3 * Math.random() + 1,
                        0,
                        2 * Math.PI
                    );
                    ctx.fill();
                    ctx.restore();
                }
            }
            _boom() {
                const fragNum = getRandom(30, 200);
                const style = getRandom(0, 10) >= 5 ? 1 : 2;
                let color;
                if (style === 1) {
                    color = {
                        a: parseInt(getRandom(128, 255).toString()),
                        b: parseInt(getRandom(128, 255).toString()),
                        c: parseInt(getRandom(128, 255).toString()),
                    };
                }

                const fanwei = parseInt(getRandom(300, 400).toString());
                for (let i = 0; i < fragNum; i++) {
                    if (style === 2) {
                        color = {
                            a: parseInt(getRandom(128, 255).toString()),
                            b: parseInt(getRandom(128, 255).toString()),
                            c: parseInt(getRandom(128, 255).toString()),
                        };
                    }
                    const a = getRandom(-Math.PI, Math.PI);
                    const x = getRandom(0, fanwei) * Math.cos(a) + this.x;
                    const y = getRandom(0, fanwei) * Math.sin(a) + this.y;
                    const radius = getRandom(0, 10);
                    const frag = new Frag(this.x, this.y, radius, color, x, y);
                    this.booms.push(frag);
                }
            }
        }

        const stars: Star[] = [];
        const bigbooms: (Boom | null)[] = [];
        const maxRadius = 10;

        nextTick(() => {
            canvas.value!.width = window.innerWidth;
            canvas.value!.height = window.innerHeight;
            ctx = canvas.value!.getContext("2d");
            initAnimate();
        });

        const initAnimate = () => {
            drawBg();

            lastTime = new Date().getTime();
            animate();
        };

        const animate = () => {
            if (ctx && canvas.value) {
                ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);

                const newTime = new Date().getTime();
                if (newTime - lastTime > 500 + (window.innerHeight - 767) / 2) {
                    const x = getRandom(
                        canvas.value.width / 5,
                        (canvas.value.width * 4) / 5
                    );
                    const y = getRandom(50, 200);
                    const bigboom = new Boom(
                        getRandom(
                            canvas.value.width / 3,
                            (canvas.value.width * 2) / 3
                        ),
                        10,
                        "#FFF",
                        { x: x, y: y }
                    );
                    bigbooms.push(bigboom);
                    lastTime = newTime;
                }

                for (let star of stars) {
                    star.paint();
                }

                for (const bigboom of bigbooms) {
                    if (bigboom) {
                        if (!bigboom.dead) {
                            bigboom._move();
                            bigboom._drawLight();
                        } else {
                            for (const [
                                index,
                                boom,
                            ] of bigboom.booms.entries()) {
                                if (!boom.dead) {
                                    boom.moveTo();
                                } else if (index === bigboom.booms.length - 1) {
                                    bigbooms[bigbooms.indexOf(bigboom)] = null;
                                }
                            }
                        }
                    }
                }

                window.requestAnimationFrame(animate);
            }
        };

        return {
            canvas,
        };
    },
});
</script>

<style>
.canvas {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10;
}
</style>
