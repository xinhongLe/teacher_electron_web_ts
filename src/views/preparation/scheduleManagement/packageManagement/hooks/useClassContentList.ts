import { CourseWares, getCourseByCourseBag } from "@/api";
import { store } from "@/store";
import emitter from "@/utils/mitt";
import { cloneCourseBagToTeacher } from "@/views/preparation/api";
import { onMounted, ref, watchEffect } from "vue";

export interface ClassContent {
    content: CourseWares[],
    title: string
}

export default () => {
    const classContentList = ref<ClassContent[]>([]);

    const queryClassContentList = async () => {
        const { ID } = store.state.preparation.selectCourseBag;

        if (!ID) return;

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
            courseBagTeacherID: ID!
        });

        if (res?.resultCode === 200) {
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

    watchEffect(queryClassContentList);

    onMounted(() => {
        emitter.on("preparationReLoad", () => {
            queryClassContentList();
        });
    });

    return {
        classContentList,
        queryClassContentList
    };
};
