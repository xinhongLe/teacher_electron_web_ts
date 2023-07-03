import { Ref, ref } from "vue";
import { Slide } from "wincard";
import { cloneDeep } from "lodash";
import { v4 as uuidv4 } from "uuid";
import useHome from "@/hooks/useHome";
import { getOssUrl } from "@/utils/oss";
import { pageTypeList } from "@/config";
import { ElMessage } from "element-plus";
import messageBox from "@/utils/messageBox";
import { CardProps, PageProps } from "../../api/props";
import { dealAnimationData } from "@/utils/dataParse";

export default (windowCards: Ref<CardProps[]>, currentPageId: Ref<string>) => {
    const { transformPageDetail } = useHome();

    const previewIndex = ref(0);
    const winCardViewRef = ref();
    const winScreenView = ref(false);

    // 创建文件夹
    const createFolder = (name: string) => {
        const card: CardProps = {
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
    const createPage = async (pageType: any, data: CardProps | PageProps) => {
        const parentId = ("ParentID" in data) ? data.ParentID : data.ID;
        const id = uuidv4();
        const json = await transformPageDetail({ Type: pageType.value, ID: id }, {});

        const index = windowCards.value.findIndex(item => item.ID === parentId);
        const name = pageType.value !== 11 ? pageType.name : "页" + (windowCards.value[index].PageList.length + 1);
        const page = {
            ID: id,
            Sort: 1,
            Url: "",
            Width: 0,
            State: 1,
            Index: 1,
            Height: 0,
            Json: json,
            Remark: "",
            Name: name,
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
                    const page = await createPage(pageTypeList[0], card);
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
                const page = await createPage(pageTypeList[0], card);
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

    // 预览(1-当前页开始，2-第一页开始)
    const preview = (type: 1 | 2, editRef: any) => {
        if (!editRef) return;

        const currentPage = getPageById(currentPageId.value);
        if (type === 1 && !currentPage.State) {
            ElMessage.warning("已下架的页, 暂不支持预览");
            return;
        }
        previewIndex.value = 0;
        if (type === 1) {
            let allPages: PageProps[] = [];
            windowCards.value.forEach(item => {
                allPages = allPages.concat(...item.PageList);
            });
            previewIndex.value = allPages.filter(item => item.State).findIndex(item => item.ID === currentPageId.value);
        }

        currentPage.Json = editRef.getCurrentSlide();

        winScreenView.value = true;
        window.electron.setFullScreen(true);
        setTimeout(() => {
            winCardViewRef.value.setScreening(true);
        }, 20);
    };

    // 关闭全屏预览
    const offPreview = () => {
        window.electron.setFullScreen(false);

        winScreenView.value = false;
        previewIndex.value = -1;
    };

    const applyBackgroundAllSlide = (data: any) => {
        const list = cloneDeep<CardProps[]>(windowCards.value);
        for (let i = 0; i < list.length; i++) {
            const item = list[i];

            for (let j = 0; j < item.PageList.length; j++) {
                const it = item.PageList[j];

                if (!it.Json.background) continue;

                it.Json.background = data;
            }
        }

        windowCards.value = list;
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
                    ParentID: item.ID,
                    Remark: ""
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
        return cloneDeep(list);
    }

    return {
        remove,
        preview,
        createPage,
        offPreview,
        getPageById,
        createFolder,
        previewIndex,
        winScreenView,
        winCardViewRef,
        sortWindowCards,
        assembleCardData,
        applyBackgroundAllSlide
    };
};
