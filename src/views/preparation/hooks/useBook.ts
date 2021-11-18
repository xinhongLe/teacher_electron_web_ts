import { MutationTypes, store } from "@/store";
import { BookChapter, BookList } from "@/types/preparation";
import { ref, watch } from "vue";
import { fetchSubjectPublisherBookList, fetchTeacherBookChapters } from "../api";

const findFirstId = (tree: BookList[], ids: string[]) => {
    tree.forEach((item) => {
        ids.push(item.Value);
        if (item.Children && item.Children.length > 0) {
            findFirstId([item.Children[0]], ids);
        }
    });
};

export default () => {
    const subjectPublisherBookList = ref<BookList[]>([]);
    const teacherBookChapterList = ref<BookChapter[]>([]);
    const teacherBookChapter = ref("");
    const subjectPublisherBookValue = ref([]);
    const cascaderProps = { value: "Value", children: "Children", label: "Lable" };

    const getTeacherBookChapters = async (bookID: string) => {
        const res = await fetchTeacherBookChapters({ bookID });
        if (res.resultCode === 200) {
            teacherBookChapterList.value = res.result;
            teacherBookChapter.value = res.result[0].ID;
        }
    };

    const getSubjectPublisherBookList = async () => {
        const res = await fetchSubjectPublisherBookList();
        if (res.resultCode === 200) {
            subjectPublisherBookList.value = res.result;
            findFirstId([res.result[0]], subjectPublisherBookValue.value);
        }
    };
    watch(subjectPublisherBookValue, (value) => {
        getTeacherBookChapters(value[2]);
        store.commit(MutationTypes.SET_SUBJECT_PUBLISHER_BOOK_VALUE, value);
    }, {
        deep: true
    });
    getSubjectPublisherBookList();

    return {
        subjectPublisherBookValue,
        subjectPublisherBookList,
        teacherBookChapterList,
        teacherBookChapter,
        cascaderProps,
        getTeacherBookChapters
    };
};
