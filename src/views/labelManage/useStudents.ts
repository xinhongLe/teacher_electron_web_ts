import router from "@/router";
import { TagStudent, StudentTag, Tag } from "@/types/labelManage";
import { LessonSubject } from "@/types/login";
import { get, STORAGE_TYPES } from "@/utils/storage";
import { computed, ref, Ref } from "vue";
import { fetchStudentsTagList } from "./api";

const getSubjectName = (SelectSubjectId: string) => {
    const subjectList: LessonSubject[] = get(STORAGE_TYPES.USER_INFO).Subjects;
    return subjectList.filter((v) => v.ID === SelectSubjectId)[0]
        .Name;
};

export default (tagList: Ref<Tag[]>, selectSubjectId: Ref<string>) => {
    const studentList = ref<StudentTag[]>([]);
    const allStudentList = ref<TagStudent[]>([]);
    const allSubjectStudentList = ref<TagStudent[]>([]);
    const selectSubjectName = computed(() => getSubjectName(selectSubjectId.value));

    const dealStudentList = (students: TagStudent[]) => {
        const newStudentList:StudentTag[] = [];
        const tagStudentListMap = new Map<string, TagStudent[]>();
        tagList.value.forEach((v) => {
            tagStudentListMap.set(v.TagName, []);
        });
        students.forEach((info) => {
            const tagName = (info.SubjectsInfo || []).find(item => item.SubjectID === selectSubjectId.value)?.TagName || "未标记";
            const list = tagStudentListMap.get(tagName) || [];
            list.push(info);
        });
        tagStudentListMap.forEach((value, key) => {
            const obj: StudentTag = {
                tagName: selectSubjectName.value + key,
                list: value
            };
            newStudentList.push(obj);
        });
        studentList.value = newStudentList;
    };

    const getAllStudents = async () => {
        const res = await fetchStudentsTagList({
            classId: router.currentRoute.value.params.classId as string
        });
        if (res.resultCode === 200) {
            allStudentList.value = res.result.list;
            const studentList = res.result.list.filter(
                (v) => v.StudentSubjects && v.StudentSubjects.includes(selectSubjectName.value)
            );
            dealStudentList(studentList);
        }
    };

    const searchStudent = (subject: string, studentName: string) => {
        const studentList = allStudentList.value.filter((v) => subject === "" || (v.StudentSubjects && v.StudentSubjects.includes(getSubjectName(subject))))
            .filter(
                (v) => studentName === "" || (v.Name && v.Name.indexOf(studentName) > -1) || (v.Account && v.Account.indexOf(studentName) > -1) || (v.Phone && v.Phone.indexOf(studentName) > -1)
            );
        if (subject) {
            dealStudentList(studentList);
        } else {
            allSubjectStudentList.value = studentList;
        }
    };

    return {
        studentList,
        getAllStudents,
        allStudentList,
        allSubjectStudentList,
        searchStudent
    };
};
