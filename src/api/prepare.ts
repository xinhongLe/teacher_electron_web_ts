import { RESOURCE_API, systemId } from "@/config";
import { IYunInfo } from "@/types/login";
import { RequestFun } from "@/types/response";
import request from "@/utils/request";
import { get, STORAGE_TYPES } from "@/utils/storage";

/**
 * AddLessonBagInDto，新增备课包入参
 */
 export interface IAddLessonBag {
    /**
     * 学段
     */
    acaSectionId?:   null | string;
    acaSectionName?: null | string;
    /**
     * 书册
     */
    albumId?:   null | string;
    albumName?: null | string;
    /**
     * 章节
     */
    chapterId?:   null | string;
    chapterName?: null | string;
    /**
     * ID
     */
    id?: null | string;
    /**
     * 课时id
     */
    lessonId:    string;
    lessonName?: null | string;
    /**
     * 名称
     */
    name?: null | string;
    /**
     * 出版社
     */
    publisherId?:   null | string;
    publisherName?: null | string;
    /**
     * 资源id
     */
    resourceId?: null | string;
    /**
     * 学校ID
     */
    schoolId?: null | string;
    /**
     * 顺序
     */
    sort?: number;
    /**
     * 学科
     */
    subjectId?:   null | string;
    subjectName?: null | string;
}
/**
 * AddLessonBagOutDto，新增备课包出参
 */
 export interface AddLessonBagOutDto {
    /**
     * ID
     */
    id?: null | string;
    /**
     * 名称
     */
    name?: null | string;
}


// 新增备课包
export const fetchAllBookList: RequestFun<IAddLessonBag,AddLessonBagOutDto> = (data) => {
    const yunInfo: IYunInfo = get(STORAGE_TYPES.YUN_INFO);
    return request({
        baseURL: RESOURCE_API,
        url: "Api/Resouce/TeacherResource/AddBag",
        headers: {
            "Content-Type": "application/json-patch+json",
            OrgId: yunInfo.OrgId,
            UserId: yunInfo.UserId,
            SystemId: systemId,
            SecretKey: yunInfo.SecretKey,
        },
        method: "post",
        data,
    });
};
