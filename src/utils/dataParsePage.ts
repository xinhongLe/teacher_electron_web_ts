import { Slide, SlideBackground } from "wincard/src/types/slides";
// import { createRandomCode } from "@/utils/common";

interface IFile {
    ID: string,
    Extention: string,
    FileName: string,
    FilePath: string,
    Name?:string
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
    ToolFileModel: IToolFile
}

/**
 听写页处理
 */
export const dealOldDataWord = (pageID: string, oldWords: IOldWord[]) => {
    const slide: Slide = {
        id: pageID,
        type: "listen",
        viewportRatio: 0.5625,
        elements: []
    };
    slide.listenWords = getSlideWord(oldWords);
    slide.background = getSlideBackground();
    return slide;
};

const getSlideWord = (words: IOldWord[]) => {
    const arr = words.map((item: IOldWord) => {
        return {
            id: item.WordID,
            name: item.Name,
            pageWordID: item.PageWordID,
            extention: item.File.Extention,
            file: item.File.FilePath + "/" + item.File.FileName + "." + item.File.Extention
        };
    });
    return arr;
};

const getSlideBackground = () => {
    const background: SlideBackground = {
        type: "solid",
        color: "#ffffff"
    };
    return background;
};

/**
   跟读页处理
 */
export const dealOldDataVideo = (pageID: string, oldSlide: IOldVideo) => {
    const slide: Slide = {
        id: pageID,
        type: "follow",
        viewportRatio: 0.5625,
        elements: []
    };
    if (oldSlide.VideoFile) {
        slide.follow = getSlideVideo(oldSlide);
    }
    slide.background = getSlideBackground();
    return slide;
};

const getSlideVideo = (oldSlide: IOldVideo) => {
    const pauses = oldSlide.Pauses ? oldSlide.Pauses.map((item:string) => {
        return {
            time: item.split(".")[0]
        };
    }) : [];
    const follow = {
        id: oldSlide.VideoFile.ID,
        src: oldSlide.VideoFile.FilePath + "/" + oldSlide.VideoFile.FileName + "." + oldSlide.VideoFile.Extention,
        pauseList: pauses
    };
    return follow;
};

/**
 教具页处理
 */

export const dealOldDataTeach = (pageID: string, oldSlide: IOldTeach) => {
    const slide: Slide = {
        id: pageID,
        type: "teach",
        viewportRatio: 0.5625,
        elements: []
    };
    if (oldSlide && oldSlide.ToolFileModel) {
        slide.teach = {
            id: oldSlide.ToolFileModel.ID,
            name: oldSlide.ToolFileModel.Name,
            src: oldSlide.ToolFileModel.Url
        };
    }
    return slide;
};
