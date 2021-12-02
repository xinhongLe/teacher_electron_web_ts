import { reactive, ref } from "vue-demi";
export default () => {
    const showRemark = ref(true);
    const data = reactive({
        remark: "",
        selectedCard: -1,
        hideTools: false
    });
    const selectCard = (index: number) => {
        data.selectedCard = index;
    };
    const toggleRemark = () => {
        showRemark.value = !showRemark.value;
    };
    return {
        data,
        showRemark,
        selectCard,
        toggleRemark
    };
};
