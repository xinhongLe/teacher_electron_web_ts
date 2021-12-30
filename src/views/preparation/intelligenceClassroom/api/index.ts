import request from "@/utils/request";
import { IResponse } from "@/types/response";
import { ICardList, ITreeList } from "@/types/intelligence";
import { AI_XUE_SHI_API, WINDOW_CRAD_API, originType } from "@/config";
type BookListResponse = IResponse<ITreeList[]>

export interface IGetChapters {
    id: string
}
interface LessonWindow {
    IsHide: boolean,
    Type: number
}
export interface IGetLessonWindows {
    chapterID: string
}

type ChaptersResponse = IResponse<ITreeList[]>

export interface IGetWindowCards {
    WindowID: string,
    OriginType: number
}

type GetWindowCardsResponse = IResponse<ICardList[]>
type GetSchoolLessonWindow = IResponse<LessonWindow[]>
interface GetPageData {
    pageID: string,
    originType?: number,
}

type GetPageResponse = IResponse<any>

export interface IDelCardOrPage {
    TeachPageRelationID: string
}

interface IAddPage{
    CardID: string,
    Sort: number,
    Type: number,
    Name: string
}
interface CopyWindow {
    id: string,
    originType: number,
    sourceLessonID: string
}
// 复制窗
export function CopyWindow(data:CopyWindow) {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/WCP/Teacher/CopyWindow",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
}
// 获取书本信息
export function getSubjectPublisherBookList(): Promise<BookListResponse> {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/WCP/Window/GetSubjectPublisherBookList",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data: {}
    });
}

// 获取单元、课时、窗
export function getChapters(data: IGetChapters): Promise<ChaptersResponse> {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/WCP/Window/GetChapterLessonWindow",
        headers: {
            "Content-Type": "application/json-patch+json",
            noLoading: "true"
        },
        method: "post",
        data
    });
}

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

// 获取页面的详情 (新)
export function getPageDetailRes(data:GetPageData, type: number): Promise<GetPageResponse> {
    const urlList: string[] = [
        "/API/WCP/Window/GetPageElements", // 素材页
        "/Api/WCP/Listen/GetPageWords", // 听写页
        "/Api/WCP/Window/GetPageVideo", // 跟读页
        "/Api/WCP/TeachTool/GetPageTool" // 教具页
    ];
    return request({
        baseURL: AI_XUE_SHI_API,
        url: urlList[type],
        headers: { DeviceID: "Franchisee", noLoading: "true" },
        method: "post",
        data
    });
}
// 弹出卡 页列表
export function getCardDetail(data: string[]): Promise<GetPageResponse> {
    return request({
        url: "/Api/WCP/Window/GetPageInfos",
        headers: { DeviceID: "Franchisee" },
        method: "post",
        baseURL: WINDOW_CRAD_API,
        data
    });
}
// 删除卡或页
export function deleteCardOrPage(data:IDelCardOrPage): Promise<GetPageResponse> {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/WCP/Window/DelCardOrPage",
        headers: { DeviceID: "Franchisee" },
        method: "post",
        data
    });
}

// 新增页
export function addPage(data: IAddPage) : Promise<GetPageResponse> {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/WCP/Window/AddPage",
        headers: { DeviceID: "Franchisee" },
        method: "post",
        data
    });
}
// 获取课时与窗
export function getSchoolLessonWindow(data: IGetLessonWindows): Promise<GetSchoolLessonWindow> {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/API/W4/Card/GetSchoolLessonWindow",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
}
