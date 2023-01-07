import { PPTElement } from "wincard";

/**
 * 获取所有元素中的 最小left、top
 */
export const getElementsMinPoints = (elements: PPTElement[]) => {
    let minLeft = Infinity;
    let minTop = Infinity;

    for (const element of elements) {
        minLeft = Math.min(minLeft, element.left || 0);
        minTop = Math.min(minTop, element.top || 0);
    }

    return { minLeft, minTop };
};

/**
 * 获取元素形成矩形宽、高
 */

export const getElementsMaxSize = (elements: any[]) => {
    let maxWidth = -Infinity;
    let maxHeight = -Infinity;

    for (const element of elements) {
        maxWidth = Math.max(maxWidth, element.left + (element.width || 0));
        maxHeight = Math.max(maxHeight, element.top + (element.height || 0));
    }

    return { maxWidth, maxHeight };
};
