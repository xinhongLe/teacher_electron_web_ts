<template>
    <div class="wrongdetail-wrapper">
        <header class="wrongdetail-header">
            <div class="header-left">
                <img
                    src="~@/assets/images/wrongbook/icon_back.png"
                    alt=""
                    @click="backList"
                />
                <div class="title">{{ props.gradeName }}错题本</div>
                <div
                    class="desc"
                    v-if="
                        props.currentWrongType == 3 ||
                        props.currentWrongType == 4
                    "
                    style="margin-right: 5px"
                >
                    {{ state.lessonName }}
                </div>
                <div class="desc">{{ state.homeworkName }}</div>
                <span v-if="props.currentWrongType == 1"
                    >(发布于{{ state.publishTime }})</span
                >
                <span
                    v-if="
                        props.currentWrongType == 3 ||
                        props.currentWrongType == 4
                    "
                    >(筛选时间：{{
                        props.dateRange.length
                            ? `${props.dateRange[0]} ~ ${props.dateRange[1]}`
                            : ""
                    }})</span
                >
            </div>
            <div class="header-right">
                <el-select
                    size="small"
                    style="width: 140px; margin-right: 16px"
                    v-model="questionType"
                    clearable
                >
                    <el-option
                        v-for="item in questionTypeList"
                        :label="item.Name"
                        :value="item.ID"
                        :key="item.ID"
                    >
                    </el-option>
                </el-select>
            </div>
        </header>
        <main class="wrongdetail-main">
            <div class="main-left">
                <div class="search" v-if="props.currentWrongType == 1">
                    <el-select
                        size="small"
                        style="width: 100%"
                        v-model="questionTagType"
                        @change="changeTagType"
                    >
                        <el-option
                            v-for="item in state.tagTypeList"
                            :label="item.Name"
                            :value="item.ID"
                            :key="item.ID"
                        >
                        </el-option>
                    </el-select>
                </div>
                <div class="left-content">
                    <div
                        class="list-item2"
                        v-if="
                            props.currentWrongType == 1 ||
                            props.currentWrongType == 2
                        "
                        v-for="(item, index) in (state.wrongQuestionList as any)"
                        :key="item.QuestionId"
                        :class="
                            item.QuestionId == state.currentIndex
                                ? 'isActive'
                                : ''
                        "
                        @click="switchWrongItem(item)"
                    >
                        <div class="title2">
                            <div class="top">
                                <span>{{ index + 1 }}</span>
                                <p>
                                    {{ formatQuestionType(item.QuestionType) }}
                                </p>
                            </div>
                        </div>
                        <div class="ratedata2">
                            <el-progress
                                :show-text="false"
                                type="circle"
                                :percentage="
                                    Number(
                                        Number(
                                            (item.TotalWrong /
                                                (item.TotalNoSure +
                                                    item.TotalRight +
                                                    item.TotalWrong)) *
                                                100
                                        ).toFixed(1)
                                    )
                                "
                                :width="30"
                                :color="
                                    item.QuestionId == state.currentIndex
                                        ? '#fff'
                                        : '#FF6B6B'
                                "
                            />
                            <div class="content">
                                <p class="rate-title">平均错误率</p>
                                <p class="rate">
                                    {{
                                        Number(
                                            (item.TotalWrong /
                                                (item.TotalNoSure +
                                                    item.TotalRight +
                                                    item.TotalWrong)) *
                                                100
                                        ).toFixed(1)
                                    }}%
                                </p>
                            </div>
                        </div>
                    </div>
                    <!-- 旧版的左侧列表展示-先留着 -->
                    <div
                        v-else
                        class="list-item"
                        v-for="(item,index) in (state.wrongQuestionList as any)"
                        :key="item?.QuestionId"
                        :class="
                            item.QuestionId == state.currentIndex
                                ? 'isActive'
                                : ''
                        "
                        @click="switchWrongItem(item)"
                    >
                        <div class="title">
                            <div class="top">
                                <span>{{ index + 1 }}</span>
                                <p>
                                    {{ formatQuestionType(item.QuestionType) }}
                                </p>
                            </div>
                            <!-- <div class="bto">先数一数，再照样子涂一涂</div> -->
                            <div class="line"></div>
                        </div>
                        <!-- <div
                            class="ratedata"
                            v-if="
                                props.currentWrongType == 1 ||
                                props.currentWrongType == 2
                            "
                        >
                            <el-progress
                                :show-text="false"
                                type="circle"
                                :percentage="25"
                                :width="30"
                            />
                            <div class="content">
                                <p class="rate-title">平均错误率</p>
                                <p class="rate">90%</p>
                            </div>
                        </div> -->
                        <div class="ratedata-two">
                            <p>
                                出现频次<span>{{
                                    item.Homeworks?.length
                                }}</span>
                            </p>
                            <div class="wrong-rate">
                                最近错误率<span
                                    >{{
                                        formatRecentWrongRatio(item.Homeworks)
                                    }}%</span
                                >
                                <div
                                    class="arrowtwo"
                                    v-if="formatErrorCom(item.Homeworks) == 1"
                                >
                                    <img
                                        src="~@/assets/images/wrongbook/arrow_next_rest.png"
                                        alt=""
                                    />
                                    <div class="bg"></div>
                                </div>
                                <div
                                    class="arrow"
                                    v-if="formatErrorCom(item.Homeworks) == 2"
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
                </div>
            </div>

            <div class="main-right">
                <div v-if="errorQuestionDetails.QuestionInfo">
                    <div class="quersion-con">
                        <div class="con-top">
                            <div class="left">
                                <p class="types">
                                    {{
                                        formatQuestionType(
                                            errorQuestionDetails.QuestionInfo
                                                .QuestionType
                                        )
                                    }}
                                </p>
                                <div class="desc">
                                    <img
                                        src="~@/assets/images/wrongbook/icon_zhishidian.png"
                                        alt=""
                                    />
                                    <span
                                        >关联知识点：{{
                                            formatKnowledges(
                                                errorQuestionDetails
                                                    .QuestionInfo
                                                    .QuestionKnowledges
                                            )
                                        }}</span
                                    >
                                </div>
                            </div>
                            <div class="right">
                                <el-button
                                    type="primary"
                                    plain
                                    size="small"
                                    @click="explainQuestion()"
                                    >讲解题目</el-button
                                >
                                <el-button
                                    type="primary"
                                    plain
                                    size="small"
                                    @click="state.pureQuestionVisible = true"
                                    >查看同类题</el-button
                                >
                            </div>
                        </div>
                        <div class="contents">
                            {{
                                errorQuestionDetails.QuestionInfo
                                    .QuestionText || ""
                            }}
                        </div>
                        <div class="error-img">
                            <!-- <img ref="imgRef" :src="state.errorFiles" /> -->
                            <el-image
                                style="width: 334px"
                                :src="state.errorFiles"
                                :preview-src-list="[state.errorFiles]"
                                :initial-index="1"
                                fit="cover"
                            />
                        </div>
                        <div class="line"></div>
                    </div>
                    <div class="answer-details">
                        <div
                            class="top-title"
                            v-if="
                                props.currentWrongType == 1 ||
                                props.currentWrongType == 2
                            "
                        >
                            <p class="title">学生答题详情</p>
                            <div class="text-line">
                                <p class="text">
                                    答错
                                    <span>{{
                                        errorQuestionDetails.TotalWrong
                                    }}</span>
                                </p>
                                <div class="line"></div>
                                <p class="text">
                                    未答 <span>{{ unAnswer }}</span>
                                </p>
                                <div class="line"></div>
                                <p class="text">
                                    总答
                                    <span>{{ totalAnswer }}</span>
                                </p>
                                <div class="line"></div>
                                <p class="text">
                                    完成率 <span> {{ completeRate }}%</span>
                                </p>
                                <div class="line"></div>
                                <p class="text">
                                    平均错误率
                                    <span style="color: #ff6b6b"
                                        >{{ aveErrorRate }}%</span
                                    >
                                </p>
                            </div>
                        </div>
                        <div v-else class="top-title-two">
                            <div class="title">
                                <p class="text">学生答题详情</p>
                                <p class="switch">
                                    仅看重复错误的学生<el-switch
                                        size="small"
                                        style="padding-left: 8px"
                                        v-model="state.isRepeat"
                                    />
                                </p>
                            </div>
                            <div class="statistics" v-if="!state.isRepeat">
                                <div
                                    class="statistics-list"
                                    v-for="(item,index) in (state.statisticsList as any)"
                                    :key="index"
                                    @click="
                                        (state.currentStatisticIndex = index),
                                            switchStudentDetails(item)
                                    "
                                    :class="{
                                        isActive:
                                            state.currentStatisticIndex ==
                                            index,
                                    }"
                                >
                                    <div class="statistics-title">
                                        <img
                                            src="~@/assets/images/wrongbook/icon_timu.png"
                                            alt=""
                                        />
                                        <p>{{ item.Name }}</p>
                                    </div>
                                    <div class="dates">
                                        {{
                                            `${item.CreateTime}(周${formaWeek(
                                                item.WeekDay
                                            )})`
                                        }}
                                    </div>
                                    <div class="bot-rate">
                                        <div class="count-text">
                                            <p class="count">
                                                {{
                                                    item.TotalWrong +
                                                    item.TotalRight +
                                                    item.TotalNoSure
                                                }}
                                            </p>
                                            <p class="text">总答</p>
                                        </div>
                                        <div class="count-text">
                                            <p class="count">
                                                {{ item.TotalWrong }}
                                            </p>
                                            <p class="text">答错</p>
                                        </div>
                                        <div class="count-text">
                                            <p class="count">
                                                {{
                                                    item.Total -
                                                    (item.TotalWrong +
                                                        item.TotalRight +
                                                        item.TotalNoSure)
                                                }}
                                            </p>
                                            <p class="text">未答</p>
                                        </div>
                                        <div class="count-text">
                                            <p class="count">
                                                {{
                                                    Number(
                                                        ((item.TotalNoSure +
                                                            item.TotalRight +
                                                            item.TotalWrong) /
                                                            item.Total) *
                                                            100
                                                    ).toFixed(1)
                                                }}%
                                            </p>
                                            <p class="text">完成率</p>
                                        </div>
                                        <div class="count-text">
                                            <p
                                                class="count"
                                                style="color: #f76b6b"
                                            >
                                                {{
                                                    Number(
                                                        (item.TotalWrong /
                                                            (item.TotalNoSure +
                                                                item.TotalRight +
                                                                item.TotalWrong)) *
                                                            100
                                                    ).toFixed(1)
                                                }}%
                                            </p>
                                            <p class="text">平均错误率</p>
                                        </div>
                                    </div>
                                    <div class="bto-arrow"></div>
                                </div>
                            </div>
                        </div>
                        <div
                            class="A-floor"
                            v-for="item in (state.detailList as any)"
                        >
                            <div class="top-area" @click="expendStudent(item)">
                                <div class="left">
                                    <p class="title">
                                        {{
                                            item.TagLevel == 300
                                                ? "A层"
                                                : item.TagLevel == 200
                                                ? "B层"
                                                : item.TagLevel == 100
                                                ? "C层"
                                                : "未标记"
                                        }}(<span>{{
                                            item.Students
                                                ? item.Students.length
                                                : 0
                                        }}</span
                                        >)
                                    </p>
                                    <p class="desc" v-if="!state.isRepeat">
                                        ( 答错
                                        <span>
                                            {{
                                                formatAnswerCount(
                                                    2,
                                                    item.Students
                                                        ? item.Students
                                                        : ""
                                                )
                                            }}</span
                                        >
                                        / 未答
                                        <span>
                                            {{
                                                formatAnswerCount(
                                                    1,
                                                    item.Students
                                                        ? item.Students
                                                        : ""
                                                )
                                            }}</span
                                        >
                                        / 总
                                        <span style="padding-right: 8px">
                                            {{
                                                item.Students
                                                    ? item.Students.length
                                                    : 0
                                            }}</span
                                        >
                                        完成率<span>
                                            {{
                                                Number(
                                                    item.FinishRatio * 100
                                                ).toFixed(1)
                                            }}%</span
                                        >
                                        / 错误率<span>
                                            {{
                                                Number(
                                                    item.WrongRatio * 100
                                                ).toFixed(1)
                                            }}%</span
                                        >
                                        )
                                    </p>
                                </div>
                                <div @click.stop="expendStudent(item)">
                                    <img
                                        :src="
                                            item.isExpend
                                                ? require('../../../assets/images/wrongbook/icon_shouqi.png')
                                                : require('../../..//assets/images/wrongbook/icon_xiala.png')
                                        "
                                        alt=""
                                    />
                                </div>
                            </div>
                            <div
                                class="person-list"
                                v-if="item.Students?.length && item.isExpend"
                            >
                                <div
                                    class="list-item"
                                    v-for="person in item.Students"
                                    :key="person.StudentId"
                                >
                                    <div class="top-data">
                                        <div class="images">
                                            <img :src="person.url" alt="" />
                                        </div>
                                        <div class="name-number">
                                            <p class="name">
                                                {{ person.Name }}
                                            </p>
                                            <p class="number">
                                                {{ person.Account }}
                                            </p>
                                        </div>
                                    </div>

                                    <div
                                        class="wrong-repeat"
                                        v-if="state.isRepeat"
                                    >
                                        <div class="wrong-count">
                                            答错<span>{{ 2 }}</span
                                            >次
                                        </div>
                                        <div class="line"></div>
                                        <div class="practise-count">
                                            练习<span>{{ 2 }}</span
                                            >次
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else>请先选择错题</div>
            </div>
        </main>
    </div>
    <!-- <div class="question-dialog">
        <el-dialog
            v-model="state.visible"
            :show-close="false"
            :close-on-click-modal="false"
            width="80%"
        >
            <template #title>
                <div class="my-header">讲解题目</div>
            </template>
            <lookQuestion
                v-if="state.isShowQuestion"
                :dialog="true"
                :close="close"
            >
            </lookQuestion>
        </el-dialog>
    </div>
    -->
    <PureQuestionDialog
        v-if="state.pureQuestionVisible"
        v-model:visible="state.pureQuestionVisible"
    />
</template>

<script lang="ts" setup>
import {
    ref,
    reactive,
    defineEmits,
    defineProps,
    watch,
    onMounted,
    onBeforeMount,
    computed,
} from "vue";
import PureQuestionDialog from "@/components/lookQuestion/PureQuestionDialog.vue";
import { lookQuestions } from "@/utils";
import emitter from "@/utils/mitt";
import {
    getErrorQuestionDetail,
    ErrorQuestionDetailParams,
    GetErrorQuestionDetail,
    ErrorQuestionDetails,
    QuestionListByHomeworkParams,
    getErrorQuestionListByHomework,
} from "@/api/errorbook";
import { getOssUrl } from "@/utils/oss";
import useWrongBook from "../hooks/useWrongBook";
const {
    questionTypeList,
    formatRecentWrongRatio,
    formatErrorCom,
    formatRecentRatio,
    formatQuestionType,
} = useWrongBook();
const props = defineProps({
    currentWrongType: {
        type: Number,
        default: null,
        required: true,
    },
    gradeName: {
        type: String,
        default: "",
    },
    //当前选中的时间区间
    dateRange: {
        type: Array,
        default: () => [],
    },
});
//过滤知识点
const formatKnowledges = (data: any) => {
    if (data.length) {
        const newdata = data.map((item: any) => {
            return item.Name;
        });
        return newdata.join(",");
    }
};
//过滤文件
const formatFiles = async (data: any) => {
    if (!data) return;
    const { FileName, FilePath, Bucket, Extention } = data;
    const key = `${FilePath}/${FileName}.${Extention}`;
    const url = await getOssUrl(key, Bucket);
    state.errorFiles = url;
    console.log("文件----", url);
};
//处理学生头像的
const formatStudentImg = async (data: any) => {
    if (!data) return;
    const { FileName, FilePath, Bucket, Extention } = data;
    const key = `${FilePath}/${FileName}.${Extention}`;
    const url = await getOssUrl(key, Bucket);
    return url;
};

const emit = defineEmits(["update:isShowDetails"]);
//题型
const questionType = ref("");
//分层筛选
const questionTagType = ref(1);
const state = reactive({
    errorFiles: "",
    isRepeat: false, //时候查看重复错误的学生
    tagTypeList: [
        {
            ID: 1,
            Name: "平均错误率由高到低",
        },
        {
            ID: 2,
            Name: "A层错误率由高到低",
        },
        {
            ID: 3,
            Name: "B层错误率由高到低",
        },
        {
            ID: 4,
            Name: "C层错误率由高到低",
        },
    ],
    //左边错题的列表
    wrongQuestionList: [],
    //初始化-备份做错错题列表
    initWrongQuestionList: [],
    //当前选中的错题项
    currentIndex: "",
    //答题详情list
    detailList: [
        // {
        //     TagId: 1,
        //     name: "A层",
        //     count: 0,
        //     isExpend: false,
        // },
        // {
        //     id: 2,
        //     name: "B层",
        //     count: 9,
        //     isExpend: false,
        //     studentList: [],
        // },
        // {
        //     id: 3,
        //     name: "C层",
        //     count: 11,
        //     isExpend: false,
        //     studentList: [],
        // },
        // {
        //     id: 4,
        //     name: "未标记",
        //     count: 0,
        //     isExpend: false,
        //     studentList: [],
        // },
    ],
    //答题详情统计卡片list
    statisticsList: [
        // {
        //     id: 1,
        //     name: "求倍数的错题巩固联系",
        //     date: "2022-07-05 (周二)",
        // },
        // {
        //     id: 2,
        //     name: "求倍数的错题巩固联系",
        //     date: "2022-07-05 (周二)",
        // },
        // {
        //     id: 3,
        //     name: "求倍数的错题巩固联系",
        //     date: "2022-07-05 (周二)",
        // },
    ] as any,
    //当前选中的答题详情卡片
    currentStatisticIndex: 0,
    //讲解题目 公共组件显示
    isShowQuestion: false,
    //弹框
    visible: false,
    //查看同类问题
    pureQuestionVisible: false,
    //作业维度的发布时间-作业发布时间
    publishTime: "",
    //作业维度-作业题目
    homeworkName: "",
    //知识点维度-课程名称
    lessonName: "",
});
//按作业维度的左边列表查询参数
const homeworkParams = reactive<QuestionListByHomeworkParams>({
    ClassHomeworkPaperId: "",
    SortContent: 1, //排序字段
    SortTagLevel: 0, //等级
    SortType: 1, //排序类型
});
//错题详情data
const errorQuestionDetails = ref({
    QuestionInfo: {
        QuestionId: "",
        QuestionText: "",
        QuestionType: 0,
        QuestionKnowledges: [
            {
                ID: "",
                Name: "",
            },
        ],
        QuestionOriginFile: {},
    },
    Total: 0,
    TotalNoSure: 0,
    TotalRight: 0,
    TotalWrong: 0,
    RepeatWrongStudentTags: [
        {
            TagId: "",
            TagName: "",
            TagLevel: 0,
            Students: [],
        },
    ],
}) as any;
//选择详情-左侧-作业维度筛选分层下拉
const changeTagType = (value: any) => {
    console.log(value);
    if (value == 1) {
        //平均错误率由高到低
        homeworkParams.SortContent = 1;
        homeworkParams.SortTagLevel = 0; //等级
    } else if (value == 2) {
        //A层由高到低
        homeworkParams.SortContent = 2;
        homeworkParams.SortTagLevel = 300; //等级
    } else if (value == 3) {
        //B层由高到低
        homeworkParams.SortContent = 2;
        homeworkParams.SortTagLevel = 200; //等级
    } else {
        // 4 - C层错误率由高到低
        homeworkParams.SortContent = 2;
        homeworkParams.SortTagLevel = 100; //等级
    }
    queryListByHomework(homeworkParams);
};
//处理学生答题详情-分层情况的公共方法
const formatTagDetails = () => {
    state.detailList.forEach((item: any) => {
        item.isExpend = true;
        if (item.Students?.length) {
            item.Students.forEach(async (stu: any) => {
                if (!stu.HeadPortrait) return;
                //处理学生头像的
                const url = await formatStudentImg(stu.HeadPortrait);
                stu.url = url;
                console.log("学生头像", url);
            });
        }
    });
};
//切换学生答题详情-知识点章节维度
const switchStudentDetails = (data: any) => {
    console.log("学生答题错题情况", data);
    if (data?.Tags.length) {
        state.detailList = data.Tags;
        formatTagDetails();
    }
};
//计算答题情况-未答
const unAnswer = computed(() => {
    return (
        errorQuestionDetails.value.Total -
        (errorQuestionDetails.value.TotalNoSure +
            errorQuestionDetails.value.TotalRight +
            errorQuestionDetails.value.TotalWrong)
    );
});
//计算答题情况-总答
const totalAnswer = computed(() => {
    return (
        errorQuestionDetails.value.TotalNoSure +
        errorQuestionDetails.value.TotalRight +
        errorQuestionDetails.value.TotalWrong
    );
});
//计算答题情况-完成率
const completeRate = computed(() => {
    return Number(
        ((errorQuestionDetails.value.TotalNoSure +
            errorQuestionDetails.value.TotalRight +
            errorQuestionDetails.value.TotalWrong) /
            errorQuestionDetails.value.Total) *
            100
    ).toFixed(1);
});
//计算答题情况-平均错误率
const aveErrorRate = computed(() => {
    return Number(
        (errorQuestionDetails.value.TotalWrong /
            (errorQuestionDetails.value.TotalNoSure +
                errorQuestionDetails.value.TotalRight +
                errorQuestionDetails.value.TotalWrong)) *
            100
    ).toFixed(1);
});
//过滤分层-答错-未答
const formatAnswerCount = (type: number, data: any) => {
    if (!data || !data.length) return;
    switch (type) {
        case 1: //未答
            return data.filter((item: any) => {
                return item.Result == 0;
            }).length;
        case 2: //答错
            return data.filter((item: any) => {
                return item.Result == 2;
            }).length;
    }
};
//计算周几大写
const formaWeek = (num: number) => {
    switch (num) {
        case 1:
            return "一";
        case 2:
            return "二";
        case 3:
            return "三";
        case 4:
            return "四";
        case 5:
            return "五";
        case 6:
            return "六";
        case 7:
            return "日";
    }
};
//监听是否仅看重复错误的学生
watch(
    () => state.isRepeat,
    (value) => {
        console.log(value);

        console.log(
            "重复错误的学生分层----",
            errorQuestionDetails.value.RepeatWrongStudentTags
        );
        if (value) {
            state.detailList = errorQuestionDetails.value
                .RepeatWrongStudentTags as any;
            formatTagDetails();
        } else {
            state.detailList =
                state.statisticsList[state.currentStatisticIndex].Tags;
            formatTagDetails();
        }
    }
);
//监听问题类型改变
watch(
    () => questionType.value,
    (val) => {
        if (!state.initWrongQuestionList.length) return;
        if (val) {
            state.wrongQuestionList = state.initWrongQuestionList.filter(
                (item: any) => {
                    return val.includes(item.QuestionType);
                }
            );
            if (state.wrongQuestionList.length) {
                switchWrongItem(state.wrongQuestionList[0]);
            } else {
                errorQuestionDetails.value = {};
            }
        } else {
            state.wrongQuestionList = state.initWrongQuestionList;
        }
        // queryDetails(val.questionData);
    },
    { deep: true }
);
//关闭
const close = () => {
    console.log(12);
    state.isShowQuestion = false;
    state.visible = false;
};
//切换左侧错题项-差详情
const switchWrongItem = (item: any) => {
    state.currentIndex = item.QuestionId;
    console.log("差详情的参数", item);
    queryDetails(item);
};
//返回列表页
const backList = () => {
    emit("update:isShowDetails", false);
};
//展开收起学生列表
const expendStudent = (item: any) => {
    console.log(item);
    item.isExpend = !item.isExpend;
};

//讲解题目
const explainQuestion = () => {
    lookQuestions({ id: state.currentIndex, type: 0 });
};
//根据错题查询错题详情
const queryDetails = async (data: any) => {
    console.log("errorData-------", data);
    state.isRepeat = false;
    state.currentIndex = data.QuestionId || "";
    const params: ErrorQuestionDetailParams = {
        ClassHomeworkPaperQuestionIds:
            data.ClassHomeworkPaperQuestionIds || ([] as string[]),
        QuestionId: data.QuestionId || "",
    };
    //发起详情请求
    const res: GetErrorQuestionDetail = await getErrorQuestionDetail(params);
    console.log("errorData-Details-------", res);
    if (res.success && res.resultCode == 200) {
        errorQuestionDetails.value = res.result as ErrorQuestionDetails;
        // if (props.currentWrongType == 1) {
        if (res.result.Homeworks && res.result.Homeworks.length) {
            if (props.currentWrongType == 1) {
                state.detailList = res.result.Homeworks[0]?.Tags;
            } else {
                state.statisticsList = res.result.Homeworks;
                state.currentStatisticIndex = 0;
                if (state.statisticsList.length) {
                    state.detailList = state.statisticsList[0].Tags;
                }
            }
            if (!state.detailList.length) return;
            formatTagDetails();
        }

        //处理文件的-
        formatFiles(errorQuestionDetails.value.QuestionInfo.QuestionOriginFile);
    }
};
//作业维度-查询左边列表
const queryListByHomework = async (params: QuestionListByHomeworkParams) => {
    const res: any = await getErrorQuestionListByHomework(params);
    if (res.success && res.resultCode == 200) {
        state.wrongQuestionList = res.result;
        state.initWrongQuestionList = res.result;
    } else {
        state.wrongQuestionList = [];
        state.initWrongQuestionList = [];
    }
};
onMounted(() => {
    emitter.on("openErrorBookDetails", (val) => {
        console.log(val);
        questionType.value = "";
        if (!val) return;

        state.lessonName = val.lessonName;
        state.homeworkName = val.homeworkName;
        state.publishTime = val.publishTime;
        //作业维度-查左边的的列表
        if (props.currentWrongType == 1) {
            questionTagType.value = 1;
            homeworkParams.ClassHomeworkPaperId = val.classHomeworkPaperId;
            homeworkParams.SortContent = 1; //排序字段
            homeworkParams.SortTagLevel = 0; //等级
            homeworkParams.SortType = 1; //排序类型
            queryListByHomework(homeworkParams);
        } else {
            state.wrongQuestionList = val.questionList;
            state.initWrongQuestionList = val.questionList;
            console.log("左侧问题列表----", state.wrongQuestionList);
        }
        queryDetails(val.questionData);
    });
});
onBeforeMount(() => {
    emitter.off("openErrorBookDetails");
});
</script>
<style lang="scss" scoped>
.wrongdetail-wrapper {
    width: 100%;
    height: 100%;
    min-width: 0;
    min-height: 0;
    background: #f5f6fa;
    .wrongdetail-header {
        width: 100%;
        height: 56px;
        background: #ffffff;
        padding: 0 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .header-left {
            display: flex;
            align-items: center;
            img {
                cursor: pointer;
            }
            .title {
                margin-left: 20px;
                font-size: 18px;
                font-family: HarmonyOS_Sans_SC_Bold;
                color: #19203d;
                font-weight: bold;
                margin-right: 57px;
            }
            .desc {
                font-size: 15px;
                font-family: HarmonyOS_Sans_SC_Medium;
                color: #19203d;
                font-weight: bold;
            }
            span {
                padding-left: 8px;
                font-size: 13px;
                font-family: HarmonyOS_Sans_SC;
                color: #5f626f;
            }
        }
    }
    .wrongdetail-main {
        margin-top: 10px;
        display: flex;
        height: calc(100% - 66px);
        .main-left {
            width: 20%;
            .search {
                margin-bottom: 10px;
                padding: 0 1.6rem;
            }
            .left-content {
                height: calc(100% - 42px);
                overflow: auto;
                padding: 0 1.6rem;

                .list-item {
                    width: 100%;
                    background-color: #ffffff;
                    margin-bottom: 10px;
                    border-radius: 6px;
                    cursor: pointer;

                    .title {
                        padding: 14px 0 0 14px;
                        .top {
                            display: flex;
                            align-items: center;
                            margin-bottom: 10px;
                            font-size: 14px;
                            font-family: HarmonyOS_Sans_SC_Medium;
                            color: #19203d;
                            span {
                                padding-right: 3px;
                            }
                        }
                        .bto {
                            font-size: 12px;
                            font-family: HarmonyOS_Sans_SC;
                            color: #5f626f;
                            margin-bottom: 10px;
                        }
                        .line {
                            width: 100%;
                            height: 1px;
                            background: #f3f4f4;
                            // opacity: 0.11;
                        }
                    }
                    .ratedata {
                        padding: 10px 12px;
                        display: flex;
                        align-items: center;
                        .content {
                            margin-left: 12px;
                            font-size: 12px;
                            display: flex;
                            align-items: center;
                            .rate-title {
                                font-family: HarmonyOS_Sans_SC;
                                color: #5f626f;
                            }
                            .rate {
                                color: #fbc54c;
                                padding-left: 3px;
                            }
                        }
                    }
                    .ratedata-two {
                        padding: 12px 12px;
                        display: flex;
                        align-items: center;
                        p {
                            font-size: 12px;
                            color: #5f626f;
                            span {
                                padding-left: 3px;
                                color: #19203d;
                            }
                        }
                        .wrong-rate {
                            font-size: 12px;
                            color: #5f626f;
                            margin-left: 20px;
                            display: flex;
                            align-items: center;
                            span {
                                padding-left: 3px;
                                color: #f76b6b;
                            }
                        }
                    }
                }
                .list-item2 {
                    width: 100%;
                    background-color: #ffffff;
                    margin-bottom: 10px;
                    border-radius: 6px;
                    cursor: pointer;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    .title2 {
                        padding: 14px 0 0 14px;
                        .top {
                            display: flex;
                            align-items: center;
                            margin-bottom: 10px;
                            font-size: 14px;
                            font-family: HarmonyOS_Sans_SC_Medium;
                            color: #19203d;
                            span {
                                padding-right: 3px;
                            }
                        }
                        .bto {
                            font-size: 12px;
                            font-family: HarmonyOS_Sans_SC;
                            color: #5f626f;
                            margin-bottom: 10px;
                        }
                        .line {
                            width: 100%;
                            height: 1px;
                            background: #f3f4f4;
                            // opacity: 0.11;
                        }
                    }
                    .ratedata2 {
                        padding: 10px 12px;
                        display: flex;
                        align-items: center;
                        .content {
                            margin-left: 12px;
                            font-size: 12px;
                            // display: flex;
                            // align-items: center;
                            .rate-title {
                                font-family: HarmonyOS_Sans_SC;
                                color: #5f626f;
                            }
                            .rate {
                                color: #fbc54c;
                                padding-top: 5px;
                            }
                        }
                    }
                }
                .isActive {
                    transition: 0.3s;
                    background-color: #4b71ee !important;
                    .title,
                    .title2 {
                        .top,
                        .bto {
                            color: #ffffff !important;
                        }
                        .line {
                            background: #ffffff !important;
                            opacity: 0.21;
                        }
                    }
                    .ratedata,
                    .ratedata2 {
                        .rate-title {
                            color: #ffffff !important;
                            opacity: 0.8;
                        }
                        .rate {
                            color: #ffffff !important;
                        }
                    }
                    .ratedata-two {
                        p {
                            color: #ffffff !important;
                            span {
                                color: #ffffff !important;
                            }
                        }
                        .wrong-rate {
                            color: #ffffff !important;
                            span {
                                color: #ffffff !important;
                            }
                        }
                    }
                }
            }
        }
        .main-right {
            flex: 1;
            height: calc(100% - 16px);
            overflow: auto;
            padding: 16px;
            background-color: #ffffff;
            .quersion-con {
                .con-top {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    .left {
                        display: flex;
                        align-items: flex-end;
                        .types {
                            font-size: 16px;
                            font-family: HarmonyOS_Sans_SC_Bold;
                            color: #19203d;
                            font-weight: bold;
                        }
                        .desc {
                            display: flex;
                            align-items: center;
                            margin-left: 12px;
                            font-size: 13px;
                            font-family: HarmonyOS_Sans_SC;
                            color: #5f626f;
                        }
                    }
                    .right {
                        :deep(.el-button.el-button--primary) {
                            background-color: #ffffff;
                            border: 1px solid #98aef6;
                            font-size: 12px;
                            font-family: PingFangSC-Regular, PingFang SC;
                            font-weight: 400;
                            color: #4b71ee;
                        }
                        :deep(.el-button--primary:focus, .el-button--primary:hover) {
                            background-color: #4b71ee;
                            border: none;
                            color: #ffffff;
                        }
                    }
                }
                .contents {
                    // margin: 14px 0;
                }
                .error-img {
                    // width: 334px;
                    // height: 167px;
                    // margin-top: 12px;
                    // img {
                    //     width: 100%;
                    //     height: 100%;
                    // }
                }
                .line {
                    width: 100%;
                    height: 1px;
                    background: #f3f4f4;
                }
            }
            .answer-details {
                .top-title {
                    padding: 16px 0;
                    display: flex;
                    align-items: center;

                    .title {
                        font-size: 16px;
                        font-family: HarmonyOS_Sans_SC_Bold;
                        color: #19203d;
                        font-weight: bold;
                        margin-right: 12px;
                    }
                    .text-line {
                        display: flex;
                        align-items: center;
                        padding-top: 2px;
                        .text {
                            font-size: 12px;
                            color: #5f626f;
                            span {
                                padding-left: 3px;
                                color: #4b71ee;
                            }
                        }
                        .line {
                            width: 1px;
                            height: 12px;
                            background: #a7aab4;
                            opacity: 0.3;
                            margin: 0 12px;
                        }
                    }
                }
                .top-title-two {
                    padding: 16px 0;
                    .title {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        .text {
                            font-size: 16px;
                            font-family: HarmonyOS_Sans_SC_Bold;
                            color: #19203d;
                            font-weight: bold;
                            margin-right: 12px;
                        }
                        .switch {
                            font-size: 12px;
                            font-family: HarmonyOS_Sans_SC;
                            color: #19203d;
                        }
                    }
                    .statistics {
                        margin-top: 12px;
                        display: flex;
                        .statistics-list {
                            cursor: pointer;
                            width: 264px;
                            // height: 92px;
                            background: #ffffff;
                            border: 1px solid #e0e2e7;
                            padding: 8px 12px;
                            border-radius: 4px;
                            margin-right: 20px;
                            .statistics-title {
                                display: flex;
                                align-items: center;
                                p {
                                    margin-left: 5px;
                                    font-size: 14px;
                                    font-family: HarmonyOS_Sans_SC;
                                    color: #19203d;
                                }
                            }
                            .dates {
                                margin-top: 8px;
                                font-size: 12px;
                                font-family: HarmonyOS_Sans_SC;
                                color: #a7aab4;
                                padding-left: 22px;
                            }
                            .bot-rate {
                                margin-top: 8px;
                                display: flex;
                                align-items: center;
                                justify-content: space-around;
                                padding-left: 16px;
                                .count-text {
                                    display: flex;
                                    flex-direction: column;
                                    justify-content: center;
                                    align-items: center;
                                    font-size: 12px;
                                    .count {
                                        color: #4b71ee;
                                    }
                                    .text {
                                        margin-top: 2px;
                                    }
                                }
                            }
                        }
                        .isActive {
                            position: relative;
                            background: #e6ecff;
                            border: 1px solid #4b71ee;
                            transition: 0.3s;
                            .bto-arrow {
                                position: absolute;
                                bottom: -20px;
                                left: 47%;
                                display: block;
                                width: 0;
                                height: 0;
                                border: 10px solid transparent;
                                border-top-color: #4b71ee;
                            }
                            .bto-arrow:after {
                                content: "";
                                width: 0;
                                height: 0;
                                position: absolute;
                                left: -9px;
                                top: -10px;
                                border: 9px solid transparent;
                                border-top-color: #e6ecff;
                            }
                        }
                    }
                }
                .A-floor {
                    width: 100%;
                    background: #f9fafc;
                    border-radius: 4px;
                    padding: 14px 16px;
                    margin-bottom: 12px;
                    box-sizing: border-box;
                    .top-area {
                        width: 100%;
                        // height: 42px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        cursor: pointer;
                        .left {
                            display: flex;
                            align-items: center;
                            .title {
                                font-size: 14px;
                                font-family: HarmonyOS_Sans_SC_Medium;
                                color: #19203d;
                                font-weight: bold;
                                margin-right: 12px;
                            }
                            .desc {
                                font-size: 12px;
                                font-family: HarmonyOS_Sans_SC;
                            }
                        }
                    }
                    .person-list {
                        transition: 0.5s;
                        margin-top: 14px;
                        display: flex;
                        flex-wrap: wrap;
                        .list-item {
                            cursor: pointer;

                            background-color: #ffffff;
                            width: 167px;
                            border-radius: 5px;
                            margin-right: 12px;
                            margin-bottom: 12px;
                            .top-data {
                                padding: 10px 12px;
                                display: flex;
                                .images {
                                    width: 36px;
                                    height: 36px;
                                    img {
                                        width: 100%;
                                        height: 100%;
                                        border-radius: 50%;
                                    }
                                }
                                .name-number {
                                    margin-left: 16px;
                                    .name {
                                        font-size: 14px;
                                        font-family: HarmonyOS_Sans_SC;
                                        color: #19203d;
                                    }
                                    .number {
                                        font-size: 12px;
                                        font-family: HarmonyOS_Sans_SC;
                                        color: #a7aab4;
                                        margin-top: 5px;
                                    }
                                }
                            }

                            .wrong-repeat {
                                display: flex;
                                justify-content: space-around;
                                align-items: center;
                                // padding: 05px;
                                padding: 5px 8px;
                                font-size: 12px;
                                color: #a7aab4;
                                border-top: 1px solid #f3f4f4;
                                .wrong-count {
                                    span {
                                        color: #ff6b6b;
                                    }
                                }
                                .line {
                                    width: 1px;
                                    height: 12px;
                                    background: #e7e7e7;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    .arrow {
        position: relative;
        img {
            position: absolute;
            bottom: -7px;
            left: 3px;
        }
        .bg {
            width: 1px;
            height: 9px;
            border: 1px solid #2ee18e;
            position: absolute;
            top: -5px;
            left: 5px;
        }
    }
    .arrowtwo {
        position: relative;
        img {
            position: absolute;
            top: -7px;
            left: 4px;
        }
        .bg {
            width: 1px;
            height: 9px;
            border: 1px solid #ff6b6b;
            position: absolute;
            bottom: -5px;
            left: 5px;
        }
    }
}
.question-dialog {
    :deep(.el-dialog) {
        .el-dialog__header {
            // padding: 0;
        }
        .el-dialog__body {
            padding: 0;
        }
    }
    .my-header {
        font-size: 16px;
        font-family: HarmonyOS_Sans_SC_Bold;
        color: #19203d;
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
    }
}
</style>
