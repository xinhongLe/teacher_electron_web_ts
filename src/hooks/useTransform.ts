import { throttle } from "lodash";
import { reactive, onMounted, onUnmounted, ref, Ref } from "vue";

export default (contentRef: Ref<HTMLElement>) => {
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
        isMove = true;
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
            isMove = false;
        };
    };

    const onZoomIn = () => {
        isShowResetBtn.value = true;
        transform.scale = parseFloat((transform.scale + zoomRate).toFixed(3));
    };

    const onZoomOut = () => {
        isShowResetBtn.value = true;
        if (transform.scale > 0.5) {
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

    let isMove = false;
    const unit = 0.05; // 缩放单位
    // 获取目标dom左上角距离视窗左边和上边的距离
    const getDomOffset = () => {
        const offsetX = contentRef.value.offsetLeft + transform.translateX;
        const offsetY = contentRef.value.offsetTop + transform.translateY + 60;
        return { offsetX, offsetY };
    };

    const getPointOffset = (point: { x: number, y: number }) => {
        const { offsetX, offsetY } = getDomOffset();
        return { offsetX: (point.x - offsetX) / transform.scale, offsetY: (point.y - offsetY) / transform.scale };
    };

    // 获取两指间距离
    const getDistance = (start: { x: number, y: number }, stop: { x: number, y: number }) => {
        return Math.hypot(stop.x - start.x, stop.y - start.y);
    };

    // 获取两指中心点
    const getTouchesCenter = (touchList: TouchList) => {
        const pointOne = touchList[0];
        const pointTwo = touchList[1];
        return { x: (pointOne.pageX + pointTwo.pageX) / 2, y: (pointOne.pageY + pointTwo.pageY) / 2 };
    };

    const handleMousewheelScreen = (e: WheelEvent) => {
        if (!isMove) {
            e.preventDefault();
            const offset = getPointOffset({ x: e.pageX, y: e.pageY });
            if (e.deltaY > 0) {
                if (transform.scale <= 0.5) return;
                // 缩小
                transform.scale -= unit;
                transform.translateX = offset.offsetX * unit + transform.translateX;
                transform.translateY = offset.offsetY * unit + transform.translateY;
            } else {
                // 放大
                transform.scale += unit;
                transform.translateX = -offset.offsetX * unit + transform.translateX;
                transform.translateY = -offset.offsetY * unit + transform.translateY;
            }
        }
    };

    const touchInfo = ref<TouchList | null>(null);
    let center: { x: number, y: number };
    const isTouchScale = ref(false);

    const touchStartListener = (e: TouchEvent) => {
        touchInfo.value = e.touches;
        if (e.touches.length === 2) {
            center = getTouchesCenter(e.touches);
        }
    };

    const touchEndListener = (e: TouchEvent) => {
        if (!touchInfo.value) return;
        if (isTouchScale.value) {
            touchInfo.value = null;
            isTouchScale.value = false;
        } else {
            const y = Math.abs(
                touchInfo.value[0].pageY - e.changedTouches[0].pageY
            );
            const x = e.changedTouches[0].pageX - touchInfo.value[0].pageX;

            touchInfo.value = null;
        }
    };

    const touchMoveListener = throttle((e: TouchEvent) => {
        e.preventDefault();
        if (touchInfo.value?.length === 2 && e.touches.length === 2) {
            isTouchScale.value = true;
            // 双指缩放
            const zoom = getDistance({ x: e.touches[0].pageX, y: e.touches[0].pageY }, { x: e.touches[1].pageX, y: e.touches[1].pageY }) / getDistance({ x: touchInfo.value[0].pageX, y: touchInfo.value[0].pageY }, { x: touchInfo.value[1].pageX, y: touchInfo.value[1].pageY });
            touchInfo.value = e.touches;
            const offset = getPointOffset(center);
            if (zoom - 1 < 0) {
                if (transform.scale <= 0.5) return;
                // 缩小
                transform.scale -= unit;
                transform.translateX = offset.offsetX * unit + transform.translateX;
                transform.translateY = offset.offsetY * unit + transform.translateY;
            } else if (zoom - 1 > 0) {
                // 放大
                transform.scale += unit;
                transform.translateX = -offset.offsetX * unit + transform.translateX;
                transform.translateY = -offset.offsetY * unit + transform.translateY;
            }
        } else if (touchInfo.value?.length === 1 && e.touches.length === 1) {
            if (transform.scale === 1 && transform.translateX === 0 && transform.translateY === 0) return;
            // 移动
            const moveScreenX = transform.translateX;
            const moveScreenY = transform.translateY;
            transform.translateX = e.touches[0].pageX - touchInfo.value[0].pageX + moveScreenX;
            transform.translateY = e.touches[0].pageY - touchInfo.value[0].pageY + moveScreenY;
            touchInfo.value = e.touches;
        }
    }, 10);

    return {
        onMove,
        rightRotate,
        transform,
        onZoomIn,
        onZoomOut,
        resetTransform,
        isShowResetBtn,
        leftRotate,
        handleMousewheelScreen,
        touchStartListener,
        touchEndListener,
        touchMoveListener
    };
};
