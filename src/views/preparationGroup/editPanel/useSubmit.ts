import { ElForm } from "element-plus";
import { reactive, ref } from "vue";

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

    return {
        statusList,
        formData,
        formRef
    };
};
