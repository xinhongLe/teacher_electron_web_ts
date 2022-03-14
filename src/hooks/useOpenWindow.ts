import { ClassroomType, SchoolWindowInfo } from "@/types/preparation";
import emitter from "@/utils/mitt";
import { onMounted, onUnmounted, Ref } from "vue";

export default (tabIndex: Ref<ClassroomType>, updateCurrentWindow: (win: SchoolWindowInfo) => void) => {
    onMounted(() => {
        window.electron.ipcRenderer.on("openWindow", (_, data) => {
            if (tabIndex.value === ClassroomType.Classes) {
                tabIndex.value = ClassroomType.WindowClasses;
            }
            emitter.emit("smallVideo", null);
            emitter.emit("smallQuestion", null);
            window.electron.showWindow(true);
            updateCurrentWindow(data);
        });
    });

    onUnmounted(() => {
        window.electron.ipcRenderer.removeAllListeners("openWindow");
    });
};
