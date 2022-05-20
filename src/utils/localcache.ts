import { getPageDetailRes, getWindowCards, IGetWindowCards } from '@/api/home';
import { pageType } from '@/config';
import { store } from '@/store';
import { IPageValue } from '@/types/home';
import { Slide } from 'wincard/src/types/slides';
import { dealOldData } from './dataParse';
import { dealOldDataTeach, dealOldDataVideo, dealOldDataWord } from './dataParsePage';
import { getOssUrl } from './oss';

/**
 * new LocalCache({
        cachingStatus: (status) => {}
    }).doCache({
        WindowID: "3A00ED06A2F5D58C6F9148CB48417B4D",
        OriginType: 0
    })
 */

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

    // 获取所有的卡页
    private async getWindowCards(winInfo: IGetWindowCards) {
        return await getWindowCards(winInfo);
    }

    // 此处只拉取线上数据, 不使用本地缓存数据
    private async getPageDetail(page: IPageValue, originType: any) {
        const data = { pageID: page.ID, OriginType: originType };
        const type: number = this.transformType(page.Type);
        if (type < 0) {
            return null;
        }
        return await getPageDetailRes(data, type, () => { });
    };

    private async cacheFile(src: string) : Promise<string> {
        console.log(`cache file`, src);
        
        return new Promise(resolve => {
            const fileName = src.replace(/(.*\/)*([^.]+)/i, "$2");
            if (fileName === "ElementFile/" || fileName === "null") return resolve("");
            return window.electron.isExistFile(fileName).then((isExist) => {
                if (isExist) {
                    resolve(window.electron.getFilePath(fileName));
                } else {
                    getOssUrl(src, "axsfile").then(filePath => {
                        window.electron.ipcRenderer.invoke("downloadFile", filePath, fileName).then(path => resolve(path ? "file://" + path : ""));
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
            for(let element of slide.elements) {
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

        return cacheFiles;
    }

    async doCache(winInfo: IGetWindowCards) {
        this.cacheCallback?.cachingStatus(0);

        let cards = (await this.getWindowCards(winInfo)).result;
        let pages = [];
        let cacheFiles: string[] = [];
        let slides: Array<Slide> = [];

        for (let card of cards) {
            for (let page of card.PageList) {
                let res = await this.getPageDetail(page, page.OriginType);
                if (!res) {
                    continue;
                }
                pages.push({
                    id: page.ID,
                    result: res.result.Json || "{}"
                });
                let slide: Slide | null = null;
                if (page.Type === pageType.element) {
                    const slideString = res.result.Json || "{}";
                    const oldSlide = JSON.parse(slideString);
                    // 素材页如果是新数据直接赋值，旧数据dealOldData处理
                    slide = oldSlide.type ? oldSlide : await dealOldData(page.ID, 0, oldSlide);
                } else if (page.Type === pageType.listen) {
                    slide = dealOldDataWord(page.ID, res.result);
                } else if (page.Type === pageType.follow) {
                    slide = dealOldDataVideo(page.ID, res.result);
                } else if (page.Type === pageType.teach) {
                    slide = dealOldDataTeach(page.ID, res.result);
                }

                if (slide !== null) {
                    slides.push(slide);
                }
            }
        }

        this.cacheCallback?.cachingStatus(30);

        for (let slide of slides) {
            cacheFiles = [...cacheFiles, ...await this.cacheSlide(slide)];
        }

        // 将json文件写入到指定文件夹，将缓存资源文件复制到指定文件夹，并对文件夹压缩后加密，形成离线包
        console.log(cards, pages, cacheFiles);

        store.state.userInfo.id
    }
}

