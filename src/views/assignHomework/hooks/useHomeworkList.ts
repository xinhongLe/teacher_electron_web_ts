import {
    ClassData,
    CommHomework,
    Student,
    SystemHomework,
    TeachHomework
} from "@/types/assignHomework";
import { cloneDeep } from "lodash";
import { ref } from "vue";

export default () => {
    const classList = ref<ClassData[]>([]);
    const commonHomeworkList = ref<CommHomework[]>([]);
    const studentList = ref<Student[]>([]);
    const systemHomeworkList = ref<SystemHomework[]>([]);
    const teachHomeworkList = ref<TeachHomework[]>([]);

    const updateClassList = (list: ClassData[]) => {
        classList.value = list;
        studentList.value = [];
        list.forEach(({ Students, ClassId }) => {
            studentList.value.push(
                ...Students.map((item) => ({
                    ...item,
                    checked: true,
                    classID: ClassId
                }))
            );
        });
        commonHomeworkList.value = commonHomeworkList.value.map((item) => {
            return {
                ...item,
                students: cloneDeep(studentList.value)
            };
        });
        systemHomeworkList.value = systemHomeworkList.value.map((item) => {
            return {
                ...item,
                students: cloneDeep(studentList.value)
            };
        });
        teachHomeworkList.value = teachHomeworkList.value.map((item) => {
            return {
                ...item,
                students: cloneDeep(studentList.value)
            };
        });
    };

    const updateCommonHomeworkList = (list: CommHomework[]) => {
        commonHomeworkList.value.push(
            ...list.map((item) => ({
                ...item,
                students: cloneDeep(studentList.value)
            }))
        );
    };

    const updateCommonHomework = (index: number, info: CommHomework) => {
        commonHomeworkList.value[index] = info;
    };

    const deleteCommonHomework = (index: number) => {
        commonHomeworkList.value.splice(index, 1);
    };

    const updateSystemHomeworkList = (list: SystemHomework[]) => {
        const newList = list.filter(
            (item) =>
                !systemHomeworkList.value.find(
                    (v) => v.PaperID === item.PaperID && v.type === item.type
                )
        );
        systemHomeworkList.value.push(
            ...newList.map((item) => ({
                ...item,
                students: cloneDeep(studentList.value)
            }))
        );
    };

    const deleteSystemHomework = (index: number) => {
        systemHomeworkList.value.splice(index, 1);
    };

    const updateTeachHomeworkList = (list: TeachHomework[]) => {
        const newList = list.filter(
            (item) =>
                !teachHomeworkList.value.find(
                    (v) => v.WorkbookPaperID === item.WorkbookPaperID
                )
        );
        teachHomeworkList.value.push(
            ...newList.map((item) => ({
                ...item,
                students: cloneDeep(studentList.value),
                publishType: "shou",
                publishTime: ""
            }))
        );
    };

    const deleteTeachHomework = (index: number) => {
        teachHomeworkList.value.splice(index, 1);
    };
    const updateTeachHomework = (index: number, item: any) => {
        teachHomeworkList.value.splice(index, 1, item);
        console.log(teachHomeworkList, "updata");
    };
    return {
        classList,
        commonHomeworkList,
        studentList,
        updateClassList,
        updateCommonHomework,
        updateSystemHomeworkList,
        deleteSystemHomework,
        updateTeachHomeworkList,
        systemHomeworkList,
        updateCommonHomeworkList,
        deleteTeachHomework,
        teachHomeworkList,
        updateTeachHomework,
        deleteCommonHomework
    };
};
