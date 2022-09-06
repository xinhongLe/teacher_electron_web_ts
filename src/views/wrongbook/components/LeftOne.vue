<template>
    <div class="leftone">
        <div>
            <el-cascader
                size="small"
                style="width: 100%"
                v-model="state.currentBookId"
                :props="cascaderProps"
                :options="state.subjectPublisherBookList"
                @change="changeBook"
                clearable
            ></el-cascader>
        </div>
        <div class="leftone-input">
            <el-input
                size="small"
                style="width: 100%"
                v-model="form.Name"
                class="w-50 m-2"
                placeholder="请输入关键词"
                @input="queryLeftMenuByHomeWork(form)"
            >
                <template #prefix>
                    <el-icon><search /></el-icon>
                </template>
            </el-input>
        </div>
        <div class="leftone-list" v-loading="state.loading">
            <div
                class="list-item"
                :class="
                    item.PaperId == state.currentLessonIndex ? 'isActive' : ''
                "
                v-for="item in (state.lessonList as any)"
                :key="item.PaperId"
                @click="switchLessonCard(item)"
            >
                <div class="item-top">
                    <div class="item-top-con">
                        <div class="top-icon">
                            <img
                                v-if="item.PaperId == state.currentLessonIndex"
                                src="~@/assets/images/wrongbook/icon_timu_active.png"
                                alt=""
                            />
                            <img
                                v-else
                                src="~@/assets/images/wrongbook/icon_timu.png"
                                alt=""
                            />
                        </div>
                        <div class="top-title">{{ item.PaperName }}</div>
                    </div>

                    <div class="top-count">{{ item.ErrQuestionTotal }}题</div>
                </div>
                <div class="item-bto">
                    <span>{{ item.PublishTime }}</span>
                </div>
            </div>
            <p
                v-if="!state.lessonList.length"
                style="text-align: center; margin-top: 20%"
            >
                暂无数据
            </p>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { reactive, ref, defineProps, watch, onMounted, nextTick } from "vue";
import { Search } from "@element-plus/icons-vue";
import { searchLeftMenuByHomeWork, LeftMenuParams } from "@/api/errorbook";
import { fetchSubjectPublisherBookList } from "@/views/preparation/api";
import emitter from "@/utils/mitt"; //全局事件总线
import useBookList from "@/views/assignHomework/hooks/useBookList";
const { cascaderProps } = useBookList();

const props = defineProps({
    parentSearch: {
        type: Object,
        default: () => {},
    },
});
//数据源
const state = reactive({
    currentLessonIndex: "",
    lessonList: [],
    loading: false,
    subjectPublisherBookList: [],
    currentBookId: [] as string[],
});
//搜索区域表单
const form = ref({
    BookId: "",
    Name: "",
});
const getSubjectPublisherBookList = async () => {
    const res: any = await fetchSubjectPublisherBookList();
    if (res.resultCode === 200) {
        state.subjectPublisherBookList = res.result;
        if (state.subjectPublisherBookList.length) {
            form.value.BookId =
                state.subjectPublisherBookList[0].Children![0].Children![0].Value;
            console.log("form.value.BookId", form.value.BookId);
        }
    }
};
//下面是请求方法
//切换左侧课程卡片
const switchLessonCard = (item: any) => {
    console.log(item);
    state.currentLessonIndex = item.PaperId;
    if (state.currentLessonIndex) {
        emitter.emit("errorBookEmit", {
            id: state.currentLessonIndex,
            name: item.PaperName,
        });
    }
};
//查询左侧树的方法
const queryLeftMenuByHomeWork = async (params: LeftMenuParams) => {
    state.loading = true;
    console.log("params", params);
    // params.ClassId = "39FC0056AFEFD89BD1CC692D003B59C3";//临时赋值，后面删
    const res: any = await searchLeftMenuByHomeWork(params);
    console.log(res);
    if (res.resultCode === 200) {
        state.loading = false;
        state.lessonList = res.result;
        state.currentLessonIndex = state.lessonList.length
            ? state.lessonList[0]?.PaperId
            : "";
        const currentLessonName = state.lessonList.length
            ? state.lessonList[0]?.PaperName
            : "";
        emitter.emit("errorBookEmit", {
            id: state.currentLessonIndex,
            name: currentLessonName,
        });
    } else {
        state.lessonList = [];
        state.loading = false;
    }
};
//改变左侧书册下拉
const changeBook = (value: string) => {
    console.log(value);
    if (value && value.length) {
        form.value.BookId = value[value.length - 1];
    } else {
        form.value.BookId = "";
    }
    queryLeftMenuByHomeWork(form.value);
};
watch(
    () => props.parentSearch,
    (data) => {
        console.log("data", data);
        form.value = Object.assign(form.value, data);
        queryLeftMenuByHomeWork(form.value);
    },
    {
        deep: true,
        // immediate: true,
    }
);
watch(
    () => state.subjectPublisherBookList,
    (v) => {
        state.currentBookId = [
            v[0].Value,
            v[0].Children![0].Value,
            v[0].Children![0].Children![0].Value,
        ];
    },
    { deep: true }
);
watch(
    () => state.currentBookId,
    (v) => {
        console.log("vvvv", v);
        form.value.BookId = v ? v[2] : "";
        const params = Object.assign(form.value, props.parentSearch);
        queryLeftMenuByHomeWork(params);
    }
);

onMounted(() => {
    getSubjectPublisherBookList();
});
</script>
<style lang="scss" scoped>
.leftone {
    background-color: #fff;
    padding: 12px 16px;
    width: 100%;
    height: 100%;
    .leftone-input,
    .leftone-list {
        margin-top: 8px;

        .list-item {
            cursor: pointer;
            width: 100%;
            // height: 52px;
            background: #f9fafc;
            border-radius: 4px;
            margin-bottom: 8px;

            padding: 10px 14px;
            .item-top {
                display: flex;
                justify-content: space-between;
                align-items: center;
                .item-top-con {
                    display: flex;
                    align-items: center;
                    width: 80%;

                    .top-icon {
                        display: flex;
                        align-items: center;
                    }
                    .top-title {
                        width: 100%;
                        margin-left: 8px;
                        font-size: 15px;
                        font-family: HarmonyOS_Sans_SC;
                        color: #19203d;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                    }
                    .top-count {
                        font-size: 13px;
                        font-family: HarmonyOS_Sans_SC;
                        color: #a7aab4;
                    }
                }
            }
            .item-bto {
                margin-top: 7px;
                font-size: 13px;
                font-family: HarmonyOS_Sans_SC;
                color: #a7aab4;
                padding-left: 25px;
                width: 100%;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
        }
        .isActive {
            transition: 0.3s;
            background-color: #4b71ee;
            .top-title,
            .item-bto,
            .top-count {
                color: #fff !important;
            }
        }
    }
    .leftone-list {
        height: calc(100% - 80px);
        overflow: auto;
    }
}
</style>
