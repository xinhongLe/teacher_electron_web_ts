import Node from "element-plus/es/components/tree/src/model/node";

export default () => {
    const allowDrop = (draggingNode: Node, dropNode: Node, type: any) => {
        if ((draggingNode.data.PageList && dropNode.data.PageList && type !== "inner") ||
            (!draggingNode.data.PageList && !dropNode.data.PageList && type !== "inner") ||
            (!draggingNode.data.PageList && dropNode.data.PageList && type === "inner")
        ) {
            return true;
        } else {
            return false;
        }
    };

    return {
        allowDrop
    };
};
