import { getPageDetailRes, updatePageRes } from "@/api/home";
import { computed } from "vue";
import { dealOldData } from "@/utils/dataParse";
import { dealOldDataVideo, dealOldDataWord, dealOldDataTeach } from "@/utils/dataParsePage";
import { IPageValue } from "@/types/home";
import { Slide } from "wincard/src/types/slides";
import { ElMessage } from "element-plus";
import { dealSaveDataWord, dealSaveDataVideo, dealSaveDataTeach, dealSaveDataElement } from "@/utils/savePageDataParse";
import { pageType } from "@/config/index";
interface PageData {
    originType?: number,
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
    const getPageDetail = async (page: IPageValue, originType:number) => {
        const data: PageData = {
            originType: originType,
            pageID: page.ID
        };
        const type: number = transformType(page.Type);
        let newSlide:any = {};
        if (type < 0) {
            ElMessage({ type: "warning", message: "暂不支持该页面类型" });
            return newSlide;
        }
        const res = await getPageDetailRes(data, type);
        if (res.resultCode === 200) {
            if (page.Type === pageType.element) {
                const slideString = res.result.Json || "{}";
                const oldSlide = JSON.parse(slideString);
                // 素材页如果是新数据直接赋值，旧数据dealOldData处理
                newSlide = oldSlide.type ? oldSlide : await dealOldData(page.ID, oldSlide);
            } else if (page.Type === pageType.listen) {
                newSlide = dealOldDataWord(page.ID, res.result);
            } else if (page.Type === pageType.follow) {
                newSlide = dealOldDataVideo(page.ID, res.result);
            } else if (page.Type === pageType.teach) {
                newSlide = dealOldDataTeach(page.ID, res.result);
            }

            return Object.assign(newSlide, { remark: page.Remark || "" });
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
        console.log(newSlide);
        const res = await updatePageRes(newSlide, type);
        if (res.resultCode === 200) {
            ElMessage({ type: "success", message: "保存成功" });
        }
    };

    return {
        getPageDetail,
        savePage
    };
};
