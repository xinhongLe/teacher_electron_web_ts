import { AI_XUE_SHI_API } from "@/config";
import { IResponse } from "@/types/response";
import request from "@/utils/request";
import { ISubmitFeedBackData } from "./interface";

export function submitFeedback(data: ISubmitFeedBackData): Promise<IResponse<null>> {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/api/w4/Feedback/SubmitFeedback",
        method: "post",
        data
    });
}
