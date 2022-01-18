import { getTeacherList, getSchoolList } from "../api";
import { ref } from "vue";
import { GetTeacherClassData, GetTeacherDataRes, GetSchoolClassData, GetSchoolDataRes } from "@/types/preparationGroup";
import { get, STORAGE_TYPES } from "@/utils/storage";

export default () => {
    const teacherList = ref<GetTeacherDataRes>([]);
    const schoolList = ref<GetSchoolDataRes>([]);

    const getTeacher = async (params: GetTeacherClassData) => {
        const res = await getTeacherList(params);
        if (res.resultCode === 200) {
            res.result.map((item: any) => {
                const resp: any = {
                    ID: item.ID,
                    Name: item.Name,
                    Active: false
                };
                teacherList.value.push(resp);
            });
        }
    };

    const getSchool = async (params: GetSchoolClassData) => {
        const userInfo = get(STORAGE_TYPES.USER_INFO);
        const res = await getSchoolList(params);
        if (res.resultCode === 200) {
            // schoolList.value = res.result;
            schoolList.value = userInfo.Schools;
            const req: GetTeacherClassData = {
                schoolID: schoolList.value ? schoolList.value[0].ID : ""
            };
            // getTeacher(req);
        }
    };

    return {
        teacherList,
        schoolList,
        getTeacher,
        getSchool
    };
};