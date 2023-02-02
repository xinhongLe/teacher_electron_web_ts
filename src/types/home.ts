export interface ITreeList {
    ID: string;
    Name: string;
    OriginType: number;
    Type: number;
    Children?: ITreeList[];
}

export interface IPageValue {
    OldCardID?: string;
    ID: string;
    Type: number;
    TeachPageRelationID?: string;
    Name?: string;
    Remark?: string;
    AcademicPresupposition?: string;
    DesignIntent?: string;
    originType?: number;
    OriginType?: number;
    isAdd?: boolean;
    State: boolean;
    Json?: string;
    url?: string;
    ParentNum?: number;
    ParentID?: string;
    count?: number;
}

export interface ICardList {
    ID: string;
    Name: string;
    TeachPageRelationID?: string;
    Sort: number;
    PageList: IPageValue[];
    isAdd?: boolean;
    State?: boolean;
}

export interface ISlides {
    id: string;
    name: string;
    type: number;
}

export interface ICards {
    id: string;
    name: string;
    slides: ISlides[];
}

/**
 * type  page插入页  elements 插入元素
 */
export interface ITemplateSave {
    type: string;
    data: any[];
}
