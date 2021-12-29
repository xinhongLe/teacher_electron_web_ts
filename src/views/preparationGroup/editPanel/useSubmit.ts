import { ElForm } from "element-plus";
import { reactive, ref } from "vue";
import { fetchTextBookGrade } from "./api";
import { TextBookGradeRes } from "@/types/preparationGroup";

export default () => {
    const statusList = [
        {
            label: "全部",
            value: 0
        },
        {
            label: "已完成",
            value: 1
        },
        {
            label: "正在进行",
            value: 2
        }
    ];
    const formData = reactive({
        preTitle: "",
        status: 0,
        createTime: "",
        createStartTime: "",
        createEndTime: ""
    });
    const formRef = ref<InstanceType<typeof ElForm>>();
    const textBookGradeList = ref<TextBookGradeRes[]>([]);
    const getTextBookGrade = async () => {
        const res = await fetchTextBookGrade({});
        if (res.resultCode === 200) {
            textBookGradeList.value = res.result;
        }
    };

    return {
        statusList,
        formData,
        formRef,
        textBookGradeList,
        getTextBookGrade
    };
};
