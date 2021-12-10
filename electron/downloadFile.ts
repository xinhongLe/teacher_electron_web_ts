import { ipcMain, BrowserWindow, shell, session } from "electron";
import { resolve } from "path";
import { access } from "fs/promises";

const downloadingFileList: string[] = []; // 下载中的文件列表
const appPath = process.platform === "darwin" ? (process.env.HOME || process.env.USERPROFILE) + "/.aixueshi_teacher_files/" : resolve(process.env.APPDATA!, "Aixueshi/files/");
const isExistFile = (filePath: string): Promise<boolean> => {
    return new Promise(resolve => {
        access(filePath).then(() => resolve(true)).catch(() => resolve(false));
    });
};

export default (win: BrowserWindow) => {
    const downloadFile = async (url: string, fileName: string) => {
        const filePath = process.platform === "darwin" ? appPath + fileName : resolve(appPath, fileName);
        if (downloadingFileList.includes(fileName)) return;
        const isExist = await isExistFile(filePath);
        if (isExist) {
            shell.openPath(filePath);
        } else {
            if (!downloadingFileList.includes(fileName)) {
                win.webContents.downloadURL(url);
            }
        }
    };

    ipcMain.handle("downloadFile", (_, url, fileName) => {
        downloadFile(url, fileName);
    });
    session.defaultSession.on("will-download", (event, item, webContents) => {
        const fileName = item.getFilename();
        downloadingFileList.push(fileName);
        const filePath = resolve(appPath, item.getFilename());
        item.setSavePath(filePath);
        item.on("updated", () => {
            // console.log("下载进度", item.getReceivedBytes());
        });
        item.once("done", (event, state) => {
            const index = downloadingFileList.indexOf(fileName);
            downloadingFileList.splice(index, 1);
            if (state === "completed") {
                shell.openPath(filePath);
            }
        });
    });
};
