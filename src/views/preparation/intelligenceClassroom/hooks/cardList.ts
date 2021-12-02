import { ElMessage } from "element-plus";
import { getPageDetailRes } from "../api/index";
export default () => {
    interface getPage {
        id:string,
        type:number,
    }
    interface CardListItem {
        ID: string,
        Name: string,
        NickName: string,
        OriginType :number,
        TeachPageRelationID: string,
        Width: number,
        Type: number,
        Sort: number,
        Height: number,
        Remark?: string
    }
    interface CardList {
        ID: string,
        Name: string,
        NickName: string,
        Sort: number,
        TeachPageRelationID: string,
        Type: number,
        PageList: CardListItem[]
    }
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
    const getPageDate = async (data:getPage) => {
        const obj = {
            originType: 1,
            pageID: data.id,
            type: data.type
        };
        const newSlide:any = {};
        const type: number = transformType(data.type);
        if (type < 0) {
            ElMessage({ type: "warning", message: "暂不支持该页面类型" });
            return newSlide;
        }
        const res = await getPageDetailRes(obj, type);
        if (res.resultCode === 200) {
            console.log(res);
            // if (page.Type === pageType.value.element) {
            //     const slideString = res.result.Json || "{}";
            //     const oldSlide = JSON.parse(slideString);
            //     // 素材页如果是新数据直接赋值，旧数据dealOldData处理
            //     newSlide = oldSlide.type ? oldSlide : await dealOldData(page.ID, oldSlide);
            // } else if (page.Type === pageType.value.listen) {
            //     newSlide = dealOldDataWord(page.ID, res.result);
            // } else if (page.Type === pageType.value.follow) {
            //     newSlide = dealOldDataVideo(page.ID, res.result);
            // } else if (page.Type === pageType.value.teach) {
            //     newSlide = dealOldDataTeach(page.ID, res.result);
            // }
            // return Object.assign(newSlide, { remark: page.Remark || "" });
        }
    };
    const dealCardData = (card:CardList) => {
        const pages = card.PageList.map(page => {
            return {
                id: page.ID,
                name: page.Name || ["普通页", "听写页", "跟读页"][page.Type],
                type: page.Type,
                steps: [],
                elements: [],
                width: page.Width || 1024,
                height: page.Height || 678,
                bindId: page.TeachPageRelationID,
                remark: page.Remark || "",
                isGetData: false
            };
        });
        console.log(pages, "pages");
        return {
            id: card.ID,
            name: card.Name,
            pages: pages
        };
    };
    return {
        getPageDate,
        dealCardData
    };
};
