import { MutationTypes, store } from "@/store";
import { nextTick, ref } from "vue";
import { IGetLessonBagOutDto, } from "@/api/prepare";

interface ICourse {
    chapterId: string;
    lessonId: string;
    lessonName: string;
    chapterName: string;
}
export default () => {
    let dragDom: HTMLElement | null;
    const origin = {
        layerX: 0, // 鼠标.x 相对于元素左上角.left 的偏移
        layerY: 0, // 鼠标.y 相对于元素左上角.top  的偏移
    };

    // const dragStartIndex = ref();

    const startDrag = (event: MouseEvent , course: ICourse, info: IGetLessonBagOutDto) => {
        document.body.contains(dragDom) && onDragEnd(event);
        dragDom = null;
        store.commit(MutationTypes.SET_IS_DRAGGING, true);
        const target = event.target as HTMLElement;
        // dragStartIndex.value = target.getAttribute("data-id");
        dragDom = document.createElement("div");
        dragDom.classList.add("dragging-click-dom-ele");
        dragDom.innerHTML = `
            <div class="item-name">
                <div class="names">
                    ${course.lessonName || course.chapterName || '课包一'}
                </div>
            </div>
            <div class="items">
                ${info.Name}
            </div>
            `
        nextTick(() => {
            document.body.appendChild(dragDom!);
            origin.layerX = event.offsetX;
            origin.layerY = event.offsetY;
            dragDom!.style.position = "fixed";
            dragDom!.style.left = event.clientX + "px";
            dragDom!.style.top = event.clientY + "px";
            document.addEventListener("mousemove", dragElement);
            store.commit(MutationTypes.CURRENT_PACKAGE_DATA, info);
        })
    }
    const touchStartDrag = (event: TouchEvent, course: ICourse, info: IGetLessonBagOutDto) => {
        document.body.contains(dragDom) && onDragEnd(event);
        dragDom = null;
        store.commit(MutationTypes.SET_IS_DRAGGING, true);
        dragDom = document.createElement("div");
        dragDom.classList.add("dragging-click-dom-ele");
        dragDom.innerHTML = `
            <div class="item-name">
                <div class="names">
                    ${course.lessonName || course.chapterName || '课包一'}
                </div>
            </div>
            <div class="items">
                ${info.Name}
            </div>
            `
        nextTick(() => {
            document.body.appendChild(dragDom!);
            console.log('event.touches[0]',event.touches[0]);
            dragDom!.style.position = "fixed";
            dragDom!.style.left = event.touches[0].clientX + "px";
            dragDom!.style.top = event.touches[0].clientY + "px";
            // document.addEventListener("mousemove", dragElement);
            store.commit(MutationTypes.CURRENT_PACKAGE_DATA, info);
        })
    }
    const dragElement = (event: MouseEvent) => {
        if (!dragDom) return;
        if (event.clientX === 0 && event.clientY === 0) return;
        dragDom!.style.left = event.clientX + "px";
        dragDom!.style.top = event.clientY + "px";
    }
    const onDragEnd = (event: MouseEvent | TouchEvent) => {
        dragDom && document.body.removeChild(dragDom!);
        store.commit(MutationTypes.SET_IS_DRAGGING, false);
        store.commit(MutationTypes.SET_IS_DRAGGING_ELEMENT, false);
        dragDom = null;
        // store.commit(MutationTypes.CURRENT_PACKAGE_DATA, null);
    };

    const clickOutSide = (event: MouseEvent, dom?: any) => {
        dragDom = dragDom || dom || document.querySelector('.dragging-click-dom-ele');
        if (dragDom) {
            onDragEnd(event)
        }
    }

    return {
        onDragEnd,
        startDrag,
        touchStartDrag,
        dragElement,
        clickOutSide
    };
};
