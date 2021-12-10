import { BrowserWindow, ipcMain } from "electron";
import { autoUpdater } from "electron-updater";
export default (win: BrowserWindow) => {
    function sendUpdateMessage(text: string) {
        win.webContents.send("updateMessage", text);
    }

    // 自动更新
    // 执行自动更新检查
    const feedUrl = "https://app-v.oss-cn-shanghai.aliyuncs.com/teacherElectron/build/"; // 更新包位置
    if (process.platform === "win32") {
        autoUpdater.setFeedURL(feedUrl);
        autoUpdater.autoDownload = false;
        const log = require("electron-log");
        autoUpdater.logger = log;
        const message = {
            error: "检查更新出错",
            checking: "正在检查更新……",
            updateAva: "检测到新版本",
            updateNotAva: "现在使用的就是最新版本，不用更新"
        };

        // 当更新发生错误的时候触发
        autoUpdater.on("error", () => {
            sendUpdateMessage(message.error);
        });

        // 当开始检查更新的时候触发
        autoUpdater.on("checking-for-update", function() {
            sendUpdateMessage(message.checking);
        });

        // 当有可用更新的时候触发
        autoUpdater.on("update-available", function(info) {
            sendUpdateMessage(message.updateAva);
            ipcMain.handle("isUpdateNow", (e, arg) => {
                // some code here to handle event
                autoUpdater.downloadUpdate();
            });
            win.webContents.send("isUpdateNow");
        });

        // 当没有可用更新的时候触发
        autoUpdater.on("update-not-available", function() {
            sendUpdateMessage(message.updateNotAva);
        });

        // 更新下载进度事件
        autoUpdater.on("download-progress", function(progressObj) {
            win.webContents.send("downloadProgress", progressObj);
        });

        // 在更新下载完成的时候触发
        autoUpdater.on("update-downloaded", function(
            event,
            releaseNotes,
            releaseName,
            releaseDate,
            updateUrl,
            quitAndUpdate
        ) {
            autoUpdater.quitAndInstall();
        });

        // //执行自动更新检查
        ipcMain.handle("checkForUpdate", () => {
            autoUpdater.checkForUpdates();
        });
    }
};
