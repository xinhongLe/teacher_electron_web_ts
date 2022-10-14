import { ElMessage } from "element-plus";
import { sleep } from "@/utils/common";
import { IPageValue } from "@/types/home";
import { Ref, ref } from "vue";
import { enterFullscreen } from "@/utils/fullscreen";

export default (pageValue: Ref<IPageValue>) => {
    const previewPageList = ref<IPageValue[]>([]);
    const activePreviewPageIndex = ref(0);
    const winScreenView = ref(false);
    const handleView = async (data: IPageValue[], flag: string) => { // flag first 首页预览  active 当前页预览
        const activePageData: any = pageValue.value;
        if (flag === "active" && !activePageData.State) {
            return ElMessage({ type: "warning", message: "已下架的页, 暂不支持从当前页预览" });
        }

        // 预览只支持 已上架数据
        previewPageList.value = data.filter((item: IPageValue) => item.State);
        flag === "first" ? activePreviewPageIndex.value = 0 : activePreviewPageIndex.value = previewPageList.value.findIndex((item : IPageValue) => item.ID === pageValue.value.ID);
        if (previewPageList.value.length > 0) {
            if (
                (window as any).electron &&
                !(window as any).electron.isFullScreen() &&
                !(window as any).electron.isMac()
            ) {
                (window as any).electron.setFullScreen();
                await sleep(300);
            }
            winScreenView.value = true;
            enterFullscreen();
        } else {
            ElMessage({
                type: "warning",
                message: "请先添加页，在进行预览"
            });
        }
    };

    const keyDown = (e:any) => {
        if (e.keyCode === 27) {
            winScreenView.value = false;
        }
    };

    const offScreen = () => {
        winScreenView.value = false;
    };

    return {
        previewPageList,
        handleView,
        keyDown,
        offScreen,
        activePreviewPageIndex,
        winScreenView
    };
};
