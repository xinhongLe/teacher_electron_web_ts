import { ClassTeacher } from "@/types/myStudent";
import { ref, computed } from "vue";
import { fetchClassTeachers } from "../api";

export default () => {
    const selectTeacher = ref<ClassTeacher[]>([]);

    const getClassTeachers = async (classID: string) => {
        const res = await fetchClassTeachers({
            classID
        });
        if (res.resultCode === 200) {
            selectTeacher.value = res.result.list;
        }
    };

    const subjectList = computed(() => {
        const subjectList:Record<string, ClassTeacher[]> = {};
        selectTeacher.value.forEach(item => {
            item.SubjectList.forEach(subject => {
                if (subjectList[subject.ResultValue] && subjectList[subject.ResultValue].indexOf(
                    item
                ) === -1) {
                    subjectList[subject.ResultValue].push(item);
                } else {
                    subjectList[subject.ResultValue] = [];
                    subjectList[subject.ResultValue].push(item);
                }
            });
        });
        return subjectList;
    });

    const delTeacher = (id: string) => {
        const index = selectTeacher.value.findIndex(item => item.ID === id);
        selectTeacher.value.splice(index, 1);
    };

    return {
        subjectList,
        selectTeacher,
        delTeacher,
        getClassTeachers
    };
};
