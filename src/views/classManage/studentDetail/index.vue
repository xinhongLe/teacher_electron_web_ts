<template>
    <el-dialog
        title="学生信息"
        :model-value="visible"
        width="780px"
        :before-close="handleClose"
    >
        <div class="student-detail">
                <StudentForm
                    @showRestPass="showRestPass = true"
                    :form="formData"
                    :isEdit="true"
                >
                    <el-form-item label="年级和班级：">
                        <div class="grade-list">
                            <span
                                v-for="(item, index) in formData.classList"
                                :key="index"
                                >{{ item.Name
                                }}<i
                                    class="el-icon-remove"
                                    @click="delClass(index)"
                                ></i
                            ></span>
                        </div>
                        <p
                            class="add-class"
                            v-if="!showAddClass"
                            @click="showAddClass = true"
                        >
                            <img
                                src="@/assets/my-student/icon_add_class@2x.png"
                            /><span>加入新班级</span>
                        </p>
                        <div class="add-class-box" v-if="showAddClass">
                            <el-select
                                v-model="formData.selectClassId"
                                placeholder="请选择年级"
                            >
                                <el-option
                                    v-for="(item, index) in newClassList"
                                    :key="index"
                                    :label="item.Name"
                                    :value="item.ID"
                                ></el-option>
                            </el-select>
                            <el-button :type="formData.selectClassId ? 'primary' : 'info'" plain @click="addClass"
                                >添加</el-button
                            >
                        </div>
                    </el-form-item>
                </StudentForm>
                <div class="btns">
                    <span @click="handleClose">取消</span>
                    <span @click="save">保存</span>
                </div>
            </div>
            <RestPass
                v-if="showRestPass"
                v-model:visible="showRestPass"
                :info="{
                    name: formData.name,
                    account: formData.account,
                    id: studentId
                }"
            ></RestPass>
    </el-dialog>
</template>

<script lang="ts">
import { ActionTypes, store } from "@/store";
import { FetchStudentInfoData, StudentClass, UpdateStudentInfoData } from "@/types/myStudent";
import { ElMessage, ElMessageBox } from "element-plus";
import moment from "moment";
import { computed, defineComponent, reactive, ref } from "vue";
import { fetchStudentClassesBeforeDistribute, fetchStudentInfo, updateStudentInfo } from "../api";
import StudentForm from "../studentForm/index.vue";
import RestPass from "./RestPass.vue";
export default defineComponent({
    name: "StudentDetail",
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        studentId: {
            type: String,
            default: ""
        }
    },
    setup(props, { emit }) {
        const showAddClass = ref(false);
        const showRestPass = ref(false);
        const classList = ref<StudentClass[]>([]);
        const prevClassList = ref<string[]>([]);
        const formData = reactive({
            name: "",
            phone: "",
            account: "",
            password: "******",
            sex: 1,
            birthday: "",
            num: 10,
            selectClassId: "",
            classList: [{
                Name: "",
                ID: ""
            }]
        });
        const handleClose = () => {
            emit("update:visible", false);
        };
        const getStudentInfo = async () => {
            const data: FetchStudentInfoData = {
                id: props.studentId,
                teacherId: store.state.userInfo.id
            };
            const res = await fetchStudentInfo(data);
            if (res.resultCode === 200) {
                const { Name, Phone, Account, Sexual, Birthday, ErrorQuestionPushCount, ClassIDs } = res.result;
                Object.assign(formData, {
                    name: Name,
                    phone: Phone,
                    account: Account,
                    sex: Sexual,
                    birthday: moment(Birthday).format("YYYY-MM-DD"),
                    num: ErrorQuestionPushCount
                });
                prevClassList.value = ClassIDs;
            }
        };
        const getStudentClassesBeforeDistribute = async () => {
            const res = await fetchStudentClassesBeforeDistribute({
                studentID: props.studentId
            });
            if (res.resultCode === 200) {
                const { InClasss, AllClasss } = res.result;
                formData.classList = InClasss;
                classList.value = AllClasss;
            }
        };
        const delClass = (index: number) => {
            ElMessageBox.confirm("确认移除吗, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    formData.classList.splice(index, 1);
                })
                .catch(() => {
                    ElMessage({
                        type: "info",
                        message: "已取消操作"
                    });
                });
        };
        const addClass = () => {
            const name = classList.value.find(item => item.ID === formData.selectClassId)?.Name || "";
            formData.classList.push({
                ID: formData.selectClassId,
                Name: name
            });
            formData.selectClassId = "";
        };
        const save = async () => {
            const { name, birthday, sex, classList, num } = formData;
            const data: UpdateStudentInfoData = {
                id: props.studentId,
                studentName: name,
                birthday,
                sex,
                classIds: classList.map(v => v.ID),
                errorQuestionPushCount: num,
                teacherId: store.state.userInfo.id
            };
            const res = await updateStudentInfo(data);
            if (res.resultCode === 200) {
                ElMessage.success("学生信息修改成功");
                handleClose();
                let flag = true;
                if (formData.classList.length !== prevClassList.value.length) {
                    flag = false;
                } else {
                    formData.classList.forEach((item) => {
                        if (prevClassList.value.indexOf(item.ID) === -1) {
                            flag = false;
                        }
                    });
                }
                if (flag) {
                    setTimeout(async () => {
                        store.dispatch(ActionTypes.FETCH_STUDENT_LIST);
                    }, 300);
                } else {
                    setTimeout(async () => {
                        await store.dispatch(ActionTypes.FETCH_CLASS_LIST);
                        store.dispatch(ActionTypes.FETCH_STUDENT_LIST);
                    }, 300);
                }
            }
        };
        getStudentInfo();
        getStudentClassesBeforeDistribute();
        return {
            handleClose,
            formData,
            delClass,
            addClass,
            save,
            showAddClass,
            newClassList: computed(() => classList.value.filter(item => !formData.classList.find(v => item.ID === v.ID))),
            showRestPass
        };
    },
    components: { StudentForm, RestPass }
});
</script>

<style lang="scss" scoped>

:deep(.el-form-item__label) {
    padding-right: 30px;
}
:deep(.el-input-number) {
    float: left;
    width: 150px;
    margin-left: 30px;
}
:deep(.el-date-editor) {
    width: 100%;
}
.student-detail {
    padding: 0 110px 0 50px;
    .grade-list {
        overflow: hidden;
        > span {
            margin-top: 2px;
            padding: 8px 16px;
            background: #f3f7ff;
            border-radius: 4px;
            line-height: 20px;
            font-size: 14px;
            color: #19203d;
            position: relative;
            display: block;
            float: left;
            margin-right: 16px;
            margin-bottom: 15px;
            span {
                color: #5f626f;
            }
            i {
                font-size: 14px;
                position: absolute;
                right: -7px;
                top: -2px;
                color: #ff6b6b;
                z-index: 1;
            }
        }
    }
    .add-class {
        overflow: hidden;
        cursor: pointer;
        margin-top: 10px;
        span {
            font-size: 14px;
            color: #4b71ee;
            line-height: 20px;
            display: block;
            float: left;
        }
        img {
            width: 16px;
            height: 16px;
            margin-top: 2px;
            display: block;
            float: left;
            margin-right: 3px;
        }
    }
    .btns {
        border-top: 1px solid #f5f6fa;
        display: flex;
        justify-content: center;
        margin-bottom: -32px;
        span {
            width: 200px;
            height: 40px;
            background: #ffffff;
            border-radius: 4px;
            cursor: pointer;
            border: 1px solid #e0e2e7;
            font-size: 16px;
            color: #19203d;
            line-height: 40px;
            text-align: center;
            margin: 16px 0;
        }
        span:nth-of-type(2) {
            background: #4b71ee;
            color: #fff;
            margin-left: 24px;
        }
    }
    .add-class-box {
        display: flex;
        :deep(.el-select) {
            margin-right: 10px;
        }
    }
}
</style>
