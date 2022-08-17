//埋点请求api
import request from "@/utils/request";
//埋点数据类型接口
import {
    createBuryingPointData
} from "@/types/pointData";
import {TRACK_API } from "@/config";
//埋点请求
export function createBuryingPoint(
    data: createBuryingPointData
) {
    return request({
        baseURL: TRACK_API,
        url: "/Api/Track/createBuryingPoint",
        headers: {
            "Content-Type": "application/json-patch+json",
            noLoading: "true"
        },
        method: "post",
        data
    });
}