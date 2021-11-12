import { ref, watch } from "vue";
import { ClassStudent } from "@/types/myStudent";
import { ActionTypes, store } from "@/store";
export default () => {
    const studentList = ref<ClassStudent[]>([]);

    watch(() => store.state.myStudent.allStudentList, (allStudentList) => {
        studentList.value = allStudentList;
    });

    watch(() => store.state.myStudent.selectClassInfo.ID, (classId) => {
        store.dispatch(ActionTypes.FETCH_STUDENT_LIST, classId);
    });

    watch(() => store.state.myStudent.searchStudent, (name) => {
        const allStudentList = store.state.myStudent.allStudentList;
        studentList.value = allStudentList.filter(v => (v.Name.indexOf(name) > -1 || (v.Phone && v.Phone.indexOf(name) > -1) || v.Account.indexOf(name) > -1));
    });

    return {
        studentList
    };
};
