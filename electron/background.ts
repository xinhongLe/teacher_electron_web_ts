"use strict";

import { app, protocol, BrowserWindow, ipcMain, Menu } from "electron";
// import installExtension, { VUEJS3_DEVTOOLS } from "electron-devtools-installer";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import { initialize } from "@electron/remote/main";
import { createSuspensionWindow, createLocalPreviewWindow, registerEvent, unfoldSuspensionWinSendMessage } from "./suspension";
import autoUpdater from "./autoUpdater";
import SingalRHelper from "./singalr";
import ElectronLog from "electron-log";
import os from "os";
import { exec, spawn } from "child_process";
const isDevelopment = process.env.NODE_ENV !== "production";
import path from "path";
import downloadFile from "./downloadFile";
initialize();

protocol.registerSchemesAsPrivileged([
    { scheme: "app", privileges: { secure: true, standard: true } },
    {
        scheme: "http",
        privileges: {
            bypassCSP: true,
            secure: true,
            supportFetchAPI: true,
            corsEnabled: true,
        },
    },
]);

let mainWindow: BrowserWindow | null;
let singalr: SingalRHelper | null;
let isCreateWindow = false;

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
        },
    });
    mainWindow.setContentProtection(true);
    downloadFile();
    autoUpdater(mainWindow!);
    if (!isCreateWindow) {
        createSuspensionWindow();
        isCreateWindow = true;
    }

    registerEvent();

    if (process.env.WEBPACK_DEV_SERVER_URL) {
        require("@electron/remote/main").enable(mainWindow.webContents);
        mainWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
        if (!process.env.IS_TEST) mainWindow.webContents.openDevTools();
    } else {
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

    // ipcMain.handle("lookVideo", (_, data) => {
    //     mainWindow && mainWindow.webContents.send("lookVideo", data);
    // });

    // ipcMain.handle("lookQuestions", (_, data) => {
    //     mainWindow && mainWindow.webContents.send("lookQuestions", data);
    // });

    // 上课消息通知
    ipcMain.on("attendClass", (e, to, data) => {
        if (to === "unfoldSuspension")
            unfoldSuspensionWinSendMessage("attendClass", data);
        if (to === "main") mainWindow!.webContents.send("attendClass", data);
    });

    //悬浮球点击消息通知事件
    ipcMain.on("suspensionClick", () => {
        // mainWindow!.show();
        // mainWindow!.maximize();
        mainWindow!.webContents.send("suspensionClick");
    });

    //悬浮球点击事件
    ipcMain.handle("suspensionClick", () => {
        // mainWindow!.show();
        // mainWindow!.maximize();
        mainWindow!.webContents.send("suspensionClick");
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

function createLocalPreview(args: Array<string>) {
    let fileName = "";
    args.forEach(arg => {
        if (arg.endsWith(".lyxpkg")) {
            fileName = arg;
        }
    });
    if (fileName) {
        createLocalPreviewWindow(fileName);
        return true;
    }
    return false;
}

let isOpenFile = false;

app.on("will-finish-launching", () => {
    app.on("open-file", (event, path) => {
        isOpenFile = true;
        ElectronLog.info(path);
        event.preventDefault();
        if (app.isReady()) {
            createLocalPreviewWindow(path);
            isOpenFile = false;
        } else {
            app.on("ready", async () => {
                createLocalPreviewWindow(path);
                isOpenFile = false;
            });
        }
    });
});

app.on("ready", async () => {
    ElectronLog.info("app ready", process.argv);
    createProtocol("app");
    let result = false;
    if (app.isPackaged) {
        result = createLocalPreview(process.argv);
    }
    if (!result && !isOpenFile) {
        createWindow();
    }
    // createLocalPreview(["/Users/moneyinto/Desktop/《守株待兔》第一课时.lyxpkg"])
});

app.on("render-process-gone", (event, webContents, details) => {
    ElectronLog.error(
        `render-process-gone, webContents title: ${webContents.getTitle()}, reason: ${details.reason
        }, exitCode: ${details.exitCode}`
    );
});

app.on("child-process-gone", (event, details) => {
    const { type, reason, exitCode, serviceName, name } = details;
    ElectronLog.error(
        `child-process-gone, reason: ${reason}, exitCode: ${exitCode}, type:${type}, serviceName: ${serviceName}, name: ${name}`
    );
});

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
    app.quit();
} else {
    app.on("second-instance", (event, argv, workingDirectory) => {
        // 当运行第二个实例时,将会聚焦到mainWindow这个窗口
        ElectronLog.info("second-args", argv);
        let result = false;
        if (app.isPackaged) {
            result = createLocalPreview(argv);
        }
        if (!result) {
            if (mainWindow) {
                if (mainWindow.isMinimized()) mainWindow.restore();
                mainWindow.focus();
                mainWindow.show();
            } else {
                createWindow();
            }
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
