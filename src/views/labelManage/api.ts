import request from "@/utils/request";
import { AI_XUE_SHI_API } from "@/config";
import { Student, Tag, TagStudent, TagStudentsData } from "@/types/labelManage";
import { IResponse, RequestFun } from "@/types/response";

// 学生列表
export function fetchAllStudents(teacherId: string): Promise<IResponse<Student[]>> {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/V2/Teacher/Student/GetAllStudents/V210918?teacherId=" + teacherId,
        headers: {
            noLoading: "true"
        },
        method: "get"
    });
}

export const fetchStudentsTagList: RequestFun<{classId: string}, {
    list: TagStudent[]
}> = (data) => {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "Api/Web/Class/GetClassStudents/V220324",
        method: "post",
        data
    });
};

// 打标签
export function tagStudents(data: TagStudentsData): Promise<IResponse<null>> {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/V2/Teacher/Student/TagStudents/V210918",
        method: "post",
        data
    });
}

// 学生标签配置
export function fetchBasicTag(): Promise<IResponse<Tag[]>> {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "Api/V2/Universal/BaseData/GetBasicTag",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post"
    });
}
