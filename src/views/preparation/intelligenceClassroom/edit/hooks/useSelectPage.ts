import { IPageValue } from "@/types/home";
import { ElMessage, ElMessageBox } from "element-plus";
import Node from "element-plus/es/components/tree/src/model/node";
import { nextTick, onMounted, onUnmounted, Ref, ref } from "vue";
import { Slide } from "wincard";

export default (pageValue: Ref<IPageValue>, allPageSlideListMap: Ref<Map<string, Slide>>) => {
    const allPageList = ref<IPageValue[]>([]);
    const activeAllPageListIndex = ref(0);
    const isWatchChange = ref(true); // 是否是监听改变的pageValue
    const editRef = ref();
    const cardListRef = ref<HTMLDivElement>();
    //
    const currentActivePage = ref(1); // 当前选中页码
    const setDomClass = () => {
        nextTick(() => {
            const parentID = document.getElementById("activeBackground");
            if (parentID) {
                parentID.removeAttribute("id");
            }
            const childrenDom: any = document.querySelector(".active-text");
            const parentDom: any = childrenDom?.parentNode?.parentNode;
            if (parentDom) {
                parentDom.setAttribute("id", "activeBackground");
            }
        });
    };
    const selectPageValue = (data: IPageValue, flag: boolean) => {
        isWatchChange.value = flag;
        pageValue.value = data;
        currentActivePage.value = data.count || 1;
        setDomClass();
    };

    const handleNodeClick = (data: IPageValue, Node: Node | null, item?: any, e?: KeyboardEvent) => {
        if (e?.shiftKey) return;
        if (Node) {
            activeAllPageListIndex.value = allPageList.value.findIndex(item => item.ID === data.ID);
        }
        if (data.ID === pageValue.value?.ID || (Node && Node.level === 1)) return;
        if (editRef.value.getDataIsChange()) {
            const slide = editRef.value.getCurrentSlide();
            allPageSlideListMap.value.set(pageValue.value.ID, slide);
        }
        selectPageValue(data, false);
        // if (editRef.value.getDataIsChange()) {
        //     ElMessageBox.confirm("尚未保存修改, 是否继续操作?", "提示", {
        //         confirmButtonText: "确认",
        //         cancelButtonText: "取消",
        //         type: "warning"
        //     })
        //         .then(() => {
        //             selectPageValue(data, false);
        //         })
        //         .catch((err) => {
        //             return err;
        //         });
        // } else {
        //     selectPageValue(data, false);
        // }
    };

    const pagePrev = () => {
        if (activeAllPageListIndex.value === 0) {
            cardListRef.value && cardListRef.value.scrollTo(0, 0); // 解决快捷键切换到第一个 滚动条会滚动到最下面
            return ElMessage({ type: "warning", message: "已经是第一页" });
        }
        activeAllPageListIndex.value--;
        handleNodeClick(allPageList.value[activeAllPageListIndex.value], null);
    };

    const pageNext = () => {
        if (activeAllPageListIndex.value === allPageList.value.length - 1) {
            cardListRef.value && cardListRef.value.scrollTo(0, cardListRef.value.scrollHeight); // 解决快捷键切换到最后一个 滚动条会滚动到最上面
            return ElMessage({ type: "warning", message: "已经是最后页" });
        }
        activeAllPageListIndex.value++;
        handleNodeClick(allPageList.value[activeAllPageListIndex.value], null);
    };

    const checkPageDownload = (e: any) => {
        const key = e.key.toUpperCase();
        if (key === "ARROWUP" || key === "PAGEUP") { // 上一页
            pagePrev();
        } else if (key === "ARROWDOWN" || key === "PAGEDOWN") { // 下一页
            pageNext();
        }
    };

    onMounted(() => {
        if (cardListRef.value) {
            cardListRef.value.addEventListener("keydown", checkPageDownload);
        }
    });

    onUnmounted(() => {
        if (cardListRef.value) {
            cardListRef.value.removeEventListener("keydown", checkPageDownload);
        }
    });

    return {
        handleNodeClick,
        currentActivePage,
        selectPageValue,
        editRef,
        allPageList,
        activeAllPageListIndex,
        cardListRef,
        isWatchChange
    };
};
