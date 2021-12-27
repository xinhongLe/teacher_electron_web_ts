import { AI_XUE_SHI_API } from "@/config";
import request from "@/utils/request";
import { IResponse } from "@/types/response";
import { ICardList } from "@/types/intelligence";
export interface IGetWindowCards {
    WindowID: string,
    OriginType: number
}
type GetWindowCardsResponse = IResponse<ICardList[]>
// 获取窗下的卡、页
export function getWindowCards(data: IGetWindowCards): Promise<GetWindowCardsResponse> {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "API/W1/Card/GetWindowCards",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
}
