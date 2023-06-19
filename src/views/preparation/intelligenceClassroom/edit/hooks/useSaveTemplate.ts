import { nextTick, ref } from "vue";
import { IPageValue } from "@/types/home";
import {
    AddSourceMaterialCall,
    addTeachPageTemplateLinkCount,
    DeleteSourceAssembly,
    deleteWindowsTemplateList,
    GetAdviceCollection,
    GetCategoryByMaterialType,
    getClassroomLinkList,
    getMyWindowsTemplateList,
    GetSourceAssemblyList,
    GetSourceMaterials,
    getWindowsTemplateList,
    reorderWindowsTemplate,
    saveTemplate,
    updateWindowsTemplateSort,
    updateWindowsTemplateStatus
} from "@/api/material";
import { getToolList } from "@/api";
import { IAdviceCol, ICategory, IClassRoom, IDAssembly, IDelTem, IGAssembly, IGetList, IGetMyList, IMaterialParams, IRecordSort, IUpdateSort, IUpdateStatus } from "@/types/material";
import { ElMessage } from "element-plus";
import useHome from "@/hooks/useHome";
import { Slide } from "wincard";
import { getOssUrl } from "@/utils/oss";
import { CardProps, MaterialProp, PageProps } from "@/views/preparation/intelligenceClassroom/api/props";
import { cloneDeep } from "lodash-es";
import { dealAnimationData } from "@/utils/dataParse";
import { v4 as uuidv4 } from "uuid";
import { pageType } from "@/config";
import { getImageSize } from "@/utils/image";
import { getWindowStruct } from "@/api/home";

export default () => {
    const { transformPageDetail } = useHome();
    const selectPageData = ref<any[]>([]);
    const dialogVisibleTemplate = ref(false);
    const showTemplateType = ref(1);
    const classroomLinkList = ref<any>([]); // 课堂环节
    const templateList = ref([]); // 模板列表
    const dialogStatus = ref("add"); // 是保存还是编辑
    const templateFormData = ref({}); // 编辑时候回显用的表单
    const materialList = ref<any>([]); // 素材列表
    const categoryData = ref([]); // 一级标签列表
    const adviceCollection = ref([]); // 推荐合集
    const toolList = ref([]); // 工具列表
    const pager = ref({
        PageNumber: 1,
        PageSize: 10,
        SortField: "",
        SortType: "",
        Total: 0,
        IsFirstPage: true,
        IsLastPage: true
    });
    const isLoading = ref(false);
    const allPageListMap = ref(new Map() as Map<string, Slide>);
    const myAssemblyList = ref([]); // 我的组件列表
    // 单独右击选择的页信息
    const materialCenterRef = ref();
    const handleSelectPages = (data: IPageValue) => {
        if (
            selectPageData.value.map((item: any) => item.ID).includes(data.ID)
        ) {
            const index = selectPageData.value
                .map((item: any) => item.ID)
                .findIndex((id: string) => id === data.ID);
            selectPageData.value.splice(index, 1);
        } else {
            selectPageData.value.push(data);
        }
    };

    // 打开编辑模板弹框
    const editTemplate = (data: any) => {
        dialogStatus.value = "edit";
        templateFormData.value = {
            ID: data.TeachPageTemplateID || "",
            OriginType: data.OriginType,
            Name: data.Name,
            // LessonID: '',
            // SubjectID: '',
            // TeacherID: '',
            Status: data.Status,
            EstimatedDuration: data.EstimatedDuration,
            HavingAudio: data.HavingAudio,
            HavingVideo: data.HavingVideo
        };
        dialogVisibleTemplate.value = true;
    };
    // 根据科目获取课堂环节
    const queryClassroomLinkList = async (data: IClassRoom) => {
        const res: any = await getClassroomLinkList(data);
        if (res.resultCode === 200) {
            classroomLinkList.value = res.result;
        } else {
            classroomLinkList.value = [];
        }
    };

    const formataSlideMap = async (arr: any, mapList: any) => {
        arr.forEach((item: any) => {
            item.TeachPageTemplate.forEach((item2: any) => {
                item2.CardData[0]?.PageList.forEach(
                    async (page: IPageValue) => {
                        if (page) {
                            const json = page.Json && typeof page.Json === "string" ? JSON.parse(page.Json) : page.Json;
                            let newSlide: Slide = await transformPageDetail(page, json);
                            newSlide = dealAnimationData(newSlide);
                            (page.Json as any) = newSlide;
                            mapList.set(page.ID, newSlide);
                            if (page.Type === 20 || page.Type === 16) {
                                const temJson: any = page.Json;
                                page.url = await formateOssUrl(
                                    temJson?.ToolFileModel?.File
                                );
                            }
                        }
                    }
                );
            });
        });
    };
    // 获取模板列表
    const queryWindowsTemplateList = async (data: IGetList, type = 0) => {
        isLoading.value = true;
        const res: any = await getWindowsTemplateList(data);
        if (res.resultCode === 200) {
            pager.value = res.result.pager;
            const temdata = res.result.list;
            await formataSlideMap(temdata, allPageListMap.value);
            setTimeout(() => {
                if (type) {
                    // 如果是滚动加载列表时，拼接返回来的数据
                    const concatData: any = templateList.value.concat(temdata);
                    if (
                        concatData.length &&
                        concatData[0].ID === concatData[1]?.ID
                    ) {
                        // 如果是课堂环节内页里-只拼接模板数据
                        concatData[0].TeachPageTemplate =
                            concatData[0].TeachPageTemplate.concat(
                                concatData[1].TeachPageTemplate
                            );
                        templateList.value = concatData.splice(0, 1);
                    } else {
                        templateList.value = concatData;
                    }
                } else {
                    templateList.value = temdata;
                }
                isLoading.value = false;
            }, 100);
        } else {
            isLoading.value = false;
        }
    };
    // 获取我的窗卡页模板列表
    const queryMyTemplateLis = async (data: IGetMyList, type = 0) => {
        isLoading.value = true;
        const res: any = await getMyWindowsTemplateList(data);
        if (res && res.resultCode === 200) {
            pager.value = res.result.pager;
            const temdata = res.result.list;
            await formataSlideMap(temdata, allPageListMap.value);
            setTimeout(() => {
                if (type) {
                    templateList.value = templateList.value.concat(temdata);
                } else {
                    templateList.value = temdata;
                }
                isLoading.value = false;
            }, 100);
            return true;
        } else {
            isLoading.value = false;
            return false;
        }
    };

    // 删除窗卡页模板
    const deleteTemplate = async (data: IDelTem) => {
        const res: any = await deleteWindowsTemplateList(data);
        if (res.resultCode === 200) {
            ElMessage.success("删除成功");
            return true;
        }
    };

    // 上下架模板
    const updateTemplateStatus = async (data: IUpdateStatus) => {
        const res: any = await updateWindowsTemplateStatus(data);
        if (res.resultCode === 200) {
            ElMessage.success(data.Status === 1 ? "上架成功" : "下架成功");
            return true;
        }
    };
    // 模板置于最前
    const updateTemplateSort = async (data: IUpdateSort) => {
        const res: any = await updateWindowsTemplateSort(data);
        if (res.resultCode === 200) {
            return true;
        }
    };
    // 拖拽课堂环节进行排序
    const reorderTemplate = async (data: IRecordSort) => {
        const res: any = await reorderWindowsTemplate(data);
        if (res.resultCode === 200) {
            return true;
        }
    };
    // 查询素材库列表
    const getSourceMaterials = async (data: IMaterialParams, type = 0) => {
        isLoading.value = true;
        const res: any = await GetSourceMaterials(data);
        isLoading.value = false;
        if (res.resultCode === 200 && res.result?.length) {
            if (type) {
                materialList.value.forEach((item: any) => {
                    res.result.forEach(async (re: any) => {
                        item.CollectionPager = re.CollectionPager;
                        item.Materials = item.Materials.concat(re.Materials);
                        item.Collections = item.Collections?.concat(
                            re.Collections
                        );
                        item.SourcePager = re.SourcePager;
                        pager.value =
                            !re.SourcePager.IsLastPage && re.SourcePager.length
                                ? re.SourcePager
                                : re.CollectionPager &&
                                !re.CollectionPager.IsLastPage &&
                                re.Collections.length
                                    ? re.CollectionPager
                                    : re.SourcePager;
                        await formatMaterial(item);
                    });
                });
            } else {
                if (data.Type !== 0) {
                    const re = res.result[0];
                    pager.value =
                        !re.SourcePager.IsLastPage && re.SourcePager.length
                            ? re.SourcePager
                            : re.CollectionPager &&
                            !re.CollectionPager.IsLastPage &&
                            re.Collections.length
                                ? re.CollectionPager
                                : re.SourcePager;
                }
                materialList.value = res.result;
                materialList.value.forEach(async (item: any) => {
                    await formatMaterial(item);
                });
            }
        } else {
            materialList.value = [];
        }
    };
    // 过滤文件
    const formatMaterial = async (item: any) => {
        item.Materials?.forEach((item2: any) => {
            item2.Files?.forEach(async (item3: any) => {
                if (item3.Type === 0) {
                    // 图片附件的
                    item2.url = await formateOssUrl(item3);
                } else {
                    // 音频视频 源文件的
                    item2.url2 = await formateOssUrl(item3);
                }
            });
        });
        // 下面是合集
        item.Collections?.forEach(async (item2: any) => {
            item2.url = await formateOssUrl(item2.Files[0]);
            item2.Files?.forEach(async (item3: any) => {
                // 图片附件的
                item3.url = await formateOssUrl(item3);
            });
        });
    };
    // 获取其他推荐合集
    const getAdviceCollection = async (data: IAdviceCol) => {
        const res: any = await GetAdviceCollection(data);
        console.log(res);
        if (res.resultCode === 200) {
            adviceCollection.value = res.result;
            adviceCollection.value.forEach(async (item: any) => {
                item.url = await formateOssUrl(item.Files[0]);
                item.Files.forEach(async (item2: any) => {
                    // 图片附件的
                    item2.url = await formateOssUrl(item2);
                });
            });
        }
    };
    // oss渲染图片url回显
    const formateOssUrl = async (file: any) => {
        const key = `${file?.FilePath}/${file?.FileMD5}.${
            file?.FileExtention || file?.Extention
        }`;
        // const url = 'https://owa.lyx-edu.com/op/view.aspx?src=' + encodeURIComponent(urlImg.url);
        return await getOssUrl(key, "axsfile");
    };

    // 获取所有合集一级分类标签
    const queryCategoryByMaterialType = async (params: ICategory) => {
        const res: any = await GetCategoryByMaterialType(params);
        if (res.resultCode === 200) {
            categoryData.value = res.result;
            // console.log("categoryData", state.categoryData);
        }
    };

    // 删除组件
    const deleteSourceAssembly = async (params: IDAssembly) => {
        const res: any = await DeleteSourceAssembly(params);
        if (res.resultCode === 200) {
            return true;
        }
    };

    // 获取组件我的
    const getSourceAssemblyList = async (params: IGAssembly) => {
        const res: any = await GetSourceAssemblyList(params);
        if (res.resultCode === 200) {
            myAssemblyList.value = res.result;
        }
    };

    // 查询教具列表
    const queryToolList = async (params: any) => {
        const res: any = await getToolList(params);
        if (res.resultCode === 200) {
            toolList.value = res.result;
            toolList.value.forEach(async (item: any) => {
                item.url = await formateOssUrl(item.File);
            });
        }
    };

    // 保存模板
    const saveWindowTemplate = async (name: string, list: PageProps[], lessonId: string, subjectId: string, teacherId: string) => {
        const params = {
            ID: "",
            Status: 1,
            Name: name,
            HavingAudio: 0,
            HavingVideo: 0,
            EstimatedDuration: 0,
            TeachPageClassroomLink: {
                Name: name
            },
            LessonID: lessonId,
            SubjectID: subjectId || "",
            TeacherID: teacherId
        };

        for (let i = 0; i < list.length; i++) {
            const item = list[i];

            if (!item.ID) continue;

            const temPage: Slide = item.Json;

            params.HavingAudio = temPage.elements.some(item => item.type === "audio") ? 1 : 0;
            params.HavingVideo = temPage.elements.some(item => item.type === "video") ? 1 : 0;
            item.AcademicPresupposition = temPage.remark || "";
            item.DesignIntent = temPage.design || "";

            if (temPage.type === "element") {
                item.Json = JSON.stringify(temPage);
            }
            if (temPage.type === "listen") {
                const words = temPage.listenWords?.map((word: any, index: number) => {
                    return {
                        sort: index + 1,
                        WordID: word.id,
                        PageWordID: word.pageWordID ? null : word.pageWordID,
                        WordInterval: 2
                    };
                });
                item.Json = JSON.stringify(words);
            }
            if (temPage.type === "follow") {
                item.Json = temPage.follow?.id || "";
            }
            if (temPage.type === "teach") {
                item.Json = temPage.teach?.id || "";
            }
            if (temPage.type === "game") {
                item.Json = temPage.game?.id || "";
            }
        }

        const res = await saveTemplate({ ...params, PageData: list });

        if (res.resultCode !== 200) return;
        ElMessage.success("保存成功，请前往「我的」查看已保存模板");
        nextTick(() => {
            materialCenterRef.value.queryTemplateList();
        });
    };

    // 同步教案设计
    const syncLesson = (windowCards: CardProps[], slides: { id: string, AcademicPresupposition: string, DesignIntent: string }[]) => {
        const winCards = cloneDeep<CardProps[]>(windowCards);

        for (let i = 0; i < winCards.length; i++) {
            const item = winCards[i];

            for (let j = 0; j < item.PageList.length; j++) {
                const page = item.PageList[j];
                const find = slides.find(it => it.id === page.ID);
                if (!find) continue;

                page.Json.remark = find.AcademicPresupposition || "";
                page.Json.design = find.DesignIntent || "";
            }
        }
        return winCards;
    };

    const insertTemplateOrMaterial = async (data: MaterialProp, page: PageProps) => {
        if (data.type === "page") {
            const list = data.data as PageProps[];
            for (let i = 0; i < list.length; i++) {
                const item = list[i];
                const id = uuidv4();
                item.ID = id;
                item.TeachPageRelationID = "";
                item.Json.id = id;
            }

            // 插入成功后调用一下增加次数的接口
            addTeachPageTemplateLinkCount({
                TeacherID: "",
                TeachPageTemplateID: data.teachPageTemplateID || ""
            });
            nextTick(() => {
                materialCenterRef.value.addLinkCount(data.teachPageTemplateID);
            });
            return list;
        }
        if (data.type === "elements") {
            if ([pageType.game, pageType.teach, pageType.listen, pageType.follow].includes(page.Type)) {
                ElMessage.warning("当前页无法添加素材，请先切换到素材页哦！");
                return;
            }
            if (!(page.Json.elements instanceof Array)) {
                page.Json.elements = [];
            }
            const obj = data.data;
            if ([0, 2, 3].includes(obj.Type)) {
                const element = await getImageData(obj);
                page.Json.elements.push(element);
            }
            if (obj.Type === 4) {
                const file = obj.Files?.length ? obj.Files.find((item: any) => item.Type === 0) : null;
                if (!file) return;

                const element = JSON.parse(file.Json);
                element.offSetElements.forEach((item: any) => (item.id = uuidv4()));

                page.Json.elements.push(...element.offSetElements);
            }

            if ([5, 6].includes(obj.Type)) {
                const element = getAudioVideoData(obj, obj.Type === 5 ? "video" : "audio");
                page.Json.elements.push(element);
            }
            AddSourceMaterialCall({
                UserID: obj.TeacherID,
                SourceMaterialMainID: obj.Id,
                PageID: page.ID
            });

            return page;
        }
    };

    const insertTool = async (data: any) => {
        const id = uuidv4();
        const json = await transformPageDetail({ Type: pageType.teach }, {
            TeachPageID: id,
            TeachingMiniToolID: data.ID,
            ToolFileModel: {
                ID: data.ID,
                Name: data.Name,
                File: data.File,
                Url: data.Url
            }
        });
        return {
            ID: id,
            TeachPageRelationID: "",
            Name: "教具页",
            Height: 0,
            Width: 0,
            Type: pageType.teach,
            Sort: 0,
            State: 1,
            AcademicPresupposition: "",
            DesignIntent: "",
            Index: 0,
            Url: data.url,
            ParentID: "",
            Json: json
        };
    };

    const VIEWPORT_RATIO = 0.5625;
    const VIEWPORT_SIZE = 1280;

    function getImageData(data: any) {
        return new Promise(resolve => {
            getImageSize(data.url).then(({ width, height }) => {
                const scale = height / width;
                if (scale < VIEWPORT_RATIO && width > VIEWPORT_SIZE) {
                    width = VIEWPORT_SIZE;
                    height = width * scale;
                } else if (height > VIEWPORT_SIZE * VIEWPORT_RATIO) {
                    height = VIEWPORT_SIZE * VIEWPORT_RATIO;
                    width = height / scale;
                }

                const file = data.Files?.length ? data.Files.find((item: any) => item.Type === 0) : data.SourceMaterialMainID ? data : null;

                if (!file) return resolve(null);

                return resolve({
                    id: uuidv4(),
                    fixedRatio: true,
                    name: data.name,
                    rotate: 0,
                    src: `${file.FilePath}/${file.FileMD5}.${file.FileExtention}`,
                    stretch: 1,
                    eft: (VIEWPORT_SIZE - width) / 2,
                    top: (VIEWPORT_SIZE * VIEWPORT_RATIO - height) / 2,
                    type: "image",
                    width,
                    height
                });
            });
        });
    }

    function getAudioVideoData(data: any, type: "video" | "audio") {
        const file = data.Files?.length ? data.Files.find((item: any) => item.Type === 1) : null;
        const width = data.showType === 0 ? 500 : 100;
        const height = data.showType === 0 ? 300 : 100;

        return {
            name: data.Name,
            type: type,
            id: uuidv4(),
            width,
            height,
            rotate: 0,
            left: (VIEWPORT_SIZE - width) / 2,
            top: (VIEWPORT_SIZE * VIEWPORT_RATIO - height) / 2,
            src: `${file.FilePath}/${file.FileMD5}.${file.FileExtention}`,
            showType: data.showType,
            clip: data.clip ? data.clip : undefined
        };
    }

    return {
        pager,
        selectPageData,
        dialogVisibleTemplate,
        showTemplateType,
        classroomLinkList,
        templateList,
        allPageListMap,
        materialList,
        dialogStatus,
        templateFormData,
        categoryData,
        adviceCollection,
        myAssemblyList,
        isLoading,
        toolList,
        handleSelectPages,
        queryClassroomLinkList,
        queryWindowsTemplateList,
        queryMyTemplateLis,
        deleteTemplate,
        editTemplate,
        updateTemplateStatus,
        updateTemplateSort,
        reorderTemplate,
        getSourceMaterials,
        formateOssUrl,
        queryCategoryByMaterialType,
        getAdviceCollection,
        deleteSourceAssembly,
        getSourceAssemblyList,
        queryToolList,
        saveWindowTemplate,
        materialCenterRef,
        syncLesson,
        insertTemplateOrMaterial,
        insertTool
    };
};
