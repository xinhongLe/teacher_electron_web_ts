<template>
    <div class="template-edit" v-if=!isResourceReview>
        <div class="edit-content" v-for="(item,index) in templatePageData">
            <div class="content-title" v-if="item.Level === 1">
                    <span v-if="!isTitleEdit && Title" @click="titleClick">
                        {{ Title }}
                    </span>
                <el-input v-else ref="titleRef" :autofocus="true" v-model="Title" placeholder="请输入标题"
                          @blur="isTitleEdit = false"
                          :maxlength="30"
                          show-word-limit></el-input>
            </div>
            <div class="content-con" :class="{notitle : item.Level !== 1}">
                <div class="basic-info" v-if="item.Level === 1">
                    <div class="info-input black-spot">
                        <div class="input-item">
                            <div class="text">班级</div>
                        </div>

                    </div>
                    <div class="info-input black-spot">
                        <div class="input-item">
                            <div class="text">姓名</div>
                        </div>
                    </div>
                    <div class="info-input">
                        <div class="input-item">
                            <div class="text">时间</div>
                        </div>
                    </div>
                </div>
                <div class="content-template">
                    <div class="template-items lesson" v-if="item.Level === 1">
                        <div class="left-name">
                            课时
                        </div>
                        <div class="right-con">
                            <div v-show="isReview" style="padding: 0 10px">{{ Lesson }}</div>
                            <el-input v-show="!isReview" v-model="Lesson" type="text" placeholder="点击输入"
                                      :maxlength="50"></el-input>
                        </div>
                    </div>
                    <div class="template-items" v-for="(question,qindex) in item.Data"
                         :style="{minHeight:question.ConHeight + 'px',maxHeight:item.Level === 1 ? '816px' : '1014px'}">
                        <div class="left-name">
                            <span @click="question.isEdit = true" v-if="!question.isEdit && question.Name">
                                {{ question.Name }}
                            </span>
                            <el-input v-else v-model="question.Name" autofocus @blur="question.isEdit = false"
                                      placeholder="请输入"
                                      :maxlength="12"></el-input>
                        </div>
                        <div class="right-con">
                            <div class="top-con">
                                <div v-show="isReview" v-html="question.Content"></div>
                                <div v-show="!isReview" :ref="'editerRef' + question.Id"
                                     :id="'editerRef' + question.Id"
                                     contenteditable
                                     @input="getEditer($event,question,item)">
                                </div>
                            </div>
                            <div class="bto-btn" v-if="!isReview">
                                <div class="add-item" @click="addQuestionItem(question)">
                                    <img src="@/assets/images/preparation/learndesign/icon_add.png" alt="">
                                    <span>添加题目</span>
                                </div>
                                <el-popconfirm
                                    v-if="qindex > 0"
                                    width="220"
                                    confirm-button-text="确定"
                                    cancel-button-text="取消"
                                    title="确定要删除此项吗？"
                                    @confirm.stop.prevent="delItem(item,question,index)"
                                    :hide-after="0"
                                >
                                    <template #reference>
                                        <div class="del-item">
                                            <img src="@/assets/images/preparation/learndesign/icon_delete_red.png"
                                                 alt="">
                                            <span>删除行</span>
                                        </div>
                                    </template>
                                </el-popconfirm>

                            </div>

                        </div>
                    </div>
                    <div class="add-new-item" v-if="!isReview && lastPageNum === index+1">
                        <div class="add-item" @click="addItem(item)">
                            <img src="@/assets/images/preparation/learndesign/icon_add.png" alt="">
                            <span>新增一项</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="page-data">
                第 {{ item.Level }} 页
            </div>
        </div>
    </div>
    <div class="template-review" v-show="isReview">
        <div class="template-review-content">
            <div class="close-icon">
                <img src="@/assets/images/preparation/learndesign/icon_close_white.png" alt="" @click="close">
            </div>
            <!--导学案涉预览-->

            <div class="template-edit">
                <div id="review" style="background: #fff">
                    <div class="edit-content content-review" v-for="(item,index) in templatePageData">
                        <div class="content-title" v-if="item.Level === 1">
                            <span>
                                {{ Title }}
                            </span>
                        </div>
                        <div class="content-con" :class="{notitle : item.Level !== 1}">
                            <div class="basic-info" v-if="item.Level === 1">
                                <div class="info-input black-spot">
                                    <div class="input-item">
                                        <div class="text">班级</div>
                                    </div>
                                </div>
                                <div class="info-input black-spot">
                                    <div class="input-item">
                                        <div class="text">姓名</div>
                                    </div>
                                </div>
                                <div class="info-input">
                                    <div class="input-item">
                                        <div class="text">时间</div>
                                    </div>
                                </div>
                            </div>
                            <div class="content-template">
                                <div class="template-items lesson" v-if="item.Level === 1">
                                    <div class="left-name">
                                        课时
                                    </div>
                                    <div class="right-con">
                                        <div style="padding: 0 10px">{{ Lesson }}</div>
                                    </div>
                                </div>
                                <div class="template-items" v-for="question in item.Data"
                                     :style="{minHeight:question.ConHeight + 'px',maxHeight:item.Level === 1 ? '816px' : '1014px'}">
                                    <div class="left-name">
                                        {{ question.Name }}
                                    </div>
                                    <div class="right-con">
                                        <div class="top-con">
                                            <div v-html="question.Content" style="word-break: break-all;"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!--                        <div class="page-data">-->
                        <!--                            第 {{ item.Level }} 页-->
                        <!--                        </div>-->
                    </div>
                </div>
            </div>
            <div class="download" @click="downLoad">
                <img src="@/assets/images/preparation/learndesign/icon_download_white.png" alt=""
                     style="padding-right: 6px;">
                下载
            </div>
        </div>

    </div>

</template>

<script lang="ts">
import {
    defineComponent, nextTick, reactive,
    ref, toRefs, computed, watch, onMounted
} from "vue";
import {convertToLetters} from "@/utils/common";
import useDesignTemplate from "@/views/preparation/learnPlanDesign/useDesignTemplate";
import {ElMessage} from "element-plus";
import {downloadPDF} from "@/utils/html2pdf.ts";

export default defineComponent({
    name: "TemplateOne",
    props: {
        isReview: {
            type: Boolean,
            default: false
        },
        isResourceReview: {
            type: Boolean,
            default: false
        },
        currentLearningGuidDetail: {
            type: Array,
            default: () => []
        }
    },
    emits: ["update:isReview", "addQuestionItem", "saveTemplateContent"],
    setup(props, {emit}) {
        const {
            templatePageData, lastPageNum, getEditer, templateInfo,
            addItem, setQuestionItem, currentAddItems, delItem, formateLearningGuidDetail
        } = useDesignTemplate(1);

        // 标题是否处在可编辑状态
        const isTitleEdit = ref(true);
        // 标题
        const titleRef = ref();

        // 点击标题进入编辑
        const titleClick = () => {
            isTitleEdit.value = true;
            nextTick(() => {
                console.log(titleRef.value)
                titleRef.value[0]?.focus();
            })
        };
        // 新增题目
        const addQuestionItem = (item: any) => {
            currentAddItems.value = item;
            emit("addQuestionItem")
        };
        // 关闭
        const close = () => {
            emit("update:isReview", false);
        };
        // 保存模板
        const saveTemplate = () => {
            console.log('templateInfo', templateInfo);
            const {Title, Class, Name, Time, Lesson} = templateInfo;
            const templateInfoArray = [
                {
                    id: "",
                    rowNumber: 1,
                    columnNumber: 1,
                    key: "标题",
                    value: Title,
                    questionIds: []
                },
                {
                    id: "",
                    rowNumber: 2,
                    columnNumber: 1,
                    key: "班级",
                    value: Class,
                    questionIds: []
                },
                {
                    id: "",
                    rowNumber: 2,
                    columnNumber: 2,
                    key: "姓名",
                    value: Name,
                    questionIds: []
                },
                {
                    id: "",
                    rowNumber: 2,
                    columnNumber: 3,
                    key: "时间",
                    value: Time,
                    questionIds: []
                },
                {
                    id: "",
                    rowNumber: 3,
                    columnNumber: 1,
                    key: "课时",
                    value: Lesson,
                    questionIds: []
                }
            ]

            // console.log('templateInfoArray', templateInfoArray);
            // console.log('templatePageData', templatePageData.value);
            const templatePageDataArray: any = [];

            templatePageData.value.forEach((item: any) => {
                item.Data?.forEach((page: any) => {
                    const templatePageDataItem = {
                        id: page.Id,
                        rowNumber: 1,
                        columnNumber: 1,
                        key: page.Name,
                        value: page.Content,
                        questionIds: page.questionIds,
                        height: page.ConHeight
                    }
                    templatePageDataArray.push(templatePageDataItem);
                })
            })
            templatePageDataArray.forEach((item: any, index: number) => {
                item.rowNumber = index + 4
            });
            const allPageData = templateInfoArray.concat(templatePageDataArray)
            // console.log('allPageData---', allPageData);
            emit("saveTemplateContent", allPageData)
        };
        watch(() => props.currentLearningGuidDetail, (val: any) => {
            if (val.length) {
                formateLearningGuidDetail(val, 1)
            }

        }, {deep: true, immediate: true});
        const downLoad = () => {
            // 获取需要下载的DOM元素
            emit("update:isReview", true);
            nextTick(() => {
                const domContent: any = document.querySelector('#review');
                downloadPDF(domContent, templateInfo.Title, () => {
                    console.log('保存为Pdf')
                    // ElMessage.success("保存成功")
                })
            })
        }
        return {
            ...toRefs(templateInfo),
            isTitleEdit,
            titleRef,
            lastPageNum,
            templatePageData,
            currentAddItems,
            titleClick,
            getEditer,
            addItem,
            delItem,
            close,
            setQuestionItem,
            convertToLetters,
            addQuestionItem,
            saveTemplate,
            formateLearningGuidDetail,
            downLoad

        }
    }
})
</script>

<style lang="scss" scoped>
.template-edit {
    width: 100%;
    height: calc(100% - 72px);
    overflow: auto;

    .edit-content {
        margin: 30px auto;
        width: 781px;
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
                    display: flex;
                    height: 78px;
                    align-items: center;
                    border-radius: 8px;

                    //.input-item {
                    //    display: flex;
                    //    align-items: center;
                    //    background: #f5f7fa;
                    //    padding: 0 16px;
                    //
                    //    .text {
                    //        color: #5F626F;
                    //        white-space: nowrap;
                    //    }
                    //
                    //    :deep(.el-input) {
                    //        height: 44px;
                    //        border-radius: 8px;
                    //
                    //        .el-input__wrapper {
                    //            box-shadow: none;
                    //        }
                    //
                    //        .el-input__inner {
                    //            color: #000000;
                    //            -webkit-text-fill-color: #000000;
                    //        }
                    //    }
                    //}

                    .input-item {
                        width: 100%;
                        height: 100%;
                        display: flex;
                        align-items: center;

                        .text {
                            margin-right: 12px;
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
                        color: #5F626F;
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
                        padding: 0 7px;
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
                                    color: #000;
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

    .content-review {
        margin: 0;
        box-shadow: none;

        .page-data {
            margin-top: 0;
        }

        .basic-info {
            .info-input {
                .input-item {
                    width: 100%;
                    height: 100%;

                    .text {
                        margin-right: 12px;
                    }
                }
            }
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

.template-review {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
    overflow: auto;

    .template-review-content {

        //position: absolute;
        //top: 4%;
        //left: 50%;
        //transform: translateX(-50%);
        position: fixed;
        top: 2%;
        left: 50%;
        transform: translateX(-50%);
        bottom: -50px;

        .close-icon {
            cursor: pointer;
            position: absolute;
            top: 30px;
            right: -55px;
        }

        .download {
            position: fixed;
            cursor: pointer;
            width: 96px;
            height: 32px;
            background: rgba(255, 255, 255, 0.16);
            border-radius: 16px;
            /* opacity: 0.5; */
            border: 1px solid #FFFFFF;
            font-size: 14px;
            color: #FFFFFF;
            display: flex;
            justify-content: center;
            align-items: center;
            right: -17%;
            bottom: 8%;
        }

        :deep(.template-edit) {
            .edit-content {
                .page-data {
                    color: #FFFFFF;
                }
            }
        }
    }


}

</style>
