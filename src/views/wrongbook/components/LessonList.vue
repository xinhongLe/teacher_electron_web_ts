<template>
    <div class="lessonlist">
        <h3 v-if="state.errorQuestionList.length">
            {{ state.currentIndexName }}
        </h3>
        <div v-if="props.currentWrongType == 4" class="knowpoint">
            <p class="count">
                收录错题：<span style="color: #4b71ee">{{
                    state.errorQuestionList.length
                }}</span
                >题
            </p>
            <p class="rate">
                班级平均知识点掌握度：<span style="color: #4b71ee"
                    >{{
                        Number(state.AvgKnowledgeUnderstandRatio * 100).toFixed(
                            1
                        )
                    }}%</span
                >
                <span style="color: #a7aab4"
                    >（其中A层知识点掌握度
                    <span style="color: #4b71ee">
                        {{ avgWrongRatioA || 0 }}%</span
                    >，B层知识点掌握度
                    {{ avgWrongRatioB || 0 }}%，C层知识点掌握度
                    {{ avgWrongRatioC || 0 }}%）</span
                >
            </p>
        </div>
        <div class="wrongbook-list" v-if="state.errorQuestionList.length">
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
                            <p class="title" v-if="item.QuestionText">
                                {{ item.QuestionText }}
                            </p>
                            <p class="desc">
                                知识点：{{
                                    formatKnowledges(item.QuestionKnowledges) ||
                                    ""
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
                            <p class="count">{{ item.Homeworks?.length }}次</p>
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
                                :percentage="
                                    Number(formatRecentRatio(item.Homeworks))
                                "
                                :width="40"
                                color="#91A8F6"
                            />
                            <div class="content">
                                <p class="title">最近完成率</p>
                                <p class="rate">
                                    {{ formatRecentRatio(item.Homeworks) }}%
                                </p>
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
                                :percentage="
                                    Number(
                                        formatRecentWrongRatio(item.Homeworks)
                                    )
                                "
                                :width="40"
                            />
                            <div class="content">
                                <p class="title">最近错误率</p>
                                <div class="rate">
                                    <span>
                                        {{
                                            formatRecentWrongRatio(
                                                item.Homeworks
                                            )
                                        }}%
                                    </span>

                                    <div
                                        class="arrowtwo"
                                        v-if="
                                            formatErrorCom(item.Homeworks) == 1
                                        "
                                    >
                                        <img
                                            src="~@/assets/images/wrongbook/arrow_next_rest.png"
                                            alt=""
                                        />
                                        <div class="bg"></div>
                                    </div>
                                    <div
                                        class="arrow"
                                        v-if="
                                            formatErrorCom(item.Homeworks) == 2
                                        "
                                    >
                                        <img
                                            src="~@/assets/images/wrongbook/arrow_next_rest1.png"
                                            alt=""
                                        />
                                        <div class="bg"></div>
                                    </div>
                                    <div v-else></div>
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
                                    Number(
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
                                        Number(
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
                                    Number(
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
                                        Number(
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
                    <div class="operate-btn" @click="explainQuestion(item)">
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
                    <div class="operate-btn" @click="openWrongDetails(item)">
                        <img
                            src="~@/assets/images/wrongbook/icon_tmxq.png"
                            alt=""
                        />
                        <span>题目详情</span>
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="empty">
            <div class="emptyimg">
                <div class="img-text">
                    <img
                        src="~@/assets/images/wrongbook/pic_kongtai1.png"
                        alt=""
                    />
                    <p>暂无收录错题</p>
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
    computed,
} from "vue";
import { lookQuestions } from "@/utils";

import emitter from "@/utils/mitt"; //全局事件总线
import {
    getErrorQuestionListByHomework,
    QuestionListByHomeworkParams,
    getErrorQuestionListByChapterLesson,
    ChapterLessonParams,
    QuestionListByKnowledgeLibParams,
    getErrorQuestionListByKnowledgeLib,
    getBasicTag,
} from "@/api/errorbook";
import useWrongBook from "../hooks/useWrongBook";

const {
    questionTypeList,
    formatRecentWrongRatio,
    formatErrorCom,
    formatRecentRatio,
    formatQuestionType,
} = useWrongBook();

const formatKnowledges = (data: any) => {
    if (data.length) {
        const newdata = data.map((item: any) => {
            return item.Name;
        });
        return newdata.join(",");
    }
};
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
    //当前问题类型
    questionType: {
        type: Array || String || undefined,
        default: () => "",
    },
    //当前作业维度排序字段
    sortData: {
        type: Object,
        default: () => {},
    },
    //当前章节、知识点维度的频次
    frequency: {
        type: Number,
        default: 0,
    },
});
//按作业维度的查询参数
const homeworkParams = reactive<QuestionListByHomeworkParams>({
    ClassHomeworkPaperId: "",
    SortContent: 1,
    SortTagLevel: 0,
    SortType: 1,
});
//按章节维度查询参数
const chapterLessonParams = reactive<ChapterLessonParams>({
    ClassId: "",
    ChapterId: "",
    LessonId: "",
    QuestionType: props.questionType as number[],
    StartDate: "",
    EndDate: "",
});
//按照知识点维度的查询参数
const knowledgeLibParams = reactive<QuestionListByKnowledgeLibParams>({
    ClassId: "",
    KnowledgeLibId: "",
    StartDate: "",
    EndDate: "",
});
const state = reactive({
    //错题列表
    errorQuestionList: [],
    //初始化-错题列表
    initErrorQuestionList: [],
    //当前作左侧树选中的名称
    currentIndexName: "",
    //当前作左侧树选中的发布时间
    currentIndexTime: "",
    //基础分层标签list
    basicTagList: [],
    AvgKnowledgeUnderstandRatio: 0, //班级平均知识点掌握率
    TagKnowledgeUnderstandRatios: [], //分层知识点掌握率
    lessonName: "", //当前选中的左侧课程筛选-知识点
});
//过滤分层知识点掌握-方法
const formatTagFun = (type: number) => {
    if (state.TagKnowledgeUnderstandRatios.length) {
        const ratioData: any = state.TagKnowledgeUnderstandRatios.find(
            (item: any) => item.TagLevel == type
        );
        return ratioData
            ? Number(ratioData.KnowledgeUnderstandRatio * 100).toFixed(1)
            : "";
    }
};
//计算A层知识点掌握程度
const avgWrongRatioA = computed(() => {
    return formatTagFun(300);
});
//计算B层知识点
const avgWrongRatioB = computed(() => {
    return formatTagFun(200);
});
const avgWrongRatioC = computed(() => {
    return formatTagFun(100);
});
//监听问题类型
watch(
    () => props.questionType,
    (val) => {
        console.log(val);

        filterErrorListByType(val);
    },
    { deep: true }
);
//监听频次字段
watch(
    () => props.frequency,
    (val) => {
        console.log("频次字段", val);
        filterErrorListByFrequency(val);
    },
    { deep: true }
);
//监听排序字段
watch(
    () => props.sortData,
    (val) => {
        // console.log("props.sortData", val);
        if (props.currentWrongType == 1) {
            (homeworkParams.SortContent = val.currentSortCon),
                (homeworkParams.SortTagLevel = val.currentLevel),
                (homeworkParams.SortType = val.currentSortType);
            queryErrorQuestionListByHomework(homeworkParams);
        }
    },
    { deep: true }
);
//讲解题目
const explainQuestion = (data: any) => {
    console.log("讲解题目", data);
    lookQuestions({ id: data.QuestionId, type: 0 });
};

const emit = defineEmits(["update:isShowDetails"]);
//过滤分层错误率
const formatWrongRatio = (type: string, data: any) => {
    const level = type == "A" ? 300 : type == "B" ? 200 : type == "C" ? 100 : 0;
    if (data.TagWrongRatio && data.TagWrongRatio.length) {
        const ratioData = data.TagWrongRatio.find(
            (item: any) => item.TagLevel == level
        );
        if (ratioData) {
            return `${Number(ratioData.WrongRatio * 100).toFixed(1)}%`;
        } else {
            return "暂无学生";
        }
    }
};
//过滤平均知识点分层掌握率
const formatAvgWrongRatio = (type: string, data: any) => {
    const level = type == "A" ? 300 : type == "B" ? 200 : type == "C" ? 100 : 0;
    if (data.TagWrongRatio && data.TagWrongRatio.length) {
        const ratioData = data.TagWrongRatio.find(
            (item: any) => item.TagLevel == level
        );
        if (ratioData) {
            return `${Number(ratioData.WrongRatio * 100).toFixed(1)}%`;
        } else {
            return "暂无学生";
        }
    }
};
//根据问题类型筛选列表
const filterErrorListByType = (type: any) => {
    if (!state.initErrorQuestionList.length) return;
    if (type) {
        state.errorQuestionList = state.initErrorQuestionList.filter(
            (item: any) => {
                return type.includes(item.QuestionType);
            }
        );
    } else {
        state.errorQuestionList = state.initErrorQuestionList;
    }
};
//前端筛选-章节知识点维度-按照频次筛选列表
const filterErrorListByFrequency = (type: number) => {
    if (!state.initErrorQuestionList.length) return;
    if (type == 1 || type == 2) {
        state.errorQuestionList = state.initErrorQuestionList.filter(
            (item: any) => {
                return type == item.Homeworks.length;
            }
        );
    } else if (type == 3) {
        state.errorQuestionList = state.initErrorQuestionList.filter(
            (item: any) => {
                return item.Homeworks.length >= type;
            }
        );
    } else {
        state.errorQuestionList = state.initErrorQuestionList;
    }
};

//按作业维度查询题目列表
const queryErrorQuestionListByHomework = async (
    params: QuestionListByHomeworkParams
) => {
    // console.log("queryErrorQuestionListByHomework-params", params);
    const res: any = await getErrorQuestionListByHomework(params);
    if (res.success && res.resultCode == 200) {
        state.initErrorQuestionList = res.result;
        state.errorQuestionList = res.result;
        filterErrorListByType(props.questionType);
    } else {
        state.initErrorQuestionList = [];
        state.errorQuestionList = [];
    }
};
//按章节课时维度查询题目列表
const queryErrorQuestionListByChapterLesson = async (
    params: ChapterLessonParams
) => {
    // console.log("queryErrorQuestionListByChapterLesson-params", params);
    const res: any = await getErrorQuestionListByChapterLesson(params);
    if (res.success && res.resultCode == 200) {
        state.initErrorQuestionList = res.result;
        state.errorQuestionList = res.result;
        filterErrorListByType(props.questionType);
        filterErrorListByFrequency(props.frequency);
    } else {
        state.errorQuestionList = [];
        state.initErrorQuestionList = [];
    }
};
//按知识点维度查询题目列表
const queryErrorQuestionListByKnowledgeLib = async (
    params: QuestionListByKnowledgeLibParams
) => {
    // console.log("queryErrorQuestionListByKnowledgeLib-params", params);
    const res: any = await getErrorQuestionListByKnowledgeLib(params);
    if (res.success && res.resultCode == 200) {
        state.initErrorQuestionList = res.result.QuestionList;
        state.errorQuestionList = res.result.QuestionList;
        filterErrorListByType(props.questionType);
        filterErrorListByFrequency(props.frequency);
        state.AvgKnowledgeUnderstandRatio =
            res.result.AvgKnowledgeUnderstandRatio || [];
        state.TagKnowledgeUnderstandRatios =
            res.result.TagKnowledgeUnderstandRatios || [];
    } else {
        state.errorQuestionList = [];
        state.initErrorQuestionList = [];
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
    const params = {
        classHomeworkPaperId: homeworkParams.ClassHomeworkPaperId,
        homeworkName: state.currentIndexName,
        publishTime: state.currentIndexTime,
        questionData: data,
        questionList: state.errorQuestionList,
        lessonName: state.lessonName || "",
    };
    console.log(params);

    emitter.emit("openErrorBookDetails", params);
    emit("update:isShowDetails", true);
};
//获取基础分层标签
const queryBasicTag = async () => {
    const res: any = await getBasicTag();
    console.log(res);
    if (res.success && res.resultCode == 200) {
        state.basicTagList = res.result;
    }
};
onMounted(() => {
    // nextTick(() => {
    emitter.on("errorBookEmit", (data) => {
        // console.log("errorBookEmit", data);
        //初始化时去查对应的维度的题目列表
        queryFuntion(data);
    });
    // });

    // queryBasicTag();
});
//按照不同维度去查询不同的题目列表
const queryFuntion = (params: any) => {
    console.log("type-params", params);
    switch (params.wrongType) {
        case 1:
            homeworkParams.ClassHomeworkPaperId = params.id;
            state.currentIndexName = params.name || "";
            state.currentIndexTime = params.time || "";
            queryErrorQuestionListByHomework(homeworkParams);
            break;
        case 3:
            chapterLessonParams.ClassId =
                params.ClassId || "39F86691B2191CD9ED8E80B291F83635";
            state.currentIndexName = params.name || "";
            chapterLessonParams.StartDate = params.StartTime;
            chapterLessonParams.EndDate = params.EndTime;
            chapterLessonParams.ChapterId = params.chapterId;
            // params.lessonId ||
            chapterLessonParams.LessonId =
                params.lessonId || "39F7666ABDA60F4E7F69C4EB2CFE70E9";
            queryErrorQuestionListByChapterLesson(chapterLessonParams);
            break;
        case 4:
            knowledgeLibParams.ClassId =
                params.ClassId || "39F86691B2191CD9ED8E80B291F83635";
            state.currentIndexName = params.KnowledgeLibName || "";
            state.lessonName = params.lessonName || "";
            knowledgeLibParams.StartDate = params.StartTime;
            knowledgeLibParams.EndDate = params.EndTime;
            knowledgeLibParams.KnowledgeLibId = params.KnowledgeLibId;
            if (!knowledgeLibParams.KnowledgeLibId) {
                state.errorQuestionList = [];
                state.initErrorQuestionList = [];
                return;
            }
            queryErrorQuestionListByKnowledgeLib(knowledgeLibParams);
            break;
    }
};
onBeforeUnmount(() => {
    emitter.off("errorBookEmit");
    emitter.off("openErrorBookDetails");
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

    .knowpoint {
        margin-top: 10px;
        display: flex;
        .count {
            margin-right: 24px;
            font-size: 12px;
            font-family: HarmonyOS_Sans_SC;
            color: #5f626f;
        }
        .rate {
            font-size: 12px;
            font-family: HarmonyOS_Sans_SC;
            color: #5f626f;
        }
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
                            padding-bottom: 6px;
                            font-size: 16px;
                            font-family: HarmonyOS_Sans_SC;
                            color: #19203d;
                            width: 170px;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }

                        .desc {
                            color: #19203d;
                            font-size: 14px;
                            font-family: HarmonyOS_Sans_SC;
                            width: 170px;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            // color: #a7aab4;
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
                                    bottom: 2px;
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
                        font-size: 14px;
                        padding-left: 4px;
                        color: #4b71ee;
                    }
                }
            }
        }
    }
    .empty {
        padding: 16px;
        height: calc(100% - 22px);
        .emptyimg {
            height: 100%;

            position: relative;
            .img-text {
                width: 230px;
                height: 160px;
                background-color: #fff;
                position: absolute;
                top: 0;
                bottom: 10%;
                left: 0;
                right: 0;
                margin: auto;
                img {
                }
                p {
                    font-size: 14px;
                    font-family: HarmonyOS_Sans_SC;
                    color: #a7aab4;
                    margin-top: 15px;
                    text-align: center;
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
