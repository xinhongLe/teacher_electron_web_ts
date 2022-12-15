import { reactive, ref, toRefs, watch } from "vue";
import { IPageValue } from "@/types/home";
import {
    saveTemplate,
    getClassroomLinkList,
    getWindowsTemplateList,
    getMyWindowsTemplateList,
    deleteWindowsTemplateList,
    updateWindowsTemplateStatus,
    updateWindowsTemplateSort,
    reorderWindowsTemplate,
    GetSourceMaterials,
    GetCategoryByMaterialType,
    GetAdviceCollection,
    DeleteSourceAssembly,
    GetSourceAssemblyList,
} from "@/api/material";
import { getToolList } from "@/api/index";
import {
    ISaveTemplate,
    IClassRoom,
    IGetList,
    IGetMyList,
    IDelTem,
    IUpdateStatus,
    IUpdateSort,
    IRecordSort,
    IMaterialParams,
    ICategory,
    IAdviceCol,
    IDAssembly,
    IGAssembly,
} from "@/types/material";
import { ElMessage } from "element-plus";
import useHome from "@/hooks/useHome";
import { Slide } from "wincard";
import { getOssUrl } from "@/utils/oss";
export default (pageListMap?: any) => {
    const { transformPageDetail } = useHome();
    const selectPageData = ref<any[]>([]);
    const dialogVisibleTemplate = ref(false);
    const showTemplateType = ref(1);
    const classroomLinkList = ref<any>([]); //课堂环节
    const templateList = ref([]); //模板列表
    const dialogStatus = ref("add"); //是保存还是编辑
    const templateFormData = ref({}); //编辑时候回显用的表单
    const materialList = ref<any>([]); //素材列表
    const categoryData = ref([]); //一级标签列表
    const adviceCollection = ref([]); //推荐合集
    const toolList = ref([]); //工具列表
    const pager = ref({
        PageNumber: 1,
        PageSize: 10,
        SortField: "",
        SortType: "",
        Total: 0,
        IsFirstPage: true,
        IsLastPage: true,
    });
    const isLoading = ref(false);
    // const state = reactive({
    //   allPageListMap: new Map() as Map<string, Slide>
    // });
    const allPageListMap = ref(new Map() as Map<string, Slide>);
    const myAssemblyList = ref([]); //我的组件列表
    //单独右击选择的页信息
    const currentRightPage = ref<any>();
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
    //打开保存模板表单弹框
    const handleSaveTemplate = (type: number) => {
        if (!selectPageData.value.length) {
            handleSelectPages(currentRightPage.value);
        }
        dialogStatus.value = "add";
        templateFormData.value = {};
        showTemplateType.value = type;
        dialogVisibleTemplate.value = true;
    };
    //打开编辑模板弹框
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
            HavingVideo: data.HavingVideo,
        };
        dialogVisibleTemplate.value = true;
    };
    //保存模板
    const saveTemplateFrom = async (data: any) => {
        const temData: any = Object.assign({}, data);
        temData.TeachPageClassroomLink =
            typeof temData.TeachPageClassroomLink === "string"
                ? JSON.parse(temData.TeachPageClassroomLink)
                : temData.TeachPageClassroomLink;
        // console.log(dialogStatus.value, temData);
        // return;
        const PageData: any = selectPageData.value;
        PageData.forEach((item: any) => {
            if (item.ID) {
                // console.log("pageListMap=====>", pageListMap.value);

                const temPage = pageListMap.value.get(item.ID) || null;
                console.log("temPage=====>", temPage);

                temData.HavingAudio = temPage.elements.some(
                    (el: any) => el.type == "audio"
                )
                    ? 1
                    : 0;
                temData.HavingVideo = temPage.elements.some(
                    (el: any) => el.type == "video"
                )
                    ? 1
                    : 0;
                item.AcademicPresupposition = temPage.remark;
                item.DesignIntent = temPage.design;
                console.log("temPage", temPage);
                if (temPage) {
                    //给当前页 做判断 slide 类型
                    switch (temPage.type) {
                        case "element": //普通元素页面
                            item.Json = JSON.stringify(temPage);
                            break;
                        case "listen":
                            const Words = temPage.listenWords?.map(
                                (word: any, index: number) => {
                                    return {
                                        sort: index + 1,
                                        WordID: word.id,
                                        PageWordID: word.pageWordID
                                            ? null
                                            : word.pageWordID,
                                        WordInterval: 2,
                                    };
                                }
                            );
                            item.Json = JSON.stringify(Words);
                            break;
                        case "follow":
                            item.Json = temPage.follow?.id || "";
                            break;
                        case "teach":
                            item.Json = temPage.teach?.id || "";
                            break;
                        case "game": //游戏页
                            item.Json = temPage.game?.id || "";
                            break;
                        default:
                            item.Json = "";
                            break;
                    }
                }
            }
        });

        const params: ISaveTemplate = {
            ...temData,
            PageData,
        };
        const res: any = await saveTemplate(params);
        if (res.resultCode === 200) {
            ElMessage({ type: "success", message: "保存模板成功！" });
            selectPageData.value = [];
            return true;
        }
    };
    //根据科目获取课堂环节
    const queryClassroomLinkList = async (data: IClassRoom) => {
        const res: any = await getClassroomLinkList(data);
        if (res.resultCode === 200) {
            classroomLinkList.value = res.result;
        } else {
            classroomLinkList.value = [];
        }
    };

    //窗卡页 右键-menu菜单
    const contextmenus = (el: any, data: any) => {
        currentRightPage.value = data;
        return [
            {
                text: "保存模板",
                subText: "",
                handler: () => handleSaveTemplate(1),
            },
            // {
            //     text: "保存题目",
            //     subText: "",
            //     handler: () => handleSaveTemplate(2)
            // }
        ];
    };
    const formataSlideMap = async (arr: any, mapList: any) => {
        arr.forEach((item: any) => {
            item.TeachPageTemplate.forEach((item2: any) => {
                item2.CardData[0]?.PageList.forEach(
                    async (page: IPageValue) => {
                        if (page) {
                            page.Json =
                                page.Json && typeof page.Json === "string"
                                    ? JSON.parse(page.Json)
                                    : page.Json;
                            const newSlide: Slide = await transformPageDetail(
                                page,
                                page.Json
                            );
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
    //获取模板列表
    const queryWindowsTemplateList = async (
        data: IGetList,
        type: number = 0
    ) => {
        isLoading.value = true;
        const res: any = await getWindowsTemplateList(data);
        if (res.resultCode === 200) {
            pager.value = res.result.pager;
            const temdata = res.result.list;
            await formataSlideMap(temdata, allPageListMap.value);
            setTimeout(() => {
                if (type) {
                    //如果是滚动加载列表时，拼接返回来的数据
                    const concatData: any = templateList.value.concat(temdata);
                    if (
                        concatData.length &&
                        concatData[0].ID === concatData[1]?.ID
                    ) {
                        //如果是课堂环节内页里-只拼接模板数据
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
    //获取我的窗卡页模板列表
    const queryMyTemplateLis = async (data: IGetMyList, type: number = 0) => {
        isLoading.value = true;
        const res: any = await getMyWindowsTemplateList(data);
        if (res && res.resultCode === 200) {
            pager.value = res.result.pager;
            const temdata = res.result.list;
            await formataSlideMap(temdata, allPageListMap.value);
            setTimeout(() => {
                if (type) {
                    const concatData: any = templateList.value.concat(temdata);
                    templateList.value = concatData;
                } else {
                    templateList.value = temdata;
                }
                isLoading.value = false;
            }, 100);
            return true;
        } else {
            return false;
            isLoading.value = false;
        }
    };

    //删除窗卡页模板
    const deleteTemplate = async (data: IDelTem) => {
        const res: any = await deleteWindowsTemplateList(data);
        if (res.resultCode === 200) {
            ElMessage.success("删除成功");
            return true;
        }
    };

    //上下架模板
    const updateTemplateStatus = async (data: IUpdateStatus) => {
        const res: any = await updateWindowsTemplateStatus(data);
        if (res.resultCode === 200) {
            ElMessage.success(data.Status == 1 ? "上架成功" : "下架成功");
            return true;
        }
    };
    //模板置于最前
    const updateTemplateSort = async (data: IUpdateSort) => {
        const res: any = await updateWindowsTemplateSort(data);
        if (res.resultCode === 200) {
            return true;
        }
    };
    //拖拽课堂环节进行排序
    const reorderTemplate = async (data: IRecordSort) => {
        const res: any = await reorderWindowsTemplate(data);
        if (res.resultCode === 200) {
            return true;
        }
    };
    //查询素材库列表
    const getSourceMaterials = async (
        data: IMaterialParams,
        type: number = 0
    ) => {
        isLoading.value = true;
        const res: any = await GetSourceMaterials(data);
        isLoading.value = false;
        if (res.resultCode === 200 && res.result?.length) {
            if (type) {
                materialList.value.forEach((item: any) => {
                    res.result.forEach(async (re: any) => {
                        item.CollectionPager = re.CollectionPager;
                        item.Materials = item.Materials.concat(re.Materials);
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
                console.log(materialList.value);
            }
        } else {
            materialList.value = [];
        }
    };
    //过滤文件
    const formatMaterial = async (item: any) => {
        item.Materials?.forEach((item2: any) => {
            item2.Files?.forEach(async (item3: any) => {
                if (item3.Type == 0) {
                    //图片附件的
                    item2.url = await formateOssUrl(item3);
                } else {
                    //音频视频 源文件的
                    item2.url2 = await formateOssUrl(item3);
                }
            });
        });
        //下面是合集
        item.Collections?.forEach(async (item2: any) => {
            item2.url = await formateOssUrl(item2.Files[0]);
            item2.Files?.forEach(async (item3: any) => {
                //图片附件的
                item3.url = await formateOssUrl(item3);
            });
        });
    };
    //获取其他推荐合集
    const getAdviceCollection = async (data: IAdviceCol) => {
        const res: any = await GetAdviceCollection(data);
        console.log(res);
        if (res.resultCode == 200) {
            adviceCollection.value = res.result;
            adviceCollection.value.forEach(async (item: any) => {
                item.url = await formateOssUrl(item.Files[0]);
                item.Files.forEach(async (item2: any) => {
                    //图片附件的
                    item2.url = await formateOssUrl(item2);
                });
            });
        }
    };
    // watch(
    //   () => materialList.value,
    //   val => {
    //     materialList.value.forEach((item: any) => {
    //       item.Materials.forEach(async (item2: any) => {
    //         item2.url = await formateOssUrl(item2.Files, ossHelper);
    //       });
    //     });
    //   }
    // );
    //oss渲染图片url回显
    const formateOssUrl = async (file: any) => {
        const key = `${file?.FilePath}/${file?.FileMD5}.${
            file?.FileExtention || file?.Extention
        }`;
        const fileurl = await getOssUrl(key, "axsfile");
        // const url = 'https://owa.lyx-edu.com/op/view.aspx?src=' + encodeURIComponent(urlImg.url);
        return fileurl;
    };

    //获取所有合集一级分类标签
    const queryCategoryByMaterialType = async (params: ICategory) => {
        const res: any = await GetCategoryByMaterialType(params);
        if (res.resultCode === 200) {
            categoryData.value = res.result;
            // console.log("categoryData", state.categoryData);
        }
    };

    //删除组件
    const deleteSourceAssembly = async (params: IDAssembly) => {
        const res: any = await DeleteSourceAssembly(params);
        if (res.resultCode === 200) {
            return true;
        }
    };

    //获取组件我的
    const getSourceAssemblyList = async (params: IGAssembly) => {
        const res: any = await GetSourceAssemblyList(params);
        if (res.resultCode === 200) {
            myAssemblyList.value = res.result;
        }
    };

    //查询教具列表
    const queryToolList = async (params: any) => {
        const res: any = await getToolList(params);
        if (res.resultCode === 200) {
            toolList.value = res.result;
            toolList.value.forEach(async (item: any) => {
                item.url = await formateOssUrl(item.File);
            });
        }
    };

    return {
        // ...toRefs(state),
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
        contextmenus,
        handleSaveTemplate,
        handleSelectPages,
        saveTemplateFrom,
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
    };
};
