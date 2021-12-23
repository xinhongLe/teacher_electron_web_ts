<template>
    <div class="assign-homework-wrapper">
        <header>
            <p>{{ $route.params.subjectName }}</p>
        </header>
        <div class="row-line"></div>
        <div class="assign-homework-content">
            <AssignObject @updateClassList="updateClassList" />
            <div>
                <p class="title-class">作业内容</p>
                <div class="content-wrapper">
                    <div>
                        <el-button
                            plain
                            icon="el-icon-plus"
                            @click="commonHomeworkDialog = true"
                            >普通作业</el-button
                        >
                        <el-button
                            plain
                            type="primary"
                            icon="el-icon-plus"
                            @click="systemHomeworkDialog = true"
                            >系统作业</el-button
                        >
                        <el-button
                            plain
                            type="warning"
                            icon="el-icon-plus"
                            @click="teachHomeworkDialog = true"
                            >教辅作业</el-button
                        >
                    </div>
                    <CommonHomeworkItem
                        v-for="(item, index) in commonHomeworkList"
                        :key="index"
                        :item="item"
                        :index="index"
                        @updateCommonHomework="updateCommonHomework"
                        @deleteCommonHomework="deleteCommonHomework"
                    />
                    <SystemHomeworkItem
                        v-for="(item, index) in systemHomeworkList"
                        :key="item.PaperID"
                        :index="commonHomeworkList.length + index + 1"
                        :item="item"
                        :realIndex="index"
                        @delete="deleteSystemHomework"
                    />
                    <TeachHomeworkItem
                        v-for="(item, index) in teachHomeworkList"
                        :key="item.WorkbookPaperID"
                        :index="commonHomeworkList.length + systemHomeworkList.length + index + 1"
                        :item="item"
                        :realIndex="index"
                        @delete="deleteTeachHomework"
                        @update="updateTeachHomework"
                    />
                </div>
            </div>
        </div>
        <footer>
            <el-button type="primary" @click="submit">立即发送</el-button>
        </footer>
        <CommonHomeworkDialog
            v-model:dialogVisible="commonHomeworkDialog"
            v-if="commonHomeworkDialog"
            @updateCommonHomeworkList="updateCommonHomeworkList"
        />
        <SystemHomeworkDialog
            v-model:dialogVisible="systemHomeworkDialog"
            v-if="systemHomeworkDialog"
            @updateSystemHomeworkList="updateSystemHomeworkList"
        />
        <TeachHomeworkDialog
            v-model:dialogVisible="teachHomeworkDialog"
            v-if="teachHomeworkDialog"
            @update="updateTeachHomeworkList"
        />
    </div>
</template>

<script lang="ts">
import { Paper } from "@/types/assignHomework";
import { ElMessage } from "element-plus";
import moment from "moment";
import { defineComponent, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { publishHomework } from "./api";
import AssignObject from "./AssignObject.vue";
import CommonHomeworkDialog from "./CommonHomeworkDialog.vue";
import CommonHomeworkItem from "./CommonHomeworkItem.vue";
import useHomeworkList from "./hooks/useHomeworkList";
import SystemHomeworkDialog from "./systemHomeworkDialog/index.vue";
import SystemHomeworkItem from "./SystemHomeworkItem.vue";
import TeachHomeworkDialog from "./TeachHomeworkDialog.vue";
import TeachHomeworkItem from "./TeachHomeworkItem.vue";
export default defineComponent({
    name: "AssignHomework",
    setup() {
        const commonHomeworkDialog = ref(false);
        const systemHomeworkDialog = ref(false);
        const teachHomeworkDialog = ref(false);
        const route = useRoute();
        const router = useRouter();

        const {
            classList,
            commonHomeworkList,
            updateClassList,
            studentList,
            deleteCommonHomework,
            updateCommonHomeworkList,
            updateCommonHomework,
            updateSystemHomeworkList,
            systemHomeworkList,
            deleteTeachHomework,
            teachHomeworkList,
            updateTeachHomeworkList,
            deleteSystemHomework,
            updateTeachHomework
        } = useHomeworkList();

        const submit = async () => {
            const commonPaper: Paper[] = commonHomeworkList.value.map((v) => {
                const students = v.students
                    .filter((val) => val.checked)
                    .map((val) => ({
                        studentID: val.ID,
                        classID: val.classID!
                    }));
                const files = v.files.map((val) => ({
                    fileName: val.fileName,
                    extension: val.extension,
                    name: val.name
                }));

                return {
                    type: 99,
                    name: v.name,
                    students,
                    files
                };
            });
            const systemPaper: Paper[] = systemHomeworkList.value.map((v) => {
                const students = v.students
                    .filter((val) => val.checked)
                    .map((val) => ({
                        studentID: val.ID,
                        classID: val.classID!
                    }));
                return {
                    type: v.type,
                    paperID: v.PaperID,
                    students,
                    questionIDs: v.Questions
                };
            });
            const teachPaper: Paper[] = teachHomeworkList.value.map(v => {
                const students = v.students
                    .filter((val) => val.checked)
                    .map((val) => ({
                        studentID: val.ID,
                        classID: val.classID!
                    }));
                return {
                    type: 2,
                    students,
                    paperID: v.WorkbookPaperID,
                    answerShowTime: v.publishTime ? `${moment(v.publishTime).format("YYYY-MM-DD HH:mm:ss")}` : ""
                };
            });
            const data = {
                subjectID: route.params.subjectId as string,
                classes: classList.value.map((v) => ({ classID: v.ClassId })),
                papers: [...commonPaper, ...systemPaper, ...teachPaper]
            };
            const res = await publishHomework(data);
            if (res.resultCode === 200) {
                ElMessage.success("布置作业成功");
                setTimeout(() => {
                    router.push("/homework");
                }, 500); // 延时跳转，确保服务器数据已刷新
            }
        };

        return {
            classList,
            updateClassList,
            studentList,
            deleteCommonHomework,
            commonHomeworkList,
            updateCommonHomeworkList,
            updateCommonHomework,
            submit,
            updateSystemHomeworkList,
            systemHomeworkList,
            teachHomeworkDialog,
            deleteSystemHomework,
            deleteTeachHomework,
            updateTeachHomework,
            teachHomeworkList,
            updateTeachHomeworkList,
            systemHomeworkDialog,
            commonHomeworkDialog
        };
    },
    components: {
        AssignObject,
        CommonHomeworkDialog,
        CommonHomeworkItem,
        SystemHomeworkDialog,
        SystemHomeworkItem,
        TeachHomeworkDialog,
        TeachHomeworkItem
    }
});
</script>

<style lang="scss" scoped>
.assign-homework-wrapper {
    height: 100%;
    header {
        padding: 20px;
        p {
            font-size: 32px;
            font-weight: 600;
            color: #19203d;
        }
    }
    .row-line {
        height: 10px;
        background-color: #f5f6fa;
    }
    .assign-homework-content {
        height: calc(100% - 152px);
        overflow-y: auto;
        padding: 20px;
        > div {
            display: flex;
            margin-bottom: 30px;
            .title-class {
                width: 100px;
                font-size: 20px;
                font-weight: 600;
                color: #19203d;
                text-align: center;
                margin-right: 20px;
                padding-top: 8px;
            }
            .class-wrapper {
                flex: 1;
                .class-content {
                    margin-top: 10px;
                    > p {
                        width: 100%;
                        height: 56px;
                        line-height: 56px;
                        background: #f9fafc;
                        border-radius: 4px;
                        padding: 0 20px;
                        margin-bottom: 10px;
                        span {
                            display: inline-block;
                            margin-left: 40px;
                        }
                    }
                }
            }
            .content-wrapper {
                flex: 1;
                min-width: 0;
            }
        }
    }
    footer {
        margin-top: 15px;
        text-align: center;
    }
}
</style>
