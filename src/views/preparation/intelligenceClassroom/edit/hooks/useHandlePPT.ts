import { ref, Ref } from "vue";
import { CardProps, PageProps } from "@/views/preparation/intelligenceClassroom/api/props";
import { Slide } from "wincard";
import { ElMessage, ElMessageBox } from "element-plus";
import { v4 as uuidv4 } from "uuid";
import useHome from "@/hooks/useHome";
import { pageTypeList } from "@/config";
import { cloneDeep } from "lodash";

export default (windowCards: Ref<CardProps[]>, allPages: Ref<PageProps[]>, pageMap: Ref<Map<string, Slide>>, currentPage: Ref<PageProps | undefined>) => {
    const { transformPageDetail } = useHome();
    let backupPage: PageProps | null = null;

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
            Json: {},
            Index: 1,
            Url: "",
            ParentID: parentId
        };
        const index = windowCards.value.findIndex(item => item.ID === parentId);

        windowCards.value[index].PageList.push(page);
        await sortWindowCards(index);
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
        await sortWindowCards(index);
    };

    // 重新排序ppt
    const sortWindowCards = async (idx = 0) => {
        pageMap.value.clear();
        allPages.value = [];

        const list = cloneDeep<CardProps[]>(windowCards.value);
        const backupPages = [];

        let index = 1;
        for (let i = 0; i < list.length; i++) {
            const item = list[i];

            for (let j = 0; j < item.PageList.length; j++) {
                const it = item.PageList[j];

                const slide: Slide = await transformPageDetail(it, it.Json);
                pageMap.value.set(it.ID, slide);

                it.Index = index;
                it.Sort = index + 1;
                it.ParentID = item.ID;
                backupPages.push(it);
                index++;
            }
        }

        windowCards.value = list;
        const pageList = list[idx].PageList;
        currentPage.value = pageList[pageList.length - 1];
        allPages.value = backupPages;
    };

    return {
        copy,
        paste,
        rename,
        createFolder,
        createCardPage,
        sortWindowCards
    };
};
