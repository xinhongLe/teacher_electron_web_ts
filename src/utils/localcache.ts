import { getCardDetail, getPageDetailRes, getVideoQuoteInfo, getWindowCards, IGetWindowCards } from '@/api/home';
import { pageType } from '@/config';
import { store } from '@/store';
import { IPageValue } from '@/types/home';
import path from 'path';
import { PPTElement, Slide } from 'wincard/src/types/slides';
import { dealOldData } from './dataParse';
import { dealOldDataTeach, dealOldDataVideo, dealOldDataWord } from './dataParsePage';
import { getOssUrl } from './oss';

// new LocalCache({
//     cachingStatus: (status) => {
//         console.log(`status: ${status}`);
//     }
// }).doCache({
//     WindowID: "3A00ED0688D9418E8CDEC35BEA2DA116","3A00ED06A2F5D58C6F9148CB48417B4D", "3A041AB5F76B1A682DA21259D0EC17A7",
//     OriginType: 0
// }, "《守株待兔》第一课时");

// console.time(`unpackCacheFile`);
// await window.electron.unpackCacheFile("C:/Users/admin/AppData/Roaming/Aixueshi/files/39F782A0B5361BBD1775139E3D0BC5EA/《守株待兔》第一课时.lyxpkg")
// console.timeEnd(`unpackCacheFile`);

export interface CacheCallback {
    cachingStatus(status: number): void
}

export default class LocalCache {

    private readonly cacheCallback: CacheCallback;

    constructor(cacheCallback: CacheCallback) {
        this.cacheCallback = cacheCallback;
    }

    private transformType(type: number | string) {
        switch (type) {
            case 11:
            case "element":
                return 0;
            case 12:
            case "listen":
                return 1;
            case 13:
            case "follow":
                return 2;
            case 16:
            case "teach":
                return 3;
            default:
                return -1;
        }
    }

    // 此处只拉取线上数据, 不使用本地缓存数据
    private async getPageDetail(page: IPageValue, originType: number) {
        const data = { pageID: page.ID, OriginType: originType };
        const type: number = this.transformType(page.Type);
        if (type < 0) {
            return null;
        }
        return await getPageDetailRes(data, type, () => { }, false);
    };

    private async cacheFile(src: string): Promise<string> {
        return new Promise(resolve => {
            const fileName = src.replace(/(.*\/)*([^.]+)/i, "$2");
            if (fileName === "ElementFile/" || fileName === "null") return resolve("");
            return window.electron.isExistFile(fileName).then((isExist) => {
                if (isExist) {
                    resolve(window.electron.getFilePath(fileName));
                } else {
                    getOssUrl(src, "axsfile").then(filePath => {
                        window.electron.ipcRenderer.invoke("downloadFile", filePath, fileName).then(path => resolve(path ? "file:///" + path : ""));
                    });
                }
            });
        });
    }

    private async cacheSlide(slide: Slide) {
        let cacheFiles = [];
        // 背景图片资源
        if (slide.background && slide.background.image) {
            cacheFiles.push(await this.cacheFile(slide.background.image));
        }

        // 元素中资源缓存
        if (slide.elements) {
            for (let element of slide.elements) {
                if (element.type === "image" && element.src) {
                    cacheFiles.push(await this.cacheFile(element.src));
                }

                if (element.type === "audio") {
                    if (element.src) {
                        cacheFiles.push(await this.cacheFile(element.src));
                    }

                    if (element.icon) {
                        cacheFiles.push(await this.cacheFile(element.icon));
                    }
                }

                if (element.type === "video") {
                    if (element.src) {
                        cacheFiles.push(await this.cacheFile(element.src));
                    }

                    if (element.icon) {
                        cacheFiles.push(await this.cacheFile(element.icon));
                    }

                    if (element.poster) {
                        cacheFiles.push(await this.cacheFile(element.poster));
                    }
                }
            }
        }

        // 听写页
        if (slide.listenWords) {
            for (let word of slide.listenWords) {
                if (word.file) {
                    cacheFiles.push(await this.cacheFile(word.file));
                }
            }
        }

        // 跟读页
        if (slide.follow && slide.follow.src) {
            cacheFiles.push(await this.cacheFile(slide.follow.src));
        }

        // 教具页
        if (slide.teach && (slide.teach as any).file) {
            cacheFiles.push(await this.cacheFile((slide.teach as any).file));
        }

        return cacheFiles;
    }

    async dealPauseVideo(slide: Slide) {
        for (const element of slide.elements) {
            if (element.type === "video" && element.fileID) {
                const res = await getVideoQuoteInfo({ FileIDs: [element.fileID] });
                if (res.resultCode === 200 && res.result.length > 0) {
                    element.src = res.result[0].File.FilePath + "/" + res.result[0].File.FileName + "." + res.result[0].File.Extention;
                    element.pauseList = res.result[0].Pauses;
                }
            }
        }
        return slide;
    };

    async getElementWinCards(element: any, originType: number, winpages: Array<{ id: string, result: string }>, slides: Array<Slide>) {
        if (element.wins) {
            for (let win of element.wins) {
                const cards = win.cards;
                let pages: Array<{ ID: string, Type: number, Name: string }> = [];

                cards.map((card: any) => {
                    pages = pages.concat(card.slides.map((page: any) => {
                        return {
                            ID: page.id,
                            Type: page.type,
                            Name: page.name
                        };
                    }));
                });
                const pageIDs = pages.map(page => page.ID);
                const res = await getCardDetail({ pageIDs: pageIDs }, true);
                if (res.resultCode === 200 && res.result && res.result.length > 0) {
                    for (let card of res.result) {
                        await this.getPageSlide({ ID: (card as any).ID, Type: pages.find(p => p.ID === (card as any).ID)!.Type }, originType, winpages, slides);
                    }
                }
            }
        }
    }

    async getPageSlide(page: any, originType: number, pages: Array<{ id: string, result: string }>, slides: Array<Slide>) {
        let res = await this.getPageDetail(page, originType);
        if (!res) {
            return;
        }
        if (res.resultCode && res.resultCode === 200) {
            pages.push({
                id: page.ID,
                result: res.result.Json || "{}"
            });
            let slide: Slide | null = null;
            if (page.Type === pageType.element) {
                const slideString = res.result.Json || "{}";
                const oldSlide = JSON.parse(slideString);
                slide = oldSlide.type ? { ...await this.dealPauseVideo(oldSlide as Slide), id: page.ID } : await dealOldData(page.ID, page.originType, oldSlide);
            } else if (page.Type === pageType.listen) {
                slide = dealOldDataWord(page.ID, res.result);
            } else if (page.Type === pageType.follow) {
                slide = dealOldDataVideo(page.ID, res.result);
            } else if (page.Type === pageType.teach) {
                slide = dealOldDataTeach(page.ID, res.result);
            }

            if (slide !== null) {
                slides.push(slide);
                for (let element of slide.elements) {
                    await this.getElementWinCards(element, originType, pages, slides);
                }
            }
        }
    }

    async doCache(winInfo: IGetWindowCards, cacheFileName: string) {
        this.cacheCallback?.cachingStatus(0);

        let cards = (await getWindowCards(winInfo)).result;
        let pages: Array<{ id: string, result: string }> = [];
        let cacheFiles: string[] = [];
        let slides: Array<Slide> = [];

        let total = 0;
        for (let card of cards) {
            for (let {} of card.PageList) {
                total++;
            }
        }

        let current = 0;
        for (let card of cards) {
            for (let page of card.PageList) {
                current++;
                await this.getPageSlide(page, winInfo.OriginType!, pages, slides);
                this.cacheCallback?.cachingStatus(parseInt(((30 / total) * (current)).toFixed(0)));
            }
        }

        this.cacheCallback?.cachingStatus(30);

        for (let i = 0; i < slides.length; i++) {
            cacheFiles = [...cacheFiles, ...await this.cacheSlide(slides[i])];
            this.cacheCallback?.cachingStatus(30 + parseInt(((69 / slides.length) * (i + 1)).toFixed(0)));
        }

        this.cacheCallback?.cachingStatus(99);

        // 将json文件写入到指定文件夹，将缓存资源文件复制到指定文件夹，并对文件夹压缩后加密，形成离线包

        const cacheData = {
            windowName: cacheFileName,
            windowId: winInfo.WindowID,
            cards,
            pages,
            slides,
            userId: store.state.userInfo.id,
            cacheFiles
        }

        let fileName = await window.electron.packCacheFiles(cacheData);
        this.cacheCallback?.cachingStatus(100);
        // 清空数组
        cacheData.cacheFiles = [];
        cacheData.pages = [];
        cacheData.cards = [];
        cacheData.slides = [];
        console.log("done", fileName);
    }
}

