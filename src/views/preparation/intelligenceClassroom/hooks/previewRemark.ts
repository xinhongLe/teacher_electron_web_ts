import { reactive, ref } from "vue-demi";
export default () => {
    const showRemark = ref(true);
    const pageList = ref();
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
    const prevStep = () => {
        pageList.value.prevStep();
    };
    const nextStep = () => {
        pageList.value.nextStep();
    };
    return {
        data,
        showRemark,
        selectCard,
        toggleRemark,
        prevStep,
        nextStep
    };
};
