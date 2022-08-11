<template>
    <el-dialog v-if="visible" v-model="visible" :close-on-click-modal="false" title="教案模板设计" width="1100px" center @close="close">
        <div class="content">
            <div class="left">
                <div class="left-content">
                    <div :class="[currentTemplate.ID === item.ID ? 'active' : '']" @click="handleTemplate(item)" v-for="(item,index) in templateList" :key="index">
                        <span class="text">{{item.Name}}</span>
                        <span class="del-btn" @click.stop="delTemplate(item)">
                            <img src="@/assets/indexImages/icon_delete.png" alt="">
                        </span>
                    </div>
                </div>
                <div class="left-add"  @click="handleAddTemplate">
                    <span>+ 创建新模板</span>
                </div>
            </div>
            <div class="center">
               <div>
                   <div class="title">模板名称</div>
                   <el-input maxlength="100" v-model="currentTemplate.Name" size="small"></el-input>
               </div>
                <div>
                    <div>
                        <div class="title">基础字段</div>
                        <el-checkbox v-for="(item,i) in form.basicValueList" @change="changeCheckbox" :key="i" :true-label="1" :false-label="0" v-model="item.Status" :label="item.Name" size="large" />
                    </div>

                    <div>
                        <div class="title">概要字段</div>
                        <el-checkbox v-for="(item,i) in form.synopsisValueList" @change="changeCheckbox" :key="i" :true-label="1" :false-label="0" v-model="item.Status" :label="item.Name" size="large" />
                    </div>

                    <div>
                        <div class="title">教学过程字段</div>
                        <el-checkbox v-for="(item,i) in form.processValueList" :disabled="true" :key="i" :true-label="1" :false-label="0" v-model="item.Status" :label="item.Name" size="large" />
                    </div>

                    <div v-if="currentTemplate.ID && currentTemplate.IsSystem !== 1">
                        <div class="title">
                            <span>自定义字段</span>
                            <span class="manage" @click="fieldManage">管理</span>
                        </div>
                        <el-checkbox v-for="(item,i) in form.customValueList" @change="changeCheckbox" :key="i" :true-label="1" :false-label="0" v-model="item.Status" :label="item.Name" size="large" />
                    </div>
                </div>
            </div>
            <div class="right">
               <div class="title">已选字段</div>
                <div>
                    <draggable v-model="rightList"  @start="drag = true" @end="drag = false" item-key="index">
                        <template #item="{ element }">
                            <div class="row">
                                <div>
                                    <img class="drag" src="@/assets/indexImages/icon_yidong@2x.png" alt="">
                                    <span>{{element.Name}}</span>
                                </div>
                                <img v-if="element.Name !== '教学过程'" @click="delCheckbox(element)" class="drag" src="@/assets/indexImages/icon_close_small.png" alt="">
                            </div>
                        </template>
                    </draggable>
                </div>
            </div>
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="close">取消</el-button>
            <el-button type="primary" @click="handleComfirm">确定</el-button>
          </span>
        </template>

        <lesson-field-mange :currentTemplate="currentTemplate" @updateTemplateList="updateTemplateList" v-model:dialogVisible="fieldManageVisible"></lesson-field-mange>

    </el-dialog>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, toRefs, ref, watch, PropType, nextTick } from "vue";
import draggable from "vuedraggable";
import { ITemplateList, ITemplateItem } from "@/types/lessonDesign.ts";
import LessonFieldMange from "@/views/preparation/intelligenceClassroom/components/edit/lessonFieldMange.vue";
import { updateLessonPlanTemplate, delLessonPlanTemplate, addLessonPlanTemplate } from "@/api/home.ts";
import { ElMessage, ElMessageBox } from "element-plus";
import { store } from "@/store";
interface State {
    fieldManageVisible: boolean,
    form: {
        basicValueList: ITemplateItem[],
        synopsisValueList: ITemplateItem[],
        processValueList: ITemplateItem[],
        teachProcess: ITemplateItem[],
        customValueList: ITemplateItem[],
    },
    currentTemplate: ITemplateList,
    rightList: ITemplateItem[]
}
export default defineComponent({
    name: "lessonTemplateSet",
    components: { draggable, LessonFieldMange },
    props: {
        dialogVisible: {
            type: Boolean,
            require: true
        },
        templateList: {
            type: Array as PropType<ITemplateList[]>,
            default: () => []
        }
    },
    emits: ["update:dialogVisible", "updateLessonPlanTemplateList"],
    setup(props, { emit }) {
        const state = reactive<State>({
            fieldManageVisible: false,
            form: {
                basicValueList: [],
                synopsisValueList: [],
                processValueList: [
                    { Name: "学情预设", Status: 1 },
                    { Name: "设计意图", Status: 1 }
                ],
                teachProcess: [],
                customValueList: []
            },
            currentTemplate: { Name: "", ID: "", Sort: 0, IsSystem: 0, Detail: [] },
            rightList: []

        });
        const visible = computed(() => props.dialogVisible);

        watch(() => props.templateList, (val:ITemplateList[]) => {
            nextTick(() => {
                if (state.currentTemplate.ID) {
                    state.currentTemplate = val.find((item:ITemplateList) => item.ID === state.currentTemplate.ID) || { Name: "", ID: "", Sort: 0, IsSystem: 0, Detail: [] };
                } else {
                    state.currentTemplate = val?.length > 0 ? val[0] : { Name: "", ID: "", Sort: 0, IsSystem: 0, Detail: [] };
                }

                // state.currentTemplate = state.currentTemplate.ID ? state.currentTemplate : val?.length > 0 ? val[0] : { Name: "", ID: "", Sort: 0, IsSystem: 0, Detail: [] };
                console.log(state.currentTemplate, "state.currentTemplate====");
                transformData(state.currentTemplate?.Detail);
            });
        }, { immediate: true });

        const transformData = (templateList:any[]) => {
            state.form.basicValueList = templateList.filter((item:any) => item.GroupName === "基础字段");
            state.form.synopsisValueList = templateList.filter((item:any) => item.GroupName === "概要字段");
            state.form.teachProcess = templateList.filter((item:any) => item.GroupName === "教学过程");
            state.form.customValueList = templateList.filter((item:any) => item.GroupName === "自定义字段");
            changeCheckbox();
        };

        const changeCheckbox = () => {
            const list = [...state.form.basicValueList, ...state.form.synopsisValueList, ...state.form.teachProcess, ...state.form.customValueList];
            state.rightList = list.filter((item:ITemplateItem) => item.Status);
        };

        const delCheckbox = (item:ITemplateItem) => {
            item.Status = 0;
            changeCheckbox();
        };

        const handleAddTemplate = () => {
            const data = {
                TeacherID: store.state.userInfo.id,
                FranchiseeID: store.state.userInfo.schoolId
            };
            addLessonPlanTemplate(data).then(res => {
                if (res.resultCode === 200) {
                    state.currentTemplate = { Name: res.result.Name, ID: res.result.ID, Sort: 0, IsSystem: 0, Detail: res.result.Detail };
                    transformData(state.currentTemplate?.Detail);
                }
            });
        };

        const handleComfirm = () => {
            const detail = state.rightList.map((item, index) => {
                return {
                    ...item,
                    Sort: index + 1
                };
            });
            const data = {
                ID: state.currentTemplate.ID,
                Name: state.currentTemplate.Name,
                Sort: state.currentTemplate.Sort,
                IsSystem: state.currentTemplate.IsSystem,
                FranchiseeID: store.state.userInfo.schoolId,
                TeacherID: store.state.userInfo.id,
                Detail: detail
            };
            updateLessonPlanTemplate(data).then(res => {
                if (res.resultCode === 200) {
                    ElMessage({ type: "success", message: state.currentTemplate.ID ? "更新模板成功" : "新增模板成功" });
                    emit("updateLessonPlanTemplateList");
                    emit("update:dialogVisible", false);
                }
            });
        };

        const delTemplate = (item:ITemplateList) => {
            ElMessageBox.confirm("是否删除该模板?", "提示", {
                confirmButtonText: "确认",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                delLessonPlanTemplate({ ID: item.ID, TeacherID: store.state.userInfo.id, }).then(res => {
                    if (res.resultCode === 200) {
                        state.currentTemplate = { Name: "", ID: "", Sort: 0, IsSystem: 0, Detail: [] };
                        emit("updateLessonPlanTemplateList");
                        ElMessage({ type: "success", message: "删除模板成功" });
                    }
                });
            }).catch((err) => {
                return err;
            });
        };

        const handleTemplate = (item:ITemplateList) => {
            state.currentTemplate = item;
            transformData(state.currentTemplate?.Detail);
        };

        const updateTemplateList = () => {
            emit("updateLessonPlanTemplateList");
        };

        const close = () => {
            emit("updateLessonPlanTemplateList");
            emit("update:dialogVisible", false);
        };

        const fieldManage = () => {
            state.fieldManageVisible = true;
        };

        return {
            ...toRefs(state),
            visible,
            updateTemplateList,
            delTemplate,
            handleAddTemplate,
            handleTemplate,
            changeCheckbox,
            delCheckbox,
            handleComfirm,
            fieldManage,
            close
        };
    }
});
</script>

<style scoped lang="scss">
.content{
    display: flex;
    .title{
        font-size: 16px;
        font-weight: 600;
        color: #212121;
        margin: 20px 0 10px;
    }
    .left{
        display: flex;
        flex-direction: column;
        position: relative;
        width: 240px;
        padding: 0px 0 70px;
        background: #F6F7F8;
        margin-right: 15px;
        .left-content {
            flex: 1;
            overflow-y: auto;
            padding-top: 20px;
            > div {
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                border: 1px solid #EBEFF1;
                background: #FFFFFF;
                height: 46px;
                cursor: pointer;
                font-size: 14px;
                color: #212121;
                margin: 0 10px 16px;
                &:hover {
                    background-color: rgba(0, 87, 254, 0.1);
                    .del-btn{
                        display: block;
                    }
                }
                .del-btn{
                    position: absolute;
                    right: 0px;
                    top: -12px;
                    display: inline-block;
                    background-color: rgba(0, 0, 0, 0.3);
                    padding: 4px;
                    border-radius: 50%;
                    font-size: 12px;
                    display: none;
                }
                .text{
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
            .active {
                background-color: rgba(0, 87, 254, 0.1);
                color: #0057FE;
            }
        }
        .left-add {
            position: absolute;
            left: 10px;
            bottom: 20px;
            border-radius: 4px;
            border: 0.1rem solid #2E95FF;
            color: #2E95FF;
            height: 40px;
            line-height: 40px;
            width: 220px;
            text-align: center;
            cursor: pointer;
        }
    }
    .center{
        flex: 1;
        .manage{
            cursor: pointer;
            margin-left: 20px;
            font-size: 14px;
            color: #2E95FF;
        }
    }
    .right{
        width: 240px;
        margin-left: 20px;
        .row{
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            img{
                width: 10px;
                height: 10px;
                margin-right: 10px;
                cursor: pointer;
            }
        }
    }
}
</style>
