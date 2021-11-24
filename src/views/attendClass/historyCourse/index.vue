<template>
    <div class="history-list">
        <el-card class="history-list-card">
            <el-form :inline="true" :model="search">
                <el-form-item label="日期：">
                    <el-date-picker
                        v-model="search.dateRange"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="科目：">
                    <el-select v-model="search.subject">
                        <el-option
                            v-for="item in subjectList"
                            :key="item.ID"
                            :label="item.Name"
                            :value="item.ID"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="班级：">
                    <el-select v-model="search.class">
                        <el-option
                            v-for="item in classList"
                            :key="item.ID"
                            :label="item.Name"
                            :value="item.ID"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onQuery">查询</el-button>
                </el-form-item>
            </el-form>
            <el-table :data="tableData">
                <el-table-column prop="date" label="日期" align="center">
                    <template v-slot="scope">
                        {{ formatDate(scope.row.ClassPlanStartTime) }}
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="时间" align="center">
                    <template v-slot="scope">
                        {{ formatTime(scope.row.ClassPlanStartTime) }} ~
                        {{ formatTime(scope.row.ClassPlanEndTime) }}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="SubjectName"
                    label="科目"
                    align="center"
                ></el-table-column>
                <el-table-column prop="city" label="班级" align="center">
                    <template v-slot="scope">
                        {{ formatClass(scope.row.Classes) }}
                    </template>
                </el-table-column>
                <el-table-column prop="Name" label="课包" align="center">
                    <template v-slot="scope">
                        <p>{{ scope.row.Name }}</p>
                        <p>
                            {{ scope.row.PublisherName }}
                            {{ scope.row.AlbumName }}
                            {{ scope.row.ChapterName }}
                            {{ scope.row.LessonName }}
                        </p>
                    </template>
                </el-table-column>
                <el-table-column label="课前预习" align="center">
                    <template v-slot="scope">
                        <template v-if="scope.row.HaveBeforeCourseWare">
                            <div v-if="!scope.row.BeforeAssigned">
                                <p>未布置</p>
                                <el-button
                                    size="mini"
                                    type="primary"
                                    @click="showWork(scope.row.ID, 1)"
                                    >布置</el-button
                                >
                            </div>
                            <div v-else>
                                <p>
                                    已完成{{
                                        scope.row.TotalBeforeComplate
                                    }}/总人数{{ scope.row.TotalBeforeStudent }}
                                </p>
                                <el-button size="mini" type="primary"
                                    >查看完成情况</el-button
                                >
                            </div>
                        </template>
                        <template v-else>
                            <p>无课前作业</p>
                        </template>
                    </template>
                </el-table-column>
                <el-table-column prop="zi2p" label="课堂内容" align="center">
                    <template v-slot="scope">
                        <p>{{ scope.row.ClassName }}</p>
                        <el-button
                            size="mini"
                            type="primary"
                            @click="showClassroomContent(scope.row.ID)"
                            >查看</el-button
                        >
                    </template>
                </el-table-column>
                <el-table-column prop="zi3p" label="课后作业" align="center">
                    <template v-slot="scope">
                        <template v-if="scope.row.HaveAfterCourseWare">
                            <div v-if="!scope.row.AfterAssigned">
                                <p>未布置</p>
                                <el-button
                                    size="mini"
                                    type="primary"
                                    @click="showWork(scope.row.ID, 3)"
                                    >布置</el-button
                                >
                            </div>
                            <div v-else>
                                <p>
                                    已完成{{
                                        scope.row.TotalAfterComplate
                                    }}/总人数{{ scope.row.TotalAfterStudent }}
                                </p>
                                <el-button size="mini" type="primary"
                                    >查看完成情况</el-button
                                >
                            </div>
                        </template>
                        <template v-else>
                            <p>无课后作业</p>
                        </template>
                    </template>
                </el-table-column>
            </el-table>
            <div class="page">
                <el-pagination
                    :current-page="page.pageNumber"
                    :page-sizes="page.pageChoose"
                    :page-size="page.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="page.total"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                />
            </div>
        </el-card>
        <ClassroomContentDialog
            v-model:visible="classroomDialog"
            v-if="classroomDialog"
            :courseId="courseId"
        />
        <WorkDialog
            :process="process"
            v-model:dialogVisible="workDialog"
            :courseId="courseId"
            v-if="workDialog"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent, provide, ref } from "vue";
import { formatClass, formatDate, formatTime } from "@/utils";
import useClassesList from "./hooks/useClassesList";
import ClassroomContentDialog from "./ClassroomContentDialog.vue";
import WorkDialog from "../WorkDialog.vue";
export default defineComponent({
    name: "historyCourse",
    setup() {
        const classroomDialog = ref(false);
        const workDialog = ref(false);
        const courseId = ref("");
        const process = ref(1); // 布置课前还是课后作业，1：课前，3：课后

        const {
            search,
            subjectList,
            classList,
            onQuery,
            page,
            tableData,
            handleCurrentChange,
            handleSizeChange,
            getTeacherHistoryClasses
        } = useClassesList();

        const showClassroomContent = (id: string) => {
            classroomDialog.value = true;
            courseId.value = id;
        };

        const showWork = (id: string, type: number) => {
            workDialog.value = true;
            courseId.value = id;
            process.value = type;
        };

        provide("getTeacherClasses", getTeacherHistoryClasses);

        return {
            search,
            subjectList,
            classList,
            formatClass,
            page,
            tableData,
            classroomDialog,
            formatTime,
            formatDate,
            handleCurrentChange,
            handleSizeChange,
            courseId,
            showWork,
            showClassroomContent,
            process,
            getTeacherClasses: getTeacherHistoryClasses,
            workDialog,
            onQuery
        };
    },
    components: { ClassroomContentDialog, WorkDialog }
});
</script>

<style lang="scss" scoped>
.history-list {
    width: 100%;
    height: 100%;
    padding: 15px;
    background: #f5f6fa;
    box-sizing: border-box;
    display: flex;
    .history-list-card {
        flex: 1;
        flex-grow: 1;
        overflow-y: auto;
    }
    .table-template {
        text-align: center;
    }
    .page {
        margin: 15px 0;
        :deep(.el-pagination) {
            float: right;
        }
    }
    :deep(.el-card__body) {
        display: flex;
        flex-flow: column;
        height: 100%;
    }
    :deep(.el-table) {
        flex: 1;
        overflow-y: auto;
    }
}
</style>
