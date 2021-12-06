import { get, STORAGE_TYPES } from "@/utils/storage";
import { ref, computed } from "vue";

interface Classes {
    GradeID: string,
    GradeName: string,
    GradeSort: number,
    ID: string,
    ClassName: string,
    ClassID: string,
    fontColor: string,
    backgroundColor: string,
    Name: string
}

interface Subject {
    ID: string,
    Name: string,
    SubjectName: string,
    SubjectID: string
}

const background = ["#E6ECFF", "#FFF4D0", "#DAFCE9", "#F6F1FF", "#FFF0F0"];
const fontColor = ["#4B71EE", "#E3850A", "#13BB7C", "#7B4DFF", "#F75050"];

export default () => {
    const lessonListAll = ref<(Classes & Subject)[]>([]);
    const preIndex = ref(0);
    const nextIndex = ref(10);

    const classes: Classes[] = get(STORAGE_TYPES.USER_INFO).Classes.map((item: Classes) => {
        return {
            ...item,
            ClassName: item.Name,
            ClassID: item.ID
        };
    });

    const subjects: Subject[] = get(STORAGE_TYPES.USER_INFO).Subjects.map((item: Subject) => {
        return {
            ...item,
            SubjectName: item.Name,
            SubjectID: item.ID
        };
    });

    subjects.forEach(subject => {
        classes.forEach(item => {
            lessonListAll.value.push({
                ...subject,
                ...item
            });
        });
    });

    lessonListAll.value = lessonListAll.value.map((item, index) => {
        return {
            ...item,
            backgroundColor: background[index % 5],
            fontColor: fontColor[index % 5]
        };
    });

    const prePage = () => {
        if (preIndex.value === 0) return;
        preIndex.value -= 10;
        nextIndex.value -= 10;
    };

    const nextPage = () => {
        if (nextIndex.value > lessonListAll.value.length - 1) return;
        preIndex.value += 10;
        nextIndex.value += 10;
    };

    const lessonList = computed(() => {
        return lessonListAll.value.slice(
            preIndex.value,
            nextIndex.value
        );
    });

    return {
        lessonListAll,
        lessonList,
        prePage,
        nextPage
    };
};
