import { Ref } from "vue";
import { ActiveType } from "../enum";

const rubber2 = require("../ico/icon-rubber2.cur");
export default (fabCanvas: Ref<any>, activeType: Ref<number>) => {
    const eraserClick = () => {
        activeType.value = ActiveType.Eraser;
        selectEraseMode();
    };
    // 橡皮模式
    function selectEraseMode() {
        fabCanvas.value.freeDrawingBrush = new window.fabric.EraserBrush(
            fabCanvas.value
        );
        fabCanvas.value.freeDrawingBrush.width = 30;
        fabCanvas.value.isDrawingMode = true;
        fabCanvas.value.freeDrawingCursor = `url(${rubber2}),auto`;
    }

    return {
        eraserClick,
        selectEraseMode
    };
};
