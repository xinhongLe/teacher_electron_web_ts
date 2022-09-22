import { Material } from "@/types/preparation";
import { ref } from "vue";

export default () => {
    const dialogVisible = ref(false);
    const isEdit = ref(false);
    const editInfo = ref<Material>();

    const addMaterial = () => {
        dialogVisible.value = true;
        isEdit.value = false;
    };

    const editMaterial = (info: Material) => {
        dialogVisible.value = true;
        isEdit.value = true;
        editInfo.value = info;
    };

    return {
        addMaterial,
        dialogVisible,
        isEdit,
        editInfo,
        editMaterial
    };
};
