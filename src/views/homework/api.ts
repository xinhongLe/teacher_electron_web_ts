import request from "@/utils/request";
import { AI_XUE_SHI_API, YUN_API_ONECARD } from "@/config";
import { RequestFun } from "@/types/response";
import {
    FetchClassHomeworkPaperListData,
    FetchHomeworkDateByYearData,
    RebackHomeworkPaperData,
    RebackShowAnswer,
    RebackHideAnswer,
    Homework,
    StudentMission,
    StudentDetAndPageInfo,
    PageInfo,
    PointsPackage,
    SvImgIn, Id, ISendWrongTopicRes
} from "@/types/homework";
import { ChartView } from "echarts";
import { AnyRecord } from "dns";

// 获取一年中有作业的日期
export const fetchHomeworkDateByYear: RequestFun<
    FetchHomeworkDateByYearData,
    string[]
> = (data) => {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/W4/HomeworkIntegration/GetHomeworkDateByYear",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
};

// 老师查询全部类型的班级作业
export const fetchClassHomeworkPaperList: RequestFun<
    FetchClassHomeworkPaperListData,
    Homework[]
> = (data) => {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/W4/HomeworkIntegration/GetClassHomeworkPaperList",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
};

// 班级作业练习卷撤回
export const rebackHomeworkPaper: RequestFun<RebackHomeworkPaperData, null> = (
    data
) => {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/API/W4/HomeworkIntegration/RebackHomeworkPaper",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
};

// 公布答案
export const ShowAnswer: RequestFun<RebackShowAnswer, null> = (
    data
) => {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/API/W4/HomeworkIntegration/ShowAnswer",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
};

// 隐藏
export const HideAnswer: RequestFun<RebackHideAnswer, null> = (
    data
) => {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/API/W4/HomeworkIntegration/HideAnswer",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
};

// 获取所有学生的任务信息
// eslint-disable-next-line @typescript-eslint/ban-types
export const GetStudentMissionList: RequestFun<Object, StudentMission[]> = (
    data
) => {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/V2/Teacher/TeacherHightPhoto/GetStudentMissionList",
        headers: {
            "Content-Type": "application/json-patch+json",
            noLoading: "true"
        },
        method: "post",
        data
    });
};

// 获取页面原图及页面题目框信息
export const GetWorkbookPageInfo: RequestFun<PageInfo, any> = (
    data
) => {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/API/V2/Teacher/TeacherHightPhoto/GetWorkbookPageInfo",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
};

// 获取已完成学生的完成情况
export const GetMissionDetail: RequestFun<any, any> = (
    data
) => {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/API/V2/Teacher/TeacherHightPhoto/GetStudentMissionDetail",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
};

// 算法识别对错
export const GetCheckResult: RequestFun<string, PointsPackage[]> = (
    data
) => {
    return request({
        baseURL: "https://shot.aixueshi.top",
        url: "/predict",
        headers: {
            "Content-Type": "application/json"
        },
        method: "post",
        data
    });
};

export const BatchCheckUpdate: RequestFun<any, any> = (
    data
) => {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/V2/Teacher/TeacherHightPhoto/BatchCheckUpdate",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
};

export const ChangeResultForPhoto: RequestFun<any, any> = (
    data
) => {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/API/V2/Teacher/TeacherHightPhoto/ChangeResultForPhoto",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
};

export const BatchChangeResult: RequestFun<any, any> = (
    data
) => {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/API/V2/Teacher/TeacherHightPhoto/BatchChangeResult",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
};

export const SaveYuanshiImg: RequestFun<SvImgIn, any> = (
    data
) => {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/API/V2/Teacher/TeacherHightPhoto/SaveYuanshiImg",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
};

// 查询作业是否收集过错题
export const topicConnectionState: RequestFun<Id, any> = (data) => {
    return request({
        baseURL: YUN_API_ONECARD,
        url: "/Api/ErrorTopicCollection/TopicConnectionState",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
};

// 发送错题收集的作业详情
export const sendWrongTopicDetail: RequestFun<ISendWrongTopicRes, any> = (data) => {
    return request({
        baseURL: YUN_API_ONECARD,
        url: "/Api/ErrorTopicCollection/SendWrongTopicDetail",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
};

// 介绍收集
export const overWrongTopicCollection: RequestFun<Id, any> = (data) => {
    return request({
        baseURL: YUN_API_ONECARD,
        url: "/Api/ErrorTopicCollection/OverWrongTopicCollection",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
};
