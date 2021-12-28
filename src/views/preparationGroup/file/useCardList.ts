import { fetchPreparateListPage } from "../api";
import { ref } from "vue";
import { PreparateListBag, FetchPreparateListPageData, FetchPreparateListPageRes } from "@/types/preparationGroup";

export default () => {
    const cardList = ref<PreparateListBag[]>([]);

    const dealResult = (res:FetchPreparateListPageRes) => {
        const { list = [] } = res;
        cardList.value = list;
    };

    const getCardList = async (params: FetchPreparateListPageData) => {
        const res = await fetchPreparateListPage(params);
        if (res.resultCode === 200) {
            res.result.list = [
                {
                    preTitle: "第3单元 长方形和正方形",
                    lessonRange: "",
                    status: 2,
                    createrName: "李某",
                    createrID: "createrID",
                    createTime: "2021-12-20 14:20",
                    createEndTime: "2021-12-20 14:20",
                    teacherCount: 5,
                    fileModel: {
                        id: "string",
                        name: "string",
                        sn: 1,
                        fileName: "string",
                        bucket: "string",
                        filePath: "string",
                        extention: "string",
                        fileMD5: "string",
                        type: 1,
                        staffID: "string"
                    }
                },
                {
                    preTitle: "第2单元 千克与克",
                    lessonRange: "",
                    status: 1,
                    createrName: "李某",
                    createrID: "createrID",
                    createTime: "2021-12-20 14:20",
                    createEndTime: "2021-12-20 14:20",
                    teacherCount: 5,
                    fileModel: {
                        id: "string",
                        name: "string",
                        sn: 1,
                        fileName: "string",
                        bucket: "string",
                        filePath: "string",
                        extention: "string",
                        fileMD5: "string",
                        type: 1,
                        staffID: "string"
                    }
                }
            ];
            dealResult(res.result);
        }
    };

    return {
        cardList,
        getCardList
    };
};
