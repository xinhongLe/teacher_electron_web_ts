import { reactive } from "vue-demi";
export default () => {
    const data = reactive({
        remark: "",
        showRemark: true
    });
    return {
        data
    };
};
