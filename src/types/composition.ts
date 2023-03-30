export interface FetchAllPassage {
    GradeId?: string | null;
    GradeName?: string | null;
    ClassId?: string | null;
    ClassName?: string | null;
    TeacherId?: string | null;
    Pager?: any;
}

export interface getClassStuCount {
    OrgId?: string;
    UserId?: string;
    SemesterCode?:string|number|null;
}

export interface IAddArticle {
    Title: string;
    GradeId?: string | null;
    ChapterId?: string | null;
    TeacherId?: string;
    TeacherName?: string;
    ClassId?: string;
    StudentCount?: string;
}

export interface IdeleteArticle{
    Id: string | null;
}

/************************************* */

export interface IdownLoadBatchImportModel{
    
}

export interface IresubmitCorrectComposition{
    StudentCompositionId?: string | null;
}

// multiple form data
export interface IcompositionBatchImport{
    TeacherCompositionId: string | null;
    File: any;
}

export interface IsearchStudentListForCorrect{
    TeacherCompositionId: string | null; // 老师作文id
    FlagForBatch?: string | null;
    Pager: any
}

export interface IsearchStudentListForReport{
    TeacherCompositionId: string | null; // 老师作文id
    FlagForBatch?: string | null;
    Pager: any
}

export interface IcorrectWithOneKey{
    TeacherCompositionId: string | null;
    FlagForBatch?: string | null;
}

export interface IsendReportWithOneKey{
    TeacherCompositionId: string | null;
    FlagForBatch?: string | null;
}

export interface IsearchReportDetail{
    StudentCompositionId: string | null;
}

export interface IeditReportDetail{
    StudentCompositionId: string | null;
    SaveType?: number; // 保存信息类型(1-分数;2-评价等级;3-综合点评;4-优点;5-缺点;6-改进建议;)
    SaveInfo?: string | null; //保存信息
}

export interface IshareReportUrl{
    TeacherCompositionId: string | null;
}

export interface IdownloadPDF{
    StudentCompositionId: string;
}

export interface IgetStudentByClass{
    ClassId?: string | null;
}

export interface IgetStudentByHasEntry{
    TeacherCompositionId?: string | null;
    ClassId?: string | null;
}

export interface IgetStudentByUserInfo{
    UserInfo?: string | null;
    ClassId?: string | null;
    TeacherCompositionId?: string | null;
}

export interface IoneStudentEntry{
    TeacherCompositionId?: string | null;
    StudentId?: string | null;
    ClassId?: string | null;
    Content?: string | null;
    Title?: string | null;
    OperatorId?: string | null;
    StudentCompositionFile:any;
}

export interface IdeleteStudentEntry{
    StudentCompositionId?: string | null;
    OperatorId?: string | null;
}

export interface IgetStudentComByTeacherComId{
    TeacherCompositionId?: string | null;
    ClassId?: string | null;
    Status?:number;
    Pager?:any;
}

export interface IgetStatusCountByTeacherComId{
    TeacherCompositionId?: string | null;
    ClassId?: string | null;
    Pager?:any;
}

export interface IlookContent{
    StudentCompositionId: string;
}

export interface IsaveContent{
    StudentCompositionId?: string;
    Content?: string;
    OperatorId?: string;
}

// export interface IdeleteArticle{
//     TitleId: string;
// }