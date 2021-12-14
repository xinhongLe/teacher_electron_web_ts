import { BookChapter, BookList, GetLastSelectBookRes, Lesson } from "@/types/preparation";
import { ref } from "vue";
import { fetchLessons, fetchSubjectPublisherBookList, fetchTeacherBookChapters, getLastSelectBook } from "../api";

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
    const subjectPublisherBookValue = ref<string[]>([]);
    const cascaderProps = { value: "Value", children: "Children", label: "Lable" };
    const lessonID = ref<string | null>(null);
    const lessons = ref<Lesson[]>([]);
    let selectBook: GetLastSelectBookRes;
    let isFirst = true;

    const getTeacherBookChapters = async (bookID: string) => {
        if (!bookID) return;
        const res = await fetchTeacherBookChapters({ bookID });
        if (res.resultCode === 200) {
            teacherBookChapterList.value = res.result;
            if (selectBook && isFirst) {
                isFirst = false;
                return (teacherBookChapter.value = selectBook.ChapterID);
            }
            teacherBookChapter.value = res.result[0].ID;
        }
    };

    const getSubjectPublisherBookList = async () => {
        const res = await fetchSubjectPublisherBookList();
        if (res.resultCode === 200) {
            subjectPublisherBookList.value = res.result;
            const selectBookRes = await getLastSelectBook({
                subjectID: ""
            });
            if (selectBookRes.resultCode === 200) {
                selectBook = selectBookRes.result;
            }
            if (selectBook) {
                const { BookID, PublisherID, SubjectID } = selectBook;
                subjectPublisherBookValue.value = [SubjectID, PublisherID, BookID];
            } else {
                findFirstId([res.result[0]], subjectPublisherBookValue.value);
            }
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
