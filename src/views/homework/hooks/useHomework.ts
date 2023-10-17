import router from "@/router";
import { Homework } from "@/types/homework";
import { LessonClasses, LessonSubject } from "@/types/login";
import { get, STORAGE_TYPES } from "@/utils/storage";
import moment from "moment";
import { computed, nextTick, onActivated, onMounted, reactive, ref, toRefs, watch } from "vue";
import { fetchClassHomeworkPaperList, fetchHomeworkDateByYear, GetMySubjectByOrgId } from "../api";
import { store } from "@/store";
import { useRoute } from "vue-router";

export default () => {
    const route = useRoute();
    const form = reactive({
        subject: "",
        date: ""
    });
    const subjectList = ref<LessonSubject[]>([]);
    // const classList = ref<{ ClassName: string, ClassId: string }[]>([]);
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
        if (form.subject && form.date) {
            const res = await fetchClassHomeworkPaperList(data);
            if (res.resultCode === 200) {
                const detailList = res.result.map((item: any) => {
                    return {
                        ...item,
                        showPublish: moment(item.AnswerShowTime) > moment(new Date())
                    };
                });
                detailList.forEach(item => {
                    const { ClassID } = item;
                    homeworkListMap.value[ClassID] ? homeworkListMap.value[ClassID].push(item) : (homeworkListMap.value[ClassID] = [item]);
                });
            }
        }
    };

    const getHasTaskDate = async () => {
        const resPromiseList = [];
        for (let year = moment().year(); year >= 2021; year--) { // 2021年之前没该产品
            const data = {
                subjectID: form.subject,
                year: moment().year(year).format("YYYY-MM-DD hh:mm:ss")
            };
            resPromiseList.push(fetchHomeworkDateByYear(data));
        }
        const resList = await Promise.all(resPromiseList);
        const list: string[] = [];
        resList.forEach((res) => {
            if (res.resultCode === 200) {
                list.push(...res.result.map((v) => v.substr(0, 10)).sort((a, b) => a > b ? -1 : 1));
            }
        });
        dateList.value = list;
        if (dateList.value.length > 0) {
            form.date = dateList.value[0];
            getTaskList();
        } else {
            homeworkListMap.value = {};
            form.date = "--";
        }
    };

    const classList: any = computed(() => store.state.userInfo.classList);

    const initData = async (type?: number) => {
        const userInfo = get(STORAGE_TYPES.USER_INFO);
        const subData = await GetMySubjectByOrgId();
        if (subData.success && subData.resultCode === 200) {
            // subjectList.value = (userInfo.Subjects as LessonSubject[]).filter(
            //     ({Name}) => Name !== "拼音"
            // );
            subjectList.value = subData.result;
            form.subject = subjectList.value.length ? subjectList.value[0].ID : "";
            const currentClass: any = store.state.userInfo.currentSelectClass;
            selectClassId.value = currentClass?.ClassAixueshiId || classList.value[0]?.ClassAixueshiId;
            getHasTaskDate();
        }
    };
    // 当前用户信息
    const currentUserInfoSchoolId = computed(() => store.state.userInfo.schoolId);
    watch(() => currentUserInfoSchoolId.value, (val: any) => {
        if (val) {
            setTimeout(() => {
                initData()
            }, 200)
        }
    }, { deep: true });
    watch(() => store.state.userInfo.currentSelectClass, (val: any) => {
        if (!val.ClassAixueshiId) return;
        selectClassId.value = val.ClassAixueshiId
        // initData(0)
    }, { deep: true })
// 监听路由参数的变化
    watch(
        () => route.query.subjectId,
        (value: any) => {
            if (value) {
                form.subject = value;
                initData();
            }
        }
    );
    onMounted(() => {
        initData();
        // if (!router.currentRoute.value.meta.isBack) {
        //     initData();
        // }
        // router.currentRoute.value.meta.isBack = false;
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
