<template>
    <div class="container">
        <el-dialog
            v-model="show"
            :before-close="close"
            width="820px"
            :title="isEdit ? '班级详情' : '创建班级'"
        >
            <div class="form-box">
                <el-form
                    :rules="rules"
                    ref="formRef"
                    :model="formData"
                    label-width="80px"
                    label-position="top"
                >
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="校区" prop="schoolId">
                                <el-select
                                    style="width: 100%"
                                    v-model="formData.schoolId"
                                    placeholder="请选择校区"
                                    :disabled="isEdit"
                                >
                                    <el-option
                                        v-for="(item, index) in campusList"
                                        :key="index"
                                        :label="item.Name"
                                        :value="item.ID"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="年级" prop="gradeId">
                                <el-select
                                    :disabled="isEdit"
                                    style="width: 100%"
                                    v-model="formData.gradeId"
                                    placeholder="请选择年级"
                                >
                                    <el-option
                                        v-for="(item, index) in gradeList"
                                        :key="index"
                                        :label="item.ResultValue"
                                        :value="item.ResultKey"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="班级名称" prop="name">
                                <el-input
                                    v-model="formData.name"
                                    placeholder="请输入班级名称"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item label="班级老师" style="position: relative">
                        <div
                            class="no-data"
                            v-if="Object.keys(subjectList).length == 0"
                        >
                            <img
                                src="@/assets/my-student/pic_wuxuesheng@2x.png"
                            />
                            <p>还没有班级老师</p>
                            <p>您可以点击【添加老师】进行设置</p>
                        </div>
                        <div class="btn" @click="showTeacher = true">
                            <i class="el-icon-plus"></i>添加老师
                        </div>
                        <div class="subject-list">
                            <div
                                v-for="(item, index) in Object.keys(
                                    subjectList
                                )"
                                :key="index"
                            >
                                <span>{{ item }}</span>
                                <div v-if="subjectList[item]">
                                    <span

                                        v-for="(item1) in (subjectList[item] || [])"
                                        :key="item1?.ID"
                                    >
                                        <i class="el-icon-s-custom"></i>
                                        {{ item1?.Name}}
                                        <i
                                            class="el-icon-remove"
                                            v-if="
                                                isEdit || ownerId !== item1?.ID
                                            "
                                            @click="delTeacher(item1?.ID)"
                                        ></i>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </el-form-item>
                </el-form>
                <div class="btns">
                    <span @click="close">取消</span>
                    <span
                        :class="{
                            active:
                                formData.schoolId &&
                                formData.gradeId &&
                                formData.name,
                        }"
                        @click="save"
                        >保存</span
                    >
                    <!-- <span v-if="classType == 'edit'" @click="delClass">解散班级</span> -->
                </div>
            </div>
            <AddTeacher
                v-model:visible="showTeacher"
                v-model:selectedTeacher="selectTeacher"
                v-if="showTeacher"
            />
        </el-dialog>
    </div>
</template>

<script lang="ts">
import { store } from "@/store";
import { computed, defineComponent, ref } from "vue";
import useGradeList from "./useGradeList";
import useForm from "./useForm";
import useTeachers from "./useTeachers";
import AddTeacher from "../addTeacher/index.vue";
export default defineComponent({
    name: "AddOrEditClass",
    setup() {
        const { subjectList, selectTeacher, getClassTeachers, delTeacher } =
            useTeachers();
        const { rules, formData, formRef, close, save } =
            useForm(selectTeacher);
        const { gradeList, getGradeList } = useGradeList();
        const showTeacher = ref(false);
        const show = computed(() => store.state.myStudent.isShowClassDialog);

        getGradeList().then(() => {
            const { isEditClassDialog: isEdit, classDialogInfo: classInfo } =
                store.state.myStudent;
            if (isEdit) {
                formData.name = classInfo!.Name;
                formData.schoolId = classInfo!.SchoolId;
                formData.gradeId = gradeList.value.find(
                    (item) => item.ResultValue === classInfo!.GradeAlbum
                )!.ResultValue;
                getClassTeachers(classInfo!.ID);
            }
        });
        return {
            show,
            close,
            campusList: computed(() => store.state.userInfo.Schools),
            isEdit: computed(() => store.state.myStudent.isEditClassDialog),
            ownerId: computed(() => store.state.userInfo.id),
            gradeList,
            formData,
            formRef,
            rules,
            showTeacher,
            subjectList,
            delTeacher,
            save,
            selectTeacher
        };
    },
    components: { AddTeacher }
});
</script>

<style lang="scss" scoped>
.container {
    :deep(.el-dialog__body) {
        padding: 0;
    }
}

.form-box {
    background: #f5f6fa;
    padding: 24px 32px;
    .no-data {
        padding: 8vh 0 10vh 0;
        img {
            width: 136px;
            height: 85px;
            margin: auto;
            display: block;
        }
        p:nth-of-type(1) {
            margin-top: 24px;
            font-size: 18px;
            font-weight: 600;
            color: #19203d;
            line-height: 25px;
            text-align: center;
        }
        p:nth-of-type(2) {
            margin-top: 6px;
            font-size: 16px;
            text-align: center;
            color: #5f626f;
            line-height: 22px;
        }
    }
    .btn {
        width: 112px;
        height: 32px;
        background: #4b71ee;
        border-radius: 4px;
        text-align: center;
        color: #fff;
        line-height: 32px;
        position: absolute;
        right: 0;
        top: -51px;
        cursor: pointer;
    }
    .btns {
        display: flex;
        justify-content: center;
        position: relative;
        > span {
            width: 200px;
            margin-top: 16px;
            height: 40px;
            background: #ffffff;
            border-radius: 4px;
            border: 1px solid #e0e2e7;
            text-align: center;
            font-size: 16px;
            color: #19203d;
            line-height: 40px;
            cursor: pointer;
        }
        > span:nth-of-type(1) {
            margin-right: 24px;
        }
        > span:nth-of-type(2) {
            color: #fff;
            background: #d4d6d9;
        }
        > span:nth-of-type(3) {
            position: absolute;
            width: 120px;
            color: #ff6b6b;
            left: 24px;
            top: 0;
            border-color: #fef2f6;
            background: #fef2f6;
        }
        .active {
            background: #4b71ee !important;
        }
    }
    .subject-list {
        > div {
            padding: 12px 20px;
            background: #fff;
            display: flex;
            margin-bottom: 4px;
            > div {
                flex: 1;
                margin-bottom: -16px;
                span {
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
                    i {
                        color: #4b71ee;
                        margin-right: 4px;
                    }
                    i:nth-of-type(2) {
                        font-size: 14px;
                        position: absolute;
                        right: -7px;
                        top: -2px;
                        color: #ff6b6b;
                    }
                }
            }
            > span {
                font-size: 18px;
                color: #19203d;
                height: 36px;
                margin-right: 34px;
                display: flex;
                align-items: center;
            }
        }
    }
}
</style>
