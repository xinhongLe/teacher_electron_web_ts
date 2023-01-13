import { BrowserWindow, ipcMain, app } from "electron";
import { createWindow } from "./createWindow";
import ElectronLog from "electron-log";
let editWin: BrowserWindow | null;
const wincardURL =
    process.env.NODE_ENV === "development"
        ? `${process.env.WEBPACK_DEV_SERVER_URL}editWinCard.html`
        : `file://${__dirname}/editWinCard.html`;
export function createWinCardWindow() {
    editWin = createWindow(wincardURL, {
        autoHideMenuBar: true,
        alwaysOnTop: true,
        show: false,
        title: "编辑",
        // frame: false, // 要创建无边框窗口
        resizable: true, // 禁止窗口大小缩放
        // useContentSize: true,
    });
    editWin.webContents.openDevTools(); //打开调试器

    editWin.on("ready-to-show", () => {
        editWin && editWin.show();
    });
    editWin.on("show", () => {
        // editWin && editWin.webContents.send("sendStoreWindowInfo", windowInfo);
    });
    editWin.on("closed", () => {
        editWin = null;
    });
    editWin.maximize();
}

export function openWinCardWin() {
    // if (editWin) {
    //     return editWin.show();
    // }
    createWinCardWindow();
}
