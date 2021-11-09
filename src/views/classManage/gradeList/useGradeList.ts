import { fetchSchoolClassPage } from "../api";
import { get, STORAGE_TYPES } from "@/utils/storage";
import { ref } from "vue";
import { Class } from "@/types/myStudent";

export default () => {
    const gradeList = ref<Class[]>([]);

    const getClassList = async () => {
        const res = await fetchSchoolClassPage({
            teacherId: get(STORAGE_TYPES.USER_INFO).ID
        });
        if (res.resultCode === 200) {
            gradeList.value = res.result.list;
        }
    };

    return {
        gradeList,
        getClassList: getClassList
    };
};
