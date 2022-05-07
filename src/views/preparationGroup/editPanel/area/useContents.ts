import { fetchGroupLessonDiscussionContents } from "../../api";
import { ref } from "vue";
import { AddChapterData, DiscussioncontentList } from "@/types/preparationGroup";

export default () => {
    const Contents = ref<DiscussioncontentList[]>([]);

    const getContents = async (params :AddChapterData) => {
        const res = await fetchGroupLessonDiscussionContents(params);
        if (res.resultCode === 200) {
            const { result = [] } = res;
            Contents.value = result;
        }
    };
    return {
        Contents,
        getContents
    };
};
