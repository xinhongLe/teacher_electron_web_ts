<template>
    <div>
        <el-dialog v-if="visible" v-model="visible" title="自定义字段管理"  width="1100px"  center @close="close">
            <div>
                <div class="header">
                    <span>*最多可以配置<span style="color: #2E95FF">10</span>个自定义字段</span>
                    <div class="add-btn" @click="openFieldDialog">
                        <span>+ 新增自定义字段</span>
                    </div>
                </div>
                <el-table :data="tableData" style="width: 100%; height:500px; overflow-y: auto" :header-cell-style="{ background: '#FAFBFC', color: '#242B3A'}">
                    <el-table-column prop="Name" label="字段名称"  />
                    <el-table-column label="字段类型">
                        <template #default="{ row }">
                            <span>{{fieldTypeList.find(item => item.value === row.SelectType)?.label}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template #default="{ row }">
                            <el-button type="text" size="small" @click="editFiled(row)">编辑</el-button>
                            <el-button type="text" size="small"  @click="delFiled(row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!--        <template #footer>-->
            <!--          <span class="dialog-footer">-->
            <!--            <el-button @click="close">取消</el-button>-->
            <!--            <el-button type="primary" @click="handleConfirm">确定</el-button>-->
            <!--          </span>-->
            <!--        </template>-->
        </el-dialog>

        <el-dialog v-if="filedVisible" v-model="filedVisible" :title="openFieldType === 'add' ? '新增自定义字段' : '编辑自定义字段'" width="600px" center @close="closeField">
            <div class="page-type-box">
                <el-form ref="ruleForm" :model="form" :rules="rules" label-width="120px">
                    <el-form-item label="字段名称：" prop="Name">
                        <el-input v-model="form.Name"></el-input>
                        <span>*最多30字符，且不能与系统字段、其他自定义字段重名</span>
                    </el-form-item>
                    <el-form-item label="字段类型：">
                        <el-select style="width: 100%" v-model="form.SelectType"  placeholder="请选择课型" >
                            <el-option v-for="item in fieldTypeList" :key="item.value" :label="item.label" :value="item.value"/>
                        </el-select>
                        <span>*字段类型会对配置字段产生影响</span>
                    </el-form-item>
                    <el-form-item v-if="showOptionType.includes(form.SelectType)" label="字段值选项：" >
                        <draggable v-model="fieldList"  @start="drag = true" @end="drag = false" item-key="index">
                            <template #item="{element, index}">
                                <div class="sort-input">
                                    <img class="drag" src="@/assets/indexImages/icon_yidong@2x.png" alt="">
                                    <el-input v-model="element.Name" placeholder="请输入字段名称" size="small"></el-input>
                                    <img class="option-btn" src="@/assets/indexImages/icon_add@2x.png" alt="" @click="addTarget(index)" />
                                    <img class="optiots/indexImages/icon_del@2x.png" v-if="fieldList.length > 1" alt="" @click="reduceTarget(index)" />
                                </div>
                            </template>
                        </draggable>n-btn" src="@/asse
                    </el-form-item>

                    <!--                <el-form-item prop="name">-->
                    <!--                    <el-checkbox v-model="form.checked1" label="包含时分" size="large" />-->
                    <!--                    <div>*带时分的日期型字段将会展示如：2014-10-13 13:00</div>-->
                    <!--                </el-form-item>-->
                </el-form>
            </div>
            <template #footer>
              <span class="dialog-footer">
                <el-button @click="closeField">取消</el-button>
                <el-button type="primary" :disabled="!form.Name" @click="handleConfirm">确定</el-button>
              </span>
            </template>
        </el-dialog>

    </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, ref, watch, PropType } from "vue";
import draggable from "vuedraggable";
import { getLessonPlanTemplateDetail, addTemplateField, editTemplateField, delTemplateField } from "@/api/home.ts";
import { ITemplateList } from "@/types/lessonDesign.ts";
import { ElMessage } from "element-plus";
import { store } from "@/store";
export default defineComponent({
    name: "lessonFieldMange",
    components: { draggable },
    props: {
        dialogVisible: {
            type: Boolean,
            require: true
        },
        currentTemplate: {
            type: Object as PropType<ITemplateList>,
            require: true
        }
    },
    emits: ["update:dialogVisible", "updateTemplateList"],
    setup(props, { emit }) {
        const state = reactive({
            rules: {
                Name: [
                    { required: true, message: "请输入名称", trigger: "blur" },
                    { max: 30, message: "最多30字符", trigger: "blur" }
                ]
            },
            visible: false,
            filedVisible: false,
            openFieldType: "add",
            form: {
                Name: "",
                SelectType: 0,
                ID: ""
            },
            tableData: [],
            showOptionType: [4, 5, 6],
            //  0 单行文本 1关联文本 2 多个单行文本  3多行文本 4 下拉框 5 多选框 6单选框 7 单日期 8包含时分日期
            fieldTypeList: [
                { label: "单行文本", value: 0 },
                { label: "关联文本", value: 1 },
                { label: "多个单行文本", value: 2 },
                { label: "多行文本", value: 3 },
                { label: "下拉框", value: 4 },
                { label: "多选框", value: 5 },
                { label: "单选框", value: 6 },
                { label: "单日期", value: 7 },
                { label: "包含时分日期", value: 8 }
            ],
            fieldList: [{ Name: "", ID: "" }]
        });

        watch(() => props.dialogVisible, (val:boolean) => {
            state.visible = val;
            if (val) {
                _getLessonPlanTemplateDetail();
            }
        });

        const ruleForm = ref();
        const handleConfirm = () => {
            ruleForm.value.validate((valid:boolean) => {
                if (valid) {
                    const Options = state.fieldList.map((item, index) => {
                        return {
                            Sort: index,
                            ...item
                        };
                    });
                    const data = state.showOptionType.includes(state.form.SelectType) ? {
                        LessonPlanTemplateMainID: props.currentTemplate!.ID,
                        TeacherID: store.state.userInfo.id,
                        Options: Options,
                        ...state.form
                    } : { LessonPlanTemplateMainID: props.currentTemplate!.ID, ...state.form };
                    if (state.openFieldType === "add") {
                        addTemplateField(data).then(res => {
                            if (res.resultCode === 200) {
                                _getLessonPlanTemplateDetail();
                                ElMessage({ type: "success", message: "新增字段成功" });
                                closeField();
                            }
                        });
                    } else {
                        editTemplateField(data).then(res => {
                            if (res.resultCode === 200) {
                                _getLessonPlanTemplateDetail();
                                ElMessage({ type: "success", message: "编辑字段成功" });
                                closeField();
                            }
                        });
                    }
                }
            });
        };
        const close = () => {
            emit("updateTemplateList");
            emit("update:dialogVisible", false);
        };

        const openFieldDialog = () => {
            if (state.tableData.length >= 10) {
                return ElMessage({ type: "warning", message: "最多可以配置10个自定义字段" });
            }
            state.openFieldType = "add";
            state.filedVisible = true;
        };

        const editFiled = (row:any) => {
            state.openFieldType = "edit";
            state.form = {
                Name: row.Name,
                SelectType: row.SelectType,
                ID: row.ID
            };
            state.fieldList = row.Options;
            state.filedVisible = true;
        };

        const delFiled = (row:any) => {
            delTemplateField({ ID: row.ID }).then(res => {
                if (res.resultCode === 200) {
                    _getLessonPlanTemplateDetail();
                    ElMessage({ type: "success", message: "编辑字段成功" });
                }
            });
        };

        const closeField = () => {
            state.form = {
                Name: "",
                SelectType: 0,
                ID: ""
            };
            state.fieldList = [{ Name: "", ID: "" }];
            state.filedVisible = false;
        };

        const addTarget = (index:number) => {
            state.fieldList.splice(index + 1, 0, { Name: "", ID: "" });
        };

        const reduceTarget = (index:number) => {
            state.fieldList.splice(index, 1);
        };

        const _getLessonPlanTemplateDetail = () => {
            getLessonPlanTemplateDetail({ LessonPlanTemplateID: props.currentTemplate!.ID }).then(res => {
                if (res.resultCode === 200) {
                    state.tableData = res.result || [];
                }
            });
        };

        return {
            ...toRefs(state),
            ruleForm,
            openFieldDialog,
            editFiled,
            delFiled,
            closeField,
            addTarget,
            reduceTarget,
            handleConfirm,
            close
        };
    }
});
</script>

<style scoped lang="scss">
.header{
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    .add-btn {
        cursor: pointer;
        border-radius: 4px;
        border: 1px solid #2E95FF;
        color: #2E95FF;
        height: 40px;
        line-height: 40px;
        width: 140px;
        text-align: center;
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

</style>
