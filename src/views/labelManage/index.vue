<template>
    <div class="my-student">
        <Head v-model:canEdit="canEdit" :closeCheckBox="closeCheckBox" v-model:selectSubjectId="selectSubjectId" @searchStudent="searchStudent"/>
        <div class="list-box">
            <template v-if="studentList.length > 0">
                <div class="student-list" v-if="selectSubjectId != ''">
                    <div>
                        <StudentList
                            v-for="(item, index) in studentList"
                            :key="index"
                            :item="item"
                            :canEdit="canEdit"
                            v-model:selectStudent="selectStudent"
                        ></StudentList>
                    </div>
                </div>
                <div class="student-all-list" v-else>
                    <AllStudentList :studentList="allSubjectStudentList"></AllStudentList>
                </div>
            </template>
            <template v-else>
                <div class="no-data">
                    <div>
                        <img src="@/assets/my-student/pic_noclass@2x.png" />
                    </div>
                </div>
            </template>
        </div>
        <div v-if="canEdit" class="footer-btn">
            <span>已选：{{ selectStudent.length }}</span>
            <el-button
                style="float: right; margin-top: 16px"
                type="primary"
                @click="dialogVisible = true"
                v-if="selectStudent.length > 0"
                >打标签</el-button
            >
            <el-button
                style="float: right; margin-top: 16px"
                type="info"
                plain
                disabled
                v-else
                >打标签</el-button
            >
        </div>
        <AddOrEditLabel
            v-if="dialogVisible"
            v-model:visible="dialogVisible"
            :selectStudent="selectStudent"
            :selectSubjectId="selectSubjectId"
            @saveSuccess="saveSuccess"
        />
    </div>
</template>

<script lang="ts">
import useTagList from "@/hooks/useTagList";
import { ElMessageBox } from "element-plus";
import { defineComponent, ref } from "vue";
import Head from "./head/index.vue";
import useStudents from "./useStudents";
import StudentList from "./studentList/index.vue";
import AddOrEditLabel from "./addOrEditLabel/index.vue";
import AllStudentList from "./allStudentList/index.vue";
export default defineComponent({
    name: "LabelManage",
    setup() {
        const canEdit = ref(false);
        const dialogVisible = ref(false);
        const selectStudent = ref([]);
        const selectSubjectId = ref("");

        const { tagList, getTagList } = useTagList();

        const { studentList, getAllStudents, searchStudent, allSubjectStudentList } = useStudents(tagList, selectSubjectId);

        getTagList().then(() => {
            tagList.value.push({ TagName: "未标记", ID: "", Level: 0 });
            getAllStudents();
        });

        const refresh = () => {
            canEdit.value = false;
            selectStudent.value = [];
        };

        const saveSuccess = () => {
            refresh();
            getAllStudents();
        };

        const closeCheckBox = () => {
            const content = selectStudent.value.length > 0 ? "现在离开将丢失之前的操作数据，确定离开？" : "确定要离开吗？";
            ElMessageBox.confirm(content, "正在编辑标签", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(refresh);
        };

        return {
            canEdit,
            selectSubjectId,
            studentList,
            selectStudent,
            tagList,
            dialogVisible,
            saveSuccess,
            searchStudent,
            allSubjectStudentList,
            closeCheckBox
        };
    },
    components: { Head, StudentList, AddOrEditLabel, AllStudentList }
});
</script>

<style lang="scss" scoped>
.my-student {
    display: flex;
    height: 100%;
    flex-direction: column;
    .search-box {
        height: 72px;
        display: flex;
        justify-content: space-between;
        > div {
            float: left;
            flex: 1;
            margin-left: 24px;
            margin-top: 16px;
        }
        :deep(.el-input-group__append){
            background: none;
            font-size: 14px;
            font-weight: 500;
            color: #4b71ee;
            line-height: 38px;
        }
        .btn {
            float: right;
            margin: 16px 24px;
        }
    }
    .list-box {
        flex: 1;
        width: 100%;
        overflow-y: auto;
        display: flex;
        .list {
            > div {
                width: 320px;
                box-sizing: border-box;
                font-size: 16px;
                font-weight: 600;
                line-height: 48px;
                div {
                    padding-left: 24px;
                    color: #5f626f;
                    cursor: pointer;
                }
            }
            .type1 {
                font-size: 14px;
                font-weight: 400;
            }
            .active {
                border-right: 4px solid #4b71ee;
                background: #e6ecff;
                color: #4b71ee !important;
                height: 48px;
            }
        }
        .student-list {
            flex: 1;
            height: 100%;
            background: #f5f6fa;
            display: flex;
            flex-direction: column;
            .student-box:last-of-type {
                margin-bottom: 0;
            }
            > div:nth-of-type(1) {
                flex: 1;
                overflow-y: auto;
                padding: 24px;
            }
        }
        .student-all-list,
        .no-data {
            flex: 1;
            border-top: 8px solid #F5F6FA;
            background: #f5f6fa;
            overflow-y: auto;
        }
        .no-data div {
            background: #fff;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }
    .footer-btn {
        height: 72px;
        padding-right: 24px;
        background: #ffffff;
        border-left: 1px solid #f5f6fa;
        span {
            margin-left: 24px;
            font-size: 14px;
            color: #5f626f;
            line-height: 72px;
        }
    }
}
</style>
