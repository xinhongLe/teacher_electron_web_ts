import request from "@/utils/request";
import { AI_XUE_SHI_API } from "@/config";
import { RequestFun } from "@/types/response";
import { FileInfo } from "@/types/lookQuestion";

export interface HistoryList {
    CreateTime: string;
    BlackBoardFiles: FileInfo[];
}

export interface BlackboardFile {
    name: "string";
    mD5: "string";
    ossName: "string";
    ossExtention: "string";
    bucketName: "string";
}

interface SubmitBlackboardHistoryData {
    blackboardFiles: BlackboardFile[];
}

export const fetchBlackboardHistoryList: RequestFun<null, HistoryList[]> =
    () => {
        return request({
            baseURL: AI_XUE_SHI_API,
            url: "/API/W4/TeacherBlackboardHistory/GetBlackboardHistoryList",
            headers: {
                noLoading: "true"
            },
            method: "post"
        });
    };

export const deleteBlackboardHistory: RequestFun<{ id: string }, null> = (
    data
) => {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/API/W4/TeacherBlackboardHistory/DeleteBlackboardHistory",
        headers: {
            noLoading: "true"
        },
        method: "post",
        data
    });
};

export const submitBlackboardHistory: RequestFun<SubmitBlackboardHistoryData, null> = (
    data
) => {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/API/W4/TeacherBlackboardHistory/SubmitBlackboardHistory",
        headers: {
            noLoading: "true"
        },
        method: "post",
        data
    });
};
