import { Ref, ref } from "vue";

export default (fabCanvas: Ref<any>, clear: () => void) => {
    const isAction = ref(false);
    // 记录黑板数据
    const currentState = ref<string[]>([]);
    // 记录删除黑板数据
    const deleteState = ref<string[]>([]);
    let actionSleep: any;
    const undoClick = () => {
        isAction.value = true;

        if (currentState.value.length > 1) {
            const deleteJson = currentState.value.pop();
            deleteState.value.push(deleteJson!);
            const jsonString =
                currentState.value[currentState.value.length - 1];
            const json = JSON.parse(jsonString);
            fabCanvas.value.loadFromJSON(json).renderAll();
        } else {
            if (currentState.value.length === 1) {
                const deleteJson = currentState.value.pop();
                deleteState.value.push(deleteJson!);
            }
            currentState.value = [];
            clear();
        }
        clearTimeout(actionSleep);
        actionSleep = setTimeout(() => {
            isAction.value = false;
        }, 500);
    };
    const recoverClick = () => {
        isAction.value = true;
        if (deleteState.value.length > 0) {
            const deleteJson = deleteState.value.pop();
            currentState.value.push(deleteJson!);
            const json = JSON.parse(deleteJson!);
            fabCanvas.value.loadFromJSON(json).renderAll();
        }
        clearTimeout(actionSleep);
        actionSleep = setTimeout(() => {
            isAction.value = false;
        }, 500);
    };

    return {
        undoClick,
        isAction,
        currentState,
        deleteState,
        recoverClick
    };
};
