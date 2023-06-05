import { BrowserWindow, ipcMain } from "electron";
import { createWindow } from "./createWindow";

export function createWinCardWindow(title: string, windowUrl: string) {

    const editWin = createWindow(windowUrl + "?" + title, {
        autoHideMenuBar: true,
        alwaysOnTop: false,
        title: title,
        frame: false, // 要创建无边框窗口
        resizable: true, // 禁止窗口大小缩放
        // useContentSize: true,
    });

    editWin && editWin.webContents.openDevTools(); // 打开调试器
    editWin.maximize();
}

export function registerPblWinCardEvent() {
    const windowUrl = createUrl("pblEditWinCard.html");
    ipcMain.handle("openWinCard", (_, data) => {
        createWinCardWindow(data, windowUrl);
    });
    // ipcMain.handle("closeWinCard", () => {
    //     console.log("sssss", 123123);
    // });
}

export function registerPblWinCardLessonEvent() {
    const windowUrl = createUrl("pblEditWinCardLesson.html");
    ipcMain.handle("openPblWincardLesson", (_, data) => {
        createWinCardWindow(data, windowUrl);
    });
}

export function registerPreviewFileEvent() {
    const windowUrl = createUrl("pblFilePreview.html");
    ipcMain.handle("openPreviewFile", (_, data) => {
        createWinCardWindow(data, windowUrl);
    });
}

function createUrl(url: string) {
    return process.env.NODE_ENV === "development"
        ? `${process.env.WEBPACK_DEV_SERVER_URL}${url}`
        : `file://${__dirname}/${url}`;
}
