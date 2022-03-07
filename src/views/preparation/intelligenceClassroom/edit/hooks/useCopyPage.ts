import { ICopyPage } from "@/api/home";
import { ICardList } from "@/types/home";
import { ElMessage } from "element-plus";
import Node from "element-plus/es/components/tree/src/model/node";

export default (copyPage:(data: ICopyPage) => void) => {
    let copyValue = {
        OldCardID: "",
        PageID: "",
        Name: ""
    };
    const handleCopy = (node: Node, data: ICardList) => {
        copyValue = {
            OldCardID: node.parent.data.ID,
            PageID: data.ID,
            Name: data.Name
        };
        if (copyValue.OldCardID && copyValue.PageID) {
            ElMessage({ type: "success", message: "复制页成功" });
        }
    };

    const handlePaste = (data: ICardList) => {
        if (copyValue.OldCardID && copyValue.PageID) {
            const value = {
                ...copyValue,
                CardID: data.ID
            };
            copyPage(value);
        } else {
            ElMessage({ type: "warning", message: "请先复制页" });
        }
    };

    return {
        handleCopy,
        handlePaste
    };
};
