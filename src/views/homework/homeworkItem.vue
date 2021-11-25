<template>
    <div class="table-row">
        <div class="flex-between-center" style="margin-bottom: 10px">
            <div class="first-col">
                <img
                    v-if="info.HomeworkPaperType == 1"
                    :src="
                        require('@/assets/images/homeworkNew/icon_shipin.png')
                    "
                    alt=""
                />
                <img
                    v-if="info.HomeworkPaperType == 0"
                    :src="require('@/assets/images/homeworkNew/homework1.png')"
                    alt=""
                />
                <img
                    v-if="info.HomeworkPaperType == 2"
                    :src="require('@/assets/images/homeworkNew/homework2.png')"
                    alt=""
                />

                <img
                    v-if="info.HomeworkPaperType == 99"
                    :src="require('@/assets/images/homeworkNew/homework0.png')"
                    alt=""
                />
                <p>
                    <template v-if="info.HomeworkPaperType == 2">
                        {{ info.WorkbookName }}&nbsp; 第{{
                            info.WorkbookPaperPageNum
                        }}页
                    </template>
                    <template v-else-if="info.HomeworkPaperType == 0">
                        {{ info.PaperName }}
                    </template>
                    <template v-else-if="info.HomeworkPaperType == 99">
                        {{ info.HomeworkName }}
                    </template>
                </p>
                <span
                    v-show="
                        info.HomeworkPaperType == 1 ||
                        info.HomeworkPaperType == 0
                    "
                    >{{ courseBagType }}</span
                >
            </div>
            <span style="color: #000; flex: 1.5">
                <template v-if="info.HomeworkPaperType == 0"
                    >{{ info.AllQuestionCount }}题</template
                >
                <template v-if="info.HomeworkPaperType == 1"
                    >时长：{{ washDurationTrans }}</template
                >
            </span>
            <span>
                <template
                    v-if="
                        info.HomeworkPaperType == 1 ||
                        info.HomeworkPaperType == 0
                    "
                    >{{ info.AlbumName }} {{ info.ChapterName }}</template
                >
            </span>

            <div class="progress-content">
                <template v-if="info.HomeworkPaperType === 1">
                    <el-progress
                        type="circle"
                        :percentage="probability ? probability : 0"
                        status="success"
                        color="#2EE18E"
                    ></el-progress>
                    <span class="text-color">{{ info.VideoCount }} </span
                    >&nbsp;人已看完，共 {{ info.AllStudentCount }} 人
                </template>

                <template v-if="info.HomeworkPaperType === 0">
                    <el-progress
                        type="circle"
                        :percentage="probability ? probability : 0"
                        status="success"
                        color="#2EE18E"
                    ></el-progress>
                    <span>当前正确率:</span>
                    <span class="text-color"
                        >{{ probability ? probability : "0.00" }}%
                    </span>
                </template>
            </div>
            <div class="progress-content1">
                <template v-if="info.HomeworkPaperType === 1">
                    <span>{{ probability1 }}%已审</span>
                </template>
                <template v-if="info.HomeworkPaperType === 0">
                    <span>待审阅</span>&nbsp;
                    <span class="text-color">{{ info.NoSureCount }}</span>
                </template>
                <template
                    v-if="info.HomeworkPaperType == 99 && info.NeedSubmit == 1"
                    ><span class="text-color">需在线提交</span></template
                >
                <template
                    v-if="info.HomeworkPaperType == 99 && info.NeedSubmit != 1"
                    ><span class="text-color">无需提交</span></template
                >
            </div>
            <div class="people">
                <span>已完成人数：</span>
                <span class="text-color"
                    >{{ info.FinishStudentCount }} /
                    {{ info.AllStudentCount }}</span
                >
            </div>
            <div class="btn-list">
                <!-- <el-button
                    size="small"
                    type="primary"
                    plain
                    @click="
                      $router.push({
                        path: '/lookStudents',
                      })
                    "
                    >查阅学生</el-button
                  > -->
                <el-button size="small" type="primary" @click="review"
                    >查阅作业</el-button
                >
                <el-button
                    size="small"
                    type="danger"
                    plain
                    icon="el-icon-delete"
                    @click="deleteHomework"
                    >删除</el-button
                >
            </div>
        </div>
        <div v-if="info.HomeworkPaperFiles.length > 0" class="file">
            <FileItem v-for="(file, j) in info.HomeworkPaperFiles" :key="j" :file="file"/>
        </div>
    </div>
</template>

<script lang="ts">
import { Homework } from "@/types/homework";
import { ElMessage, ElMessageBox } from "element-plus";
import { computed, defineComponent, PropType } from "vue";
import { rebackHomeworkPaper } from "./api";
import FileItem from "./FileItem.vue";
export default defineComponent({
    props: {
        info: {
            type: Object as PropType<Homework>,
            default: () => ({})
        }
    },
    setup(props, { emit }) {
        const courseBagType = computed(() => {
            const type = props.info.ClassifyType;
            let typeNme = "课前";
            switch (type) {
            case 1:
                typeNme = "拓展延伸";
                break;
            case 2:
                typeNme = "课前预习";
                break;
            case 3:
                typeNme = "课中小练";
                break;
            case 4:
                typeNme = "课后作业";
                break;
            case 5:
                typeNme = "名师专题";
                break;
            case 6:
                typeNme = "单元考试";
                break;
            case 7:
                typeNme = "重点巩固";
                break;
            case 8:
                typeNme = "难点突破";
                break;
            }
            return typeNme;
        });

        const washDurationTrans = computed(() => {
            const duration = props.info.VideoDurationTick;
            let b = "";
            let h: string | number = Math.floor((duration % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            let m: string | number = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
            let s: string | number = Math.floor((duration % (1000 * 60)) / 1000);
            if (h > 0) {
                h = h < 10 ? "0" + h : h;
                b += h + ":";
            }
            m = m < 10 ? "0" + m : m;
            s = s < 10 ? "0" + s : s;
            b += m + ":" + s;
            return b;
        });

        const probability = computed(() => {
            return Number(((props.info.RightCount /
                (props.info.RightCount + props.info.WrongCount)) *
                100).toFixed(2));
        });

        const probability1 = computed(() => {
            return props.info.ReviewQuestionCount
                ? ((props.info.ReviewQuestionCount /
                    (props.info.RightCount +
                        props.info.WrongCount +
                        props.info.NoSureCount)) *
                    100).toFixed(2)
                : 0;
        });

        const review = () => {
            console.log(props.info);
        };

        const deleteHomework = () => {
            ElMessageBox.confirm("确认删除此班级的这份作业吗?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(async () => {
                const res = await rebackHomeworkPaper({
                    classHomeworkPaperIDs: [props.info.ClassHomeworkPaperID]
                });
                if (res.resultCode === 200) {
                    ElMessage.success("删除成功");
                    emit("getTaskList");
                }
            }).catch(() => {
                ElMessage.info("已取消删除");
            });
        };

        return {
            courseBagType,
            probability,
            review,
            deleteHomework,
            probability1,
            washDurationTrans
        };
    },
    components: { FileItem }
});
</script>

<style lang="scss" scoped>
.table-row {
    font-size: 14px;
    color: #5f626f;
    margin-bottom: 10px;
    > div {
        padding: 13px 20px;
        background: #f3f7ff;
        > span {
            flex: 1;
            display: block;
        }
        > span:nth-of-type(2),
        .progress-content {
            flex: 1.5;
        }
        p {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .people {
            flex: 1;
        }
        .progress-content1 {
            width: 5%;
            margin: 0 20px;
        }
        .btn-list {
            width: 340px;
            float: right;
            text-align: right;
        }
    }
    .text-color {
        color: #4b71ee;
    }
    .first-col {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex: 2;
        margin-right: 3rem;
        img {
            width: 20px;
            height: 20px;
            vertical-align: bottom;
        }
        p {
            flex: 2;
            font-size: 16px;
            font-weight: 600;
            color: #19203d;
            margin: 0 30px;
        }
        span {
            flex: 1;
            font-size: 14px;
            color: #4b71ee;
            position: relative;
            margin-left: 10px;
            &::before {
                position: absolute;
                left: -8px;
                top: 4px;
                content: "";
                display: block;
                width: 4px;
                height: 5px;
                background-color: #4b71ee;
            }
        }
    }
    .progress-content {
        flex: 1;
        display: flex;
        align-items: center;
        :deep(.el-progress-circle) {
            width: 30px !important;
            height: 30px !important;
            margin-right: 10px;
        }
        :deep(.el-progress__text) {
            display: none;
        }
    }
}
.file {
    display: flex;
    justify-content: flex-start;
    padding-top: 10px;
    margin-top: -10px;
    padding: 0 20px !important;
    border-top: 1px solid #e9ecf0;
}
</style>
