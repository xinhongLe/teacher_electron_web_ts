import { ClassTeacher } from "@/types/myStudent";
import { LessonSubject } from "@/types/login";
import { get, STORAGE_TYPES } from "@/utils/storage";
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

    const {
        Subjects,
        Name: userName,
        ID
    }: { Subjects: LessonSubject[]; Name: string, ID: string } = get(
        STORAGE_TYPES.USER_INFO
    );

    selectTeacher.value.push({
        Name: userName,
        ID,
        Account: "",
        ClassCount: 0,
        StudentCount: 0,
        SubjectList: Subjects.map(({ ID, Name }) => ({
            ResultKey: ID,
            ResultValue: Name
        }))
    });

    const subjectList = computed(() => {
        const subjectList:Record<string, ClassTeacher[]> = {};
        selectTeacher.value.forEach((item) => {
            item.SubjectList.forEach((subject) => {
                if (
                    subjectList[subject.ResultValue]
                ) {
                    const findIndex = subjectList[subject.ResultValue].findIndex(
                        ({ ID }) => item.ID === ID
                    );
                    findIndex === -1 && subjectList[subject.ResultValue].push(item);
                } else {
                    subjectList[subject.ResultValue] = [];
                    subjectList[subject.ResultValue].push(item);
                }
            });
        });
        return subjectList;
    });

    const delTeacher = (id: string) => {
        const index = selectTeacher.value.findIndex((item) => item.ID === id);
        selectTeacher.value.splice(index, 1);
    };

    return {
        subjectList,
        selectTeacher,
        delTeacher,
        getClassTeachers
    };
};
