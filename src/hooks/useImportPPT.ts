import { cooOss } from "@/utils/oss";
import { Slide } from "wincard";
import { computed, ref, watch } from "vue";
import { ElMessage } from "element-plus";
import isElectron from "is-electron";
import { createRandomCode } from "@/utils/common";
import { get, STORAGE_TYPES } from "@/utils/storage";

interface Slides {
    size: {
        height: number,
        width: number
    },
    slides: Slide[],
}

export default () => {
    const showImport = ref(isElectron());
    const uploadFileName: any = ref("");
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

    const importByElectron = (callback: (slides: Slides) => void) => {
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
                uploadFileName.value = path.replace(/(.*[\/\\])*([^.]+).*/ig, "$2");
                const result = await (window as any).electron.parsePPT(path);
                pptPages.value = result.slides.length;
                const ppt = await dataParse(result);
                loading.value = false;
                callback(ppt);
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
            (window as any).electron.readFile(filePath, async (buffer: ArrayBuffer) => {
                const fileName = createRandomCode() + path.replace(/(.*[\/\\])*([^.]+)/i, "$2");
                const newFile = new File([buffer], fileName);
                const filePath = await cooOss(newFile, get(STORAGE_TYPES.OSS_PATHS)?.["ElementFile"]);
                resolve(filePath?.objectKey || "");
            });
        });
    };

    return {
        importByElectron,
        uploadFileName,
        loading,
        pptPages,
        parsePptPage,
        percentage,
        showImport
    };
};
