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
    Name?: string,
}

export interface ICardList {
    ID:string,
    Name: string,
    TeachPageRelationID: string,
    PageList: IPageValue[]
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
