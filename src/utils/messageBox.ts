import { ElMessageBox } from "element-plus";
import "element-plus/theme-chalk/el-message-box.css";

interface paramsProps {
    content: string
    title?: string
    showCancelButton?: boolean
}

function messageBox({ content, title = "提示", showCancelButton = true }: paramsProps) {
    let message = `
        <span class="messageBox-title">${title}</span>
        <span>${content}</span>
    `;
    if (!title) {
        message = `<span>${content}</span>`;
    }
    return ElMessageBox.confirm(message, {
        type: "warning",
        showClose: false,
        showCancelButton,
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        dangerouslyUseHTMLString: true
    });
}

export default messageBox;
