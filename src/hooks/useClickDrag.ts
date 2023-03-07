import { MutationTypes, store } from "@/store";
import { ref } from "vue";

export default () => {
    let dragDom: HTMLElement | null;
    const origin = {
        layerX: 0, // 鼠标.x 相对于元素左上角.left 的偏移
        layerY: 0, // 鼠标.y 相对于元素左上角.top  的偏移
    };

    const dragStartIndex = ref();

    const startDrag = (event:MouseEvent,info:unknown) => {
        if (dragDom && store.state.common.currentPackageData) {
            onDragEnd(event)
        }else{
            store.commit(MutationTypes.SET_IS_DRAGGING, true);
            const target = event.target as HTMLElement;
            dragStartIndex.value = target.getAttribute("data-id");
            dragDom = document.createElement("div");
            dragDom.classList.add("dragging-click-dom-ele");
            dragDom.style.width = target.offsetWidth + "px";
            dragDom.style.height = target.offsetHeight + "px";
            dragDom.style.lineHeight = target.offsetHeight + "px";
            dragDom.appendChild(target.cloneNode(true));
            document.body.appendChild(dragDom);
    
            origin.layerX = event.offsetX;
            origin.layerY = event.offsetY;
            dragDom.style.position = "fixed";
            dragDom.style.left = event.clientX + "px";
            dragDom.style.top = event.clientY + "px";
            document.addEventListener("mousemove",dragElement);
            store.commit(MutationTypes.CURRENT_PACKAGE_DATA, info);
        }
        // event.dataTransfer!.setData("dragInfo", JSON.stringify(info));
    }

    const dragElement = (event:MouseEvent) => {
        if (!dragDom) return; 
        if (event.clientX === 0 && event.clientY === 0) return;
        dragDom!.style.left = event.clientX  + "px";
        dragDom!.style.top = event.clientY  + "px";
    }

    // const onDragStart = (event: DragEvent, info: unknown) => {
    //     store.commit(MutationTypes.SET_IS_DRAGGING, true);
    //     const target = event.target as HTMLElement;
    //     dragStartIndex.value = target.getAttribute("data-id");
    //     dragDom = document.createElement("div");
    //     dragDom.classList.add("dragging-click-dom-ele");
    //     dragDom.style.width = target.offsetWidth + "px";
    //     dragDom.style.height = target.offsetHeight + "px";
    //     dragDom.style.lineHeight = target.offsetHeight + "px";
    //     dragDom.appendChild(target.cloneNode(true));
    //     document.body.appendChild(dragDom);

    //     const img = new Image();
    //     img.src = "";
    //     event.dataTransfer!.setDragImage(img, 0, 0);

    //     origin.layerX = event.offsetX;
    //     origin.layerY = event.offsetY;
    //     dragDom.style.position = "fixed";
    //     dragDom.style.left = event.clientX + "px";
    //     dragDom.style.top = event.clientY + "px";
    //     event.dataTransfer!.setData("dragInfo", JSON.stringify(info));
    // };

    // const onDrag = (event: DragEvent) => {
    //     console.log('event....',event);

    //     if (event.clientX === 0 && event.clientY === 0) return;
    //     dragDom!.style.left = event.clientX  + "px";
    //     dragDom!.style.top = event.clientY  + "px";
    // };

    const onDragEnd = (event: MouseEvent) => {
        // return
        document.body.removeChild(dragDom!);
        store.commit(MutationTypes.SET_IS_DRAGGING, false);
        store.commit(MutationTypes.SET_IS_DRAGGING_ELEMENT, false);
        dragDom = null;
        store.commit(MutationTypes.CURRENT_PACKAGE_DATA, null);
        // event.dataTransfer!.clearData("dragInfo");
    };

    const clickOutSide = (event: MouseEvent,dom?:any) => {
        dragDom = dragDom || dom;
        if (dragDom && store.state.common.currentPackageData) {
            onDragEnd(event)
        }
    }

    return {
        // onDragStart,
        // onDrag,
        onDragEnd,
        startDrag,
        dragElement,
        clickOutSide
    };
};
