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
import { parsePPTX } from "@/api/parsePPT";

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

    const importByElectron = async (file: any, callback: (pages: PageProps[], name: string) => void) => {
        if (!file.canceled) {
            loading.value = true;
            const path = file.raw.name;
            const res = await parsePPTX(file.raw);
            if (res.success === false) {
                loading.value = false;
                return ElMessage({
                    message: res.msg,
                    type: "error"
                });
            }
            const result = res.result;
            pptPages.value = result.slides.length;
            // const ppt = await dataParse(result);

            const name = path.replace(/(.*[/\\])*([^.]+).*/ig, "$2").split("\\");
            const pageList: any = (result.slides as Slides[]).map((item, index) => {
                return {
                    Sort: 0,
                    Url: "",
                    State: 1,
                    Width: 0,
                    Index: 0,
                    Height: 0,
                    Json: item,
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
            ElMessage({ type: "success", message: "导入成功" });
        }
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
