<template>
    <div class="exercise-wrapper">
        <header class="exercise-header">
            <div class="header-left">
                <img
                    src="~@/assets/images/wrongbook/icon_back.png"
                    alt=""
                    @click="backList"
                />
                <div class="title" v-if="currentSetp == 1">
                    {{ props.gradeName }}错题复习
                </div>
                <div class="title" v-if="currentSetp == 2 || currentSetp == 3">
                    布置作业
                </div>
            </div>
        </header>
        <template v-if="currentSetp == 1">
            <main class="exercise-main">
                <p class="title">{{ formateSum }}</p>
                <div class="main-line"></div>
                <div class="exercise-content">
                    <div
                        class="exercise-item"
                        v-for="(item,index) in (exerciseData as any)"
                        v-show="formateSum"
                        :key="index"
                    >
                        <div class="item-type">
                            <div class="type">
                                {{ index + 1 }}、{{
                                    formatQuestionType(item.QuestionType)
                                }}
                                （共{{ item.Count }}题）
                            </div>
                        </div>
                        <template
                            v-for="(exData, exIndex) in item.Questions"
                            :key="exIndex"
                        >
                            <div
                                style="
                                    display: flex;
                                    align-items: flex-start;
                                    margin-top: 20px;
                                "
                            >
                                <span style="padding-right: 5px"
                                    >{{ exIndex + 1 }}.
                                </span>
                                <div
                                    style="width: 98%"
                                    v-html="exData.QuestionInfo"
                                ></div>
                                <img
                                    style="cursor: pointer"
                                    @click="delExercise(exData)"
                                    src="~@/assets/images/wrongbook/icon_delete_black.png
                        "
                                    alt=""
                                />
                            </div>
                        </template>
                    </div>
                    <div v-show="!formateSum">这里空空如也</div>
                </div>
            </main>

            <div class="exercise-footer">
                <div class="btn download-btn" @click="downLoadWord">
                    下载为word
                </div>
                <div class="btn next-btn" @click="nexStep">下一步</div>
            </div>
        </template>
        <template v-if="currentSetp == 2">
            <main class="homework-main">
                <div class="homework-top">
                    <span class="types">布置对象</span>
                    <span class="class"
                        >{{ props.gradeName }}(共{{
                            props.currentClassStudents?.length
                        }}人)</span
                    >
                </div>
                <div class="homework-line"></div>
                <div class="homework-content">
                    <div class="titles">作业内容</div>
                    <div class="homework-list">
                        <div class="list-item">
                            <div class="item-left">
                                <div class="index-title">
                                    <div class="index">1</div>
                                    <div class="title">
                                        {{ homeworkPagerInfo.PaperName }}
                                    </div>
                                    <img
                                        @click="editHomeowrkName()"
                                        src="~@/assets/images/wrongbook/icon_bianji.png"
                                        alt=""
                                    />
                                </div>
                                <div class="count">
                                    共{{ homeworkPagerInfo.QuestionsCount }}题
                                </div>
                                <div class="book-type">
                                    {{
                                        store.state.wrongbook
                                            .currentSelectedBookName
                                    }}
                                </div>
                            </div>
                            <div class="item-right">
                                <!-- <div class="text">选择学生：</div>
                                <div class="stu-select">
                                    <el-cascader
                                        :options="state.options"
                                        :props="{ multiple: true }"
                                        collapse-tags

                                        clearable
                                    />
                                </div>
                                <img
                                    @click="selectStudent"
                                    src="~@/assets/images/wrongbook/icon_edit_two.png"
                                    alt=""
                                /> -->

                                <SelectLabel
                                    :studentList="(computedCurrentClassStudents as any)"
                                ></SelectLabel>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <div class="exercise-footer" style="width: 100%">
                <div class="btn download-btn" @click="downLoadWord">
                    下载为word
                </div>
                <div class="btn next-btn" @click="assignHomework">确认布置</div>
            </div>
        </template>
        <!-- 作业布置完成 -->
        <template v-if="currentSetp == 3">
            <div class="homework-main-complete">
                <div class="homework-complete">
                    <img
                        src="~@/assets/images/wrongbook/pic_finish_buzhi.png"
                        alt=""
                    />
                    <div class="text">作业布置完成</div>
                    <div class="btns">
                        <div class="btn leftbtn" @click="checkHomeworkList">
                            查阅作业列表
                        </div>
                        <div class="btn rightbtn" @click="backWrongBookPage">
                            返回错题本
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <!-- 删除提示 -->
        <el-dialog
            v-model="dialogVisible"
            :show-close="false"
            width="360px"
            custom-class="homeworkDialog"
        >
            <template #title>
                <span></span>
                <span class="my-header">删除提示</span>
                <span @click="dialogVisible = false">
                    <img
                        src="~@/assets/images/wrongbook/icon_close_popup_gray.png"
                        alt=""
                    />
                </span>
            </template>
            <div class="dialog-content" style="background-color: #fff">
                <img
                    src="~@/assets/images/wrongbook/icon_tips_popup.png"
                    alt=""
                />
                <span>是否确认删除该题</span>
            </div>
            <div class="dialog-footers">
                <div class="cobtn calcBtn" @click="dialogVisible = false">
                    取消
                </div>
                <div class="cobtn sureBtn" @click="sureDelExerciseData">
                    确定删除
                </div>
            </div>
        </el-dialog>

        <!-- 修改作业名称 -->
        <el-dialog
            custom-class="homeworkDialog"
            v-model="editVisible"
            :show-close="false"
            width="360px"
        >
            <template #title>
                <span></span>
                <span class="my-header">修改作业名称</span>
                <span @click="editVisible = false">
                    <img
                        src="~@/assets/images/wrongbook/icon_close_popup_gray.png"
                        alt=""
                    />
                </span>
            </template>
            <div class="dialog-content">
                <el-input v-model="homeworkName"></el-input>
            </div>
            <div class="dialog-footers">
                <div class="cobtn calcBtn" @click="editVisible = false">
                    取消
                </div>
                <div class="cobtn primBtn" @click="sureUpdatePagerName">
                    确定
                </div>
            </div>
        </el-dialog>

        <!-- 选择学生 -->
        <el-dialog :show-close="false" v-model="studentVisible" width="70%">
            <template #title>
                <span></span>
                <span class="my-header">选择学生-{{ props.gradeName }}</span>
                <span @click="studentVisible = false">
                    <img
                        src="~@/assets/images/wrongbook/icon_close_popup_gray.png"
                        alt=""
                    />
                </span>
            </template>
            <div class="dialog-content">
                <div class="content-left">
                    <div class="student-tag">
                        <el-checkbox-group
                            v-model="checkedTags"
                            @change="handleCheckedTagChange"
                        >
                            <div
                                class="tag-check"
                                @click.stop="currentTags = tag.value"
                                :class="{ isActive: currentTags == tag.value }"
                                v-for="tag in state.studentTags"
                                :key="tag.value"
                            >
                                <div class="left">
                                    <el-checkbox
                                        :label="tag.label"
                                        >{{
                                    }}</el-checkbox>
                                    <span class="text">{{ tag.label }}</span>
                                    <span class="count">({{ tag.count }})</span>
                                </div>
                                <div class="right">
                                    {{ tag.selectedCount }}
                                </div>
                            </div>
                        </el-checkbox-group>
                    </div>
                </div>
                <div class="student-right">
                    <el-checkbox-group
                        v-model="checkedStudent"
                        @change="handleCheckedStuChange"
                    >
                        <div
                            class="student-item"
                            v-for="item in state.studentList"
                            :key="item.id"
                        >
                            <div class="left">
                                <el-checkbox :label="item.id">{{}}</el-checkbox>
                            </div>
                            <div class="right">
                                <img src="" alt="" />
                                <div class="name-num">
                                    <span class="name">{{ item.name }}</span>
                                    <span class="num">
                                        {{ item.number }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </el-checkbox-group>
                </div>
            </div>
            <div class="custom-footers">
                <div class="footer-left">
                    <el-checkbox
                        v-model="checkedAll"
                        label="全选"
                        size="large"
                    />
                    <span class="selected"> 当前已选{{ 16 }}人 </span>
                </div>
                <div class="primBtn">确定</div>
            </div>
        </el-dialog>
    </div>
</template>
<script lang="ts" setup>
import { watch, ref, reactive, computed } from "vue";
import { getOssUrl } from "@/utils/oss";
import { useRouter } from "vue-router";
import SelectLabel from "@/views/assignHomework/SelectLabel.vue";
import useWrongBook from "../hooks/useWrongBook";
import {
    getHomeworkPaperInfo,
    updatePaperName,
    sendErrorPaperWork,
    ErrorPaperToWord,
} from "@/api/errorbook";
import useDownloadFile from "@/hooks/useDownloadFile";
import { ElMessage } from "element-plus";
import { store, ActionTypes } from "@/store";
const { formatQuestionType, delAllBasketData } = useWrongBook();
const emit = defineEmits(["update:isShowContent", "onBackWrongBook"]);
const { download } = useDownloadFile();
const props = defineProps({
    isShowContent: {
        type: Number,
        default: 0,
    },
    preContent: {
        type: Number,
        default: 0,
    },
    gradeName: {
        type: String,
        default: "",
    },
    // //试题篮的练习题
    // exerciseData: {
    //     type: Array,
    //     default: () => [],
    // },
    currentClassStudents: {
        type: Array,
        default: () => [],
    },
    currentWrongType: {
        type: Number,
        default: null,
        required: true,
    },
});
const exerciseData: any = computed(() => {
    return store.state.wrongbook.questionBasket;
});
//删除提示弹框
const dialogVisible = ref(false);
//修改作业名称弹框
const editVisible = ref(false);
//作业名称
const homeworkName = ref("");
//当前步骤
const currentSetp = ref(1);
//选择学生弹框
const studentVisible = ref(false);
//是否全选
const checkedAll = ref(false);
//选中的学生层级
const checkedTags = ref([]);
//选中的学生
const checkedStudent = ref([]);
//当前点击的学生层级
const currentTags = ref(0);
//当前班级的学生
const computedCurrentClassStudents = computed(() => {
    const data = props.currentClassStudents;
    data.forEach((item: any) => {
        item.checked = true;
    });
    return data;
});
//将要删除的题信息
const delExerciseData = ref<any>({});
const state = reactive({
    options: [
        {
            value: 1,
            label: "A层学生 ( 1 / 1 )",
        },
        {
            value: 2,
            label: "B层学生 ( 13 / 13 )",
        },
        {
            value: 3,
            label: "C层学生 ( 3 / 3 )",
        },
        {
            value: 4,
            label: "未标记学生 ( 4 / 4 )",
        },
    ],
    studentTags: [
        {
            label: "A层学生",
            value: 1,
            count: 4,
            selectedCount: 0,
        },
        {
            label: "B层学生",
            value: 2,
            count: 8,
            selectedCount: 0,
        },
        {
            label: "C层学生",
            value: 3,
            count: 9,
            selectedCount: 0,
        },
        {
            label: "未标记学生",
            value: 4,
            count: 13,
            selectedCount: 0,
        },
    ],
    studentList: [
        { id: 1, avater: "", name: "查蓓", number: "DSD334" },
        {
            id: 2,
            avater: "",
            name: "查蓓",
            number: "DSD334",
        },
        {
            id: 3,
            avater: "",
            name: "查蓓",
            number: "DSD334",
        },
        {
            id: 4,
            avater: "",
            name: "查蓓",
            number: "DSD334",
        },
    ],
});
const homeworkPagerInfo = ref({
    PaperId: "",
    PaperName: "",
    QuestionsCount: 0,
});
const formateSum = computed(() => {
    const data = exerciseData.value
        .map((item: any) => {
            return `${formatQuestionType(item.QuestionType)}${item.Count}题`;
        })
        .join("、");
    if (!store.state.wrongbook.baskTotal) {
        return "";
    } else {
        return `共${store.state.wrongbook.baskTotal}题，包含${data}`;
    }
});
watch(
    () => exerciseData.value,
    (val) => {
        console.log(val);
        if (val.length) {
            // getFileList(val);
        }
    },
    { deep: true, immediate: true }
);
// watch(
//     () => props.currentClassStudents,
//     (val) => {
//         console.log("props.currentClassStudents", props.currentClassStudents);
//         currentClassStudents.value = val;
//     },
//     { deep: true }
// );
//学生层级选中改变
const handleCheckedTagChange = (val: any) => {
    console.log(val);
};
//学生选中改变
const handleCheckedStuChange = (val: any) => {
    console.log(val);
};
// const getFileList = (fileData: any) => {
//     console.log("fileData", fileData);
//     const exerciseData = fileData.map((item: any) => {
//         return {
//             QuestionID: item.QuestionID,
//             QuestionType: item.QuestionType,
//             imgUrl: getUrl(item.QuestionFiles),
//         };
//     });
//     console.log(exerciseData);
// };
// const getUrl = (file: FileInfo) => {
//     const { Extention, FilePath, FileName, Bucket } = file;
//     const key = Extention
//         ? `${FilePath}/${FileName}.${Extention}`
//         : `${FilePath}/${FileName}`;
//     return getOssUrl(key, Bucket);
// };
//删除生成的练习题
const delExercise = (data: any) => {
    // console.log(data);
    delExerciseData.value = data;
    dialogVisible.value = true;
};
//确认删除当前点击的练习题
const sureDelExerciseData = async () => {
    const params = {
        isAllDel: 0,
        classId: store.state.wrongbook.currentClassId,
        bookId: store.state.wrongbook.currentBookId,
        questionIds: [delExerciseData.value?.QuestionId],
        questionType: delExerciseData.value?.QuestionType,
    };
    await store.dispatch(ActionTypes.DEL_QUESTION_BASKET, params);
    dialogVisible.value = false;
};
//编辑作业名称
const editHomeowrkName = () => {
    homeworkName.value = homeworkPagerInfo.value.PaperName;
    editVisible.value = true;
};
//选择学生
const selectStudent = (data: any) => {
    // console.log("选择学生", data);
    studentVisible.value = true;
};
//处理word文件的
const formatWordFile = async (data: any) => {
    if (!data) return;
    const { FileName, FilePath, Bucket, Extention } = data;
    const key = Extention
        ? `${FilePath}/${FileName}.${Extention}`
        : `${FilePath}/${FileName}`;
    const url = await getOssUrl(key, Bucket);
    return url;
};
//确定布置作业---------------------
const assignHomework = async () => {
    const checkedStudents = computedCurrentClassStudents.value
        .filter((item: any) => item.checked)
        .map((item: any) => item.ID);
    // console.log("checkedStudents", checkedStudents);
    if (!checkedStudents.length) {
        ElMessage.warning("还没有选择任何学生");
        return;
    }
    const homeworkParams = {
        SubjectId: store.state.wrongbook.currentSubjectId, //科目id
        ClassId: store.state.wrongbook.currentClassId, //布置作业的班级id
        PaperId: store.state.wrongbook.currentGeneratePaperId,
        StudentIds: checkedStudents,
        isknowledge: props.currentWrongType == 4 ? 1 : 0,
    };
    // console.log("homeworkParams", homeworkParams);
    const res: any = await sendErrorPaperWork(homeworkParams);
    if (res.resultCode == 200) {
        delAllBasketData();
        currentSetp.value = 3;
    }
};
//返回班级错题本页面
const backWrongBookPage = () => {
    emit("onBackWrongBook", props.preContent);
    currentSetp.value = 1;
};
const router = useRouter();
//查询作业列表
const checkHomeworkList = () => {
    router.push("/homework");
};
//返回列表页
const backList = () => {
    if (currentSetp.value == 1) {
        emit("update:isShowContent", props.preContent);
    } else {
        currentSetp.value = 1;
        return;
    }
};
//下载为word
const downLoadWord = async () => {
    if (!formateSum.value) return;
    const res: any = await ErrorPaperToWord({
        ID: store.state.wrongbook.currentGeneratePaperId,
    });
    console.log(res);
    if (res.resultCode == 200) {
        const url = await formatWordFile(res.result);
        if (!url) return;
        const success = await download(
            url,
            res.result.FileName + ".docx",
            res.result.Extention
        );
        console.log("success", success);
        if (success) {
            ElMessage.success("下载完成！");
        }
    }
};
//下一步 + 生成练习
const nexStep = async () => {
    if (!formateSum.value) return;
    //生成练习接口
    if (store.state.wrongbook.currentGeneratePaperId) {
        queryHomeworkInfoById();
    }
    currentSetp.value = 2;
};
//根据生成的练习作业id查询布置作业的信息
const queryHomeworkInfoById = async () => {
    const res: any = await getHomeworkPaperInfo({
        ID: store.state.wrongbook.currentGeneratePaperId,
    });
    console.log("查询布置作业页面信息", res);
    if (res.resultCode == 200) {
        homeworkPagerInfo.value = res.result;
        homeworkPagerInfo.value.PaperName =
            homeworkPagerInfo.value.PaperName || `${props.gradeName}错题复习`;
    }
};
//确认修改生成的作业名称
const sureUpdatePagerName = async () => {
    const params = {
        PaperId: homeworkPagerInfo.value.PaperId,
        Name: homeworkName.value,
    };
    const res: any = await updatePaperName(params);
    console.log(res);
    if (res.resultCode == 200) {
        editVisible.value = false;
        queryHomeworkInfoById();
    }
};
</script>
<style lang="scss" scoped>
.exercise-wrapper {
    width: 100%;
    height: 100%;
    min-width: 0;
    min-height: 0;
    background: #f5f6fa;
    .exercise-header {
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
        }
    }
    .exercise-main {
        width: 80%;
        margin: auto;
        height: calc(100% - 126px);
        background: #ffffff;
        margin-top: 10px;
        padding: 16px;
        overflow: hidden;
        .title {
            font-size: 14px;
            font-family: HarmonyOS_Sans_SC;
            color: #a7aab4;
        }
        .main-line {
            width: 100%;
            margin-top: 16px;
            height: 1px;
            background: #f3f4f4;
        }
        .exercise-content {
            overflow: auto;
            height: 100%;
            width: 100%;
            padding: 16px 0;
            .exercise-item {
                width: 100%;
                padding: 16px;
                background: #f9fafc;
                border-radius: 4px;
                margin-bottom: 15px;
                .item-type {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    .type {
                        font-size: 14px;
                        font-family: HarmonyOS_Sans_SC_Bold;
                        color: #19203d;
                        font-weight: 600;
                    }
                    img {
                        cursor: pointer;
                    }
                }
            }
        }
    }
    .exercise-footer {
        width: 80%;
        margin: auto;
        height: 56px;
        background: #ffffff;
        display: flex;
        padding: 12px 16px;
        justify-content: flex-end;
        border-top: 1px solid #e9ecf0;
        .btn {
            padding: 9px 16px;
            background: #ffffff;
            border-radius: 4px;
            border: 1px solid #e0e2e7;
            font-size: 12px;
            cursor: pointer;
        }
        .next-btn {
            margin-left: 16px;
            color: #ffffff;
            background: #4b71ee;
        }
    }
    .homework-main {
        width: 100%;
        height: calc(100% - 126px);
        background: #ffffff;
        margin-top: 10px;
        padding: 16px;
        position: relative;
        .homework-top {
            padding: 16px 0;
            .types {
                font-size: 16px;
                font-family: HarmonyOS_Sans_SC_Bold;
                color: #19203d;
                font-weight: 600;
            }
            .class {
                padding-left: 20px;
                font-size: 14px;
                font-family: HarmonyOS_Sans_SC;
                color: #19203d;
            }
        }
        .homework-line {
            width: 100%;
            height: 1px;
            background: #f3f4f4;
        }
        .homework-content {
            padding: 16px 0;
            .titles {
                font-size: 16px;
                font-family: HarmonyOS_Sans_SC_Bold;
                color: #19203d;
                font-weight: 600;
            }
            .homework-list {
                margin-top: 12px;
                .list-item {
                    width: 100%;
                    background: #f9fafc;
                    border-radius: 4px;
                    padding: 16px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    .item-left {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        width: 40%;
                        .index-title {
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            .index {
                                font-size: 14px;
                                font-family: HarmonyOS_Sans_SC_Bold;
                                color: #19203d;
                            }
                            .title {
                                font-size: 14px;
                                font-family: HarmonyOS_Sans_SC;
                                color: #19203d;
                                padding: 0 12px 0 16px;
                            }
                            img {
                                cursor: pointer;
                            }
                        }
                        .count {
                            font-size: 14px;
                            color: #5f626f;
                        }
                        .book-type {
                            font-size: 14px;
                            color: #19203d;
                            font-weight: 600;
                        }
                    }
                    .item-right {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding-right: 88px;
                        .text {
                            font-size: 12px;
                            font-family: PingFangSC-Regular, PingFang SC;
                            font-weight: 400;
                            color: #5f626f;
                        }
                        .stu-select {
                            padding: 0 12px;
                        }
                        img {
                            cursor: pointer;
                        }
                    }
                }
            }
        }
    }
    .homework-main-complete {
        width: 100%;
        height: calc(100% - 72px);
        background: #ffffff;
        margin-top: 10px;
        padding: 16px;
        position: relative;
        .homework-complete {
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            top: 0;
            margin: auto;
            width: 15%;
            height: 40%;
            text-align: center;
            .text {
                font-size: 14px;
                font-family: HarmonyOS_Sans_SC;
                color: #19203d;
            }
            .btns {
                margin-top: 32px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                .btn {
                    width: 104px;
                    height: 32px;
                    background: #ffffff;
                    border-radius: 4px;
                    border: 1px solid #e0e2e7;
                    font-size: 12px;
                    text-align: center;
                    line-height: 32px;
                    cursor: pointer;
                }
                .leftbtn {
                    color: #19203d;
                }
                .rightbtn {
                    background: #4b71ee;
                    color: #ffffff;
                }
            }
        }
    }

    // :deep(.el-dialog.studentDialog) {
    //     height: 88vh;
    //     .el-dialog__body {
    //         padding: 0;
    //         height: calc(100% - 64px);
    //     }
    //     .dialog-content {
    //         height: calc(100% - 64px);
    //         display: flex;
    //         justify-content: space-between;
    //         .content-left {
    //             width: 23%;
    //             height: 100%;
    //             background-color: #ffffff;
    //             .student-tag {
    //                 .el-checkbox-group {
    //                     font-size: 14px;
    //                     .tag-check {
    //                         cursor: pointer;
    //                         padding: 6px 16px;
    //                         background-color: #ffffff;
    //                         display: flex;
    //                         justify-content: space-between;
    //                         align-items: center;
    //                         .left {
    //                             display: flex;
    //                             align-items: center;
    //                             color: #19203d;
    //                             .text {
    //                                 padding-left: 5px;
    //                             }
    //                             .count {
    //                                 padding-left: 5px;
    //                             }
    //                         }
    //                         .right {
    //                             width: 18px;
    //                             height: 18px;
    //                             background: #4b71ee;
    //                             color: #ffffff;
    //                             border-radius: 50%;
    //                             text-align: center;
    //                             line-height: 18px;
    //                             font-size: 12px;
    //                         }
    //                     }
    //                     .isActive {
    //                         position: relative;
    //                         background: #e6ecff;
    //                         .left {
    //                             color: #4b71ee;
    //                         }
    //                     }
    //                     .isActive::after {
    //                         content: "";
    //                         display: block;
    //                         position: absolute;
    //                         width: 3px;
    //                         height: 100%;
    //                         background: #4b71ee;
    //                         right: 0;
    //                     }
    //                 }
    //             }
    //         }
    //         .student-right {
    //             flex: 1;
    //             height: 100%;
    //             .el-checkbox-group {
    //                 font-size: 14px;
    //                 display: flex;
    //                 flex-wrap: wrap;
    //                 padding-top: 20px;
    //                 padding-left: 20px;
    //                 .student-item {
    //                     padding: 20px;
    //                     width: 30%;
    //                     display: flex;
    //                     // justify-content: space-between;
    //                     background-color: #ffffff;
    //                     margin-right: 20px;
    //                     margin-bottom: 20px;
    //                     .right {
    //                         margin-left: 15px;
    //                         display: flex;
    //                         align-items: center;
    //                         img {
    //                             width: 38px;
    //                             height: 38px;
    //                             border-radius: 50%;
    //                         }
    //                         .name-num {
    //                             flex-direction: column;
    //                             display: flex;
    //                             justify-content: space-between;
    //                             margin-left: 18px;
    //                             height: 100%;
    //                             .name {
    //                                 font-size: 14px;
    //                                 color: #19203d;
    //                             }
    //                             .num {
    //                                 font-size: 12px;
    //                                 color: #5f626f;
    //                                 font-weight: normal;
    //                             }
    //                         }
    //                     }
    //                 }
    //             }
    //         }
    //     }
    //     .custom-footers {
    //         display: flex;
    //         justify-content: space-between;
    //         align-items: center;
    //         padding: 12px 16px;
    //         border-top: 1px solid #f5f6fa;
    //         .footer-left {
    //             display: flex;
    //             align-items: center;
    //             font-size: 14px;
    //             font-family: HarmonyOS_Sans_SC;
    //             color: #5f626f;
    //             .selected {
    //                 padding-left: 24px;
    //             }
    //         }
    //         .primBtn {
    //             cursor: pointer;
    //             color: #ffffff;
    //             background: #4b71ee;
    //             border-radius: 4px;
    //             width: 100px;
    //             height: 32px;
    //             line-height: 32px;
    //             text-align: center;
    //         }
    //     }
    // }
}
</style>
<style lang="scss">
.el-dialog.homeworkDialog {
    border-radius: 8px;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    height: 245px;
    .el-dialog__header {
        padding: 15px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #f5f6fa;
        img {
            cursor: pointer;
        }
        .my-header {
            text-align: center;
            font-size: 16px;
            font-family: HarmonyOS_Sans_SC_Bold;
            color: #19203d;
            font-weight: 600;
        }
    }
    .el-dialog__body {
        .dialog-content {
            background-color: #f5f6fa;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            font-family: HarmonyOS_Sans_SC_Medium;
            color: #212743;
            font-weight: 600;
            img {
                padding-right: 24px;
            }
        }
        .dialog-footers {
            margin-top: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            .cobtn {
                padding: 8px 20px;
                font-size: 12px;
                border-radius: 4px;
                border: 1px solid #e0e2e7;
                font-size: 12px;
                font-family: HarmonyOS_Sans_SC;
                cursor: pointer;
            }
            .calcBtn {
                background: #ffffff;
            }
            .primBtn {
                margin-left: 16px;
                background: #4b71ee;
                color: #ffffff;
            }
            .sureBtn {
                margin-left: 16px;
                background: #ff6b6b;
                color: #ffffff;
            }
        }
    }
}
</style>
