import { Slide } from "wincard";
import { cooOss } from "@/utils/oss";
import isElectron from "is-electron";
import { ElMessage } from "element-plus";
import { computed, ref, watch } from "vue";
import { createRandomCode } from "@/utils/common";
import { get, STORAGE_TYPES } from "@/utils/storage";
import { pageType } from "@/config";
import { v4 as uuidv4 } from "uuid";
import { PageProps } from "@/views/preparation/intelligenceClassroom/api/props";

interface Slides {
    size: {
        height: number,
        width: number
    },
    slides: Slide[],
}

export default () => {
    const showImport = ref(isElectron());
    const loading = ref(false);
    const pptPages = ref(0); // 上传ppt总的页数
    const parsePptPage = ref(0); // 解析完成的页数
    const percentage = computed(() => {
        return pptPages.value ? parseInt((parsePptPage.value / pptPages.value * 100).toString()) : 0;
    });

    watch(loading, (val) => {
        if (!val) {
            pptPages.value = 0;
            parsePptPage.value = 0;
        }
    });

    const properties = process.platform === "darwin" ? ["openFile", "openDirectory"] : ["openFile"];

    const importByElectron = (callback: (pages: PageProps[], name: string) => void) => {
        (window as any).electron.remote.dialog.showOpenDialog({
            title: "选择要导入的ppt",
            buttonLabel: "确定",
            filters: [{
                name: "ppt",
                extensions: ["pptx"] // ["ppt", "pptx"]
            }],
            properties: properties
        }).then(async (file: any) => {
            if (!file.canceled) {
                loading.value = true;
                const path = file.filePaths[0];
                const result = await (window as any).electron.parsePPT(path);
                pptPages.value = result.slides.length;
                const ppt = await dataParse(result);

                const name = path.replace(/(.*[/\\])*([^.]+).*/ig, "$2").split("\\");
                const pageList = ppt.slides.map((item, index) => {
                    return {
                        Sort: 0,
                        Url: "",
                        State: 1,
                        Width: 0,
                        Index: 0,
                        Height: 0,
                        Json: item,
                        Remark: "",
                        ID: uuidv4(),
                        ParentID: "",
                        DesignIntent: "",
                        Type: pageType.element,
                        TeachPageRelationID: "",
                        AcademicPresupposition: "",
                        Name: name[name.length - 1] + "-" + (index + 1)
                    };
                });
                loading.value = false;
                callback(pageList, name[name.length - 1]);
            }
        }).catch((err: any) => {
            loading.value = false;
            ElMessage({ type: "error", message: "导入失败" });
            if ((window as any).electron && (window as any).electron.log) {
                (window as any).electron.log.error(err);
            }
        });
    };

    const dataParse = async (pptResult: Slides) => {
        for (let i = 0; i < pptResult.slides.length; i++) {
            parsePptPage.value = i + 1;
            const background = pptResult.slides[i].background;
            if (background && background?.type === "image" && background.image) {
                background.image = await getOssPath(background.image);
            }
            for (const element of pptResult.slides[i].elements) {
                if (element.type === "image") {
                    element.src = await getOssPath(element.src);
                } else if (element.type === "audio") {
                    element.src = await getOssPath(element.src);
                    if (element.icon) element.icon = await getOssPath(element.icon);
                } else if (element.type === "video") {
                    element.src = await getOssPath(element.src);
                    if (element.poster) element.poster = await getOssPath(element.poster);
                }
            }
        }
        return pptResult;
    };

    const getOssPath = (path: string): Promise<string> => {
        return new Promise(resolve => {
            const filePath = window.electron.getPPTPath(path);
            window.electron.readFile(filePath, async (buffer: ArrayBuffer | string) => {
                if (typeof buffer === "string") {
                    ElMessage.error(buffer);
                    loading.value = false;
                    return;
                }
                const fileName = createRandomCode() + path.replace(/(.*[/\\])*([^.]+)/i, "$2");
                const newFile = new File([buffer], fileName);
                const filePath = await cooOss(newFile, get(STORAGE_TYPES.OSS_PATHS)?.["ElementFile"]);
                resolve(filePath?.objectKey || "");
            });
        });
    };

    return {
        importByElectron,
        loading,
        pptPages,
        parsePptPage,
        percentage,
        showImport
    };
};
