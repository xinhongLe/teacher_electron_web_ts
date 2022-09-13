import request from "@/utils/request";
import { AI_XUE_SHI_API_WRONG_BOOK } from "@/config";
import { IResponse, RequestFun } from "@/types/response";

//错题本左侧树形数据
export interface LeftMenuByHomeWork {
    PaperId: string;
    PaperName: string;
    PublishTime: string;
    ErrQuestionTotal: number;
    QuestionIds: string[];
}
//错题本左侧树形数据-参数
export interface LeftMenuParams {
    BookId?: string;
    ClassId?: string;
    Name?: string;
    StartTime?: string;
    EndTime?: string;
    Id?: string;
}
//查询书册下拉-参数
export interface KnowledgeLabParams {
    gradeId: string;
}
//左侧下拉返回数据
export interface KnowledgeLabList {
    Id: string;
    Name: string;
}

//查询列表的
//按作业维度-入参
export interface QuestionListByHomeworkParams {
    ClassHomeworkPaperId?: string;
    SortContent: number;
    SortTagLevel?: number;
    SortType?: number;
}
//按知识点维度-入参
export interface QuestionListByKnowledgeLibParams {
    ClassId: string;
    KnowledgeLibId: string;
    StartDate: string;
    EndDate: string;
}
//按章节课时维度-入参
export interface ChapterLessonParams {
    ClassId?: string;
    ChapterId?: string;
    LessonId?: string;
    QuestionType?: number[];
    StartDate?: string;
    EndDate?: string;
}
//查询题目详情入参
export interface ErrorQuestionDetailParams {
    ClassHomeworkPaperQuestionIds?: string[];
    QuestionId: string;
}
interface QuestionKnowledges {
    ID: string;
    Name: string;
}
interface Homeworks {
    AvgWrongRatio: number;
    FinishRatio: number;
    ClassHomeworkPaperID: string;
    CreateTime: string;
    Name: string;
    TotalWrong: number;
    TotalNoSure: number;
    TotalRight: number;
    Total: number;
}
interface Students {
    StudentId: string;
    HeadPortrait: {
        ID: string;
        Name: string;
        SN: 0;
        FileName: string;
        Bucket: string;
        FilePath: string;
        Extention: string;
        FileMD5: string;
        Type: number;
        StaffID: string;
    };
    Account: string;
    Name: string;
    ErrorCount: number;
    TotalCount: number;
}
export interface RepeatWrongStudentTags {
    TagId: string;
    TagName: string;
    TagLevel: number;
    Students: Students[];
}
//题目详情返回参数
export interface ErrorQuestionDetails {
    QuestionInfo: {
        QuestionId: string;
        QuestionText: string;
        QuestionType: number;
        QuestionKnowledges: QuestionKnowledges[];
        QuestionOriginFile: {
            ID: string;
            Name: string;
            SN: number;
            FileName: string;
            Bucket: string;
            FilePath: string;
            Extention: string;
            FileMD5: string;
            Type: number;
            StaffID: string;
        };
    };
    TotalWrong: number;
    TotalNoSure: number;
    TotalRight: number;
    Total: number;
    Homeworks: Homeworks[];
    RepeatWrongStudentTags: RepeatWrongStudentTags[];
}

type GetLeftMenuByHomeWork = IResponse<LeftMenuByHomeWork[]>;
type GetKnowledgeLabList = IResponse<KnowledgeLabList[]>;
export type GetErrorQuestionDetail = IResponse<ErrorQuestionDetails>;

// 按照作业维度查询左侧树列表
export function searchLeftMenuByHomeWork(
    data: LeftMenuParams
): Promise<GetLeftMenuByHomeWork> {
    return request({
        baseURL: AI_XUE_SHI_API_WRONG_BOOK,
        url: "/Api/Web/ClassErrorQuestionBook/SearchLeftMenuByHomeWork",
        headers: {
            "Content-Type": "application/json-patch+json",
            noLoading: "true",
        },
        method: "post",
        data: data,
    });
}

//按作业按章节 查询 书册下拉
export function searchByKnowledgeLabList(
    data: KnowledgeLabParams
): Promise<GetKnowledgeLabList> {
    return request({
        baseURL: AI_XUE_SHI_API_WRONG_BOOK,
        url: "/Api/Web/ClassErrorQuestionBook/SearchByKnowledgeLabList",
        headers: {
            "Content-Type": "application/json-patch+json",
            noLoading: "true",
        },
        method: "post",
        data: data,
    });
}

//按章节查询 左侧项目树
export function searchLeftMeunByChapter(
    data: LeftMenuParams
): Promise<GetLeftMenuByHomeWork> {
    return request({
        baseURL: AI_XUE_SHI_API_WRONG_BOOK,
        url: "/Api/Web/ClassErrorQuestionBook/SearchLeftMeunByChapter",
        headers: {
            "Content-Type": "application/json-patch+json",
            noLoading: "true",
        },
        method: "post",
        data: data,
    });
}

//按知识点 查左侧项目树
export function searchLeftMeunByKnowledge(
    data: LeftMenuParams
): Promise<GetLeftMenuByHomeWork> {
    return request({
        baseURL: AI_XUE_SHI_API_WRONG_BOOK,
        url: "/Api/Web/ClassErrorQuestionBook/SearchLeftMeunByKnowledge",
        headers: {
            "Content-Type": "application/json-patch+json",
            noLoading: "true",
        },
        method: "post",
        data: data,
    });
}

//按作业维度获取错题的题目列表
export function getErrorQuestionListByHomework(
    data: QuestionListByHomeworkParams
) {
    return request({
        baseURL: AI_XUE_SHI_API_WRONG_BOOK,
        url: "/Api/Web/ClassErrorQuestionBook/GetErrorQuestionListByHomework",
        headers: {
            "Content-Type": "application/json-patch+json",
            // noLoading: "true",
        },
        method: "post",
        data: data,
    });
}

//按知识点维度获取错题列表
export function getErrorQuestionListByKnowledgeLib(
    data: QuestionListByKnowledgeLibParams
) {
    return request({
        baseURL: AI_XUE_SHI_API_WRONG_BOOK,
        url: "/Api/Web/ClassErrorQuestionBook/GetErrorQuestionListByKnowledgeLib",
        headers: {
            "Content-Type": "application/json-patch+json",
            // noLoading: "true",
        },
        method: "post",
        data: data,
    });
}
//按章节课时维度获取错题的列表
export function getErrorQuestionListByChapterLesson(data: ChapterLessonParams) {
    return request({
        baseURL: AI_XUE_SHI_API_WRONG_BOOK,
        url: "/Api/Web/ClassErrorQuestionBook/GetErrorQuestionListByChapterLesson",
        headers: {
            "Content-Type": "application/json-patch+json",
            // noLoading: "true",
        },
        method: "post",
        data: data,
    });
}
//查询基础分层标签
export function getBasicTag() {
    return request({
        baseURL: AI_XUE_SHI_API_WRONG_BOOK,
        url: "Api/V2/Universal/BaseData",
        headers: {
            "Content-Type": "application/json-patch+json",
            noLoading: "true",
        },
        method: "post",
    });
}
//获取错题详情数据
export function getErrorQuestionDetail(
    data: ErrorQuestionDetailParams
): Promise<GetErrorQuestionDetail> {
    return request({
        baseURL: AI_XUE_SHI_API_WRONG_BOOK,
        url: "Api/Web/ClassErrorQuestionBook/GetErrorQuestionDetail",
        headers: {
            "Content-Type": "application/json-patch+json",
            // noLoading: "true",
        },
        method: "post",
        data: data,
    });
}
