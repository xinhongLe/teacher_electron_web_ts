import { PPTElement } from "wincard";
import { ElMessage } from "element-plus";
import { saveSourceAssembly } from "@/api/material";
import { getElementsMaxSize, getElementsMinPoints } from "@/utils/elementsParse";

export default () => {
    const parseElements = (elements: PPTElement[]) => {
        const { minLeft, minTop } = getElementsMinPoints(elements);
        const offSetElements = elements.map((element: PPTElement) => {
            return {
                ...element,
                left: element.left - minLeft,
                top: element.top - minTop,
                ossSrc: ""
            };
        });

        const { maxWidth, maxHeight } = getElementsMaxSize(offSetElements);

        return {
            elements: { ...elements, ossSrc: "" },
            offSetElements,
            maxWidth,
            maxHeight
        };
    };

    const saveElements = async (elements: PPTElement[], SubjectID: string, TeacherID: string) => {
        const newElements = parseElements(elements);
        const data = {
            Status: 1,
            TeacherID: TeacherID,
            Json: JSON.stringify(newElements),
            SubjectID: SubjectID
        };
        const res: any = await saveSourceAssembly(data);
        if (res.resultCode === 200) {
            ElMessage({ type: "success", message: "组件保存成功" });
            return true;
        } else {
            ElMessage({ type: "warning", message: "组件保存失败" });
            return false;
        }
    };

    return {
        parseElements,
        saveElements
    };
};
