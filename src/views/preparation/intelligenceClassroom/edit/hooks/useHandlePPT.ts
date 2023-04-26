import { Ref } from "vue";
import { cloneDeep } from "lodash";
import { v4 as uuidv4 } from "uuid";
import messageBox from "@/utils/messageBox";
import { ElMessage, ElMessageBox } from "element-plus";
import { CardProps, PageProps } from "../../api/props";
import { Slide } from "wincard";
import { dealAnimationData } from "@/utils/dataParse";
import { getOssUrl } from "@/utils/oss";
import useHome from "@/hooks/useHome";
import { pageTypeList } from "@/config";

export default (windowCards: Ref<CardProps[]>, currentPageId: Ref<string>) => {
    let backupPage: PageProps | null = null;
    const { transformPageDetail } = useHome();

    // 教研设计
    const handleOpenLessonDesign = () => {
        // if (!editRef.value) return;
        // editRef.value.openLessonDesign();
    };

    // 帮助按钮
    const handleHelper = () => {
        // if (!editRef.value) return;
        // editRef.value.handleHelper();
    };

    // 创建文件夹
    const createFolder = (name: string) => {
        const card = {
            ID: uuidv4(),
            TeachPageRelationID: "",
            Name: name,
            Sort: windowCards.value.length,
            PageList: [],
            Fold: true
        };
        windowCards.value.push(card);
        return card;
    };

    // 新增空白页/互动页
    const createCardPage = async (pageType: any, data: CardProps | PageProps) => {
        const parentId = ("ParentID" in data) ? data.ParentID : data.ID;
        const id = uuidv4();
        const json = await transformPageDetail({ Type: pageType.value, ID: id }, {});

        const index = windowCards.value.findIndex(item => item.ID === parentId);
        const name = pageType.value !== 11 ? pageType.name : "页" + (windowCards.value[index].PageList.length + 1);
        const page = {
            ID: id,
            Name: name,
            Height: 0,
            Width: 0,
            Sort: 1,
            State: 1,
            Url: "",
            Index: 1,
            Json: json,
            DesignIntent: "",
            ParentID: parentId,
            Type: pageType.value,
            TeachPageRelationID: "",
            AcademicPresupposition: ""
        };
        if ("ParentID" in data) {
            const subIndex = windowCards.value[index].PageList.findIndex(item => item.ID === data.ID);
            windowCards.value[index].PageList.splice(subIndex + 1, 0, page);
        } else {
            windowCards.value[index].PageList.push(page);
        }
        return page;
    };

    // 删除
    const remove = (data: CardProps | PageProps) => {
        messageBox({
            content: "此操作将删除该数据, 是否继续?"
        }).then(async () => {
            const cardsList = windowCards.value;
            const currentPage = getPageById(currentPageId.value);
            if (!("ParentID" in data)) {
                const index = cardsList.findIndex(item => item.ID === data.ID);
                const index1 = cardsList.findIndex(item => item.ID === currentPage.ParentID);
                if (cardsList.length !== 1) {
                    if (index === index1) {
                        currentPageId.value = cardsList[1].PageList[0].ID;
                    }
                    windowCards.value.splice(index, 1);
                } else {
                    windowCards.value = [];
                    const card = createFolder("文件夹一");
                    const page = await createCardPage(pageTypeList[0], card);
                    currentPageId.value = page.ID;
                }
                sortWindowCards();
                return;
            }
            const index = cardsList.findIndex(item => item.ID === data.ParentID);
            const pageList = cardsList[index].PageList;
            const subIndex = pageList.findIndex(item => item.ID === data.ID);

            if (currentPageId.value !== data.ID) {
                windowCards.value[index].PageList.splice(subIndex, 1);
                sortWindowCards();
                return;
            }
            if (cardsList.length === 1 && pageList.length === 1) {
                windowCards.value = [];
                const card = createFolder("文件夹一");
                const page = await createCardPage(pageTypeList[0], card);
                currentPageId.value = page.ID;
            }

            if (cardsList.length > 1 && pageList.length === 1) {
                if (index === cardsList.length - 1) {
                    currentPageId.value = cardsList[index - 1].PageList[pageList.length - 1].ID;
                } else {
                    currentPageId.value = cardsList[index + 1].PageList[0].ID;
                }
                windowCards.value.splice(index, 1);
            }

            if (subIndex === pageList.length - 1) {
                currentPageId.value = pageList[subIndex - 1].ID;
            } else {
                currentPageId.value = pageList[subIndex + 1].ID;
            }
            windowCards.value[index].PageList.splice(subIndex, 1);
            sortWindowCards();
        });
    };

    // 重新排序ppt
    const sortWindowCards = () => {
        const list = cloneDeep<CardProps[]>(windowCards.value);

        let index = 1;
        for (let i = 0; i < list.length; i++) {
            const item = list[i];

            for (let j = 0; j < item.PageList.length; j++) {
                item.PageList[j].Index = index;
                item.PageList[j].Sort = j + 1;
                item.PageList[j].ParentID = item.ID;
                index++;
            }
        }
        windowCards.value = list;
    };

    // 当前page替换
    const replaceCurrentPage = async (page: PageProps) => {
        const index = windowCards.value.findIndex(item => item.ID === page.ParentID);
        const subIndex = windowCards.value[index].PageList.findIndex(item => item.ID === page.ID);

        windowCards.value[index].PageList.splice(subIndex, 1, page);
    };

    // 往windowsCard插入或删除page数据
    const insertWindowsCards = async (page: PageProps, index: number, subIndex?: number) => {
        if (typeof subIndex === "number") {
            windowCards.value[index].PageList.splice(subIndex + 1, 0, page);
        } else {
            windowCards.value[index].PageList.push(page);
        }
    };

    const getPageById = (id: string): PageProps => {
        let allPages: PageProps[] = [];
        windowCards.value.forEach(item => {
            allPages = allPages.concat(...item.PageList);
        });
        return allPages.find(item => item.ID === id) as PageProps;
    };

    // 组装ppt列表数据
    async function assembleCardData(arr: CardProps[]) {
        const list = [];
        let index = 1;

        for (let i = 0; i < arr.length; i++) {
            const item = arr[i];
            const pageList: PageProps[] = [];

            for (let j = 0; j < item.PageList.length; j++) {
                const it = item.PageList[j];
                if (!it) continue;

                if (!currentPageId.value) {
                    currentPageId.value = it.ID;
                }

                const json = JSON.parse(it.Json || "{}");
                let url = it.Url || "";
                if (!url && (it.Type === 20 || it.Type === 16)) {
                    const file = json?.ToolFileModel?.File;
                    const key = `${file?.FilePath}/${file?.FileMD5}.${file?.FileExtention || file?.Extention}`;
                    url = json?.ToolFileModel ? await getOssUrl(key, "axsfile") : "";
                }

                const slide: Slide = await transformPageDetail(it, json);

                const obj = {
                    ID: it.ID,
                    TeachPageRelationID: it.TeachPageRelationID,
                    Name: it.Name,
                    Height: it.Height,
                    Width: it.Width,
                    Type: it.Type,
                    Sort: it.Sort,
                    State: it.State,
                    AcademicPresupposition: it.AcademicPresupposition,
                    DesignIntent: it.DesignIntent,
                    Json: dealAnimationData(slide),
                    Index: index,
                    Url: url,
                    ParentID: item.ID
                };

                pageList.push(obj);
                index++;
            }
            list.push({
                ID: item.ID,
                TeachPageRelationID: item.TeachPageRelationID,
                Name: item.Name,
                Sort: item.Sort,
                PageList: pageList,
                Fold: true
            });
        }
        windowCards.value = list;
    }

    return {
        remove,
        getPageById,
        createFolder,
        handleHelper,
        createCardPage,
        sortWindowCards,
        insertWindowsCards,
        replaceCurrentPage,
        handleOpenLessonDesign,
        assembleCardData
    };
};
