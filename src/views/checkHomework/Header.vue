<template>
    <div class="header">
        <div class="left">
            <img
                class="goback"
                @click="$router.push('/homework')"
                src="@/assets/images/homeworkNew/icon_back.png"
                alt=""
            />
            <img
                v-if="type === 0"
                class="docx"
                src="@/assets/images/homeworkNew/icon_timu.png"
                alt=""
            />
            <img
                v-else-if="type === 2"
                class="docx"
                src="@/assets/images/homeworkNew/homework2.png"
                alt=""
            />
            <img
                v-else-if="type === 99"
                class="docx"
                src="@/assets/images/homeworkNew/homework0.png"
                alt=""
            />
            <img
                v-else-if="type === 1"
                class="docx"
                src="@/assets/images/homeworkNew/icon_shipin.png"
                alt=""
            />
            <span class="name">{{ name }}</span>
            <template v-if="type === 2">
                <span class="name" :style="{ marginLeft: '10px' }"
                    >第{{ workbookPaperPageNum }}页</span
                >
                <span class="name" :style="{ marginLeft: '40px' }">{{
                    albumName
                }}</span>
            </template>
            <template v-if="type === 1 || type === 0">
                <span class="class-detail">
                    {{ albumName }} {{ chapterName }} {{ lessonName }}
                </span>
                <span class="tips" v-if="type === 1"
                    >时长{{ formatDuration(videoDurationTick) }}</span
                >
            </template>
            <template v-if="type === 0 || type === 2">
                <span class="tips">共{{ count }}题</span>
            </template>
        </div>
        <div class="right">
            <div v-if="type === 99">
                <div v-for="(item, index) in homeworkPaperFiles" :key="index" class="file" @click="viewInfo(item.File)">
                    <img :src=" require('@/assets/images/homeworkNew/' +showFileIcon(item.File.Extention) +'.png')"/>
                </div>
                <Enlarge v-model:visible="visible" v-if="visible" :src="src" :extention="extention"/>
            </div>
            <div v-else-if="type === 1">
                <div class="view-video-button">
                    <img src="@/assets/images/homeworkNew/icon_timuxiangqing.png" alt=""/>
                    <span @click="lookVideo(videoID)">视频详情</span>
                </div>
            </div>
            <div v-else-if="type === 2" class="homework-warp">
                <div class="homework" >
                    <div class="answer" style="margin-left: 10px" v-if="answerShowTime">
                        <span v-if="showPublish">
                            答案公布时间：{{ detailTime(answerShowTime) }}
                            <el-icon @click="changeTag" style="margin: 0 10px; color: #4b71ee"><Edit /></el-icon>
                            <el-date-picker
                                popper-class="hand-publish"
                                v-if="showdataPicker"
                                ref="dataPicker"
                                type="datetime"
                                v-model="date"
                                size="large"
                                @blur="dataBlur"
                                placeholder="选择日期时间"
                            >
                            </el-date-picker>
                        </span>
                        <el-button v-if="showPublish" size="small" type="success" @click="publish(homeworkDetail)">立即发布</el-button>
                        <span v-if="!showPublish" style="margin-right: 10px">答案已公布</span>
                        <el-button v-if="!showPublish" size="small" @click="hideAnswer(homeworkDetail)">撤回发布</el-button>
                    </div>
                    <div class="detail" style="margin-left: 10px" v-else>
                        <span>手动发布
                            <el-icon  @click="changeTag" style="margin: 0 10px; color: #4b71ee"><Edit /></el-icon>
                            <el-date-picker
                                popper-class="hand-publish"
                                v-if="showdataPicker"
                                ref="dataPicker"
                                type="datetime"
                                v-model="date"
                                @blur="dataBlur"
                                placeholder="选择日期时间"
                            >
                            </el-date-picker>
                        </span>
                        <el-button size="small" type="success" @click="publish(homeworkDetail)">立即发布</el-button>
                    </div>
                </div>
                <el-button  size="small"  plain type="warning" @click="handleMistakesCollect(homeworkDetail)">收集错题</el-button>
            </div>
        </div>

        <mistakes-collect
            :info="homeworkDetail"
            :mistakesCollectState="mistakesCollectState"
            :isFinishState="isFinishState"
            :collectedCount="collectedCount"
            :collectionId="collectionId"
            v-model:dialogVisible="mistakesCollectDialog"></mistakes-collect>
    </div>
</template>

<script lang="ts">
import useViewHomeworkFile from "@/hooks/useViewHomeworkFile";
import { HomeworkDetail } from "@/types/checkHomework";
import { FileInfo } from "@/types/lookQuestion";
import { defineComponent, nextTick, PropType, ref, toRefs } from "vue";
import { formatDuration, showFileIcon, lookVideo } from "@/utils";
import Enlarge from "@/components/enlarge/index.vue";
import MistakesCollect from "@/views/homework/components/mistakesCollect.vue";
import { Homework } from "@/types/homework";
import { HideAnswer, ShowAnswer, topicConnectionState, fetchClassHomeworkPaperList } from "@/views/homework/api";
import moment from "moment";
import { ElMessage, ElMessageBox } from "element-plus";
export default defineComponent({
    props: {
        homeworkDetail: {
            type: Object as PropType<HomeworkDetail>,
            required: true
        }
    },
    emits: ["changeHomeworkDetail"],
    setup(props, { emit }) {
        const extention = ref("");
        const { visible, viewInfo, src } = useViewHomeworkFile();
        const _viewInfo = (file: FileInfo) => {
            extention.value = file.Extention;
            viewInfo(file);
        };

        const mistakesCollectDialog = ref(false);
        const mistakesCollectState = ref(0); // 0未收集过，1已收集过
        const isFinishState = ref(0); // 0未完成收集，1已完成收集
        const collectedCount = ref(0); // 0未完成收集，1已完成收集
        const collectionId = ref("");
        const handleMistakesCollect = () => {
            topicConnectionState({ Id: props.homeworkDetail.classHomeworkPaperID }).then(res => {
                if (res.resultCode === 200) {
                    mistakesCollectState.value = res.result.HasCollection || 0;
                    isFinishState.value = res.result.IsFinish || 0;
                    collectedCount.value = res.result.CollectedCount || 0;
                    collectionId.value = res.result.CollectionId || "";
                    mistakesCollectDialog.value = true;
                }
            });
        };
        const detailTime = (str: string) => {
            return `${moment(str).format("YYYY-MM-DD HH:mm:ss")}`;
        };
        const showdataPicker = ref(false);
        const dataPicker = ref();
        const date = ref("");
        const changeTag = () => {
            showdataPicker.value = true;
            date.value = props.homeworkDetail.answerShowTime || "";
            nextTick(() => {
                dataPicker.value.focus();
                dataPicker.value.display = "none";
                setTimeout(() => {
                    // 添加日历footer里的的确定和此刻按钮的点击事件
                    const cur = document.querySelectorAll(".el-picker-panel__link-btn");
                    for (var m in cur) {
                        if (cur[m]) {
                            try {
                                // cur[m].setAttribute("display", "none");
                            } catch (error) {
                                console.log(error);
                            }
                        }
                    }
                    const currentBtn = document.querySelectorAll(".hand-publish .el-picker-panel .el-picker-panel__footer .el-button");
                    for (var i in currentBtn) {
                        if (currentBtn[i]) {
                            try {
                                currentBtn[i].addEventListener("click", () => {
                                    dateChange(date.value, props.homeworkDetail);
                                });
                            } catch (error) {
                                console.log(error);
                            }
                        }
                    }
                }, 500);
            });
        };
        const dataBlur = () => {
            showdataPicker.value = false;
        };
        const dateChange = (val: any, info: any) => {
            const obj = {
                classHomeworkPaperID: info.classHomeworkPaperID,
                answerShowTime: `${moment(val).format("YYYY-MM-DD HH:mm:ss")}`
            };
            ShowAnswer(obj).then((res) => {
                if (res.resultCode === 200) {
                    ElMessage({ type: "success", message: "修改成功" });
                    _fetchClassHomeworkPaperList();
                }
            });
        };
        const publish = (item: any) => {
            ElMessageBox.confirm(
                "公布答案后家长和学生端会在作业系统里看到正确答案和详解，确定公布答案吗？?",
                "提示",
                {
                    confirmButtonText: "确认公布",
                    cancelButtonText: "取消",
                    type: "warning"
                }
            )
                .then(() => {
                    const obj = {
                        classHomeworkPaperID: item.classHomeworkPaperID
                    };
                    ShowAnswer(obj).then((res) => {
                        if (res.resultCode === 200) {
                            ElMessage({ type: "success", message: "发布成功" });
                            _fetchClassHomeworkPaperList();
                        }
                    });
                })
                .catch((err) => {
                    return err;
                });
        };
        // 隐藏
        const hideAnswer = (item: any) => {
            const obj = {
                id: item.classHomeworkPaperID
            };
            HideAnswer(obj).then((res) => {
                if (res.resultCode === 200) {
                    ElMessage({ type: "success", message: "撤回成功" });
                    _fetchClassHomeworkPaperList();
                }
            });
        };

        const _fetchClassHomeworkPaperList = () => {
            console.log(props.homeworkDetail, "-2333--");
            const data = {
                subjectID: props.homeworkDetail.formSubjectID || "",
                date: props.homeworkDetail.formDate || ""
            };
            fetchClassHomeworkPaperList(data).then(res => {
                if (res.resultCode === 200) {
                    const detailList = res.result.map((item:any) => {
                        return {
                            ...item,
                            showPublish: moment(item.AnswerShowTime) > moment(new Date())
                        };
                    });
                    const currentInfo = detailList.find(item => item.ClassHomeworkPaperID === props.homeworkDetail.classHomeworkPaperID);
                    if (currentInfo) {
                        emit("changeHomeworkDetail", { showPublish: currentInfo.showPublish, answerShowTime: currentInfo.AnswerShowTime });
                    }
                }
            });
        };
        return {
            extention,
            visible,
            viewInfo: _viewInfo,
            formatDuration,
            lookVideo,
            showFileIcon,
            src,
            ...toRefs(props.homeworkDetail),
            handleMistakesCollect,
            mistakesCollectDialog,
            mistakesCollectState,
            isFinishState,
            collectedCount,
            collectionId,
            showdataPicker,
            dataPicker,
            date,
            detailTime,
            changeTag,
            dataBlur,
            publish,
            hideAnswer
        };
    },
    components: { MistakesCollect, Enlarge }
});
</script>

<style lang="scss" scoped>
.header {
    padding: 28px 23px;
    height: 88px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-shrink: 0;
    min-height: 0px;
    border-bottom: 8px solid #f3f7ff;
    .left {
        display: flex;
        align-items: center;
        .goback {
            margin-right: 20px;
            width: 9px;
            cursor: pointer;
            height: 16px;
        }
        .docx {
            width: 24px;
            height: 24px;
            margin-right: 12px;
        }
        .name {
            font-size: 24px;
            font-weight: 600;
            color: #19203d;
        }
        .tips {
            font-size: 16px;
            font-weight: 500;
            color: #5f626f;
            margin-left: 20px;
        }
        .class-detail {
            margin-left: 20px;
        }
    }
    .right {
        display: flex;
        align-items: center;
        .file {
            width: 36px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: space-around;
            background: #f3f7ff;
            margin-left: 8px;
            img {
                width: 16px;
                height: 19px;
            }
        }
        .view-video-button {
            width: 140px;
            height: 40px;
            background: #4b71ee;
            border-radius: 4px;
            display: flex;
            align-items: center;
            padding: 0 20px;
            cursor: pointer;
            span {
                font-size: 16px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #ffffff;
                line-height: 22px;
                padding-left: 8px;
            }
            img {
                width: 20px;
            }
        }
        .homework-warp{
            display: flex;
            justify-content: space-between;
            .homework{
                margin-right: 20px;
            }
        }
    }
}
</style>
