import { getCurrentWindow, app, dialog } from "@electron/remote";
import electron, { OpenDialogOptions, remote, SaveDialogOptions } from "electron";
import { isExistFile, mkdirs, store } from "./downloadFile";
import { join, resolve } from "path";
import ElectronLog from "electron-log";
import fs from "fs";
import { parsePPT, pptParsePath } from "./parsePPT";=
import { execFile as execFileFromAsar } from "child_process";
const PATH_BINARY = join(__dirname, "mockingbot-color-picker-ia32.exe");
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
    showWindow: (isMaximize = false) => {
        const currentWindow = getCurrentWindow();
        currentWindow.show();
        if (isMaximize) {
            currentWindow.maximize();
        }
    },
    destroyWindow: () => {
        const currentWindow = getCurrentWindow();
        currentWindow.destroy();
    },
    setContentSize: (width: number, height: number) => {
        const currentWindow = getCurrentWindow();
        currentWindow.setContentSize(width, height);
    },
    setPositionWin: (x, y) => {
        const currentWindow = getCurrentWindow();
        currentWindow.setPosition(x, y);
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
                ? app.getPath("downloads") + fileName
                : resolve(app.getPath("downloads"), fileName);
        return isExistFile(filePath);
    },
    getFilePath: (fileName: string) => {
        const filePath = process.platform === "darwin" ? app.getPath("downloads") + fileName : resolve(app.getPath("downloads"), fileName);
        return "file:///" + filePath.replaceAll("\\", "/");
    },
    log: ElectronLog,
    getCacheFile: async (fileName: string) => {
        if (!fileName) return "";
        const filePath = process.platform === "darwin" ? app.getPath("downloads") + fileName : resolve(app.getPath("downloads"), fileName);
        const isExist = await isExistFile(filePath);
        return isExist ? "file://" + filePath.split("\\").join("/") : "";
    },
    getCachePath: (path: string) => {
        return process.platform === "darwin" ? app.getPath("downloads") + path : resolve(app.getPath("downloads"), path);
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
    showSaveDialog: (option: SaveDialogOptions) => {
        const currentWindow = getCurrentWindow();
        return dialog.showSaveDialog(currentWindow, option);
    },
    showOpenDialog: (option: OpenDialogOptions) => {
        const currentWindow = getCurrentWindow();
        return dialog.showOpenDialog(currentWindow, option);
    },
    setPath: async (name, path) => {
        await mkdirs(path);
        app.setPath(name, path);
    },
    getPath: (name) => {
        return app.getPath(name);
    },
    getPPTPath: (path) => {
        return join(pptParsePath, path);
    },
    getColorHexRGB: () => {
        return new Promise((resolve, reject) => execFileFromAsar(PATH_BINARY, (error, stdout, stderr) => {
            if (error) return reject(error);
            resolve(stdout);
        }));
    },
    store: store,
    parsePPT,
    ...electron
};
