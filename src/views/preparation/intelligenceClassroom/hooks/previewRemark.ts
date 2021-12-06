import { reactive, ref } from "vue-demi";
export default () => {
    const showRemark = ref(true);
    const PageList = ref();
    const remark = ref("");
    const data = reactive({
        selectedCard: -1,
        hideTools: false
    });
    const toggleRemark = () => {
        showRemark.value = !showRemark.value;
    };
    const prevStep = () => {
        console.log("preview触发");
        PageList.value.prevCard();
    };
    const nextStep = () => {
        console.log("preview触发");
        PageList.value.nextCard();
    };
    return {
        data,
        PageList,
        showRemark,
        remark,
        toggleRemark,
        prevStep,
        nextStep
    };
};
