import { ref } from "vue-demi";
import { ElMessage } from "element-plus";
import { getPageDetailRes } from "../api/index";
export default () => {
    interface getPageDataType {
        pageID: string,
        type: number,
        originType: 1
    }
    const transformType = (type: number | string) => {
        switch (type) {
        case 11:
        case "element": return 0;
        case 12:
        case "listen":
            return 1;
        case 13:
        case "follow":
            return 2;
        case 16:
        case "teach":
            return 3;
        default:
            return -1;
        }
    };
    const hasCheck = ref(false);
    const selected = ref(0);
    const getPageData = async (obj: getPageDataType) => {
        const elements = ref([]);
        const steps = ref([]);
        const events = ref([]);
        const pageSetting = ref({
            width: 1280,
            height: 720
        });
        const type: number = transformType(obj.type);
        if (type < 0) {
            ElMessage({ type: "warning", message: "暂不支持该页面类型" });
            return {};
        }
        const res = await getPageDetailRes(obj, type);
        if (res.resultCode === 200 && res.result.Json) {
            if (obj.type === 11) {
                /** 素材页 */
                const result = JSON.parse(res.result.Json);
                const arr = result.Elements.map(item => JSON.parse(item));
                console.log(arr, "Element");
                if (result.Events) {
                    events.value = result.Events.map(item => {
                        const value = JSON.parse(item);
                        if (value.CustomActions && Array.isArray(value.CustomActions)) {
                            value.CustomActions.map(j => {
                                j.ActionData = JSON.parse(j.ActionData);
                                return j;
                            });
                        }
                        return value;
                    });
                }
                elements.value = result.Elements.map(item => {
                    const element = JSON.parse(item);
                    const result = {
                        id: element.UUID,
                        type: element.Type,
                        name: element.Name,
                        value: element.OssFileName ? element.OssFileName : element.Text ? element.Text : element.FileID ? element.FileID : ""
                        // funs: events.find(item => item.SourceID === element.UUID)
                    };
                    result.dragStyle = {
                        width: element.Width,
                        height: element.Height,
                        left: element.Left,
                        top: element.Top,
                        zIndex: element.ZIndex,
                        fontFamily: element.FontFamily,
                        fontSize: element.FontSize,
                        color: element.Foreground ? hexToRgba(element.Foreground) : "",
                        textAlign: element.HorizontalAlignment === 0 ? "left" : element.HorizontalAlignment === 1 ? "center" : "right",
                        borderColor: element.LineBrush ? hexToRgba(element.LineBrush) : "",
                        deg: element.Angle,
                        thick: element.LineWidth,
                        borderStyle: element.LineType === 1 ? "solid" : "dashed",
                        radius: element.CornerRadius,
                        backgroundColor: element.Background ? hexToRgba(element.Background) : "",
                        display: element.IsVisibility
                    };
                    return result;
                });
                steps.value = result.Steps.map(item => {
                    return JSON.parse(item);
                });
                const page = JSON.parse(result.PageSetting || "{}");
                // const OssPathes = JSON.parse(localStorage.getItem("OssPathes")).ElementFile;
                // let bgImg = page.OssFileName ? await Vue.prototype.Oss.window_card_downloadFile(page.OssFileName, OssPathes.Bucket) : '';
                pageSetting.value = {
                    backgroundColor: page.BackColor ? hexToRgba(page.BackColor) : "",
                    width: page.Width || 1280,
                    height: page.Height || 720,
                    // bgImg: bgImg,
                    ossFileName: page.OssFileName || ""
                };
            }
        }
        return {
            steps,
            elements,
            pageSetting
        };
    };
    const hexToRgba = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return `rgba(${parseInt(result[2], 16)},${parseInt(result[3], 16)},${parseInt(result[4], 16)},${(parseInt(result[1], 16) / 255).toFixed(2)})`;
    };
    return {
        selected,
        hasCheck,
        getPageData
    };
};
