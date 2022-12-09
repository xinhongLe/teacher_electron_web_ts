import request from "@/utils/request";
import { IResponse } from "@/types/response";
import {
    ISaveMaterial,
    ISaveTemplate,
    IClassRoom,
    IGetList,
    IGetMyList,
    IAddTem,
    IDelTem,
    IUpdateStatus,
    IUpdateSort,
    IRecordSort,
    IMaterialParams,
    ICategory,
    IAdviceCol,
    IDAssembly,
    IGAssembly,
} from "@/types/material";
import { MATERIAL_API, AI_XUE_SHI_API } from "@/config";
import { store } from "@/store";
import { computed } from "vue";
const OriginType = computed(
    () => store.state.preparation.editWindowInfo.originType
);
type IResult = IResponse<any>;

// 保存组件
export function saveSourceMaterial(data: ISaveMaterial): Promise<IResult> {
    return request({
        baseURL: MATERIAL_API,
        url: "/Api/SourceMaterial/SourceMaterial/SaveSourceMaterial",
        headers: {
            "Content-Type": "application/json-patch+json",
        },
        method: "post",
        data,
    });
}
//保存模板
export function saveTemplate(data: ISaveTemplate): Promise<IResult> {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/WCP/TeachPageTemplate/SaveWindowsTemplate",
        headers: {
            "Content-Type": "application/json-patch+json",
        },
        method: "post",
        data: Object.assign(data, { OriginType: OriginType.value }),
    });
}
//根据科目获取课堂环节
export function getClassroomLinkList(data: IClassRoom): Promise<IResult> {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/WCP/TeachPageTemplate/GetClassroomLinkList",
        headers: {
            "Content-Type": "application/json-patch+json",
        },
        method: "post",
        data,
    });
}
//获取模板列表
export function getWindowsTemplateList(data: IGetList): Promise<IResult> {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/WCP/TeachPageTemplate/GetWindowsTemplateList",
        headers: {
            "Content-Type": "application/json-patch+json",
            noLoading: "true",
        },
        method: "post",
        data,
    });
}
//获取我的窗卡页模板
export function getMyWindowsTemplateList(data: IGetMyList): Promise<IResult> {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/WCP/TeachPageTemplate/GetMyWindowsTemplateList",
        headers: {
            "Content-Type": "application/json-patch+json",
        },
        method: "post",
        data,
    });
}
//删除我的窗卡页模板
export function deleteWindowsTemplateList(data: IDelTem): Promise<IResult> {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/WCP/TeachPageTemplate/DeleteWindowsTemplateList",
        headers: {
            "Content-Type": "application/json-patch+json",
        },
        method: "post",
        data,
    });
}
//增加模板引用次数
export function addTeachPageTemplateLinkCount(data: IAddTem): Promise<IResult> {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/WCP/TeachPageTemplate/AddTeachPageTemplateLinkCount",
        headers: {
            "Content-Type": "application/json-patch+json",
            noLoading: "true",
        },
        method: "post",
        data,
    });
}

//修改模板状态-上下架
export function updateWindowsTemplateStatus(
    data: IUpdateStatus
): Promise<IResult> {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/WCP/TeachPageTemplate/UpdateWindowsTemplateStatus",
        headers: {
            "Content-Type": "application/json-patch+json",
            noLoading: "true",
        },
        method: "post",
        data,
    });
}

//模板置于最前
export function updateWindowsTemplateSort(data: IUpdateSort): Promise<IResult> {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/WCP/TeachPageTemplate/UpdateWindowsTemplateSort",
        headers: {
            "Content-Type": "application/json-patch+json",
        },
        method: "post",
        data,
    });
}
//模板-课堂环节排序
export function reorderWindowsTemplate(data: IRecordSort): Promise<IResult> {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/WCP/TeachPageTemplate/ReorderWindowsTemplate",
        headers: {
            "Content-Type": "application/json-patch+json",
            noLoading: "true",
        },
        method: "post",
        data,
    });
}

// 下面是素材库的接口-查素材的
/**
 * 素材列表
 * @param data 要传的参数值
 * @returns 返回接口数据
 */
export function GetSourceMaterials(data: IMaterialParams) {
    return request({
        baseURL: MATERIAL_API,
        url: "/Api/SourceMaterial/SourceMaterial/GetSourceMaterials",
        headers: {
            "Content-Type": "application/json-patch+json",
            noLoading: "true",
        },
        method: "post",
        data,
    });
}
/**
 * 根据素材类型获取一级分类标签
 *  @param data 要传的参数值
 */
export function GetCategoryByMaterialType(data: ICategory) {
    return request({
        baseURL: MATERIAL_API,
        url: "/Api/LableMain/GetCategoryByMaterialType",
        method: "post",
        data,
    });
}
/**
 * 获取某合集的其他推荐合集
 *  @param data 要传的参数值
 */
export function GetAdviceCollection(data: IAdviceCol) {
    return request({
        baseURL: MATERIAL_API,
        url: "/Api/SourceMaterial/SourceMaterial/GetAdviceCollection",
        method: "post",
        data,
    });
}

//删除组件
export function DeleteSourceAssembly(data: IDAssembly) {
    return request({
        baseURL: MATERIAL_API,
        url: "/Api/SourceMaterial/SourceMaterial/DeleteSourceAssembly",
        method: "post",
        data,
    });
}
//获取组件
export function GetSourceAssemblyList(data: IGAssembly) {
    return request({
        baseURL: MATERIAL_API,
        url: "/Api/SourceMaterial/SourceMaterial/GetSourceAssemblyList",
        method: "post",
        data,
    });
}
