import { WorkbookPageQuestionBlank } from "@/types/checkHomework";
import { ref } from "vue";

export default () => {
    const imgWidth = ref(0);
    const imgHeight = ref(0);
    const x = ref(0);
    const y = ref(0);
    const boxStyleList = ref<{
        width: string,
        left: string,
        top: string,
        height: string
    }[]>([]);
    const load = (e: Event, workbookPageQuestionBlanks: WorkbookPageQuestionBlank[]) => {
        const target = e.target as HTMLImageElement;
        const blankList = workbookPageQuestionBlanks.filter(({ Type }) => Type === 0) || [];
        const blank = blankList[blankList.length - 1];
        imgWidth.value = target.width;
        imgHeight.value = target.height;
        x.value = target.width * (blank?.MarginLeft || 1);
        y.value = target.height * (blank?.MarginTop || 1);
        boxStyleList.value = blankList.map(({ SizeWidth, SizeHeight, MarginLeft, MarginTop }) => {
            const x = target.width * (MarginLeft || 1);
            const y = target.height * (MarginTop || 1);
            return {
                width: target.width * (SizeWidth || 1) + "px",
                left: x + "px",
                top: y + "px",
                height: target.height * (SizeHeight || 1) + "px"
            };
        });
    };

    return {
        load,
        imgWidth,
        imgHeight,
        x,
        boxStyleList,
        y
    };
};
