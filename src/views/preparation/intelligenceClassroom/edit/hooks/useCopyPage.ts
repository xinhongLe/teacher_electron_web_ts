import { ICardList, IPageValue } from "@/types/home";
import { ElMessage } from "element-plus";
import Node from "element-plus/es/components/tree/src/model/node";
import { Ref, ref } from "vue";
import { v4 as uuidv4 } from "uuid";
import { findIndex } from "lodash";
import TrackService, { EnumTrackEventType } from "@/utils/common";
import { Slide } from "wincard";
import { copyPage } from "@/api/home";
import { useStore } from "@/store";
import { get, set, STORAGE_TYPES } from "@/utils/storage";
export default (
    windowCards: Ref<ICardList[]>,
    allPageSlideListMap: Ref<Map<string, Slide>>
) => {
    let copyValue: IPageValue;
    const pastePage = ref<IPageValue>();
    let count = 0;
    let copyPageId = "";
    const handleCopy = (node: Node, data: IPageValue) => {
        copyValue = { ...data, OldCardID: node.parent.data.ID };
        set(STORAGE_TYPES.WIN_COPY_VALUE, copyValue);
        if (copyValue) {
            ElMessage({ type: "success", message: "复制页成功" });
        }
    };
    const store = useStore();

    const handlePaste = (data: ICardList) => {
        const winCopyValue: any = get(STORAGE_TYPES.WIN_COPY_VALUE);
        if (winCopyValue) {
            copyValue = winCopyValue;
        }
        if (copyValue) {
            let str = "(新)";
            if (copyValue.ID === copyPageId) {
                count += 1;
                for (let i = 0; i < count; i++) {
                    str = str + "(新)";
                }
            } else {
                count = 0;
                copyPageId = copyValue.ID;
            }

            const value = {
                OldCardID: copyValue.OldCardID as string,
                CardID: data.ID,
                PageID: copyValue.ID,
                Name: copyValue.Name as string,
            };
            copyPage(value).then((res) => {
                if (res.resultCode === 200) {
                    const cardIndex = findIndex(windowCards.value, {
                        ID: data.ID,
                    });
                    const slide = allPageSlideListMap.value.get(copyValue.ID);
                    pastePage.value = {
                        ...copyValue,
                        // isAdd: true,
                        isAdd: false,
                        ID: res.result.ID,
                        AcademicPresupposition: res.result
                            .AcademicPresupposition
                            ? res.result.AcademicPresupposition
                            : slide?.remark,
                        DesignIntent: res.result.DesignIntent
                            ? res.result.DesignIntent
                            : slide?.design,
                        Name: copyValue.Name + str,
                    };
                    slide &&
                        allPageSlideListMap.value.set(pastePage.value.ID, {
                            ...slide,
                            id: pastePage.value.ID,
                        });
                    windowCards.value[cardIndex].PageList.push(pastePage.value);
                    windowCards.value = [...windowCards.value];
                    TrackService.setTrack(
                        EnumTrackEventType.PastePage,
                        "",
                        "",
                        "",
                        "",
                        "",
                        "",
                        "粘贴卡",
                        "",
                        "",
                        store.state.userInfo.schoolId
                    );
                }
            });
        } else {
            ElMessage({ type: "warning", message: "请先复制页" });
        }
    };

    return {
        handleCopy,
        pastePage,
        handlePaste,
    };
};
