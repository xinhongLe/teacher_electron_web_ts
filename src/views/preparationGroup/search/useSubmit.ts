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
    const switchStatus = (status: number) => {
        return statusList.filter((v) => {
            return v.value === status;
        })[0].label;
    };
    const formData = reactive({
        preTitle: "",
        status: 0,
        createTime: ""
    });
    const formRef = ref<InstanceType<typeof ElForm>>();

    return {
        statusList,
        switchStatus,
        formData,
        formRef
    };
};
