export interface ITreeList {
    ID: string,
    Name: string,
    OriginType: number,
    Type: number,
    Children?: ITreeList[],
}

export interface IPageValue {
    ID: string,
    Type: number,
    TeachPageRelationID: string,
    Name?: string,
    Remark?: string,
    originType?: number,
    OriginType?: number,
    State: boolean
}

export interface ICardList {
    ID:string,
    Name: string,
    TeachPageRelationID: string,
    PageList: IPageValue[],
    State?: boolean
}

export interface ISlides {
    id: string,
    name: string,
    type: number
}

export interface ICards {
    id: string,
    name: string,
    slides: ISlides[]
}
