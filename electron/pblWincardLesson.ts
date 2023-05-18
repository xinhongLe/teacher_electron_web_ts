import { BrowserWindow, ipcMain } from "electron";
import { createWindow } from "./createWindow";
let editWin: BrowserWindow | null;
const wincardURL = process.env.NODE_ENV === "development" ? `${process.env.WEBPACK_DEV_SERVER_URL}pblEditWinCardLesson.html` : `file://${__dirname}/pblEditWinCardLesson.html`;

export function createWinCardWindow(title: string) {
    editWin = createWindow(wincardURL + "?" + title, {
        autoHideMenuBar: true,
        alwaysOnTop: false,
        title: title,
        frame: false, // 要创建无边框窗口
        resizable: true // 禁止窗口大小缩放
        // useContentSize: true,
    });

    editWin && editWin.webContents.openDevTools(); // 打开调试器
    // require("@electron/remote/main").enable(editWin.webContents);
    // editWin.loadURL(wincardURL);
    editWin.maximize();
}

export function registerPblWinCardLessonEvent() {
    ipcMain.handle("openPblWinCardWinLesson", (_, data) => {
        createWinCardWindow(data);
    });
}
export function openWinCardWin() {
    editWin && editWin.show();
}
