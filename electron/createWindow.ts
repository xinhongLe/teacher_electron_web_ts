import { BrowserWindow, BrowserWindowConstructorOptions } from "electron";

const path = require("path");

export const createWindow = (url: string, option: BrowserWindowConstructorOptions) => {
    const win = new BrowserWindow({
        ...option,
        webPreferences: {
            webSecurity: false, // 取消跨域限制
            // enableRemoteModule: true,
            nodeIntegration: true,
            preload: path.join(__dirname, "preload.js"),
            nodeIntegrationInWorker: true,
            contextIsolation: false,
            devTools: !!process.env.WEBPACK_DEV_SERVER_URL,
            ...option.webPreferences
        }
    });

    require("@electron/remote/main").enable(win.webContents);
    win.loadURL(url);
    // win.webContents.openDevTools();
    return win;
};
