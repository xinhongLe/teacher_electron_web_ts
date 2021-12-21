"use strict";

import { app, protocol, BrowserWindow, ipcMain, Menu } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import { initialize } from "@electron/remote/main";
import { createSuspensionWindow, registerEvent } from "./suspension";
import downloadFile from "./downloadFile";
import autoUpdater from "./autoUpdater";
const isDevelopment = process.env.NODE_ENV !== "production";
const path = require("path");
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
            devTools: !!process.env.WEBPACK_DEV_SERVER_URL,
            enableRemoteModule: true
        }
    });
    downloadFile(mainWindow);
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
    });

    mainWindow.on("closed", () => {
        if (process.platform !== "darwin") {
            app.quit();
        }
        mainWindow = null;
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

    ipcMain.handle("openVideoWin", () => {
        mainWindow!.show();
        mainWindow!.webContents.send("openVideoWin");
    });

    ipcMain.handle("closeVideoWin", () => {
        mainWindow!.webContents.send("closeVideoWin");
    });

    ipcMain.handle("openQuestion", () => {
        mainWindow!.show();
        mainWindow!.webContents.send("openQuestion");
    });

    ipcMain.handle("closeQuestion", () => {
        mainWindow!.webContents.send("closeQuestion");
    });
}

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on("ready", async () => {
    if (isDevelopment && !process.env.IS_TEST) {
        try {
            // await installExtension(VUEJS_DEVTOOLS);
        } catch (e) {
            console.error("Vue Devtools failed to install:", e);
        }
    }
    createWindow();
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
