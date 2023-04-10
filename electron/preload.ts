import { getCurrentWindow, app, dialog } from "@electron/remote";
import electron, { OpenDialogOptions, remote, SaveDialogOptions } from "electron";
import { isExistFile, mkdirs, store } from "./downloadFile";
import path, { resolve, join } from "path";
import ElectronLog from "electron-log";
import fs from "fs";
import { parsePPT, pptParsePath } from "./parsePPT";
import { execFile as execFileFromAsar, spawn } from "child_process";
import { darwinGetScreenPermissionGranted, darwinRequestScreenPermissionPopup, } from "./darwin";
import { checkWindowSupportNet } from "./util";
import { access, copyFile, mkdir, readFile, rm, stat, writeFile } from "fs/promises";
import crypto from "crypto";
import { exportWord, IFileData } from "./exportWord";
import ffmpeg from "fluent-ffmpeg";
import { v4 as uuidv4 } from "uuid";
import AdmZip from "adm-zip";

const PATH_BINARY = process.platform === "darwin" ? join(__dirname, "../ColorPicker") : join(__dirname, "../mockingbot-color-picker-ia32.exe");
const PATH_WhiteBoard = join(__dirname, "../extraResources/whiteboard/Aixueshi.Whiteboard.exe"
);

const PATH_FFMPEG = process.platform === "darwin" ? join(__dirname, "../extraResources/ffmpeg/ffmpeg") : join(__dirname, "../extraResources/ffmpeg/ffmpeg-win32-ia32.exe");
ffmpeg.setFfmpegPath(PATH_FFMPEG);

const downloadsPath = join(app.getPath("userData"), "files", "/");
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
    showWindow: (isMaximize = false) => {
        const currentWindow = getCurrentWindow();
        currentWindow.show();
        if (isMaximize) {
            currentWindow.maximize();
        }
    },
    destroyWindow: () => {
        const currentWindow = getCurrentWindow();
        currentWindow.destroy();
    },
    setContentSize: (width: number, height: number) => {
        const currentWindow = getCurrentWindow();
        currentWindow.setContentSize(width, height);
    },
    getPositionWin: () => {
        const currentWindow = getCurrentWindow();
        return currentWindow.getPosition();
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
    isExistFile: async (fileName: string) => {
        const filePath = resolve(downloadsPath, fileName);
        return isExistFile(filePath);
    },
    isExistM3U8: (fileName: string) => {
        const filePath = resolve(downloadsPath, fileName);
        return new Promise(resolve => {
            access(filePath).then(() => resolve(true)).catch(() => resolve(false));
        })
    },
    getFilePath: (fileName: string) => {
        const filePath = resolve(downloadsPath, fileName);
        return "file:///" + filePath.replaceAll("\\", "/");
    },
    log: ElectronLog,
    getCacheFile: async (fileName: string) => {
        if (!fileName) return "";
        const filePath = resolve(downloadsPath, fileName);
        const isExist = await isExistFile(filePath);
        return isExist ? "file://" + filePath.split("\\").join("/") : "";
    },
    getCachePath: (path: string) => {
        return resolve(downloadsPath, path);
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
        fs.writeFile(path, buffer, (err) => {
            if (err) {
                ElectronLog.error("写入资源文件失败：", err);
            }
        });
    },
    deleteFile: (path: string) => {
        fs.unlinkSync(path);
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
    getPPTPath: (path) => {
        return join(pptParsePath, path);
    },
    getColorHexRGB: async () => {
        if (
            process.platform === "darwin" &&
            (await darwinGetScreenPermissionGranted()) === false
        ) {
            await darwinRequestScreenPermissionPopup();
            return false;
        }
        return new Promise((resolve, reject) =>
            execFileFromAsar(PATH_BINARY, (error, stdout, stderr) => {
                if (error) return reject(error);
                resolve(stdout);
            })
        );
    },
    getWhiteBoard: async () => {
        if (
            process.platform === "darwin" &&
            (await darwinGetScreenPermissionGranted()) === false
        ) {
            await darwinRequestScreenPermissionPopup();
            return false;
        }
        return new Promise((resolve, reject) =>
            checkWindowSupportNet("v4.0").then((isOk) => {
                if (isOk) {
                    spawn(PATH_WhiteBoard);
                    return resolve(true);
                }
                checkWindowSupportNet("v3.5").then((isOk) => {
                    if (isOk) {
                        spawn(PATH_WhiteBoard);
                        return resolve(true);
                    }
                    reject(false);
                });
            })
        );
    },
    exportWord: (filePath: string, fileData: IFileData, styleType: number) => {
        exportWord(filePath, fileData, styleType);
    },
    checkWindowSupportNet,
    unpackCacheFile: async (zipFileName, newpath = "") => {
        const mkdirs = (dirname: string) => {
            return new Promise((resolve) => {
                access(dirname)
                    .then(() => resolve(dirname))
                    .catch(() =>
                        mkdir(dirname, { recursive: true })
                            .then(() => resolve(dirname))
                            .catch(() => resolve(""))
                    );
            });
        };

        const aesDecrypt = (encrypted: string, key: string) => {
            const decipher = crypto.createDecipher("aes-128-ecb", key);
            var decrypted = decipher.update(encrypted, "hex", "utf8");
            decrypted += decipher.final("utf8");
            return decrypted;
        };

        let downloadFiles = join(app.getPath("userData"), "files", "/");
        await mkdirs(downloadFiles);

        if (!newpath) {
            newpath = downloadFiles;
        }

        let jsonFileName = "";

        const customUnZipFolder = async (
            zipFileName: string,
            newpath: string
        ) => {
            let zipPack = await readFile(zipFileName);
            let fileOffset = 0;

            const readFilesBuffer = async (zipFile: Buffer) => {
                if (fileOffset > zipFile.length - 1) {
                    return;
                }
                let filenameLength = zipFile.readUInt8(fileOffset);
                fileOffset++;
                let filename = zipFile.toString(
                    "utf8",
                    fileOffset,
                    fileOffset + filenameLength
                );
                fileOffset += filenameLength;
                let contentLength = zipFile.readUInt32BE(fileOffset);
                fileOffset += 4;
                let fileBuffer = zipFile.slice(
                    fileOffset,
                    fileOffset + contentLength
                );
                fileOffset += contentLength;
                await mkdirs(newpath);
                if (filename.endsWith("app.json")) {
                    jsonFileName = filename;
                }
                await writeFile(join(newpath, filename), fileBuffer);
                await readFilesBuffer(zipFile);
            };

            await readFilesBuffer(zipPack);
        };

        try {
            await customUnZipFolder(zipFileName, newpath);
            let jsonFile = await readFile(newpath + `/${jsonFileName}`, {
                encoding: "utf-8",
            });
            jsonFile = aesDecrypt(jsonFile, "lyxpkg");
            return JSON.parse(jsonFile);
        } catch (e) {
            console.error(e);
            return null;
        }
    },
    packCacheFiles: async (cacheData, savePath: string) => {
        const {
            windowId,
            windowName,
            userId,
            cards,
            pages,
            slides,
            cacheFiles,
        } = cacheData;
        const filePath = resolve(app.getPath("userData"), "files", windowName);
        const guid = () => {
            return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
                /[xy]/g,
                function (c) {
                    var r = (Math.random() * 16) | 0,
                        v = c == "x" ? r : (r & 0x3) | 0x8;
                    return v.toString(16);
                }
            );
        };

        const mkdirs = (dirname: string) => {
            return new Promise((resolve) => {
                access(dirname)
                    .then(() => resolve(dirname))
                    .catch(() =>
                        mkdir(dirname, { recursive: true })
                            .then(() => resolve(dirname))
                            .catch(() => resolve(""))
                    );
            });
        };

        const aesEncrypt = (data: string, key: string) => {
            const cipher = crypto.createCipher("aes-128-ecb", key);
            var crypted = cipher.update(data, "utf8", "hex");
            crypted += cipher.final("hex");
            return crypted;
        };

        try {
            await mkdirs(filePath);
            let uuid = guid().replaceAll("-", "");
            const jsonFileName = filePath + `/${uuid}app.json`;
            console.log("jsonFileName-------", jsonFileName);

            // 生成JSON文件
            await writeFile(
                jsonFileName,
                aesEncrypt(
                    JSON.stringify({
                        windowName,
                        windowId,
                        userId,
                        cards,
                        pages,
                        slides,
                    }),
                    "lyxpkg"
                )
            );
            console.log("cacheFiles-------", cacheFiles);

            for (let cacheFile of cacheFiles) {
                cacheFile = cacheFile.replace("file:///", "");
                await copyFile(
                    cacheFile,
                    filePath + "/" + path.basename(cacheFile)
                );
            }

            const customZipFolder = async (cacheFiles: Array<string>) => {
                let fileArray = [];
                for (let cacheFile of cacheFiles) {
                    let fileName = cacheFile.replace("file:///", "");
                    let item = await stat(fileName);
                    if (item.isFile()) {
                        let nameLen = Buffer.alloc(1);
                        nameLen.writeUInt8(path.basename(fileName).length);
                        let name = Buffer.alloc(
                            path.basename(fileName).length,
                            path.basename(fileName)
                        );
                        let content = fs.readFileSync(fileName);
                        let contentLen = Buffer.alloc(4);
                        contentLen.writeUInt32BE(content.length);
                        fileArray.push(nameLen);
                        fileArray.push(name);
                        fileArray.push(contentLen);
                        fileArray.push(content);
                    }
                }
                const _fileName = path.join(savePath, windowName + ".lyxpkg");
                await writeFile(_fileName, Buffer.concat(fileArray));
                return _fileName;
            };

            let customZipFile = await customZipFolder([...cacheFiles, jsonFileName]);

            return customZipFile;
        } catch (e) {
            console.error("报错--", e);
            return "";
        } finally {
            await rm(filePath, { recursive: true, force: true });
        }
    },
    convertVideoH264: (filePath: string) => {
        return new Promise((resolve, reject) => {
            const uuid = uuidv4();
            const outputPath = join(app.getPath("userData"), "files", `/${uuid}.mp4`);
            try {
                ffmpeg(filePath)
                    .videoCodec("libx264")
                    .on("end", () => {
                        const file = fs.readFileSync(outputPath);
                        resolve(file);
                    })
                    .save(outputPath);
            } catch (err) {
                console.log("Error: " + err);
                reject(err);
            }
        });
    },
    sliceVideoZip: (filePath: string, name: string) => {
        return new Promise((resolve, reject) => {
            const outputPath = join(app.getPath("userData"), "files");
            if (!fs.existsSync(outputPath + `/${name}`)) {
                fs.mkdirSync(outputPath + `/${name}`);
            }
            try {
                ffmpeg(filePath)
                    .videoCodec("libx264")
                    .format("hls") // 输出视频格式
                    .outputOptions("-hls_list_size 0") //  -hls_list_size n:设置播放列表保存的最多条目，设置为0会保存有所片信息，默认值为5
                    .outputOption("-hls_time 15") // -hls_time n: 设置每片的长度，默认值为2。单位为秒
                    .output(outputPath + `/${name}/video.m3u8`) // 输出文件
                    .on("progress", (progress) => {
                        // 监听切片进度
                        ElectronLog.info(name + ": Processing: " + progress.percent + "% done");
                    })
                    .on("end", () => {
                        // 监听结束
                        ElectronLog.info(name + ": 视频切片完成");
                        const zip = new AdmZip();

                        zip.addLocalFolderAsync(outputPath + `/${name}`, (success, err) => {
                            if (success) {
                                ElectronLog.info("压缩" + name + "成功");
                                const zipBuffer = zip.toBuffer();
                                resolve(zipBuffer);
                            } else {
                                ElectronLog.error("压缩失败: ", err);
                            }
                        })

                        // zip.writeZip(outputPath + `/${name}.zip`);

                        // fs.readdir(outputPath + `/${name}`, (err, files) => {
                        //     console.log(err, files);
                        //     if (!err) {
                        //         for (let file of files) {
                        //             zip.addLocalFile(outputPath + `/${name}/${file}`);
                        //         }
                        //         const zipBuffer = zip.toBuffer();
                        //         // zip.writeZip(outputPath + `/${name}.zip`);
                        //         resolve(zipBuffer);
                        //     }
                        // });
                    })
                    .run();
            } catch (err) {
                console.log("Error: " + err);
                reject(err);
            }
        });
    },
    unZip: (path: string) => {
        const zip = new AdmZip(path);
        const dirName = path.replace(/(.*[\/\\])*([^.]+)/i, "$2").replace(".zip", "");
        zip.extractAllToAsync(downloadsPath + dirName, true);
    },
    store: store,
    parsePPT,
    ...electron,
};
