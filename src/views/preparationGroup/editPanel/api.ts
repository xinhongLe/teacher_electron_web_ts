import request from "@/utils/request";
import { AI_XUE_SHI_API } from "@/config";
import { IResponse } from "@/types/response";

import {
    FetchTextBookGradeData, TextBookGradeRes
} from "@/types/preparationGroup";

// 获取学科-版本-年级
export function fetchTextBookGrade(data: FetchTextBookGradeData):Promise<IResponse<TextBookGradeRes[]>> {
    return request({
        baseURL: "https://api.aixueshi.top:5014", // AI_XUE_SHI_API,
        url: "/Api/RescourceCenter/Rescource/GetTextBookGrade",
        headers: {
            "Content-Type": "application/json-patch+json",
            noLoading: "true"
        },
        method: "post",
        data
    });
}
