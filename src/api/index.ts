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
        baseURL: "http://apitest.aixueshi.top:5002",
        url: "/Api/V3/Auxiliary/GetOssToken",
        headers: { DeviceID: "Franchisee", noLoading: "true" },
        method: "post",
        data: {}
    });
}

export function getToolList({ name = "", bookID, bookIDs }: {name: string, bookID?: string, bookIDs?: string[]}): Promise<IResponse<Tools[]>> {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "API/W1/TeachingMiniTool/ToolManage/GetToolList/V211125",
        headers: {
            noLoading: "true"
        },
        method: "post",
        data: {
            State: 2,
            name,
            bookID,
            bookIDs
        }
    });
}
