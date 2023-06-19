import {Slide} from "wincard";

/**
 素材页保存处理
 */
export const dealSaveDataElement = (data: Slide) => {
    return {
        PageID: data.id,
        Json: JSON.stringify(data)
    };
};

/**
 听写页保存处理
 */
export const dealSaveDataWord = (data: Slide) => {
    const Words = data.listenWords?.map((word, index) => {
        return {
            sort: index + 1,
            WordID: word.id,
            PageWordID: word.pageWordID ? null : word.pageWordID,
            WordInterval: 2
        };
    });
    return {
        PageID: data.id,
        Words: Words
    };
};

/**
 跟读页保存处理
 */
export const dealSaveDataVideo = (data: Slide) => {
    return {
        PageID: data.id,
        VideoID: data.follow?.id
    };
};

/**
 教具页保存处理
 */
export const dealSaveDataTeach = (data: Slide) => {
    return {
        teacherPageID: data.id,
        teachMiniToolID: data.teach?.id
    };
};

/**
 游戏页保存处理
 */
export const dealSaveDataGame = (data: Slide) => {
    return {
        PageID: data.id,
        gameId: data.game?.id
    };
};
