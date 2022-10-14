import { reactive, ref } from "vue";
export default (isShowRemark = true) => {
    const showRemark = ref(isShowRemark);
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
