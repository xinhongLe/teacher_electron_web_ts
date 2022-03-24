import { ElMessageBox } from "element-plus";
import { Ref } from "vue";

export default (fabCanvas: Ref<any>, blackColor: string) => {
    function clear() {
        fabCanvas.value.clear();
        fabCanvas.value.setBackgroundColor(blackColor);
        fabCanvas.value.get("backgroundColor").set({ erasable: false });
        fabCanvas.value.renderAll();
    }
    const clearClick = () => {
        ElMessageBox.confirm("是否清空黑板?", "警告", {
            type: "warning",
            confirmButtonText: "确定",
            cancelButtonText: "取消"
        }).then(() => {
            clear();
        });
    };

    return {
        clear,
        clearClick
    };
};
