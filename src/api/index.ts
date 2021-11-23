import request from "@/utils/request";
import { AI_XUE_SHI_API } from "@/config";
import { IOssPathsRes, IOssTokenRes } from "@/types/oss";
import { Tools } from "@/types/tools";
import { IResponse } from "@/types/response";

export * from "./teach";

export function getOssPaths(): Promise<IOssPathsRes> {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/V2/Universal/BaseData/GetOssPathes",
        headers: { DeviceID: "Franchisee", noLoading: "true" },
        method: "post",
        data: {}
    });
}

export function getOssToken(): Promise<IOssTokenRes> {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/V3/Auxiliary/GetOssToken",
        headers: { DeviceID: "Franchisee", noLoading: "true" },
        method: "post",
        data: {}
    });
}

export function getToolList(): Promise<IResponse<Tools[]>> {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "API/W1/TeachingMiniTool/ToolManage/GetToolList",
        method: "post",
        data: {
            State: 2
        }
    });
}
