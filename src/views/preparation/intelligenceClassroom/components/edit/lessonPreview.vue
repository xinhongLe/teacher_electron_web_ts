<template>
    <div>
        <el-dialog class="custom-dialog resource1-dialog" v-model="visible"  width="1100px" @close="close">
            <div class="header">
                <el-select popper-class="lesson-preview-select" v-model="styleType"  @change="changeStyle" placeholder="请选择">
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
            </div>
            <div class="iframe-box">
                <div class="iframe-top"></div>
                <iframe :src="url"></iframe>
            </div>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive, toRefs, watch } from "vue";
import { ElMessage } from "element-plus";
import { get, STORAGE_TYPES } from "@/utils/storage";
import { cooOss, getOssUrl } from "@/utils/oss";
import { IFrom, ItemForm } from "@/types/lessonDesign.ts";
import { toChinesNum } from "@/utils/common";

export default defineComponent({
    name: "lessonPreview",
    props: {
        previewDialog: {
            type: Boolean,
            require: true
        },
        wordName: {
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
            styleType: 2,
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

        const transFormFileItemData = (j:ItemForm) => {
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
                    contents: selectValue ? [{ content: selectValue.Name || "" }] : []
                };
            } else {
                return {
                    title: j.Name,
                    contents: [{ content: j.Value || "" }]
                };
            }
        };

        const transFormFileData = () => {
            const title = props.form.lessonBasicInfoList.find((item:ItemForm) => item.Name === "标题")!.Value;

            const newData = props.form.lessonBasicInfoList.filter((item:ItemForm) => (item.Name !== "标题" && item.Status));
            const index = newData.findIndex((item:ItemForm) => item.Name === "教学过程");
            const firstList = newData.splice(0, index);
            const endList = newData.splice(1, newData.length - 1);

            const list = firstList.map((j:any) => {
                return transFormFileItemData(j);
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

            const list2 = endList.map((j:any) => {
                const item = transFormFileItemData(j);
                return item;
            });
            const fileData = {
                title: title,
                list: list,
                cards: cards,
                list2: list2
            };

            const fileName = `${props.wordName}_教案设计_${new Date().getTime()}.docx`;

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
                ElMessage.success("教案下载成功");
                window.electron.deleteFile(filePath + fileName);
            }).catch((err) => {
                console.log(err);
            });
        };
        const close = () => {
            state.url = "";
            state.styleType = 2;
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
:deep(.resource1-dialog) {
    .el-dialog__header{
        padding: 40px;
        border-bottom: none;
    }
    .el-dialog__body{
        background-color: #fff !important;
        height: 100%;
    }
    .el-dialog__headerbtn{
        top:30px;
        z-index: 2;
    }
    --el-dialog-margin-top: 5vh;
    height: 90vh;
    display: flex;
    flex-direction: column;
    min-height: 0;
}
.header{
    position: absolute;
    display: flex;
    top: 20px;
    justify-content: space-between;
    width: calc(100% - 40px);
    background-color: #fff;
}
.export-btn{
    margin-right: 60px;
}
 .iframe-box{
     position: relative;
     width: calc(100% - 70px);
     height: calc(100% - 40px) !important;
     margin: 0 auto;
     box-shadow: 0px 6px 14px 6px rgba(0,0,0,0.04);
     .iframe-top{
         width: 100%;
         position: absolute;
         height: 52px;
         background-color: #fff;
     }
     iframe{
         width: 100%;
         height: 100%;
     }
 }
</style>
