interface IData {
    id: string;
    value: string;
}
export interface IContent {
    id: string;
    progress: string;
    design: string;
}
interface ITeachProgress {
    id: string;
    title: string;
    contents: IContent[];
}

export interface IFrom {
    title: string;
    book: string;
    chapter: string;
    lesson: string;
    templateType: string;
    classType: string;
    analyze: string;
    targets: IData[];
    teachingDifficulty: string;
    teachingFocus: string;
    teachingPreparation: string;
    teachProgress: ITeachProgress[];
    teachingReflection: string;
    homework: string;
}

export interface ITemplateItem {
    Status: number
    Name: string;
    ID?: string;
}

export interface ITemplateList {
    Name: string;
    ID: string;
    Sort: number,
    IsSystem: number,
    Detail: { Name: string, ID:string }[]
}
