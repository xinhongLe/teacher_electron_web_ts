"use strict";

import { app, protocol, BrowserWindow, ipcMain, Menu } from "electron";
// import installExtension, { VUEJS3_DEVTOOLS } from "electron-devtools-installer";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import { initialize } from "@electron/remote/main";
import { createSuspensionWindow, registerEvent, unfoldSuspensionWinSendMessage } from "./suspension";
import downloadFile from "./downloadFile";
import autoUpdater from "./autoUpdater";
import SingalRHelper from "./singalr";
import ElectronLog from "electron-log";
import os from 'os';
import { exec, spawn } from 'child_process';
const isDevelopment = process.env.NODE_ENV !== "production";
import path from "path";
initialize();

protocol.registerSchemesAsPrivileged([
    { scheme: "app", privileges: { secure: true, standard: true } },
    {
        scheme: "http",
        privileges: {
            bypassCSP: true,
            secure: true,
            supportFetchAPI: true,
            corsEnabled: true
        }
    }
]);

let mainWindow: BrowserWindow | null;
let singalr: SingalRHelper | null;

async function createWindow() {
    if (!process.env.WEBPACK_DEV_SERVER_URL) {
        const menu = Menu.buildFromTemplate([]);
        Menu.setApplicationMenu(menu);
    }
    mainWindow = new BrowserWindow({
        height: 520,
        useContentSize: true,
        width: 750,
        frame: false,
        minWidth: 750,
        minHeight: 520,
        show: false,
        webPreferences: {
            enableRemoteModule: true,
            webviewTag: true,
            webSecurity: false, // 取消跨域限制
            nodeIntegration: true,
            contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
            preload: path.join(__dirname, "preload.js"),
            devTools: !!process.env.WEBPACK_DEV_SERVER_URL
        }
    });
    downloadFile();
    autoUpdater(mainWindow!);
    createSuspensionWindow();
    registerEvent();

    if (process.env.WEBPACK_DEV_SERVER_URL) {
        require("@electron/remote/main").enable(mainWindow.webContents);
        mainWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
        if (!process.env.IS_TEST) mainWindow.webContents.openDevTools();
    } else {
        createProtocol("app");
        require("@electron/remote/main").enable(mainWindow.webContents);
        mainWindow.loadURL("app://./index.html");
    }

    mainWindow.on("ready-to-show", () => {
        mainWindow!.show();
        ElectronLog.info("app show");
    });

    mainWindow.on("closed", () => {
        if (process.platform !== "darwin") {
            app.quit();
        }
        mainWindow = null;
    });

    ipcMain.on("startSingalR", (e, data) => {
        if (singalr) {
            singalr.disconnect();
        }
        if (mainWindow) {
            singalr = new SingalRHelper(data, mainWindow);
            singalr.start();
        }
    });

    ipcMain.on("stopSingalR", () => {
        if (singalr) {
            singalr.disconnect();
        }
    });

    ipcMain.on("maximizeWindow", (e) => {
        mainWindow!.maximize();
    });

    ipcMain.on("unmaximizeWindow", (e) => {
        mainWindow!.unmaximize();
    });

    ipcMain.handle("exitApp", () => {
        mainWindow!.show();
        mainWindow!.webContents.send("exitApp");
    });

    ipcMain.on("openVideoWin", () => {
        mainWindow!.show();
        mainWindow!.webContents.send("openVideoWin");
    });

    ipcMain.handle("openVideoWin", () => {
        mainWindow!.show();
        mainWindow!.webContents.send("openVideoWin");
    });

    ipcMain.on("closeVideoWin", () => {
        mainWindow!.webContents.send("closeVideoWin");
    });

    ipcMain.handle("closeVideoWin", () => {
        mainWindow!.webContents.send("closeVideoWin");
    });

    ipcMain.on("openQuestion", () => {
        mainWindow!.show();
        mainWindow!.webContents.send("openQuestion");
    });

    ipcMain.handle("openQuestion", () => {
        mainWindow!.show();
        mainWindow!.webContents.send("openQuestion");
    });

    ipcMain.on("closeQuestion", () => {
        mainWindow!.webContents.send("closeQuestion");
    });

    ipcMain.handle("closeQuestion", () => {
        mainWindow!.webContents.send("closeQuestion");
    });

    ipcMain.handle("openVirtualKeyBoard", () => {
        if (os.platform() === "win32") {
            exec("osk", (err) => {
                ElectronLog.error(err);
            });
        } else {
            exec("onboard");
        }
    });

    ipcMain.handle("fetchSubjectPublisherBookList", () => {
        return new Promise((resolve) => {
            ipcMain.once("fetchSubjectPublisherBookList", (_, data) => {
                resolve(data);
            });
            mainWindow!.webContents.send("fetchSubjectPublisherBookList");
        });
    });

    ipcMain.handle("openWindow", (_, data) => {
        mainWindow && mainWindow.webContents.send("openWindow", data);
    });

    ipcMain.handle("lookVideo", (_, data) => {
        mainWindow && mainWindow.webContents.send("lookVideo", data);
    });

    ipcMain.handle("lookQuestions", (_, data) => {
        mainWindow && mainWindow.webContents.send("lookQuestions", data);
    });

    // 上课消息通知
    ipcMain.on("attendClass", (e, to, data) => {
        if (to === "unfoldSuspension") unfoldSuspensionWinSendMessage("attendClass", data);
        if (to === "main") mainWindow!.webContents.send("attendClass", data)
    });
}

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("will-quit", () => {
    ElectronLog.info("app quit");
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on("ready", async () => {
    ElectronLog.info("app ready");
    // if (isDevelopment && !process.env.IS_TEST) {
    //     try {
    //         await installExtension(VUEJS3_DEVTOOLS);
    //     } catch (e) {
    //         console.error("Vue Devtools failed to install:", e);
    //     }
    // }
    createWindow();
});

app.on("render-process-gone", (event, webContents, details) => {
    ElectronLog.error(`render-process-gone, webContents title: ${webContents.getTitle()}, reason: ${details.reason}, exitCode: ${details.exitCode}`);
});

app.on("child-process-gone", (event, details) => {
    const { type, reason, exitCode, serviceName, name } = details;
    ElectronLog.error(`child-process-gone, reason: ${reason}, exitCode: ${exitCode}, type:${type}, serviceName: ${serviceName}, name: ${name}`);
});

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
    app.quit();
} else {
    app.on("second-instance", (event, commandLine, workingDirectory) => {
        // 当运行第二个实例时,将会聚焦到mainWindow这个窗口
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.focus();
            mainWindow.show();
        }
    });
}

if (isDevelopment) {
    if (process.platform === "win32") {
        process.on("message", (data) => {
            if (data === "graceful-exit") {
                app.quit();
            }
        });
    } else {
        process.on("SIGTERM", () => {
            app.quit();
        });
    }
}
