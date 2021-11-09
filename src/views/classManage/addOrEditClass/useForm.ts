import { ActionTypes, MutationTypes, store } from "@/store";
import { AddSingleClassData, ClassTeacher, UpdateClassNameTeachersData } from "@/types/myStudent";
import { ElForm, ElMessage } from "element-plus";
import { reactive, ref, Ref } from "vue";
import { addSingleClass, updateClassNameTeachers } from "../api";

export default (selectTeacher: Ref<ClassTeacher[]>) => {
    const formRef = ref<InstanceType<typeof ElForm>>();
    const formData = reactive({
        schoolId: "",
        gradeId: "",
        name: ""
    });

    const rules = {
        schoolId: [
            { required: true, message: "请选择校区", trigger: "change" }
        ],
        gradeId: [
            { required: true, message: "请选择年级", trigger: "change" }
        ],
        name: [
            {
                required: true,
                message: "请输入班级名称",
                trigger: "blur"
            }
        ]
    };

    const close = () => {
        store.commit(MutationTypes.CLOSE_CLASS_DIALOG);
        formRef.value!.resetFields();
        selectTeacher.value = [];
    };

    const save = () => {
        formRef.value!.validate(async valid => {
            if (valid) {
                const { isEditClassDialog, classDialogInfo } = store.state.myStudent;
                const teacherID = store.state.userInfo.id;
                const teacherIDs = selectTeacher.value.map(v => v.ID);
                let message = "";
                let flag = false;
                let isActiveFirst = false;
                if (isEditClassDialog) {
                    const data:UpdateClassNameTeachersData = {
                        classID: classDialogInfo?.ID || "",
                        className: formData.name,
                        teacherID,
                        teacherIDs
                    };
                    const res = await updateClassNameTeachers(data);
                    if (res.resultCode === 200) {
                        flag = true;
                        message = "修改成功";
                    }
                } else {
                    const data: AddSingleClassData = {
                        schoolID: formData.schoolId,
                        gradeID: formData.gradeId,
                        className: formData.name,
                        teacherID,
                        teacherIDs
                    };
                    const res = await addSingleClass(data);
                    if (res.resultCode === 200) {
                        flag = true;
                        message = "创建班级成功";
                        isActiveFirst = true;
                    }
                }
                if (flag) {
                    ElMessage.success(message);
                    close();
                    store.dispatch(ActionTypes.FETCH_CLASS_LIST, isActiveFirst);
                }
            }
        });
    };

    return {
        formData,
        formRef,
        rules,
        save,
        close
    };
};
