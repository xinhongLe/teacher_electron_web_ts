<template>
    <div v-loading="isLoading">
        <div class="tab-class">
            <div
                @click="activeIndex = item.value"
                :class="[activeIndex === item.value ? 'active' : '']"
                v-for="item in tabList"
                :key="item.value"
            >
                {{ item.name }}
            </div>
        </div>
        <el-input
            v-model="serchForm.QueryText"
            @input="nameInput(activeIndex)"
            placeholder="输入关键字搜索"
            :prefix-icon="Search"
        />
        <div
            class="mymaterials"
            v-infinite-scroll="loadMore"
            :infinite-scroll-disabled="disabled"
            infinite-scroll-distance="1"
            :infinite-scroll-immediate="false"
        >
            <div
                v-if="activeIndex === 1 && myAssemblyList.length"
                class="row-element"
            >
                <div
                    v-for="(item, i) in (myAssemblyList as any)"
                    :key="i"
                    @click="insertMaterial(item)"
                    v-contextmenu="(el: any) => TContextmenus(el, item)"
                >
                    <!-- 需要winCard更新-->
                    <ThumbnailElements
                        :size="130"
                        :slide="formateElement(item.Files[0]) || {}"
                    ></ThumbnailElements>
                </div>
            </div>
            <div v-else-if="activeIndex === 2 && myTemplateList.length">
                <div class="row-content">
                    <div
                        v-for="(item, i) in myTemplateList"
                        :key="i"
                        @click="handleView(item)"
                    >
                        <!-- <div class="jpzy-bg">
                            <img
                                class="jpzy"
                                src="@/assets/images/material/icon_jpzy.png"
                                alt=""
                            />
                        </div> -->
                        <!-- <div class="cardname" v-if="item.CardData[0]?.PageList[0]?.Name">
                  {{ item.CardData[0]?.PageList[0]?.Name }}
                </div> -->
                        <!-- 游戏页或者教具页 显示大图 -->
                        <el-tooltip
                            :disabled="
                                item.CardData[0]?.PageList[0]?.Name
                                    ? false
                                    : true
                            "
                            :content="item.CardData[0]?.PageList[0]?.Name"
                            placement="bottom"
                            effect="dark"
                        >
                            <el-image
                                v-if="
                                    item.CardData[0]?.PageList[0]?.Type ===
                                        20 ||
                                    item.CardData[0]?.PageList[0]?.Type === 16
                                "
                                :src="item.CardData[0]?.PageList[0]?.url"
                                fit="cover"
                            >
                                <template #error>
                                    <div class="image-slot">加载失败...</div>
                                </template>
                            </el-image>
                            <!-- 其它页显示源资源 -->
                            <ThumbnailSlide
                                v-else
                                :slide="
                                    allPageListMap.get(
                                        item.CardData[0]?.PageList[0]?.ID
                                    ) || {}
                                "
                                :size="225"
                            ></ThumbnailSlide>
                        </el-tooltip>

                        <div class="info flex-between-center">
                            <span class="text">{{ item.Name }}</span>
                            <span class="page">{{ item.PageCount }}页</span>
                            <el-popover
                                placement="right-start"
                                :width="24"
                                trigger="hover"
                            >
                                <template #reference>
                                    <el-button size="small" @click.stop>
                                        <el-icon :size="18"
                                            ><more-filled
                                        /></el-icon>
                                    </el-button>
                                </template>
                                <div class="operation-box-temp">
                                    <!--<div v-show="node.level === 1" @click.stop=" handleView(data.PageList, 'first')">预览</div>-->
                                    <div
                                        class="operation-item"
                                        @click.stop="handleDel(item)"
                                        style="color: red"
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
                    :image="
                        require('@/assets/images/material/pic_nothing_big.png')
                    "
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
    </div>
</template>

<script lang="ts">
import {
    defineComponent,
    reactive,
    toRefs,
    onMounted,
    watch,
    computed,
    ref,
} from "vue";
// import { slides, elements } from '@/mocks/slides';
import { Search } from "@element-plus/icons-vue";
import { ITemplateSave } from "@/types/home";
import { debounce } from "@/utils/common";
import TemplateView from "./templateView.vue";
import useSaveElements from "../hooks/useSaveElements";
import useSaveTemplate from "@/views/preparation/intelligenceClassroom/edit/hooks/useSaveTemplate";
import { ElMessage, ElMessageBox } from "element-plus";
import { IGAssembly } from "@/types/material";
import { ActionTypes, store } from "@/store";
export default defineComponent({
    name: "myMaterial",
    components: { TemplateView },
    props: {
        subjectID: {
            type: String,
            required: true,
        },
    },
    emits: ["insertData"],
    setup(props, { emit }) {
        const TeacherID = computed(() => store.state.userInfo.id);
        const noMore = computed(() => pager.value.IsLastPage); //不在显示更多
        const state = reactive({
            visibleView: false,
            currentSelectTemplate: [],
            activeIndex: 1,
            loading: false,
            disabled: false, //是否终止滚动加载
            // slide: slides[0],
            tabList: [
                { name: "我的组件", value: 1 },
                { name: "我的模板", value: 2 },
            ],
            list: [{ num: 1 }, { num: 2 }, { num: 2 }],
            //列表携带参数
            serchForm: {
                QueryText: "", //关键词
                TeacherID: TeacherID.value, //在备教端取用户信息
                Pager: {
                    PageNumber: 1,
                    PageSize: 10,
                    SortField: "",
                    SortType: "",
                    Total: 0,
                },
            },
        });
        const {
            queryMyTemplateLis,
            templateList,
            allPageListMap,
            deleteTemplate,
            getSourceAssemblyList,
            myAssemblyList,
            pager,
            deleteSourceAssembly,
            isLoading,
        } = useSaveTemplate();
        const { parseElements } = useSaveElements();
        const myTemplateList: any = ref([]);
        // const arr = elements.map(item => {
        //   return parseElements(item);
        // });
        //监听模板列表
        watch(
            () => templateList.value,
            (curVal) => {
                myTemplateList.value = [];
                const data = curVal;
                data.forEach((item: any) => {
                    item.TeachPageTemplate?.forEach((page: any) => {
                        myTemplateList.value.push(page);
                    });
                });
            },
            { deep: true }
        );
        //查询我的组件
        const queryAssemblyList = () => {
            const params: IGAssembly = {
                SubjectID: props.subjectID,
                ...state.serchForm,
            };
            getSourceAssemblyList(params);
        };
        //监听是我的组件还是我的模板
        watch(
            () => state.activeIndex,
            async (curVal) => {
                if (curVal === 1) {
                    queryAssemblyList();
                } else {
                    await quertSaveMyTemplate();
                }
            },
            { deep: true, immediate: true }
        );
        //关键词搜索
        const nameInput = (type: number) => {
            if (type === 1) {
                debounce(queryAssemblyList, 600);
            } else {
                debounce(quertMyTemplate, 600);
            }
        };
        //删除我的模板
        const handleDel = (item: any) => {
            ElMessageBox.confirm("确定要删除当前选择的模板吗？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(async () => {
                    const params: any = {
                        TeacherID: TeacherID.value,
                        ID: item.TeachPageTemplateID || "",
                    };
                    const res: any = await deleteTemplate(params);
                    if (res) {
                        quertMyTemplate();
                    }
                })
                .catch(() => {});
        };
        //查询我的模板
        const quertMyTemplate = async (type?: number) => {
            return await queryMyTemplateLis(state.serchForm, type);
        };
        //保存后查询我的模板-页数变为1

        const quertSaveMyTemplate = async (type?: number) => {
            // state.serchForm.Pager.PageSize =
            //     state.serchForm.Pager.PageNumber *
            //     state.serchForm.Pager.PageSize;
            state.serchForm.Pager.PageNumber = 1;
            await quertMyTemplate();
        };
        //点击某一个模板打开预览
        const handleView = (item: any) => {
            state.visibleView = true;
            state.currentSelectTemplate = item;
        };
        const insertData = (obj: ITemplateSave) => {
            emit("insertData", obj);
        };
        //组件转换
        const formateElement = (item: any) => {
            if (item && item.Json) {
                return JSON.parse(item.Json);
            } else {
                return null;
            }
        };
        //滚动加载更多
        const loadMore = () => {
            state.loading = true;
            if (pager.value.IsLastPage) {
                state.loading = false;
                return;
            }
            setTimeout(async () => {
                state.serchForm.Pager.PageNumber += 1;
                const res = await quertMyTemplate(1);
                if (!res) {
                    state.serchForm.Pager.PageNumber = 1;
                }
                state.loading = false;
            }, 1000);
        };
        //删除标题框
        const handleDeleteTitle = async (data: any) => {
            console.log("dadadad", data);
            ElMessageBox.confirm("确定要删除当前选择的组件吗？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(async () => {
                    const res: any = await deleteSourceAssembly({
                        Id: data.Id,
                    });
                    if (res) {
                        console.log(myAssemblyList.value);
                        myAssemblyList.value.splice(
                            myAssemblyList.value.findIndex(
                                (item: any) => item.Id == data.Id
                            ),
                            1
                        );
                        // state.searchForm.Type = state.currentAllType;
                        // queryMaterialList();
                    }
                })
                .catch(() => {});
        };
        //标题框右击菜单
        const TContextmenus = (el: any, data: any) => {
            return [
                {
                    text: "删除",
                    subText: "",
                    handler: () => handleDeleteTitle(data),
                },
            ];
        };
        //点击插入素材至窗卡页中
        const insertMaterial = (data: any) => {
            data.Type = 4;
            emit("insertData", {
                data,
                type: "elements",
            });
        };
        //静态使用次数 加1
        const addLinkCount = (id: string) => {
            if (state.activeIndex === 2) {
                myTemplateList.value.forEach((page: any, index: number) => {
                    if (page.TeachPageTemplateID === id) {
                        page.LinkCount += 1;
                    }
                });
            }
        };
        // onMounted(() => {
        //   quertMyTemplate();
        // });
        return {
            Search,
            ...toRefs(state),
            queryMyTemplateLis,
            allPageListMap,
            myTemplateList,
            templateList,
            // arr,
            myAssemblyList,
            quertMyTemplate,
            handleDel,
            handleView,
            insertData,
            queryAssemblyList,
            formateElement,
            nameInput,
            TeacherID,
            loadMore,
            noMore,
            quertSaveMyTemplate,
            TContextmenus,
            handleDeleteTitle,
            insertMaterial,
            isLoading,
            addLinkCount,
        };
    },
});
</script>

<style scoped lang="scss">
.tab-class {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    > div {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 49%;
        height: 30px;
        background: #f6f7f8;
        border-radius: 4px;
        cursor: pointer;
        font-size: 15px;
    }
    .active {
        background: #2e95ff;
        color: #fff;
    }
}
.mymaterials {
    margin-top: 20px;
    height: calc(100% - 110px);
    overflow-y: auto;
    .row-element {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-wrap: wrap;
        > div {
            cursor: pointer;
            display: inline-block;
            margin: 20px 0px 20px 20px;
            box-shadow: 0px 3px 7px 0px rgba(0, 0, 0, 0.1);
            background: #f6f7f8;
            // padding: 10px;
        }
    }

    .row-content {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;

        > div {
            position: relative;
            width: 49%;
            box-shadow: 0px 3px 7px 0px rgba(0, 0, 0, 0.1);
            border-radius: 4px;
            cursor: pointer;
            margin-bottom: 15px;
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
                    font-size: 16px;
                }
                .el-button {
                    border: none;
                    transform: rotate(90deg);
                    padding: 6px;
                }
                .operation-box {
                    > div {
                        padding: 6px 0;
                        cursor: pointer;
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
