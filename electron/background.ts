import os from "os";
import path from "path";
import {exec} from "child_process";
import SingalRHelper from "./singalr";
import ElectronLog from "electron-log";
import downloadFile, {store} from "./downloadFile";
import {STORAGE_TYPES} from "@/utils/storage";
import {createWinCardWindow} from "./wincard";
import {initialize, enable} from "@electron/remote/main";
import {createProtocol} from "vue-cli-plugin-electron-builder/lib";
import {app, protocol, BrowserWindow, ipcMain, Menu} from "electron";
import {
    registerVirtualKeyBoard,
    closeKeyBoard,
    setInput,
} from "./virtualKeyBoard";
import {
    createSuspensionWindow,
    createLocalPreviewWindow,
    registerEvent,
    unfoldSuspensionWinSendMessage,
    setCourseSuspensio,
} from "./suspension";

const editWinList = new Map<number, any>();
const isDevelopment = process.env.NODE_ENV !== "production";

initialize();

protocol.registerSchemesAsPrivileged([
    {scheme: "app", privileges: {secure: true, standard: true}},
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

let isCreateWindow = false;
let singalr: SingalRHelper | null;
let mainWindow: BrowserWindow | null;

async function createWindow() {
    if (!process.env.WEBPACK_DEV_SERVER_URL) {
        const menu = Menu.buildFromTemplate([]);
        Menu.setApplicationMenu(menu);
    }
    mainWindow = new BrowserWindow({
        width: 750,
        height: 520,
        show: false,
        frame: false,
        minWidth: 750,
        minHeight: 520,
        useContentSize: true,
        webPreferences: {
            webviewTag: true,
            webSecurity: false, // 取消跨域限制
            nodeIntegration: true,
            // enableRemoteModule: true,
            preload: path.join(__dirname, "preload.js"),
            devTools: !!process.env.WEBPACK_DEV_SERVER_URL,
            contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
        },
    });

    downloadFile();
    if (!isCreateWindow) {
        createSuspensionWindow();
        isCreateWindow = true;
    }

    registerEvent();
    registerVirtualKeyBoard();

    if (process.env.WEBPACK_DEV_SERVER_URL) {
        enable(mainWindow.webContents);
        mainWindow.loadURL(
            isOpenUrl
                ? `${process.env.WEBPACK_DEV_SERVER_URL}home`
                : process.env.WEBPACK_DEV_SERVER_URL
        );
        if (!process.env.IS_TEST) mainWindow.webContents.openDevTools();
    } else {
        enable(mainWindow.webContents);
        mainWindow.loadURL(
            isOpenUrl
                ? "app://./index.html/#/home"
                : "app://./index.html/#/login"
        );
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

    // 上课消息通知
    ipcMain.on("attendClass", (e, to, data) => {
        if (to === "unfoldSuspension") {
            unfoldSuspensionWinSendMessage("attendClass", data);
        }
        if (to === "main") mainWindow!.webContents.send("attendClass", data);
    });

    // 悬浮球点击消息通知事件
    ipcMain.on("suspensionClick", () => {
        // mainWindow!.show();
        // mainWindow!.maximize();
        mainWindow!.webContents.send("suspensionClick");
    });

    // 悬浮球点击事件
    ipcMain.handle("suspensionClick", () => {
        // mainWindow!.show();
        // mainWindow!.maximize();
        mainWindow!.webContents.send("suspensionClick");
    });
    ipcMain.on("data-to-password", (event, data) => {
        // 在这里处理数据
        mainWindow!.webContents.send("dataToPassword", data);
    });
    ipcMain.handle("closeKeyBoard", () => {
        closeKeyBoard();
    });
    ipcMain.handle("setInput", (event, data) => {
        setInput(data);
    });
    ipcMain.on("closeWinCard", (event, data) => {
        editWinList.delete(data);
    });

    ipcMain.handle("openWinCardWin", (_, data) => {
        const editWin = createWinCardWindow(data);
        editWinList.set(editWin.webContents.id, editWin);
    });

    ipcMain.on("replicated", () => {
        for (const editWin of editWinList.values()) {
            editWin.webContents.send("copy-end");
        }
    });
    // 课件大小化
    ipcMain.on("setCourseMinimize", (e, to, data) => {
        if (to === "min") {
            setCourseSuspensio(data);
        }
        if (to === "max")
            mainWindow!.webContents.send("setCourseMaximize", data);
    });
    //
    ipcMain.on("updateSelectClass", (e, v) => {
        mainWindow!.webContents.send("updateSelectClass", v);
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

function createLocalPreview(args: Array<string>) {
    let fileName = "";
    args.forEach((arg) => {
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
let isOpenUrl = false;

app.on("will-finish-launching", () => {
    app.on("open-file", (event, path) => {
        isOpenFile = true;
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

const webOpenUrl = (url: string) => {
    if (url.indexOf("login") > -1) {
        // 登录
        const search = url.substring(url.indexOf("?"), url.length);
        const params = new URLSearchParams(search);
        const token = params.get("token") || "";
        const record = store.get(`VUE_${STORAGE_TYPES.RECORD_LOGIN_LIST}`);
        store.clear();
        store.set(`VUE_${STORAGE_TYPES.SET_TOKEN}`, token);
        record && store.set(`VUE_${STORAGE_TYPES.RECORD_LOGIN_LIST}`, record);
        isOpenUrl = true;
    }
};

app.on("open-url", (_event, url) => {
    webOpenUrl(url);
});

app.on("ready", async () => {
    createProtocol("app");
    let result = false;
    if (process.argv.length > 1) {
        const url = process.argv[1];
        webOpenUrl(url);
    }

    if (app.isPackaged && isOpenFile) {
        result = createLocalPreview(process.argv);
    }

    if (!result && !isOpenFile) {
        createWindow();
    }
    // createLocalPreview(["/Users/admin/Desktop/识字1《春夏秋冬》第一课时(副本).lyxpkg"])
});

app.on("render-process-gone", (event, webContents, details) => {
    ElectronLog.error(
        `render-process-gone, webContents title: ${webContents.getTitle()}, reason: ${
            details.reason
        }, exitCode: ${details.exitCode}`
    );
});

app.on("child-process-gone", (event, details) => {
    const {type, reason, exitCode, serviceName, name} = details;
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

process.on("uncaughtException", function (error) {
    ElectronLog.error(error);
});
