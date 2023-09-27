import request from "@/utils/request";
import { AI_XUE_SHI_API } from "@/config";
import { IResponse, RequestFun } from "@/types/response";
import { IErrorHBook } from "@/types/errorbook";

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

export interface FlowText {
    AnalysisConfig: number;
    AnswerContent: string;
    QuestionContent: string;
    QuestionType: number;

}

//题目详情返回参数
export interface ErrorQuestionDetails {
    QuestionInfo: {
        QuestionId: string;
        QuestionText: string;
        QuestionType: number;
        QuestionKnowledges: QuestionKnowledges[];
        QuestionFlowText?: FlowText[] | undefined;
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

//学生做题历史入参
export interface historyStudylParams {
    MissionStudyID: string;
}

//做题入参
export interface historyParams {
    StudentID: string;
    QuestionId: string;
    // StartDate: string;
    // EndDate: string;
    Result: number;
}

interface Questions {
    questionId: string;
    questionType: number;
}

//添加试题篮入参
export interface basketParams {
    questions: Questions[];
    classId: string;
    bookId: string;
    // questionType: number;
}

//试题篮集合详情
export interface basketInfoParams {
    bookId: string;
    classId: string;
}

//移出试题篮
export interface delBasketParams {
    classId: string;
    bookId: string;
    questionIds: string[];
    questionType: number;
    isAllDel: number;
}

//查询布置作业页面信息入参
export interface homeworkPagerInfoParams {
    ID: string;
}

//修改作业名称入参
export interface updatePaperNameParams {
    PaperId: string;
    Name: string;
}

//布置作业入参
export interface paperWorkParams {
    PaperId: string;
    ClassId: string;
    SubjectId: string;
    StudentIds: string[];
}

type GetLeftMenuByHomeWork = IResponse<LeftMenuByHomeWork[]>;
type GetKnowledgeLabList = IResponse<KnowledgeLabList[]>;
export type GetErrorQuestionDetail = IResponse<ErrorQuestionDetails>;

// 按照作业维度查询左侧树列表
export function searchLeftMenuByHomeWork(
    data: LeftMenuParams
): Promise<GetLeftMenuByHomeWork> {
    return request({
        baseURL: AI_XUE_SHI_API,
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
        baseURL: AI_XUE_SHI_API,
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
        baseURL: AI_XUE_SHI_API,
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
        baseURL: AI_XUE_SHI_API,
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
        baseURL: AI_XUE_SHI_API,
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
        baseURL: AI_XUE_SHI_API,
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
        baseURL: AI_XUE_SHI_API,
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
        baseURL: AI_XUE_SHI_API,
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
        baseURL: AI_XUE_SHI_API,
        url: "Api/Web/ClassErrorQuestionBook/GetErrorQuestionDetail",
        headers: {
            "Content-Type": "application/json-patch+json",
            // noLoading: "true",
        },
        method: "post",
        data: data,
    });
}

//获取做题id查做题记录详情
export function getDetailByMissionStudyID(data: historyStudylParams) {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "Api/V2/Teacher/Main/GetDetailByMissionStudyID",
        headers: {
            "Content-Type": "application/json-patch+json",
            // noLoading: "true",
        },
        method: "post",
        data: data,
    });
}

//查学生某道题的做题记录
export function getStudentQuestionMissionStudyIds(data: historyParams) {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "Api/V2/Teacher/Main/GetStudentQuestionMissionStudyIds",
        headers: {
            "Content-Type": "application/json-patch+json",
            noLoading: "true",
        },
        method: "post",
        data: data,
    });
}

//添加试题篮
export function AddIntoPaperBasket(data: basketParams) {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "Api/Web/ClassErrorQuestionBook/AddIntoPaperBasket",
        headers: {
            "Content-Type": "application/json-patch+json",
            // noLoading: "true",
        },
        method: "post",
        data: data,
    });
}

//查询试题篮的试题
export function PaperBasketInfo(data: basketInfoParams) {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "Api/Web/ClassErrorQuestionBook/PaperBasketInfo",
        headers: {
            "Content-Type": "application/json-patch+json",
            // noLoading: "true",
        },
        method: "post",
        data: data,
    });
}

//从试题篮中移出
export function DelQuestionForPaperBasket(data: delBasketParams) {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "Api/Web/ClassErrorQuestionBook/DelQuestionForPaperBasket",
        headers: {
            "Content-Type": "application/json-patch+json",
            // noLoading: "true",
        },
        method: "post",
        data: data,
    });
}

//试题生成练习
export function AddPaperForPaperBasket(data: any) {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "Api/Web/ClassErrorQuestionBook/AddPaperForPaperBasket",
        headers: {
            "Content-Type": "application/json-patch+json",
            // noLoading: "true",
        },
        method: "post",
        data: data,
    });
}

//下载为word
export function ErrorPaperToWord(data: any) {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "Api/Web/ClassErrorQuestionBook/ErrorPaperToWord",
        headers: {
            "Content-Type": "application/json-patch+json",
            // noLoading: "true",
        },
        method: "post",
        data: data,
    });
}

//布置作业页面作业信息
export function getHomeworkPaperInfo(data: homeworkPagerInfoParams) {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "Api/Web/ClassErrorQuestionBook/HomeworkPaperInfo",
        headers: {
            "Content-Type": "application/json-patch+json",
            // noLoading: "true",
        },
        method: "post",
        data: data,
    });
}

//修改作业名称
export function updatePaperName(data: updatePaperNameParams) {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "Api/Web/ClassErrorQuestionBook/UpdatePaperName",
        headers: {
            "Content-Type": "application/json-patch+json",
            // noLoading: "true",
        },
        method: "post",
        data: data,
    });
}

//布置作业
export function sendErrorPaperWork(data: paperWorkParams) {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "Api/Web/ClassErrorQuestionBook/SendErrorPaperWork",
        headers: {
            "Content-Type": "application/json-patch+json",
            // noLoading: "true",
        },
        method: "post",
        data: data,
    });
}

//获取指定时间段内班级有错题作业的教科书
export function GetErrorHomeworkBooks(data: IErrorHBook) {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "Api/Web/ClassErrorQuestionBook/GetErrorHomeworkBooks",
        headers: {
            "Content-Type": "application/json-patch+json",
            // noLoading: "true",
        },
        method: "post",
        data: data,
    });
}
