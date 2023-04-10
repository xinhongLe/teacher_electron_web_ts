import { BrowserWindow, ipcMain } from "electron";
import { createWindow } from "./createWindow";
let editWin: BrowserWindow | null;
const wincardURL = process.env.NODE_ENV === "development" ? `${process.env.WEBPACK_DEV_SERVER_URL}editWinCard.html` : `file://${__dirname}/editWinCard.html`;

export function createWinCardWindow(title: string) {
    editWin = createWindow(wincardURL + "?" + title, {
        autoHideMenuBar: true,
        alwaysOnTop: false,
        title: title,
        frame: false, // 要创建无边框窗口
        resizable: true // 禁止窗口大小缩放
        // useContentSize: true,
    });

    // editWin = new BrowserWindow({
    //     title: title,
    //     useContentSize: true,
    //     autoHideMenuBar: true,
    //     frame: false,
    //     webPreferences: {
    //         enableRemoteModule: true,
    //         webviewTag: true,
    //         webSecurity: false, // 取消跨域限制
    //         nodeIntegration: true,
    //         contextIsolation: false,
    //     },
    // });
    editWin && editWin.webContents.openDevTools(); // 打开调试器
    // require("@electron/remote/main").enable(editWin.webContents);
    // editWin.loadURL(wincardURL);
    editWin.maximize();
}

export function registerWinCardEvent() {
    ipcMain.handle("openWinCardWin", (_, data) => {
        createWinCardWindow(data);
    });
    // ipcMain.handle("closeWinCard", () => {
    //     console.log("sssss", 123123);
    // });
    ipcMain.on("replicated", () => {
        console.log(1111);
        editWin && editWin.webContents.send("copy-end");
    });
}
export function openWinCardWin() {
    editWin && editWin.show();
}
