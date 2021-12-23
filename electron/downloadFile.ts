import { ipcMain, BrowserWindow, session } from "electron";
import { resolve } from "path";
import { access, readFile } from "fs/promises";
import SparkMD5 from "spark-md5";

type func = (value: unknown) => void;

const downloadingFileList: string[] = []; // 下载中的文件列表
const downloadSuccessCallbackMap = new Map<string, func[]>();
export const appPath =
    process.platform === "darwin"
        ? (process.env.HOME || process.env.USERPROFILE) +
          "/.aixueshi_teacher_files/"
        : resolve(process.env.APPDATA!, "Aixueshi/files/");
export const isExistFile = (filePath: string): Promise<boolean> => {
    return new Promise((resolve) => {
        access(filePath)
            .then(() => {
                readFile(filePath).then((data) => {
                    const fileName = filePath.substring(filePath.lastIndexOf("\\") + 1, filePath.indexOf("."));
                    const spark = new SparkMD5.ArrayBuffer();
                    spark.append(data);
                    const md5 = spark.end();
                    return resolve(md5.toLocaleLowerCase() === fileName.toLocaleLowerCase());
                }).catch(() => {
                    return resolve(false);
                });
            })
            .catch(() => {
                resolve(false);
            });
    });
};

const dealCallback = (fileName: string, filePath: string) => {
    if (downloadSuccessCallbackMap.has(fileName)) {
        const callbackList = downloadSuccessCallbackMap.get(fileName) || [];
        callbackList.forEach((callback) => callback(filePath));
        downloadSuccessCallbackMap.delete(fileName);
    }
};

export default (win: BrowserWindow) => {
    const downloadFile = async (url: string, fileName: string) => {
        const filePath =
            process.platform === "darwin"
                ? appPath + fileName
                : resolve(appPath, fileName);
        if (downloadingFileList.includes(fileName)) return;
        const isExist = await isExistFile(filePath);
        if (isExist) {
            dealCallback(fileName, filePath);
        } else {
            if (!downloadingFileList.includes(fileName)) {
                win.webContents.downloadURL(url);
            }
        }
    };

    ipcMain.handle("downloadFile", (_, url, fileName) => {
        return new Promise((resolve) => {
            if (downloadSuccessCallbackMap.has(fileName)) {
                const callbackList =
                    downloadSuccessCallbackMap.get(fileName) || [];
                downloadSuccessCallbackMap.set(fileName, [
                    ...callbackList,
                    resolve
                ]);
            } else {
                downloadSuccessCallbackMap.set(fileName, [resolve]);
            }
            downloadFile(url, fileName);
        });
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
            dealCallback(fileName, state === "completed" ? filePath : "");
        });
    });
};
