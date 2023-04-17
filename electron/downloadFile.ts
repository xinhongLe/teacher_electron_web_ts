import { app, ipcMain } from "electron";
import { resolve } from "path";
import { access, mkdir } from "fs/promises";
import Axios from "Axios";
import { createWriteStream, createReadStream } from "fs";
import ElectronLog from "electron-log";
import Store from "electron-store";
const crypto = require("crypto");
type func = (value: unknown) => void;

export const store = new Store({
    watch: true,
});
const downloadingFileList: string[] = []; // 下载中的文件列表
const downloadSuccessCallbackMap = new Map<string, func[]>();
export const isExistFile = (filePath: string): Promise<boolean> => {
    return new Promise((resolve) => {
        access(filePath)
            .then(() => {
                // ElectronLog.info("filePath", filePath);
                // resolve(true);
                // const fileName = filePath.substring(filePath.lastIndexOf("\\") + 1, filePath.lastIndexOf("."));
                const fileName = filePath.replaceAll("\\", "/").replace(/(.*\/)*([^.]+).*/gi, "$2");
                const hash = crypto.createHash("md5");
                createReadStream(filePath)
                    .on("data", (chunk: any) => {
                        hash.update(chunk, "utf8");
                    })
                    .on("end", () => {
                        const md5 = hash.digest("hex");
                        return resolve(
                            md5.toLocaleLowerCase() ===
                            fileName.toLocaleLowerCase()
                        );
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
        callbackList.forEach((callback) =>
            callback(filePath.replaceAll("\\", "/"))
        );
        ElectronLog.info(callbackList.length, fileName);
        downloadSuccessCallbackMap.delete(fileName);
    }
};

export const mkdirs = (dirname: string) => {
    return new Promise((resolve) => {
        access(dirname)
            .then(() => resolve(dirname))
            .catch(() =>
                mkdir(dirname, { recursive: true })
                    .then(() => resolve(dirname))
                    .catch(() => resolve(""))
            );
    });
};

export const downloadFileAxios = async (url: string, fileName: string) => {
    const downloadsPath = resolve(app.getPath("userData"), "files");
    const filePath = resolve(downloadsPath, fileName);
    const dirname = await mkdirs(downloadsPath);
    if (!dirname) {
        return dealCallback(fileName, "");
    }

    try {
        // ElectronLog.info("start downloadFile fileName:", fileName);
        const response = await Axios({
            url,
            method: "GET",
            responseType: "stream"
        });

        const writer = createWriteStream(filePath);

        // ElectronLog.info(
        //     "downloadFileAxios status: ",
        //     response.status,
        //     "fileName:",
        //     fileName
        // );
        if (response.status === 200) {
            response.data.pipe(writer);
        } else {
            writer.destroy();
        }

        const state = await new Promise((resolve) => {
            writer.on("finish", () => {
                // ElectronLog.info("finish fileName:", fileName);
                resolve(true);
            });
            writer.on("error", (err) => {
                // ElectronLog.info("error fileName", fileName, err.message);
                resolve(false);
            });
            writer.on("close", () => {
                // ElectronLog.info("close fileName", fileName);
                resolve(false);
            });
        });
        const index = downloadingFileList.indexOf(fileName);
        downloadingFileList.splice(index, 1);
        dealCallback(fileName, state ? filePath : "");
    } catch {
        // ElectronLog.info("start downloadFile fileName error:", fileName);
        dealCallback(fileName, "");
        const index = downloadingFileList.indexOf(fileName);
        if (index > -1) downloadingFileList.splice(index, 1);
    }
};

export const downloadFileToPath = async (
    url: string,
    fileName: string,
    path: string
): Promise<boolean> => {
    const writer = createWriteStream(path);
    const response = await Axios({
        url,
        method: "GET",
        responseType: "stream",
    });
    if (response.status === 200) {
        response.data.pipe(writer);
    } else {
        writer.destroy();
    }

    return new Promise((resolve) => {
        writer.on("finish", () => {
            ElectronLog.info("finish fileName:", fileName);
            resolve(true);
        });
        writer.on("error", (err) => {
            ElectronLog.info("error fileName", fileName, err.message);
            resolve(false);
        });
        writer.on("close", () => {
            ElectronLog.info("close fileName", fileName);
            resolve(false);
        });
    });
};

export default () => {
    const downloadFile = async (url: string, fileName: string) => {
        const downloadsPath = resolve(app.getPath("userData"), "files");
        const filePath = resolve(downloadsPath, fileName);
        await mkdirs(downloadsPath);
        const isExist = await isExistFile(filePath);
        if (isExist) {
            dealCallback(fileName, filePath);
        } else {
            if (!downloadingFileList.includes(fileName)) {
                downloadingFileList.push(fileName);
                downloadFileAxios(url, fileName);
            }
        }
    };

    ipcMain.handle("downloadFile", (_, url, fileName) => {
        return new Promise(resolve => {
            if (downloadSuccessCallbackMap.has(fileName)) {
                const callbackList = downloadSuccessCallbackMap.get(fileName) || [];
                downloadSuccessCallbackMap.set(fileName, [
                    ...callbackList,
                    resolve,
                ]);
            } else {
                downloadSuccessCallbackMap.set(fileName, [resolve]);
                downloadFile(url, fileName);
            }
        });
    });

    ipcMain.handle(
        "downloadFileToPath",
        (_, url: string, fileName: string, path: string) => {
            return downloadFileToPath(url, fileName, path);
        }
    );
};
