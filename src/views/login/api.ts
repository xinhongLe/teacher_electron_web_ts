import request from "@/utils/request";
import { AI_XUE_SHI_API } from "@/config";
import {
    IBasicTagResponse,
    IGradeClassTreeResponse,
    ILessonManagerResponse,
    ILoginData,
    ILoginTokenData,
    ILoginResponse
} from "@/types/login";

export function Login(data: ILoginData): Promise<ILoginResponse> {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/W4/Teach/Login",
        method: "post",
        data
    });
}

export function LessonManager(): Promise<ILessonManagerResponse> {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/W4/Teach/GetInfo/LessonManager",
        method: "post"
    });
}

// 获取老师的班级年级树形
export function GetGradeClassTree(): Promise<IGradeClassTreeResponse> {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/W3/Temporary/GetGradeClassTree",
        method: "post",
        data: {}
    });
}

// 学生标签配置
export function GetBasicTag(): Promise<IBasicTagResponse> {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "Api/V2/Universal/BaseData/GetBasicTag",
        method: "post"
    });
}

// 根据手机号获取token
export function GetUserInfoByToken(data: ILoginTokenData): Promise<ILoginResponse> {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: `https://yunapi.aixueshi.top/api/UserAccount/Account/GetPhone?token=${data.token}&type=1`,
        method: "get",
        data
    });
}
