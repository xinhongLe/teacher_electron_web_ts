import { WINDOW_CRAD_API, AI_XUE_SHI_API } from "@/config";
import request from "@/utils/request";
import { IResponse } from "@/types/response";
import { ICardList } from "@/types/intelligence";
export interface IGetWindowCards {
    WindowID: string,
    OriginType: number
}
export interface IAddAnnotation {
    cardID: string,
    pageID: string,
    pointX: number,
    pointY: number,
    content: string
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
// 添加
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
