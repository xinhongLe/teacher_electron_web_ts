import { ElMessage } from "element-plus";
import { sleep } from "@/utils/common";
import { computed, Ref, ref } from "vue";
import { enterFullscreen } from "@/utils/fullscreen";
import { CardProps, PageProps } from "@/views/preparation/intelligenceClassroom/api/props";

export default (windowCards: Ref<CardProps[]>, currentPage: Ref<PageProps | null>, editRef: Ref, winCardViewRef: Ref) => {
    const previewPageList = computed(() => {
        let allPages: PageProps[] = [];
        windowCards.value.forEach(item => {
            allPages = allPages.concat(...item.PageList);
        });
        return allPages;
    });
    const previewIndex = ref(0);
    const winScreenView = ref(false);

    // 预览ppt (1-当前页开始，2-第一页开始)
    const handlePreview = async (type: number) => {
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
        setTimeout(() => {
            winCardViewRef.value.setScreening(true);
        }, 20);
        enterFullscreen();
    };

    const keyDown = (e: KeyboardEvent) => {
        if (e.keyCode === 27) {
            winScreenView.value = false;
            editRef.value?.setScreening(false);
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
