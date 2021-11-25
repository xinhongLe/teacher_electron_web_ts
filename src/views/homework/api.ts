import request from "@/utils/request";
import { AI_XUE_SHI_API } from "@/config";
import { RequestFun } from "@/types/response";
import {
    FetchClassHomeworkPaperListData,
    FetchHomeworkDateByYearData,
    RebackHomeworkPaperData,
    Homework
} from "@/types/homework";

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
