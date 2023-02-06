<template>
    <div>
        <el-dialog
            class="custom-dialog resource1-dialog"
            v-model="visible"
            title="教案设计"
            width="1100px"
            center
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :before-close="close"
        >
            <div class="template-select">
                <el-select
                    v-model="form.templateType"
                    @change="changeTemplate"
                    style="width: 100%"
                    placeholder="请选择课型"
                    size="small"
                >
                    <el-option
                        v-for="item in templateList"
                        :key="item.ID"
                        :label="item.Name"
                        :value="item.ID"
                    />
                    <div
                        v-if="showSetBtn"
                        @click="templateSet"
                        style="
                            cursor: pointer;
                            padding: 10px 20px;
                            border-top: 1px solid #ebeff1;
                            display: flex;
                            align-items: center;
                        "
                    >
                        <el-icon
                            style="vertical-align: bottom; margin-right: 6px"
                            ><Setting
                        /></el-icon>
                        <span>设置</span>
                    </div>
                </el-select>
            </div>

            <div
                class="lesson-design-form"
                v-for="(item, i) in form.lessonBasicInfoList"
                :key="i"
            >
                <div v-if="item.Status === 1">
                    <div class="lesson-design-label">
                        <span v-if="item.FieldType === 1">*</span>
                        {{ item.Name }}
                    </div>
                    <div
                        class="lesson-design-content"
                        v-if="item.Name === '教学过程'"
                    >
                        <table
                            class="lesson-design-table"
                            border="1"
                            v-for="(item, index) in item.LessonPlanDetailPages"
                            :key="index"
                        >
                            <tr>
                                <td colspan="3">
                                    <div class="lesson-design-table-header">
                                        {{
                                            "环节" +
                                            toChinesNum(index + 1) +
                                            "：" +
                                            item.Name
                                        }}
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="lesson-design-table-title">
                                        步骤
                                    </div>
                                </td>
                                <td>
                                    <div class="lesson-design-table-title">
                                        教学过程
                                    </div>
                                </td>
                                <td>
                                    <div class="lesson-design-table-title">
                                        设计意图
                                    </div>
                                </td>
                            </tr>
                            <tr v-for="(content, i) in item.Childrens" :key="i">
                                <td class="lesson-page-title-box">
                                    <div class="lesson-page-title">
                                        {{ content.Name }}
                                    </div>
                                </td>
                                <td>
                                    <div
                                        class="lesson-design-table-content grey"
                                    >
                                        <el-input
                                            type="textarea"
                                            placeholder="点击输入教学回顾"
                                            maxlength="2000"
                                            show-word-limit
                                            resize="none"
                                            autosize
                                            @input="textareaInput"
                                            v-model="
                                                content.AcademicPresupposition
                                            "
                                        ></el-input>
                                    </div>
                                </td>
                                <td>
                                    <div class="lesson-design-table-content">
                                        <el-input
                                            type="textarea"
                                            placeholder="点击输入设计意图"
                                            maxlength="2000"
                                            show-word-limit
                                            resize="none"
                                            autosize
                                            @input="textareaInput"
                                            v-model="content.DesignIntent"
                                        ></el-input>
                                    </div>
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div class="lesson-design-content" v-else>
                        <el-input
                            v-if="
                                item.SelectType === 0 || item.SelectType === 1
                            "
                            maxlength="100"
                            show-word-limit
                            @input="textareaInput"
                            :disabled="item.SelectType === 1 ? true : false"
                            placeholder="请输入"
                            v-model="item.Value"
                            size="small"
                        ></el-input>
                        <draggable
                            v-if="item.SelectType === 2"
                            @end="textareaInput"
                            v-model="item.LessonPlanDetailOptions"
                            :animation="300"
                            @start="drag = true"
                            itemKey="index"
                        >
                            <template #item="{ element, index }">
                                <div class="sort-input">
                                    <img
                                        class="drag"
                                        src="@/assets/indexImages/icon_yidong@2x.png"
                                        alt=""
                                    />
                                    <el-input
                                        v-model="element.Value"
                                        placeholder="请输入"
                                        class="textarea-right"
                                        resize="none"
                                        type="textarea"
                                        maxlength="500"
                                        show-word-limit
                                        autosize
                                        @input="textareaInput"
                                        size="small"
                                    ></el-input>
                                    <img
                                        class="option-btn"
                                        src="@/assets/indexImages/icon_add@2x.png"
                                        alt=""
                                        @click="addTarget(index, item)"
                                    />
                                    <img
                                        class="option-btn"
                                        src="@/assets/indexImages/icon_del@2x.png"
                                        v-if="
                                            item.LessonPlanDetailOptions
                                                .length > 1
                                        "
                                        alt=""
                                        @click="reduceTarget(index, item)"
                                    />
                                </div>
                            </template>
                        </draggable>
                        <el-input
                            v-if="item.SelectType === 3"
                            class="textarea-right"
                            type="textarea"
                            resize="none"
                            maxlength="2000"
                            show-word-limit
                            autosize
                            @input="textareaInput"
                            v-model="item.Value"
                            placeholder="请输入"
                            size="small"
                        ></el-input>
                        <el-select
                            v-if="item.SelectType === 4"
                            v-model="item.isSelectId"
                            @changge="textareaInput"
                            style="width: 100%"
                            placeholder="请选择"
                            size="small"
                        >
                            <el-option
                                v-for="item in item.LessonPlanDetailOptions"
                                :key="item.ID"
                                :label="item.Name"
                                :value="item.ID"
                            />
                        </el-select>

                        <el-checkbox-group
                            v-if="item.SelectType === 5"
                            v-model="item.isSelectId"
                            @changge="textareaInput"
                        >
                            <el-checkbox
                                v-for="i in item.LessonPlanDetailOptions"
                                :key="i.ID"
                                :label="i.ID"
                                >{{ i.Name }}</el-checkbox
                            >
                        </el-checkbox-group>

                        <el-radio-group
                            v-if="item.SelectType === 6"
                            v-model="item.isSelectId"
                            @changge="textareaInput"
                        >
                            <el-radio
                                v-for="i in item.LessonPlanDetailOptions"
                                :key="i.ID"
                                :label="i.ID"
                                >{{ i.Name }}</el-radio
                            >
                        </el-radio-group>

                        <el-date-picker
                            v-if="item.SelectType === 7"
                            @changge="textareaInput"
                            v-model="item.Value"
                            type="date"
                            placeholder="请选择"
                            format="YYYY-MM-DD"
                            value-format="YYYY-MM-DD"
                        />

                        <el-date-picker
                            v-if="item.SelectType === 8"
                            @changge="textareaInput"
                            v-model="item.Value"
                            type="datetime"
                            placeholder="请选择"
                            format="YYYY-MM-DD HH:mm:ss"
                            value-format="YYYY-MM-DD HH:mm:ss"
                        />
                    </div>
                </div>
            </div>

            <template #footer>
                <div class="lesson-design-footer">
                    <el-button
                        type="primary"
                        plain
                        size="small"
                        @click="preview()"
                        >预览</el-button
                    >
                    <el-button type="primary" size="small" @click="save()"
                        >完成</el-button
                    >
                </div>
            </template>
        </el-dialog>

        <el-dialog
            class="custom-dialog tip-dialog"
            v-model="tipVisible"
            title="提示"
            center
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            @close="tipVisible = false"
        >
            <div class="tip-content">
                <img src="@/assets/indexImages/tip.png" alt="" />
                <div class="tip-title">是否保存本页面的修改？</div>
                <div class="tip-btns">
                    <el-button @click="closeTip()">不保存</el-button>
                    <el-button type="primary" @click="save()">保存</el-button>
                </div>
            </div>
        </el-dialog>

        <lesson-template-set
            v-model:dialogVisible="dialogVisible"
            @updateLessonPlanTemplateList="updateLessonPlanTemplateList"
            :templateList="templateList"
        ></lesson-template-set>

        <lesson-preview
            v-model:previewDialog="previewDialog"
            :wordName="saveData.TeachPageName"
            :form="form"
        ></lesson-preview>
    </div>
</template>

<script lang="ts">
import {
    getLessonPlan,
    getLessonPlanTemplate,
    changeLessonPlanTemplate,
    ISaveLessonPlan,
    saveLessonPlan,
} from "@/api/home";
import { ElMessage } from "element-plus";
import { defineComponent, reactive, ref, watch } from "vue";
import draggable from "vuedraggable";
import { Setting } from "@element-plus/icons-vue";
import { toChinesNum } from "@/utils/common";
import LessonTemplateSet from "@/views/preparation/intelligenceClassroom/components/edit/lessonTemplateSet.vue";
import { ITemplateList, IFrom, ItemForm } from "@/types/lessonDesign.ts";
import LessonPreview from "@/views/preparation/intelligenceClassroom/components/edit/lessonPreview.vue";
import { store } from "@/store";
import { IYunInfo } from "@/types/login";
import { get, STORAGE_TYPES } from "@/utils/storage";
export default defineComponent({
    components: { LessonPreview, LessonTemplateSet, draggable, Setting },
    props: {
        lessonDesignVisible: {
            type: Boolean,
            required: true,
        },
        winId: {
            type: String,
            required: true,
        },
    },
    emits: ["update:lessonDesignVisible", "updateLesson"],
    setup(props, { emit }) {
        const visible = ref(props.lessonDesignVisible);
        const classTypeList = ref<{ label: string; value: string }[]>([]);
        const templateList = ref<ITemplateList[]>([]);
        const winUserInfo = get(STORAGE_TYPES.CURRENT_USER_INFO);
        // console.log("winUserInfo---", winUserInfo);
        const saveData: ISaveLessonPlan = {
            ID: "",
            Name: "",
            TeachPageName: "",
            Sort: 0,
            Status: 0,
            LessonPlanDetails: [],
        };

        const showSetBtn = ref(false);
        const tipVisible = ref(false);
        const isEditChange = ref(false);

        watch(
            () => props.lessonDesignVisible,
            async () => {
                visible.value = props.lessonDesignVisible;
                isEditChange.value = false;
                if (visible.value) {
                    handleShowSetBtn();
                    await _getLessonPlanTemplate();
                    await _getLessonPlan();
                }
            }
        );

        const handleShowSetBtn = () => {
            const yunInfo: IYunInfo = get(STORAGE_TYPES.YUN_INFO); // 校长和副校长
            showSetBtn.value = yunInfo.RolesList.some((item: any) =>
                ["020100", "020200"].includes(item.RoleCode)
            );
        };

        const form = reactive<IFrom>({
            templateType: "",
            lessonBasicInfoList: [],
        });

        const changeTemplate = async (val: string) => {
            await _changeLessonPlanTemplate(val);
            await _getLessonPlan();
        };

        const close = (done: () => void) => {
            if (isEditChange.value) {
                tipVisible.value = true;
            } else {
                emit("update:lessonDesignVisible", false);
            }
        };

        const addTarget = (index: number, item: any) => {
            item.LessonPlanDetailOptions.splice(index + 1, 0, {
                ID: "",
                Value: "",
            });
        };

        const reduceTarget = (index: number, item: any) => {
            item.LessonPlanDetailOptions.splice(index, 1);
        };

        const save = () => {
            saveData.LessonPlanDetails = form.lessonBasicInfoList.map(
                (item: any) => {
                    if (item.SelectType === 2) {
                        item.LessonPlanDetailOptions.forEach(
                            (i: any, index: number) => {
                                i.Sort = index;
                            }
                        );
                    } else if (item.SelectType === 4 || item.SelectType === 6) {
                        item.LessonPlanDetailOptions.forEach((i: any) => {
                            i.ID === item.isSelectId
                                ? (i.IsSelect = 1)
                                : (i.IsSelect = 0);
                        });
                    } else if (item.SelectType === 5) {
                        item.LessonPlanDetailOptions.forEach((i: any) => {
                            item.isSelectId.includes(i.ID)
                                ? (i.IsSelect = 1)
                                : (i.IsSelect = 0);
                        });
                    }

                    return item;
                }
            );

            saveLessonPlan(saveData).then((res) => {
                if (res.success) {
                    ElMessage.success("教案设计修改成功！");
                    tipVisible.value = false;
                    const lessonProcessList = saveData.LessonPlanDetails.find(
                        (item) => item.Name === "教学过程"
                    );
                    emit("updateLesson", lessonProcessList);
                    emit("update:lessonDesignVisible", false);
                }
            });
        };

        const previewDialog = ref(false);
        const preview = () => {
            previewDialog.value = true;
        };

        const dialogVisible = ref(false);
        const templateSet = () => {
            dialogVisible.value = true;
        };

        const updateLessonPlanTemplateList = async () => {
            await _getLessonPlanTemplate();
            await _getLessonPlan();
        };

        const _changeLessonPlanTemplate = (val: string) => {
            const data = {
                TeachPageID: props.winId,
                LessonPlanTemplateMainID: val,
                TeacherID: store.state.userInfo?.id || winUserInfo.id,
                FranchiseeID: store.state.userInfo.schoolId,
            };
            return changeLessonPlanTemplate(data).then((res) => {
                if (res.resultCode === 200) {
                    form.templateType = val;
                }
            });
        };

        const _getLessonPlan = () => {
            const data = {
                TeachPageID: props.winId,
                TeacherID: store.state.userInfo.id || winUserInfo.id,
                FranchiseeID:
                    store.state.userInfo.schoolId || winUserInfo.schoolId,
            };
            return getLessonPlan(data).then((res) => {
                if (res.resultCode === 200) {
                    const infoList: ItemForm[] =
                        res.result.LessonPlanDetails.map((item: ItemForm) => {
                            if (
                                item.SelectType === 2 &&
                                item.LessonPlanDetailOptions.length === 0
                            ) {
                                item.LessonPlanDetailOptions = [
                                    { ID: "", Value: "" },
                                ];
                            } else if (
                                item.SelectType === 4 ||
                                item.SelectType === 6
                            ) {
                                const selectValue =
                                    item.LessonPlanDetailOptions.find(
                                        (item: any) => item.IsSelect === 1
                                    );
                                item.isSelectId = selectValue
                                    ? selectValue.ID
                                    : "";
                            } else if (item.SelectType === 5) {
                                const selectValue =
                                    item.LessonPlanDetailOptions.filter(
                                        (item: any) => item.IsSelect
                                    );
                                item.isSelectId = selectValue.map(
                                    (i: any) => i.ID
                                );
                            }
                            return item;
                        });

                    form.lessonBasicInfoList = infoList;
                    form.templateType = res.result.LessonPlanTemplateMainID;

                    saveData.ID = res.result.ID;
                    saveData.Name = res.result.Name;
                    saveData.TeachPageName = res.result.TeachPageName || "";
                    saveData.Sort = res.result.Sort;
                    saveData.Status = res.result.Status;
                }
            });
        };

        const _getLessonPlanTemplate = () => {
            return getLessonPlanTemplate({
                FranchiseeID:
                    store.state.userInfo.schoolId || winUserInfo.schoolId,
            }).then((res) => {
                if (res.resultCode === 200) {
                    templateList.value = res.result || [];
                }
            });
        };
        const closeTip = () => {
            tipVisible.value = false;
            emit("update:lessonDesignVisible", false);
        };

        const textareaInput = () => {
            isEditChange.value = true;
        };

        return {
            showSetBtn,
            visible,
            form,
            saveData,
            previewDialog,
            templateList,
            classTypeList,
            dialogVisible,
            isEditChange,
            tipVisible,
            toChinesNum,
            updateLessonPlanTemplateList,
            _getLessonPlanTemplate,
            changeTemplate,
            templateSet,
            close,
            textareaInput,
            closeTip,
            addTarget,
            reduceTarget,
            save,
            preview,
        };
    },
});
</script>

<style lang="scss" scoped>
:deep(.resource1-dialog) {
    --el-dialog-margin-top: 5vh;
    height: 90vh;
    display: flex;
    flex-direction: column;
    min-height: 0;
    .el-dialog__body {
        flex: 1;
        min-height: 0;
        overflow-y: auto;
        border-bottom-left-radius: 6px;
        border-bottom-right-radius: 6px;
        padding: var(--el-dialog-padding-primary);
    }
    .el-input__inner {
        padding-right: 60px;
    }
    .textarea-right {
        .el-textarea {
            height: 100%;
        }
        .el-textarea__inner {
            padding: 10px 10px 15px;
        }
    }
    .el-date-editor {
        width: 260px;
    }
}

.template-select {
    width: 200px;
    position: absolute;
    top: 10px;
    .template-set {
        padding: 10px 20px;
        border-top: 1px solid #ebeff1;
    }
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
            color: #2e95ff;
            font-size: 14px;
            font-weight: 600;
            display: flex;
            align-items: center;
            background: #f6f7f8;
        }

        .lesson-page-title-box {
            vertical-align: top;
            .lesson-page-title {
                font-size: 16px;
                font-weight: 500;
                padding: 30px;
                color: #333;
            }
        }

        .lesson-design-adjust {
            :deep(.el-textarea__inner) {
                color: #333;
                font-weight: 500;
            }
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
            padding: 24px;
            font-size: 12px;
            color: #212121;
            .grey {
                color: rgba(33, 33, 33, 0.79);
            }
            ::v-deep(.el-textarea) {
                height: 100%;
                .el-input__count {
                    bottom: -12px;
                }
            }
            ::v-deep(.el-textarea__inner) {
                border: 0;
                resize: none;
                box-shadow: none;
            }
        }
    }

    .lesson-design-table,
    td {
        border: 1px solid #ebeff1;
        vertical-align: top;
    }
}

.lesson-design-footer {
    display: flex;
    justify-content: flex-end;
    border-top: 1px solid #ebeff1;
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

.tip-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    img {
        display: block;
        width: 140px;
        margin-bottom: 30px;
    }
    .tip-title {
        font-weight: 500;
        font-size: 18px;
        color: #333;
    }
    .tip-btns {
        margin-top: 30px;
    }
}
</style>
