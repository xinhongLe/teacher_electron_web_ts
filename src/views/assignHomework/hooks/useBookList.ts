import router from "@/router";
import { BookList } from "@/types/preparation";
import { fetchSubjectPublisherBookList } from "@/views/preparation/api";
import { ref } from "vue";

export default () => {
    const cascaderProps = {
        value: "Value",
        children: "Children",
        label: "Lable"
    };

    const subjectPublisherBookList = ref<BookList[]>([]);

    fetchSubjectPublisherBookList().then((res) => {
        const subjectId = router.currentRoute.value.params.subjectId;
        if (res.resultCode === 200) {
            subjectPublisherBookList.value = res.result.filter(({ Value }) => Value === subjectId);
        }
    });

    return {
        cascaderProps,
        subjectPublisherBookList
    };
};
