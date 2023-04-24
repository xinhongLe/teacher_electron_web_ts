import request from "@/utils/request";
import { IResponse } from "@/types/response";
import { ICardList, ITreeList } from "@/types/home";
import { Slide } from "wincard";
import { WINDOW_CRAD_API, originType, API_CENTER_USER_MANAGE } from "@/config/index";
import { getWinCardDBData, WinCardData } from "@/utils/database";
import { CardProps } from "@/views/preparation/intelligenceClassroom/api/props";

type BookListResponse = IResponse<ITreeList[]>

export interface IGetChapters {
    id: string;
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
    bookID: string;
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


type GetWindowStructResponse = IResponse<{ WindowID: string, CardData: any }>

type GetPageResponse = IResponse<any>

export interface IDelCardOrPage {
    TeachPageRelationID: string;
}

export interface IAddCard {
    WindowID: string,
    Sort: number,
    Name: string
}

export interface IAddPage {
    CardID: string,
    Sort: number,
    Type: number,
    Name: string
}

export interface ICopyPage {
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
    FileIDs: string[];
}

interface ICardSort {
    TeachPageRelationID: string,
    Sort: number,
    CardID?: string
}

export interface ICardSortRes {
    Sort: ICardSort[];
}

export interface IMovePage extends ICardSort {
    CardID: string;
}

export interface ICardOrPageState {
    ID: string,
    State: number
}

interface IGetLessonPlan {
    TeachPageID: string;
    TeacherID: string;
    FranchiseeID: string;
}

interface ILessonPlanProcess {
    ID: string;
    IsSystem: number;
    TeachPageID: string;
    Name: string;
    Value?: string;
    IsShow: number; // 是否在教案中显示
    Type: number; // 1 卡 2 页
    Status: number; // 0 未启用 1 启用
    Sort: number;
    AcademicPresupposition: string;
    DesignIntent: string;
    Childrens: ILessonPlanProcess[];
}

interface ILessonPlanClassType {
    ID: string;
    Name: string;
    Value: string;
    Status: number;
    IsSelect: number; // 0 未选中 1 选中
    Sort: number;
    IsSystem: number;
}

interface ILessonPlanDetail {
    ID: string;
    Name: string;
    Value?: string;
    Sort: number;
    FieldType: number; // 0 自定义字段 1 标题 2 教材字段 3单元字段 4 课时字段 5 课型 6 教学分析 7教学目标 8教学难点 9教学重点 10教学准备 11教学过程 12教学反思 13 课后作业
    SelectType: number; // 0 单行文本 1关联文本 2 多个单行文本 3多行文本 4 下拉框 5 多选框 6单选框 7 单日期 8包含时分日期
    IsSystem: number;
    isSelectId?: string;
    LessonPlanMainID: string;
    LessonPlanDetailPages: ILessonPlanProcess[]; // 教学过程
    LessonPlanDetailOptions: ILessonPlanClassType[];
}

interface IGetLessonPlanResponse {
    IsSystem: number;
    ID: string;
    Name: string;
    TeachPageName: string;
    Sort: number;
    Status: number;
    FranchiseeID: string;
    TeachPageID: string;
    LessonPlanTemplateMainID: string;
    TeacherID: string;
    LessonPlanDetails: ILessonPlanDetail[];
}

interface ISaveLessonPlanProcess {
    ID?: string;
    Name?: string;
    Value?: string;
    IsShow?: number; // 是否在教案中显示
    Type?: number; // 1 卡 2 页
    Status?: number; // 0 未启用 1 启用
    Sort?: number;
    AcademicPresupposition?: string;
    DesignIntent?: string;
    Childrens?: ISaveLessonPlanProcess[];
}

interface ISaveLessonPlanClassType {
    ID?: string;
    Name?: string;
    Value?: string;
    Status?: number;
    IsSelect?: number; // 0 未选中 1 选中
    Sort?: number;
    IsSystem?: number;
}

interface ISaveLessonPlanDetail {
    ID: string;
    Name: string;
    Value: string;
    Sort: number;
    FieldType: number;
    LessonPlanDetailPages: ISaveLessonPlanProcess[];
    LessonPlanDetailOptions: ISaveLessonPlanClassType[];
}

export interface ISaveLessonPlan {
    ID: string;
    Name: string;
    TeachPageName: string;
    Sort: number;
    Status: number;
    LessonPlanDetails: ISaveLessonPlanDetail[];
}

export interface IAddTemplateFieldRes {
    LessonPlanTemplateMainID: string,
    Name: string,
    SelectType: number,
    Options?: { ID: string, Name: string, Sort: number }[]
}

export interface ISaveProcessAndDesignData {
    ID: string;
    AcademicPresupposition: string;
    DesignIntent: string;
}

export interface ILessonCommonData {
    TeacherID: string,
    FranchiseeID: string
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

// 获取窗下的卡、页(树形结构)
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

// 批量获取页详情(获取窗下的卡、页(包含页详情))
export function getWindowStruct(data: IGetWindowCards): Promise<GetWindowStructResponse> {
    return request({
        url: "Api/WCP/Window/GetAllWindowsStructData",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        baseURL: WINDOW_CRAD_API,
        data: Object.assign(data, { OriginType: originType })
    });
}

// 获取页面的详情 (新)
export async function getPageDetailRes(data: IGetPageData, type: number, callback: any, needLocal = true): Promise<GetPageResponse> {
    const urlList: string[] = [
        "/API/WCP/Window/GetPageElements", // 素材页
        "/Api/WCP/Listen/GetPageWords", // 听写页
        "/Api/WCP/Window/GetPageVideo", // 跟读页
        "/Api/WCP/TeachTool/GetPageTool", // 教具页
        "/Api/WCP/Game/GetTeacherPageGameConfig" // 游戏页
    ];
    let dbResArr: Array<WinCardData> = [];
    if (needLocal) {
        dbResArr = await getWinCardDBData(data.pageID);
    }
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
export function updatePageRes(data: Slide, type: number): Promise<GetPageResponse> {
    const urlList = [
        "/Api/WCP/Window/SavePageElements",
        "/Api/WCP/Listen/PageSaveWord",
        "/Api/WCP/Window/SavePageVideo",
        "/Api/WCP/TeachTool/AddOrUpdate",
        "/Api/WCP/Game/UpdateTeacherPageGame"
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
export function UpdatePageRemark(data: Remark): Promise<GetPageResponse> {
    return request({
        url: "/Api/WCP/Window/UpdatePageRemark",
        headers: { DeviceID: "Franchisee" },
        method: "post",
        baseURL: WINDOW_CRAD_API,
        data: Object.assign(data, { OriginType: originType })
    });
}

// 删除卡或页
export function deleteCardOrPage(data: IDelCardOrPage): Promise<GetPageResponse> {
    return request({
        url: "/Api/WCP/Window/DelCardOrPage",
        headers: { DeviceID: "Franchisee" },
        method: "post",
        baseURL: WINDOW_CRAD_API,
        data: Object.assign(data, { OriginType: originType })
    });
}

// 新增卡
export function addCard(data: IAddCard): Promise<GetPageResponse> {
    return request({
        url: "/Api/WCP/Window/AddCard",
        headers: { DeviceID: "Franchisee" },
        method: "post",
        baseURL: WINDOW_CRAD_API,
        data: Object.assign(data, { OriginType: originType })
    });
}

// 新增页
export function addPage(data: IAddPage): Promise<GetPageResponse> {
    return request({
        url: "/Api/WCP/Window/AddPage",
        headers: { DeviceID: "Franchisee" },
        method: "post",
        baseURL: WINDOW_CRAD_API,
        data: Object.assign(data, { OriginType: originType })
    });
}

// 复制页
export function copyPage(data: ICopyPage): Promise<GetPageResponse> {
    return request({
        url: "/Api/WCP/Window/CopyPage",
        headers: { DeviceID: "Franchisee" },
        method: "post",
        baseURL: WINDOW_CRAD_API,
        data: Object.assign(data, { OriginType: originType })
    });
}

// 修改卡页名称
export function renameCardOrPage(data: IRenameCardOrPage): Promise<GetPageResponse> {
    return request({
        url: "/Api/WCP/Window/EditCardOrPageName",
        headers: { DeviceID: "Franchisee" },
        method: "post",
        baseURL: WINDOW_CRAD_API,
        data: Object.assign(data, { OriginType: originType })
    });
}

// 获取引用视频信息
export function getVideoQuoteInfo(data: IVideoQuoteInfo): Promise<GetPageResponse> {
    return request({
        url: "Api/WCP/Window/GetVideoQuoteInfo",
        headers: { DeviceID: "Franchisee", noLoading: "true" },
        method: "post",
        baseURL: WINDOW_CRAD_API,
        data: Object.assign(data, { OriginType: originType })
    });
}

// 卡排序
export function updateCardSort(data: ICardSortRes): Promise<GetPageResponse> {
    return request({
        url: "Api/WCP/Window/UpdateCardSort",
        headers: { DeviceID: "Franchisee" },
        method: "post",
        baseURL: WINDOW_CRAD_API,
        data: Object.assign(data, { OriginType: originType })
    });
}

// 移动页
export function movePage(data: IMovePage): Promise<GetPageResponse> {
    return request({
        url: "/Api/WCP/Window/MovePage",
        headers: { DeviceID: "Franchisee" },
        method: "post",
        baseURL: WINDOW_CRAD_API,
        data: Object.assign(data, { OriginType: originType })
    });
}

// 弹出卡 页列表
export function getCardDetail(data: { pageIDs: string[] }, noLoading = false): Promise<GetPageResponse> {
    return request({
        url: "/Api/WCP/Window/GetPageInfos",
        headers: { DeviceID: "Franchisee", ...{ noLoading: (noLoading ? "true" : "") } },
        method: "post",
        baseURL: WINDOW_CRAD_API,
        data
    });
}

// 页上架/下架
export function setCardOrPageState(data: ICardOrPageState): Promise<GetPageResponse> {
    return request({
        url: "/Api/WCP/Window/SetCardOrPageState",
        method: "post",
        baseURL: WINDOW_CRAD_API,
        data: Object.assign(data, { OriginType: originType })
    });
}

// 获取教案数据
export function getLessonPlan(data: IGetLessonPlan): Promise<GetPageResponse> {
    return request({
        url: "/Api/WCP/LessonPlan/GetLessonPlanMain",
        headers: { DeviceID: "Franchisee" },
        method: "post",
        baseURL: WINDOW_CRAD_API,
        data: Object.assign({ OriginType: originType }, data) // 不能调换Object.assign合并的顺序
    });
}

// 保存教案数据
export function saveLessonPlan(data: ISaveLessonPlan): Promise<IResponse<unknown>> {
    return request({
        url: "/Api/WCP/LessonPlan/SaveLessonPlanMain",
        headers: { DeviceID: "Franchisee" },
        method: "post",
        baseURL: WINDOW_CRAD_API,
        data: Object.assign(data, { OriginType: originType })
    });
}

// 获取模板列表
export function getLessonPlanTemplate(data: { FranchiseeID: string }): Promise<GetPageResponse> {
    return request({
        url: "/Api/WCP/LessonPlan/GetLessonPlanTemplate",
        headers: { DeviceID: "Franchisee" },
        method: "post",
        baseURL: WINDOW_CRAD_API,
        data: Object.assign(data, { OriginType: originType })
    });
}

// 新增模板
export function addLessonPlanTemplate(data: ILessonCommonData): Promise<GetPageResponse> {
    return request({
        url: "/Api/WCP/LessonPlan/AddLessonPlanTemplate",
        headers: { DeviceID: "Franchisee" },
        method: "post",
        baseURL: WINDOW_CRAD_API,
        data: Object.assign(data, { OriginType: originType })
    });
}

// 更新模板
export function updateLessonPlanTemplate(data: any): Promise<GetPageResponse> {
    return request({
        url: "/Api/WCP/LessonPlan/UpdateLessonPlanTemplate",
        headers: { DeviceID: "Franchisee" },
        method: "post",
        baseURL: WINDOW_CRAD_API,
        data: Object.assign(data, { OriginType: originType })
    });
}

// 删除模板
export function delLessonPlanTemplate(data: { ID: string, TeacherID: string }): Promise<GetPageResponse> {
    return request({
        url: "/Api/WCP/LessonPlan/DeleteLessonPlanTemplate",
        headers: { DeviceID: "Franchisee" },
        method: "post",
        baseURL: WINDOW_CRAD_API,
        data: Object.assign(data, { OriginType: originType })
    });
}

// 切换模板
export function changeLessonPlanTemplate(data: { LessonPlanTemplateMainID: string, TeachPageID: string, TeacherID: string, FranchiseeID: string }): Promise<GetPageResponse> {
    return request({
        url: "/Api/WCP/LessonPlan/ChangeTeachPageTemplate",
        headers: { DeviceID: "Franchisee" },
        method: "post",
        baseURL: WINDOW_CRAD_API,
        data: Object.assign(data, { OriginType: originType })
    });
}

// 获取模板自定义字段列表
export function getLessonPlanTemplateDetail(data: { LessonPlanTemplateID: string }): Promise<GetPageResponse> {
    return request({
        url: "/Api/WCP/LessonPlan/GetLessonPlanTemplateDetail",
        headers: { DeviceID: "Franchisee" },
        method: "post",
        baseURL: WINDOW_CRAD_API,
        data: Object.assign(data, { OriginType: originType })
    });
}

// 新增字段
export function addTemplateField(data: IAddTemplateFieldRes): Promise<IResponse<GetPageResponse>> {
    return request({
        url: "/Api/WCP/LessonPlan/AddLessonPlanTemplateField",
        headers: { DeviceID: "Franchisee" },
        method: "post",
        baseURL: WINDOW_CRAD_API,
        data: Object.assign(data, { OriginType: originType })
    });
}

// 编辑字段
export function editTemplateField(data: any): Promise<IResponse<unknown>> {
    return request({
        url: "/Api/WCP/LessonPlan/UpdateLessonPlanTemplateField",
        headers: { DeviceID: "Franchisee" },
        method: "post",
        baseURL: WINDOW_CRAD_API,
        data: Object.assign(data, { OriginType: originType })
    });
}

// 删除字段
export function delTemplateField(data: { ID: string }): Promise<IResponse<unknown>> {
    return request({
        url: "/Api/WCP/LessonPlan/DeleteLessonPlanTemplateField",
        headers: { DeviceID: "Franchisee" },
        method: "post",
        baseURL: WINDOW_CRAD_API,
        data: Object.assign(data, { OriginType: originType })
    });
}

// 保存教学过程设计意图
export function saveLessonProcessAndDesign(data: ISaveProcessAndDesignData): Promise<IResponse<unknown>> {
    return request({
        baseURL: WINDOW_CRAD_API,
        url: "/Api/WCP/LessonPlan/SaveTeachPageDesignIntent",
        method: "post",
        data
    });
}

interface IOrgId {
    id: string;
}

interface IPlatformResponse {
    id: string;
    orgId: string;
    platformId: string;
}

// 根据组织id批量查询
export function getPlatformByOrgId(data: IOrgId[]): Promise<IResponse<IPlatformResponse[]>> {
    return request({
        baseURL: API_CENTER_USER_MANAGE,
        headers: {
            noLoading: "true"
        },
        url: "/platform-org-relation/getByOrgIds",
        method: "post",
        data
    });
}
