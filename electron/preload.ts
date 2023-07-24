import fs from "fs";
import crypto from "crypto";
import AdmZip from "adm-zip";
import ffmpeg from "fluent-ffmpeg";
import logger from "@/utils/logger";
import { v4 as uuidv4 } from "uuid";
import path, { join, resolve } from "path";
import { checkWindowSupportNet } from "./util";
import { exportWord, IFileData } from "./exportWord";
import { isExistFile, mkdirs, store } from "./downloadFile";
import {
    app,
    dialog,
    getCurrentWindow,
    globalShortcut,
    getCurrentWebContents,
    desktopCapturer,
    screen
} from "@electron/remote";
import { execFile as execFileFromAsar, spawn } from "child_process";
import {
    access,
    copyFile,
    mkdir,
    readFile,
    rm,
    stat,
    writeFile,
} from "fs/promises";
import {
    darwinGetScreenPermissionGranted,
    darwinRequestScreenPermissionPopup,
} from "./darwin";
import {
    ipcRenderer,
    nativeImage,
    OpenDialogOptions,
    SaveDialogOptions,
    shell
} from "electron";
import * as https from "https";
import { get, set, STORAGE_TYPES } from "@/utils/storage";
import Axios, { CancelTokenSource } from "axios";

const downloadsPath = join(app.getPath("userData"), "files", "/");
const PATH_WhiteBoard = join(
    __dirname,
    "../extraResources/whiteboard/Aixueshi.Whiteboard.exe"
);
const PATH_BINARY =
    process.platform === "darwin"
        ? join(__dirname, "../ColorPicker")
        : join(__dirname, "../mockingbot-color-picker-ia32.exe");
const PATH_FFMPEG =
    process.platform === "darwin"
        ? join(__dirname, "../extraResources/ffmpeg/ffmpeg")
        : join(__dirname, "../extraResources/ffmpeg/ffmpeg-win32-ia32.exe");

ffmpeg.setFfmpegPath(PATH_FFMPEG);

window.electron = {
    store,
    log: logger,
    remote: {
        app,
        dialog,
        getCurrentWindow,
        screen,
        getCurrentWebContents,
    },
    ipcRenderer,
    shell,
    downloadFile: (
        url: string,
        path: string,
        callback: (progress: number) => void,
        cancelCallBack: (cancelToken: CancelTokenSource) => void
    ): Promise<Boolean> => {
        return new Promise((resolve) => {
            const CancelToken = Axios.CancelToken;
            const source = CancelToken.source();
            cancelCallBack(source);
            Axios({
                url,
                method: "GET",
                responseType: "arraybuffer",
                onDownloadProgress: (evt) => {
                    callback((evt.loaded / evt.total) * 100);
                },
                cancelToken: source.token
            }).then((response) => {
                if (response.status === 200) {
                    const buffer = Buffer.from(response.data);
                    fs.writeFile(path, buffer, (err) => {
                        resolve(!err);
                    });
                } else {
                    resolve(false);
                }
            }).catch(() => {});
        });
    },
    exit: () => {
        app.quit();
    },
    checkWindowSupportNet,
    setCenter: () => {
        getCurrentWindow().center();
    },
    getVersion: () => {
        return app.getVersion();
    },
    hideWindow: () => {
        const currentWindow = getCurrentWindow();
        currentWindow.hide();
    },
    getPath: (name) => {
        return app.getPath(name);
    },
    getWindowImg: () => {
        return new Promise((resolve) => {
            const currentWindow = getCurrentWindow();
            const bound = currentWindow.getBounds();
            desktopCapturer.getSources({
                types: ["screen"]
            }).then(sources => {
                // console.log('sources', sources)
                // const index = sources.findIndex(source => source.name === "爱学仕校园教师端");
                const selectSource = sources[0];
                const buffer = selectSource.thumbnail.toPNG({
                    scaleFactor: 0.1
                });

                const newBuffer = nativeImage.createFromBuffer(buffer).resize({
                    width: 200,
                    height: 200
                }).toPNG();

                const outputPath = join(
                    app.getPath("userData"),
                    "files",
                    "thumbnails"
                );
                if (!fs.existsSync(outputPath)) {
                    fs.mkdirSync(outputPath);
                }

                const filePath = join(
                    outputPath,
                    `${new Date().getTime()}.png`
                );
                fs.writeFileSync(filePath, newBuffer);
                resolve(filePath);
            }).catch(err => {
                console.error(err);
            });
        });
    },
    isFullScreen: () => {
        const currentWindow = getCurrentWindow();
        return currentWindow.fullScreen;
    },
    destroyWindow: () => {
        const currentWindow = getCurrentWindow();
        currentWindow.destroy();
    },
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
    minimizeWindow: () => {
        const currentWindow = getCurrentWindow();
        if (currentWindow.isFullScreen()) {
            currentWindow.setFullScreen(false);
        } else {
            currentWindow.minimize();
        }
    },
    getPositionWin: () => {
        const currentWindow = getCurrentWindow();
        return currentWindow.getPosition();
    },
    isMac: (): boolean => {
        return process.platform === "darwin";
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
    unZip: (path: string) => {
        const zip = new AdmZip(path);
        const dirName = path
            .replace(/(.*[\/\\])*([^.]+)/i, "$2")
            .replace(".zip", "");
        zip.extractAllToAsync(downloadsPath + dirName, true);
    },
    unRegisterEscKeyUp: () => {
        globalShortcut.unregister("esc");
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
                    // eslint-disable-next-line prefer-promise-reject-errors
                    reject(false);
                });
            })
        );
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
    deleteFile: (path: string) => {
        fs.unlinkSync(path);
    },
    setPath: async (name, path) => {
        await mkdirs(path);
        app.setPath(name, path);
    },
    getCachePath: (path: string) => {
        return resolve(downloadsPath, path);
    },
    setFullScreen: (flag: boolean) => {
        const currentWindow = getCurrentWindow();
        currentWindow.setFullScreen(flag);
    },
    isExistM3U8: (fileName: string) => {
        const filePath = resolve(downloadsPath, fileName);
        return new Promise((resolve) => {
            access(filePath)
                .then(() => resolve(true))
                .catch(() => resolve(false));
        });
    },
    getFilePath: (fileName: string) => {
        const filePath = resolve(downloadsPath, fileName);
        return "file:///" + filePath.replaceAll("\\", "/");
    },
    convertVideoH264: (filePath: string) => {
        return new Promise((resolve, reject) => {
            const uuid = uuidv4();
            const outputPath = join(
                app.getPath("userData"),
                "files",
                `/${uuid}.mp4`
            );
            if (!fs.existsSync(outputPath)) {
                fs.mkdirSync(outputPath);
            }
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
    isExistCacheFile: async (fileName: string) => {
        const filePath = resolve(downloadsPath, fileName);
        return isExistFile(filePath);
    },
    isExistFile: (filePath: string) => {
        return fs.existsSync(filePath);
    },
    setPositionWin: (x, y, ani?: boolean) => {
        const currentWindow = getCurrentWindow();
        currentWindow.setPosition(x, y, ani);
    },
    getCacheFile: async (fileName: string) => {
        if (!fileName) return "";
        const filePath = resolve(downloadsPath, fileName);
        const isExist = await isExistFile(filePath);
        return isExist ? "file://" + filePath.split("\\").join("/") : "";
    },
    registerEscKeyUp: (callback: () => void) => {
        globalShortcut.register("esc", () => {
            callback && callback();
        });
    },
    showWindow: (isMaximize = false) => {
        const currentWindow = getCurrentWindow();
        currentWindow.show();
        if (isMaximize) {
            currentWindow.maximize();
        }
    },
    showSaveDialog: (option: SaveDialogOptions) => {
        const currentWindow = getCurrentWindow();
        return dialog.showSaveDialog(currentWindow, option);
    },
    showOpenDialog: (option: OpenDialogOptions) => {
        const currentWindow = getCurrentWindow();
        return dialog.showOpenDialog(currentWindow, option);
    },
    setContentSize: (width: number, height: number) => {
        const currentWindow = getCurrentWindow();
        currentWindow.setContentSize(width, height);
    },
    sliceVideoZip: (filePath: string, name: string) => {
        return new Promise((resolve, reject) => {
            const outputPath = join(app.getPath("userData"), "files");
            if (!fs.existsSync(join(outputPath, name))) {
                fs.mkdirSync(join(outputPath, name));
            }
            try {
                ffmpeg(filePath)
                    .videoCodec("libx264")
                    .format("hls") // 输出视频格式
                    .outputOptions("-hls_list_size 0") //  -hls_list_size n:设置播放列表保存的最多条目，设置为0会保存有所片信息，默认值为5
                    .outputOption("-hls_time 15") // -hls_time n: 设置每片的长度，默认值为2。单位为秒
                    .output(join(outputPath, name, "video.m3u8")) // 输出文件
                    .on("progress", () => {
                        // 监听切片进度
                    })
                    .on("end", () => {
                        // 监听结束
                        const zip = new AdmZip();

                        zip.addLocalFolderAsync(
                            join(outputPath, name),
                            (success, err) => {
                                if (success) {
                                    const zipBuffer = zip.toBuffer();
                                    resolve(zipBuffer);
                                } else {
                                    logger.error("压缩失败: ", err);
                                }
                            }
                        );
                    })
                    .run();
            } catch (err) {
                logger.error(err);
                reject(err);
            }
        });
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
                    const r = (Math.random() * 16) | 0;
                    // eslint-disable-next-line eqeqeq
                    const v = c == "x" ? r : (r & 0x3) | 0x8;
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
            // eslint-disable-next-line node/no-deprecated-api
            const cipher = crypto.createCipher("aes-128-ecb", key);
            let crypted = cipher.update(data, "utf8", "hex");
            crypted += cipher.final("hex");
            return crypted;
        };

        try {
            await mkdirs(filePath);
            const uuid = guid().replaceAll("-", "");
            const jsonFileName = filePath + `/${uuid}app.json`;

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

            for (let cacheFile of cacheFiles) {
                cacheFile = cacheFile.replace("file:///", "");
                await copyFile(
                    cacheFile,
                    filePath + "/" + path.basename(cacheFile)
                );
            }

            const customZipFolder = async (cacheFiles: Array<string>) => {
                const fileArray = [];
                for (const cacheFile of cacheFiles) {
                    const fileName = cacheFile.replace("file:///", "");
                    const item = await stat(fileName);
                    if (item.isFile()) {
                        const nameLen = Buffer.alloc(1);
                        nameLen.writeUInt8(path.basename(fileName).length);
                        const name = Buffer.alloc(
                            path.basename(fileName).length,
                            path.basename(fileName)
                        );
                        const content = fs.readFileSync(fileName);
                        const contentLen = Buffer.alloc(4);
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

            return await customZipFolder([...cacheFiles, jsonFileName]);
        } catch (e) {
            console.error("报错--", e);
            return "";
        } finally {
            await rm(filePath, { recursive: true, force: true });
        }
    },
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
            // eslint-disable-next-line node/no-deprecated-api
            const decipher = crypto.createDecipher("aes-128-ecb", key);
            let decrypted = decipher.update(encrypted, "hex", "utf8");
            decrypted += decipher.final("utf8");
            return decrypted;
        };

        const downloadFiles = join(app.getPath("userData"), "files", "/");
        await mkdirs(downloadFiles);

        if (!newpath) {
            newpath = downloadFiles;
        }

        let jsonFileName = "";

        const customUnZipFolder = async (
            zipFileName: string,
            newpath: string
        ) => {
            const zipPack = await readFile(zipFileName);
            let fileOffset = 0;

            const readFilesBuffer = async (zipFile: Buffer) => {
                if (fileOffset > zipFile.length - 1) {
                    return;
                }
                const filenameLength = zipFile.readUInt8(fileOffset);
                fileOffset++;
                const filename = zipFile.toString(
                    "utf8",
                    fileOffset,
                    fileOffset + filenameLength
                );
                fileOffset += filenameLength;
                const contentLength = zipFile.readUInt32BE(fileOffset);
                fileOffset += 4;
                const fileBuffer = zipFile.slice(
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
    savePutFile: (path: string, buffer: NodeJS.ArrayBufferView) => {
        fs.writeFile(path, buffer, (err) => {
            if (err) {
                logger.error("写入资源文件失败：", err);
            }
        });
    },
    exportWord: (filePath: string, fileData: IFileData, styleType: number) => {
        exportWord(filePath, fileData, styleType);
    },
    readFile: (
        path: string,
        callback: (buffer: ArrayBuffer | string) => void
    ) => {
        fs.readFile(path, (err, buffer) => {
            if (err) {
                logger.error("读取资源文件失败：", err);
                callback(err.message);
            } else {
                callback(buffer);
            }
        });
    },
    getUpdateUserChoice: () => {
        const currentVersion = window.electron.getVersion();
        const data = get(STORAGE_TYPES.USER_UPDATE_CHOICE) || {
            version: currentVersion,
            value: "update",
        };
        if (currentVersion !== data.version) {
            return {
                version: currentVersion,
                value: "update",
            };
        } else {
            return data;
        }
    },
    saveUpdateUserChoice: (choice) => {
        set(STORAGE_TYPES.USER_UPDATE_CHOICE, choice);
    },
    downloadNewApp: (
        version: string,
        onProgress: (progress: number) => void
    ) => {
        const extension =
            process.platform === "darwin"
                ? ".dmg"
                : process.platform === "linux"
                    ? ".deb"
                    : ".exe";
        const fileName =
            (process.env["VUE_APP_PRODUCT_NAME "] || "爱学仕校园教师端") +
            "-" +
            version +
            extension;
        const updataUrl =
            "https://app-v.oss-cn-shanghai.aliyuncs.com/teacherElectron/build/" +
            fileName;
        const request = https.request(updataUrl);
        // request.setHeader("Range", `bytes=${0}-${updateInfo.files[0].size - 1}`);
        const filePath = path.join(app.getPath("temp"), fileName);
        // 先验证文件是否已经下载
        if (fs.existsSync(filePath)) {
            onProgress(100);
            // 启动安装程序
            if (process.platform === "darwin") {
                shell.openPath(filePath);
            } else if (process.platform === "win32") {
                spawn(path.resolve(filePath), ["/interactive"], {
                    detached: true,
                    shell: true,
                });
            } else if (process.platform === "linux") {
                shell.openPath(filePath);
            }

            app.quit(); // 退出旧的程序
            return;
        }
        const fileStream = fs.createWriteStream(filePath);
        request.on("response", (response: any) => {
            const totalBytes = parseInt(response.headers["content-length"], 10);
            let downloadedBytes = 0;
            response.on("data", (chunk: any) => {
                downloadedBytes += chunk.length;
                // 更新下载进度
                onProgress &&
                    onProgress(
                        Math.round((downloadedBytes / totalBytes) * 100)
                    );
            });
            response.pipe(fileStream, fileName);
            fileStream.on("finish", () => {
                fileStream.close();
                // 启动安装程序
                if (process.platform === "darwin") {
                    shell.openPath(filePath);
                } else if (process.platform === "win32") {
                    spawn(path.resolve(filePath), ["/interactive"], {
                        detached: true,
                        shell: true,
                    });
                } else if (process.platform === "linux") {
                    shell.openPath(filePath);
                }

                app.quit(); // 退出旧的程序
                fileStream.destroy();
            });

            fileStream.on("error", (error: any) => {
                console.error(`Failed to save downloaded file: ${error}`);
            });
        });
        request.on("error", () => {
            fileStream.destroy();
        });
        request.end();
    },
};
