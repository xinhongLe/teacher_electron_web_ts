<template>
    <el-dialog v-if="visible" v-model="visible" title="教案模板设计" width="1100px" center @close="close">
        <div class="content">
            <div class="left">
                <div class="left-content">
                    <div :class="[currentTemplate.ID === item.ID ? 'active' : '']" @click="handleTemplate(item)" v-for="(item,index) in templateList" :key="index"> {{item.Name}}</div>
                </div>
                <div class="left-add">
                    <span  @click="handleAddTemplate">+ 创建新模板</span>
                </div>
            </div>
            <div class="center">
               <div>
                   <div class="title">模板名称</div>
                   <el-input v-model="currentTemplate.Name" size="small"></el-input>
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
                        <template #item="{element, index}">
                            <div class="row">
                                <div>
                                    <img class="drag" src="@/assets/indexImages/icon_yidong@2x.png" alt="">
                                    <span>{{element.Name}}</span>
                                </div>
                                <img @click="delCheckbox(element)" class="drag" src="@/assets/indexImages/icon_close_small.png" alt="">
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

        <lesson-field-mange :currentTemplate="currentTemplate" v-model:dialogVisible="fieldManageVisible"></lesson-field-mange>

    </el-dialog>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, toRefs, ref, watch, PropType, nextTick } from "vue";
import draggable from "vuedraggable";
import { ITemplateList, IFrom, ITemplateItem } from "@/types/lessonDesign.ts";
import LessonFieldMange from "@/views/preparation/intelligenceClassroom/components/edit/lessonFieldMange.vue";
import { updateLessonPlanTemplate } from "@/api/home.ts";
interface State {
    fieldManageVisible: boolean,
    form: {
        // titleValue: ITemplateItem,
        basicValueList: ITemplateItem[],
        synopsisValueList: ITemplateItem[],
        processValueList: ITemplateItem[],
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
                // titleValue: { Name: "", Status: 1 },
                basicValueList: [],
                synopsisValueList: [],
                processValueList: [
                    { Name: "学情预设", Status: 1 },
                    { Name: "设计意图", Status: 1 }
                ],
                customValueList: []
                // title: "",
                // book: "",
                // chapter: "",
                // lesson: "",
                // templateType: "",
                // classType: "",
                // analyze: "",
                // targets: [{ value: "", id: "" }],
                // teachingDifficulty: "",
                // teachingFocus: "",
                // teachingPreparation: "",
                // teachProgress: [],
                // teachingReflection: "",
                // homework: ""
            },
            currentTemplate: { Name: "", ID: "", Sort: 0, IsSystem: 0, Detail: [] },
            rightList: []

        });
        const visible = computed(() => props.dialogVisible);

        watch(() => props.templateList, (val:ITemplateList[]) => {
            nextTick(() => {
                state.currentTemplate = val?.length > 0 ? val[0] : { Name: "", ID: "", Sort: 0, IsSystem: 0, Detail: [] };
                transformData(state.currentTemplate?.Detail);
                console.log(state.currentTemplate, "state.currentTemplate======");
            });
        }, { immediate: true });

        const transformData = (templateList:any[]) => {
            // state.form.titleValue = templateList.find((item:any) => item.Sort === 1) || { Name: "", Status: 1 };
            state.form.basicValueList = templateList.filter((item:any) => item.Sort === 2);
            state.form.synopsisValueList = templateList.filter((item:any) => item.GroupName === "概要字段");
            state.form.customValueList = templateList.filter((item:any) => item.Sort === 0);
            changeCheckbox();
        };

        const changeCheckbox = () => {
            const list = [...state.form.basicValueList, ...state.form.synopsisValueList, ...state.form.customValueList];
            state.rightList = list.filter((item:ITemplateItem) => item.Status);
        };

        const delCheckbox = (item:ITemplateItem) => {
            item.Status = 0;
            changeCheckbox();
        };

        const handleAddTemplate = () => {
            state.form.basicValueList = state.form.basicValueList.map(item => {
                return { ...item, Status: 0 };
            });
            state.form.synopsisValueList = state.form.synopsisValueList.map(item => {
                return { ...item, Status: 0 };
            });
            state.form.customValueList = [];
            state.currentTemplate = { Name: "", ID: "", Sort: 0, IsSystem: 0, Detail: [] };
        };

        const handleComfirm = () => {
            const data = {
                ID: state.currentTemplate.ID,
                Name: state.currentTemplate.Name,
                Sort: state.currentTemplate.Sort,
                IsSystem: state.currentTemplate.IsSystem,
                Detail: [...state.form.basicValueList,
                    ...state.form.synopsisValueList, ...state.form.customValueList]
            };
            updateLessonPlanTemplate(data).then(res => {
                if (res.resultCode === 200) {
                    emit("updateLessonPlanTemplateList");
                }
            });
        };

        const handleTemplate = (item:ITemplateList) => {
            state.currentTemplate = item;
            transformData(state.currentTemplate?.Detail);
        };

        const close = () => {
            emit("update:dialogVisible", false);
        };

        const fieldManage = () => {
            state.fieldManageVisible = true;
        };

        return {
            ...toRefs(state),
            visible,
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
        padding: 10px 0 60px;
        background: #F6F7F8;
        margin-right: 15px;
        .left-content {
            flex: 1;
            overflow-y: auto;
            > div {
                display: flex;
                align-items: center;
                justify-content: center;
                border: 1px solid #EBEFF1;
                background: #FFFFFF;
                height: 40px;
                cursor: pointer;
                font-size: 14px;
                color: #212121;
                margin: 0 10px 10px;
                position: relative;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                &:hover {
                    background-color: rgba(0, 87, 254, 0.1);
                }
            }
            .active {
                background-color: rgba(0, 87, 254, 0.1);
                color: #0057FE;
            }
        }
        .left-add {
            position: absolute;
            left: 1rem;
            bottom: 1rem;
            border-radius: 4px;
            border: 0.1rem solid #2E95FF;
            color: #2E95FF;
            height: 40px;
            line-height: 40px;
            width: 220px;
            text-align: center;
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
