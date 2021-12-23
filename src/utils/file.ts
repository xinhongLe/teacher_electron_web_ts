import isElectron from "is-electron";
import { Slide } from "wincard/src/types/slides";
import { downloadFile } from "./oss";
export const cacheFile = async (key: string) => {
    return new Promise((resolve) => {
        if (isElectron()) {
            const fileName = key.replace(/(.*\/)*([^.]+)/i, "$2");
            if (fileName === "null") return;
            return window.electron.isExistFile(fileName).then((isExist) => {
                if (isExist) {
                    resolve("file://" + window.electron.getFilePath(fileName));
                } else {
                    downloadFile(key, "axsfile").then(filePath => {
                        window.electron.ipcRenderer.invoke("downloadFile", filePath, fileName).then(path => resolve("file://" + path));
                    });
                }
            });
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
