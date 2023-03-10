import { ElMessage } from "element-plus";
import { sleep } from "@/utils/common";
import { computed, Ref, ref } from "vue";
import { enterFullscreen } from "@/utils/fullscreen";
import { PageProps } from "@/views/preparation/intelligenceClassroom/api/props";

export default (pageList: Ref<PageProps[]>, currentPage: Ref<PageProps | null>, editRef: Ref) => {
    const previewPageList = computed(() => pageList.value.filter(item => item.State));
    const previewIndex = ref(0);
    const winScreenView = ref(false);

    // 预览ppt (1-当前页开始，2-第一页开始)
    const handlePreview = async (type: number) => {
        if (!editRef.value) return;
        editRef.value.saveSlide();
        if (type === 1 && !currentPage.value?.State) {
            return ElMessage.warning("已下架的页, 暂不支持从当前页预览");
        }
        previewIndex.value = type === 1 ? (currentPage.value?.Index as number) - 1 : 0;

        if (previewPageList.value.length === 0) {
            ElMessage.warning("请先添加页，在进行预览");
            return;
        }

        if (window.electron && !window.electron.isFullScreen() && !window.electron.isMac()) {
            window.electron.setFullScreen();
            await sleep(300);
        }
        winScreenView.value = true;
        enterFullscreen();
    };

    const keyDown = (e: KeyboardEvent) => {
        if (e.keyCode === 27) {
            winScreenView.value = false;
        }
    };

    const offScreen = () => {
        winScreenView.value = false;
    };

    return {
        keyDown,
        offScreen,
        previewIndex,
        handlePreview,
        winScreenView,
        previewPageList
    };
};
