import router from "@/router";
import { Homework } from "@/types/homework";
import { LessonClasses, LessonSubject } from "@/types/login";
import { get, STORAGE_TYPES } from "@/utils/storage";
import moment from "moment";
import { onActivated, reactive, ref, toRefs } from "vue";
import { fetchClassHomeworkPaperList, fetchHomeworkDateByYear } from "../api";

export default () => {
    const form = reactive({
        subject: "",
        date: ""
    });
    const subjectList = ref<LessonSubject[]>([]);
    const classList = ref<LessonClasses[]>([]);
    const dateList = ref<string[]>([]);
    const homeworkListMap = ref<Record<string, Homework[]>>({});
    const selectClassId = ref("");

    const disabledDate = reactive({
        disabledDate(time?: Date) {
            return !dateList.value.includes(moment(time).format("YYYY-MM-DD"));
        }
    });

    const getTaskList = async () => {
        if (form.date === "--") return;
        homeworkListMap.value = {};
        const data = {
            subjectID: form.subject,
            date: form.date
        };
        const res = await fetchClassHomeworkPaperList(data);
        if (res.resultCode === 200) {
            res.result.forEach(item => {
                const { ClassID } = item;
                homeworkListMap.value[ClassID] ? homeworkListMap.value[ClassID].push(item) : (homeworkListMap.value[ClassID] = [item]);
            });
        }
    };

    const getHasTaskDate = async () => {
        const data = {
            subjectID: form.subject,
            year: moment(new Date()).format("YYYY-MM-DD hh:mm:ss")
        };
        const res = await fetchHomeworkDateByYear(data);
        if (res.resultCode === 200) {
            dateList.value = res.result.map((v) => v.substr(0, 10));
            if (dateList.value.length > 0) {
                form.date = dateList.value[dateList.value.length - 1];
                getTaskList();
            } else {
                homeworkListMap.value = {};
                form.date = "--";
            }
        }
    };

    const initData = () => {
        const userInfo = get(STORAGE_TYPES.USER_INFO);
        subjectList.value = (userInfo.Subjects as LessonSubject[]).filter(
            ({ Name }) => Name !== "拼音"
        );
        classList.value = userInfo.Classes.reverse();
        form.subject = subjectList.value[0] ? subjectList.value[0].ID : "";
        !selectClassId.value && (selectClassId.value = classList.value[0].ID);

        getHasTaskDate();
    };

    onActivated(() => {
        if (!router.currentRoute.value.meta.isBack) {
            initData();
        }
        router.currentRoute.value.meta.isBack = false;
    });

    return {
        form,
        subjectList,
        ...toRefs(disabledDate),
        homeworkListMap,
        selectClassId,
        getTaskList,
        initData,
        getHasTaskDate,
        classList
    };
};
