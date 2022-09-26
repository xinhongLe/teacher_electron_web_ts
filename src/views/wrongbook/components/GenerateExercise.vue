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
                <div class="title" v-if="currentSetp == 2">布置作业</div>
            </div>
        </header>
        <template v-if="currentSetp == 1">
            <main class="exercise-main">
                <p class="title">共4题，包含选择题2题、填空题2题</p>
                <div class="main-line"></div>
                <div class="exercise-content">
                    <div class="exercise-item">
                        <div class="item-type">
                            <div class="type">1、选择题</div>
                            <img
                                @click="delExercise(1)"
                                src="~@/assets/images/wrongbook/icon_delete_black.png
                        "
                                alt=""
                            />
                        </div>
                    </div>
                </div>
            </main>
            <div class="exercise-footer">
                <div class="btn download-btn">下载为word</div>
                <div class="btn next-btn" @click="currentSetp = 2">下一步</div>
            </div>
        </template>
        <template v-if="currentSetp == 2">
            <main class="homework-main">
                <div class="homework-top">
                    <span class="types">布置对象</span>
                    <span class="class"
                        >{{ props.gradeName }}(共{{ 30 }}人)</span
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
                                    <div class="title">一年级一班错题复习</div>
                                    <img
                                        @click="
                                            editHomeowrkName(
                                                '一年级一班错题复习'
                                            )
                                        "
                                        src="~@/assets/images/wrongbook/icon_bianji.png"
                                        alt=""
                                    />
                                </div>
                                <div class="count">共{{ 10 }}题</div>
                                <div class="book-type">数学 苏教版 一上</div>
                            </div>
                            <div class="item-right">
                                <div class="text">选择学生：</div>
                                <div class="stu-select">
                                    <el-cascader
                                        :options="state.options"
                                        :props="{ multiple: true }"
                                        collapse-tags
                                        size="small"
                                        clearable
                                    />
                                </div>
                                <img
                                    @click="selectStudent"
                                    src="~@/assets/images/wrongbook/icon_edit_two.png"
                                    alt=""
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <div class="exercise-footer" style="width: 100%">
                <div class="btn download-btn">下载为word</div>
                <div class="btn next-btn" @click="">确认布置</div>
            </div>
        </template>

        <!-- 删除提示 -->
        <el-dialog v-model="dialogVisible" :show-close="false" width="360px">
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
            <div class="dialog-content">
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
                <div class="cobtn sureBtn">确定删除</div>
            </div>
        </el-dialog>

        <!-- 修改作业名称 -->
        <el-dialog v-model="editVisible" :show-close="false" width="360px">
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
                <div class="cobtn primBtn">确定</div>
            </div>
        </el-dialog>

        <!-- 选择学生 -->
        <el-dialog
            custom-class="studentDialog"
            :show-close="false"
            v-model="studentVisible"
            width="80%"
        >
            <template #title>
                <span></span>
                <span class="my-header">修改作业名称</span>
                <span @click="studentVisible = false">
                    <img
                        src="~@/assets/images/wrongbook/icon_close_popup_gray.png"
                        alt=""
                    />
                </span>
            </template>
            <div class="dialog-content"></div>
            <div class="custom-footers">
                <div class="footer-left">
                    <el-checkbox
                        v-model="checkedAll"
                        label="全选"
                        size="large"
                    />
                    <span class="selected"> 当前已选{{ 16 }}人 </span>
                </div>
                <div class="cobtn primBtn">确定</div>
            </div>
        </el-dialog>
    </div>
</template>
<script lang="ts" setup>
import { defineEmits, defineProps, watch, ref, reactive } from "vue";
import { FileInfo } from "@/types/lookQuestion";
import { getOssUrl } from "@/utils/oss";
const emit = defineEmits(["update:isShowContent"]);
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
    //试题篮的练习题
    exerciseData: {
        type: Array,
        default: () => [
            {
                QuestionID: "39F76667529427E7066560E8D1786217",
                QuestionType: 6,
            },
        ],
    },
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
});
watch(
    () => props.exerciseData,
    (val) => {
        console.log(val);
        if (val.length) {
            // getFileList(val);
        }
    },
    { deep: true, immediate: true }
);

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
    dialogVisible.value = true;
};
//编辑作业名称
const editHomeowrkName = (name: string) => {
    console.log("作业名称", name);
    homeworkName.value = name || "";
    editVisible.value = true;
};
//选择学生
const selectStudent = (data: any) => {
    console.log("选择学生", data);
    studentVisible.value = true;
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

    :deep(.el-dialog) {
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
    :deep(.el-dialog.studentDialog) {
        height: 88vh;
        .el-dialog__body {
            padding: 0;
            height: calc(100% - 64px);
        }
        .dialog-content {
            height: calc(100% - 64px);
        }
        .custom-footers {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 16px;
        }
    }
}
</style>
