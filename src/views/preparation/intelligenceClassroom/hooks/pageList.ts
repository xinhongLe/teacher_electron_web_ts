import { ref } from "vue-demi";
export default () => {
    const hasCheck = ref(false);
    const selected = ref(0);
    return {
        selected,
        hasCheck
    };
};
