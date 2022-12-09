<template>
    <div>
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
        <div class="mymaterials">
            <div
                v-if="activeIndex === 1 && myAssemblyList.length"
                class="row-element"
            >
                <div v-for="(item, i) in (myAssemblyList as any)" :key="i">
                    <!-- 需要winCard更新-->
                    <ThumbnailElements
                        :size="130"
                        :slide="formateElement(item.Files[0]) || {}"
                    ></ThumbnailElements>
                </div>
            </div>

            <div
                v-else-if="activeIndex === 2 && myTemplateList.length"
                class="row-content"
            >
                <div
                    v-for="(item, i) in myTemplateList"
                    :key="i"
                    @click="handleView(item)"
                >
                    <img
                        class="jpzy"
                        src="@/assets/images/material/icon_jpzy.png"
                        alt=""
                    />
                    <ThumbnailSlide
                        :slide="
                            allPageListMap.get(
                                item.CardData[0]?.PageList[0]?.ID
                            ) || {}
                        "
                        :size="225"
                    ></ThumbnailSlide>
                    <div class="info flex-between-center">
                        <span class="text">{{ item.Name }}</span>
                        <span class="page">{{ item.PageCount }}页</span>
                        <el-popover
                            placement="right-start"
                            :width="24"
                            trigger="click"
                        >
                            <template #reference>
                                <el-button size="small" @click.stop>
                                    <el-icon :size="18"
                                        ><more-filled
                                    /></el-icon>
                                </el-button>
                            </template>
                            <div class="operation-box">
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
        const state = reactive({
            visibleView: false,
            currentSelectTemplate: [],
            activeIndex: 1,
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
            },
        });
        const {
            queryMyTemplateLis,
            templateList,
            allPageListMap,
            deleteTemplate,
            getSourceAssemblyList,
            myAssemblyList,
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
            (curVal) => {
                if (curVal === 1) {
                    queryAssemblyList();
                } else {
                    quertMyTemplate();
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
        const quertMyTemplate = () => {
            queryMyTemplateLis(state.serchForm);
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
            .jpzy {
                position: absolute;
                left: 0px;
                top: 0px;
                z-index: 2;
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
                    > div {
                        padding: 6px 0;
                        cursor: pointer;
                    }
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
</style>
