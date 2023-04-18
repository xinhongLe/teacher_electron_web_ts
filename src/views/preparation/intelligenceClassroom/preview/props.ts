export interface PageProps {
    Json: any;
    PageID: string;
    PageName: string;
    PageType: number;
    Index: number;
    AcademicPresupposition: string;
}

export interface CardProps {
    CardID: string;
    CardName: string;
    Pages: PageProps[];
    Fold: boolean;
}
