import { Grade } from "@/types/myStudent";
import { ref } from "vue";
import { fetchGradeList } from "../api";

export default () => {
    const gradeList = ref<Grade[]>([]);
    const getGradeList = async () => {
        const res = await fetchGradeList();
        if (res.resultCode === 200) {
            gradeList.value = res.result;
        }
    };

    return {
        gradeList,
        getGradeList
    };
};
