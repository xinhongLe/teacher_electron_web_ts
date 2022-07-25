<template>
    <el-dialog v-if="visible" v-model="visible" title="教案模板设计" width="1100px" center @close="close">
        <div class="content">
            <div class="left">
                <div class="left-content">
                    <div :class="[currentTemplate.ID === item.ID ? 'active' : '']" @click="handleTemplate(item)" v-for="(item,index) in templateList" :key="index"> {{item.Name}}</div>
                </div>
                <div class="left-add">
                    <span  @click="handleAddEvaluation">+ 创建新模板</span>
                </div>
            </div>
            <div class="center">
               <div>
                   <div class="title">模板名称</div>
                   <el-input size="small"></el-input>
               </div>
                <div>
                    <div v-for="(item,index) in 5" :key="index">
                        <div class="title">基础字段</div>
                        <el-checkbox v-for="(item,i) in 5" :key="i" v-model="item.checked" label="Option 1" size="large" />
                    </div>

                    <div>
                        <div class="title">
                            <span>自定义字段</span>
                            <span class="manage" @click="fieldManage">管理</span>
                        </div>
                        <el-checkbox v-for="(item,i) in 5" :key="i" v-model="item.checked" label="Option 1" size="large" />
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
                                    <span>{{element.name}}</span>
                                </div>
                                <img class="drag" src="@/assets/indexImages/icon_close_small.png" alt="">
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
import { computed, defineComponent, reactive, toRefs, ref, watch, PropType } from "vue";
import draggable from "vuedraggable";
import { ITemplateList, IFrom } from "@/types/lessonDesign.ts";
import LessonFieldMange from "@/views/preparation/intelligenceClassroom/components/edit/lessonFieldMange.vue";
interface State {
    fieldManageVisible: boolean,
    form: IFrom,
    currentTemplate: ITemplateList,
    rightList: {name:string, value: number}[]
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
    emits: ["update:dialogVisible"],
    setup(props, { emit }) {
        const state = reactive<State>({
            fieldManageVisible: false,
            form: {
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
            },
            currentTemplate: { Name: "", ID: "" },
            rightList: [
                { name: "教材1", value: 1 },
                { name: "教材2", value: 2 },
                { name: "教材3", value: 3 }
            ]

        });
        const visible = computed(() => props.dialogVisible);

        watch(() => props.templateList, (val:ITemplateList[]) => {
            state.currentTemplate = val?.length > 0 ? val[0] : {} as ITemplateList;
            console.log(state.currentTemplate, "state.currentTemplate======");
        }, { immediate: true });

        const transformData = (templateList:any[]) => {
            // state.form.titleValue = templateList.find((item:any) => item.Sort === 1) || {}
        };

        const handleComfirm = () => {
            console.log("ok");
        };

        const handleTemplate = (item:ITemplateList) => {
            state.currentTemplate = item;
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
            handleTemplate,
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
