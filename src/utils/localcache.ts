import { store } from "@/store";
import { Slide } from "wincard";
import { getOssUrl } from "./oss";
import { pageType } from "@/config";
import { dealAnimationData, dealOldData } from "./dataParse";
import { getCardDetail, getVideoQuoteInfo, getWindowStruct, IGetWindowCards } from "@/api/home";
import { dealOldDataGame, dealOldDataTeach, dealOldDataVideo, dealOldDataWord } from "./dataParsePage";
import { PageProps } from "@/views/preparation/intelligenceClassroom/api/props";
import useHome from "@/hooks/useHome";

export interface CacheCallback {
    cachingStatus(status: number): void;
}

const { transformPageDetail } = useHome();

export default class LocalCache {
    private readonly cacheCallback: CacheCallback;

    private isFail = false;
    private isEnd = false;

    constructor(cacheCallback: CacheCallback) {
        this.cacheCallback = cacheCallback;
    }

    private async cacheFile(src: string): Promise<string> {
        return new Promise((resolve) => {
            const fileName = src.replace(/(.*\/)*([^.]+)/i, "$2");
            if (fileName === "ElementFile/" || fileName === "null") {
                return resolve("");
            }
            return window.electron.isExistCacheFile(fileName).then((isExist) => {
                if (isExist) {
                    resolve(window.electron.getFilePath(fileName));
                } else {
                    getOssUrl(src, "axsfile").then((filePath) => {
                        window.electron.ipcRenderer
                            .invoke("downloadFile", filePath, fileName)
                            .then((path) =>
                                resolve(path ? "file:///" + path : "")
                            );
                    });
                }
            });
        });
    }

    private async cacheSlide(slide: Slide) {
        const cacheFiles = [];
        if (this.isEnd) return [];
        // 背景图片资源
        if (slide.background && slide.background.image) {
            cacheFiles.push(await this.cacheFile(slide.background.image));
        }

        // 元素中资源缓存
        if (slide.elements) {
            for (const element of slide.elements) {
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
            for (const word of slide.listenWords) {
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

        // 游戏页
        if (slide.game && (slide.game as any).file) {
            cacheFiles.push(await this.cacheFile((slide.game as any).file));
        }

        return cacheFiles;
    }

    async dealPauseVideo(slide: Slide, fail: () => void) {
        for (const element of slide.elements) {
            if (this.isEnd) break;
            if (element.type === "video" && element.fileID) {
                const res = await getVideoQuoteInfo({
                    FileIDs: [element.fileID]
                });
                if (!res.success) this.isFail = true;
                if (res.resultCode === 200 && res.result.length > 0) {
                    element.src =
                        res.result[0].File.FilePath +
                        "/" +
                        res.result[0].File.FileName +
                        "." +
                        res.result[0].File.Extention;
                    element.pauseList = res.result[0].Pauses;
                }
                if (this.isFail) {
                    fail();
                    break;
                }
            }
        }
        return slide;
    }

    async getElementWinCards(element: any, originType: number, winpages: Array<{ id: string; result: string }>, slides: Array<Slide>, fail: () => void) {
        if (this.isEnd) return;
        if (element.wins) {
            for (const win of element.wins) {
                const cards = win.cards;
                let pages: Array<{ ID: string; Type: number; Name: string }> =
                    [];

                cards.map((card: any) => {
                    pages = pages.concat(
                        card.slides.map((page: any) => {
                            return {
                                ID: page.id,
                                Type: page.type,
                                Name: page.name
                            };
                        })
                    );
                });
                const pageIDs = pages.map((page) => page.ID);
                const res = await getCardDetail({ pageIDs: pageIDs }, true);
                if (
                    res.resultCode === 200 &&
                    res.result &&
                    res.result.length > 0
                ) {
                    for (const card of res.result) {
                        // 此处判断页是否已经缓存，缓存的跳过，避免出现死循环
                        if (!winpages.find((page) => page.id === card.ID)) {
                            await this.getPageSlide(
                                {
                                    ID: (card as any).ID,
                                    Type: pages.find(
                                        (p) => p.ID === (card as any).ID
                                    )!.Type
                                },
                                originType,
                                winpages,
                                slides,
                                fail
                            );
                        }
                    }
                }
            }
        }
    }

    async getPageSlide(page: any, originType: number, pages: Array<{ id: string; result: string }>, slides: Array<Slide>, fail: () => void) {
        if (this.isEnd) return;

        pages.push({
            id: page.ID,
            result: page.Json || "{}"
        });
        let slide: Slide | null = null;
        if (page.Type === pageType.element) {
            const slideString = page.Json || "{}";
            const oldSlide = JSON.parse(slideString);
            slide = oldSlide.type ? { ...(await this.dealPauseVideo(oldSlide as Slide, fail)), id: page.ID }
                : await dealOldData(page.ID, page.originType, oldSlide);
        }
        if (page.Type === pageType.listen) {
            slide = dealOldDataWord(page.ID, page);
        }
        if (page.Type === pageType.follow) {
            slide = dealOldDataVideo(page.ID, page);
        }
        if (page.Type === pageType.teach) {
            slide = dealOldDataTeach(page.ID, page);
        }
        if (page.Type === pageType.game) {
            slide = dealOldDataGame(page.ID, page);
        }
        if (slide !== null) {
            slides.push(slide);
        }
    }

    cancel() {
        this.isEnd = true;
    }

    destory() {
        this.isEnd = true;
    }

    async doCache(winInfo: IGetWindowCards, cacheFileName: string, path: string, fail: () => void) {
        this.isFail = false;
        this.isEnd = false;
        this.cacheCallback?.cachingStatus(0);
        const result = await getWindowStruct(winInfo, true);
        if (this.isEnd) return;
        if (result.resultCode !== 200) {
            fail();
            return;
        }

        const cards = result.result.CardData;
        const windowCards = [];
        const pages = [];
        let cacheFiles: string[] = [];

        let index = 1;
        for (let i = 0; i < cards.length; i++) {
            const item = cards[i];
            const pageList: PageProps[] = [];

            for (let j = 0; j < item.PageList.length; j++) {
                const it = item.PageList[j];
                if (!it) continue;

                const json = JSON.parse(it.Json || "{}");
                let url = it.Url || "";
                if (!url && (it.Type === 20 || it.Type === 16)) {
                    const file = json?.ToolFileModel?.File;
                    const key = `${file?.FilePath}/${file?.FileMD5}.${file?.FileExtention || file?.Extention}`;
                    url = json?.ToolFileModel ? await getOssUrl(key, "axsfile") : "";
                }

                const slide: Slide = await transformPageDetail(it, json);

                cacheFiles = [
                    ...cacheFiles,
                    ...(await this.cacheSlide(dealAnimationData(slide)))
                ];

                const obj = {
                    ID: it.ID,
                    TeachPageRelationID: it.TeachPageRelationID,
                    Name: it.Name,
                    Height: it.Height,
                    Width: it.Width,
                    Type: it.Type,
                    Sort: it.Sort,
                    State: it.State,
                    AcademicPresupposition: it.AcademicPresupposition,
                    DesignIntent: it.DesignIntent,
                    Json: dealAnimationData(slide),
                    Index: index,
                    Url: url,
                    ParentID: item.ID,
                    Remark: ""
                };
                pages.push(obj);
                if (it.State) {
                    index++;
                    pageList.push(obj);
                }
            }
            windowCards.push({
                ID: item.ID,
                Fold: true,
                Sort: item.Sort,
                Name: item.Name,
                PageList: pageList,
                TeachPageRelationID: item.TeachPageRelationID
            });
        }

        if (this.isEnd) return;

        if (this.isFail) return fail();
        this.cacheCallback?.cachingStatus(30);

        // 将json文件写入到指定文件夹，将缓存资源文件复制到指定文件夹，并对文件夹压缩后加密，形成离线包
        const cacheData = {
            pages,
            cacheFiles,
            cards: windowCards,
            windowId: winInfo.WindowID,
            userId: store.state.userInfo.id,
            windowName: cacheFileName.replace(/\.[^.]*$/, "")
        };
        const fileName = await window.electron.packCacheFiles(cacheData, path);

        if (this.isEnd) return;
        this.cacheCallback?.cachingStatus(100);
        window.electron.log.info(`课件下载：${fileName}`);
    }
}
