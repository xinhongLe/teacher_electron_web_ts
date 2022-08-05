<template>
    <div class="lesson-box">
        <el-dialog v-model="visible" title="教案设计" width="1100px" center @close="close">
            <div class="template-select">
                <el-select v-model="form.templateType" @change="changeTemplate" style="width: 100%" placeholder="请选择课型" size="small">
                    <el-option v-for="item in templateList" :key="item.ID" :label="item.Name" :value="item.ID"/>
                    <div @click="templateSet" style="cursor: pointer; padding: 10px 20px;border-top: 1px solid #EBEFF1">
                        <el-icon style="vertical-align: bottom;margin-right: 6px;"><Setting/></el-icon>
                        <span>设置</span>
                    </div>
                </el-select>
            </div>

            <div class="export-btn">
                <el-button type="primary" @click="handleExportWord">导出</el-button>
            </div>

            <div class="lesson-design-form" v-for="(item, i) in form.lessonBasicInfoList" :key="i">
                <div v-if="item.Status === 1">
                    <div class="lesson-design-label">
                        <span v-if="item.FieldType === 1">*</span>
                        {{item.Name}}
                    </div>
                    <div class="lesson-design-content" v-if="item.Name === '教学过程'">
                        <table class="lesson-design-table" border="1" v-for="(item, index) in item.LessonPlanDetailPages" :key="index">
                            <tr>
                                <td colspan="2">
                                    <div class="lesson-design-table-header">
                                        {{item.Name}}
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="lesson-design-table-title">教学过程</div>
                                </td>
                                <td>
                                    <div class="lesson-design-table-title">设计意图</div>
                                </td>
                            </tr>
                            <tr v-for="(content, i) in item.Childrens" :key="i">
                                <td>
                                    <div class="lesson-design-table-content grey">
                                        <el-input type="textarea" placeholder="点击输入教学回顾" v-model="content.AcademicPresupposition"></el-input>
                                    </div>
                                </td>
                                <td>
                                    <div class="lesson-design-table-content">
                                        <el-input type="textarea" placeholder="点击输入设计意图" v-model="content.DesignIntent"></el-input>
                                    </div>
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div class="lesson-design-content" v-else>
                        <el-input v-if="item.SelectType === 0 || item.SelectType === 1" :disabled="item.SelectType === 1 ? true : false" placeholder="请输入" v-model="item.Value" size="small"></el-input>
                        <draggable v-if="item.SelectType === 2" v-model="item.LessonPlanDetailOptions" :animation="300"  @start="drag = true" @end="drag = false" itemKey="index">
                            <template #item="{element, index}">
                                <div class="sort-input">
                                    <img class="drag" src="@/assets/indexImages/icon_yidong@2x.png" alt="">
                                    <el-input v-model="element.Value" placeholder="请输入" size="small"></el-input>
                                    <img class="option-btn" src="@/assets/indexImages/icon_add@2x.png" alt="" @click="addTarget(index, item)" />
                                    <img class="option-btn" src="@/assets/indexImages/icon_del@2x.png" v-if="item.LessonPlanDetailOptions.length > 1" alt="" @click="reduceTarget(index, item)" />
                                </div>
                            </template>
                        </draggable>
                        <el-input v-if="item.SelectType === 3" type="textarea" v-model="item.Value" placeholder="请输入" size="small"></el-input>
                        <el-select v-if="item.SelectType === 4" v-model="item.isSelectId" style="width: 100%" placeholder="请选择" size="small">
                            <el-option v-for="item in item.LessonPlanDetailOptions" :key="item.ID" :label="item.Name" :value="item.ID"/>
                        </el-select>

                        <el-checkbox-group  v-if="item.SelectType === 5" v-model="item.isSelectId">
                            <el-checkbox v-for="i in item.LessonPlanDetailOptions" :key="i.ID" :label="i.ID">{{i.Name}}</el-checkbox>
                        </el-checkbox-group>

                        <el-radio-group v-if="item.SelectType === 6" v-model="item.isSelectId">
                            <el-radio v-for="i in item.LessonPlanDetailOptions" :key="i.ID" :label="i.ID">{{i.Name}}</el-radio>
                        </el-radio-group>

                        <el-date-picker v-if="item.SelectType === 7" v-model="item.Value" type="date" placeholder="请选择" format="YYYY-MM-DD" value-format="YYYY-MM-DD"/>

                        <el-date-picker v-if="item.SelectType === 8" v-model="item.Value" type="datetime" placeholder="请选择" format="YYYY-MM-DD hh:mm" value-format="YYYY-MM-DD h:m"/>
                    </div>
                </div>
            </div>

            <template #footer>
                <div class="lesson-design-footer">
                    <el-button type="primary" plain size="small" @click="preview()">预览</el-button>
                    <el-button type="primary" size="small" @click="save()">完成</el-button>
                </div>
            </template>
        </el-dialog>

        <lesson-template-set v-model:dialogVisible="dialogVisible" @updateLessonPlanTemplateList="_getLessonPlanTemplate" :templateList="templateList"></lesson-template-set>

        <lesson-preview v-model:previewDialog="previewDialog" :url="url"></lesson-preview>
    </div>
</template>

<script lang="ts">
import { getLessonPlan, getLessonPlanTemplate, changeLessonPlanTemplate, ISaveLessonPlan, saveLessonPlan } from "@/api/home";
import { ElMessage } from "element-plus";
import { defineComponent, reactive, ref, watch } from "vue";
import draggable from "vuedraggable";
import { Setting } from "@element-plus/icons";
import LessonTemplateSet from "@/views/preparation/intelligenceClassroom/components/edit/lessonTemplateSet.vue";
import { get, STORAGE_TYPES } from "@/utils/storage";
import { ITemplateList, IFrom, ItemForm } from "@/types/lessonDesign.ts";
import { cooOss, getOssUrl } from "@/utils/oss";
import LessonPreview from "@/views/preparation/intelligenceClassroom/components/edit/lessonPreview.vue";
export default defineComponent({
    components: { LessonPreview, LessonTemplateSet, draggable, Setting },
    props: {
        lessonDesignVisible: {
            type: Boolean,
            required: true
        },
        winId: {
            type: String,
            required: true
        }
    },
    setup(props, { emit }) {
        const visible = ref(props.lessonDesignVisible);
        const classTypeList = ref<{label: string; value: string;}[]>([]);
        const templateList = ref<ITemplateList[]>([]);
        const saveData: ISaveLessonPlan = {
            ID: "",
            Name: "",
            Sort: 0,
            Status: 0,
            LessonPlanDetails: []
        };
        watch(() => props.lessonDesignVisible, async () => {
            visible.value = props.lessonDesignVisible;
            if (visible.value) {
                await _getLessonPlanTemplate();
                await _getLessonPlan();
            }
        }
        );

        const form = reactive<IFrom>({
            templateType: "",
            lessonBasicInfoList: []
        });

        const changeTemplate = async (val:string) => {
            await _changeLessonPlanTemplate(val);
            await _getLessonPlan();
        };

        const close = () => {
            emit("update:lessonDesignVisible", false);
        };

        const addTarget = (index: number, item:any) => {
            item.LessonPlanDetailOptions.splice(index + 1, 0, { ID: "", Value: "" });
        };

        const reduceTarget = (index: number, item:any) => {
            item.LessonPlanDetailOptions.splice(index, 1);
        };

        const transFormFileData = () => {
            const title = form.lessonBasicInfoList.find((item:any) => item.Name === "标题")!.Value;

            const list = form.lessonBasicInfoList.filter((item:any) => (!["标题", "教学过程", "教学反思"].includes(item.Name) && item.Status)).map((j:any) => {
                return {
                    title: j.Name,
                    contents: [{ content: j.Value || "" }]
                };
            });

            const cardValue = form.lessonBasicInfoList.find((item:any) => item.Name === "教学过程");
            const cards = cardValue!.LessonPlanDetailPages.map((j:any) => {
                return {
                    title: j.Name,
                    pages: j.Childrens.map((i:any) => ({
                        title: i.Name,
                        processes: [{ process: i.AcademicPresupposition || "" }],
                        designs: [{ design: i.DesignIntent || "" }]
                    }))
                };
            });

            const list2Value = form.lessonBasicInfoList.find((item:any) => (item.Name === "教学反思" && item.Status)) || { Name: "", Value: "" };

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
                window.electron.exportWord(filePath || "", fileData);
                ElMessage.success("模板文件下载成功");
            });
        };

        const save = () => {
            saveData.LessonPlanDetails = form.lessonBasicInfoList.map((item:any) => {
                if (item.SelectType === 2) {
                    item.LessonPlanDetailOptions.forEach((i:any, index:number) => {
                        i.Sort = index;
                    });
                } else if (item.SelectType === 4 || item.SelectType === 6) {
                    item.LessonPlanDetailOptions.forEach((i:any) => {
                        i.ID === item.isSelectId ? i.IsSelect = 1 : i.IsSelect = 0;
                    });
                } else if (item.SelectType === 5) {
                    item.LessonPlanDetailOptions.forEach((i:any) => {
                        (item.isSelectId.includes(i.ID)) ? i.IsSelect = 1 : i.IsSelect = 0;
                    });
                }

                return item;
            });

            saveLessonPlan(saveData).then(res => {
                if (res.success) {
                    ElMessage.success("教案设计修改成功！");
                    close();
                }
            });
        };

        const url = ref();
        const previewDialog = ref(false);
        const preview = () => {
            const { fileData, fileName } = transFormFileData();
            const filePath = window.electron.getCachePath("");
            window.electron.exportWord(filePath + fileName || "", fileData);
            setTimeout(() => {
                (window as any).electron.readFile(filePath + fileName, async (buffer: ArrayBuffer) => {
                    const newFile = new File([buffer], fileName);
                    const ossPath = get(STORAGE_TYPES.OSS_PATHS)?.["ElementFile"];
                    const res = await cooOss(newFile, ossPath);
                    if (res?.code === 200) {
                        const urlImg = await getOssUrl(res.objectKey as string, get(STORAGE_TYPES.OSS_PATHS)?.["ElementFile"].Bucket);
                        url.value = "https://owa.lyx-edu.com/op/view.aspx?src=" + encodeURIComponent(urlImg);
                        previewDialog.value = true;
                        console.log("-----111")
                    }
                });
            }, 100);
        };

        const dialogVisible = ref(false);
        const templateSet = () => {
            dialogVisible.value = true;
        };

        const _changeLessonPlanTemplate = (val:string) => {
            const data = {
                TeachPageID: props.winId,
                LessonPlanTemplateMainID: val
            };
            return changeLessonPlanTemplate(data).then(res => {
                if (res.resultCode === 200) {
                    form.templateType = val;
                }
            });
        };

        const _getLessonPlan = () => {
            return getLessonPlan({ TeachPageID: props.winId }).then(res => {
                const infoList:ItemForm[] = res.result.LessonPlanDetails.map((item:ItemForm) => {
                    if (item.SelectType === 2 && item.LessonPlanDetailOptions.length === 0) {
                        item.LessonPlanDetailOptions = [{ ID: "", Value: "" }];
                    } else if (item.SelectType === 4 || item.SelectType === 6) {
                        const selectValue = item.LessonPlanDetailOptions.find((item:any) => item.IsSelect === 1);
                        item.isSelectId = selectValue ? selectValue.ID : "";
                    } else if (item.SelectType === 5) {
                        const selectValue = item.LessonPlanDetailOptions.filter((item:any) => item.IsSelect);
                        item.isSelectId = selectValue.map((i:any) => i.ID);
                    }
                    return item;
                });

                form.lessonBasicInfoList = infoList;
                console.log(infoList, "infoList----");

                saveData.ID = res.result.ID;
                saveData.Name = res.result.Name;
                saveData.Sort = res.result.Sort;
                saveData.Status = res.result.Status;

                form.templateType = res.result.LessonPlanTemplateMainID;
            });
        };

        const _getLessonPlanTemplate = () => {
            return getLessonPlanTemplate().then(res => {
                if (res.resultCode === 200) {
                    templateList.value = res.result || [];
                }
            });
        };

        return {
            visible,
            form,
            url,
            previewDialog,
            templateList,
            classTypeList,
            dialogVisible,
            // exportWord,
            handleExportWord,
            _getLessonPlanTemplate,
            changeTemplate,
            templateSet,
            close,
            addTarget,
            reduceTarget,
            save,
            preview
        };
    }
});
</script>

<style lang="scss" scoped>
.lesson-box{
    :deep(.el-dialog__body){
        height: 750px !important;
        overflow-y: auto !important;
    }
}

.template-select{
    width: 200px;
    position: absolute;
    top: 20px;
    .template-set{
        padding: 10px 20px;
        border-top: 1px solid #EBEFF1;
    }
}

.export-btn{
    position: absolute;
    top: 20px;
    right: 80px;
}

.lesson-design-form {
    margin-bottom: 24px;
    .lesson-design-label {
        color: #212121;
        font-size: 15px;
        font-weight: bold;
        margin-bottom: 12px;
        span {
            color: red;
        }
    }

    .sort-input {
        display: flex;
        align-items: center;
        margin-bottom: 12px;
        &:last-child {
            margin-bottom: 0;
        }
        .drag {
            width: 12px;
            height: 12px;
            display: block;
            -webkit-user-drag: none;
            cursor: pointer;
            margin-right: 12px;
            margin-left: 6px;
        }
        .option-btn {
            width: 18px;
            height: 18px;
            display: block;
            -webkit-user-drag: none;
            cursor: pointer;
            margin-left: 12px;
        }
    }

    .lesson-design-table {
        width: 100%;
        margin-bottom: 12px;
        .lesson-design-table-header {
            padding: 12px 24px;
            height: 46px;
            color: #2E95FF;
            font-size: 14px;
            font-weight: 600;
            display: flex;
            align-items: center;
            background: #F6F7F8;
        }

        .lesson-design-table-title {
            padding: 10px 24px;
            color: #212121;
            height: 40px;
            display: flex;
            align-items: center;
            font-size: 12px;
        }

        .lesson-design-table-content {
            height: 248px;
            padding: 24px;
            font-size: 12px;
            color: #212121;
            .grey {
                color: rgba(33, 33, 33, .79);
            }
            ::v-deep(.el-textarea) {
                height: 100%;
            }
            ::v-deep(.el-textarea__inner) {
                border: 0;
                resize: none;
                height: 100%;
            }
        }
    }

    .lesson-design-table, td {
        border: 1px solid #EBEFF1;
    }
}

.lesson-design-footer {
    display: flex;
    justify-content: flex-end;
    border-top: 1px solid #EBEFF1;
    padding-top: 20px;
    ::v-deep(.el-button) {
        width: 120px;
    }
}

.lesson-design-flex {
    display: flex;
    .lesson-design-form {
        flex: 1;
        margin-right: 24px;
        &:last-child {
            margin-right: 0;
        }
    }
}
</style>
