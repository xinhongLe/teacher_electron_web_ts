<template>
    <div class="leftthree">
        <el-select
            size="small"
            style="width: 100%; margin-right: 16px"
            v-model="form.class"
        >
            <el-option
                v-for="item in state.list"
                :label="item.Name"
                :value="item.ID"
                :key="item.ID"
            >
            </el-option>
        </el-select>
        <div class="leftthree-input">
            <el-input
                v-if="props.currentWrongType == 4"
                size="small"
                style="width: 100%"
                v-model="form.keyword"
                class="w-50 m-2"
                placeholder="请输入关键词"
            >
                <template #prefix>
                    <el-icon><search /></el-icon>
                </template>
            </el-input>
        </div>
        <div class="leftthree-list">
            <Tree
                @onTreeItemChange="selectedChapter"
                v-model:value="selectedID"
                :treeData="state.treeData"
            />
            <!-- :tipTarget="tipTarget"
                    :showClassArrangement="showClassArrangement" -->
        </div>
    </div>
</template>
<script lang="ts" setup>
import { reactive, ref, defineProps } from "vue";
import Tree from "./tree/index.vue";
import { Search } from "@element-plus/icons-vue";
const props = defineProps({
    currentWrongType: {
        type: Number,
        default: null,
        required: true,
    },
});
//搜索区域
const form = ref({
    class: "",
    keyword: "",
});
//项目id
const selectedID = ref("");
//数据源
const state = reactive({
    currentLessonIndex: 1,
    list: [
        {
            Name: "数学 苏教版 一上",
            ID: 1,
        },
    ],
    lessonList: [
        {
            id: 1,
            title: "单元考试",
            count: 12,
        },
        {
            id: 2,
            title: "期中考试",
            count: 20,
        },
        {
            id: 3,
            title: "期末考试",
            count: 20,
        },
    ],
    //项目数据源
    treeData: [
        {
            Id: "1",
            Name: "1 准备课",
            count: 20,
            Children: [
                {
                    Id: "1 - 1",
                    Name: "数一数",
                    count: 0,
                    Children: null,
                },
                {
                    Id: "1 - 2",
                    Name: "比多少",
                    count: 14,
                    Children: [
                        {
                            Id: "1 - 2 - 1",
                            Name: "比较物体大小",
                            count: 3,
                            Children: null,
                        },
                        {
                            Id: "1 - 2 - 2",
                            Name: "比较物体长短高低",
                            count: 4,
                            Children: null,
                        },
                        {
                            Id: "1 - 2 - 3",
                            Name: "比较物体轻重",
                            count: 5,
                            Children: null,
                        },
                        {
                            Id: "1 - 2 - 4",
                            Name: "比较物体多少",
                            count: 2,
                            Children: null,
                        },
                    ],
                },
            ],
        },
    ],
});

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
</script>
<style lang="scss" scoped>
.leftthree {
    background-color: #fff;
    padding: 12px 16px;
    width: 100%;
    .leftthree-input,
    .leftthree-list {
        margin-top: 8px;
    }
}
</style>
