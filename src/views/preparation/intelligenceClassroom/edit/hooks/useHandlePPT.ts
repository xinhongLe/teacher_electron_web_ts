import { Ref } from "vue";
import { cloneDeep } from "lodash";
import { v4 as uuidv4 } from "uuid";
import { pageTypeList } from "@/config";
import messageBox from "@/utils/messageBox";
import { initSlideData } from "@/utils/dataParsePage";
import { ElMessage, ElMessageBox } from "element-plus";
import { CardProps, PageProps } from "../../api/props";
import { Slide } from "wincard";
import { dealAnimationData } from "@/utils/dataParse";
import { getOssUrl } from "@/utils/oss";
import useHome from "@/hooks/useHome";
import { json } from "stream/consumers";

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
            TeachPageRelationID: "",
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
            AcademicPresupposition: ""
        };
        if ("ParentID" in data) {
            const subIndex = windowCards.value[index].PageList.findIndex(item => item.ID === data.ID);
            windowCards.value[index].PageList.splice(subIndex, 0, page);
        } else {
            windowCards.value[index].PageList.push(page);
        }

        return page;
    };

    // 重名名
    const rename = (data: CardProps | PageProps) => {
        ElMessageBox.prompt("", "重命名", {
            inputPattern: /\S/,
            inputValue: data.Name,
            inputErrorMessage: "请填写名称！"
        }).then(async ({ value }) => {
            data.Name = value;
        });
    };

    // 复制页
    const copy = (data: PageProps) => {
        backupPage = cloneDeep(data);
        ElMessage.success("复制成功！");
    };

    // 粘贴页
    const paste = async (data: CardProps) => {
        if (!backupPage) {
            ElMessage.warning("您还未复制素材");
            return;
        }
        backupPage.ID = uuidv4();
        backupPage.Name = backupPage.Name + "（新）";
        const index = windowCards.value.findIndex(item => item.ID === data.ID);

        insertWindowsCards(backupPage, index);

        sortWindowCards();
    };

    // 删除
    const remove = (data: CardProps | PageProps) => {
        messageBox({
            content: "此操作将删除该数据, 是否继续?"
        }).then(async () => {
            // const cardsList = windowCards.value;
            // if (!("ParentID" in data)) {
            //     const index = cardsList.findIndex(item => item.ID === data.ID);
            //     const index1 = cardsList.findIndex(item => item.ID === currentPage.value?.ParentID);
            //     if (cardsList.length !== 1) {
            //         if (index === index1) {
            //             currentPage.value = cardsList[1].PageList[0];
            //         }
            //         windowCards.value.splice(index, 1);
            //         sortWindowCards();
            //     } else {
            //         windowCards.value = [];
            //         await createFolder("文件夹一");
            //         currentPage.value = windowCards.value[0].PageList[0];
            //     }
            //     return;
            // }
            // const index = cardsList.findIndex(item => item.ID === data.ParentID);
            // if (index === -1) return;
            //
            // let page: PageProps | null = null;
            // const pageList = cardsList[index].PageList;
            // const idx = pageList.findIndex(item => item.ID === data.ID);
            // if (currentPage.value?.ID === data.ID) {
            //     if (pageList.length === 1) {
            //         const selectPageList = cardsList[length - 1]?.PageList;
            //         page = selectPageList ? selectPageList[selectPageList.length - 1] : null;
            //     }
            //
            //     if (pageList.length > 1 && idx === pageList.length - 1) {
            //         page = pageList[idx - 1];
            //     }
            //     if (pageList.length > 1 && idx !== pageList.length - 1) {
            //         page = pageList[idx + 1];
            //     }
            //     if (pageList.length === 1) {
            //         const selectPageList = cardsList[index + 1]?.PageList;
            //         page = selectPageList ? selectPageList[0] : null;
            //     }
            //     if (index === 0 && pageList.length === 1) {
            //         const selectPageList = cardsList[index + 1]?.PageList;
            //         page = selectPageList ? selectPageList[0] : null;
            //     }
            //     if (index === cardsList.length - 1 && pageList.length === 1) {
            //         const selectPageList = cardsList[cardsList.length - 1]?.PageList;
            //         page = selectPageList ? selectPageList[selectPageList.length - 1] : null;
            //     }
            //     currentPage.value = page;
            // }
            //
            // const flag = windowCards.value.length > 0 && windowCards.value[0].PageList.length > 1;
            // if (flag) {
            //     if (pageList.length === 1) {
            //         cardsList.splice(index, 1);
            //     } else {
            //         pageList.splice(idx, 1);
            //     }
            //     sortWindowCards();
            // } else {
            //     windowCards.value = [];
            //     await createFolder("文件夹一");
            //     currentPage.value = windowCards.value[0].PageList[0];
            // }
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
        copy,
        paste,
        remove,
        rename,
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
