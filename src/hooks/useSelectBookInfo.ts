import {
    getSubjectPublisherBookList, getChapters, getWindowCard, deleteCardOrPage, addPage,
    renameCardOrPage, setCardOrPageState, updateCardSort, movePage, addCard,
    IGetChapters, IGetWindowCards, IDelCardOrPage, IAddPage, IRenameCardOrPage,
    ICardOrPageState, ICardSortRes, IAddCard, IMovePage
} from "@/api/home";
import { ITreeList, ICardList } from "@/types/home";
import { reactive, ref } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import Node from "element-plus/es/components/tree/src/model/node";
import { useRoute } from "vue-router";
interface State {
    subjectPublisherBookList: ITreeList[],
    subjectPublisherBookValue: string[],
    chaptersList: ITreeList[],
    chaptersValue: string,
    winList: ITreeList[],
    winValue: string[],
    windowCards: ICardList[],
    oldWindowCards: ICardList[], // 拖拽使用
}

export default () => {
    const route = useRoute();
    const defaultProps = ref({ children: "PageList", label: "Name", value: "ID" });
    const pageValue = ref({
        ID: "",
        Type: 11
    });
    const state = reactive<State>({
        subjectPublisherBookList: [],
        subjectPublisherBookValue: [],
        chaptersList: [],
        chaptersValue: "",
        winList: [],
        winValue: [],
        windowCards: [],
        oldWindowCards: []
    });

    const findFirstId = (tree: ITreeList[], ids: string[]) => {
        tree.forEach((item) => {
            ids.push(item.ID);
            if (item.Children && item.Children.length > 0) {
                findFirstId([item.Children[0]], ids);
            }
        });
        return ids;
    };

    const _getSubjectPublisherBookList = () => {
        getSubjectPublisherBookList().then(res => {
            if (res.resultCode === 200) {
                state.subjectPublisherBookList = res.result;
                state.subjectPublisherBookValue = findFirstId([state.subjectPublisherBookList[0]], []);
            }
        });
    };

    const _getChapters = (data: IGetChapters) => {
        getChapters(data).then(res => {
            if (res.resultCode === 200) {
                state.chaptersList = res.result || [];
                if (state.chaptersList.length > 0) {
                    state.chaptersValue = state.chaptersList[0].ID;
                } else {
                    state.chaptersValue = "";
                    state.winList = [];
                    state.winValue = [];
                    state.windowCards = [];
                }
            }
        });
    };

    const _getWinList = (curVal: string) => {
        const value: ITreeList | undefined = state.chaptersList.find(item => item.ID === curVal);
        if (value && Array.isArray(value.Children) && value.Children.length > 0) {
            state.winList = value.Children.map((item: any) => {
                if (!item.Children || item.Children.length === 0) {
                    item.disabled = true;
                }
                return item;
            });
        } else {
            state.winList = [];
        }
        state.windowCards = [];
    };

    const _getWindowCards = (data: IGetWindowCards) => {
        getWindowCard(data).then(res => {
            if (res.resultCode === 200) {
                state.windowCards = res.result;
                state.oldWindowCards = JSON.parse(JSON.stringify(res.result));
            }
        });
    };

    const _deleteCardOrPage = (data: IDelCardOrPage) => {
        ElMessageBox.confirm(
            "此操作将删除该数据, 是否继续?", "提示",
            {
                confirmButtonText: "确认",
                cancelButtonText: "取消",
                type: "warning"
            }
        ).then(() => {
            deleteCardOrPage(data).then(res => {
                if (res.resultCode === 200) {
                    ElMessage({ type: "success", message: "删除成功" });
                    _getWindowCards({ WindowID: `${route.params.winValue}` });
                }
            });
        }).catch((err) => {
            return err;
        });
    };

    const _addCard = (data: IAddCard) => {
        addCard(data).then(res => {
            if (res.resultCode === 200) {
                ElMessage({ type: "success", message: "新增卡成功" });
                _getWindowCards({ WindowID: `${route.params.winValue}` });
            }
        });
    };

    const _addPage = (data: IAddPage) => {
        addPage(data).then(res => {
            if (res.resultCode === 200) {
                ElMessage({ type: "success", message: "新增页成功" });
                _getWindowCards({ WindowID: `${route.params.winValue}` });
            }
        });
    };

    const _renameCardOrPage = (data: IRenameCardOrPage) => {
        renameCardOrPage(data).then(res => {
            if (res.resultCode === 200) {
                ElMessage({ type: "success", message: "更新名称成功" });
                _getWindowCards({ WindowID: `${route.params.winValue}` });
            }
        });
    };

    const _setCardOrPageState = (data: ICardOrPageState) => {
        setCardOrPageState(data).then(res => {
            if (res.resultCode === 200) {
                ElMessage({
                    type: "success",
                    message: data.State === 1 ? "上架成功" : "下架成功"
                });
                _getWindowCards({ WindowID: `${route.params.winValue}` });
            }
        });
    };

    const _updateCardSort = (data: ICardSortRes) => {
        updateCardSort(data).then(res => {
            if (res.resultCode === 200) {
                ElMessage({
                    type: "success",
                    message: "排序成功"
                });
                _getWindowCards({ WindowID: `${route.params.winValue}` });
            }
        });
    };
    const _movePage = (data: IMovePage) => {
        movePage(data).then(res => {
            if (res.resultCode === 200) {
                ElMessage({
                    type: "success",
                    message: "排序成功"
                });
                _getWindowCards({ WindowID: state.winValue[1] });
            }
        });
    };
    const dragDealData = (draggingNode: Node, dropNode: Node, ev: string) => {
        // 拖拽的目标元素不是自己本身
        if (draggingNode.data.ID !== dropNode.data.ID) {
            // 卡的拖拽
            if (draggingNode.data.PageList && dropNode.data.PageList) {
                const data = state.windowCards.map((card, index) => {
                    return {
                        Sort: index + 1,
                        TeachPageRelationID: card.TeachPageRelationID
                    };
                });
                _updateCardSort({ Sort: data });
            } else {
                const draggingCard = state.oldWindowCards.find(card => {
                    return card.PageList.find(page => page.ID === draggingNode.data.ID);
                });

                const dropCard = state.oldWindowCards.find(card => {
                    return card.PageList.find(page => page.ID === dropNode.data.ID);
                });
                // 同一个卡的 页拖拽
                if (draggingCard && dropCard && draggingCard.ID === dropCard.ID) {
                    const card = state.windowCards.find(card => {
                        return card.PageList.find(page => page.ID === dropNode.data.ID);
                    });
                    const data = card!.PageList.map((page, index) => {
                        return {
                            CardID: dropCard.ID,
                            Sort: index + 1,
                            TeachPageRelationID: page.TeachPageRelationID
                        };
                    });
                    _updateCardSort({ Sort: data });
                    // 不同卡的 页拖拽
                } else if (draggingCard && dropCard && draggingCard.ID !== dropCard.ID) {
                    const data = {
                        CardID: "",
                        Sort: 0,
                        TeachPageRelationID: ""
                    };
                    state.windowCards.forEach(card => {
                        card.PageList.forEach((page, index) => {
                            if (page.ID === draggingNode.data.ID) {
                                data.CardID = card.ID;
                                data.Sort = index + 1;
                                data.TeachPageRelationID = page.TeachPageRelationID;
                            }
                        });
                    });
                    _movePage(data);
                }
            }
        }
    };

    return {
        defaultProps,
        pageValue,
        state,
        findFirstId,
        dragDealData,
        _getSubjectPublisherBookList,
        _getChapters,
        _getWindowCards,
        _getWinList,
        _deleteCardOrPage,
        _addCard,
        _addPage,
        _renameCardOrPage,
        _setCardOrPageState
    };
};
