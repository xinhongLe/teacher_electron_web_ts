import { CourseWares, getCourseByCourseBag } from "@/api";
import { store } from "@/store";
import { SchoolBagInfo } from "@/types/preparation";
import { set, STORAGE_TYPES } from "@/utils/storage";
import { cloneCourseBagToTeacher, fetchBagBySchoolLesson } from "@/views/preparation/api";
import { computed, InjectionKey, onDeactivated, Ref, ref } from "vue";
export interface ClassContent {
    content: CourseWares[],
    title: string
}
const useBag = (lessonID: Ref<string>) => {
    const bagList = ref<SchoolBagInfo[]>([]);
    const selectBag = ref<SchoolBagInfo>();
    const classContentList = ref<ClassContent[]>([]);

    const getBagList = async (id: string) => {
        const res = await fetchBagBySchoolLesson({
            lessonID: id
        });
        if (res.resultCode === 200) {
            bagList.value = res.result;
        }
    };

    const selectBagIdKey = computed(() => STORAGE_TYPES.SELECT_BAG_ID + lessonID.value + "_" + store.state.userInfo.id);

    const handleSelectBag = async (bag: SchoolBagInfo, index: number) => {
        const newBag = { ...bag };
        if (newBag.CourseBagType === 1) {
            const cloneCourseBagDetail = await cloneCourseBagToTeacher({
                courseBagID: newBag.ID,
                lessonID: lessonID.value
            });
            if (cloneCourseBagDetail.resultCode === 200) {
                newBag.ID = cloneCourseBagDetail.result.CourseBagTeacher.ID;
                newBag.CourseBagType = 2;
                bagList.value[index] = newBag;
            }
        }
        selectBag.value = newBag;
        set(selectBagIdKey.value, selectBag.value.ID); // 为了区分不同用户
        queryClassContentList();
    };

    const queryClassContentList = async () => {
        const id = selectBag.value?.ID || "";
        const list: ClassContent[] = [{
            content: [],
            title: "课前预习"
        }, {
            content: [],
            title: "课堂内容"
        }, {
            content: [],
            title: "课后作业"
        }];

        const res = await getCourseByCourseBag(2, {
            courseBagTeacherID: id
        });

        if (res?.resultCode === 200) {
            window.electron.ipcRenderer.invoke("getCourseWares", res.result.CourseWares);
            res.result.CourseWares.forEach(item => {
                switch (item.Process) {
                case 1:
                    list[0].content.push(item);
                    break;
                case 2:
                    list[1].content.push(item);
                    break;
                case 3:
                    list[2].content.push(item);
                    break;
                }
            });
        }
        classContentList.value = list;
    };

    onDeactivated(() => {
        window.electron.ipcRenderer.invoke("getCourseWares", []);
    });

    return {
        getBagList,
        selectBag,
        handleSelectBag,
        classContentList,
        queryClassContentList,
        selectBagIdKey,
        bagList
    };
};

export default useBag;

export const bagKey = Symbol("bagKey") as InjectionKey<ReturnType<typeof useBag>>;
