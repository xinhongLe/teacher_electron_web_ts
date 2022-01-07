import { WINDOW_CRAD_API, AI_XUE_SHI_API } from "@/config";
import request from "@/utils/request";
import { IResponse } from "@/types/response";
import { ICardList } from "@/types/intelligence";
export interface IGetWindowCards {
    WindowID: string,
    OriginType: number
}
export interface IGetDiscussion {
    id: string
}
export interface IAddAnnotation {
    cardID: string,
    pageID: string,
    pointX: number,
    pointY: number,
    content: string
}
export interface IEditAnnotation {
    annotationID: string,
    pointX: number,
    pointY: number,
    content: string
}
export interface IGetAnnotation {
    pageID: string
}
type GetWindowCardsResponse = IResponse<ICardList[]>
// 获取窗下的卡、页
export function getWindowCards(data: IGetWindowCards): Promise<GetWindowCardsResponse> {
    return request({
        baseURL: WINDOW_CRAD_API,
        url: "API/W1/Card/GetWindowCards",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
}
// 添加批注
export function AddAnnotation(data: IAddAnnotation): Promise<GetWindowCardsResponse> {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/V2/GroupLesson/AddAnnotation",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
}
// 查询批注
export function GetAnnotation(data: IGetAnnotation): Promise<GetWindowCardsResponse> {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/V2/GroupLesson/GetAnnotation",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
}
// 删除批注
export function DeleteAnnotation(data: IGetAnnotation): Promise<GetWindowCardsResponse> {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/V2/GroupLesson/DeleteAnnotation",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
}
// 修改批注
export function EditAnnotation(data: IEditAnnotation): Promise<GetWindowCardsResponse> {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/V2/GroupLesson/EditAnnotation",
        headers: {
            "Content-Type": "application/json-patch+json",
            noLoading: "true"
        },
        method: "post",
        data
    });
}
// 获取研讨内容下的卡页结构
export function GetDiscussionContentCards(data: IGetDiscussion): Promise<GetWindowCardsResponse> {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/V2/GroupLesson/GetDiscussionContentCards",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
}
// 获取老师批注列表
export function GetAnnotationCreateTeachers(data: IGetAnnotation): Promise<GetWindowCardsResponse> {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/V2/GroupLesson/GetAnnotationCreateTeachers",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
}
// 获取页面数据
export function getPPtPageDetail(data: IGetDiscussion): Promise<GetWindowCardsResponse> {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/V2/GroupLesson/GetPageElements",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
}
