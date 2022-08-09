<template>
    <div class="box">
        <el-dialog v-model="visible" title="预览" width="80%" @close="close">
            <el-select v-model="styleType" @change="changeStyle" placeholder="请选择">
                <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                />
            </el-select>
            <div class="export-btn">
                <el-button type="primary" @click="handleExportWord">导出</el-button>
            </div>
            <div class="iframe-box">
                <iframe :src="url"></iframe>
            </div>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import { defineComponent, toRefs, reactive, watch, PropType } from "vue";
import { ElMessage } from "element-plus";
import { get, STORAGE_TYPES } from "@/utils/storage";
import { cooOss, getOssUrl } from "@/utils/oss";
import { ITemplateList, IFrom, ItemForm } from "@/types/lessonDesign.ts";
import { toChinesNum } from "@/utils/common";
export default defineComponent({
    name: "lessonPreview",
    props: {
        previewDialog: {
            type: Boolean,
            require: true
        },
        url: {
            type: String,
            default: () => ""
        },
        form: {
            type: Object as PropType<IFrom>,
            default: () => ({
                templateType: "",
                lessonBasicInfoList: []
            }),
            require: true
        }
    },
    emits: ["update:previewDialog"],

    setup(props, { emit }) {
        const state = reactive({
            visible: false,
            url: "",
            styleType: 1,
            options: [
                { name: "简约风", value: 1 },
                { name: "表格风", value: 2 }
            ]
        });

        watch(() => props.previewDialog, (val) => {
            state.visible = val;
            if (val) {
                preview();
            }
        });

        const transFormFileData = () => {
            console.log(props.form, "props.form---");
            const title = props.form.lessonBasicInfoList.find((item:ItemForm) => item.Name === "标题")!.Value;

            const list = props.form.lessonBasicInfoList.filter((item:ItemForm) => (!["标题", "教学过程", "教学反思"].includes(item.Name) && item.Status)).map((j:any) => {
                if (j.SelectType === 2) { // 多行单行文本
                    return {
                        title: j.Name,
                        contents: j.LessonPlanDetailOptions.map((i:any) => {
                            return { content: i.Value || "" };
                        })
                    };
                } else if (j.SelectType === 5) { // 多选框
                    return {
                        title: j.Name,
                        contents: j.LessonPlanDetailOptions.filter((i:any) => j.isSelectId.includes(i.ID)).map((v:any) => ({ content: v.Name || "" }))
                    };
                } else if (j.SelectType === 4 || j.SelectType === 6) { // 下拉、单选框
                    const selectValue = j.LessonPlanDetailOptions.find((i:any) => j.isSelectId === i.ID);
                    return {
                        title: j.Name,
                        contents: [{ content: selectValue.Name || "" }]
                    };
                } else {
                    return {
                        title: j.Name,
                        contents: [{ content: j.Value || "" }]
                    };
                }
            });

            const cardValue = props.form.lessonBasicInfoList.find((item:ItemForm) => item.Name === "教学过程");
            const cards = cardValue!.LessonPlanDetailPages.map((j:any, index:number) => {
                return {
                    title: "环节" + toChinesNum(index + 1) + "：" + j.Name,
                    pages: j.Childrens.map((i:any) => ({
                        title: i.Name,
                        processes: [{ process: i.AcademicPresupposition || "" }],
                        designs: [{ design: i.DesignIntent || "" }]
                    }))
                };
            });

            const list2Value = props.form.lessonBasicInfoList.find((item:any) => (item.Name === "教学反思" && item.Status)) || { Name: "", Value: "" };

            const fileData = {
                title: title,
                list: list,
                cards: cards,
                list2: [{
                    title: list2Value!.Name,
                    contents: [{ content: list2Value!.Value || "" }]
                }]
            };

            const fileName = `/${new Date().getTime()}_教案设计.docx`;

            return {
                fileData: fileData,
                fileName: fileName
            };
        };

        const changeStyle = () => {
            preview();
        };

        const preview = () => {
            const { fileData, fileName } = transFormFileData();
            const filePath = window.electron.getCachePath("");
            window.electron.exportWord(filePath + fileName || "", fileData, state.styleType);
            setTimeout(() => {
                (window as any).electron.readFile(filePath + fileName, async (buffer: ArrayBuffer) => {
                    const newFile = new File([buffer], fileName);
                    const ossPath = get(STORAGE_TYPES.OSS_PATHS)?.["ElementFile"];
                    const res = await cooOss(newFile, ossPath);
                    if (res?.code === 200) {
                        const urlImg = await getOssUrl(res.objectKey as string, get(STORAGE_TYPES.OSS_PATHS)?.["ElementFile"].Bucket);
                        state.url = "https://owa.lyx-edu.com/op/view.aspx?src=" + encodeURIComponent(urlImg);
                        window.electron.deleteFile(filePath + fileName);
                    }
                });
            }, 100);
        };

        const handleExportWord = () => {
            const { fileData, fileName } = transFormFileData();
            window.electron.showSaveDialog({
                defaultPath: fileName,
                filters: [
                    {
                        name: "doc文件",
                        extensions: ["doc"]
                    },
                    {
                        name: "docx文件",
                        extensions: ["docx"]
                    }
                ]
            }).then(({ filePath }) => {
                window.electron.exportWord(filePath || "", fileData, state.styleType);
                ElMessage.success("模板文件下载成功");
                window.electron.deleteFile(filePath + fileName);
            }).catch((err) => {
                console.log(err);
            });
        };
        const close = () => {
            state.url = "";
            state.styleType = 1;
            emit("update:previewDialog", false);
        };

        return {
            ...toRefs(state),
            handleExportWord,
            changeStyle,
            preview,
            close
        };
    }

});
</script>

<style scoped lang="scss">
.box{
    flex: 1;
    .export-btn{
        position: absolute;
        top: 20px;
        right: 80px;
    }
}
 .iframe-box{
     width: 100%;
     height: 100%;
     iframe{
         width: 100%;
         height: 100%;
     }
 }
</style>
