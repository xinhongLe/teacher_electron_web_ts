import request from "@/utils/request";
import { AI_XUE_SHI_API } from "@/config";
import { RequestFun } from "@/types/response";

interface GetFileAndPauseByFileData {
    fileID: string;
}

interface VideoFile {
    Bucket: string;
    Duration: string;
    Extention: string;
    FileMD5: string;
    FileName: string;
    FilePath: string;
    FileType: number;
    ID: string;
    LongDuration: number;
    Name: string;
    OssPath: string;
    SN: number;
    Type: number;
}

export interface FilePause {
    Event: string;
    FileID: string;
    ID: string;
    Time: string;
    Type: number;
}

interface GetFileAndPauseByFileRes {
    VideoFile: VideoFile;
    FilePauses: FilePause[];
}

// 获取教师课包下的视频
export const getFileAndPauseByFile: RequestFun<
    GetFileAndPauseByFileData,
    GetFileAndPauseByFileRes
> = (data) => {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/API/W1/File/GetFileAndPauseByFileID20210423",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
};
