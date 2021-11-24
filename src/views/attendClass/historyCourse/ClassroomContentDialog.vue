<template>
    <div class="assign-box">
        <el-dialog
            title="课堂内容"
            :model-value="visible"
            width="50%"
            center
            :before-close="handleClose"
        >
            <div class="taskInfo">
                <div class="list-box">
                    <div
                        class="list"
                        v-for="(item, index) in workList"
                        :key="index"
                    >
                        <div class="video" v-if="item.HasVideo">
                            <div class="icon">
                                <img
                                    src="./../../../assets/images/attend-class/icon_shipin.png"
                                />
                                <p>{{ formatDuration(item.VideoDuration) }}</p>
                            </div>
                            <div class="title">
                                <p>{{ item.Name }}</p>
                                <p>
                                    {{ item.AlbumName }} {{ item.ChapterName }}
                                    {{ item.LessonName }}
                                </p>
                            </div>
                            <div class="btns">
                                <el-button
                                    type="primary"
                                    plain
                                    @click="lookVideo(item.PaperID)"
                                    >查看视频</el-button
                                >
                            </div>
                        </div>
                        <div class="video subject">
                            <div class="icon">
                                <img
                                    src="./../../../assets/images/attend-class/icon_timu.png"
                                />
                                <p>{{ item.QuestionCount }}</p>
                            </div>
                            <div class="title">
                                <p>{{ item.Name }}</p>
                                <p>
                                    {{ item.AlbumName }} {{ item.ChapterName }}
                                    {{ item.LessonName }}
                                </p>
                            </div>
                            <div class="btns">
                                <el-button
                                    v-if="!item.MidHomeworkAssigned"
                                    type="primary"
                                    plain
                                    @click="send(item.ID)"
                                    >布置作业</el-button
                                >
                                <img
                                    v-else
                                    src="./../../../assets/images/attend-class/pic_zidongshenyue.png"
                                />
                                <el-button
                                    type="primary"
                                    plain
                                    @click="lookQuestions({ id: item.PaperID })"
                                    >查看题目</el-button
                                >
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import { CourseWares } from "@/api";
import { formatDuration } from "@/utils";
import { lookQuestions, lookVideo } from "@/views/preparation/logic";
import { ElMessage } from "element-plus";
import { defineComponent, ref } from "vue";
import { assignPaperHomework, fetchCourseBagTeachingLogsByID } from "../api";
export default defineComponent({
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        courseId: {
            type: String,
            default: ""
        }
    },
    setup(props, { emit }) {
        const workList = ref<CourseWares[]>([]);

        const handleClose = () => {
            emit("update:visible", false);
        };

        fetchCourseBagTeachingLogsByID({
            id: props.courseId
        }).then((res) => {
            if (res.resultCode === 200) {
                workList.value = res.result.Classes[0].CourseWares.filter(
                    (v) => v.Process === 2
                );
            }
        });

        const send = async (id: string) => {
            const res = await assignPaperHomework({ id });
            if (res.resultCode === 200) {
                ElMessage.success("布置成功！");
                handleClose();
            }
        };

        return {
            workList,
            handleClose,
            send,
            lookQuestions,
            lookVideo,
            formatDuration
        };
    }
});
</script>

<style lang="scss" scoped>
.assign-box :deep(.el-dialog) {
    border-radius: 8px;
    .el-dialog__body {
        padding: 0;
    }
}
.taskInfo {
    background: #f5f6fa;
    padding: 24px 32px;
    > p {
        font-size: 20px;
        font-weight: 550;
        color: #19203d !important;
        line-height: 28px;
    }
    .list {
        background: #fff;
        border-radius: 4px;
        margin-bottom: 15px;
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
}
.list-box {
    max-height: 400px;
    overflow-y: auto;
    margin-top: 10px;
}
.btn {
    background: #fff;
    justify-content: flex-end;
    display: flex;
    padding: 10px 30px;
}
</style>
