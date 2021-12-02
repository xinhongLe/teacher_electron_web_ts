import { onMounted, ref } from "vue-demi";
import { useRouter } from "vue-router";

export default () => {
    const router = useRouter();
    const type = ref("mouse");
    const painting = ref(false);
    const lastPoint = ref({ x: 0, y: 0 });
    const ctx = ref();
    const canvas = ref();
    const goback = () => {
        router.push("/");
    };
    onMounted(() => {
        canvas.value = document.getElementById("canvas");
        ctx.value = canvas.value.getContext("2d");
    });
    const mousedown = (e: any) => {
        if (type.value !== "mouse") {
            painting.value = true;
            const x = e.offsetX;
            const y = e.offsetY;
            lastPoint.value = { x, y };
            ctx.value.strokeStyle = "red";
            ctx.value.beginPath();
        }
    };
    const mousemove = (e: any) => {
        if (painting.value) {
            const x = e.offsetX;
            const y = e.offsetY;
            const newPoint = { x, y };
            type.value === "pen"
                ? drawLine(
                    lastPoint.value.x,
                    lastPoint.value.y,
                    newPoint.x,
                    newPoint.y
                )
                : setDrawPathForEraser(x, y);
            lastPoint.value = newPoint;
        }
    };
    const mouseup = () => {
        painting.value = false;
    };
    const drawLine = (x1: number, y1: number, x2: number, y2: number) => {
        ctx.value.lineWidth = 3;
        ctx.value.lineCap = "round";
        ctx.value.lineJoin = "round";
        ctx.value.moveTo(x1, y1);
        ctx.value.lineTo(x2, y2);
        ctx.value.stroke();
        ctx.value.closePath();
    };
    const setDrawPathForEraser = (x: number, y: number) => {
        ctx.value.save();
        ctx.value.beginPath();
        ctx.value.arc(x + 10, y + 10, 30 / 2, 0, Math.PI * 2, false);
        ctx.value.clip();
        clear();
        ctx.value.restore();
    };
    const clear = () => {
        ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height);
    };
    return {
        goback,
        type,
        mousedown,
        mouseup,
        mousemove,
        clear
    };
};
