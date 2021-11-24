import request from "@/utils/request";
import { AI_XUE_SHI_API } from "@/config";
import {
    AssignDefaultHomeworkData,
    AssignPaperHomeworkData,
    FetchCourseBagTeachingLogsByIDData,
    FetchTeacherClassesData,
    FetchTeacherHistoryClassesData,
    FetchTeacherHistoryClassesRes,
    FinishClassData,
    TeacherClasses
} from "@/types/attendClass";
import { IResponse, RequestFun } from "@/types/response";

// 获取当前周的待上课列表
export function fetchTeacherClasses(data: FetchTeacherClassesData): Promise<IResponse<TeacherClasses>> {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/W4/Teach/GetTeacherClasses",
        method: "post",
        data
    });
}

// 下课
export function finishClass(data: FinishClassData): Promise<IResponse<null>> {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/W4/Teach/FinishClass",
        method: "post",
        data
    });
}

// 布置单个课中作业
export function assignPaperHomework(data: AssignPaperHomeworkData): Promise<IResponse<null>> {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/W4/Teach/AssignPaperHomework",
        method: "post",
        data
    });
}

// 布置课前/课后作业
export function assignDefaultHomework(data: AssignDefaultHomeworkData): Promise<IResponse<null>> {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/W4/Teach/AssignDefaultHomework",
        method: "post",
        data
    });
}

export const fetchCourseBagTeachingLogsByID: RequestFun<FetchCourseBagTeachingLogsByIDData, TeacherClasses> = (data) => {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/W4/Teach/GetCourseBagTeachingLogsByID",
        method: "post",
        data
    });
};

// 历史课程
export const fetchTeacherHistoryClasses: RequestFun<FetchTeacherHistoryClassesData, FetchTeacherHistoryClassesRes> = (data) => {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/W4/Teach/GetTeacherHistoryClasses",
        method: "post",
        data
    });
};
