import { StudentMachineBindInfo } from "@/types/myStudent";
import { get, set, STORAGE_TYPES, storeChange } from "@/utils/storage";
import { computed, ref } from "vue";
import { groupBy, Dictionary, remove } from "lodash";

export default () => {
    const userInfo = get(STORAGE_TYPES.USER_INFO);
    const name = computed(() => STORAGE_TYPES.STUDENT_MACHINE_LIST + userInfo.ID);
    const studentMachineList = ref<StudentMachineBindInfo[]>(get(name.value) || []);
    const studentMachineListByClassIdMap = computed(() => groupBy(studentMachineList.value, "classID"));
    const studentMachineListMap = ref<Dictionary<StudentMachineBindInfo[]>>();

    const updateStudentMachine = (updateList: StudentMachineBindInfo[]) => {
        updateList.forEach((item) => {
            const index = studentMachineList.value.findIndex(
                ({ classID, studentAccount }) =>
                    item.classID === classID &&
                    studentAccount === item.studentAccount
            );
            if (index === -1) {
                studentMachineList.value.push(item);
            } else {
                studentMachineList.value.splice(index, 1, item);
            }
        });
        set(name.value, studentMachineList.value);
    };

    const getStudentMachineListMap = (classID: string) => {
        studentMachineListMap.value = groupBy(studentMachineListByClassIdMap.value[classID], "studentAccount");
    };

    const deleteStudentMachine = ({ classID, studentId }: {classID: string, studentId?: string}) => {
        if (studentId) {
            remove(studentMachineList.value, (item) => item.classID === classID && item.studentAccount === studentId);
        } else {
            remove(studentMachineList.value, (item) => item.classID === classID);
        }
        set(name.value, studentMachineList.value);
    };

    storeChange(name.value, (value: unknown) => {
        try {
            studentMachineList.value = JSON.parse(value as string);
        } catch (error) {
            window.electron.log.info("useStudentMachine storeChange", error);
        }
    });

    return {
        updateStudentMachine,
        studentMachineListMap,
        getStudentMachineListMap,
        deleteStudentMachine,
        studentMachineList,
        studentMachineListByClassIdMap
    };
};
