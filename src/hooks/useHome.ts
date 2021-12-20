import { getPageDetailRes, updatePageRes } from "@/api/home";
import { dealOldData } from "@/utils/dataParse";
import { dealOldDataVideo, dealOldDataWord, dealOldDataTeach } from "@/utils/dataParsePage";
import { IPageValue } from "@/types/home";
import { Slide } from "wincard/src/types/slides";
import { ElMessage } from "element-plus";
import { dealSaveDataWord, dealSaveDataVideo, dealSaveDataTeach, dealSaveDataElement } from "@/utils/savePageDataParse";
import { getWinCardDBData, setWinCardDBData, updateWinCardDBData } from "@/utils/database";
import { pageType } from "@/config";
interface PageData {
    pageID: string
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
    const getPageDetail = async (page: IPageValue, callback: any) => {
        const data: PageData = { pageID: page.ID };
        const type: number = transformType(page.Type);
        if (type < 0) {
            ElMessage({ type: "warning", message: "暂不支持该页面类型" });
            return {};
        }
        const res = getPageDetailRes(data, type, async(res:any) => {
            const pageDetail = await dealPageDetail(page, res);
            callback(pageDetail);
        });
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
                    newSlide = oldSlide.type ? { ...oldSlide, id: page.ID } : await dealOldData(page.ID, oldSlide);
                } else if (page.Type === pageType.listen) {
                    newSlide = dealOldDataWord(page.ID, res.result);
                } else if (page.Type === pageType.follow) {
                    newSlide = dealOldDataVideo(page.ID, res.result);
                } else if (page.Type === pageType.teach) {
                    newSlide = dealOldDataTeach(page.ID, res.result);
                }
                const pageSlide = Object.assign(newSlide, { remark: page.Remark || "" });
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
        if (slide.type === "element") {
            newSlide = dealSaveDataElement(slide);
        } else if (slide.type === "listen") {
            newSlide = dealSaveDataWord(slide);
        } else if (slide.type === "follow") {
            newSlide = dealSaveDataVideo(slide);
        } else if (slide.type === "teach") {
            newSlide = dealSaveDataTeach(slide);
        }
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
        savePage
    };
};
