<template>
    <div class="leftthree" v-loading="state.loading">
        <el-select
            size="small"
            style="width: 100%; margin-right: 16px"
            v-model="form.Id"
            @change="changeKnowledgeLab"
        >
            <el-option
                v-for="item in (knowledgeLabList as any)"
                :label="item.Name"
                :value="item.Id"
                :key="item.Id"
            >
            </el-option>
        </el-select>
        <div class="leftthree-input">
            <el-input
                size="small"
                style="width: 100%"
                v-model="form.Name"
                class="w-50 m-2"
                placeholder="请输入关键词"
                @input="codeInput"
            >
                <template #prefix>
                    <el-icon><search /></el-icon>
                </template>
            </el-input>
        </div>
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
    onMounted,
    watch,
    provide,
    defineEmits,
    nextTick,
} from "vue";
import Tree from "./tree/index.vue";
import { Search } from "@element-plus/icons-vue";
import { searchLeftMeunByKnowledge, LeftMenuParams } from "@/api/errorbook";
import useWrongBook from "../hooks/useWrongBook";
import emitter from "@/utils/mitt"; //全局事件总线
import { store } from "@/store";
const { queryKnowledgeLabList, knowledgeLabList } = useWrongBook();
provide("isShow", true);

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
    currentLessonId: {
        type: String,
        default: () => "",
    },
});
const emit = defineEmits(["update:currentLessonId", "selectSubject"]);

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
    treeData: [],
    loading: false,
    currentBookId: [] as string[],
    lessonName: "",
    classId: "",
});
watch(
    () => props.parentSearch,
    (data) => {
        console.log("data", data);
        form.value = Object.assign(form.value, data);
        queryLeftMeunByKnowledge(form.value);
    },
    {
        deep: true,
    }
);
//根据科目id查学生
const selectSubject = (subject: any) => {
    emit("selectSubject", subject);
};
//监听年级变化
watch(
    () => props.gradeId,
    (gradeId: string) => {
        console.log("gradeId", gradeId);
        queryKnowledgeLabList({
            gradeId: gradeId || "39F766472E38409F4E61E0D93DB1238F",
        });
    },
    { deep: true, immediate: true }
);

watch(
    () => knowledgeLabList.value,
    (val) => {
        if (val.length) {
            const valdata = val[0] as any;
            store.state.wrongbook.currentSelectedBookName = `${valdata.Name}`;
            store.state.wrongbook.currentSubjectId = valdata.Name;
            selectSubject(valdata.Id);
            if (props.currentLessonId) {
                form.value.Id = props.currentLessonId;
            } else {
                form.value.Id = valdata.Id;
            }
            form.value = Object.assign(form.value, props.parentSearch);
            state.lessonName = valdata.Name;
            queryLeftMeunByKnowledge(form.value);
        }
    },
    { deep: true }
);
//输入关键词搜索
const codeInput = () => {
    debounce(queryLeftMeunByKnowledge, 500, form.value);
};
//时间
const timeOut = ref<any>("");
//关键词搜索-防抖函数
const debounce = (func: Function, wait: number, params: any) => {
    if (timeOut.value) clearTimeout(timeOut.value);
    timeOut.value = setTimeout(() => {
        func(params);
    }, wait);
};

//按知识点查询左侧树
const queryLeftMeunByKnowledge = async (params: LeftMenuParams) => {
    state.loading = true;
    const res: any = await searchLeftMeunByKnowledge(params);
    if (res.resultCode === 200) {
        state.loading = false;
        state.treeData = res.result;
        emitter.emit("packButton");
        // console.log("state.treeData ", state.treeData);
        const knowledgeLibId = state.treeData?.length
            ? state.treeData[0].Id
            : "";
        // store.state.wrongbook.currentPaperName = state.treeData[0].Name;
        // console.log("knowledgeLibId", knowledgeLibId);
        // console.log("state.lessonName", state.lessonName);

        selectedID.value = knowledgeLibId;
        emitter.emit("errorBookEmit", {
            lessonName: state.lessonName,
            wrongType: props.currentWrongType,
            KnowledgeLibId: knowledgeLibId,
            bookId: form.value.Id,
            ...props.parentSearch,
        });
    } else {
        state.treeData = [];
        state.loading = false;
    }
};
//选择知识点 筛选 按知识点树
const changeKnowledgeLab = (data: string) => {
    state.lessonName = knowledgeLabList.value.find(
        (item: any) => item.Id == data
    )?.Name;
    store.state.wrongbook.currentSelectedBookName = state.lessonName;
    store.state.wrongbook.currentSubjectId = state.lessonName;
    selectSubject(data);
    emit("update:currentLessonId", data);
    form.value.Id = data;
    queryLeftMeunByKnowledge(form.value);
};
//树结构选中
const selectedChapter = (val: any) => {
    const KnowledgeLibId = val.Id || "";
    const KnowledgeLibName = val.Name || "";
    emitter.emit("errorBookEmit", {
        lessonName: state.lessonName || "",
        KnowledgeLibName,
        KnowledgeLibId,
        bookId: form.value.Id,
        wrongType: props.currentWrongType,
        ...props.parentSearch,
    });
};
watch(
    () => props.currentWrongType,
    (val) => {
        console.log("props.currentWrongType", props.currentWrongType);
        form.value = Object.assign(form.value, props.parentSearch);
        queryKnowledgeLabList({
            gradeId: props.gradeId || "39F766472E38409F4E61E0D93DB1238F",
        });
    },
    {
        deep: true,
    }
);
onMounted(() => {
    provide("classId", props.parentSearch.ClassId);
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
        height: calc(100% - 7rem);
        overflow: auto;
    }
}
</style>
