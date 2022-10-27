import request from "@/utils/request";
import { IResponse } from "@/types/response";
import { IDollSetRes, IGetGameToolList, IQuackDollSetRes, IWordSet } from "@/types/game";
import { originType, WINDOW_CRAD_API } from "@/config";

type IResult = IResponse<any>

// 查询游戏教具
export function getGameToolList(data: IGetGameToolList): Promise<IResult> {
    return request({
        url: "/Api/WCP/Game/GetGameToolList",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        baseURL: WINDOW_CRAD_API,
        data: Object.assign(data, { OriginType: originType })
    });
}

// 更改娃娃机配置
export function dollSet(data: IDollSetRes): Promise<IResult> {
    return request({
        url: "/Api/WCP/Game/UpdateTeacherPageGameDollMachineConfig",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        baseURL: WINDOW_CRAD_API,
        data: Object.assign(data, { OriginType: originType })
    });
}

// 娃娃机智能识别
export function quackDollSet(data: IQuackDollSetRes): Promise<IResult> {
    return request({
        url: "/Api/WCP/Game/QuackDollMachineConfig",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        baseURL: WINDOW_CRAD_API,
        data: Object.assign(data, { OriginType: originType })
    });
}

// 单词记忆配置
export function wordSet(data: IWordSet): Promise<IResult> {
    return request({
        url: "/Api/WCP/Game/UpdateTeacherPageGameWordMemoryConfig",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        baseURL: WINDOW_CRAD_API,
        data: Object.assign(data, { OriginType: originType })
    });
}

// 获取游戏配置
export function getTeacherPageGameConfig(data: {PageID: string}): Promise<IResult> {
    return request({
        url: "/Api/WCP/Game/GetTeacherPageGameConfig",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        baseURL: WINDOW_CRAD_API,
        data: Object.assign(data, { OriginType: originType })
    });
}
