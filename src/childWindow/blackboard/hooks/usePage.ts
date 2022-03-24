import { computed, Ref, ref } from "vue";

export default (fabCanvas: Ref<any>, clear: () => void) => {
    const storageCanvasData = ref<
        {
            data: string;
            img: string;
        }[]
    >([
        {
            data: "",
            img: ""
        }
    ]);
    const pageIndex = ref(0);

    const disabledPrevPage = computed(() => pageIndex.value === 0);
    const disabledNextPage = computed(
        () => pageIndex.value === storageCanvasData.value.length - 1
    );

    function getCanvasData() {
        const dataUrl = fabCanvas.value.toJSON();
        const canvasimg = fabCanvas.value.toDataURL();
        const data = { data: dataUrl, img: canvasimg };
        return data;
    }
    function saveCurrentCanvasData() {
        storageCanvasData.value[pageIndex.value] = getCanvasData();
    }

    const prevPage = () => {
        if (disabledPrevPage.value) {
            return;
        }
        saveCurrentCanvasData();
        pageIndex.value--;
    };
    const nextPage = () => {
        if (disabledNextPage.value) {
            return;
        }
        saveCurrentCanvasData();
        pageIndex.value++;
    };

    const createBroad = () => {
        clear();
        storageCanvasData.value.push(getCanvasData());
        pageIndex.value = storageCanvasData.value.length - 1;
    };
    const addPage = () => {
        saveCurrentCanvasData();
        createBroad();
    };

    const deleteBoard = (index: number) => {
        if (index === pageIndex.value) {
            pageIndex.value = 0;
        } else if (pageIndex.value > index) {
            pageIndex.value--;
        }
        storageCanvasData.value.splice(index, 1);
    };
    return {
        prevPage,
        disabledPrevPage,
        disabledNextPage,
        storageCanvasData,
        saveCurrentCanvasData,
        getCanvasData,
        pageIndex,
        addPage,
        createBroad,
        deleteBoard,
        nextPage
    };
};
