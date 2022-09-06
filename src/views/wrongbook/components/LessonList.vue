<template>
    <div class="lessonlist">
        <h3>{{ state.currentIndexName }}</h3>
        <div class="wrongbook-list">
            <div
                class="list-item"
                v-for="(item, index) in (state.errorQuestionList as any)"
                :key="item.QuestionId"
            >
                <div class="item-content">
                    <div class="item-index">{{ index + 1 }}</div>
                    <div class="item-title">
                        <div class="wrongtype">
                            {{ formatQuestionType(item.QuestionType) }}
                        </div>
                        <div class="content">
                            <p class="title">{{ item.QuestionText }}</p>
                            <p class="desc">
                                知识点：{{
                                    item.QuestionKnowledges?.length
                                        ? item.QuestionKnowledges?.join(",")
                                        : "暂无"
                                }}
                            </p>
                        </div>
                    </div>
                    <div class="item-middle">
                        <div
                            class="frequency"
                            v-if="
                                props.currentWrongType == 3 ||
                                props.currentWrongType == 4
                            "
                        >
                            <p class="title">出现频次</p>
                            <p class="count">1次</p>
                        </div>
                        <div
                            class="ratedata"
                            v-if="
                                props.currentWrongType == 3 ||
                                props.currentWrongType == 4
                            "
                        >
                            <el-progress
                                :show-text="false"
                                type="circle"
                                :percentage="25"
                                :width="40"
                            />
                            <div class="content">
                                <p class="title">最近完成率</p>
                                <p class="rate">90%</p>
                            </div>
                        </div>
                        <div
                            class="ratedata"
                            v-if="
                                props.currentWrongType == 3 ||
                                props.currentWrongType == 4
                            "
                        >
                            <el-progress
                                :show-text="false"
                                type="circle"
                                :percentage="25"
                                :width="40"
                            />
                            <div class="content">
                                <p class="title">最近错误率</p>
                                <div class="rate">
                                    <span> 20% </span>
                                    <!-- <div class="arrow">
                                        <img
                                            src="~@/assets/images/wrongbook/arrow_next_rest1.png"
                                            alt=""
                                        />
                                        <div class="bg"></div>
                                    </div> -->
                                    <div class="arrowtwo">
                                        <img
                                            src="~@/assets/images/wrongbook/arrow_next_rest.png"
                                            alt=""
                                        />
                                        <div class="bg"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            class="ratedata"
                            v-if="
                                props.currentWrongType == 1 ||
                                props.currentWrongType == 2
                            "
                        >
                            <el-progress
                                :show-text="false"
                                type="circle"
                                :percentage="
                                    Math.floor(
                                        ((item.TotalNoSure +
                                            item.TotalRight +
                                            item.TotalWrong) /
                                            item.Total) *
                                            100
                                    )
                                "
                                :width="40"
                            />
                            <div class="content">
                                <p class="title">完成率</p>
                                <p class="rate">
                                    {{
                                        Math.floor(
                                            ((item.TotalNoSure +
                                                item.TotalRight +
                                                item.TotalWrong) /
                                                item.Total) *
                                                100
                                        )
                                    }}%
                                </p>
                            </div>
                        </div>
                        <div
                            class="ratedata"
                            v-if="
                                props.currentWrongType == 1 ||
                                props.currentWrongType == 2
                            "
                        >
                            <el-progress
                                :show-text="false"
                                type="circle"
                                :percentage="
                                    Math.floor(
                                        (item.TotalWrong /
                                            (item.TotalNoSure +
                                                item.TotalRight +
                                                item.TotalWrong)) *
                                            100
                                    )
                                "
                                :width="40"
                            />
                            <div class="content">
                                <p class="title">平均错误率</p>
                                <p class="rate">
                                    {{
                                        Math.floor(
                                            (item.TotalWrong /
                                                (item.TotalNoSure +
                                                    item.TotalRight +
                                                    item.TotalWrong)) *
                                                100
                                        )
                                    }}%
                                </p>
                            </div>
                        </div>
                        <div
                            class="wrong-ratedata"
                            v-if="
                                props.currentWrongType == 1 ||
                                props.currentWrongType == 2
                            "
                        >
                            <p class="title">分层错误率</p>
                            <p
                                class="text"
                                v-if="
                                    item.TagWrongRatio &&
                                    item.TagWrongRatio?.length
                                "
                            >
                                A {{ formatWrongRatio("A", item) }}， B
                                {{ formatWrongRatio("B", item) }}， C
                                {{ formatWrongRatio("C", item) }}
                            </p>
                            <span v-else>暂未分层</span>
                        </div>
                    </div>
                </div>

                <div class="item-operate">
                    <div class="operate-btn">
                        <img
                            src="~@/assets/images/wrongbook/icon_voice.png"
                            alt=""
                        />
                        <span>讲解题目</span>
                    </div>
                    <div class="operate-btn">
                        <img
                            src="~@/assets/images/wrongbook/icon_tonglei.png"
                            alt=""
                        />
                        <span>查看同类题</span>
                    </div>
                    <div
                        class="operate-btn"
                        @click="openWrongDetails('isshowdetails')"
                    >
                        <img
                            src="~@/assets/images/wrongbook/icon_tmxq.png"
                            alt=""
                        />
                        <span>题目详情</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- <div class="paginations">
        <el-pagination
            v-model:currentPage="pagers.currentPage"
            v-model:page-size="pagers.pageSize"
            :page-sizes="[100, 200, 300, 400]"
            :background="true"
            layout=" prev, pager, next, sizes, jumper"
            :total="400"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
    </div> -->
</template>
<script lang="ts" setup>
import {
    ref,
    defineEmits,
    defineProps,
    watch,
    reactive,
    onMounted,
    nextTick,
    onBeforeUnmount,
} from "vue";
import emitter from "@/utils/mitt"; //全局事件总线
import {
    getErrorQuestionListByHomework,
    QuestionListByHomeworkParams,
} from "@/api/errorbook";
import useWrongBook from "../hooks/useWrongBook";
const { questionTypeList } = useWrongBook();
//过滤问题类型成文本
const formatQuestionType = (type: number) => {
    // console.log("type", type, questionTypeList.value);
    return questionTypeList.value.find((item: any) => item.ID.includes(type))
        ?.Name;
};
const props = defineProps({
    currentWrongType: {
        type: Number,
        default: null,
        required: true,
    },
});
//按作业维度的查询参数
const homeworkParams = reactive<QuestionListByHomeworkParams>({
    ClassHomeworkPaperId: "",
    SortContent: 1,
    SortTagLevel: 0,
    SortType: 1,
});
const state = reactive({
    //错题列表
    errorQuestionList: [],
    //当前作左侧树选中的名称
    currentIndexName: "",
});

const emit = defineEmits(["openWrongDetails"]);
//过滤分层错误率
const formatWrongRatio = (type: string, data: any) => {
    const level = type == "A" ? 300 : type == "B" ? 200 : type == "C" ? 100 : 0;
    if (data.TagWrongRatio && data.TagWrongRatio.length) {
        const ratioData = data.TagWrongRatio.find(
            (item: any) => item.TagLevel == level
        );
        if (ratioData) {
            return `${Math.floor(ratioData.WrongRatio) * 100}%`;
        } else {
            return "暂无学生";
        }
    }
};
//按作业维度查询题目列表
const queryErrorQuestionListByHomework = async (
    params: QuestionListByHomeworkParams
) => {
    console.log("queryErrorQuestionListByHomework-params", params);
    // params.ClassHomeworkPaperId = undefined; //临时赋值，后面删
    const res: any = await getErrorQuestionListByHomework(params);
    console.log("queryErrorQuestionListByHomework-list", res);
    if (res.success && res.resultCode == 200) {
        state.errorQuestionList = res.result;
    }
};
//分页参数
const pagers = ref({
    currentPage: 1,
    pageSize: 10,
});
//分页改变
const handleSizeChange = (val: number) => {
    console.log(`${val} items per page`);
};
//分页改变
const handleCurrentChange = (val: number) => {
    console.log(`current page: ${val}`);
};
//打开错题本详情页
const openWrongDetails = (data?: any) => {
    console.log(123);
    emit("openWrongDetails", data);
};
// watch(
//     () => props.currentWrongType,
//     (type: number) => {
//         if (type === 1) {
//             queryErrorQuestionListByHomework(homeworkParams);
//         }
//     },
//     { deep: true }
// );
onMounted(() => {
    const wrongType = props.currentWrongType;
    nextTick(() => {
        emitter.on("errorBookEmit", (data) => {
            homeworkParams.ClassHomeworkPaperId = data.id;
            state.currentIndexName = data.name || "";
            console.log(
                "ClassHomeworkPaperId",
                homeworkParams.ClassHomeworkPaperId
            );
            //初始化时去查对应的维度的题目列表
            queryFuntion(wrongType, homeworkParams.ClassHomeworkPaperId);
        });
    });
});
//按照不同维度去查询不同的题目列表
const queryFuntion = (type: number, params: any) => {
    console.log("type,params", type, params);
    switch (type) {
        case 1: {
            homeworkParams.ClassHomeworkPaperId = params;
            queryErrorQuestionListByHomework(homeworkParams);
        }
    }
};
onBeforeUnmount(() => {
    emitter.off("errorBookEmit");
});
</script>
<style lang="scss" scoped>
.lessonlist {
    height: calc(100% - 48px);
    background-color: #fff;
    padding: 16px;
    overflow: auto;
    h3 {
        font-size: 18px;
        font-family: HarmonyOS_Sans_SC_Bold;
        font-weight: bold;
        color: #19203d;
    }
    .wrongbook-list {
        margin-top: 14px;
        .list-item {
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
            background: #f9fafc;
            width: 100%;
            padding: 14px 18px;
            margin-bottom: 10px;
            .item-content {
                display: flex;
                align-items: center;
                width: 70%;
                .item-index {
                    font-size: 16px;
                    color: #19203d;
                    font-weight: bold;
                }
                .item-title {
                    display: flex;
                    align-items: center;
                    margin-left: 18px;
                    .wrongtype {
                        width: 50px;
                        // height: 20px;
                        padding: 4px;
                        border-radius: 2px;
                        border: 1px solid rgba(75, 113, 238, 0.3);
                        font-size: 13px;
                        color: #4b71ee;
                    }
                    .content {
                        margin-left: 18px;
                        .title {
                            font-size: 16px;
                            font-family: HarmonyOS_Sans_SC;
                            color: #19203d;
                            width: 170px;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }
                        .desc {
                            padding-top: 6px;
                            font-size: 14px;
                            font-family: HarmonyOS_Sans_SC;
                            color: #a7aab4;
                        }
                    }
                }
                .item-middle {
                    margin-left: 68px;
                    display: flex;
                    align-items: center;
                    .frequency {
                        margin-right: 26px;
                        .title {
                            color: #5f626f;
                        }
                        .count {
                            color: #19203d;
                            padding-top: 6px;
                        }
                    }
                    .ratedata {
                        display: flex;
                        align-items: center;
                        margin-right: 26px;
                        justify-content: flex-start;
                        .content {
                            margin-left: 14px;
                            color: #5f626f;
                        }
                        .rate {
                            color: #19203d;
                            padding-top: 6px;
                            display: flex;
                            .arrow {
                                position: relative;
                                img {
                                    position: absolute;
                                    bottom: 0px;
                                    left: 3px;
                                }
                                .bg {
                                    width: 1px;
                                    height: 9px;
                                    border: 1px solid #2ee18e;
                                    position: absolute;
                                    top: 1px;
                                    left: 5px;
                                }
                            }
                            .arrowtwo {
                                position: relative;
                                img {
                                    position: absolute;
                                    top: 0px;
                                    left: 4px;
                                }
                                .bg {
                                    width: 1px;
                                    height: 9px;
                                    border: 1px solid #ff6b6b;
                                    position: absolute;
                                    bottom: 1px;
                                    left: 5px;
                                }
                            }
                        }
                    }
                    .wrong-ratedata {
                        .title {
                            color: #5f626f;
                        }
                        .text {
                            color: #19203d;
                            padding-top: 6px;
                        }
                        span {
                            font-size: 14px;
                            font-family: HarmonyOS_Sans_SC_Medium;
                            color: #a7aab4;
                            padding-top: 6px;
                            display: block;
                        }
                    }
                }
            }
            .item-operate {
                display: flex;
                align-items: center;
                .operate-btn {
                    display: flex;
                    align-items: center;
                    margin-left: 24px;
                    span {
                        font-size: 15px;
                        padding-left: 4px;
                        color: #4b71ee;
                    }
                }
            }
        }
    }
}
.paginations {
    text-align: right;
    padding: 0 16px;
}
</style>
