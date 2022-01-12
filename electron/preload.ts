import { getCurrentWindow, app } from "@electron/remote";
import electron, { remote } from "electron";
import { appPath, isExistFile } from "./downloadFile";
import { resolve } from "path";
import ElectronLog from "electron-log";
import fs from "fs";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
window.electron = {
    maximizeWindow: () => {
        const currentWindow = getCurrentWindow();
        if (currentWindow.isFullScreen()) {
            currentWindow.setFullScreen(false);
        } else if (currentWindow.isMaximized()) {
            currentWindow.setFullScreen(true);
        } else {
            currentWindow.maximize();
        }
    },
    unmaximizeWindow: () => {
        const currentWindow = getCurrentWindow();
        if (currentWindow.isFullScreen()) {
            currentWindow.setFullScreen(false);
            currentWindow.unmaximize();
        } else {
            currentWindow.unmaximize();
        }
    },
    minimizeWindow: () => {
        const currentWindow = getCurrentWindow();
        if (currentWindow.isFullScreen()) {
            currentWindow.setFullScreen(false);
        } else {
            currentWindow.minimize();
        }
    },
    isFullScreen: () => {
        const currentWindow = getCurrentWindow();
        return currentWindow.isFullScreen();
    },
    setFullScreen: () => {
        const currentWindow = getCurrentWindow();
        currentWindow.setFullScreen(true);
    },
    hideWindow: () => {
        const currentWindow = getCurrentWindow();
        currentWindow.hide();
    },
    showWindow: () => {
        const currentWindow = getCurrentWindow();
        currentWindow.show();
    },
    destroyWindow: () => {
        const currentWindow = getCurrentWindow();
        currentWindow.destroy();
    },
    setContentSize: (width: number, height: number) => {
        const currentWindow = getCurrentWindow();
        currentWindow.setContentSize(width, height);
    },
    setCenter: () => {
        getCurrentWindow().center();
    },
    exit: () => {
        app.quit();
    },
    getVersion: () => {
        return remote.app.getVersion();
    },
    isMac: (): boolean => {
        return process.platform === "darwin";
    },
    registerEscKeyUp: (callback: () => void) => {
        remote.globalShortcut.register("esc", () => {
            callback && callback();
        });
    },
    unRegisterEscKeyUp: () => {
        remote.globalShortcut.unregister("esc");
    },
    isExistFile: (fileName: string) => {
        const filePath =
            process.platform === "darwin"
                ? appPath + fileName
                : resolve(appPath, fileName);
        return isExistFile(filePath);
    },
    getFilePath: (fileName: string) => {
        const filePath =
        process.platform === "darwin"
            ? appPath + fileName
            : resolve(appPath, fileName);
        return filePath;
    },
    log: ElectronLog,
    getCacheFile: async (fileName: string) => {
        if (!fileName) return "";
        const filePath = process.platform === "darwin" ? appPath + fileName : resolve(appPath, fileName);
        const isExist = await isExistFile(filePath);
        return isExist ? "file://" + filePath.split("\\").join("/") : "";
    },
    getCachePath: (path: string) => {
        return process.platform === "darwin" ? appPath + path : resolve(appPath, path);
    },
    readFile: (path: string, callback: (buffer: ArrayBuffer) => void) => {
        fs.readFile(path, (err, buffer) => {
            if (err) {
                ElectronLog.error("读取资源文件失败：", err);
            } else {
                callback(buffer);
            }
        });
    },
    savePutFile: (path: string, buffer: NodeJS.ArrayBufferView) => {
        fs.writeFile(path, buffer, err => {
            if (err) {
                ElectronLog.error("写入资源文件失败：", err);
            }
        });
    },
    ...electron
};
