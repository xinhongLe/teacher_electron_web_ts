import useSubjectPublisherBookList, { subjectPublisherBookList } from "@/hooks/useSubjectPublisherBookList";
import router from "@/router";
import { BookList } from "@/types/preparation";
import { ref } from "vue";

export default () => {
    const cascaderProps = {
        value: "Value",
        children: "Children",
        label: "Lable"
    };

    const list = ref<BookList[]>([]);

    useSubjectPublisherBookList().then(() => {
        const subjectId = router.currentRoute.value.params.subjectId;
        list.value = subjectPublisherBookList.value.filter(({ Value }) => Value === subjectId);
    });

    return {
        cascaderProps,
        subjectPublisherBookList: list
    };
};
