import { ipcMain, BrowserWindow, session } from "electron";
import { resolve } from "path";
import { access } from "fs/promises";
import { createReadStream } from "original-fs";
const crypto = require("crypto");

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
                // resolve(true);
                const fileName = filePath.substring(filePath.lastIndexOf("\\") + 1, filePath.lastIndexOf("."));
                const hash = crypto.createHash("md5");
                createReadStream(filePath)
                    .on("data", (chunk: any) => {
                        hash.update(chunk, "utf8");
                    })
                    .on("end", () => {
                        const md5 = hash.digest("hex");
                        return resolve(md5.toLocaleLowerCase() === fileName.toLocaleLowerCase());
                    })
                    .on("error", () => {
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
        callbackList.forEach((callback) => callback(filePath.replaceAll("\\", "/")));
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
            console.log(isExist, filePath);
            dealCallback(fileName, filePath);
        } else {
            if (!downloadingFileList.includes(fileName)) {
                downloadingFileList.push(fileName);
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
        const fileExtension = fileName.split(".")[
            fileName.split(".").length - 1
        ];
        const filePath = resolve(appPath, item.getFilename());
        if (downloadingFileList.includes(fileName) || fileExtension === "xml") {
            item.setSavePath(filePath);
        }

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
