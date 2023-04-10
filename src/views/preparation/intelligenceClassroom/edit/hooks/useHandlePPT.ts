import { Ref } from "vue";
import { cloneDeep } from "lodash";
import { v4 as uuidv4 } from "uuid";
import { pageTypeList } from "@/config";
import messageBox from "@/utils/messageBox";
import { initSlideData } from "@/utils/dataParsePage";
import { ElMessage, ElMessageBox } from "element-plus";
import { CardProps, PageProps } from "../../api/props";

export default (windowCards: Ref<CardProps[]>, currentPage: Ref<PageProps | null>, editRef: Ref) => {
    let backupPage: PageProps | null = null;

    // 切换ppt页面
    const handlePageClick = (data: PageProps, e?: KeyboardEvent) => {
        if (e?.shiftKey || e?.ctrlKey) return;
        if (data.ID === currentPage.value?.ID) return;

        if (!editRef.value) return;
        editRef.value.saveSlide();

        currentPage.value = data;
    };

    // 教研设计
    const handleOpenLessonDesign = () => {
        if (!editRef.value) return;
        editRef.value.openLessonDesign();
    };

    // 帮助按钮
    const handleHelper = () => {
        if (!editRef.value) return;
        editRef.value.handleHelper();
    };

    // 创建文件夹
    const createFolder = async (name: string) => {
        const card = {
            ID: uuidv4(),
            TeachPageRelationID: "",
            Name: name,
            Sort: windowCards.value.length,
            PageList: [],
            Fold: true
        };
        windowCards.value.push(card);
        await createCardPage(pageTypeList[0], card);
    };

    // 新增空白页/互动页
    const createCardPage = async (pageType: any, data: CardProps | PageProps) => {
        const parentId = (data as PageProps).ParentID || data?.ID;
        const id = uuidv4();
        const json = initSlideData(id, pageType.value);
        const index = windowCards.value.findIndex(item => item.ID === parentId);
        let name = pageType.name;
        if (pageType.value === 11) {
            name = "页" + (windowCards.value[index].PageList.length + 2);
        }
        const page = {
            ID: id,
            TeachPageRelationID: "",
            Name: name,
            Height: 0,
            Width: 0,
            Type: pageType.value,
            Sort: 1,
            State: 1,
            AcademicPresupposition: "",
            DesignIntent: "",
            Json: json,
            Index: 1,
            Url: "",
            ParentID: parentId
        };
        let subIndex;
        if ("ParentID" in data) {
            subIndex = windowCards.value[index].PageList.findIndex(item => item.ID === data.ID);
        }

        insertWindowsCards(page, index, subIndex);
        sortWindowCards();
        currentPage.value = getPageById(id);
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
            const cardsList = windowCards.value;
            if (!("ParentID" in data)) {
                const index = cardsList.findIndex(item => item.ID === data.ID);
                const index1 = cardsList.findIndex(item => item.ID === currentPage.value?.ParentID);
                if (cardsList.length !== 1) {
                    if (index === index1) {
                        currentPage.value = cardsList[1].PageList[0];
                    }
                    windowCards.value.splice(index, 1);
                    sortWindowCards();
                } else {
                    windowCards.value = [];
                    await createFolder("文件夹一");
                    currentPage.value = windowCards.value[0].PageList[0];
                }
                return;
            }
            const index = cardsList.findIndex(item => item.ID === data.ParentID);
            if (index === -1) return;

            let page: PageProps | null = null;
            const pageList = cardsList[index].PageList;
            const idx = pageList.findIndex(item => item.ID === data.ID);
            if (currentPage.value?.ID === data.ID) {
                if (pageList.length === 1) {
                    const selectPageList = cardsList[length - 1]?.PageList;
                    page = selectPageList ? selectPageList[selectPageList.length - 1] : null;
                }

                if (pageList.length > 1 && idx === pageList.length - 1) {
                    page = pageList[idx - 1];
                }
                if (pageList.length > 1 && idx !== pageList.length - 1) {
                    page = pageList[idx + 1];
                }
                if (pageList.length === 1) {
                    const selectPageList = cardsList[index + 1]?.PageList;
                    page = selectPageList ? selectPageList[0] : null;
                }
                if (index === 0 && pageList.length === 1) {
                    const selectPageList = cardsList[index + 1]?.PageList;
                    page = selectPageList ? selectPageList[0] : null;
                }
                if (index === cardsList.length - 1 && pageList.length === 1) {
                    const selectPageList = cardsList[cardsList.length - 1]?.PageList;
                    page = selectPageList ? selectPageList[selectPageList.length - 1] : null;
                }
                currentPage.value = page;
            }

            const flag = windowCards.value.length > 0 && windowCards.value[0].PageList.length > 1;
            if (flag) {
                if (pageList.length === 1) {
                    cardsList.splice(index, 1);
                } else {
                    pageList.splice(idx, 1);
                }
                sortWindowCards();
            } else {
                windowCards.value = [];
                await createFolder("文件夹一");
                currentPage.value = windowCards.value[0].PageList[0];
            }
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
        handlePageClick,
        insertWindowsCards,
        replaceCurrentPage,
        handleOpenLessonDesign
    };
};
