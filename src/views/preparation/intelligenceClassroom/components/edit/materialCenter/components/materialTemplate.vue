<template>
    <div style="height: 100%; width: 100%" v-loading="isLoading">
        <el-input
            v-model="serchForm.QueryText"
            @input="nameInput"
            placeholder="输入关键字搜索"
            :prefix-icon="Search"
        />
        <div
            class="materialtemplate"
            v-if="templateList.length"
            v-infinite-scroll="loadMore"
            style="overflow: auto"
            :infinite-scroll-disabled="disabled"
            infinite-scroll-distance="1"
            :infinite-scroll-immediate="false"
            ref="templateScollRef"
        >
            <draggable
                :list="templateList"
                ghost-class="ghost"
                chosen-class="chosenClass"
                animation="300"
                @start="onStart"
                @end="onEnd"
                handle=".draggimg"
                touchStartThreshold="10px"
            >
                <!-- <div class="row" v-for="(row, i) in (templateList as any)" :key="i"> -->
                <template #item="{ element }">
                    <div
                        class="row item"
                        v-if="element.TeachPageTemplate?.length"
                    >
                        <div>
                            <div v-if="!isAllList" class="row-header">
                                <div class="title-icon">
                                    <img
                                        class="draggimg"
                                        src="@/assets/images/material/icon_td.png"
                                        alt=""
                                    />
                                    <span class="title">{{
                                        element.Name
                                    }}</span>
                                </div>
                                <span
                                    v-if="element.TeachPageTemplateCount > 2"
                                    class="icon-box"
                                    @click="getAllList(element.ID)"
                                    >更多<el-icon><ArrowRight /></el-icon
                                ></span>
                            </div>
                            <div v-else class="row-header">
                                <span
                                    @click="goBackAllList"
                                    class="title back-text"
                                    ><el-icon><ArrowLeft /></el-icon
                                    >{{ element.Name }}</span
                                >
                            </div>
                        </div>
                        <div class="row-content">
                            <div
                                v-for="(item, i) in element.TeachPageTemplate"
                                :key="i"
                                @click="handleView(item)"
                            >
                                <div class="jpzy-bg">
                                    <img
                                        class="jpzy"
                                        src="@/assets/images/material/icon_jpzy.png"
                                        alt=""
                                    />
                                </div>
                                <!-- <div class="cardname" v-if="item.CardData[0]?.PageList[0]?.Name">
                  {{ item.CardData[0]?.PageList[0]?.Name }}
                </div> -->
                                <div
                                    class="status"
                                    :style="{
                                        background:
                                            item.Status === 1
                                                ? '#5CD494'
                                                : '#90949E',
                                    }"
                                ></div>
                                <!-- 游戏页或者教具页 显示大图 -->
                                <el-tooltip
                                    :disabled="
                                        item.CardData[0]?.PageList[0]?.Name
                                            ? false
                                            : true
                                    "
                                    :content="
                                        item.CardData[0]?.PageList[0]?.Name
                                    "
                                    placement="bottom"
                                    effect="dark"
                                >
                                    <el-image
                                        v-if="
                                            item.CardData[0]?.PageList[0]
                                                ?.Type === 20 ||
                                            item.CardData[0]?.PageList[0]
                                                ?.Type === 16
                                        "
                                        :src="
                                            item.CardData[0]?.PageList[0]?.url
                                        "
                                        fit="cover"
                                    >
                                        <template #error>
                                            <div class="image-slot">
                                                加载失败...
                                            </div>
                                        </template>
                                    </el-image>
                                    <!-- 其它页显示源资源 -->
                                    <ThumbnailSlide
                                        v-else
                                        :slide="
                                            allPageListMap.get(
                                                item.CardData[0]?.PageList[0]
                                                    ?.ID
                                            ) || {}
                                        "
                                        :size="225"
                                    ></ThumbnailSlide>
                                </el-tooltip>

                                <div class="info flex-between-center">
                                    <span class="text">{{ item.Name }}</span>
                                    <span class="page"
                                        >{{ item.PageCount }}页</span
                                    >
                                    <el-popover
                                        placement="right-start"
                                        :width="24"
                                        trigger="hover"
                                        style="text-align: left"
                                    >
                                        <template #reference>
                                            <el-button size="small" @click.stop>
                                                <el-icon :size="18"
                                                    ><more-filled
                                                /></el-icon>
                                            </el-button>
                                        </template>
                                        <div
                                            class="operation-box-temp"
                                            style="text-align: center"
                                        >
                                            <!-- <div v-show="node.level === 1" @click.stop="handleView(data.PageList, 'first')">预览</div> -->
                                            <div
                                                class="operation-item"
                                                @click.stop="
                                                    handleUpdateTemplateSort(
                                                        element.ID,
                                                        item.TeachPageTemplateID,
                                                        item.TeachPageClassroomLinkID
                                                    )
                                                "
                                            >
                                                置于最前
                                            </div>
                                            <!-- <div class="operation-item" @click.stop="editTemplate(item)">编辑</div> -->
                                            <div
                                                class="operation-item"
                                                @click.stop=""
                                            >
                                                上架
                                                <el-switch
                                                    style="margin-left: 20px"
                                                    @change="
                                                        changeStatus(
                                                            element.ID,
                                                            item.TeachPageTemplateID,
                                                            item.Status
                                                        )
                                                    "
                                                    :active-value="1"
                                                    :inactive-value="0"
                                                    v-model="item.Status"
                                                    size="small"
                                                />
                                            </div>
                                            <div
                                                class="operation-item"
                                                @click.stop="handleDel(item)"
                                            >
                                                删除
                                            </div>
                                        </div>
                                    </el-popover>
                                </div>
                                <div class="footer">
                                    <span>已引用 {{ item.LinkCount }}次</span>
                                    <div>
                                        <img
                                            v-if="item.HavingVideo"
                                            src="@/assets/images/material/icon_sp.png"
                                            alt=""
                                        />
                                        <img
                                            v-if="item.HavingAudio"
                                            src="@/assets/images/material/icon_yp.png"
                                            alt=""
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>

                <!-- </div> -->
            </draggable>
            <p
                v-if="!noMore"
                class="loadmore"
                style="color: #409eff"
                @click="loadMore"
            >
                {{ loading ? "加载中..." : "加载更多" }}
            </p>
            <p v-if="noMore" class="nomore">没有更多了</p>
        </div>
        <div v-else>
            <el-empty
                :image="require('@/assets/images/material/pic_nothing_big.png')"
                description="这里空空如也..."
            />
        </div>
    </div>

    <template-view
        v-if="visibleView"
        v-model:dialogVisible="visibleView"
        @insertData="insertData"
        :currentSelectTemplate="currentSelectTemplate"
        :allPageListMap="allPageListMap"
    ></template-view>
</template>

<script lang="ts">
import {
    defineComponent,
    reactive,
    ref,
    toRefs,
    computed,
    onMounted,
    watch,
    nextTick,
} from "vue";
import { Search } from "@element-plus/icons-vue";
import TemplateView from "./templateView.vue";
import { ITemplateSave } from "@/types/home";
import { IRecordSort } from "@/types/material";
import useSaveTemplate from "@/views/preparation/intelligenceClassroom/edit/hooks/useSaveTemplate";
import { ElMessage, ElMessageBox } from "element-plus";
import { debounce } from "@/utils/common";

import draggable from "vuedraggable";

export default defineComponent({
    components: { TemplateView, draggable },
    emits: ["insertData", "editTemplate"],
    props: {
        subjectID: {
            type: String,
            required: true,
        },
        lessonId: {
            type: String,
            required: true,
        },
    },
    setup(props, { emit }) {
        const {
            queryWindowsTemplateList,
            templateList,
            allPageListMap,
            pager,
            deleteTemplate,
            updateTemplateStatus,
            updateTemplateSort,
            reorderTemplate,
            isLoading,
        } = useSaveTemplate();
        const noMore = computed(() => pager.value.IsLastPage); //不在显示更多
        const templateScollRef = ref(); //滚动区域
        const state = reactive({
            visibleView: false,
            searchName: "",
            serchForm: {
                QueryText: "",
                SubjectID: props.subjectID,
                TeachPageClassroomLinkID: "",
                LessonID: props.lessonId,
                Pager: {
                    PageNumber: 1,
                    PageSize: 10,
                    SortField: "",
                    SortType: "",
                    Total: 0,
                },
            },
            isAllList: false,
            currentSelectTemplate: [],
            disabled: false, //是否终止滚动加载
            loading: false,
            //   templateList: [
            //     //模板数据
            //     {
            //       label: '课堂引入',
            //       list: [{ num: 1 }, { num: 2 }]
            //     },
            //     {
            //       label: '课文赏析',
            //       list: [{ num: 1 }, { num: 2 }]
            //     },
            //     {
            //       label: '课文赏析',
            //       list: [{ num: 1 }, { num: 2 }]
            //     }
            //   ]
        });
        watch(
            () => templateList.value,
            (val: any) => {
                if (
                    val.length &&
                    val[0].TeachPageTemplate.length === 0 &&
                    state.serchForm?.TeachPageClassroomLinkID
                ) {
                    goBackAllList();
                }
            },
            { deep: true }
        );
        //滚动加载更多
        const loadMore = () => {
            state.loading = true;
            if (pager.value.IsLastPage) {
                state.loading = false;
                return;
            }
            setTimeout(async () => {
                state.serchForm.Pager.PageNumber += 1;
                await queryTemplateList(1);
                state.loading = false;
            }, 1000);
        };
        //关键词搜索
        const nameInput = () => {
            debounce(querySaveTemplateList, 600);
        };
        //查询模板列表
        const queryTemplateList = async (type?: number) => {
            await queryWindowsTemplateList(state.serchForm, type);
        };
        //保存、操作之后 后查询模板列表 ，页码为1
        const querySaveTemplateList = async () => {
            state.serchForm.Pager.PageNumber = 1;
            await queryTemplateList();
        };
        //处理窗卡页显示数据
        const formatSlide = (data: any) => {};
        watch(
            () => props.subjectID,
            async (curVal) => {
                // console.log('curVal', curVal);
                state.serchForm.SubjectID = curVal;
                await queryTemplateList();
            },
            { deep: true, immediate: true }
        );
        watch(
            () => props.lessonId,
            async (curVal) => {
                // console.log('curVal', curVal);
                state.serchForm.LessonID = curVal;
                await queryTemplateList();
            },
            { deep: true }
        );

        //查询当前选择的课堂环节的更多
        const getAllList = async (id: string) => {
            state.serchForm.TeachPageClassroomLinkID = id || "";
            await querySaveTemplateList();
            templateScollRef.value.scrollTop = 0; //滚动条归零
            state.isAllList = true;
        };

        //返回模板列表
        const goBackAllList = async () => {
            state.serchForm.TeachPageClassroomLinkID = "";
            await querySaveTemplateList();
            state.isAllList = false;
        };
        //修改上下架状态
        const changeStatus = async (
            elid: string,
            id: string,
            status: number
        ) => {
            const params: any = {
                TeachPageTemplateID: id || "",
                Status: status,
            };
            const res: any = await updateTemplateStatus(params);
            if (res) {
                //本地数据将模板置于最前
                templateList.value.forEach((item: any) => {
                    if (item.ID === elid && item.TeachPageTemplate.length) {
                        item.TeachPageTemplate.forEach(
                            (page: any, pindex: number) => {
                                if (page.TeachPageTemplateID === id) {
                                    page.Status = status;
                                }
                            }
                        );
                    }
                });
                // querySaveTemplateList();
            }
        };
        //模板置于最前
        const handleUpdateTemplateSort = async (
            elid: string,
            id: string,
            linkId: string
        ) => {
            const params: any = {
                TeachPageTemplateID: id || "",
                TeachPageClassroomLinkID: linkId || "",
            };
            const res: any = await updateTemplateSort(params);
            if (res) {
                //本地数据将模板置于最前
                templateList.value.forEach((item: any) => {
                    if (item.ID === elid && item.TeachPageTemplate.length) {
                        item.TeachPageTemplate.map(
                            (page: any, pindex: number) => {
                                if (page.TeachPageTemplateID === id) {
                                    item.TeachPageTemplate.unshift(
                                        item.TeachPageTemplate.splice(
                                            pindex,
                                            1
                                        )[0]
                                    );
                                }
                            }
                        );
                    }
                });
                // querySaveTemplateList();
            }
        };

        //点击某一个模板打开预览
        const handleView = (item: any) => {
            state.visibleView = true;
            state.currentSelectTemplate = item;
        };

        //编辑模板（去掉了暂时。。。）
        const editTemplate = (item: any) => {
            // console.log('编辑模板', item);
            emit("editTemplate", item);
        };
        //往左侧页插入一条模板
        const insertData = (obj: ITemplateSave) => {
            emit("insertData", obj);
        };
        //拖拽开始的事件
        const onStart = () => {
            // console.log('开始拖拽');
        };

        //拖拽结束的事件
        const onEnd = () => {
            //静态排序，拖拽完成后重新个模板列表排序
            templateList.value.forEach((item: any, index: number) => {
                item.Sort = index;
            });
            //拖拽完成后重新排序-过滤出 接口传递的参数
            const endTemplateList: any = templateList.value.map(
                (item: any, index: number) => {
                    return {
                        Sort: index,
                        ID: item.ID,
                    };
                }
            );
            //排序接口参数
            const params: IRecordSort = {
                TeacherID: "",
                Detail: endTemplateList,
            };
            //课堂环节拖拽完成排序
            reorderTemplate(params);
        };

        //删除
        const handleDel = (item: any) => {
            ElMessageBox.confirm("确定要删除当前选择的模板吗？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(async () => {
                    const params: any = {
                        TeacherID: "",
                        ID: item.TeachPageTemplateID || "",
                    };
                    const res: any = await deleteTemplate(params);
                    if (res) {
                        await querySaveTemplateList();
                    }
                })
                .catch(() => {});
        };
        //静态使用次数 加1
        const addLinkCount = (id: string) => {
            templateList.value.forEach((item: any, index: number) => {
                item.TeachPageTemplate.forEach((page: any, pindex: number) => {
                    if (page.TeachPageTemplateID === id) {
                        page.LinkCount += 1;
                    }
                });
            });
        };

        return {
            Search,
            ...toRefs(state),
            templateList,
            allPageListMap,
            pager,
            noMore,
            isLoading,
            templateScollRef,
            getAllList,
            goBackAllList,
            handleView,
            insertData,
            handleDel,
            formatSlide,
            queryTemplateList,
            editTemplate,
            changeStatus,
            handleUpdateTemplateSort,
            onEnd,
            onStart,
            nameInput,
            loadMore,
            querySaveTemplateList,
            addLinkCount,
        };
    },
});
</script>

<style scoped lang="scss">
.chosenClass {
    background-color: #eee;
    opacity: 1;
    padding: 2px;
}
.materialtemplate {
    height: calc(100% - 50px);
    margin-top: 10px;
    .row {
        .row-header {
            display: flex;
            justify-content: space-between;
            font-size: 14px;
            color: #90949e;
            margin: 24px 0 0px;
            .title-icon {
                display: flex;
                img {
                    cursor: pointer;
                    padding-right: 5px;
                }
            }
            .title {
                display: flex;
                align-items: center;
                font-size: 16px;
                font-weight: 600;
                color: #212121;
            }
            .icon-box {
                display: flex;
                align-items: center;
                cursor: pointer;
            }
            .back-text {
                cursor: pointer;
            }
        }
        .row-content {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            margin-top: 20px;
            > div {
                position: relative;
                width: 49%;
                box-shadow: 0px 3px 7px 0px rgba(0, 0, 0, 0.1);
                border-radius: 4px;
                cursor: pointer;
                margin-bottom: 16px;
                .jpzy-bg {
                    width: 36px;
                    height: 34px;
                    background: rgba(255, 255, 255, 0.6);
                    border-radius: 4px;
                    backdrop-filter: blur(5px);
                    position: absolute;
                    left: 4px;
                    top: 4px;
                    z-index: 2;
                    .jpzy {
                    }
                }

                .status {
                    position: absolute;
                    right: 8px;
                    top: 8px;
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    z-index: 2;
                }
                .cardname {
                    font-size: 12px;
                    color: #409eff;
                    position: absolute;
                    right: 5px;
                    top: 5px;
                    z-index: 2;
                    padding: 5px;
                    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
                }
                .info {
                    margin: 10px;
                    .text {
                        flex: 1;
                        margin-right: 6px;
                        font-size: 16px;
                        color: #212121;
                        overflow: hidden; /* 超出一行文字自动隐藏 */
                        text-overflow: ellipsis; /* 文字隐藏后添加省略号 */
                        white-space: nowrap; /* 强制文本不换行 */
                    }
                    .page {
                        background-color: rgba(0, 0, 0, 0.2);
                        color: #fff;
                        padding: 2px 4px;
                        border-radius: 4px;
                    }
                    .el-button {
                        border: none;
                        transform: rotate(90deg);
                        padding: 6px;
                    }
                    .operation-box {
                        text-align: left;
                        .operation-item {
                            cursor: pointer;
                            padding: 10px 0;
                            border-bottom: 1px solid #e1e1e1;
                        }
                        .operation-item:hover {
                            color: #4a90ff;
                        }
                    }
                }
                :deep(.el-image) {
                    height: 126px;
                    width: 100%;
                    .image-slot {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        width: 100%;
                        height: 100%;
                        background: var(--el-fill-color-light);
                        color: var(--el-text-color-secondary);
                        font-size: 20px;
                    }
                }

                .footer {
                    display: flex;
                    justify-content: space-between;
                    font-size: 12px;
                    color: #90949e;
                    margin: 0 10px 10px;
                    img {
                        width: 16px;
                        height: 16px;
                        &:first-child {
                            margin-right: 10px;
                        }
                    }
                }
            }
        }
    }

    .nomore,
    .loadmore {
        margin-top: 10px;
        text-align: center;
        margin-bottom: 40px;
        font-size: 12px;
    }
    .loadmore {
        cursor: pointer;
    }
}
</style>
<style lang="scss">
.operation-box-temp {
    text-align: left;
    .operation-item {
        cursor: pointer;
        padding: 10px 0;
        border-bottom: 1px solid #e1e1e1;
    }
    .operation-item:hover {
        color: #4a90ff;
    }
}
</style>
