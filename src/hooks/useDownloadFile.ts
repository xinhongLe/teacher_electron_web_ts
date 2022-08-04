import { ElMessage } from "element-plus";
import loading from "@/components/loading";

export default () => {
    const download = (url: string, fileName: string) => {
        return new Promise((resove, reject) => {
            (window as any).electron.remote.dialog.showSaveDialog({
                title: "选择要保存的位置",
                buttonLabel: "确定",
                defaultPath: fileName
            }).then(async (file: any) => {
                if (file.canceled) {
                    resove(false);
                } else {
                    loading.show();
                    console.log(url);
                    const success = await window.electron.ipcRenderer.invoke("downloadFileToPath", url, fileName, file.filePath);
                    loading.destroy();
                    resove(success);
                }
            }).catch((err: any) => {
                ElMessage({ type: "error", message: "下载失败" });
                resove(false);
                if ((window as any).electron && (window as any).electron.log) {
                    (window as any).electron.log.error(err);
                }
            });
        });
    };

    return {
        download
    };
};
