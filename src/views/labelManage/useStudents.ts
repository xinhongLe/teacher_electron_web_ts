import router from "@/router";
import { Student, StudentTag, Tag } from "@/types/labelManage";
import { get, STORAGE_TYPES } from "@/utils/storage";
import { groupBy } from "lodash";
import { ref, Ref } from "vue";
import { fetchAllStudents } from "./api";

const getSubjectName = (SelectSubjectId: string) => {
    const subjectList = get(STORAGE_TYPES.USER_INFO).Subjects;
    return subjectList.filter((v: any) => v.ID === SelectSubjectId)[0]
        .Name;
};

export default (tagList: Ref<Tag[]>, selectSubjectId: Ref<string>) => {
    const studentList = ref<StudentTag[]>([]);
    const allStudentList = ref<Student[]>([]);
    const allSubjectStudentList = ref<Student[][]>([]);

    const dealStudentList = (students: Student[]) => {
        console.log(selectSubjectId, "selectSubjectId");
        const newStudentList:StudentTag[] = [];
        tagList.value.map((v) => {
            const obj: StudentTag = {
                tagName: getSubjectName(selectSubjectId.value) + v.TagName,
                list: []
            };
            students.map((e) => {
                if (e.TagName === v.TagName) {
                    obj.list.push(e);
                }
            });
            newStudentList.push(obj);
        });
        studentList.value = newStudentList;
    };

    const getAllStudents = async () => {
        const res = await fetchAllStudents(get(STORAGE_TYPES.USER_INFO).ID);
        if (res.resultCode === 200) {
            allStudentList.value = res.result;
            const studentList = res.result.filter(
                (v) => v.SubjectID === selectSubjectId.value && v.ClassID === router.currentRoute.value.params.classId
            );
            dealStudentList(studentList);
        }
    };

    const searchStudent = (subject: string, studentName: string) => {
        const studentList = allStudentList.value.filter((v) => subject === "" || v.SubjectID === subject)
            .filter(
                (v) =>
                    v.ClassID === router.currentRoute.value.params.classId
            )
            .filter(
                (v) => studentName === "" || v.Name.indexOf(studentName) > -1 || v.Account.indexOf(studentName) > -1 || v.Phone.indexOf(studentName) > -1
            );
        if (subject === "") {
            const listMap = groupBy(studentList, "StudentID");
            allSubjectStudentList.value = Object.values(listMap);
        } else {
            dealStudentList(studentList);
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
