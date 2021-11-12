import { Tag } from "@/types/labelManage";
import { get, set, STORAGE_TYPES } from "@/utils/storage";
import { fetchBasicTag } from "@/views/labelManage/api";
import { ref } from "vue";

export default () => {
    const tagList = ref<Tag[]>([]);

    const getTagList = async () => {
        if (get(STORAGE_TYPES.STUDENT_TAGS)) {
            tagList.value = get(STORAGE_TYPES.STUDENT_TAGS);
        } else {
            const res = await fetchBasicTag();
            if (res.resultCode === 200) {
                const { result } = res;
                tagList.value = result;
                set(STORAGE_TYPES.STUDENT_TAGS, result);
            }
        }
    };

    return {
        tagList,
        getTagList
    };
};
