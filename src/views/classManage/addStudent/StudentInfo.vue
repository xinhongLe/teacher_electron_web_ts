<template>
   <div class="student-info">
        <p>学生信息</p>
        <el-input v-model="name" placeholder="请输入要搜索的学生信息">
            <template #append>
                <el-button type="primary" @click="searchStudent"
                    >搜索</el-button
                >
            </template>
        </el-input>
        <el-table
            :data="tableList"
            :header-cell-style="{ 'text-align': 'center' }"
            :cell-style="{ 'text-align': 'center' }"
            style="width: 100%; margin-top: 16px; height: 300px; overflow-y: auto"
            @selection-change="handleSelectionChange"
        >
            <el-table-column
                type="selection"
                height="200"
                label="选择"
            ></el-table-column>
            <el-table-column prop="Name" label="学生姓名"> </el-table-column>
            <el-table-column prop="Account" label="账号"> </el-table-column>
        </el-table>
    </div>
</template>

<script lang="ts">
import { store } from "@/store";
import { AssignClassStudentData, Student } from "@/types/myStudent";
import { ElMessage } from "element-plus";
import { defineComponent, ref } from "vue";
import { assignClassStudent, fetchStudent } from "../api";
export default defineComponent({
    setup(props, { emit }) {
        const allTableData = ref<Student[]>([]);
        const tableList = ref<Student[]>([]);
        const alreadyStudent = ref<Student[]>([]);
        const selectStudent = ref<Student[]>([]);
        const name = ref("");

        const searchStudent = () => {
            tableList.value = allTableData.value.filter(v => v.Name.indexOf(name.value) > -1);
        };

        const getStudent = async () => {
            const res = await fetchStudent({
                classId: store.state.myStudent.selectClassInfo.ID
            });
            if (res.resultCode === 200) {
                const { result: { AllStudents, InClassStudents } } = res;
                allTableData.value = AllStudents.filter(student => !InClassStudents.find(inStudent => inStudent.ID === student.ID));
                alreadyStudent.value = InClassStudents;
                tableList.value = allTableData.value;
            }
        };

        getStudent();

        const handleSelectionChange = (v: Student[]) => {
            selectStudent.value = v;
        };

        const save = async () => {
            const { userInfo: { id }, myStudent: { selectClassInfo: { ID } } } = store.state;
            const data: AssignClassStudentData = {
                classID: store.state.myStudent.selectClassInfo.ID,
                teacherId: id,
                studentIDs: [...alreadyStudent.value.map(v => v.ID), ...selectStudent.value.map(v => v.ID)]
            };
            const res = await assignClassStudent(data);
            if (res.resultCode === 200) {
                ElMessage.success("添加学生成功");
                emit("successCallback");
            }
        };

        return {
            searchStudent,
            name,
            save,
            handleSelectionChange,
            tableList
        };
    }
});
</script>

<style lang="scss" scoped>
.student-info {
    margin-top: 24px;
    background: #f5f6fa;
    padding: 24px 32px;
    > p {
        font-size: 20px;
        font-weight: 600;
        color: #19203d;
        line-height: 28px;
        margin-bottom: 12px;
    }
}
</style>
