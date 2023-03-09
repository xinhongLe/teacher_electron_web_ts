import { Ref } from "vue";
import { Slide } from "wincard";
import { cloneDeep } from "lodash";
import { v4 as uuidv4 } from "uuid";
import useHome from "@/hooks/useHome";
import { pageTypeList } from "@/config";
import messageBox from "@/utils/messageBox";
import { initSlideData } from "@/utils/dataParsePage";
import { ElMessage, ElMessageBox } from "element-plus";
import { CardProps, PageProps } from "../../api/props";

export default (windowCards: Ref<CardProps[]>, allPages: Ref<PageProps[]>, pageMap: Ref<Map<string, Slide>>, currentPage: Ref<PageProps | undefined>, editRef: Ref) => {
    const { transformPageDetail } = useHome();
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
    const createFolder = () => {
        ElMessageBox.prompt("", "新建文件夹", {
            inputPattern: /\S/,
            inputErrorMessage: "请填写文件夹名称"
        }).then(async ({ value }) => {
            const card = {
                ID: uuidv4(),
                TeachPageRelationID: "",
                Name: value,
                Sort: windowCards.value.length,
                PageList: [],
                Fold: true
            };
            windowCards.value.push(card);
            await createCardPage(pageTypeList[0], card);
        });
    };

    // 新增空白页/互动页
    const createCardPage = async (pageType: any, data: CardProps | PageProps) => {
        const parentId = (data as PageProps).ParentID || data?.ID;
        const id = uuidv4();
        const page = {
            ID: id,
            TeachPageRelationID: "",
            Name: pageType.name,
            Height: 0,
            Width: 0,
            Type: pageType.value,
            Sort: 1,
            State: 1,
            AcademicPresupposition: "",
            DesignIntent: "",
            Json: initSlideData(id, pageType.value),
            Index: 1,
            Url: "",
            ParentID: parentId
        };
        const index = windowCards.value.findIndex(item => item.ID === parentId);

        windowCards.value[index].PageList.push(page);
        await sortWindowCards(index, windowCards.value[index].PageList.length - 1);
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

        data.PageList.push(backupPage);

        const index = windowCards.value.findIndex(item => item.ID === data.ID);
        await sortWindowCards(index, data.PageList.length - 1);
    };

    // 删除
    const remove = (data: CardProps | PageProps) => {
        messageBox({
            content: "此操作将删除该数据, 是否继续?"
        }).then(async () => {
            if (!(data as PageProps).ParentID) {
                const index = windowCards.value.findIndex(item => item.ID === (data as CardProps).ID);
                windowCards.value.splice(index, 1);
                await sortWindowCards(0, 0);
            } else {
                const index = windowCards.value.findIndex(item => item.ID === (data as PageProps).ParentID);
                const find = windowCards.value.find(item => item.ID === (data as PageProps).ParentID);
                if (find) {
                    const idx = find.PageList.findIndex(item => item.ID === data.ID);
                    find.PageList.splice(idx, 1);
                    await sortWindowCards(index, find.ID === currentPage.value?.ID ? 0 : idx - 1);
                }
            }
        });
    };

    // 重新排序ppt
    const sortWindowCards = async (index1 = 0, index2 = 0) => {
        pageMap.value.clear();
        allPages.value = [];
        const time = new Date().getTime();

        const list = cloneDeep<CardProps[]>(windowCards.value);
        currentPage.value = list[index1].PageList[index2];
        const backupPages = [];

        let index = 1;
        for (let i = 0; i < list.length; i++) {
            const item = list[i];

            for (let j = 0; j < item.PageList.length; j++) {
                const it = item.PageList[j];

                const slide = await transformPageDetail(it, it.Json);
                pageMap.value.set(it.ID, slide);

                it.Index = index;
                it.Sort = index + 1;
                it.ParentID = item.ID;
                backupPages.push(it);
                index++;
            }
        }
        console.log((new Date().getTime() - time) * 1000);

        windowCards.value = list;
        allPages.value = backupPages;
    };

    // 当前page替换
    const replaceCurrentPage = async (page: PageProps) => {
        const index = windowCards.value.findIndex(item => item.ID === page.ParentID);
        const subIndex = windowCards.value[index].PageList.findIndex(item => item.ID === page.ID);

        windowCards.value[index].PageList.splice(subIndex, 1, page);

        const slide = await transformPageDetail(page, page.Json);
        pageMap.value.set(page?.ID, slide);

        const idx = allPages.value.findIndex(item => item.ID === page?.ID);
        allPages.value[idx] = page;
    };

    return {
        copy,
        paste,
        remove,
        rename,
        createFolder,
        handleHelper,
        createCardPage,
        sortWindowCards,
        handlePageClick,
        replaceCurrentPage,
        handleOpenLessonDesign
    };
};
