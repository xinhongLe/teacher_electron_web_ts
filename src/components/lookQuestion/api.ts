import request from "@/utils/request";
import { AI_XUE_SHI_API } from "@/config";
import { RequestFun } from "@/types/response";
import { GetQuestionsByIdsData, Question, GetCourseBagQuestionsByIdsData, CheckPureQuestionByQuestionIDData } from "@/types/lookQuestion";

// 获取系统题库下的课包问题
export const getQuestionsByIds: RequestFun<GetQuestionsByIdsData, Question[]> = (data) => {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "API/W4/StaffTeach/GetQuestionsByIds",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
};

// 获取教师课包下的问题
export const getCourseBagQuestionsByIds: RequestFun<GetCourseBagQuestionsByIdsData, Question[]> = (data) => {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/W4/Teach/GetCourseBagQuestionsByIds",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
};

// 根据问题id检测是否有同类题
export const checkPureQuestionByQuestionID: RequestFun<CheckPureQuestionByQuestionIDData, boolean> = (data) => {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "Api/W4/Question/CheckPureQuestionByQuestionID",
        headers: {
            "Content-Type": "application/json-patch+json",
            noLoading: "true"
        },
        method: "post",
        data
    });
};

// 根据问题id检测是否有同类题
export const fetchPureQuestionByQuestionID: RequestFun<CheckPureQuestionByQuestionIDData, Question[]> = (data) => {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/W4/Question/GetPureQuestionByQuestionID",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
};
