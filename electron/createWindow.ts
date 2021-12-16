import { BrowserWindow, BrowserWindowConstructorOptions } from "electron";
const path = require("path");

export const createWindow = (url: string, option: BrowserWindowConstructorOptions) => {
    const win = new BrowserWindow({
        ...option,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, "preload.js"),
            nodeIntegrationInWorker: true,
            contextIsolation: false,
            devTools: false,
            ...option.webPreferences
        }
    });

    require("@electron/remote/main").enable(win.webContents);
    win.loadURL(url);
    // win.webContents.openDevTools();
    return win;
};
