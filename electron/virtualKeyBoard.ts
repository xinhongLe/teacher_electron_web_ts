import {BrowserWindow, ipcMain} from "electron";
import {createWindow} from "./createWindow";
import ElectronLog from "electron-log";

let virtualKeyBoardWin: BrowserWindow | null;
const wincardURL = process.env.NODE_ENV === "development" ? `${process.env.WEBPACK_DEV_SERVER_URL}virtualKeyBoard.html` : `file://${__dirname}/virtualKeyBoard.html`;

export function createWinCardWindow() {
    const {screen} = require('electron');
    let display = screen.getPrimaryDisplay();
    let x = display.bounds.x + (display.bounds.width - 1200) / 2;
    virtualKeyBoardWin = createWindow(wincardURL + "?" + '键盘', {
        height: 278,
        useContentSize: true,
        width: 1200,
        autoHideMenuBar: true,
        alwaysOnTop: false,
        title: '键盘',
        // frame: false, // 要创建无边框窗口
        resizable: true, // 禁止窗口大小缩放
        x: x,
        y: 50,
        maxHeight: 280,
        minHeight: 280,
        maxWidth: 1200
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
    virtualKeyBoardWin && virtualKeyBoardWin.webContents.openDevTools(); // 打开调试器
    virtualKeyBoardWin.on("closed", () => {
        virtualKeyBoardWin = null;
    });

    // require("@electron/remote/main").enable(editWin.webContents);
    // editWin.loadURL(wincardURL);
    // virtualKeyBoardWin.maximize();
}

export function registerVirtualKeyBoard() {
    ipcMain.handle("openVirtualKeyBoardWin", (_, data) => {
        !virtualKeyBoardWin && createWinCardWindow();
    });
}

export function openWinCardWin() {
    virtualKeyBoardWin && virtualKeyBoardWin.show();
}

export function closeKeyBoard() {
    virtualKeyBoardWin && virtualKeyBoardWin.destroy();
}

