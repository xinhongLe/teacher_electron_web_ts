<template>
    <div class="leftone" v-loading="state.loading">
        <div>
            <el-cascader
                style="width: 100%"
                v-model="state.currentBookId"
                :props="cascaderProps"
                :options="subjectPublisherBookList"
                ref="cascaderRef"
                @change="changeBook"
            ></el-cascader>
        </div>
        <div class="leftone-input">
            <el-input
                style="width: 100%"
                v-model="form.Name"
                class="w-50 m-2"
                placeholder="请输入关键词"
                clearable
                @input="codeInput"
            >
                <template #prefix>
                    <el-icon>
                        <search />
                    </el-icon>
                </template>
            </el-input>
        </div>
        <div class="leftone-list">
            <div
                v-if="state.lessonList.length"
                class="list-item"
                :class="
                    item.ClassPaperId == state.currentLessonIndex
                        ? 'isActive'
                        : ''
                "
                v-for="item in (state.lessonList as any)"
                :key="item.ClassPaperId"
                @click="switchLessonCard(item)"
            >
                <div class="item-top">
                    <div class="item-top-con">
                        <div class="top-icon">
                            <img
                                v-if="
                                    item.ClassPaperId ==
                                    state.currentLessonIndex
                                "
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
                    <!-- <span style="padding-left: 5px">{{
                        formatWeekDay(item.PublishTime)
                    }}</span> -->
                </div>
            </div>
            <p
                v-else
                style="text-align: center; margin-top: 20%; font-size: 14px"
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
import emitter from "@/utils/mitt"; //全局事件总线
import useBookList from "@/views/assignHomework/hooks/useBookList";
// import { subjectPublisherBookList } from "@/hooks/useSubjectPublisherBookList";
import useWrongBook from "@/views/wrongbook/hooks/useWrongBook";
import { formateNormDate, formatWeekDay } from "@/utils";
import { store } from "@/store";
const cascaderProps = {
    value: "Value",
    children: "Children",
    label: "Label",
};
const { subjectPublisherBookList, getErrorHomeworkBooks } = useWrongBook();

const props = defineProps({
    parentSearch: {
        type: Object,
        default: () => {},
    },
    currentWrongType: {
        type: Number,
        default: null,
        required: true,
    },
    currentHomeworkBookId: {
        type: Array,
        default: () => [],
    },
});
const emit = defineEmits(["update:currentHomeworkBookId", "selectSubject"]);
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
//下面是请求方法
//输入关键词搜索
const codeInput = () => {
    debounce(queryLeftMenuByHomeWork, 500, form.value);
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

//切换左侧课程卡片
const switchLessonCard = (item: any) => {
    console.log("切换左侧课程卡片", item);
    // store.state.wrongbook.currentPaperName = item.PaperName;
    state.currentLessonIndex = item.ClassPaperId;
    if (state.currentLessonIndex) {
        emitter.emit("errorBookEmit", {
            id: state.currentLessonIndex,
            classId: props.parentSearch.ClassId,
            bookId: form.value.BookId,
            name: item.PaperName,
            time: item.PublishTime,
            wrongType: props.currentWrongType,
        });
    }
};
//查询左侧树的方法
const queryLeftMenuByHomeWork = async (params: LeftMenuParams) => {
    state.loading = true;
    console.log("params", params, props.currentWrongType);

    // params.ClassId = "39FC0056AFEFD89BD1CC692D003B59C3";//临时赋值，后面删
    const res: any = await searchLeftMenuByHomeWork(params);
    console.log(res);
    if (res.resultCode === 200) {
        state.loading = false;
        state.lessonList = res.result;
        const lessonData: any = state.lessonList[0];
        state.currentLessonIndex = state.lessonList.length
            ? lessonData?.ClassPaperId
            : "";

        const currentLessonName = state.lessonList.length
            ? lessonData?.PaperName
            : "";
        // store.state.wrongbook.currentPaperName = currentLessonName;
        const currentLessonTime = state.lessonList.length
            ? lessonData?.PublishTime
            : "";
        emitter.emit("errorBookEmit", {
            id: state.currentLessonIndex,
            classId: props.parentSearch.ClassId,
            bookId: params.BookId,
            name: currentLessonName,
            time: currentLessonTime,
            wrongType: props.currentWrongType,
        });
    } else {
        state.lessonList = [];
        state.loading = false;
    }
};
//根据科目id查学生
const selectSubject = (subject: any) => {
    emit("selectSubject", subject);
};
const cascaderRef = ref<any>(null);
//改变左侧书册下拉
const changeBook = (value: string) => {
    store.state.wrongbook.currentSelectedBookName = cascaderRef.value
        .getCheckedNodes()[0]
        .pathLabels.join(" ");
    store.state.wrongbook.currentSubjectId = value[0];
    selectSubject(value[0]);
    emit("update:currentHomeworkBookId", value);
    if (value && value.length) {
        form.value.BookId = value[value.length - 1];
    } else {
        form.value.BookId = "";
    }
};
const initData = (v: any) => {
    form.value.BookId = v ? v[2] : "";
    const params = Object.assign(form.value, props.parentSearch);
    queryLeftMenuByHomeWork(params);
};
watch(
    () => props.parentSearch,
    async (data) => {
        console.log("data", data);
        const params = {
            ClassId: data.ClassId,
            StartTime: data.StartTime,
            EndTime: data.EndTime,
        };
        const res = await getErrorHomeworkBooks(params);
        form.value = Object.assign(form.value, data);
        // queryLeftMenuByHomeWork(form.value);
    },
    {
        deep: true,
        immediate: true,
    }
);
watch(
    () => subjectPublisherBookList.value,
    (v) => {
        if (!v.length) {
            state.lessonList = [];
            emitter.emit("clearErrorBookList");
            return;
        }
        // console.log("subjectPublisherBookList.value", v);
        // console.log(
        //     "----------currentHomeworkBookId",
        //     props.currentHomeworkBookId
        // );
        store.state.wrongbook.currentSelectedBookName = `${v[0].Label} ${
            v[0].Children![0].Label
        } ${v[0].Children![0].Children![0].Label}`;
        store.state.wrongbook.currentSubjectId = v[0].Value;
        selectSubject(v[0].Value);
        if (props.currentHomeworkBookId?.length) {
            state.currentBookId = props.currentHomeworkBookId as any;
            // initData(state.currentBookId);
        } else {
            state.currentBookId = [
                v[0].Value,
                v[0].Children![0].Value,
                v[0].Children![0].Children![0].Value,
            ];
        }
    },
    { deep: true }
);

watch(
    () => state.currentBookId,
    (v) => {
        if (!v.length) return;
        initData(v);
    },
    { deep: true }
);

// onMounted(() => {});
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
                }
                .top-count {
                    font-size: 13px;
                    font-family: HarmonyOS_Sans_SC;
                    color: #a7aab4;
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
