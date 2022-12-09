/**
 * Type 1教具 2 照片 3 插画 4标题框 5 视频 6 音频 7 题目 8 工具
 * text 选项
 * rightKey 答案 0错误 1正确
 */
export interface ISaveMaterial {
    Type: number;
    Files: { Json: string }[];
    lessons: { SubjectID: string; LessonID: string[] }[];
}
export interface IPageData {
    PageID: string;
    PageName: string;
    Height: number;
    Width: number;
    Type: number;
    Sort: number;
    State: number;
    Remark: string;
    Json: string;
    FranchiseeID: string;
    AcademicPresupposition: string;
    DesignIntent: string;
}
export interface ISaveTemplate {
    ID: string;
    OriginType: number;
    Name: string;
    LessonID: string;
    SubjectID: string;
    TeacherID: string;
    Status: number;
    EstimatedDuration: number;
    HavingAudio: number;
    HavingVideo: number;
    TeachPageClassroomLink: {
        TeachPageClassroomLinkID: string;
        Name: string;
    };
    PageData: IPageData[];
}
export interface IClassRoom {
    SubjectID: string;
}
export interface IGetList {
    SubjectID: string;
    TeachPageClassroomLinkID: string;
    QueryText: string;
    TeachPageTemplateID?: string;
}
export interface IGetMyList {
    TeacherID: string;
    QueryText: string;
}

export interface IAddTem {
    TeachPageTemplateID: string;
    TeacherID: string;
}
export interface IDelTem {
    TeacherID: string;
    ID: string;
}
export interface IUpdateStatus {
    TeachPageTemplateID: string;
    Status: number;
}
export interface IUpdateSort {
    TeachPageTemplateID: string;
    TeachPageClassroomLinkID: string;
}

export interface IDetail {
    Sort: number;
    ID: string;
}
export interface IRecordSort {
    TeacherID: string;
    Detail: IDetail[];
}

export interface IMaterialParams {
    Type?: Number;
    Word?: String;
    LessonLable?: {
        SubjectID?: string;
        PublisherID?: string;
        AlbumID?: string;
        ChapterID?: string;
        LessonID?: string[];
        SourceMaterialMainID?: string;
        CollectionsMainID?: string;
    };
}

export interface ICategory {
    Type: Number;
    MaterialId: String;
}

export interface IAdviceCol {
    Id: string;
    Lable: string;
}
export interface IDAssembly {
    Id: string;
}

export interface IGAssembly {
    SubjectID: string;
    QueryText?: string;
    TeacherID?: string;
}
