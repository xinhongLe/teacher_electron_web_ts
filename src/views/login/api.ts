import request from "@/utils/request";
import { AI_XUE_SHI_API } from "@/config";
import { ILoginData } from "@/types/login";
import { IResponse } from "@/types/response";

export function Login(data: ILoginData) {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: `/Api/W4/Teach/Login`,
        method: "post",
        data,
    });
}

export function LessonManager() {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: `/Api/W4/Teach/GetInfo/LessonManager`,
        method: "post"
    });
}

//获取老师的班级年级树形
export function GetGradeClassTree() {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: `/Api/W3/Temporary/GetGradeClassTree`,
        method: "post"
    });
}

//学生标签配置
export function GetBasicTag() {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: `Api/V2/Universal/BaseData/GetBasicTag`,
        method: "post"
    });
}
