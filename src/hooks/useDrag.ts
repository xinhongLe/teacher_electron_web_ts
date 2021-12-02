import { MutationTypes, store } from "@/store";
import { ref } from "vue";

export default () => {
    let dragDom: HTMLElement | null;
    const origin = {
        layerX: 0, // 鼠标.x 相对于元素左上角.left 的偏移
        layerY: 0 // 鼠标.y 相对于元素左上角.top  的偏移
    };

    const dragStartIndex = ref();
    const onDragStart = (event: DragEvent, info: unknown) => {
        store.commit(MutationTypes.SET_IS_DRAGGING, true);
        const target = event.target as HTMLElement;
        dragStartIndex.value = target.getAttribute("data-id");
        dragDom = document.createElement("div");
        dragDom.classList.add("dragging-dom-ele");
        dragDom.style.width = target.offsetWidth + "px";
        dragDom.appendChild(target.cloneNode(true));
        document.body.appendChild(dragDom);

        const img = new Image();
        img.src = "";
        event.dataTransfer!.setDragImage(img, 0, 0);

        origin.layerX = event.offsetX;
        origin.layerY = event.offsetY;
        dragDom.style.position = "fixed";
        dragDom.style.left = event.clientX - event.offsetX + "px";
        dragDom.style.top = event.clientY - event.offsetY + "px";
        event.dataTransfer!.setData("dragInfo", JSON.stringify(info));
    };

    const onDrag = (event: DragEvent) => {
        dragDom!.style.left = event.clientX - origin.layerX + "px";
        dragDom!.style.top = event.clientY - origin.layerY + "px";
    };

    const onDragEnd = (event: DragEvent) => {
        store.commit(MutationTypes.SET_IS_DRAGGING, false);
        store.commit(MutationTypes.SET_IS_DRAGGING_ELEMENT, false);
        document.body.removeChild(dragDom!);
        dragDom = null;
        event.dataTransfer!.clearData("dragInfo");
    };

    return {
        onDragStart,
        onDragEnd,
        onDrag
    };
};
