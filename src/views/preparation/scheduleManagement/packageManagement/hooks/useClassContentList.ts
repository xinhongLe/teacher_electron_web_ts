import { CourseWares, getCourseByCourseBag } from "@/api";
import { store } from "@/store";
import { cloneCourseBagToTeacher } from "@/views/preparation/api";
import { ref, watchEffect } from "vue";

export interface ClassContent {
    content: CourseWares[],
    title: string
}

export default () => {
    const classContentList = ref<ClassContent[]>([]);

    const queryClassContentList = async () => {
        const { Type, ID } = store.state.preparation.selectCourseBag;

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

        let res;

        if (Type === 1) {
            const cloneCourseBagDetail = await cloneCourseBagToTeacher({
                courseBagID: ID!
            });
            if (cloneCourseBagDetail.resultCode === 200) {
                res = await getCourseByCourseBag(2, {
                    courseBagTeacherID: ID!
                });
            }
        } else {
            res = await getCourseByCourseBag(2, {
                courseBagTeacherID: ID!
            });
        }

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

    return {
        classContentList,
        queryClassContentList
    };
};
