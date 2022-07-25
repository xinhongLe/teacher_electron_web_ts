<template>
    <el-dialog v-model="visible" title="教案设计" width="1100px" center @close="close">
       <div class="template-select">
           <el-select v-model="form.templateType" style="width: 100%" placeholder="请选择课型" size="small">
               <el-option v-for="item in templateList" :key="item.ID" :label="item.Name" :value="item.ID"/>
               <div @click="templateSet" style="cursor: pointer; padding: 10px 20px;border-top: 1px solid #EBEFF1">
                   <el-icon style="vertical-align: bottom;margin-right: 6px;"><Setting/></el-icon>
                   <span>设置</span>
               </div>
           </el-select>
       </div>

        <div class="lesson-design-form">
            <div class="lesson-design-label"><span>*</span> 标题</div>
            <div class="lesson-design-content">
                <el-input v-model="form.title" placeholder="请输入标题" size="small"></el-input>
            </div>
        </div>

        <div class="lesson-design-flex">
            <div class="lesson-design-form">
                <div class="lesson-design-label">教材</div>
                <div class="lesson-design-content">
                    <el-input v-model="form.book" disabled size="small"></el-input>
                </div>
            </div>

            <div class="lesson-design-form">
                <div class="lesson-design-label">单元</div>
                <div class="lesson-design-content">
                    <el-input v-model="form.chapter" disabled size="small"></el-input>
                </div>
            </div>

            <div class="lesson-design-form">
                <div class="lesson-design-label">课时</div>
                <div class="lesson-design-content">
                    <el-input v-model="form.lesson" disabled size="small"></el-input>
                </div>
            </div>

            <div class="lesson-design-form">
                <div class="lesson-design-label">课型</div>
                <div class="lesson-design-content">
                    <el-select v-model="form.classType" style="width: 100%" placeholder="请选择课型" size="small">
                        <el-option v-for="item in classTypeList" :key="item.value" :label="item.label" :value="item.value"/>
                    </el-select>
                </div>
            </div>
        </div>

        <div class="lesson-design-form">
            <div class="lesson-design-label">教材分析</div>
            <div class="lesson-design-content">
                <el-input type="textarea" v-model="form.analyze" placeholder="请输入教材分析" size="small"></el-input>
            </div>
        </div>

        <div class="lesson-design-form">
            <div class="lesson-design-label">教学目标</div>
            <div class="lesson-design-content">
                <draggable :modelValue="form.targets" :animation="300" @end="handleDragEnd" itemKey="index" handle=".drag">
                    <template #item="{index}">
                        <div class="sort-input">
                            <img class="drag" src="@/assets/indexImages/icon_yidong@2x.png" alt="">
                            <el-input v-model="form.targets[index].value" placeholder="请输入教学目标" size="small"></el-input>
                            <img class="option-btn" src="@/assets/indexImages/icon_add@2x.png" alt="" @click="addTarget(index)" />
                            <img class="option-btn" src="@/assets/indexImages/icon_del@2x.png" v-if="form.targets.length > 1" alt="" @click="reduceTarget(index)" />
                        </div>
                    </template>
                </draggable>
            </div>
        </div>

        <div class="lesson-design-form">
            <div class="lesson-design-label">教学难点</div>
            <div class="lesson-design-content">
                <el-input type="textarea" v-model="form.teachingDifficulty" placeholder="请输入教学难点" size="small"></el-input>
            </div>
        </div>

        <div class="lesson-design-form">
            <div class="lesson-design-label">教学重点</div>
            <div class="lesson-design-content">
                <el-input type="textarea" v-model="form.teachingFocus" placeholder="请输入教学重点" size="small"></el-input>
            </div>
        </div>

        <div class="lesson-design-form">
            <div class="lesson-design-label">教学准备</div>
            <div class="lesson-design-content">
                <el-input v-model="form.teachingPreparation" placeholder="请输入教学准备" size="small"></el-input>
            </div>
        </div>

        <div class="lesson-design-form">
            <div class="lesson-design-label">教学过程</div>
            <div class="lesson-design-content">
                <table class="lesson-design-table" border="1" v-for="(item, index) in form.teachProgress" :key="index">
                    <tr>
                        <td colspan="2">
                            <div class="lesson-design-table-header">
                                {{item.title}}
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
                    <tr v-for="(content, i) in item.contents" :key="i">
                        <td>
                            <div class="lesson-design-table-content grey">
                                <el-input type="textarea" placeholder="点击输入教学回顾" v-model="content.progress"></el-input>
                            </div>
                        </td>
                        <td>
                            <div class="lesson-design-table-content">
                                <el-input type="textarea" placeholder="点击输入设计意图" v-model="content.design"></el-input>
                            </div>
                        </td>
                    </tr>
                </table>
            </div>
        </div>

        <div class="lesson-design-form">
            <div class="lesson-design-label">教学反思</div>
            <div class="lesson-design-content">
                <el-input type="textarea" v-model="form.teachingReflection" placeholder="请输入教学反思" size="small"></el-input>
            </div>
        </div>

        <div class="lesson-design-form">
            <div class="lesson-design-label">课后作业</div>
            <div class="lesson-design-content">
                <el-input type="textarea" v-model="form.homework" placeholder="请输入课后作业" size="small"></el-input>
            </div>
        </div>

        <template #footer>
            <div class="lesson-design-footer">
                <el-button type="primary" size="small" @click="save()">完成</el-button>
            </div>
        </template>
    </el-dialog>

    <lesson-template-set v-model:dialogVisible="dialogVisible" @updateLessonPlanTemplateList="_getLessonPlanTemplate" :templateList="templateList"></lesson-template-set>

</template>

<script lang="ts">
import { getLessonPlan, getLessonPlanTemplate, ISaveLessonPlan, saveLessonPlan } from "@/api/home";
import { ElMessage } from "element-plus";
// import { result } from "lodash";
import { defineComponent, PropType, reactive, ref, watch } from "vue";
import draggable from "vuedraggable";
import { Setting } from "@element-plus/icons";
import LessonTemplateSet from "@/views/preparation/intelligenceClassroom/components/edit/lessonTemplateSet.vue";
import { get, STORAGE_TYPES } from "@/utils/storage";
import { ITemplateList, IFrom } from "@/types/lessonDesign.ts";
export default defineComponent({
    components: { LessonTemplateSet, draggable, Setting },
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
        watch(
            () => props.lessonDesignVisible,
            () => {
                visible.value = props.lessonDesignVisible;
                if (visible.value) {
                    getLessonPlan({ TeachPageID: props.winId }).then(res => {
                        res.result.LessonPlanDetails.map(item => {
                            switch (item.FieldType) {
                            case 1: {
                                form.title = item.Value || "";
                                break;
                            }
                            case 2: {
                                form.book = item.Value || "";
                                break;
                            }
                            case 3: {
                                form.chapter = item.Value || "";
                                break;
                            }
                            case 4: {
                                form.lesson = item.Value || "";
                                break;
                            }
                            case 5: {
                                const selected = item.LessonPlanDetailOptions.find(item => item.IsSelect === 1);
                                form.classType = selected ? selected.ID : "";
                                classTypeList.value = item.LessonPlanDetailOptions.map(item => {
                                    return {
                                        label: item.Name,
                                        value: item.ID
                                    };
                                });
                                break;
                            }
                            case 6: {
                                form.analyze = item.Value || "";
                                break;
                            }
                            case 7: {
                                form.targets = item.LessonPlanDetailOptions.map(item => {
                                    return {
                                        value: item.Value || "",
                                        id: item.ID || ""
                                    };
                                });
                                // if (form.targets.length === 0) {
                                //     form.targets.push({
                                //         value: "",
                                //         id: ""
                                //     });
                                // }
                                break;
                            }
                            case 8: {
                                form.teachingDifficulty = item.Value || "";
                                break;
                            }
                            case 9: {
                                form.teachingFocus = item.Value || "";
                                break;
                            }
                            case 10: {
                                form.teachingPreparation = item.Value || "";
                                break;
                            }
                            case 11: {
                                form.teachProgress = item.LessonPlanDetailPages.map(b => {
                                    const contents = b.Childrens.map(c => {
                                        return {
                                            id: c.ID,
                                            progress: c.AcademicPresupposition,
                                            design: c.DesignIntent
                                        };
                                    });
                                    return {
                                        id: b.ID,
                                        title: b.Name,
                                        contents
                                    };
                                });
                                break;
                            }
                            case 12: {
                                form.teachingReflection = item.Value || "";
                                break;
                            }
                            case 13: {
                                form.homework = item.Value || "";
                                break;
                            }
                            }
                        });
                        saveData.ID = res.result.ID;
                        saveData.Name = res.result.Name;
                        saveData.Sort = res.result.Sort;
                        saveData.Status = res.result.Status;
                        saveData.LessonPlanDetails = res.result.LessonPlanDetails.map(item => {
                            return {
                                ID: item.ID,
                                Name: item.Name,
                                Value: item.Value || "",
                                Sort: item.Sort,
                                FieldType: item.FieldType,
                                LessonPlanDetailPages: item.LessonPlanDetailPages.map(p => {
                                    return {
                                        ID: p.ID,
                                        Name: p.Name,
                                        IsShow: p.IsShow,
                                        Type: p.Type,
                                        Value: p.Value || "",
                                        Status: p.Status,
                                        Sort: p.Sort,
                                        Childrens: p.Childrens.map(c => {
                                            return {
                                                ID: c.ID,
                                                Name: c.Name,
                                                IsShow: c.IsShow,
                                                Type: c.Type,
                                                Value: c.Value || "",
                                                Status: c.Status,
                                                AcademicPresupposition: c.AcademicPresupposition || "",
                                                DesignIntent: c.DesignIntent || ""
                                            };
                                        })
                                    };
                                }),
                                LessonPlanDetailOptions: item.LessonPlanDetailOptions
                            };
                        });
                    });
                    _getLessonPlanTemplate();
                }
            }
        );

        const form = reactive<IFrom>({
            title: "",
            book: "",
            chapter: "",
            lesson: "",
            templateType: "",
            classType: "",
            analyze: "",
            targets: [{ value: "", id: "" }],
            teachingDifficulty: "",
            teachingFocus: "",
            teachingPreparation: "",
            teachProgress: [],
            teachingReflection: "",
            homework: ""
        });

        const close = () => {
            emit("update:lessonDesignVisible", false);
        };

        const handleDragEnd = (eventData: {
            newIndex: number;
            oldIndex: number;
        }) => {
            const { newIndex, oldIndex } = eventData;
            if (oldIndex === newIndex) return;
            const value = form.targets[oldIndex];
            form.targets[oldIndex] = form.targets[newIndex];
            form.targets[newIndex] = value;
        };

        const addTarget = (index: number) => {
            form.targets.splice(index, 0, { id: "", value: "" });
        };

        const reduceTarget = (index: number) => {
            form.targets.splice(index, 1);
        };

        const save = () => {
            if (!form.title) return ElMessage.warning("请填写标题！");
            saveData.LessonPlanDetails.map(item => {
                switch (item.FieldType) {
                case 1: {
                    item.Value = form.title;
                    break;
                }
                case 2: {
                    item.Value = form.book;
                    break;
                }
                case 3: {
                    item.Value = form.chapter;
                    break;
                }
                case 4: {
                    item.Value = form.lesson;
                    break;
                }
                case 5: {
                    item.LessonPlanDetailOptions.map(p => {
                        p.IsSelect = form.classType === p.ID ? 1 : 0;
                    });
                    break;
                }
                case 6: {
                    item.Value = form.analyze;
                    break;
                }
                case 7: {
                    item.LessonPlanDetailOptions = form.targets.map((t, i) => {
                        return {
                            ...t.id ? { ID: t.id } : {},
                            Value: t.value,
                            Sort: i
                        };
                    });
                    break;
                }
                case 8: {
                    item.Value = form.teachingDifficulty;
                    break;
                }
                case 9: {
                    item.Value = form.teachingFocus;
                    break;
                }
                case 10: {
                    item.Value = form.teachingPreparation;
                    break;
                }
                case 11: {
                    item.LessonPlanDetailPages.map(b => {
                        const target = form.teachProgress.find(t => t.id === b.ID);
                        b.Childrens && b.Childrens.map(c => {
                            const cTarget = target?.contents.find(t => t.id === c.ID);
                            c.DesignIntent = cTarget ? cTarget.design : "";
                            c.AcademicPresupposition = cTarget ? cTarget.progress : "";
                        });
                    });
                    break;
                }
                case 12: {
                    item.Value = form.teachingReflection;
                    break;
                }
                case 13: {
                    item.Value = form.homework;
                    break;
                }
                }
            });

            saveLessonPlan(saveData).then(res => {
                if (res.success) {
                    ElMessage.success("教案设计修改成功！");
                    close();
                }
            });
        };

        const dialogVisible = ref(false);
        const templateSet = () => {
            console.log(get(STORAGE_TYPES.USER_INFO), "-------");
            dialogVisible.value = true;
        };

        const _getLessonPlanTemplate = () => {
            getLessonPlanTemplate().then(res => {
                if (res.resultCode === 200) {
                    templateList.value = res.result || [];
                    form.templateType = templateList.value.length > 0 ? templateList.value[0].ID : "";
                }
            });
        };

        return {
            visible,
            form,
            templateList,
            classTypeList,
            dialogVisible,
            _getLessonPlanTemplate,
            templateSet,
            close,
            handleDragEnd,
            addTarget,
            reduceTarget,
            save
        };
    }
});
</script>

<style lang="scss" scoped>
.template-select{
    width: 200px;
    position: absolute;
    top: 20px;
    .template-set{
        padding: 10px 20px;
        border-top: 1px solid #EBEFF1;
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
