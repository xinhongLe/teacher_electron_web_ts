import request from "@/utils/request";
import { IResponse } from "@/types/response";
import { ICardList, ITreeList } from "@/types/home";
import { Slide } from "wincard/src/types/slides";
import { WINDOW_CRAD_API, originType } from "@/config/index";
import { getWinCardDBData } from "@/utils/database";
type BookListResponse = IResponse<ITreeList[]>
export interface IGetChapters {
    id: string
}

type ChaptersResponse = IResponse<ITreeList[]>

export interface IGetWindowCards {
    WindowID: string,
    OriginType?: number
}

interface IGetPageData {
    pageID: string,
    id?: string,
    OriginType?: number,
}

interface IGetChaptersVideo {
    bookID: string
}

interface IElementsVideo {
    chapterID: string,
    fileType: number
}
interface Remark {
    pageID: string,
    remark: string
}

type GetWindowCardsResponse = IResponse<ICardList[]>

type GetPageResponse = IResponse<any>

export interface IDelCardOrPage {
    TeachPageRelationID: string
}
export interface IAddCard{
    WindowID: string,
    Sort: number,
    Name: string
}

export interface IAddPage{
    CardID: string,
    Sort: number,
    Type: number,
    Name: string
}
export interface ICopyPage{
    CardID: string,
    OldCardID: string,
    PageID: string,
    Name: string
}

export interface IRenameCardOrPage {
    ID: string,
    Name: string | undefined
}

interface IVideoQuoteInfo {
    FileIDs: string[]
}

interface ICardSort{
    TeachPageRelationID: string,
    Sort: number,
    CardID?: string
}

export interface ICardSortRes{
    Sort: ICardSort[]
}

export interface IMovePage extends ICardSort{
    CardID: string
}

export interface ICardOrPageState{
    ID:string,
    State:number
}

// 获取书本信息
export function getSubjectPublisherBookList(): Promise<BookListResponse> {
    return request({
        url: "/Api/WCP/Window/GetSubjectPublisherBookList",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data: {},
        baseURL: WINDOW_CRAD_API
    });
}

// 获取单元、课时、窗
export function getChapters(data: IGetChapters): Promise<ChaptersResponse> {
    return request({
        url: "/Api/WCP/Window/GetChapterLessonWindow",
        headers: {
            "Content-Type": "application/json-patch+json",
            noLoading: "true"
        },
        method: "post",
        data,
        baseURL: WINDOW_CRAD_API
    });
}

// 选择跟读页视频 书本信息
export function getSubjectPublisherBookListVideo(): Promise<GetPageResponse> {
    return request({
        baseURL: WINDOW_CRAD_API,
        url: "/Api/W4/Book/GetSubjectPublisherBookListStaff",
        method: "post",
        data: {}
    });
}

// 选择跟读页视频 单元
export function getChaptersVideo(data: IGetChaptersVideo): Promise<GetPageResponse> {
    return request({
        baseURL: WINDOW_CRAD_API,
        url: "/API/W4/Card/GetChapters",
        method: "post",
        data: Object.assign(data, { OriginType: originType })
    });
}

// 选择跟读页视频 列表
export function getElementsVideo(data: IElementsVideo): Promise<GetPageResponse> {
    return request({
        url: "/API/W4/Chapter/GetElements",
        method: "post",
        baseURL: WINDOW_CRAD_API,
        data: Object.assign(data, { OriginType: originType })
    });
}
// 获取窗下的卡、页
export function getWindowCards(data: IGetWindowCards): Promise<GetWindowCardsResponse> {
    return request({
        url: "API/W4/Card/GetWindowCards",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        baseURL: WINDOW_CRAD_API,
        data
    });
}

// 获取页面的详情 (新)
export async function getPageDetailRes(data:IGetPageData, type: number, callback: any): Promise<GetPageResponse> {
    const urlList: string[] = [
        "/API/WCP/Window/GetPageElements", // 素材页
        "/Api/WCP/Listen/GetPageWords", // 听写页
        "/Api/WCP/Window/GetPageVideo", // 跟读页
        "/Api/WCP/TeachTool/GetPageTool" // 教具页
    ];
    const dbResArr = await getWinCardDBData(data.pageID);
    return new Promise((resolve) => {
        if (dbResArr.length > 0) {
            callback(JSON.parse(dbResArr[0].result));
        }
        request({
            url: urlList[type],
            baseURL: WINDOW_CRAD_API,
            headers: { DeviceID: "Franchisee", ...{ noLoading: "ok" } },
            method: "post",
            data
        }).then((res: any) => {
            callback(res);
            resolve(res);
        });
    });
}

// 获取ppt页数据
// export function GetPageElements(data: any, type: number, callback: any) : Promise<GetPageResponse> {
//     return new Promise((resolve) => {
//         request({
//             url: "/Api/V2/GroupLesson/GetPageElements",
//             baseURL: WINDOW_CRAD_API,
//             headers: { DeviceID: "Franchisee", ...{ noLoading: "ok" } },
//             method: "post",
//             data
//         }).then((res: any) => {
//             callback(res);
//             resolve(res);
//         });
//     });
// }
// 保存/更新页面
export function updatePageRes(data: Slide, type:number) : Promise<GetPageResponse> {
    const urlList = [
        "/Api/WCP/Window/SavePageElements",
        "/Api/WCP/Listen/PageSaveWord",
        "/Api/WCP/Window/SavePageVideo",
        "/Api/WCP/TeachTool/AddOrUpdate"
    ];
    return request({
        url: urlList[type],
        headers: { DeviceID: "Franchisee" },
        method: "post",
        baseURL: WINDOW_CRAD_API,
        data: Object.assign(data, { OriginType: originType })
    });
}

// 保存 更新备注
export function UpdatePageRemark(data: Remark) : Promise<GetPageResponse> {
    return request({
        url: "/Api/WCP/Window/UpdatePageRemark",
        headers: { DeviceID: "Franchisee" },
        method: "post",
        baseURL: WINDOW_CRAD_API,
        data: Object.assign(data, { OriginType: originType })
    });
}
// 删除卡或页
export function deleteCardOrPage(data:IDelCardOrPage): Promise<GetPageResponse> {
    return request({
        url: "/Api/WCP/Window/DelCardOrPage",
        headers: { DeviceID: "Franchisee" },
        method: "post",
        baseURL: WINDOW_CRAD_API,
        data: Object.assign(data, { OriginType: originType })
    });
}

// 新增卡
export function addCard(data: IAddCard) : Promise<GetPageResponse> {
    return request({
        url: "/Api/WCP/Window/AddCard",
        headers: { DeviceID: "Franchisee" },
        method: "post",
        baseURL: WINDOW_CRAD_API,
        data: Object.assign(data, { OriginType: originType })
    });
}

// 新增页
export function addPage(data: IAddPage) : Promise<GetPageResponse> {
    return request({
        url: "/Api/WCP/Window/AddPage",
        headers: { DeviceID: "Franchisee" },
        method: "post",
        baseURL: WINDOW_CRAD_API,
        data: Object.assign(data, { OriginType: originType })
    });
}

// 复制页
export function copyPage(data: ICopyPage) : Promise<GetPageResponse> {
    return request({
        url: "/Api/WCP/Window/CopyPage",
        headers: { DeviceID: "Franchisee" },
        method: "post",
        baseURL: WINDOW_CRAD_API,
        data: Object.assign(data, { OriginType: originType })
    });
}

// 修改卡页名称
export function renameCardOrPage(data : IRenameCardOrPage) : Promise<GetPageResponse> {
    return request({
        url: "/Api/WCP/Window/EditCardOrPageName",
        headers: { DeviceID: "Franchisee" },
        method: "post",
        baseURL: WINDOW_CRAD_API,
        data: Object.assign(data, { OriginType: originType })
    });
}

// 获取引用视频信息
export function getVideoQuoteInfo(data : IVideoQuoteInfo) : Promise<GetPageResponse> {
    return request({
        url: "Api/WCP/Window/GetVideoQuoteInfo",
        headers: { DeviceID: "Franchisee", noLoading: "true" },
        method: "post",
        baseURL: WINDOW_CRAD_API,
        data: Object.assign(data, { OriginType: originType })
    });
}

// 卡排序
export function updateCardSort(data : ICardSortRes) : Promise<GetPageResponse> {
    return request({
        url: "Api/WCP/Window/UpdateCardSort",
        headers: { DeviceID: "Franchisee" },
        method: "post",
        baseURL: WINDOW_CRAD_API,
        data: Object.assign(data, { OriginType: originType })
    });
}

// 移动页
export function movePage(data : IMovePage) : Promise<GetPageResponse> {
    return request({
        url: "/Api/WCP/Window/MovePage",
        headers: { DeviceID: "Franchisee" },
        method: "post",
        baseURL: WINDOW_CRAD_API,
        data: Object.assign(data, { OriginType: originType })
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

// 页上架/下架
export function setCardOrPageState(data: ICardOrPageState) : Promise<GetPageResponse> {
    return request({
        url: "/Api/WCP/Window/SetCardOrPageState",
        method: "post",
        baseURL: WINDOW_CRAD_API,
        data: Object.assign(data, { OriginType: originType })
    });
}
