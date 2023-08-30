<template>
    <el-dialog
        class="custom-dialog"
        v-model="dialogVisible"
        align-center
        center
        title="点名设置"
        width="702px"
        :destroy-on-close="true"
    >
        <el-form class="custom-form" :model="form" label-width="100px">
            <!-- <el-form-item label="选择班级：">
                <el-radio-group v-model="form.classId">
                    <el-radio v-for="(item, index) in classList" :key="index" :label="item.ClassUserCenterId" size="large" @change="classChange">{{ item.ClassName }}</el-radio>
                </el-radio-group>
            </el-form-item> -->
            <el-form-item label="学生范围：">
                <el-radio-group v-model="form.studentRange" @change="rangeChange">
                    <el-radio :label="0" size="large">全班学生</el-radio>
                    <el-radio :label="1" size="large">指定学生</el-radio>
                </el-radio-group>
                <span class="change" v-if="form.studentRange == 1" @click="getClassStudent(), studentListRef.studentDialogVisible = true">去选择<img src="@/assets/images/suspension/combinedshape@2x.png"></span>
            </el-form-item>
            <el-form-item label="重复点名：">
                <el-radio-group v-model="form.isRepeat">
                    <el-radio :label="0" size="large">可重复</el-radio>
                    <el-radio :label="1" size="large">不可重复</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisible = false"
                >取消</el-button
                >
                <el-button
                    type="primary"
                    @click="save"
                >
                    保存
                </el-button>
            </span>
        </template>
    </el-dialog>
    <SettingStudent ref="studentListRef" @updateStoreStudentList="updateStoreStudentList"></SettingStudent>
</template>

<script setup lang="ts">
import { reactive, ref, nextTick } from 'vue';
import { get, STORAGE_TYPES, set } from '@/utils/storage';
import {store} from "@/store";
import SettingStudent from "./settingStudent.vue"

const dialogVisible = ref(false)
const classList = ref(store.state.userInfo.classList.length ? store.state.userInfo.classList : get(STORAGE_TYPES.CLASS_LIST));
const allStudents = get(STORAGE_TYPES.STUDENT_LIST) || [];
const form = reactive({
    classId: get(STORAGE_TYPES.CURRENT_SELECT_CLASS)?.ClassUserCenterId,
    studentRange: 0,
    isRepeat: 0,
    storeStudentList: allStudents.filter((v: any) => get(STORAGE_TYPES.CURRENT_SELECT_CLASS)?.ClassUserCenterId === v.ClassID),
    allStudentList: allStudents.filter((v: any) => get(STORAGE_TYPES.CURRENT_SELECT_CLASS)?.ClassUserCenterId === v.ClassID)
})
const studentListRef = ref();
const getClassStudent = () => {
    nextTick(() => {
        studentListRef.value.studentName = "";
        studentListRef.value.allStudents = allStudents.filter((v: any) => form.classId == v.ClassID),
        studentListRef.value.checkedStudents = form.storeStudentList
    })
}
getClassStudent()
const classChange = () => {
    form.studentRange = 0;
    form.storeStudentList = allStudents.filter((v: any) => form.classId === v.ClassID)
    form.allStudentList = allStudents.filter((v: any) => form.classId == v.ClassID)
    getClassStudent();
}
const rangeChange = (val: any) => {
    form.allStudentList = allStudents.filter((v: any) => form.classId == v.ClassID)
    studentListRef.value.checkedStudents = []
    if(val == 0) {
        form.storeStudentList = allStudents.filter((v: any) => form.classId === v.ClassID)
    }else{
        form.storeStudentList = []
    }
}
const emits = defineEmits(["updateForm"])
const save = () => {
    const classData = classList.value.find((v: any) => v.ClassUserCenterId == form.classId)
    window.electron.ipcRenderer.send('updateSelectClass', JSON.stringify(classData));
    emits("updateForm", form)
    dialogVisible.value = false;
}
const updateStoreStudentList = (value: any) => {
    form.storeStudentList = [...value];
}
defineExpose({
    form,
    dialogVisible
})
</script>


<style lang="scss" scoped>
.change {
    color: var(--el-color-primary);
    margin-left: 32px;
    cursor: pointer;
    img {
        width: 6px;
        height: 10px;
        margin-left: 4px;
    }
}
.transfer-box {
    display: flex;
    align-items: center;
    >div {
        flex: 1;
        height: 408px;
        border-radius: 4px;
        border: 1px solid #E0E2E7;
        display: flex;
        flex-direction: column;
            overflow: auto;
        >div:nth-of-type(1) {
            height: 48px;
            background: #F5F6FA;
            padding: 0 16px;
            display: flex;
            align-items: center;
            box-sizing: border-box;
            justify-content: space-between;
            border-radius: 4px 4px 0px 0px;
            >span {
                font-size: 14px;
                color: #90949E;
            }
        }
        .student-list {
            flex: 1;
            overflow: auto;
            padding: 0 16px;
            ::v-deep(.el-checkbox) {
                display: flex;
                margin-right: 0;
            }
            .student {
                display: flex;
                align-items: center;
                img {
                    width: 36px;
                    height: 36px;
                    margin-right: 12px;
                }
                p {
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
                img:nth-of-type(2) {
                    width: 14px;
                    height: 14px;
                    margin-right: 0;
                    margin-left: 16px;
                    cursor: pointer;
                }
            }
        }
    }
    >img {
        width: 36px;
        height: 31px;
        margin: 0 15px;
    }
}
</style>
