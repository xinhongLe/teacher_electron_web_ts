export interface PageProps {
    ID: string
    TeachPageRelationID: string
    Name: string
    Height: number
    Width: number
    Type: number
    Sort: number
    State: number
    AcademicPresupposition: string
    DesignIntent: string
    Json: any
    Index: number
    Url: string
    ParentID: string
}

export interface CardProps {
    ID: string
    TeachPageRelationID: string
    Name: string
    Sort: number
    PageList: PageProps[]
    Fold: boolean
}
