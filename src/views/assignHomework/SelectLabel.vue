<template>
    <div class="select-label">
        <span style="white-space: nowrap">选择学生：</span>
        <div class="select" @click.stop="clickSelect">
            <div class="select-content">
                <span v-for="item in selectLabel" :key="item" class="label">
                    {{ item }}
                </span>
            </div>
            <div class="select-list" v-show="isSelect">
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
            </div>
        </div>
        <el-button
            v-if="allStudentCount > 0"
            type="text"
            @click="dialogVisible = true"
        >
            <i class="el-icon-edit-outline" style="margin-left: 10px; margin-right: 30px;"></i>
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
import {
    computed,
    defineComponent,
    onMounted,
    onUnmounted,
    PropType,
    ref,
    watch,
    watchEffect,
} from "vue";
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
            default: () => [],
        },
    },
    setup(props) {
        const selectLabel = ref<string[]>([]);
        const isSelect = ref(false);
        console.log(props.studentList);

        const students = computed(() => props.studentList);
        const allStudentCount = computed(() => props.studentList.length);
        const levelList = computed<Level[]>(() => {
            const labelList = getLabel(props.studentList);
            const levelList = [];
            for (const i in labelList) {
                const levelStudents = students.value.filter(
                    (item) => item.TagName === i
                );
                levelList.push({
                    label: i,
                    checked: levelStudents.every(({ checked }) => checked),
                    students: levelStudents,
                });
            }
            return levelList;
        });
        console.log("levelList.value", levelList.value);

        const checkAll = ref(false);
        const dialogVisible = ref(false);
        watch(
            () => props.studentList,
            (val) => {
                console.log("studentList---", val);
            },
            { deep: true }
        );
        watchEffect(() => {
            selectLabel.value = levelList.value
                .filter(
                    (item) => item.students.filter((v) => v.checked).length > 0
                )
                .map((item) => {
                    const { label, students } = item;
                    return `${label.replace("Level ", "")}(${getCheckCount(
                        students
                    )})`;
                })
                .sort();
        });

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
            return (
                getSelectCount() > 0 && getSelectCount() < allStudentCount.value
            );
        }

        function getStatusStyle(students: Student[]) {
            return (
                students.filter((v) => v.checked).length > 0 &&
                students.filter((v) => v.checked).length < students.length
            );
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

        function updateLevelList(list: Level[]) {
            list.forEach((level, index) => {
                level.students.forEach((student, j) => {
                    levelList.value[index].students[j].checked =
                        student.checked;
                });
            });
        }

        const clickSelect = () => {
            isSelect.value = true;
        };

        const hideSelect = () => {
            isSelect.value = false;
        };

        onMounted(() => {
            document.addEventListener("click", hideSelect);
        });

        onUnmounted(() => {
            document.removeEventListener("click", hideSelect);
        });

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
            selectLabel,
            isSelect,
            clickSelect,
            students,
        };
    },
    components: { SelectStudent },
});
</script>

<style lang="scss" scoped>
.select-label {
    display: flex;
    align-items: center;
    .select {
        position: relative;
        border: 1px solid #eceff6;
        left: 0;
        height: 30px;
        line-height: 30px;
        width: 200px;
        padding: 0 16px;
        border: 0.1rem solid #eceff6;
        cursor: pointer;
        display: flex;
        .select-content {
            overflow-x: overlay;
            overflow-y: hidden;
            display: flex;
            height: 100%;
        }
        .label {
            margin-left: 5px;
            flex-shrink: 0;
        }
        .select-list {
            width: 100%;
            padding-left: 20px;
            background: #ffffff;
            position: absolute;
            display: flex;
            flex-direction: column;
            border: 1px solid #e4e7ed;
            box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 12px 0px;
            top: 100%;
            left: 0;
            z-index: 1;
        }
    }
}
</style>
