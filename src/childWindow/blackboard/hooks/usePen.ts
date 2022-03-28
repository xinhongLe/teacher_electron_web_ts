import { ref, Ref, watch } from "vue";
import { ActiveType, PenColorMap } from "../enum";
const chalKBlack = require("../ico/chalk_black.cur");
const chalKBlue = require("../ico/chalk_blue.cur");
const chalKOrange = require("../ico/chalk_orange.cur");
const chalKRed = require("../ico/chalk_red.cur");
const chalKWhite = require("../ico/chalk_white.cur");

export default (fabCanvas: Ref<any>, activeType: Ref<number>) => {
    const chalKColorMap: Record<string, unknown> = {
        "#000000": chalKBlack,
        "#4B71EE": chalKBlue,
        "#E4AB07": chalKOrange,
        "#F21E1E": chalKRed,
        "#FFFFFF": chalKWhite
    };
    const penSize = ref(2);
    const penColor = ref(PenColorMap.White);

    // 画笔模式
    function selectPenMode() {
        fabCanvas.value.freeDrawingBrush = new window.fabric.PencilBrush(
            fabCanvas.value
        );
        fabCanvas.value.isDrawingMode = true;
        fabCanvas.value.freeDrawingBrush.color =
            penColor.value || PenColorMap.White;
        fabCanvas.value.freeDrawingBrush.width = penSize.value || 2;
        const cursor = `url(${
            penColor.value
                ? chalKColorMap[penColor.value]
                : chalKColorMap.white
        }),auto`;
        fabCanvas.value.freeDrawingCursor = cursor;
    }

    const brushClick = () => {
        activeType.value = ActiveType.Brush;
        selectPenMode();
    };

    const changeStrokeStyle = (color: PenColorMap) => {
        penColor.value = color;
    };

    const changeLineWidth = (width: number) => {
        penSize.value = width;
    };

    watch([penColor, penSize], () => {
        selectPenMode();
    });

    return {
        selectPenMode,
        brushClick,
        PenColorMap,
        penColor,
        changeStrokeStyle,
        changeLineWidth,
        penSize
    };
};
