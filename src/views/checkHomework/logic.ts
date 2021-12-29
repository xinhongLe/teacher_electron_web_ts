/* eslint-disable @typescript-eslint/no-explicit-any */
let circleR = 20;
interface Point {
    x: number,
    y: number
}
export function dealPoints(operations: any[], scale: number) {
    circleR = 20;
    circleR = circleR * scale;
    let allPoints: { points: Point[]; mode: any; }[] = [];
    operations.map((element) => {
        const note = {
            points: [] as Point[],
            mode: element.mode
        };
        if (element.mode === 1) {
            // 橡皮擦 去除擦掉的路径
            const clearPoints: { x: number; y: number; }[] = [];
            element.points.map((item: string) => {
                const s = item.split(",");
                const x = s[0].split("{")[1];
                const y = s[1].split("}")[0];
                clearPoints.push({
                    x: Number(x) * scale,
                    y: Number(y) * scale
                });
            });
            allPoints = removePath(clearPoints, allPoints);
        } else {
            element.points.map((item: string) => {
                const s = item.split(",");
                const x = s[0].split("{")[1];
                const y = s[1].split("}")[0];
                note.points.push({
                    x: Number(x) * scale,
                    y: Number(y) * scale
                });
            });
            allPoints.push(note);
        }
    });
    return allPoints;
}

function removePath(clear: string | any[], all: any[]) {
    const clearLength = clear.length;
    for (let i = 0; i < clearLength; i++) {
        all.map((item) => {
            const pointsLength = item.points.length;
            if (!item.isClear) {
                item.isClear = false;
                for (let j = 0; j < pointsLength; j++) {
                    if (intersect(clear[i], item.points[j])) {
                        item.isClear = true;
                        break;
                    }
                }
            }
        });
    }
    return all.filter((item) => {
        return !item.isClear;
    });
}

function intersect(a: { x: number; y: number; }, b: { x: number; y: number; }) {
    const dis = Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2)); // Math.sqrt()求平方跟
    if (dis <= circleR) {
        return true;
    }
    return false;
}

export const enum QuestionTypeEnum {
    /**
     * 1 ABC类型选择题
     */
    SELECT_ALPHABAT = 1,
    /**
     *  2 123类型选择题
     */
    SELECT_NUMBER,
    /**
     * 3 TF判断题
     */
    SELECT_TF,
    /**
     * 4√×判断题
     */
    SELECT_OKCANCEL,
    /**
     * 5 填空题
     */
    BLANK,
    /**
     * 6 应用题
     */
    APPLICATION,
    /**
     * 7 语音题
     */
    VOICE,
    /**
     * 8 解答题
     */
    SOLVE,
}

export function getQuestionType (type: number) {
    const typeEnum: Record<number, string> = {
        1: "选择题",
        2: "选择题",
        3: "判断题",
        4: "判断题",
        5: "填空题",
        6: "应用题",
        7: "语音题",
        8: "解答题"
    };
    return typeEnum[type] || "";
}
