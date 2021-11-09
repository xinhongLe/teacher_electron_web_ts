import { store } from "@/store";
import { AddStudentData } from "@/types/myStudent";
import { ElMessage } from "element-plus";
import { reactive } from "vue";
import { addStudent } from "../api";

export default () => {
    const formData = reactive({
        name: "",
        phone: "",
        account: "",
        password: "",
        sex: "1",
        birthday: "",
        num: 10,
        className: "",
        classId: "",
        schoolId: ""
    });

    const { selectClassInfo } = store.state.myStudent;
    const { Name, SchoolId, ID, GradeAlbum } = selectClassInfo;
    formData.className = GradeAlbum + Name;
    formData.schoolId = SchoolId;
    formData.classId = ID;

    const saveForm = async (callback: () => void) => {
        const data: AddStudentData = {
            studentName: formData.name,
            parentMobile: formData.phone,
            birthday: formData.birthday,
            sex: formData.sex,
            account: formData.account,
            password: formData.password,
            classIds: [formData.classId],
            schoolId: formData.schoolId,
            errorQuestionPushCount: formData.num,
            teacherId: store.state.userInfo.id
        };
        const res = await addStudent(data);
        if (res.resultCode === 200) {
            ElMessage.success("添加学生成功");
            callback();
        }
    };

    return {
        saveForm,
        formData
    };
};
