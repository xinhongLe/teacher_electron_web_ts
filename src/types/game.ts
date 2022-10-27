/**
 * state 状态 1下架 2上架
 * name 游戏名称
 */
export interface IGetGameToolList {
    state: number,
    name: string,
}

/**
 * sort 序号
 * text 选项
 * rightKey 答案 0错误 1正确
*/
export interface IDollItem {
    Sort? : number,
    Text: string,
    RightKey: number
}

/**
 * subject 题目
 * answer 答案
 */
export interface IDollSubject {
    Sort? : number,
    Subject : string,
    Answer : string,
    Options: IDollItem[]
}

/**
 * teachPageID 窗卡 页ID
 */
export interface IDollSetRes {
    pageID: string,
    gameID: string,
    config: {
        question: IDollSubject[]
    }
}

export interface IQuackDollSetRes {
    pageID: string,
    gameID: string,
    text: string
}

interface IWordItem {
    sort? : number,
    subject : string,
    word : string,
    file: {
        bucket: string,
        filePath: string,
        fileName: string,
        extention: string,
        url: string,
    }
}

export interface IWordSet {
    pageID: string,
    config: {
        memoryTime: number,
        round: number,
        question: IWordItem[]
    }
}

export interface IFileItem {
    Bucket: string,
    FileName: string,
    FilePath: string,
    Type: number,
}

export interface IGameItem {
    ID: string,
    Name: string,
    Url: string,
    Type?: number,
    File: IFileItem
}
