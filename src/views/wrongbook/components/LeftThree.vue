<template>
    <div class="leftthree">
        <el-select
            v-if="props.currentWrongType == 4"
            size="small"
            style="width: 100%; margin-right: 16px"
            v-model="form.BookId"
            @change="changeKnowledgeLab"
            clearable
        >
            <el-option
                v-for="item in (knowledgeLabList as any)"
                :label="item.Name"
                :value="item.Id"
                :key="item.Id"
            >
            </el-option>
        </el-select>
        <el-cascader
            v-if="props.currentWrongType == 3"
            size="small"
            style="width: 100%"
            v-model="form.BookId"
            :props="cascaderProps"
            :options="state.subjectPublisherBookList"
            @change="changeBook"
            clearable
        ></el-cascader>
        <div class="leftthree-input">
            <el-input
                v-if="props.currentWrongType == 4"
                size="small"
                style="width: 100%"
                v-model="form.Name"
                class="w-50 m-2"
                placeholder="请输入关键词"
            >
                <template #prefix>
                    <el-icon><search /></el-icon>
                </template>
            </el-input>
        </div>
        <div class="leftthree-list" v-loading="state.loading">
            <Tree
                v-if="state.treeData.length"
                @onTreeItemChange="selectedChapter"
                v-model:value="selectedID"
                :treeData="state.treeData"
            />
            <p v-else style="text-align: center; margin-top: 20%">暂无数据</p>
            <!-- :tipTarget="tipTarget"
                    :showClassArrangement="showClassArrangement" -->
        </div>
    </div>
</template>
<script lang="ts" setup>
import { reactive, ref, defineProps, onMounted, watch, inject } from "vue";
import Tree from "./tree/index.vue";
import { Search } from "@element-plus/icons-vue";
import {
    searchLeftMeunByChapter,
    searchLeftMeunByKnowledge,
    LeftMenuParams,
} from "@/api/errorbook";
import { fetchSubjectPublisherBookList } from "@/views/preparation/api";
import useBookList from "@/views/assignHomework/hooks/useBookList";
import useWrongBook from "../hooks/useWrongBook";
const { cascaderProps } = useBookList();

const { queryKnowledgeLabList, knowledgeLabList } = useWrongBook();

const props = defineProps({
    currentWrongType: {
        type: Number,
        default: null,
        required: true,
    },
    parentSearch: {
        type: Object,
        default: () => {},
    },
    gradeId: {
        type: String,
        default: () => "",
    },
});

//搜索区域
const form = ref({
    BookId: "",
    Name: "",
    Id: "",
});
//项目id
const selectedID = ref("");
//数据源
const state = reactive({
    currentLessonIndex: 1,
    subjectPublisherBookList: [],
    //项目数据源
    treeData: [
        // {
        //     Id: "1",
        //     Name: "1 准备课",
        //     count: 20,
        //     Children: [
        //         {
        //             Id: "1 - 1",
        //             Name: "数一数",
        //             count: 0,
        //             Children: null,
        //         },
        //         {
        //             Id: "1 - 2",
        //             Name: "比多少",
        //             count: 14,
        //             Children: [
        //                 {
        //                     Id: "1 - 2 - 1",
        //                     Name: "比较物体大小",
        //                     count: 3,
        //                     Children: null,
        //                 },
        //                 {
        //                     Id: "1 - 2 - 2",
        //                     Name: "比较物体长短高低",
        //                     count: 4,
        //                     Children: null,
        //                 },
        //                 {
        //                     Id: "1 - 2 - 3",
        //                     Name: "比较物体轻重",
        //                     count: 5,
        //                     Children: null,
        //                 },
        //                 {
        //                     Id: "1 - 2 - 4",
        //                     Name: "比较物体多少",
        //                     count: 2,
        //                     Children: null,
        //                 },
        //             ],
        //         },
        //     ],
        // },
    ],
    loading: false,
});
watch(
    () => props.parentSearch,
    (data) => {
        console.log("data", data);
        form.value = Object.assign(form.value, data);
        if (props.currentWrongType === 3) {
            queryLeftMeunByChapter(form.value);
        } else {
            queryLeftMeunByKnowledge(form.value);
        }
    },
    {
        deep: true,
    }
);
watch(
    () => props.currentWrongType,
    (val) => {
        console.log("currentWrongType", val);
        form.value = Object.assign(form.value, props.parentSearch);
        if (val === 3) {
            queryLeftMeunByChapter(form.value);
        } else {
            queryLeftMeunByKnowledge(form.value);
        }
    },
    {
        deep: true,
    }
);
//监听年级变化
watch(
    () => props.gradeId,
    (gradeId: string) => {
        console.log("gradeId", gradeId);
        queryKnowledgeLabList({
            gradeId: gradeId || "39F766472E38409F4E61E0D93DB1238F",
        });
    }
);
const getSubjectPublisherBookList = async () => {
    const res: any = await fetchSubjectPublisherBookList();
    if (res.resultCode === 200) {
        state.subjectPublisherBookList = res.result;
    }
};
//章节选中
const selectedChapter = (val: any) => {
    console.log(val);
};

//下面是请求方法
//切换左侧课程卡片
const switchLessonCard = (item: any) => {
    console.log(item);
    state.currentLessonIndex = item.id;
};
//改变左侧书册下拉
const changeBook = (value: string) => {
    console.log(value);
    if (value && value.length) {
        form.value.BookId = value[value.length - 1];
    } else {
        form.value.BookId = "";
    }
    queryLeftMeunByChapter(form.value);
};

//按章节查询左侧树
const queryLeftMeunByChapter = async (params: LeftMenuParams) => {
    state.loading = true;
    console.log("params", params);
    const res: any = await searchLeftMeunByChapter(params);
    console.log(res);
    if (res.resultCode === 200) {
        state.loading = false;
        state.treeData = res.result;
    } else {
        state.treeData = [];
        state.loading = false;
    }
};
//按知识点查询左侧树
const queryLeftMeunByKnowledge = async (params: LeftMenuParams) => {
    state.loading = true;
    const res: any = await searchLeftMeunByKnowledge(params);
    console.log(res);
    if (res.resultCode === 200) {
        state.loading = false;
        state.treeData = res.result;
    } else {
        state.treeData = [];
        state.loading = false;
    }
};
//选择知识点 筛选 按知识点树
const changeKnowledgeLab = (data: string) => {
    console.log(data);
    form.value.Id = data;
    queryLeftMeunByKnowledge(form.value);
};
onMounted(() => {
    queryKnowledgeLabList({
        gradeId: props.gradeId || "39F766472E38409F4E61E0D93DB1238F",
    });
    if (props.currentWrongType == 3) {
        getSubjectPublisherBookList();
    }
});
</script>
<style lang="scss" scoped>
.leftthree {
    background-color: #fff;
    padding: 12px 16px;
    width: 100%;
    height: 100%;
    .leftthree-input,
    .leftthree-list {
        margin-top: 8px;
    }
    .leftthree-list {
        height: calc(100% - 4rem);
        overflow: auto;
    }
}
</style>
