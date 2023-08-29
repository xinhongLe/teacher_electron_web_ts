<template>
    <el-dialog
        class="custom-dialog"
        v-model="studentDialogVisible"
        align-center
        center
        title="选择学生"
        width="610px"
        :destroy-on-close="true"
    >
        <div class="transfer-box">
            <div>
                <div>
                    <el-checkbox
                        v-model="checkAll"
                        :indeterminate="checkedStudents.length > 0 && checkedStudents.length < allStudents.length"
                        @change="handleCheckAllChange"
                        >未选列表</el-checkbox
                    >
                    <span>{{ checkedStudents.length }}/{{ allStudents.length }}</span>
                </div>
                <div style="margin: 15px;">
                    <el-input
                        placeholder="关键字搜索"
                        :prefix-icon="Search"
                        v-model="studentName"
                    />
                </div>
                <div class="student-list"> 
                    <el-checkbox-group
                        v-model="checkedStudents"
                    >
                        <el-checkbox v-for="(item, index) in allStudents.filter(v => v.Name.indexOf(studentName) > -1)" :key="index" :label="item">
                            <div class="student">
                                <img src="@/assets/images/suspension/touxiang_student.png">
                                <p style="max-width: 160px;" :title="item.Name">{{ item.Name }}</p>
                            </div>
                        </el-checkbox>
                    </el-checkbox-group>
                </div>
            </div>
            <img src="@/assets/images/suspension/icon_arrow@2x.png">
            <div>
                <div>
                    <span style="color: #19203D">已选列表</span>
                    <span style="color: var(--app-color-red);cursor: pointer;" @click="checkedStudents = []">清空</span>
                </div>
                <div class="student-list" style="margin-top: 8px;">
                    <div class="student" v-for="(item, index) in checkedStudents" :key="index">
                        <img src="@/assets/images/suspension/touxiang_student.png">
                        <p style="flex: 1" :title="item.Name">{{ item.Name }}</p>
                        <img src="@/assets/images/suspension/icon_delete_red.png" @click="checkedStudents.splice(index, 1)">
                    </div>
                </div>
            </div>
        </div>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="close"
                >取消</el-button
                >
                <el-button
                    type="primary"
                    @click="saveStudent"
                >
                    保存
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue';
import { Search } from '@element-plus/icons-vue'

const studentDialogVisible = ref(false)
const allStudents = ref([])
const checkedStudents = ref([]);
const checkAll = computed(() => checkedStudents.value.length > 0 && checkedStudents.value.length == allStudents.value.length)
const studentName = ref("");
const handleCheckAllChange = (val: any) => {
    if (val) {
        checkedStudents.value = allStudents.value.map(v => v);
    }else{
        checkedStudents.value = []
    }
}
const emits = defineEmits(["updateStoreStudentList"])
const saveStudent = () => {
    emits("updateStoreStudentList", [...checkedStudents.value])
    close()
}
const close = () => {
    studentDialogVisible.value = false;
    allStudents.value = []
    checkedStudents.value = []
    studentName.value = ""
}
defineExpose({
    studentDialogVisible,
    allStudents,
    checkedStudents,
    studentName
});
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
