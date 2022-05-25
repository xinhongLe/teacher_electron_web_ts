import { getCurrentWindow, app, dialog } from "@electron/remote";
import electron, { OpenDialogOptions, remote, SaveDialogOptions } from "electron";
import { isExistFile, mkdirs, store } from "./downloadFile";
import path, { resolve, join } from "path";
import ElectronLog from "electron-log";
import fs from "fs";
import { execFile as execFileFromAsar } from "child_process";
import { darwinGetScreenPermissionGranted, darwinRequestScreenPermissionPopup } from "./darwin";
import { checkWindowSupportNet } from "./util";
import { access, copyFile, mkdir, readFile, rm, stat, writeFile } from "fs/promises";
import crypto from 'crypto';

const PATH_BINARY = process.platform === "darwin" ? join(__dirname, "../ColorPicker") : join(__dirname, "../mockingbot-color-picker-ia32.exe");
// eslint-disable-next-line @typescript-eslint/no-explicit-any
window.electron = {
    maximizeWindow: () => {
        const currentWindow = getCurrentWindow();
        if (currentWindow.isFullScreen()) {
            currentWindow.setFullScreen(false);
        } else if (currentWindow.isMaximized()) {
            currentWindow.setFullScreen(true);
        } else {
            currentWindow.maximize();
        }
    },
    unmaximizeWindow: () => {
        const currentWindow = getCurrentWindow();
        if (currentWindow.isFullScreen()) {
            currentWindow.setFullScreen(false);
            currentWindow.unmaximize();
        } else {
            currentWindow.unmaximize();
        }
    },
    minimizeWindow: () => {
        const currentWindow = getCurrentWindow();
        if (currentWindow.isFullScreen()) {
            currentWindow.setFullScreen(false);
        } else {
            currentWindow.minimize();
        }
    },
    isFullScreen: () => {
        const currentWindow = getCurrentWindow();
        return currentWindow.isFullScreen();
    },
    setFullScreen: () => {
        const currentWindow = getCurrentWindow();
        currentWindow.setFullScreen(true);
    },
    hideWindow: () => {
        const currentWindow = getCurrentWindow();
        currentWindow.hide();
    },
    showWindow: () => {
        const currentWindow = getCurrentWindow();
        currentWindow.show();
    },
    destroyWindow: () => {
        const currentWindow = getCurrentWindow();
        currentWindow.destroy();
    },
    setContentSize: (width: number, height: number) => {
        const currentWindow = getCurrentWindow();
        currentWindow.setContentSize(width, height);
    },
    setPositionWin: (x, y) => {
        const currentWindow = getCurrentWindow();
        currentWindow.setPosition(x, y);
    },
    setCenter: () => {
        getCurrentWindow().center();
    },
    exit: () => {
        app.quit();
    },
    getVersion: () => {
        return remote.app.getVersion();
    },
    isMac: (): boolean => {
        return process.platform === "darwin";
    },
    registerEscKeyUp: (callback: () => void) => {
        remote.globalShortcut.register("esc", () => {
            callback && callback();
        });
    },
    unRegisterEscKeyUp: () => {
        remote.globalShortcut.unregister("esc");
    },
    isExistFile: (fileName: string) => {
        const filePath =
            process.platform === "darwin"
                ? app.getPath("downloads") + fileName
                : resolve(app.getPath("downloads"), fileName);
        return isExistFile(filePath);
    },
    getFilePath: (fileName: string) => {
        const filePath = process.platform === "darwin" ? app.getPath("downloads") + fileName : resolve(app.getPath("downloads"), fileName);
        return "file:///" + filePath.replaceAll("\\", "/");
    },
    log: ElectronLog,
    getCacheFile: async (fileName: string) => {
        if (!fileName) return "";
        const filePath = process.platform === "darwin" ? app.getPath("downloads") + fileName : resolve(app.getPath("downloads"), fileName);
        const isExist = await isExistFile(filePath);
        return isExist ? "file://" + filePath.split("\\").join("/") : "";
    },
    getCachePath: (path: string) => {
        return process.platform === "darwin" ? app.getPath("downloads") + path : resolve(app.getPath("downloads"), path);
    },
    readFile: (path: string, callback: (buffer: ArrayBuffer) => void) => {
        fs.readFile(path, (err, buffer) => {
            if (err) {
                ElectronLog.error("读取资源文件失败：", err);
            } else {
                callback(buffer);
            }
        });
    },
    savePutFile: (path: string, buffer: NodeJS.ArrayBufferView) => {
        fs.writeFile(path, buffer, err => {
            if (err) {
                ElectronLog.error("写入资源文件失败：", err);
            }
        });
    },
    showSaveDialog: (option: SaveDialogOptions) => {
        const currentWindow = getCurrentWindow();
        return dialog.showSaveDialog(currentWindow, option);
    },
    showOpenDialog: (option: OpenDialogOptions) => {
        const currentWindow = getCurrentWindow();
        return dialog.showOpenDialog(currentWindow, option);
    },
    setPath: async (name, path) => {
        await mkdirs(path);
        app.setPath(name, path);
    },
    getPath: (name) => {
        return app.getPath(name);
    },
    getColorHexRGB: async () => {
        if (process.platform === "darwin" && await darwinGetScreenPermissionGranted() === false) {
            await darwinRequestScreenPermissionPopup();
            return false;
        }
        return new Promise((resolve, reject) => execFileFromAsar(PATH_BINARY, (error, stdout, stderr) => {
            if (error) return reject(error);
            resolve(stdout);
        }));
    },
    checkWindowSupportNet,
    unpackCacheFile: async (zipFileName, newpath = "") => {
        const mkdirs = (dirname: string) => {
            return new Promise((resolve) => {
                access(dirname).then(() => resolve(dirname)).catch(() => mkdir(dirname, { recursive: true }).then(() => resolve(dirname)).catch(() => resolve("")));
            });
        }

        const aesDecrypt = (encrypted: string, key: string) => {
            const decipher = crypto.createDecipher('aes-128-ecb', key);
            var decrypted = decipher.update(encrypted, 'hex', 'utf8');
            decrypted += decipher.final('utf8');
            return decrypted;
        }

        let downloadFiles = join(app.getPath("userData"), "files", "/");
        await mkdirs(downloadFiles);
        app.setPath("downloads", downloadFiles);

        if (!newpath) {
            newpath = downloadFiles;
        }

        let jsonFileName = "";

        const customUnZipFolder = async (zipFileName: string, newpath: string) => {
            let zipPack = await readFile(zipFileName);
            let fileOffset = 0;

            const readFilesBuffer = async (zipFile: Buffer) => {
                if (fileOffset > zipFile.length - 1) {
                    return
                }
                let filenameLength = zipFile.readUInt8(fileOffset);
                fileOffset++;
                let filename = zipFile.toString('utf8', fileOffset, fileOffset + filenameLength);
                fileOffset += filenameLength;
                let contentLength = zipFile.readUInt32BE(fileOffset);
                fileOffset += 4;
                let fileBuffer = zipFile.slice(fileOffset, fileOffset + contentLength);
                fileOffset += contentLength;
                await mkdirs(newpath);
                if (filename.endsWith("app.json")) {
                    jsonFileName = filename;
                }
                await writeFile(path.join(newpath, filename), fileBuffer);
                await readFilesBuffer(zipFile);
            }

            await readFilesBuffer(zipPack);
        }

        try {
            await customUnZipFolder(zipFileName, newpath);
            let jsonFile = await readFile(newpath + `/${jsonFileName}`, { encoding: 'utf-8' });
            jsonFile = aesDecrypt(jsonFile, "lyxpkg");
            return JSON.parse(jsonFile);
        } catch (e) {
            console.error(e);
            return null;
        }
    },
    packCacheFiles: async (cacheData) => {
        const { windowId, windowName, userId, cards, pages, slides, cacheFiles } = cacheData;
        const filePath = process.platform === "darwin" ? (app.getPath("userData") + "/files/" + userId + "/" + windowName) : resolve(app.getPath("userData"), "files", userId, windowName);
        const guid = () => {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }

        const mkdirs = (dirname: string) => {
            return new Promise((resolve) => {
                access(dirname).then(() => resolve(dirname)).catch(() => mkdir(dirname, { recursive: true }).then(() => resolve(dirname)).catch(() => resolve("")));
            });
        }

        const aesEncrypt = (data: string, key: string) => {
            const cipher = crypto.createCipher('aes-128-ecb', key);
            var crypted = cipher.update(data, 'utf8', 'hex');
            crypted += cipher.final('hex');
            return crypted;
        }

        try {
            await mkdirs(filePath);
            let uuid = guid().replaceAll("-", "");
            const jsonFileName = filePath + `/${uuid}app.json`;

            // 生成JSON文件
            await writeFile(jsonFileName, aesEncrypt(JSON.stringify({
                windowName,
                windowId,
                userId,
                cards,
                pages,
                slides
            }), 'lyxpkg'));

            for (let cacheFile of cacheFiles) {
                cacheFile = cacheFile.replace("file:///", "");
                await copyFile(cacheFile, filePath + "/" + path.basename(cacheFile));
            }

            const customZipFolder = async (cacheFiles: Array<string>) => {
                let fileArray = [];
                for (let cacheFile of cacheFiles) {
                    let fileName = cacheFile.replace("file:///", "");
                    let item = await stat(fileName);
                    if (item.isFile()) {
                        let nameLen = Buffer.alloc(1);
                        nameLen.writeUInt8(path.basename(fileName).length);
                        let name = Buffer.alloc(path.basename(fileName).length, path.basename(fileName));
                        let content = fs.readFileSync(fileName);
                        let contentLen = Buffer.alloc(4);
                        contentLen.writeUInt32BE(content.length);
                        fileArray.push(nameLen);
                        fileArray.push(name);
                        fileArray.push(contentLen);
                        fileArray.push(content);
                    }
                }
                await writeFile(filePath + ".lyxpkg", Buffer.concat(fileArray));
                return filePath + ".lyxpkg";
            }

            let customZipFile = await customZipFolder([...cacheFiles, jsonFileName]);
            return customZipFile;
        } catch (e) {
            console.error(e);
            return "";
        } finally {
            await rm(filePath, { recursive: true, force: true });
        }
    },
    store: store,
    ...electron
};
