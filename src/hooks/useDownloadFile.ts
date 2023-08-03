import { ElMessage } from "element-plus";
import loading from "@/components/loading";

export default () => {
    const download = (url: string, fileName: string, fileExtention: string) => {
        return new Promise((resove, reject) => {
            window.electron.remote.dialog.showSaveDialog({
                title: "选择要保存的位置",
                buttonLabel: "确定",
                defaultPath: `${fileName}.${fileExtention}`
            }).then(async (file: any) => {
                if (file.canceled) {
                    resove(false);
                } else {
                    loading.show();
                    const success = await window.electron.ipcRenderer.invoke("downloadFileToPath", url, fileName, file.filePath);
                    loading.destroy();
                    resove(success);
                }
            }).catch((err: any) => {
                ElMessage({ type: "error", message: "下载失败" });
                resove(false);
                if (window.electron && window.electron.log) {
                    window.electron.log.error(err);
                }
            });
        });
    };

    return {
        download
    };
};
