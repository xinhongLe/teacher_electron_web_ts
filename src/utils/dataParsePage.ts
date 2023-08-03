import { pageType } from "@/config";
import { Slide, SlideBackground } from "wincard";

interface IFile {
    ID: string,
    Extention: string,
    FileName: string,
    FilePath: string,
    Name?: string
}

interface IOldWord {
    Name: string,
    PageWordID: string,
    WordID: string
    WordInterval: number,
    File: IFile
}

interface IOldVideo {
    Pauses: string[],
    VideoFile: IFile,
    Length: number
}

interface IToolFile {
    ID: string,
    Name: string,
    Url: string

}

interface IOldTeach {
    ID: string,
    ToolFileModel: IToolFile,
    Config?: any // 游戏页配置回显
}

export const initSlideData = (pageID: string, type: number) => {
    const typeName = pageType[type] as "element" | "listen" | "follow" | "teach";
    const slide: Slide = {
        id: pageID,
        type: typeName,
        viewportRatio: 0.5625,
        elements: []
    };
    slide.background = getSlideBackground();
    if (type === pageType.listen) {
        slide.listenWords = [];
    } else if (type === pageType.element) {
        slide.steps = [];
    }
    return slide;
};

/**
 听写页处理
 */
export const dealOldDataWord = (pageID: string, data: any) => {
    const slide: Slide = {
        id: pageID,
        type: "listen",
        viewportRatio: 0.5625,
        elements: []
    };
    slide.listenWords = "listenWords" in data ? data.listenWords : getSlideWord(data instanceof Array ? data : []);
    slide.background = getSlideBackground();
    return slide;
};

const getSlideWord = (words: any) => {
    if (!words || !(words instanceof Array)) return [];
    return words.map((item: IOldWord) => {
        return {
            id: item.WordID,
            name: item.Name,
            pageWordID: item.PageWordID,
            extention: item.File?.Extention,
            file: item.File?.FilePath + "/" + item.File?.FileName + "." + item.File?.Extention
        };
    });
};

const getSlideBackground = () => {
    const background: SlideBackground = {
        type: "solid",
        color: "#F6FFFB"
    };
    return background;
};

/**
 跟读页处理
 */
export const dealOldDataVideo = (pageID: string, oldSlide: any) => {
    const slide: Slide = {
        id: pageID,
        type: "follow",
        viewportRatio: 0.5625,
        elements: []
    };
    if (oldSlide.VideoFile) {
        slide.follow = getSlideVideo(oldSlide);
    }
    if (oldSlide.follow) {
        slide.follow = oldSlide.follow;
    }
    slide.background = getSlideBackground();
    return slide;
};

const getSlideVideo = (oldSlide: IOldVideo) => {
    const pauses = oldSlide.Pauses ? oldSlide.Pauses.map((item: string) => {
        return {
            time: item.split(".")[0]
        };
    }) : [];
    return {
        id: oldSlide.VideoFile.ID,
        src: oldSlide.VideoFile.FilePath + "/" + oldSlide.VideoFile.FileName + "." + oldSlide.VideoFile.Extention,
        pauseList: pauses
    };
};

/**
 教具页处理
 */

export const dealOldDataTeach = (pageID: string, oldSlide: any) => {
    const slide: Slide = {
        id: pageID,
        type: "teach",
        viewportRatio: 0.5625,
        elements: []
    };
    const ToolFileModel = oldSlide.ToolFileModel;
    if (ToolFileModel) {
        (slide.teach as any) = {
            id: ToolFileModel.ID,
            name: ToolFileModel.Name,
            src: ToolFileModel.Url,
            file: !ToolFileModel.File ? "" : ToolFileModel.File.FilePath + "/" + ToolFileModel.File.FileName + "." + ToolFileModel.File.Extention
        };
    }
    if (oldSlide && oldSlide.teach) {
        slide.teach = oldSlide.teach;
    }
    return slide;
};

/**
 游戏页处理
 */

export const dealOldDataGame = (pageID: string, oldSlide: any) => {
    const slide: Slide = {
        id: pageID,
        type: "game",
        viewportRatio: 0.5625,
        elements: []
    };
    if (oldSlide.game) {
        slide.game = oldSlide.game;
    }
    if (oldSlide && oldSlide.ToolFileModel) {
        slide.game = {
            id: oldSlide.ToolFileModel.ID,
            name: oldSlide.ToolFileModel.Name,
            src: `${oldSlide.ToolFileModel.Url}?pageId=${pageID}`
        };
    }
    if (oldSlide && oldSlide.Config) {
        slide.config = oldSlide.Config;
    }
    if (oldSlide && oldSlide.teach) {
        slide.game = oldSlide.game;
    }
    return slide;
};
