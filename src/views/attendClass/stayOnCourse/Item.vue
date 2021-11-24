<template>
    <div class="item">
        <div class="class-info">
            <p class="date">
                {{ formTime(item.ClassPlanStartTime) }} 周{{
                    formWeek(moment(item.ClassPlanStartTime).day())
                }}
                {{ moment(item.ClassPlanStartTime).format("hh:mm") }}-{{
                    moment(item.ClassPlanEndTime).format("hh:mm")
                }}
            </p>
            <p class="package-name">&nbsp;{{ item.ClassName }}</p>
            <p class="package-name class-name">
                &nbsp;{{ formatClass(item.Classes)
                }}<span @click="finishClass(item.ID)"
                    ><i class="el-icon-switch-button"></i>下课</span
                >
            </p>
        </div>
        <div class="course-info">
            <div
                class="detail"
                v-for="(val, index1) in item.CourseWares"
                :key="index1"
            >
                <!-- 只显示课堂作业（课中） -->
                <template v-if="val.Process === 2">
                    <div class="video" v-if="val.HasVideo">
                        <div class="icon">
                            <img
                                src="./../../../assets/images/attend-class/icon_shipin.png"
                            />
                            <p>{{ formatDuration(val.VideoDuration) }}</p>
                        </div>
                        <div class="title">
                            <p
                                style="
                                    overflow: hidden;
                                    max-width: 200px;
                                    text-overflow: ellipsis;
                                    white-space: nowrap;
                                "
                            >
                                {{ val.Name }}
                            </p>
                            <p>
                                {{ val.AlbumName }} {{ val.ChapterName }}
                                {{ val.LessonName }}
                            </p>
                        </div>
                        <div class="btns">
                            <el-button @click="lookVideo(val.PaperID)"
                                >播放</el-button
                            >
                        </div>
                    </div>
                    <div class="video subject">
                        <div class="icon">
                            <img
                                src="./../../../assets/images/attend-class/icon_timu.png"
                            />
                            <!-- <p>{{ val.QuestionCount }}</p> -->
                        </div>
                        <div class="title">
                            <p
                                style="
                                    overflow: hidden;
                                    max-width: 200px;
                                    text-overflow: ellipsis;
                                    white-space: nowrap;
                                "
                            >
                                {{ val.Name }}
                            </p>
                            <p>
                                {{ val.AlbumName }} {{ val.ChapterName }}
                                {{ val.LessonName }}
                            </p>
                        </div>
                        <div class="btns">
                            <!-- <el-button
                                    type="primary"
                                    plain
                                    v-if="!val.MidHomeworkAssigned"
                                    @click="assignPaperHomework(val.ID)"
                                    >布置</el-button
                                >
                                <img
                                    v-else
                                    src="./../../../assets/images/attend-class/pic_zidongshenyue.png"
                                /> -->
                            <el-button
                                @click="
                                    lookQuestions({ id: val.PaperID, type: 1 })
                                "
                                >打开</el-button
                            >
                        </div>
                    </div>
                </template>
            </div>
        </div>
        <div class="footer">
            <p>
                ---------<span
                    >{{ item.SubjectName }} {{ item.PublisherName }}
                    {{ item.AlbumName }} {{ item.ChapterName }}
                    {{ item.LessonName }}</span
                >---------
            </p>
        </div>
        <div class="btns">
            <template v-if="item.HaveBeforeCourseWare">
                <el-button
                    class="btn1"
                    v-if="!item.BeforeAssigned"
                    @click="assignDefaultHomework(item.ID, 1, item.Classes)"
                    >布置课前作业</el-button
                >
                <div v-else class="btn1 btn3">
                    <img
                        src="./../../../assets/images/attend-class/pic_zidongshenyue.png"
                    />
                    <div>
                        <p>检查课前作业</p>
                        <p>
                            <!-- 已完成{{ item.BeforeHomeworkStudent.Finish }}/总人数{{
                                    item.BeforeHomeworkStudent.Total
                                }} -->
                            已完成{{
                                item.BeforeHomeworkStudent
                                    ? item.BeforeHomeworkStudent.Finish
                                    : 0
                            }}
                            /总人数
                            {{
                                item.BeforeHomeworkStudent
                                    ? item.BeforeHomeworkStudent.Total
                                    : 0
                            }}
                        </p>
                    </div>
                </div>
            </template>
            <el-button class="btn1" v-else disabled>无课前作业</el-button>
            <template v-if="item.HaveAfterCourseWare">
                <el-button
                    class="btn2"
                    type="primary"
                    v-if="!item.AfterAssigned"
                    @click="assignDefaultHomework(item.ID, 2, item.Classes)"
                    >布置作业</el-button
                >
                <div v-else class="btn2 btn3 btn4">
                    <img
                        src="./../../../assets/images/attend-class/pic_zidongshenyue.png"
                    />
                    <div>
                        <p>检查课后作业</p>
                        <p>
                            已完成{{ item.TotalAfterComplate }}/总人数{{
                                item.TotalAfterStudent
                            }}
                        </p>
                    </div>
                </div>
            </template>
            <el-button class="btn2" v-else disabled>无课后作业</el-button>
        </div>
        <WorkDialog
            :courseId="item.ID"
            :process="3"
            v-model:dialogVisible="dialogVisible"
            v-if="dialogVisible"
        />
    </div>
</template>

<script lang="ts">
import { CourseBag, CourseBagClasses } from "@/api";
import useTime from "@/hooks/useTime";
import { defineComponent, inject, PropType, ref } from "vue";
import { formatClass, formatDuration, lookQuestions, lookVideo } from "@/utils";
import moment from "moment";
import { ElMessage, ElMessageBox } from "element-plus";
import { IResponse } from "@/types/response";
import { assignPaperHomework, finishClass, assignDefaultHomework } from "../api";
import WorkDialog from "../WorkDialog.vue";
export default defineComponent({
    props: {
        item: {
            type: Object as PropType<CourseBag>,
            required: true
        }
    },
    setup() {
        const dialogVisible = ref(false);

        const { formTime, formWeek } = useTime();

        const getTeacherClasses = inject("getTeacherClasses") as () => void;

        const openConfirmBox = (title: string, data: unknown,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
            apiName: (arg: any) => Promise<IResponse<null>>, message: string) => {
            ElMessageBox.confirm(title, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    apiName(data).then((res) => {
                        if (res.resultCode === 200) {
                            ElMessage.success(message);
                            getTeacherClasses();
                        }
                    });
                })
                .catch(() => {
                    ElMessage.info("已取消操作");
                });
        };

        const _finishClass = (id: string) => {
            openConfirmBox("确定要结束课程吗?", { id }, finishClass, "课程已结束!");
        };

        const _assignPaperHomework = (id: string) => {
            openConfirmBox("确定布置作业吗?", { id }, assignPaperHomework, "课程已结束!");
        };

        const _assignDefaultHomework = (id: string, type: number, classes: CourseBagClasses[]) => {
            let name = "";
            if (classes.length > 1) {
                name = "多班作业";
            } else {
                name = classes[0].ClassName + "的作业";
            }
            if (type === 1) {
                openConfirmBox("确定布置作业吗?", { id, type, name }, assignDefaultHomework, "布置成功!");
            } else {
                dialogVisible.value = true;
            }
        };
        return {
            lookQuestions,
            formTime,
            formWeek,
            moment,
            finishClass: _finishClass,
            assignPaperHomework: _assignPaperHomework,
            assignDefaultHomework: _assignDefaultHomework,
            lookVideo,
            formatDuration,
            dialogVisible,
            formatClass
        };
    },
    components: { WorkDialog }
});
</script>

<style lang="scss" scoped>
.item {
    height: 100%;
    width: 500px;
    box-sizing: border-box;
    flex-shrink: 0;
    margin-right: 15px;
    border-radius: 10px;
    background: #f5f6fa;
    display: flex;
    flex-flow: column;
    border: 1px solid #ccc;
    .class-info {
        padding: 15px 20px 10px;
        background: url("./../../../assets/images/attend-class/bg_gray.png");
        background-size: 100% 100%;
        .date {
            color: #fff;
            font-size: 26px;
            font-weight: 600;
        }
        .package-name {
            color: #fff;
            line-height: 16px;
            margin-top: 27px;
            font-size: 16px;
        }
        .package-name:before {
            border-radius: 50%;
            content: "";
            width: 6px;
            height: 6px;
            margin-top: 3px;
            display: block;
            float: left;
            border: 1px solid #fff;
        }
        .class-name {
            margin-top: 25px;
            overflow: hidden;
            span {
                float: right;
                background: #ff6b6b;
                display: block;
                width: 110px;
                font-size: 14px;
                line-height: 40px;
                border-radius: 40px;
                text-align: center;
                cursor: pointer;
                user-select: none;
                i {
                    margin-right: 5px;
                }
            }
        }
    }
    .course-info {
        flex: 1;
        flex-grow: 1;
        max-height: 860px;
        overflow-y: auto;
        padding: 15px;
    }
    .detail {
        background: #fff;
        border-radius: 4px;
        margin-top: 15px;
        .video {
            display: flex;
            padding: 20px;
            padding-left: 0px;
            .icon {
                width: 56px;
                img {
                    width: 20px;
                    margin: auto;
                    display: block;
                }
                p {
                    text-align: center;
                    margin-top: 6px;
                    color: #adafb9;
                }
            }
            .title {
                margin-left: 20px;
                font-size: 16px;
                flex: 1;
                p:nth-of-type(2) {
                    font-size: 12px;
                    margin-top: 10px;
                    color: #adafb9;
                }
            }
            .btns {
                position: relative;
                :deep(.el-button) {
                    line-height: 30px;
                    padding: 0 20px;
                    margin-top: 3px;
                }
                img {
                    width: 50px;
                    left: -70px;
                    top: -5px;
                    position: absolute;
                }
            }
        }
    }
    .footer {
        line-height: 50px;
        color: #adafb9;
        p {
            text-align: center;
        }
        span {
            margin: 0 30px;
        }
    }
    > .btns {
        padding: 0 30px;
        margin-top: -5px;
        display: flex;
        margin-bottom: 20px;
        .btn1 {
            width: 40%;
            height: 52px;
            margin-right: 20px;
        }
        .btn2 {
            flex: 1;
        }
        .btn3 {
            height: 52px;
            border-radius: 4px;
            display: flex;
            justify-content: center;
            border: 1px solid #98aef6;
            cursor: pointer;
            user-select: none;
            > img {
                width: 50px;
                height: 50px;
                float: left;
            }
            div {
                float: left;
            }
            div p:nth-of-type(1) {
                margin-top: 7px;
                font-size: 16px;
                color: #4b71ee;
                line-height: 22px;
            }
            div p:nth-of-type(2) {
                font-size: 12px;
                color: #4b71ee;
                line-height: 17px;
                opacity: 0.6;
            }
        }
        .btn4 {
            background: #4b71ee;
            > div p {
                color: #fff !important;
            }
        }
    }
}
</style>
