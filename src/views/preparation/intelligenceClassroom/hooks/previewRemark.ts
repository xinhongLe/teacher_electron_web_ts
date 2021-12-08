import { reactive, ref } from "vue-demi";
export default () => {
    const showRemark = ref(true);
    const data = reactive({
        selectedCard: -1,
        hideTools: false
    });
    const toggleRemark = () => {
        showRemark.value = !showRemark.value;
    };
    return {
        data,
        showRemark,
        toggleRemark
    };
};
