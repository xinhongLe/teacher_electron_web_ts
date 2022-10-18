<template>
    <div class="wrongbook-wrapper" v-show="state.isShowContent == 1">
        <header class="wrongbook-header">
            <div class="header-left-con" style="max-width: 30%">
                <div
                    style="padding-right: 10px; cursor: pointer"
                    @click="fnPrev()"
                    v-if="isShowIcon"
                >
                    <img
                        src="~@/assets/images/wrongbook/icon_left.png"
                        alt=""
                    />
                </div>
                <div class="fixedBox" ref="fixedBoxRef">
                    <div
                        class="header-left"
                        :style="
                            classList.length > 4
                                ? `width${
                                      signleWidth * fourClassList.length
                                  }px;transform:translate(${scrollResultWidth}px,0);transition:1s;`
                                : ''
                        "
                    >
                        <div
                            @click="switchClass(item)"
                            class="class-item"
                            :key="item.ID"
                            :class="
                                item.ID == state.currentClassId
                                    ? 'isActive'
                                    : ''
                            "
                            v-for="item in (fourClassList as any)"
                        >
                            <span>{{ item.Name }}</span>
                        </div>
                    </div>
                </div>
                <div
                    style="padding-left: 10px; cursor: pointer"
                    @click="fnNext()"
                    v-if="isShowIcon"
                >
                    <!-- v-if="isShowIcon && noScrollRight"  -->
                    <img
                        src="~@/assets/images/wrongbook/icon_right_qiehuan.png"
                        alt=""
                    />
                </div>
            </div>

            <div class="header-right">
                <el-button-group style="margin-right: 16px">
                    <el-button
                        size="small"
                        @click="
                            toFormatDate(item.id);
                            state.currentDateIndex = item.id;
                        "
                        v-for="item in state.dateButtonList"
                        :key="item.id"
                        :class="{
                            dateActive: item.id == state.currentDateIndex,
                        }"
                        >{{ item.name }}</el-button
                    >
                    <!-- <el-button size="small" @click="toFormatDate(1)"
                        >今日</el-button
                    >
                    <el-button size="small" @click="toFormatDate(3)"
                        >本周</el-button
                    > -->
                </el-button-group>
                <el-date-picker
                    size="small"
                    style="width: 225px"
                    v-model="state.dateRange"
                    type="daterange"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                    value-format="YYYY-MM-DD"
                    format="YYYY-MM-DD"
                    :clearable="false"
                />
            </div>
        </header>
        <main class="wrongbook-main">
            <header class="top-search">
                <div class="left-btn">
                    <el-button
                        size="small"
                        v-for="item in state.wrongTypeButtonList"
                        :key="item.id"
                        @click="
                            state.currentWrongType = item.id;
                            state.currentWrongTypeIndex = item.id;
                        "
                        :class="{
                            isActive: item.id == state.currentWrongTypeIndex,
                        }"
                        >{{ item.name }}</el-button
                    >
                </div>
                <div class="right-sel">
                    <span
                        class="tagtypelist"
                        v-if="state.currentWrongType == 1"
                    >
                        <el-select
                            size="small"
                            style="width: 170px"
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
                    </span>

                    <!-- 题型 -->
                    <el-select
                        size="small"
                        style="width: 140px; margin-right: 16px"
                        v-model="state.QuestionType"
                    >
                        <el-option
                            v-for="item in questionTypeList"
                            :label="item.Name"
                            :value="item.ID"
                            :key="item.ID"
                        >
                        </el-option>
                    </el-select>
                    <!-- 频次 -->
                    <el-select
                        v-if="
                            state.currentWrongType == 3 ||
                            state.currentWrongType == 4
                        "
                        size="small"
                        style="width: 140px"
                        v-model="state.Frequency"
                    >
                        <el-option
                            v-for="item in frequencyList"
                            :label="item.name"
                            :value="item.value"
                            :key="item.value"
                        >
                        </el-option>
                    </el-select>
                    <!-- <el-popover
                        trigger="hover"
                        v-model:visible="state.visible"
                        placement="bottom-start"
                        :width="250"
                    >
                        <div class="sortcontent">
                            <div class="sortcontent-list">
                                <p
                                    @click="
                                        (sortData.currentSortCon = item.value),
                                            (sortDataName.currentSortConName =
                                                item.name)
                                    "
                                    v-for="item in state.SortContentList"
                                    :key="item.value"
                                    :class="{
                                        isActive:
                                            item.value ==
                                            sortData.currentSortCon,
                                    }"
                                >
                                    {{ item.name }}
                                </p>
                            </div>
                            <div
                                class="sortcontent-list"
                                v-if="sortData.currentSortCon == 2"
                            >
                                <p
                                    @click="
                                        (sortData.currentLevel = item.value),
                                            (sortDataName.currentLevelName =
                                                item.name)
                                    "
                                    v-for="item in (state.SortTagLevelList as any)"
                                    :key="item.value"
                                    :class="{
                                        isActive:
                                            item.value == sortData.currentLevel,
                                    }"
                                >
                                    <span>
                                        {{ item.name }}
                                    </span>
                                    <el-icon
                                        @click.stop="
                                            (sortData.currentLevel = 0),
                                                (sortDataName.currentLevelName =
                                                    '')
                                        "
                                        v-if="
                                            item.value == sortData.currentLevel
                                        "
                                    >
                                        <CircleClose />
                                    </el-icon>
                                </p>
                            </div>
                            <div class="sortcontent-list">
                                <p
                                    @click="
                                        (sortData.currentSortType = item.value),
                                            (sortDataName.currentSortTypeName =
                                                item.name)
                                    "
                                    v-for="item in (state.SortTypeList as any)"
                                    :key="item.value"
                                    :class="{
                                        isActive:
                                            item.value ==
                                            sortData.currentSortType,
                                    }"
                                >
                                    <span>
                                        {{ item.name }}
                                    </span>
                                  
                                </p>
                            </div>
                        </div>

                        <template #reference>
                            <div
                                style="
                                    display: flex;
                                    align-items: center;
                                    cursor: pointer;
                                "
                            >
                                <span style="color: #19203d; padding-right: 5px"
                                    >{{ sortDataName.currentSortConName
                                    }}{{
                                        sortData.currentSortCon == 2
                                            ? sortDataName.currentLevelName
                                            : ""
                                    }}{{
                                        sortDataName.currentSortTypeName ==
                                        "正序"
                                            ? "由高到低"
                                            : "由低到高"
                                    }}</span
                                >
                                <img
                                    src="~@/assets/images/wrongbook/arrow_next.png"
                                    alt=""
                                />
                            </div>
                        </template>
                    </el-popover> -->
                </div>
            </header>
            <div class="top-line"></div>
            <div class="content">
                <div class="con-left">
                    <LeftOne
                        v-if="state.currentWrongType == 1"
                        :parentSearch="searchForm"
                        :currentWrongType="state.currentWrongType"
                        v-model:currentHomeworkBookId="
                            state.currentHomeworkBookId
                        "
                        @selectSubject="selectSubject"
                    ></LeftOne>
                    <LeftTwo
                        v-if="state.currentWrongType == 2"
                        :parentSearch="searchForm"
                    ></LeftTwo>
                    <LeftThree
                        v-if="state.currentWrongType == 3"
                        :currentWrongType="state.currentWrongType"
                        :parentSearch="searchForm"
                        v-model:currentChapterBookId="
                            state.currentChapterBookId
                        "
                    >
                    </LeftThree>
                    <LeftFour
                        v-if="state.currentWrongType == 4"
                        :currentWrongType="state.currentWrongType"
                        :parentSearch="searchForm"
                        :gradeId="gradeId"
                        v-model:currentLessonId="state.currentLessonId"
                    >
                    </LeftFour>
                </div>
                <div class="con-right">
                    <LessonList
                        v-model:isShowContent="state.isShowContent"
                        :currentWrongType="state.currentWrongType"
                        :parentSearch="searchForm"
                        :questionType="(state.QuestionType as any)"
                        :frequency="state.Frequency"
                        :sortData="sortData"
                    ></LessonList>
                </div>
            </div>
        </main>
    </div>
    <div style="width: 100%" v-show="state.isShowContent == 2">
        <WrongDetails
            v-model:isShowContent="state.isShowContent"
            :currentWrongType="state.currentWrongType"
            :gradeName="state.gradeName"
            :dateRange="state.dateRange"
        />
    </div>
    <div style="width: 100%" v-show="state.isShowContent == 3">
        <GenerateExercise
            v-model:isShowContent="state.isShowContent"
            :gradeName="state.gradeName"
            :preContent="state.preContent"
            :exerciseData="state.exerciseData"
            :currentWrongType="state.currentWrongType"
            @onBackWrongBook="onBackWrongBook"
            :currentClassStudents="state.currentClassStudents"
        />
    </div>
    <QuestionBasket
        @basketGenerateExercise="basketGenerateExercise"
        v-model:isShowContent="state.isShowContent"
        v-show="state.isShowContent != 3"
    />
</template>

<script lang="ts" setup>
import {
    reactive,
    ref,
    defineExpose,
    watch,
    onMounted,
    nextTick,
    onActivated,
    onDeactivated,
} from "vue";
import { ArrowDown, Search, CircleClose } from "@element-plus/icons-vue";
import LeftOne from "./components/LeftOne.vue";
import LeftTwo from "./components/LeftTwo.vue";
import LeftThree from "./components/LeftThree.vue";
import LeftFour from "./components/LeftFour.vue";
import LessonList from "./components/LessonList.vue";
import WrongDetails from "./components/WrongDetails.vue";
import QuestionBasket from "./components/QuestionBasket.vue";
import GenerateExercise from "./components/GenerateExercise.vue";
import { get, STORAGE_TYPES } from "@/utils/storage";
import { getFormatDate } from "@/utils";
import { fetchGradeClassStudents } from "@/views/assignHomework/api";
import { useRoute } from "vue-router";
import useWrongBook from "./hooks/useWrongBook";
import { store } from "@/store";

const { questionTypeList, frequencyList } = useWrongBook();
const route = useRoute();
const classList = get(STORAGE_TYPES.USER_INFO).Classes;
const gradeId = ref(classList.length ? classList[0]?.GradeID : "");
const isActivited = ref(false);
const state = reactive({
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
    //顶部时间选择区间
    dateRange: getFormatDate(1) || [],
    //顶部年级列表
    classList: "",
    //当前选中的班级
    currentClassId: classList.length ? classList[0]?.ID : "",
    //当前班级的所有学生
    currentClassStudents: [],
    //显示内容：1列表 2详情 3练习
    isShowContent: 1,
    preContent: 0,
    //当前选择的那个类型展示错题本
    currentWrongType: 1,
    //存下当前选择bookid-作业
    currentHomeworkBookId: [],
    //存下当前选择bookid-章节
    currentChapterBookId: [],
    //存下当前选择的知识课程id
    currentLessonId: "",
    //是否是空态
    isEmpty: true,
    //问题类型
    QuestionType: "",
    //频次
    Frequency: 0,
    currentWrongTypeIndex: 1, //当前选中的按钮类型index
    //错题类型按钮list
    wrongTypeButtonList: [
        {
            id: 1,
            name: "按作业",
        },
        // {
        //     id: 2,
        //     name: "按试卷",
        // },
        {
            id: 3,
            name: "按章节",
        },
        {
            id: 4,
            name: "按知识点",
        },
    ],
    //当前日期选中的类型
    currentDateIndex: 1,
    //时间类型按钮list
    dateButtonList: [
        {
            id: 2,
            name: "昨日",
        },
        {
            id: 1,
            name: "今日",
        },
        {
            id: 3,
            name: "本周",
        },
    ],
    //弹出层
    visible: false,
    //排序字段 1 平均错误率 2分层错误率 3完成率
    SortContentList: [
        {
            name: "平均错误率",
            value: 1,
        },
        {
            name: "分层错误率",
            value: 2,
        },
        {
            name: "完成率",
            value: 3,
        },
    ],
    //排序分层等级 100 C层，200 B层，300 A层
    SortTagLevelList: [
        {
            name: "A层",
            value: 300,
        },
        {
            name: "B层",
            value: 200,
        },
        {
            name: "C层",
            value: 100,
        },
    ],
    //排序类型 1 asc正序 2 desc倒叙
    SortTypeList: [
        {
            name: "正序",
            value: 1,
        },
        {
            name: "倒序",
            value: 2,
        },
    ],
    gradeName: classList.length ? classList[0]?.Name : "",
    exerciseData: [],
});
//分层筛选
const questionTagType = ref(1);
const activeName = ref(0);
const scrollResultWidth = ref(0); //transform滚动的距离
const signleWidth = ref(90); //单个流程的宽度
const currentClickNumber = ref(0);
const noScrollRight = ref(true);
const allClassStudents = ref<any>([]);
//作业维度排序字段
const sortData = ref({
    //当前选择的分层登记
    currentLevel: 0,
    //题目类型
    currentSortType: 2,
    //当前选择的排序字段
    currentSortCon: 1,
});
console.log("错题本页面.......");
watch(
    () => state.currentHomeworkBookId,
    (val) => {
        console.log("currentHomeworkBookId", val);
    },
    { deep: true }
);

//监听日期区间
watch(
    () => state.dateRange,
    (value: any) => {
        if (value) {
            let index = 0;
            state.dateButtonList.forEach((item: any) => {
                const data = getFormatDate(item.id) as any;
                if (value[0] == data[0] && value[1] == data[1]) {
                    index = item.id;
                }
            });
            state.currentDateIndex = index;
            searchForm.value.StartTime = value[0];
            searchForm.value.EndTime = value[1];
        }
    },
    { deep: true }
);
watch(
    () => state.currentWrongType,
    (val) => {
        console.log(val);
    }
);
//选择详情-右侧-作业维度筛选分层下拉
const changeTagType = (value: any) => {
    console.log(value);
    if (value == 1) {
        //平均错误率由高到低
        sortData.value.currentSortCon = 1;
        sortData.value.currentLevel = 0; //等级
    } else if (value == 2) {
        //A层由高到低
        sortData.value.currentSortCon = 2;
        sortData.value.currentLevel = 300; //等级
    } else if (value == 3) {
        //B层由高到低
        sortData.value.currentSortCon = 2;
        sortData.value.currentLevel = 200; //等级
    } else {
        // 4 - C层错误率由高到低
        sortData.value.currentSortCon = 2;
        sortData.value.currentLevel = 100; //等级
    }
};
//选择科目查学生
const selectSubject = (subject: any) => {
    console.log("subjectid", subject);
    if (subject) {
        allClassStudents.value = [];
        queryClassStudents(subject);
    }
};
const queryClassStudents = async (subjectId: any) => {
    const res = await fetchGradeClassStudents({
        subjectID: subjectId,
    });

    if (res.resultCode === 200) {
        console.log("fetchGradeClassStudents", res);

        res.result.forEach((item: any) => {
            item.ClassData.forEach((data: any) => {
                allClassStudents.value.push(data);
            });
        });
    }
};
watch(
    () => allClassStudents.value,
    (val) => {
        if (!val.length) return;
        // console.log("allClassStudents.value", allClassStudents.value);

        filterClassStudent(val);
    },
    { deep: true }
);
//过滤班级学生
const filterClassStudent = (val: any) => {
    state.currentClassStudents = val
        .find((item: any) => item.ClassId == state.currentClassId)
        .Students.map((stu: any) => {
            return {
                ...stu,
                TagName: stu.TagName ? stu.TagName : "未标记",
            };
        });
    console.log("currentClassStudents", state.currentClassStudents);
};
//生成练习
const basketGenerateExercise = async (type: number) => {
    console.log("生成练习", type);
    state.preContent = type;
    // state.exerciseData = store.state.wrongbook.questionBasket as any;
};
onMounted(() => {
    nextTick(() => {
        isActivited.value = true;

        setTimeout(() => {
            initgoRightArrow();
        });
    });
});
onActivated(() => {
    isActivited.value = true;
});
onDeactivated(() => {
    isActivited.value = false;
});
const fixedBoxRef = ref();
const fourClassList = ref([]);
const isShowIcon = ref(false);
//初始化判断是否可以向右滚动
const initgoRightArrow = () => {
    fourClassList.value =
        classList.length > 4 ? classList?.slice(0, 4) : classList;
    isShowIcon.value = classList.length > 4 ? true : false;
    // const currentScrollWidth = fixedBoxRef.value.clientWidth;
    // const canNumber = Math.floor(currentScrollWidth / signleWidth.value); //可以放下的个数
    // //如果最后一个流程图标已经展示出来，则停止滚动
    // if (currentClickNumber.value + canNumber >= classList.length) {
    //     noScrollRight.value = false;
    //     return;
    // }
};
//点击左滑
const fnPrev = () => {
    if (currentClickNumber.value > 0) {
        currentClickNumber.value -= 1;
        noScrollRight.value = true;
        fnScrollWidth("reduce");
    } else {
        return false;
    }
};
//点击右滑
const fnNext = () => {
    fourClassList.value = classList;
    const currentScrollWidth = fixedBoxRef.value.clientWidth;
    const canNumber = Math.floor(currentScrollWidth / signleWidth.value); //可以放下的个数
    //如果最后一个流程图标已经展示出来，则停止滚动
    if (currentClickNumber.value + canNumber >= classList.length) {
        return;
    }
    //说明放不下有滚动条
    if (classList.length > canNumber) {
        currentClickNumber.value += 1;
        if (currentClickNumber.value + canNumber >= classList.length) {
            noScrollRight.value = false;
        }
        fnScrollWidth("add");
    }
};
const fnScrollWidth = (type: string) => {
    let result = 0;
    if (type === "reduce") {
        result = 100;
    } else if (type === "add") {
        result = -100;
    } else {
        result = 0;
    }
    scrollResultWidth.value += result;
};
//顶部的昨日，今日，本周时间过滤
const toFormatDate = (type: number) => {
    const data: any = getFormatDate(type);
    console.log(data);
    if (data) {
        state.dateRange = data;
    }
};
//顶部表单搜索项
const searchForm = ref({
    ClassId: classList.length ? classList[0]?.ID : "", //班级Id
    EndTime: state.dateRange[1],
    StartTime: state.dateRange[0], //日期范围
});
//切换顶部选中的班级
const switchClass = (value: any) => {
    console.log("选中的班级", value);

    state.currentClassId = value.ID;
    searchForm.value.ClassId = value.ID;
    filterClassStudent(allClassStudents.value);

    //传年级id
    gradeId.value = value.GradeID;
    state.gradeName = value.Name;
    console.log("gradeId.value", gradeId.value);
};
//返回到班级错题本页面
const onBackWrongBook = () => {
    state.isShowContent = 1;
};
</script>

<style lang="scss" scoped>
.wrongbook-wrapper {
    width: 100%;
    height: 100%;
    min-width: 0;
    min-height: 0;
    background: #f5f6fa;

    .wrongbook-header {
        width: 100%;
        height: 58px;
        background: #ffffff;
        padding: 0 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .header-left-con {
            // max-width: 40%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .fixedBox {
                flex: 1;
                overflow: hidden;
                .header-left {
                    display: flex;
                    height: 100%;
                    box-sizing: border-box;
                    padding: 20px 0;
                    white-space: nowrap;
                    font-size: 14px;
                    color: #a7aab4;
                    font-family: HarmonyOS_Sans_SC;
                    .class-item {
                        transition: all 0.3s ease;

                        margin-right: 32px;
                        cursor: pointer;
                        white-space: nowrap;
                    }

                    .isActive {
                        font-size: 16px;
                        color: #19203d;
                        font-weight: bold;
                        transition: 0.2s;
                    }

                    .isActive::after {
                        content: "";
                        display: block;
                        position: relative;
                        width: 100%;
                        height: 3px;
                        background: #4b71ee;
                        bottom: -16px;
                        /* left: -74px; */
                        right: 0;
                        transition: 0.2s;
                    }
                }
            }
        }

        .header-right {
            flex: 1;
            display: flex;
            justify-content: flex-end;
            :deep(.el-button:focus, .el-button:hover),
            :deep(.el-button-group) {
                .el-button--small.dateActive {
                    background-color: #f3f7ff;
                    border: 1px solid rgba(75, 113, 238, 0.5);
                    color: #4b71ee;
                }
            }
        }
    }

    .wrongbook-main {
        margin-top: 8px;
        background-color: #ffffff;
        height: calc(100% - 66px);
        position: relative;

        .top-search {
            height: 56px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 16px;

            .left-btn {
                :deep(.el-button--small) {
                    min-width: 88px;
                    background: #f3f7ff;
                    border-radius: 4px;
                    border: none;
                    // border: 1px solid rgba(75, 113, 238, 0.5);
                    color: #19203d;
                    font-size: 13px;
                }

                :deep(.el-button--small.isActive) {
                    color: #4b71ee;
                    border: 1px solid rgba(75, 113, 238, 0.5);
                }

                :deep(.el-button:focus, .el-button:hover, .isActive) {
                    color: #4b71ee;
                    border: 1px solid rgba(75, 113, 238, 0.5);
                }
            }
            .right-sel {
                .tagtypelist {
                    margin-left: 20px;
                    :deep(.el-select .el-input__inner) {
                        border: none;
                    }
                }
            }
        }

        .top-line {
            width: 100%;
            height: 1px;
            background: #f3f4f4;
        }

        .content {
            background-color: #ffffff;
            display: flex;
            height: calc(100% - 57px);

            .con-left {
                width: 316px;
                background: #ffffff;
                border-right: 1px solid #f3f4f4;
            }

            .con-right {
                flex: 1;
                background: #ffffff;
            }
        }
    }
}
</style>
<style lang="scss">
.el-popover {
    .sortcontent {
        display: flex;
        // width: 250px;
        justify-content: space-around;

        .sortcontent-list {
            width: 33%;
            // display: flex;
            font-size: 13px;

            p {
                cursor: pointer;
                background-color: #fff;
                padding: 2px;
                display: flex;
                align-items: center;
                justify-content: space-around;
            }

            .isActive {
                background-color: #4b71ee;
                color: #fff;
            }
        }
    }
}
</style>
