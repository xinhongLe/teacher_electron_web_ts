export interface PageProps {
    Json: any;
    ID: string;
    Url: string;
    Name: string;
    Type: number;
    Sort: number;
    Width: number;
    State: number;
    Index: number;
    Height: number;
    Remark: string;
    ParentID: string;
    DesignIntent: string;
    TeachPageRelationID: string;
    AcademicPresupposition: string;
}

export interface CardProps {
    ID: string;
    Name: string;
    Sort: number;
    Fold: boolean;
    PageList: PageProps[];
    TeachPageRelationID: string;
}

export interface MaterialProp {
    data: any;
    type: "elements" | "page";
    teachPageTemplateID?: string;
}
