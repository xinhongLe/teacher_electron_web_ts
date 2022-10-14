<template>
    <div class="lefttwo">
        <div class="lefttwo-input">
            <el-input
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
        <div class="lefttwo-list">
            <div
                class="list-item"
                :class="item.id == state.currentLessonIndex ? 'isActive' : ''"
                v-for="item in state.lessonList"
                :key="item.id"
                @click="switchLessonCard(item)"
            >
                <p class="title">{{ item.title }}</p>
                <p class="count">{{ item.count }}题</p>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { reactive, ref, watch } from "vue";
import { Search } from "@element-plus/icons-vue";
const props = defineProps({
    parentSearch: {
        type: Object,
        default: () => {},
    },
});
//搜索区域表单
const form = ref({
    keyword: "",
});

//数据源
const state = reactive({
    currentLessonIndex: 1,
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
});
// watch(
//     () => props.parentSearch,
//     (data) => {
//         console.log("data", data);
//         form.value = Object.assign(form.value, data);
//         queryLeftMenuByHomeWork(form.value);
//     },
//     {
//         deep: true,
//         // immediate: true,
//     }
// );

//下面是请求方法
//切换左侧课程卡片
const switchLessonCard = (item: any) => {
    console.log(item);
    state.currentLessonIndex = item.id;
};
</script>
<style lang="scss" scoped>
.lefttwo {
    background-color: #fff;
    padding: 12px 16px;
    width: 100%;
    .lefttwo-input,
    .lefttwo-list {
        margin-top: 8px;
        .list-item {
            cursor: pointer;
            width: 100%;
            // height: 52px;
            background: #f9fafc;
            border-radius: 4px;
            margin-bottom: 8px;
            padding: 10px 14px;
            display: flex;
            justify-content: space-between;
            .title {
                font-size: 14px;
                font-family: HarmonyOS_Sans_SC;
                color: #19203d;
            }
            .count {
                font-size: 12px;
                font-family: HarmonyOS_Sans_SC;
                color: #a7aab4;
            }
        }
        .isActive {
            transition: 0.3s;
            background-color: #4b71ee;
            .title,
            .count {
                color: #fff;
            }
        }
    }
}
</style>
