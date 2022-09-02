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
    Name: string;
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

type GetLeftMenuByHomeWork = IResponse<LeftMenuByHomeWork[]>;
type GetKnowledgeLabList = IResponse<KnowledgeLabList[]>;

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
