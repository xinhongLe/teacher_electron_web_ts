<template>
    <div class="edit-template">
        <div class="template-title">
            <img src="@/assets/images/preparation/learndesign/icon_back.png" alt="" @click="goBack">
            <div class="text">
                导学案设计
            </div>
            <div class="right-btnitems">
                <div class="btn" @click="reviewPage">预览</div>
                <div class="btn" @click="downLoad">下载</div>
                <div class="btn save" @click="saveTemplate">保存</div>
            </div>
        </div>
        <!--        模板组件-->
        <component v-if="currentComponents" :is="currentComponents" v-model:isReview="isReview"
                   @addQuestionItem="questionVisible = true"
                   ref="templateRef" @saveTemplateContent="saveTemplateContent"
                   :currentLearningGuidDetail="currentLearningGuidDetail"></component>
        <!--        选择题目组件-->
        <AddQuestionDialog v-model:question-visible="questionVisible"
                           @selectedQuestion="selectedQuestion"></AddQuestionDialog>
        <!--        关闭保存提示-->
        <DeleteDialog ref="deleteDialogRef" msg="内容还未保存，是否保存后关闭？" cancelText="直接关闭" backText="保存" @cancel="cancelSave"
                      @confirm="saveTemplate">
            <template v-slot:icon>
                <img src="@/assets/images/preparation/learndesign/icon_tips_popup_2.png" alt=""
                     style="padding-right: 24px">
            </template>
        </DeleteDialog>
    </div>

</template>

<script lang="ts">
import {
    defineComponent, nextTick, ref,
    markRaw, computed
} from "vue";
import AddQuestionDialog from "@/views/preparation/learnPlanDesign/AddQuestionDialog.vue";
import TemplateOne from "@/views/preparation/learnPlanDesign/components/TemplateOne.vue";
import TemplateTwo from "@/views/preparation/learnPlanDesign/components/TemplateTwo.vue";
import DeleteDialog from "@/views/composition/components/deleteDialog.vue";
import {
    editResource,
    uploadResource,
    updateLearningGuid
} from "@/api/resource";
import { ElMessage } from "element-plus";

export default defineComponent({
    name: "LearnPlanEditTemplate",
    props: {
        templateType: {
            type: Number || String,
            default: 1
        },
        resourceData: {
            type: Object,
            default: {}
        },
        source: {
            type: String,
            default: ""
        }
    },
    emits: ["goBack"],
    components: { AddQuestionDialog, TemplateOne, TemplateTwo, DeleteDialog },
    setup(props, { emit }) {
        // 当前模板组件
        const currentComponents: any = computed(() => {
            return props.templateType == 1 ? markRaw(TemplateOne) : markRaw(TemplateTwo)
        })
        // 删除组件
        const deleteDialogRef = ref();
        // 模板组件
        const templateRef = ref();
        // 选择题目弹框
        const questionVisible = ref(false);
        // 是否是预览页面
        const isReview = ref(false)
        // 预览页面
        const reviewPage = () => {
            isReview.value = !isReview.value
        };
        // 页面退回
        const goBack = () => {
            deleteDialogRef.value.openDialog();
        };
        // 选择好题目了
        const selectedQuestion = (questions: any) => {
            nextTick(() => {
                templateRef.value.setQuestionItem(questions);
            })
        };
        // 保存模板
        const saveTemplate = () => {
            nextTick(() => {
                templateRef.value.saveTemplate();
            })
        };
        // 下载模板
        const downLoad = () => {
            nextTick(() => {
                templateRef.value.downLoad();
            })
        };
        // 取消保存
        const cancelSave = () => {
            emit("goBack")
        };
        const currentResourceMainId = ref("");
        const currentLearningGuidDetail: any = ref([]);
        // 保存模板内容
        const saveTemplateContent = async (data: any) => {
            if (currentResourceMainId.value) {
                // 更新
                const params: any = {
                    template: props.templateType,
                    resourceMainId: currentResourceMainId.value,
                    learningGuideDetails: data
                };
                const res = await updateLearningGuid(params);
                if (res.success && res.resultCode === 200) {
                    ElMessage.success("保存成功");
                    emit("goBack", props.source);
                }
            } else {
                // 新增
                const params: any = Object.assign({}, props.resourceData);
                params.learningGuideDetails = data;
                params.template = props.templateType;
                console.log('params----', params);
                const res = await uploadResource(params);
                if (res.success && res.resultCode === 200) {
                    ElMessage.success("保存成功");
                    emit("goBack", props.source);
                }
            }
        };

        // 编辑时候回显模板
        const renderTemplate = (id: string, data: any) => {
            // console.log('id----', id)
            // console.log('data----', data)
            currentResourceMainId.value = id;
            currentLearningGuidDetail.value = data;
        }
        return {
            questionVisible,
            templateRef,
            isReview,
            deleteDialogRef,
            currentComponents,
            currentResourceMainId,
            currentLearningGuidDetail,
            reviewPage,
            goBack,
            selectedQuestion,
            saveTemplate,
            cancelSave,
            saveTemplateContent,
            renderTemplate,
            downLoad
        }
    }
})
</script>

<style lang="scss" scoped>
.edit-template {
    width: 100%;
    height: 100%;
    background: #F5F6FA;

    .template-title {
        width: 100%;
        height: 72px;
        background: #FFFFFF;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 24px;

        img {
            width: 32px;
            height: 32px;
            cursor: pointer;
        }

        .text {
            margin-left: 334px;
            font-size: 24px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #0D0B22;
        }

        .right-btnitems {
            height: 100%;
            display: flex;
            align-items: center;

            .btn {
                cursor: pointer;
                width: 112px;
                height: 40px;
                border-radius: 4px;
                border: 1px solid #4B71EE;
                font-size: 16px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #4B71EE;
                margin-left: 16px;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .save {
                background: #4B71EE;
                color: #FFFFFF;
            }
        }
    }

    .template-edit {
        width: 100%;
        height: calc(100% - 72px);
        overflow: auto;

        .edit-content {
            margin: 30px auto;
            width: 764px;
            height: 1104px;
            background: #FFFFFF;
            box-shadow: 0px 8px 19px 0px rgba(0, 0, 0, 0.05);
            padding: 24px;
            margin-bottom: 60px;

            .content-title {
                width: 100%;
                text-align: center;
                margin-top: 6px;
                margin-bottom: 18px;
                font-size: 20px;
                color: #0D0B22;
                font-weight: 600;
                height: 32px;
            }

            .content-con {
                width: 100%;
                min-height: 972px;
                border-radius: 8px;
                border: 1px solid #E0E2E7;
                padding: 16px;

                .basic-info {
                    display: flex;
                    align-items: center;
                    border-bottom: 1px solid #000000;
                    position: relative;

                    .info-input {
                        padding: 18px;
                        flex: 1;

                        :deep(.el-input) {
                            height: 44px;
                            border-radius: 8px;

                            .el-input__wrapper {
                                //background: #F5F6FA;
                            }

                            .el-input__inner {
                            }
                        }
                    }

                    .black-spot {
                        border-right: 2px dashed rgba(0, 0, 0, .2);
                        position: relative;
                    }

                    .black-spot::after {
                        content: "";
                        display: block;
                        width: 7px;
                        height: 7px;
                        background: #000000;
                        position: absolute;
                        top: 0px;
                        right: -5px;
                        border-radius: 50%;
                    }

                    .black-spot::before {
                        content: "";
                        display: block;
                        width: 7px;
                        height: 7px;
                        background: #000000;
                        position: absolute;
                        bottom: -4px;
                        right: -5px;
                        border-radius: 50%;
                    }

                    &::before {
                        content: "";
                        display: block;
                        width: 7px;
                        height: 7px;
                        background: #000000;
                        position: absolute;
                        bottom: -4px;
                        left: -5px;
                        border-radius: 50%;
                    }

                    &::after {
                        content: "";
                        display: block;
                        width: 7px;
                        height: 7px;
                        background: #000000;
                        position: absolute;
                        bottom: -4px;
                        right: -5px;
                        border-radius: 50%;
                    }

                }

                .content-template {
                    width: 100%;

                    .template-items {
                        width: 100%;
                        display: flex;
                        border-bottom: 2px dashed rgba(0, 0, 0, 0.2);
                        min-height: 200px;

                        .left-name {
                            //padding-top: 24px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            width: 110px;
                            border-right: 2px dashed rgba(0, 0, 0, 0.2);
                            position: relative;
                            //height: 100%;
                        }


                        .left-name::before {
                            content: "";
                            display: block;
                            width: 7px;
                            height: 7px;
                            background: #000000;
                            position: absolute;
                            bottom: -5px;
                            right: -5px;
                            border-radius: 50%;
                        }

                        .right-con {
                            padding: 25px 18px;
                            flex: 1;
                            overflow: auto;

                            .top-con {
                                min-height: 126px;
                                font-size: 14px;

                                img {
                                    width: 100%;
                                    height: auto;
                                }
                            }

                            .bto-btn {
                                display: flex;
                                align-items: center;
                                justify-content: space-between;
                                margin-top: 10px;

                                .add-item {
                                    cursor: pointer;
                                    display: flex;
                                    align-items: center;
                                    font-size: 14px;
                                    color: #4B71EE;

                                    img {
                                        margin-right: 2px;
                                    }

                                    &:hover {
                                        opacity: 0.5;
                                    }
                                }

                                .del-item {
                                    cursor: pointer;
                                    display: flex;
                                    align-items: center;
                                    font-size: 14px;
                                    color: red;

                                    img {
                                        margin-right: 2px;
                                    }

                                    &:hover {
                                        opacity: 0.5;
                                    }
                                }
                            }


                        }


                    }

                    .lesson {
                        height: 54px;
                        min-height: 54px;
                        align-items: center;

                        .left-name {
                            height: 100%;
                            align-items: center;
                            padding-top: 0px;

                        }

                        .left-name::after {
                            content: "";
                            display: block;
                            width: 7px;
                            height: 7px;
                            background: #000000;
                            position: absolute;
                            top: -4px;
                            right: -5px;
                            border-radius: 50%;
                        }

                        .right-con {
                            padding: 0;
                            flex: 1;
                            height: 80%;
                            display: flex;
                            align-items: center;

                            :deep(.el-input) {
                                height: 100%;

                                .el-input__wrapper {
                                    box-shadow: none;

                                    .el-input__inner {
                                        font-size: 14px;
                                    }
                                }
                            }
                        }
                    }

                    .add-new-item {
                        justify-content: center;
                        display: flex;
                        align-items: center;
                        margin-top: 10px;

                        .add-item {
                            display: flex;
                            align-items: center;
                            font-size: 14px;
                            color: #4B71EE;
                            cursor: pointer;

                            img {
                                margin-right: 2px;
                            }

                            &:hover {
                                opacity: 0.5;
                            }
                        }
                    }
                }
            }


            .notitle {
                width: 100%;
                height: 100%;
            }

            .page-data {
                width: 100%;
                height: 16px;
                font-size: 12px;
                color: #19203D;
                text-align: center;
                line-height: 16px;
                margin-top: 48px;

            }
        }

        .edit-content:first-child {
            .page-data {
                margin-top: 68px;
            }
        }

        .page-data {
            width: 100%;
            height: 16px;
            font-size: 12px;
            color: #19203D;
            text-align: center;
            line-height: 16px;

        }
    }
}
</style>
