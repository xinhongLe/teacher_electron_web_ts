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

export interface IFileItem {
    Name?:string,
    url?:string,
    Bucket: string,
    FileName: string,
    FilePath: string,
    Extention: string,
    Type: number,
}

/**
 * subject 题目
 * answer 答案
 */
export interface IDollSubject {
    Sort? : number,
    Subject : string,
    Answer? : string,
    Options: IDollItem[]
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

export interface IGameItem {
    ID: string,
    Name: string,
    Url: string,
    Type?: number,
    File: IFileItem
}

interface IPosition {
    x: number,
    y: number,
}

interface ISize{
    Width: number,
    Height: number,
}

export interface IClassItem {
    Id?: string,
    TypeId?: string,
    selectId?: string,
    Type: number,
    Data: string,
    File: IFileItem,
    Position: IPosition,
    Size: ISize
}

export interface IClassOption extends IClassItem{
    Item: IClassItem[]
}

export interface IClassSet {
    Type: number,
    ThemeId: number,
    AutoJudge: number,
    classData: IClassOption
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

export interface ITugOfWarSetRes {
    pageID: string,
    gameID: string,
    config: {
        info: {
            Time: string | number,
            Mode: number,
            Order: number,
        },
        question: IDollSubject[]
    }
}

export interface ICarSetRes {
    pageID: string,
    gameID: string,
    config: {
        info: {
            Time: string | number,
            Mode: number,
            Order: number,
        },
        data: {
            Question?: string,
            Select:number,
            File?: IFileItem
        }[]
    }
}

export interface IClassSetRes {
    pageID: string,
    gameID: string,
    config: {
        AutoJudge: boolean,
        ThemeId: number,
        ClassificationData:IClassOption[]
    }
}
