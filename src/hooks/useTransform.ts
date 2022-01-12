import { reactive, onMounted, onUnmounted, ref } from "vue";

export default () => {
    const transform = reactive({
        translateX: 0,
        translateY: 0,
        scale: 1,
        rotate: 0
    });
    const dragPosition = {
        x: 0,
        y: 0
    };
    const zoomRate = 0.02;
    const isShowResetBtn = ref(false); // 是否显示重置按钮

    const leftRotate = () => {
        transform.rotate = transform.rotate - 90;
    };

    const rightRotate = () => {
        transform.rotate = transform.rotate + 90;
    };

    const onMove = (event: MouseEvent) => {
        const { clientX, clientY } = event;
        dragPosition.x = clientX;
        dragPosition.y = clientY;
        document.onmousemove = (event) => {
            isShowResetBtn.value = true;
            const { clientX, clientY } = event;
            const moveX = dragPosition.x - clientX;
            const moveY = dragPosition.y - clientY;
            dragPosition.x = clientX;
            dragPosition.y = clientY;
            const x = transform.translateX - moveX;
            const y = transform.translateY - moveY;
            transform.translateX = x;
            transform.translateY = y;
        };
        document.onmouseup = () => {
            document.onmousemove = null;
            document.onmouseup = null;
        };
    };

    const onZoomIn = () => {
        isShowResetBtn.value = true;
        transform.scale = parseFloat((transform.scale + zoomRate).toFixed(3));
    };

    const onZoomOut = () => {
        isShowResetBtn.value = true;
        if (transform.scale > 0.2) {
            transform.scale = parseFloat((transform.scale - zoomRate).toFixed(3));
        }
    };

    const resetTransform = () => {
        isShowResetBtn.value = false;
        transform.translateX = 0;
        transform.translateY = 0;
        transform.scale = 1;
        transform.rotate = 0;
    };

    function mousewheelHandler (e: WheelEvent) {
        const delta = -e.deltaY;
        if (delta > 0) {
            onZoomIn();
        } else {
            onZoomOut();
        }
    }

    onMounted(() => {
        document.addEventListener("wheel", mousewheelHandler);
    });

    onUnmounted(() => {
        document.removeEventListener("wheel", mousewheelHandler);
    });

    return {
        onMove,
        rightRotate,
        transform,
        onZoomIn,
        onZoomOut,
        resetTransform,
        isShowResetBtn,
        leftRotate
    };
};
