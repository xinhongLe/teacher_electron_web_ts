//埋点请求api
import request from "@/utils/request";
//埋点数据类型接口
import { createBuryingPointData } from "@/types/pointData";
import { VUE_APP_TRACK_LOG } from "@/config";
//埋点请求
export function createBuryingPoint(data: createBuryingPointData) {
    return request({
        baseURL: VUE_APP_TRACK_LOG,
        url: "/Api/Track/CreateByMq",
        headers: {
            "Content-Type": "application/json-patch+json",
            noLoading: "true",
        },
        method: "post",
        data,
    });
}
