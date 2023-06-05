import request from "@/utils/request";
import {IResponse} from "@/types/response";
import {
    IDollSetRes,
    IGetGameToolList,
    IQuackDollSetRes,
    IWordSet,
    ICarSetRes,
    ITugOfWarSetRes,
    IClassSetRes
} from "@/types/game";
import {originType, WINDOW_CRAD_API} from "@/config";

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
        data: Object.assign(data, {OriginType: originType})
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
        data: Object.assign(data, {OriginType: originType})
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
        data: Object.assign(data, {OriginType: originType})
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
        data: Object.assign(data, {OriginType: originType})
    });
}

// 获取游戏配置
export function getTeacherPageGameConfig(data: { PageID: string }): Promise<IResult> {
    return request({
        url: "/Api/WCP/Game/GetTeacherPageGameConfig",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        baseURL: WINDOW_CRAD_API,
        data: Object.assign(data, {OriginType: originType})
    });
}

// 跑步游戏配置
export function runningGameSet(data: ICarSetRes): Promise<IResult> {
    return request({
        url: "/Api/WCP/Game/UpdateRunningGameOption",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        baseURL: WINDOW_CRAD_API,
        data: Object.assign(data, {OriginType: originType})
    });
}

// 赛车游戏配置
export function carSet(data: ICarSetRes): Promise<IResult> {
    return request({
        url: "/Api/WCP/Game/UpdateSpeedCarGameOption",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        baseURL: WINDOW_CRAD_API,
        data: Object.assign(data, {OriginType: originType})
    });
}

// 拔河游戏配置
export function tugOfWarSet(data: ITugOfWarSetRes): Promise<IResult> {
    return request({
        url: "/Api/WCP/Game/UpdateTugOfWarOption",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        baseURL: WINDOW_CRAD_API,
        data: Object.assign(data, {OriginType: originType})
    });
}

// 超级分类配置
export function classSet(data: IClassSetRes): Promise<IResult> {
    return request({
        url: "/Api/WCP/Game/UpdateSuperClassifyOption",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        baseURL: WINDOW_CRAD_API,
        data: Object.assign(data, {OriginType: originType})
    });
}
