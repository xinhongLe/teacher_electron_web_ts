import isElectron from "is-electron";
import { Slide } from "wincard";
import { getOssUrl } from "./oss";

// 存储降低无效zip请求下载
const noZipCache: string[] = [];

const getFilePath = (key: string, resolve: (path: string) => void) => {
    const fileName = key.replace(/(.*[\/\\])*([^.]+)/i, "$2");
    if (fileName === "ElementFile/" || fileName === "null") return resolve("");
    return window.electron.isExistFile(fileName).then((isExist) => {
        if (isExist) {
            resolve(encodeURI(window.electron.getFilePath(fileName)));
        } else {
            getOssUrl(key, "axsfile").then(filePath => {
                window.electron.ipcRenderer.invoke("downloadFile", filePath, fileName).then(path => resolve(encodeURI(path ? "file://" + path : "")));
            });
        }
    });
};

export const cacheFile = (key: string) => {
    return new Promise((resolve) => {
        if (!key) return resolve("");
        if (isElectron()) {
            if (key.indexOf(".mp4") > -1) {
                const dirName = key.replace(/(.*[\/\\])*([^.]+)/i, "$2").replace(".mp4", "");

                if (noZipCache.includes(dirName)) {
                    getFilePath(key, resolve);
                } else {
                    const fileName = dirName + ".zip";

                    // 判断是否存在切片文件夹
                    window.electron.isExistM3U8(dirName + "/video.m3u8").then(isExist => {
                        if (isExist) {
                            resolve(encodeURI(window.electron.getFilePath(dirName + "/video.m3u8")));
                        } else {
                            getOssUrl(key.replace(".mp4", ".zip"), "axsfile").then(filePath => {
                                window.electron.ipcRenderer.invoke("downloadFile", filePath, fileName).then(path => {
                                    if (path) {
                                        // 解压
                                        window.electron.unZip(path);
                                        resolve(encodeURI(window.electron.getFilePath(dirName + "/video.m3u8")));
                                    } else {
                                        // 没有zip
                                        noZipCache.push(dirName);
                                        getFilePath(key, resolve);
                                    }
                                });
                            });
                        }
                    });
                }
            } else {
                getFilePath(key, resolve);
            }
        } else {
            resolve("");
        }
    });
};

export const cacheSildeFiles = (slide: Slide) => {
    // 背景图片资源
    if (slide.background && slide.background.image) {
        cacheFile(slide.background.image);
    }

    // 元素中资源缓存
    if (slide.elements) {
        slide.elements.forEach(element => {
            if (element.type === "image" && element.src) {
                cacheFile(element.src);
            }

            if (element.type === "audio") {
                if (element.src) {
                    cacheFile(element.src);
                }

                if (element.icon) {
                    cacheFile(element.icon);
                }
            }

            if (element.type === "video") {
                if (element.src) {
                    cacheFile(element.src);
                }

                if (element.icon) {
                    cacheFile(element.icon);
                }

                if (element.poster) {
                    cacheFile(element.poster);
                }
            }
        });
    }

    // 听写页
    if (slide.listenWords) {
        slide.listenWords.forEach(word => {
            if (word.file) {
                cacheFile(word.file);
            }
        });
    }

    // 跟读页
    if (slide.follow && slide.follow.src) {
        cacheFile(slide.follow.src);
    }
};
