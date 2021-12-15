import { BookChapter, BookList, Lesson } from "@/types/preparation";
import { ref } from "vue";
import { fetchLessons, fetchSubjectPublisherBookList, fetchTeacherBookChapters } from "../api";

export default () => {
    const subjectPublisherBookList = ref<BookList[]>([]);
    const teacherBookChapterList = ref<BookChapter[]>([]);
    const teacherBookChapter = ref("");
    const subjectPublisherBookValue = ref<string[]>([]);
    const cascaderProps = { value: "Value", children: "Children", label: "Lable" };
    const lessonID = ref<string | null>(null);
    const lessons = ref<Lesson[]>([]);

    const getTeacherBookChapters = async (bookID: string) => {
        if (!bookID) return;
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
        }
    };

    const getLessons = async (id: string) => {
        const res = await fetchLessons({
            chapterID: id,
            type: 1
        });
        if (res.resultCode === 200) {
            lessons.value = res.result;
            lessonID.value = null;
        }
    };

    return {
        subjectPublisherBookValue,
        subjectPublisherBookList,
        teacherBookChapterList,
        teacherBookChapter,
        cascaderProps,
        getLessons,
        lessonID,
        lessons,
        getSubjectPublisherBookList,
        getTeacherBookChapters
    };
};
