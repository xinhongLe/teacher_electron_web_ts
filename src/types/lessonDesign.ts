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

export interface ItemForm {
    Name: string,
    Value: string,
    isSelectId: string | string[],
    FieldType: number,
    SelectType: number,
    Sort: number,
    Status: number,
    LessonPlanDetailOptions: any[],
    LessonPlanDetailPages: any[],
}

export interface IFrom {
    // titleValue: ItemForm
    templateType: string;
    lessonBasicInfoList: ItemForm[],
    // title: string;
    // book: string;
    // chapter: string;
    // lesson: string;
    // classType: string;
    // analyze: string;
    // targets: IData[];
    // teachingDifficulty: string;
    // teachingFocus: string;
    // teachingPreparation: string;
    // teachProgress: ITeachProgress[];
    // teachingReflection: string;
    // homework: string;
}

export interface ITemplateItem {
    Status: number
    Name: string;
    ID?: string;
    GroupName?: string;
    Sort?: number;
}

export interface ITemplateList {
    Name: string;
    ID: string;
    Sort: number,
    IsSystem: number,
    Detail: { Name: string, ID?:string, Status: number }[]
}
