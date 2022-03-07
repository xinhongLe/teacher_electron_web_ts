import { BookList } from "@/types/preparation";
import emitter from "@/utils/mitt";
import { fetchSubjectPublisherBookList } from "@/views/preparation/api";
import { isEmpty } from "lodash";
import { ref } from "vue";

const subjectPublisherBookList = ref<BookList[]>([]);

export default async () => {
    const cascaderProps = { value: "Value", children: "Children", label: "Lable" };
    const getSubjectPublisherBookList = async () => {
        const res = await fetchSubjectPublisherBookList();
        if (res.resultCode === 200) {
            subjectPublisherBookList.value = res.result;
        }
    };

    if (isEmpty(subjectPublisherBookList.value)) {
        await getSubjectPublisherBookList();
    }

    emitter.on("logout", () => {
        subjectPublisherBookList.value = [];
    });

    return {
        cascaderProps
    };
};

export {
    subjectPublisherBookList
};
