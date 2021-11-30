import request from "@/utils/request";
import { AI_XUE_SHI_API } from "@/config";
import { RequestFun } from "@/types/response";
import {
    ChangeResultData,
    ClassHomeworkPaperQuestion,
    FetchDetailByMissionStudyIDData,
    FetchMissionListData,
    FetchQuestinInfoByQuestionIDData,
    Mission,
    QuestinInfo,
    QuestionDetail
} from "@/types/checkHomework";

// 老师查询班级作业中的学生做题情况
export const fetchMissionList: RequestFun<FetchMissionListData, Mission[]> = (
    data
) => {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/W4/HomeworkIntegration/GetMissionList",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
};

// 老师查询班级作业中的题目做题情况
export const fetchClassHomeworkPaperQuestionList: RequestFun<
    FetchMissionListData,
    ClassHomeworkPaperQuestion[]
> = (data) => {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/W4/HomeworkIntegration/GetClassHomeworkPaperQuestionList",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
};

// 根据题目ID获取题目信息
export const fetchQuestinInfoByQuestionID: RequestFun<
    FetchQuestinInfoByQuestionIDData,
    QuestinInfo
> = (data) => {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/W4/HomeworkIntegration/GetQuestinInfoByQuestionID",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
};

// 根据做题记录获取做题详情
export const fetchDetailByMissionStudyID: RequestFun<
    FetchDetailByMissionStudyIDData,
    QuestionDetail
> = (data) => {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/W4/HomeworkIntegration/GetDetailByMissionStudyID",
        headers: {
            "Content-Type": "application/json-patch+json",
            noLoading: "true"
        },
        method: "post",
        data
    });
};

// 改对错和审阅
export const changeResult: RequestFun<ChangeResultData, null> = (data) => {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/API/W4/HomeworkIntegration/ChangeResult",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
};
