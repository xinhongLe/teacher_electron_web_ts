import { ClassroomType, SchoolWindowInfo } from "@/types/preparation";
import emitter from "@/utils/mitt";
import { onActivated, onDeactivated, onMounted, onUnmounted, Ref } from "vue";

export default (tabIndex: Ref<ClassroomType>, updateCurrentWindow: (win: SchoolWindowInfo) => void, updateShowClassArrangement?: (flag: boolean) => void) => {
    const openWindow: (event: Electron.IpcRendererEvent, ...args: any[]) => void = (_, data) => {
        if (tabIndex.value === ClassroomType.Classes) {
            tabIndex.value = ClassroomType.WindowClasses;
        }
        if (updateShowClassArrangement) {
            updateShowClassArrangement(false);
        }
        emitter.emit("smallVideo", null);
        emitter.emit("smallQuestion", null);
        window.electron.showWindow(true);
        updateCurrentWindow(data);
    };

    onMounted(() => {
        window.electron.ipcRenderer.removeListener("openWindow", openWindow);
        window.electron.ipcRenderer.on("openWindow", openWindow);
    });

    onActivated(() => {
        window.electron.ipcRenderer.removeListener("openWindow", openWindow);
        window.electron.ipcRenderer.on("openWindow", openWindow);
    });

    onDeactivated(() => {
        window.electron.ipcRenderer.removeListener("openWindow", openWindow);
    });

    onUnmounted(() => {
        window.electron.ipcRenderer.removeListener("openWindow", openWindow);
    });
};
