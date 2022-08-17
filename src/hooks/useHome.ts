import { getPageDetailRes, updatePageRes, UpdatePageRemark, getVideoQuoteInfo, saveLessonProcessAndDesign, ISaveProcessAndDesignData } from "@/api/home";
import { dealOldData } from "@/utils/dataParse";
import { dealOldDataVideo, dealOldDataWord, dealOldDataTeach } from "@/utils/dataParsePage";
import { IPageValue } from "@/types/home";
import { Slide } from "wincard/src/types/slides";
import { ElMessage } from "element-plus";
import { dealSaveDataWord, dealSaveDataVideo, dealSaveDataTeach, dealSaveDataElement } from "@/utils/savePageDataParse";
import { getWinCardDBData, setWinCardDBData, updateWinCardDBData } from "@/utils/database";
import { originType, pageType } from "@/config";
import { cacheSildeFiles } from "@/utils/file";
interface PageData {
    pageID: string,
    OriginType: any
}

export default () => {
    const transformType = (type: number | string) => {
        switch (type) {
        case 11:
        case "element":
            return 0;
        case 12:
        case "listen":
            return 1;
        case 13:
        case "follow":
            return 2;
        case 16:
        case "teach":
            return 3;
        default:
            return -1;
        }
    };
    const getPageDetail = async (page: IPageValue, originType: any, callback: any) => {
        const data: PageData = { pageID: page.ID, OriginType: originType };
        const type: number = transformType(page.Type);
        if (type < 0) {
            ElMessage({ type: "warning", message: "暂不支持该页面类型" });
            const res = {}; // 不支持页面返回空对象
            return callback(res);
        }
        await getPageDetailRes(data, type, async(res:any) => {
            const pageDetail = await dealPageDetail(page, res);
            callback(pageDetail);
        });
    };
    const dealPauseVideo = async (slide: Slide) => {
        for (const element of slide.elements) {
            if (element.type === "video" && element.fileID) {
                const res = await getVideoQuoteInfo({ FileIDs: [element.fileID] });
                if (res.resultCode === 200 && res.result.length > 0) {
                    element.src = res.result[0].File.FilePath + "/" + res.result[0].File.FileName + "." + res.result[0].File.Extention;
                    element.pauseList = res.result[0].Pauses;
                }
            }
        }
        return slide;
    };
    const dealPageDetail = async (page: IPageValue, res: any) => {
        // 后台返回
        if (res.resultCode) {
            // 后台请求成功回调
            if (res.resultCode === 200) {
                let newSlide:any = {};
                if (page.Type === pageType.element) {
                    const slideString = res.result.Json || "{}";
                    const oldSlide = JSON.parse(slideString);
                    // 素材页如果是新数据直接赋值(更新id是为了避免复制卡过后id不统一问题)，旧数据dealOldData处理
                    newSlide = oldSlide.type ? { ...await dealPauseVideo(oldSlide as Slide), id: page.ID } : await dealOldData(page.ID, page.originType, oldSlide);
                    cacheSildeFiles(newSlide);
                } else if (page.Type === pageType.listen) {
                    newSlide = dealOldDataWord(page.ID, res.result);
                } else if (page.Type === pageType.follow) {
                    newSlide = dealOldDataVideo(page.ID, res.result);
                } else if (page.Type === pageType.teach) {
                    newSlide = dealOldDataTeach(page.ID, res.result);
                }
                const pageSlide = Object.assign(newSlide, { remark: page.AcademicPresupposition || "", design: page.DesignIntent || "" });
                saveDBdata(pageSlide);
                return pageSlide;
            } else {
                return res;
            }
        } else { // 本地数据库取出 直接返回
            return {
                from: "DB", // 标识本地返回
                result: res
            };
        }
    };
    // 处理好的数据直接保存在本地数据库
    const saveDBdata = async (pageSlide: any) => {
        const dbResArr = await getWinCardDBData(pageSlide.id);
        if (dbResArr.length === 0) {
            setWinCardDBData(pageSlide.id, pageSlide);
        } else {
            const apiResStr = JSON.stringify(pageSlide);
            if (dbResArr[0].result !== apiResStr) {
                updateWinCardDBData(pageSlide.id, pageSlide);
            }
        }
    };

    const savePage = async (slide: Slide) => {
        const type: number = transformType(slide.type);
        let newSlide:any = {};
        let updateRemark:any = {};
        let updateProcessAndDesign: ISaveProcessAndDesignData = {
            ID: "",
            DesignIntent: "",
            AcademicPresupposition: ""
        };
        if (slide.type === "element") {
            newSlide = dealSaveDataElement(slide);
            updateRemark = { pageID: newSlide.PageID, AcademicPresupposition: JSON.parse(newSlide.Json).remark || "", DesignIntent: JSON.parse(newSlide.Json).design || "" };
        } else if (slide.type === "listen") {
            newSlide = dealSaveDataWord(slide);
            updateRemark = { pageID: newSlide.PageID, AcademicPresupposition: slide.remark || "", DesignIntent: slide.design || "" };
        } else if (slide.type === "follow") {
            newSlide = dealSaveDataVideo(slide);
            updateRemark = { pageID: newSlide.PageID, AcademicPresupposition: slide.remark || "", DesignIntent: slide.design || "" };
        } else if (slide.type === "teach") {
            newSlide = dealSaveDataTeach(slide);
            updateRemark = { pageID: newSlide.teacherPageID, AcademicPresupposition: slide.remark || "", DesignIntent: slide.design || "" };
        }
        // 更新，修改建议
        // await UpdatePageRemark(updateRemark);
        await saveLessonProcessAndDesign(updateProcessAndDesign);
        const res = await updatePageRes(newSlide, type);
        if (res.resultCode === 200) {
            ElMessage({ type: "success", message: "保存成功" });
            saveDBdata(slide);
            return slide;
        }
    };

    return {
        getPageDetail,
        dealPageDetail,
        savePage,
        transformType
    };
};
