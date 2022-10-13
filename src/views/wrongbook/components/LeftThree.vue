<template>
    <div class="leftthree" v-loading="state.loading">
        <el-cascader
            v-if="props.currentWrongType == 3"
            size="small"
            style="width: 100%"
            v-model="state.currentBookId"
            :props="cascaderProps"
            :options="subjectPublisherBookList"
            @change="changeBook"
        ></el-cascader>
        <div class="leftthree-list">
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
import {
    reactive,
    ref,
    defineProps,
    defineEmits,
    onMounted,
    watch,
    provide,
} from "vue";
import Tree from "./tree/index.vue";
import {
    searchLeftMeunByChapter,
    searchLeftMeunByKnowledge,
    LeftMenuParams,
} from "@/api/errorbook";
import useBookList from "@/views/assignHomework/hooks/useBookList";
import useWrongBook from "../hooks/useWrongBook";
import emitter from "@/utils/mitt"; //全局事件总线
import { subjectPublisherBookList } from "@/hooks/useSubjectPublisherBookList";
provide("isShow", false);
provide("classId", "");
const { cascaderProps } = useBookList();
const props = defineProps({
    currentWrongType: {
        type: Number,
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
    currentChapterBookId: {
        type: Array,
        default: () => [],
    },
});
const emit = defineEmits(["update:currentChapterBookId"]);

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
    currentBookId: [] as string[],
});
watch(
    () => props.parentSearch,
    (data) => {
        form.value = Object.assign(form.value, data);
        queryLeftMeunByChapter(form.value);
    },
    {
        deep: true,
    }
);

//树结构选中
const selectedChapter = (val: any) => {
    const chapterId = val.ChapterId || "";
    const lessonId = val.Id || "";
    const name = val.ChapterName || val.Name || "";
    emitter.emit("errorBookEmit", {
        name,
        lessonId: lessonId,
        chapterId: chapterId,
        wrongType: props.currentWrongType,
        ...props.parentSearch,
    });
};

//下面是请求方法
//改变左侧书册下拉
const changeBook = (value: string) => {
    if (value && value.length) {
        emit("update:currentChapterBookId", value);
        form.value.BookId = value[value.length - 1];
    } else {
        form.value.BookId = "";
    }
    // queryLeftMeunByChapter(form.value);
};

//按章节查询左侧树
const queryLeftMeunByChapter = async (params: LeftMenuParams) => {
    state.loading = true;
    // console.log("params", params);
    const res: any = await searchLeftMeunByChapter(params);
    1;
    if (res.resultCode === 200) {
        state.loading = false;
        state.treeData = res.result;
        const lessonId = state.treeData?.length
            ? state.treeData[0].ChapterId
            : "";
        selectedID.value = lessonId;
        const name = state.treeData[0].ChapterName || "";
        emitter.emit("errorBookEmit", {
            name,
            wrongType: props.currentWrongType,
            lessonId: lessonId,
            chapterId: "",
            ...props.parentSearch,
        });
    } else {
        state.treeData = [];
        state.loading = false;
    }
};
const initData = (v: any) => {
    form.value.BookId = v ? v[2] : "";
    const params = Object.assign(form.value, props.parentSearch);
    queryLeftMeunByChapter(params);
};
watch(
    () => subjectPublisherBookList.value,
    (v) => {
        if (props.currentChapterBookId?.length) {
            state.currentBookId = props.currentChapterBookId as any;
            initData(state.currentBookId);
        } else {
            state.currentBookId = [
                v[0].Value,
                v[0].Children![0].Value,
                v[0].Children![0].Children![0].Value,
            ];
        }
    },
    { deep: true, immediate: true }
);
watch(
    () => state.currentBookId,
    (v) => {
        // console.log("vvvv", v);
        initData(v);
    },
    { deep: true, immediate: true }
);
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
        height: calc(100% - 7rem);
        overflow: auto;
    }
}
</style>
