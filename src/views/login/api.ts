import request from "@/utils/request";
import { AI_XUE_SHI_API, systemId, YUN_API } from "@/config";
import {
    IBasicTagResponse,
    IGradeClassTreeResponse,
    ILessonManagerResponse,
    ILoginData,
    ILoginTokenData,
    ILoginResponse,
    ISendMsgData,
    IYunInfo
} from "@/types/login";
import { IResponse, RequestFun } from "@/types/response";

export function Login(data: ILoginData, isPassWordLogin = true): Promise<ILoginResponse> {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: isPassWordLogin ? "/Api/W4/Teach/Login" : "/Api/W4/Teach/LoginWithVerify",
        method: "post",
        data
    });
}

// for cloud data
export function LoginForCloud(token: string): Promise<IResponse<IYunInfo>> {
    return request({
        baseURL: YUN_API,
        url: "/Api/Web/login/UserLoginByToken",
        method: "post",
        data: {
            SystemId: systemId,
            tokenValue: token
        }
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
        url: `api/UserAccount/Account/GetPhone?token=${data.token}&type=1`,
        method: "get",
        data
    });
}

export const sendMsg: RequestFun<ISendMsgData, null> = (data) => {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/W4/Teach/SendMsg",
        method: "post",
        data
    });
};
