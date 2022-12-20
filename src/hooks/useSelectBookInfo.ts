import {
    getSubjectPublisherBookList,
    getChapters,
    getWindowStruct,
    IGetChapters,
    IGetWindowCards,
} from "@/api/home";
import { ITreeList, ICardList, IPageValue } from "@/types/home";
import { reactive, ref, toRefs } from "vue";
import { useRoute } from "vue-router";
import { Slide } from "wincard";
import useHome from "@/hooks/useHome";
import { ElMessageBox, ElMessage } from "element-plus";
import { getImageSize } from "@/utils/image";
import { createRandomCode } from "@/utils/common";
import {
    addTeachPageTemplateLinkCount,
    AddSourceMaterialCall,
} from "@/api/material";
interface State {
    subjectPublisherBookList: ITreeList[];
    subjectPublisherBookValue: string[];
    chaptersList: ITreeList[];
    chaptersValue: string;
    winList: ITreeList[];
    winValue: string[];
    windowCards: ICardList[];
    oldWindowCards: ICardList[]; // 拖拽使用
    allPageListMap: Map<string, Slide>;
    oldAllPageListMap: Map<string, Slide>;
    pastePage: IPageValue | null;
}

export default () => {
    const route = useRoute();
    const defaultProps = ref({
        children: "PageList",
        label: "Name",
        value: "ID",
    });
    const pageValue = ref<IPageValue>({
        ID: "",
        Type: 11,
        TeachPageRelationID: "",
        State: false,
    });
    const cardsValue = ref({ ID: "" });
    // const isSetCache = ref(false); // 是否需要更新窗下的数据
    const state = reactive<State>({
        subjectPublisherBookList: [],
        subjectPublisherBookValue: [],
        chaptersList: [],
        chaptersValue: "",
        winList: [],
        winValue: [],
        windowCards: [],
        oldWindowCards: [],
        allPageListMap: new Map(),
        oldAllPageListMap: new Map(),
        pastePage: null, // 粘贴卡
    });

    const { transformPageDetail } = useHome();

    const findFirstId = (tree: ITreeList[], ids: string[]) => {
        tree.forEach((item) => {
            ids.push(item.ID);
            if (item.Children && item.Children.length > 0) {
                findFirstId([item.Children[0]], ids);
            }
        });
        return ids;
    };

    const _getSubjectPublisherBookList = () => {
        getSubjectPublisherBookList().then((res) => {
            if (res.resultCode === 200) {
                state.subjectPublisherBookList = res.result;
                state.subjectPublisherBookValue = findFirstId(
                    [state.subjectPublisherBookList[0]],
                    []
                );
            }
        });
    };

    const _getChapters = (data: IGetChapters) => {
        getChapters(data).then((res) => {
            if (res.resultCode === 200) {
                state.chaptersList = res.result || [];
                if (state.chaptersList.length > 0) {
                    state.chaptersValue = state.chaptersList[0].ID;
                    state.winValue = [];
                } else {
                    state.chaptersValue = "";
                    state.winList = [];
                    state.winValue = [];
                    state.windowCards = [];
                }
            }
        });
    };

    const _getWinList = (curVal: string) => {
        const value: ITreeList | undefined = state.chaptersList.find(
            (item) => item.ID === curVal
        );
        if (
            value &&
            Array.isArray(value.Children) &&
            value.Children.length > 0
        ) {
            state.winList = value.Children.filter(
                (item: any) => item.Children && item.Children.length > 0
            );
        } else {
            state.winList = [];
        }
        state.winValue = [];
        state.windowCards = [];
    };

    const _getWindowCards = (data: IGetWindowCards) => {
        // return getWindowCards(data).then(res => {
        //     if (res.resultCode === 200) {
        //         state.windowCards = res.result;
        //         isSetCache.value = isCache;
        //         state.oldWindowCards = JSON.parse(JSON.stringify(res.result));
        //     }
        // });
        state.allPageListMap.clear();
        state.oldAllPageListMap.clear();
        return getWindowStruct(data).then((res) => {
            if (res.resultCode === 200) {
                state.windowCards = res.result.CardData || [];
                // isSetCache.value = isCache;
                state.oldWindowCards = JSON.parse(
                    JSON.stringify(state.windowCards)
                );
                savePageDB(JSON.parse(JSON.stringify(state.windowCards)));
            }
        });
    };

    // 缓存页到本地数据库DB、处理所有的页数据
    const savePageDB = (windowCards: ICardList[]) => {
        windowCards.forEach((card: ICardList) => {
            card.PageList.forEach(async (page: IPageValue) => {
                page.Json =
                    page.Json && typeof page.Json === "string"
                        ? JSON.parse(page.Json)
                        : page.Json;
                const newSlide: Slide = await transformPageDetail(
                    page,
                    page.Json
                );
                state.allPageListMap.set(page.ID, newSlide);
                state.oldAllPageListMap.set(page.ID, newSlide);
            });
        });

        console.log(state.allPageListMap, "state.allPageListMap====");
    };

    //下面是窗卡页移进来的资源库操作
    //往左侧窗卡页 插入页
    const insertData = async (obj: any) => {
        if (pageValue.value.ID) {
            const jsonData = obj.data;
            let findex = 0,
                sindex = 0;
            state.windowCards.forEach((item: any, windex: number) => {
                item.PageList.forEach((page: any, index: number) => {
                    if (page.ID === pageValue.value.ID) {
                        findex = windex;
                        sindex = index;
                    }
                });
            });
            if (obj.type === "page") {
                //如果是插入模板页

                jsonData.forEach(async (item: any) => {
                    // state.allPageListMap.set(item.ID, item.Json); //添加一条Map

                    item.Json =
                        item.Json && typeof item.Json === "string"
                            ? JSON.parse(item.Json)
                            : item.Json; //转为对象
                    item.AcademicPresupposition = item.Json.remark; //
                    item.DesignIntent = item.Json.design;
                    const newSlide: Slide = await transformPageDetail(
                        item,
                        item.Json
                    );
                    state.allPageListMap.set(item.ID, newSlide);
                    item.isAdd = true; //新插入的 pageid置空
                    console.log("item======>", item);
                });

                state.windowCards[findex]?.PageList.splice(
                    sindex + 1,
                    0,
                    ...jsonData
                );
                state.windowCards = [...state.windowCards];
                console.log("state.windowCards======>", state.windowCards);

                //插入成功后调用一下增加次数的接口
                const res = await addTemLinkCount(
                    obj.teachPageTemplateID || ""
                );
                return [res, jsonData];
            } else if (obj.type === "elements") {
                //深拷贝 获取当前的页的数据
                const currentPageData: any = JSON.parse(
                    JSON.stringify(state.allPageListMap.get(pageValue.value.ID))
                );
                //只有素材也才能插入素材
                if (
                    currentPageData.type == "game" ||
                    currentPageData.type == "teach" ||
                    currentPageData.type == "listen" ||
                    currentPageData.type == "follow"
                ) {
                    ElMessage.warning(
                        "当前页无法添加素材，请先切换到素材页哦！"
                    );
                    return;
                }
                if (!currentPageData.id) return;
                //如果是元素
                //如果是图片
                console.log("jsonData", jsonData);
                switch (jsonData.Type) {
                    case 0:
                    case 2:
                    case 3:
                        insertImgElement(jsonData, currentPageData);
                        break;
                    //组件/标题框
                    case 4:
                        insertComponentEl(jsonData, currentPageData);
                        break;
                    case 5:
                        insertVideoAudio(jsonData, currentPageData, "video");
                        break;
                    case 6:
                        insertVideoAudio(jsonData, currentPageData, "audio");
                        break;
                    default:
                        break;
                }

                //素材被调用了
                const params = {
                    UserID: jsonData.TeacherID,
                    SourceMaterialMainID: jsonData.Id,
                    PageID: pageValue.value.ID,
                };
                await AddSourceMaterialCall(params);
            } else if (obj.type === "teach") {
                //教具内容插入
                //深拷贝 获取当前的页的数据
                setTimeout(() => {
                    const currentPageData: any = JSON.parse(
                        JSON.stringify(
                            state.allPageListMap.get(pageValue.value.ID)
                        )
                    );
                    currentPageData.teach = {
                        id: jsonData.ID,
                        name: jsonData.Name,
                        src: jsonData.Url,
                    };
                    state.allPageListMap.set(
                        pageValue.value.ID,
                        currentPageData
                    );
                    state.windowCards = [...state.windowCards];
                }, 200);
            }
        } else {
            ElMessage.warning("请先选择页，再进行插入");
            return;
        }
    };
    const viewportRatio = ref(0.5625);
    const VIEWPORT_SIZE = 1280;
    //插入图片/插画
    const insertImgElement = (elData: any, currentPageData: any) => {
        //2 3是图片或者插画 image格式
        getImageSize(elData.url).then(({ width, height }) => {
            const scale = height / width;
            if (scale < viewportRatio.value && width > VIEWPORT_SIZE) {
                width = VIEWPORT_SIZE;
                height = width * scale;
            } else if (height > VIEWPORT_SIZE * viewportRatio.value) {
                height = VIEWPORT_SIZE * viewportRatio.value;
                width = height / scale;
            }
            //过滤出file中为type为0的附件，0为图片
            const file = elData.Files?.length
                ? elData.Files.find((item: any) => item.Type == 0)
                : elData.SourceMaterialMainID
                ? elData
                : null;
            console.log("file--", file);

            if (!file) return;
            //定义当前选择的素材参数
            const id = createRandomCode(); //随机唯一id
            const elParams = {
                fixedRatio: true,
                id,
                name: elData.Name,
                rotate: 0,
                // ossSrc: jsonData.url || '',
                // ossExpiration: file.FileExtention,
                src: `${file.FilePath}/${file.FileMD5}.${file.FileExtention}`,
                stretch: 1,
                left: (VIEWPORT_SIZE - width) / 2,
                top: (VIEWPORT_SIZE * viewportRatio.value - height) / 2,
                type: "image",
                width,
                height,
            };
            //给当前选择的页的element元素中 添加一条素材
            currentPageData.elements.push(elParams);
            state.windowCards = [...state.windowCards];
            //重新设置map，更新当前这个页面元素
            state.allPageListMap.set(currentPageData.id, currentPageData);
        });
    };
    //插入组件/标题框
    const insertComponentEl = (elData: any, currentPageData: any) => {
        const file = elData.Files?.length
            ? elData.Files.find((item: any) => item.Type == 0)
            : null;
        if (file && file.Json) {
            const jsonData = JSON.parse(file.Json);
            if (!jsonData) return;
            jsonData.offSetElements.forEach(
                (item: any) => (item.id = createRandomCode())
            );
            currentPageData.elements.push(...jsonData.offSetElements);
            state.windowCards = [...state.windowCards];
            state.allPageListMap.set(currentPageData.id, currentPageData);
        }
    };

    //插入视频音频
    const insertVideoAudio = (
        elData: any,
        currentPageData: any,
        type: string
    ) => {
        const file = elData.Files?.length
            ? elData.Files.find((item: any) => item.Type == 1)
            : null;
        const id = createRandomCode(); //随机唯一id
        const width = elData.showType === 0 ? 500 : 100;
        const height = elData.showType === 0 ? 300 : 100;
        const elParams = {
            name: elData.Name,
            type: type,
            id: id,
            width,
            height,
            rotate: 0,
            left: (VIEWPORT_SIZE - width) / 2,
            top: (VIEWPORT_SIZE * viewportRatio.value - height) / 2,
            src: `${file.FilePath}/${file.FileMD5}.${file.FileExtention}`,
            showType: elData.showType,
            clip: elData.clip ? elData.clip : undefined,
        };
        //给当前选择的页的element元素中 添加一条素材
        currentPageData.elements.push(elParams);
        state.windowCards = [...state.windowCards];
        //重新设置map，更新当前这个页面元素
        state.allPageListMap.set(currentPageData.id, currentPageData);
        console.log(
            "-->",
            state.allPageListMap,
            state.windowCards,
            currentPageData
        );
    };
    //模板使用次数 + 1
    const addTemLinkCount = async (temId: string) => {
        if (!temId) return false;
        const params = {
            TeachPageTemplateID: temId,
            TeacherID: "",
        };
        const res: any = await addTeachPageTemplateLinkCount(params);
        if (res.resultCode === 200) {
            return true;
        } else {
            return false;
        }
    };
    return {
        // isSetCache,
        defaultProps,
        pageValue,
        cardsValue,
        state,
        findFirstId,
        _getSubjectPublisherBookList,
        _getChapters,
        _getWindowCards,
        _getWinList,
        insertData,
    };
};
