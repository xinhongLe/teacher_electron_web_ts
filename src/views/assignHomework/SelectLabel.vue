<template>
    <div class="select-label">
        <el-checkbox
            :indeterminate="getBigStatusStyle()"
            v-model="checkAll"
            @change="handleCheckAllChange"
            >全选({{ getSelectCount() }} / {{ allStudentCount }})</el-checkbox
        >
        <el-checkbox
            v-for="(item, index) in levelList"
            :label="item.label"
            :key="index"
            v-model="item.checked"
            @change="(flag) => changeSelect(flag, index)"
            :indeterminate="getStatusStyle(item.students)"
            >{{ item.label }}({{ getCheckCount(item.students) }} /
            {{ item.students.length }})</el-checkbox
        >
        <el-button
            v-if="allStudentCount > 0"
            type="text"
            @click="dialogVisible = true"
        >
            <i class="el-icon-edit-outline" style="margin-left: 30px"></i>
        </el-button>

        <SelectStudent
            :levelList="levelList"
            :allStudentCount="allStudentCount"
            v-model:visible="dialogVisible"
            v-if="dialogVisible"
            @updateLevelList="updateLevelList"
        ></SelectStudent>
    </div>
</template>

<script lang="ts">
import { Level, Student } from "@/types/assignHomework";
import { computed, defineComponent, PropType, ref } from "vue";
import SelectStudent from "./SelectStudent.vue";

function getLabel(val: Student[]) {
    const obj: Record<string, number> = {};
    for (let i = 0; i < val.length; i++) {
        var item = val[i].TagName || "未标记";
        obj[item] = obj[item] + 1 || 1;
    }
    return obj;
}

export default defineComponent({
    props: {
        studentList: {
            type: Array as PropType<Student[]>,
            default: () => []
        }
    },
    setup(props) {
        const students = computed(() => props.studentList);
        const allStudentCount = computed(() => props.studentList.length);
        const levelList = computed<Level[]>(() => {
            const labelList = getLabel(props.studentList);
            const levelList = [];
            for (const i in labelList) {
                const levelStudents = students.value.filter((item) => item.TagName === i);
                levelList.push({
                    label: i,
                    checked: levelStudents.every(({ checked }) => checked),
                    students: levelStudents
                });
            }
            return levelList;
        });

        const checkAll = ref(false);
        const dialogVisible = ref(false);

        function getSelectCount() {
            let count = 0;
            levelList.value.map((v) => {
                v.students.map((val) => {
                    if (val.checked) {
                        count++;
                    }
                });
            });
            count === allStudentCount.value
                ? (checkAll.value = true)
                : (checkAll.value = false);
            return count;
        }

        function getBigStatusStyle() {
            return (getSelectCount() > 0 && getSelectCount() < allStudentCount.value);
        }

        function getStatusStyle(students: Student[]) {
            return (students.filter((v) => v.checked).length > 0 &&
                students.filter((v) => v.checked).length < students.length);
        }

        function getCheckCount(students: Student[]) {
            return students.filter((v) => v.checked).length;
        }

        function handleCheckAllChange(flag: boolean) {
            checkAll.value = flag;
            levelList.value.map((v) => {
                v.checked = flag;
                v.students.map((v) => (v.checked = flag));
            });
        }

        function changeSelect(flag: boolean, index: number) {
            levelList.value[index].students.map((v) => (v.checked = flag));
        }

        function updateLevelList (list: Level[]) {
            list.forEach((level, index) => {
                level.students.forEach((student, j) => {
                    levelList.value[index].students[j].checked = student.checked;
                });
            });
        }

        return {
            checkAll,
            levelList,
            allStudentCount,
            getBigStatusStyle,
            getStatusStyle,
            getSelectCount,
            handleCheckAllChange,
            getCheckCount,
            dialogVisible,
            updateLevelList,
            changeSelect,
            students
        };
    },
    components: { SelectStudent }
});
</script>

<style lang="scss" scoped>
.select-label {
    display: flex;
    align-items: center;
}
</style>
