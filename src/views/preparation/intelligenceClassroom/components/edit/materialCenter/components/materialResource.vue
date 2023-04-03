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
            v-model="searchForm.Name"
            placeholder="输入关键字搜索"
            :prefix-icon="Search"
            @input="nameInput"
        />
        <div class="material-con">
            <div class="tag-data" v-if="isShowTag && !isColInner">
                <div class="tags">
                    <el-icon @click="clearTag"><Close /></el-icon>
                    <span
                        v-for="(item, index) in (categoryData as any)"
                        :key="index"
                    >
                        <!-- <el-link
            @click="
              clickClassTag(item.Id);
              currentClassIndex = item.Id;
            "
            :class="{
              isActive: item.Id == currentClassIndex
            }"
            >{{ item.Name }}
          </el-link> -->
                        <el-check-tag
                            :checked="item.Id == currentClassIndex"
                            @click="
                                clickClassTag(item.Id);
                                currentClassIndex = item.Id;
                            "
                            >{{ item.Name }}</el-check-tag
                        >
                        <!-- <span v-if="index !== categoryData.length - 1"> | </span> -->
                    </span>
                </div>
                <!-- <div v-if="secondLabelList.length" style="margin-top: 10px">
        <span v-for="(item, index) in (secondLabelList as any)" :key="index">
          <el-link
            @click="
              clickClassSecondTag(item);
              currentClassIndex = item.Id;
            "
            :class="{
              isActive: item.Id == currentClassIndex
            }"
            >{{ item.Name }}
          </el-link>
          <span v-if="index !== secondLabelList.length - 1"> | </span>
        </span>
      </div> -->
            </div>
            <div
                v-if="materialList.length"
                style="overflow: auto; margin-top: 20px; flex: 1"
                v-infinite-scroll="loadMore"
                :infinite-scroll-disabled="disabled"
                infinite-scroll-distance="1"
                :infinite-scroll-immediate="false"
                ref="templateScollRef"
            >
                <div>
                    <div
                        class="row"
                        v-for="(row, i) in (materialList as any)"
                        :key="i"
                        v-if="materialList.length"
                    >
                        <div v-if="row.Materials?.length">
                            <div v-if="!isAllList" class="row-header">
                                <span class="title">{{ row.Name }}</span>
                                <span
                                    v-if="row.Materials?.length > 2"
                                    class="icon-box"
                                    @click="getAllList(row)"
                                    >更多<el-icon><ArrowRight /></el-icon
                                ></span>
                            </div>
                            <div
                                v-else-if="isAllList && activeIndex == 0"
                                class="row-header"
                            >
                                <span
                                    @click="goBackAllList"
                                    class="title back-text"
                                    ><el-icon><ArrowLeft /></el-icon
                                    >{{ row.Name }}</span
                                >
                            </div>
                        </div>
                        <!-- 教具 -->
                        <div
                            class="row-content"
                            v-if="
                                row.Type === 1 &&
                                (activeIndex === 0 || activeIndex === 1)
                            "
                        >
                            <div
                                v-for="(item, i) in isAllList ? toolList : (toolList.slice(0, 3) as any)"
                                :key="i"
                                class="jiaoju"
                                @click="insertMaterial(item, row.Type)"
                            >
                                <el-image
                                    :draggable="false"
                                    v-if="item.url"
                                    :src="item.url"
                                    fit="cover"
                                />
                                <div class="title-text">{{ item.Name }}</div>
                            </div>
                        </div>
                        <!--照片-->
                        <div class="row-content" v-if="row.Type === 2">
                            <div
                                v-for="(item, i) in isAllList
                                    ? row.Materials
                                    : row.Materials.slice(0, 3)"
                                :key="i"
                                @click="insertMaterial(item)"
                            >
                                <el-tooltip
                                    placement="top"
                                    :content="item.Name"
                                    :disabled="item.Name ? false : true"
                                    effect="dark"
                                    :hide-after="0"
                                >
                                    <el-image
                                        :draggable="false"
                                        :src="item.url"
                                        fit="contain"
                                    />
                                </el-tooltip>
                            </div>
                        </div>
                        <!--插画-->
                        <p
                            v-if="
                                activeIndex === 3 &&
                                !isColInner &&
                                row.Type === 3
                            "
                            class="text-type"
                            @click="isOpen = !isOpen"
                        >
                            插画
                            <img
                                src="@/assets/images/material/icon_arrow_down.png"
                                alt=""
                                v-if="isOpen"
                            />
                            <img
                                src="@/assets/images/material/icon_arrow_up.png"
                                alt=""
                                v-else
                            />
                        </p>
                        <div
                            class="row-content"
                            v-if="row.Type === 3 && isOpen && !isColInner"
                            :style="
                                activeIndex == 0
                                    ? {}
                                    : { height: '30vh', overflow: 'auto' }
                            "
                        >
                            <!-- <div>插画</div> -->
                            <div
                                v-for="(item, i) in isAllList
                                    ? row.Materials
                                    : row.Materials.slice(0, 3)"
                                :key="i"
                                @click="insertMaterial(item)"
                            >
                                <el-tooltip
                                    placement="top"
                                    :content="item.Name"
                                    :disabled="item.Name ? false : true"
                                    effect="dark"
                                    :hide-after="0"
                                >
                                    <el-image
                                        :draggable="false"
                                        :src="item.url"
                                        fit="contain"
                                    />
                                </el-tooltip>
                            </div>
                        </div>
                        <!--插画-合集 ，点击可进入合集内页-->
                        <p
                            v-if="
                                activeIndex === 3 &&
                                !isColInner &&
                                row.Type === 3
                            "
                            class="text-type"
                            style="margin-top: 20px"
                        >
                            合集
                        </p>
                        <div
                            class="row-content"
                            v-if="activeIndex === 3 && !isColInner"
                            style="height: 22vh; overflow: auto"
                        >
                            <!-- <div>插画</div> -->
                            <div
                                v-for="(item, i) in isAllList
                                    ? row.Collections
                                    : row.Collections.slice(0, 3)"
                                :key="i"
                                class="collection"
                                @click="
                                    (isColInner = true), innerCollection(item)
                                "
                            >
                                <div class="count">
                                    {{ item.MaterialNum }}
                                </div>
                                <el-tooltip
                                    placement="top"
                                    :content="item.Name"
                                    :disabled="item.Name ? false : true"
                                    effect="dark"
                                    :hide-after="0"
                                >
                                    <el-image
                                        :draggable="false"
                                        v-if="item.url"
                                        :src="item.url"
                                        fit="cover"
                                    />
                                </el-tooltip>

                                <p>{{ item.Name }}</p>
                            </div>
                        </div>

                        <!-- 插画合集点击进去到内页了 -->
                        <div
                            v-if="
                                activeIndex === 3 &&
                                isColInner &&
                                collectionInnerData.Id &&
                                row.Type === 3
                            "
                        >
                            <div class="data-text" @click="isColInner = false">
                                <img
                                    src="@/assets/images/material/icon_arrow_back.png"
                                    alt=""
                                />
                                返回
                            </div>
                            <p
                                class="text-type"
                                @click="isOpen = !isOpen"
                                style="margin-top: 20px"
                            >
                                {{ collectionInnerData.Name }}
                                <img
                                    src="@/assets/images/material/icon_arrow_down.png"
                                    alt=""
                                    v-if="isOpen"
                                />
                                <img
                                    src="@/assets/images/material/icon_arrow_up.png"
                                    alt=""
                                    v-else
                                />
                            </p>
                            <div
                                class="row-content"
                                v-if="isOpen"
                                style="height: 30vh; overflow: auto"
                            >
                                <div
                                    v-for="(item, i) in (collectionInnerData.Files as any) "
                                    :key="i"
                                    @click="insertMaterial(item)"
                                >
                                    <el-tooltip
                                        placement="top"
                                        :content="item.Name || item.FileName"
                                        :disabled="
                                            item.Name || item.FileName
                                                ? false
                                                : true
                                        "
                                        effect="dark"
                                        :hide-after="0"
                                    >
                                        <el-image
                                            :draggable="false"
                                            v-if="item.url"
                                            :src="item.url"
                                            fit="contain"
                                        />
                                    </el-tooltip>
                                </div>
                            </div>

                            <p class="text-type" style="margin-top: 20px">
                                其它推荐
                            </p>
                            <div
                                class="row-content"
                                style="height: 22vh; overflow: auto"
                            >
                                <div
                                    v-for="(item, i) in (adviceCollection as any)"
                                    :key="i"
                                    class="collection"
                                    @click="
                                        (isColInner = true),
                                            innerCollection(item)
                                    "
                                >
                                    <div class="count">
                                        {{ item.MaterialNum }}
                                    </div>
                                    <el-tooltip
                                        placement="top"
                                        :content="item.Name"
                                        :disabled="item.Name ? false : true"
                                        effect="dark"
                                        :hide-after="0"
                                    >
                                        <el-image
                                            :draggable="false"
                                            v-if="item.url"
                                            :src="item.url"
                                            fit="cover"
                                        />
                                    </el-tooltip>
                                    <p>{{ item.Name }}</p>
                                </div>
                            </div>
                        </div>
                        <!--标题框 wincard -->
                        <div
                            class="row-content"
                            v-if="row.Type === 4 && row.Materials?.length"
                        >
                            <div
                                v-for="(item, i) in isAllList
                                    ? row.Materials
                                    : row.Materials.slice(0, 6)"
                                :key="i"
                                @click="insertMaterial(item)"
                            >
                                <!-- v-contextmenu="(el: any) => TContextmenus(el, item)" -->

                                <ThumbnailElements
                                    :size="120"
                                    :slide="formateElement(item.Files[0]) || {}"
                                ></ThumbnailElements>
                            </div>
                        </div>
                        <!--视频/音频-->
                        <div v-if="row.Type === 5 || row.Type === 6">
                            <div
                                class="row-video"
                                v-for="(item, i) in isAllList
                                    ? row.Materials
                                    : row.Materials.slice(0, 2)"
                                :key="i"
                                @click="handleView(item)"
                            >
                                <div
                                    class="video-play"
                                    @mouseenter="
                                        VAMouseHandler(
                                            'VARef' + item.Id,
                                            item,
                                            1
                                        )
                                    "
                                    @mouseleave="
                                        VAMouseHandler(
                                            'VARef' + item.Id,
                                            item,
                                            0
                                        )
                                    "
                                >
                                    <div
                                        class="video-img"
                                        v-if="item.Type == 5 && item.url2"
                                    >
                                        <!-- controls -->
                                        <video
                                            object-fit="cover"
                                            :ref="'VARef' + item.Id"
                                            :src="item.url2"
                                            @timeupdate="
                                                updateTime(
                                                    'VARef' + item.Id,
                                                    item
                                                )
                                            "
                                        >
                                            您的浏览器不支持视频播放
                                        </video>
                                        <div class="playicon">
                                            <el-icon v-if="item.isPlay"
                                                ><VideoPause
                                            /></el-icon>
                                            <el-icon v-else
                                                ><VideoPlay
                                            /></el-icon>
                                        </div>
                                        <span>
                                            {{ item.currentTime || "00:00" }} /
                                            {{
                                                formatSeconds(
                                                    item.Files.find(
                                                        (file: any) =>
                                                            file.Type == 1
                                                    )?.Duration
                                                )
                                            }}
                                        </span>
                                    </div>
                                    <div
                                        class="audio-img"
                                        v-if="item.Type == 6 && item.url"
                                    >
                                        <el-image
                                            :draggable="false"
                                            :src="item.url"
                                            fit="cover"
                                        />
                                        <div class="lines">
                                            <div class="duan"></div>
                                            <div class="chang"></div>
                                            <div class="duan"></div>
                                            <div class="chang"></div>
                                            <div class="duan"></div>
                                        </div>
                                        <span>
                                            {{ item.currentTime || "00:00" }} /
                                            {{
                                                formatSeconds(
                                                    item.Files.find(
                                                        (file: any) =>
                                                            file.Type == 1
                                                    )?.Duration
                                                )
                                            }}
                                        </span>
                                        <audio
                                            :ref="'VARef' + item.Id"
                                            controls
                                            preload="auto"
                                            v-show="false"
                                            @timeupdate="
                                                updateTime(
                                                    'VARef' + item.Id,
                                                    item
                                                )
                                            "
                                        >
                                            <source
                                                :src="item.url2"
                                                type="audio/mp3"
                                            />
                                            <source
                                                :src="item.url2"
                                                type="audio/ogg"
                                            />
                                            您的浏览器不支持 audio 元素。
                                        </audio>
                                    </div>
                                </div>
                                <div class="video-text">
                                    <div class="title-text">
                                        {{ item.Name }}
                                    </div>
                                    <span class="gary-text">{{
                                        item.Remarks
                                    }}</span>
                                </div>
                            </div>
                        </div>

                        <!--题目-->
                        <!-- <div v-if="row.Type === 7">
          <div class="row-topic" v-for="(item, i) in row.Materials.slice(0, 3)" :key="i">
            <div>
              <span :class="['type-topic', i === 0 ? 'type-topic-active' : '']">书本题目</span>
              <span class="title-text">长方形周长与面积</span>
            </div>
            <div class="gary-text">5题</div>
          </div>
        </div> -->
                    </div>
                    <div v-if="isAllList && searchForm?.Type !== 1">
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
                </div>
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
            @insertMaterial="insertMaterial"
            :currentSelectTemplate="currentSelectTemplate"
            :allPageListMap="allPageListMap"
        ></template-view>
    </div>
</template>

<script lang="ts">
import {
    defineComponent,
    onMounted,
    reactive,
    toRefs,
    watch,
    computed,
    getCurrentInstance,
    ref
} from "vue";
import TemplateView from "./templateView.vue";
import { formatSeconds, debounce, debounceT, throttle } from "@/utils/common";
import { Search, VideoPause, VideoPlay, Close } from "@element-plus/icons-vue";
import useSaveElements from "../hooks/useSaveElements";
import useSaveTemplate from "@/views/preparation/intelligenceClassroom/edit/hooks/useSaveTemplate";
import { ElMessageBox } from "element-plus";
export default defineComponent({
    name: "materialResource",
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
    emits: ["insertData", "insertTools"],
    components: {
        VideoPause,
        VideoPlay,
        Close,
        TemplateView,
    },
    setup(props, { emit }) {
        const proxy = getCurrentInstance();
        const {
            materialList,
            getSourceMaterials,
            formateOssUrl,
            categoryData,
            queryCategoryByMaterialType,
            getAdviceCollection,
            adviceCollection,
            deleteSourceAssembly,
            isLoading,
            allPageListMap,
            queryToolList,
            toolList,
            pager,
        } = useSaveTemplate();
        const isShowTag = ref(false);
        // computed(() => {
        //   return state.activeIndex == 2 || state.activeIndex == 3 || state.activeIndex == 5 || state.activeIndex == 6;
        // });
        const state = reactive({
            searchForm: {
                Name: "", //关键词
                Type: 0, //素材类型
                LessonLable: {
                    SubjectID: props.subjectID,
                    PublisherID: "",
                    AlbumID: "",
                    ChapterID: "",
                    LessonID: [props.lessonId],
                    SourceMaterialMainID: "",
                    CollectionsMainID: "",
                },
                Lable: "",
                Pager: {
                    PageNumber: 1,
                    PageSize: 9,
                    Total: 0,
                },
            },
            activeIndex: 0,
            isAllList: false,
            tabList: [
                { name: "全部", value: 0 },
                { name: "教具", value: 1 },
                { name: "照片", value: 2 },
                { name: "插画", value: 3 },
                { name: "标题框", value: 4 },
                { name: "视频", value: 5 },
                { name: "音频", value: 6 },
                // { name: '题目', value: 7 },
                // { name: '工具', value: 8 }
            ],
            currentClassIndex: "",
            //二级分类标签列表
            secondLabelList: [],
            isOpen: true, //素材-插画-展开/收起
            isColInner: false, //是否是在合集内页中
            collectionInnerData: {
                Id: "",
                Name: "",
                Files: [],
            }, //合计内页中插画文件列表
            currentAllType: 0,
            visibleView: false, //视频预览
            currentSelectTemplate: [], //当前选择的模板
            disabled: false, //是否终止滚动加载
            loading: false,
        });
        const contextMenuVisible = ref(false);
        const contextMenu = ref({
            rightClickItemIndex: null,
            rightClickItem: null,
            x: null,
            y: null,
        });
        const noMore = computed(() => pager.value.IsLastPage); //不在显示更多
        const templateScollRef = ref(); //滚动区域
        const { parseElements } = useSaveElements();
        // const arr = elements.map(item => {
        //   return parseElements(item);
        // });

        //组件转换
        const formateElement = (item: any) => {
            if (item && item.Json) {
                return JSON.parse(item.Json);
            } else {
                return null;
            }
        };
        //监听顶部tab 素材类型变化
        watch(
            () => state.activeIndex,
            async (val: number) => {
                state.currentClassIndex = "";
                state.searchForm.Name = "";
                state.searchForm.Pager.PageNumber = 1;
                state.searchForm.Lable = "";
                state.searchForm.Type = val;
                state.isColInner = false;
                isShowTag.value = false;
                switch (val) {
                    case 0:
                        state.isAllList = false;
                        break;
                    case 1:
                        state.isAllList = true;
                        break;
                    case 2:
                    case 3:
                    case 5:
                    case 6:
                        state.isAllList = true;
                        isShowTag.value = true;
                        break;
                    case 4:
                        state.isAllList = true;
                        break;
                    default:
                        break;
                }
                if (isShowTag.value) {
                    queryCategoryByMaterialType({
                        Type: val,
                        MaterialId: "",
                    });
                }
                materialList.value = [];
                await queryMaterialList();
                // insertJiaoJu();
            }
        );
        //监听科目改变
        watch(
            () => props.subjectID,
            (curVal) => {
                state.searchForm.LessonLable.SubjectID = curVal;
                queryMaterialList();
            },
            { deep: true }
        );
        //监听课时改变
        watch(
            () => props.lessonId,
            async (curVal) => {
                state.searchForm.LessonLable.LessonID = [curVal];
                await queryMaterialList();
            },
            { deep: true }
        );
        watch(
            () => materialList.value,
            (val: any) => {
                insertJiaoJu();
            },
            { deep: true }
        );

        //教具内容添加进素材里面
        const insertJiaoJu = async () => {
            if (state.activeIndex === 0 || state.activeIndex === 1) {
                if (state.isAllList && state.searchForm.Type !== 1) return;
                if (toolList.value.length) {
                    if (
                        materialList.value.findIndex(
                            (item: any) => item.Type === 1
                        ) > -1
                    ) {
                        materialList.value[0].Materials = toolList.value;
                    } else {
                        materialList.value.unshift({
                            Materials: toolList.value,
                            Name: "教具",
                            Type: 1,
                        });
                    }
                }
            }
        };
        //点击视频预览
        const handleView = (item: any) => {
            if (item.Type === 5) {
                state.visibleView = true;
                state.currentSelectTemplate = item;
            } else {
                insertMaterial(item);
            }
        };
        //关键词搜索
        const nameInput = async () => {
            if (state.activeIndex === 1 || state.activeIndex === 0) {
                debounceT(queryTools, 600);
            }
            if (state.activeIndex !== 1) {
                state.searchForm.Pager.PageNumber = 1;
                debounce(queryMaterialList, 500);
            }
        };
        //清空分类选择的标签
        const clearTag = () => {
            state.searchForm.Lable = "";
            state.currentClassIndex = "";
            state.searchForm.Pager.PageNumber = 1;
            queryMaterialList();
        };
        //点击分类标签
        const clickClassTag = (label: string) => {
            if (label) {
                state.searchForm.Lable = label;
                state.searchForm.Pager.PageNumber = 1;
                queryMaterialList();
            }
        };
        //查询素材列表-按类型
        const queryMaterialList = async (type?: number) => {
            await getSourceMaterials(state.searchForm, type);
        };

        //查询某个类型下全部素材
        const getAllList = async (row: any) => {
            state.isAllList = true;
            state.searchForm.Type = row.Type;
            if (row.Type === 1) {
                materialList.value = materialList.value.filter((item: any) => {
                    return item.Type == row.Type;
                });
                templateScollRef.value.scrollTop = 0; //滚动条归零
            } else {
                state.searchForm.Pager.PageNumber = 1;
                await queryMaterialList();
                templateScollRef.value.scrollTop = 0; //滚动条归零
            }

            if (row.Type === 2 || row.Type === 3) {
                isShowTag.value = true;
                queryCategoryByMaterialType({
                    Type: row.Type,
                    MaterialId: "",
                });
            } else {
                isShowTag.value = false;
            }
        };
        //返回所有列表
        const goBackAllList = async () => {
            isShowTag.value = false;
            //   state.activeIndex = 0;
            //   state.currentAllType = 0;
            state.searchForm.Type = 0;
            state.searchForm.Pager.PageNumber = 1;
            state.isAllList = false;
            await queryMaterialList();
            templateScollRef.value.scrollTop = 0; //滚动条归零
            // insertJiaoJu();
        };
        //点击插画类型下的 插画合集
        const innerCollection = (item: any) => {
            state.collectionInnerData = item;
            console.log("state.collectionInnerData", state.collectionInnerData);

            //查询推荐合集
            const params = {
                Id: item.Id,
                Lable: state.currentClassIndex,
            };
            getAdviceCollection(params);
        };
        //点击插入素材至窗卡页中
        const insertMaterial = (data: any, type?: number) => {
            state.visibleView = false;
            if (type === 1) {
                emit("insertTools", { data, type: "teach" });
            } else {
                emit("insertData", {
                    data,
                    type: "elements",
                });
            }
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
                        materialList.value.forEach((li: any) => {
                            if (li.Type === 4) {
                                li.Materials.splice(
                                    li.Materials.findIndex(
                                        (item: any) => item.Id == data.Id
                                    ),
                                    1
                                );
                            }
                        });
                        // state.searchForm.Type = state.currentAllType;
                        // queryMaterialList();
                    }
                })
                .catch(() => {});
        };
        //标题框右击菜单
        const TContextmenus = (el: any, data: any) => {
            // return [
            //     {
            //         text: "删除",
            //         subText: "",
            //         handler: () => handleDeleteTitle(data),
            //     },
            // ];
        };
        //视频右击菜单

        // const VContextmenus = (el: any, data: any) => {
        //     return [
        //         {
        //             text: "插入大视频", //0
        //             subText: "",
        //             handler: () => {
        //                 insertMaterial({ showType: 0, ...data });
        //             },
        //         },
        //         {
        //             text: "插入小视频", //1
        //             subText: "",
        //             handler: () => {
        //                 insertMaterial({ showType: 1, ...data });
        //             },
        //         },
        //     ];
        // };
        //音频右击菜单
        // const AContextmenus = (el: any, data: any) => {
        //   return [
        //     {
        //       text: '插入音频', //0
        //       subText: '',
        //       handler: () => {
        //         insertMaterial(data);
        //       }
        //     }
        //   ];
        // };

        //视频音频控制播放暂停-移入移出
        const VAMouseHandler = (ref: any, data: any, type: number) => {
            //   console.log('ref,data', ref, data);
            const varef: any = proxy?.refs[ref];
            if (!varef && !varef.length) return;
            data.isPlay = type;
            if (type) {
                varef[0].play();
            } else {
                varef[0].pause();
            }
        };
        //监听时间变化然后赋值当前时间
        const updateTime = (ref: any, data: any) => {
            const varef: any = proxy?.refs[ref];
            data.currentTime = formatSeconds(varef[0].currentTime);
        };
        //查询教具
        const queryTools = async () => {
            const data = {
                name: state.searchForm.Name,
                bookID: "",
                bookIDs: [] as string[],
            };
            await queryToolList(data);
        };
        //滚动加载更多
        const loadMore = () => {
            if (state.activeIndex === 0 && !state.isAllList) return;
            state.loading = true;
            if (pager.value.IsLastPage) {
                state.loading = false;
                return;
            }
            throttle(async () => {
                state.searchForm.Pager.PageNumber += 1;
                if (state.activeIndex === 3) {
                    templateScollRef.value.scrollTop -= 100; //滚动条
                }
                await queryMaterialList(1);
                state.loading = false;
            }, 1000);
        };
        onMounted(async () => {
            await queryTools();
            await queryMaterialList();
            // insertJiaoJu();
        });

        return {
            Search,
            ...toRefs(state),
            isShowTag,
            // arr,
            getAllList,
            goBackAllList,
            materialList,
            getSourceMaterials,
            queryMaterialList,
            //   formateImage,
            formateOssUrl,
            formateElement,
            formatSeconds,
            categoryData,
            clickClassTag,
            innerCollection,
            insertMaterial,
            adviceCollection,
            TContextmenus,
            // VContextmenus,
            handleDeleteTitle,
            VAMouseHandler,
            updateTime,
            clearTag,
            nameInput,
            handleView,
            isLoading,
            allPageListMap,
            queryToolList,
            toolList,
            insertJiaoJu,
            noMore,
            loadMore,
            templateScollRef,
        };
    },
});
</script>

<style scoped lang="scss">
.tab-class {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    margin-bottom: 20px;
    > div {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 30px;
        padding: 0 6px;
        background: #f6f7f8;
        border-radius: 4px;
        cursor: pointer;
        margin-right: 9px;
        font-size: 15px;
    }
    .active {
        background: #2e95ff;
        color: #fff;
    }
}
.material-con {
    display: flex;
    flex-direction: column;
    height: calc(100% - 120px);
    .tag-data {
        margin-top: 20px;
        .tags {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            .el-icon {
                margin-right: 5px;
                color: red;
                cursor: pointer;
                font-size: 14px;
            }
            .el-icon:hover {
                opacity: 0.8;
            }
            span {
                // padding-right: 5px;
                margin-right: 5px;
            }
            :deep(.el-check-tag) {
                font-size: 14px;
                // font-weight: 600;
                margin-bottom: 5px;
            }

            .isActive {
                color: var(--el-link-hover-text-color);
                border-bottom: 2px solid var(--el-link-hover-text-color);
            }
        }
    }

    .row {
        .row-header {
            display: flex;
            justify-content: space-between;
            font-size: 14px;
            color: #90949e;
            margin: 24px 0 0px;
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

        .title-text {
            font-size: 14px;
            color: #212121;
            margin-bottom: 10px;
        }

        .gary-text {
            font-size: 12px;
            color: #90949e;
        }

        .text-type {
            font-size: 14px;
            font-weight: 400;
            color: #90949e;
            display: flex;
            align-items: center;
            cursor: pointer;
            img {
                margin-left: 5px;
            }
        }
        .data-text {
            cursor: pointer;
            display: flex;
            align-items: center;
            font-size: 14px;
            font-weight: 600;
            color: #212121;
            img {
                margin-right: 5px;
            }
        }
        .row-content {
            display: flex;
            justify-content: flex-start;
            flex-wrap: wrap;
            > div {
                width: 30.3%;
                box-shadow: 0px 3px 7px 0px rgba(0, 0, 0, 0.1);
                border-radius: 4px;
                cursor: pointer;
                margin: 10px 3% 10px 0;
                padding: 10px;
                text-align: center;
                background: #f6f7f8;
                .el-image {
                    width: 100%;
                    height: 130px;
                }
            }
            .collection {
                background: #fff;
                border: 1px solid #d8dbdd;
                position: relative;
                border-bottom: 2px double #bfbfbf;
                padding: 0;
                .el-image {
                    width: 100%;
                    height: 120px;
                }
                .count {
                    position: absolute;
                    right: 3px;
                    top: 3px;
                    width: 18px;
                    height: 18px;
                    line-height: 18px;
                    background: #000000;
                    border-radius: 2px;
                    opacity: 0.5;
                    font-size: 12px;
                    font-weight: 400;
                    color: #ffffff;
                    z-index: 99;
                }
                p {
                    margin: 12px 0;
                    font-size: 14px;
                }
            }

            .jiaoju {
                padding: 0;
                :deep(.el-image) {
                    height: 100px;
                }
                .title-text {
                    height: 26px;
                    line-height: 26px;
                    margin: 0;
                }
            }
        }

        .row-video {
            cursor: pointer;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            background: #f6f7f8;
            border-radius: 4px;
            margin-top: 10px;
            height: 72px;
            // padding: 10px 0;
            .video-play {
                width: 28%;
                height: 100%;
                margin-right: 20px;
                border-radius: 4px 0px 0px 4px;
                position: relative;

                .video-img {
                    width: 100%;
                    height: 100%;
                    position: relative;
                    video {
                        width: 100%;
                        height: 100%;
                    }
                    span {
                        position: absolute;
                        right: 4px;
                        bottom: 4px;
                        color: #fff;
                        font-size: 12px;
                    }
                    .playicon {
                        cursor: pointer;
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        .el-icon {
                            backdrop-filter: blur(5px);
                            font-size: 20px;
                            color: rgba(255, 255, 255, 0.7);
                        }
                    }
                }
                .audio-img {
                    width: 100%;
                    height: 100%;
                    position: relative;
                    .el-image {
                        width: 100%;
                        height: 100%;
                    }
                    span {
                        position: absolute;
                        right: 4px;
                        bottom: 4px;
                        color: #fff;
                        font-size: 12px;
                    }
                    .lines {
                        cursor: pointer;
                        position: absolute;
                        top: 40%;
                        left: 50%;
                        transform: translateX(-50%);
                        display: flex;
                        align-items: center;
                        .duan {
                            margin: 1px;
                            width: 2px;
                            height: 6px;
                            background-color: #fff;
                        }
                        .chang {
                            margin: 1px;
                            width: 2px;
                            height: 17px;
                            background-color: #fff;
                        }
                    }
                }
            }

            .video-text {
                flex: 1;
                flex-wrap: wrap;
            }
            // img {
            //   width: 96px;
            //   height: 72px;
            //   margin-right: 20px;
            // }
        }
        .row-video:hover {
            opacity: 0.8;
            .duan,
            .chang {
                opacity: 0.5;
            }
        }
        .row-topic {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-radius: 4px;
            margin: 20px 0;
            padding: 20px 10px;
            background: #f6f7f8;
            .type-topic {
                border-radius: 4px;
                padding: 4px;
                margin-right: 20px;
            }
            .type-topic-active {
                color: #2e95ff;
                border: 1px solid #2e95ff;
            }
        }
    }
    .nomore,
    .loadmore {
        margin-top: 10px;
        text-align: center;
        margin-bottom: 10px;
        font-size: 12px;
    }
    .loadmore {
        cursor: pointer;
    }
}
</style>
