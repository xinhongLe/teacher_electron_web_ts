import {Ref} from "vue";

export default (fabCanvas: Ref<any>) => {
    const origin = {x: 0, y: 0};
    let isMoving = false;

    const onMove = (x: number, y: number) => {
        if (!isMoving) {
            return;
        }
        const left = x - origin.x;
        const top = y - origin.y;
        origin.x = x;
        origin.y = y;
        const objects = fabCanvas.value.getObjects();
        objects.map((obj: any) => {
            obj.set({
                left: obj.left + left,
                top: obj.top + top
            });
        });
        fabCanvas.value.renderAll();
    };

    const touchStart = (e: TouchEvent) => {
        const {clientX, clientY} = e.changedTouches[0];
        origin.x = clientX;
        origin.y = clientY;
        isMoving = true;
    };

    const touchMove = (e: TouchEvent) => {
        const {clientX, clientY} = e.changedTouches[0];
        onMove(clientX, clientY);
    };

    const mousedown = (e: MouseEvent) => {
        origin.x = e.x;
        origin.y = e.y;
        isMoving = true;
    };
    const mousemove = (e: MouseEvent) => {
        const x = e.x;
        const y = e.y;
        onMove(x, y);
    };
    const mouseup = () => {
        isMoving = false;
    };

    return {
        mousedown,
        mousemove,
        mouseup,
        touchStart,
        touchMove
    };
};
