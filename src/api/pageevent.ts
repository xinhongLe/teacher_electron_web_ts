import request from "@/utils/request";
import { createBuryingPointData } from "@/types/pointData";
import { VUE_APP_TRACK_LOG } from "@/config";

// 埋点请求
export function createBuryingPoint(data: createBuryingPointData) {
    return request({
        baseURL: VUE_APP_TRACK_LOG,
        url: "/Api/Track/CreateByMq",
        headers: {
            "Content-Type": "application/json-patch+json",
            noLoading: "true"
        },
        method: "post",
        data
    });
}
