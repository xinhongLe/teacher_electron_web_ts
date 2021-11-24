<template>
    <div class="assign-box">
        <el-dialog
            :title="process === 1 ? '布置课前作业' : '布置课后作业'"
            :model-value="dialogVisible"
            width="50%"
            center
            :before-close="handleClose"
        >
            <div class="taskInfo">
                <p>作业名称</p>
                <el-input
                    v-model="afterWorkName"
                    placeholder="请输入内容"
                ></el-input>
                <p>布置对象</p>
                <div class="class-list">
                    <div v-for="(item, index) in classList" :key="index">
                        {{ item.ClassName }}
                    </div>
                </div>
                <p>作业内容</p>
                <div class="list-box">
                    <div
                        class="list"
                        v-for="(item, index) in afterHomeWork"
                        :key="index"
                    >
                        <div class="video" v-if="item.HasVideo">
                            <div class="icon">
                                <img
                                    src="../../assets/images/attend-class/icon_shipin.png"
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
                                    src="../../assets/images/attend-class/icon_timu.png"
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
                                    type="primary"
                                    plain
                                    @click="lookQuestions({id: item.PaperID, type: 1})"
                                    >查看题目</el-button
                                >
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="btn">
                <el-button type="primary" @click="send">立即发送</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import { CourseBagClasses, CourseWares } from "@/api";
import { ElMessage } from "element-plus";
import { defineComponent, inject, ref } from "vue";
import { assignDefaultHomework, fetchCourseBagTeachingLogsByID } from "./api";
import { formatDuration, lookQuestions, lookVideo } from "@/utils";

export default defineComponent({
    props: {
        dialogVisible: {
            type: Boolean,
            default: false
        },
        courseId: {
            type: String,
            default: ""
        },
        process: {
            type: Number,
            default: 1
        }
    },
    setup(props, { emit }) {
        const afterWorkName = ref("");
        const classList = ref<CourseBagClasses[]>([]);
        const afterHomeWork = ref<CourseWares[]>([]);

        const getTeacherClasses = inject("getTeacherClasses") as () => void;

        fetchCourseBagTeachingLogsByID({
            id: props.courseId
        }).then((res) => {
            if (res.resultCode === 200) {
                const { Classes } = res.result;
                classList.value = Classes[0].Classes;
                afterWorkName.value =
                    classList.value.length > 1
                        ? `${props.process === 1 ? "课前" : "课后"}：多班作业`
                        : `${props.process === 1 ? "课前" : "课后"}：${classList.value[0].ClassName}的作业`;
                afterHomeWork.value = Classes[0].CourseWares.filter(({ Process }) => Process === props.process);
            }
        });

        const handleClose = () => {
            emit("update:dialogVisible", false);
        };

        const send = () => {
            const data = {
                type: props.process,
                name: afterWorkName.value,
                id: props.courseId
            };
            assignDefaultHomework(data).then(res => {
                if (res.resultCode === 200) {
                    ElMessage.success("布置成功！");
                    getTeacherClasses();
                    handleClose();
                }
            });
        };

        return {
            afterWorkName,
            classList,
            formatDuration,
            lookQuestions,
            send,
            handleClose,
            lookVideo,
            afterHomeWork
        };
    }
});
</script>

<style lang="scss" scoped>
.assign-box {
    :deep(.el-dialog) {
        border-radius: 8px;
        .el-dialog__body {
            padding: 0;
        }
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
        margin-bottom: 6px;
    }
    :deep(input) {
        margin-bottom: 10px;
        width: 100%;
        outline: none;
        border: none;
        font-size: 12px;
        color: #19203d;
        height: 36px;
        line-height: 36px;
        border-radius: 4px;
    }
    .class-list {
        overflow: hidden;
        margin-top: 10px;
        > div {
            margin-bottom: 10px;
            width: 100%;
            outline: none;
            border: none;
            font-size: 12px;
            color: #19203d;
            height: 36px;
            line-height: 36px;
            border-radius: 4px;
            background: #fff;
            padding: 0 15px;
        }
        > div:nth-of-type(4n) {
            margin: 0;
        }
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
    max-height: 190px;
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
