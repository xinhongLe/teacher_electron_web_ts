import { createWindow } from "./createWindow";

const wincardURL = process.env.NODE_ENV === "development" ? `${process.env.WEBPACK_DEV_SERVER_URL}editWinCard.html` : `file://${__dirname}/editWinCard.html`;

export function createWinCardWindow(title: string) {
    const editWin = createWindow(wincardURL + "?" + title, {
        autoHideMenuBar: true,
        alwaysOnTop: false,
        title: title,
        frame: false, // 要创建无边框窗口
        resizable: true // 禁止窗口大小缩放
        // useContentSize: true,
    });
    editWin && editWin.webContents.openDevTools(); // 打开调试器

    editWin.maximize();

    return editWin;
}
