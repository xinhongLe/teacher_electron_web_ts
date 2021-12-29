<template>
    <div class="head-info">
        <div class="head-title">
            <div class="left" v-if="isEdit">
                <el-input class="input-title" v-model="lessonItem.title" placeholder=""></el-input>
            </div>
            <div class="left" v-else>
                <span class="title">{{ lessonItem.title }}</span>
                <span :class="`status status-2`"><span class="white"></span>正在进行</span>
            </div>
            <div class="right">
                <div class="btn-cancel" @click="actionEditPanel(false)" v-if="isEdit">
                    <span>取消</span>
                </div>
                <div class="btn-save" v-if="isEdit">
                    <span>保存</span>
                </div>
                <div class="btn-edit" @click="actionEditPanel(true)" v-else>
                    <img src="../../../../assets/preparationGroup/editPanel/edit.png" alt="" />
                    <span>编辑</span>
                </div>
            </div>
        </div>
        <div class="lesson-info">
            <div class="lesson-cell">
                <img src="../../../../assets/preparationGroup/editPanel/persion.png" alt="" />
                <span>创建人：{{ lessonItem.creator }}</span>
            </div>
            <div class="lesson-cell">
                <img src="../../../../assets/preparationGroup/editPanel/time.png" alt="" />
                <span>创建时间：{{ lessonItem.createTime }}</span>
            </div>
            <div class="lesson-cell">
                <img src="../../../../assets/preparationGroup/editPanel/personals.png" alt="" />
                <span>小组人数：{{ lessonItem.num }}人</span>
            </div>
        </div>
        <div class="file-info">
            <div class="file-cell" :class="isEdit ? `align-items` : ''">
                <img src="../../../../assets/preparationGroup/editPanel/pointer.png" alt="" />
                <span>备课范围：</span>
                <div class="content" :class="isEdit ? `padding-left` : ''" v-if="isEdit">
                    <el-cascader
                        v-model="lessonItem.range"
                        :options="textBookGradeList"
                        :props="{expandTrigger: 'hover'}"
                        @change="handleChange"
                    ></el-cascader>
                </div>
                <span v-else class="content">数学 苏教版 一上</span>
            </div>
            <div class="file-cell">
                <img src="../../../../assets/preparationGroup/editPanel/book.png" alt="" />
                <span>备课内容：</span>
                <span class="content textarea-content" v-if="isEdit">
                    <el-input v-model="lessonItem.content" :rows="3" type="textarea" placeholder="" resize="none"/>
                </span>
                <span class="content special-content" :class="isShowMore ? `` : `clamp`" :title="lessonItem.content" v-else>
                    {{ lessonItem.content }}
                    <span class="more" v-if="!isShowMore" @click="isShowMore = true">
                        <span class="dot">...</span>阅读全部
                    </span>
                    <span class="mores" v-else @click="isShowMore = false">
                        收起全部
                    </span>
                </span>
            </div>
            <div class="file-cell">
                <img src="../../../../assets/preparationGroup/editPanel/file.png" alt="" />
                <span>教研资料：</span>
                <span class="content flex-wrap">
                    <div style="width: 100%;margin-bottom: 12px;" v-if="isEdit">
                        <div class="btn-upload">
                            <img src="../../../../assets/preparationGroup/editPanel/icon_upload.png" alt="">
                            <span>上传文件</span>
                        </div>
                    </div>
                    <div class="file-item" v-for="(item, index) in lessonItem.fileList" :key="index">
                        <File :fileInfo="item"></File>
                    </div>
                </span>
            </div>

        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, getCurrentInstance, onMounted } from "vue";
import useSubmit from "../useSubmit";
import File from "../../file/index.vue";
export default defineComponent({
    name: "head-info",
    props: {
        reload: {
            type: Function
        }
    },
    setup(props, { emit }) {
        const { proxy } = getCurrentInstance() as any;
        console.log(props);
        console.log(emit);
        const state = reactive({
            isEdit: false,
            isShowMore: false,
            options: [
                {
                    value: "navigation",
                    label: "Navigation",
                    children: [
                        {
                            value: "side nav",
                            label: "Side Navigation",
                            children: [
                                {
                                    value: "side nav",
                                    label: "Side Navigation"
                                },
                                {
                                    value: "top nav",
                                    label: "Top Navigation"
                                }
                            ]
                        },
                        {
                            value: "top nav",
                            label: "Top Navigation"
                        }
                    ]
                }
            ],
            lessonItem: {
                title: "第3单元 长方形和正方形",
                creator: "林老师",
                createTime: "2021-12-20 16:06",
                num: 5,
                range: ["39F766472E16F43AE0EAE334481AF7BA", "39F7666AAF66E4DC95726D72374B09E6", "39F766472E575A8BCBF9F8B9B8888387"],
                grade: "",
                version: "",
                subject: "",
                content: "1、初步认识长方形和正方形，会找出它们的特征，并且会利用特征来进行正确的判断； 2、通过学生的操作探索活动，培养学生学习数学的兴趣； 3、培养学生的初步动手能力和与人合作的习惯。 4、集体备课由教学处（或教科研室）实施管理。一般由教研组长具体主持集体备课活动；公共科和规模较大、门类较多的专业教研组可分成若干备课组，由备课组长负责具体实施，教研组长指导并参加各小组的备课活动。 5、集中研讨即组长在集体备课时间里召集本组教师提出备课要求，听取中心发言人的发言，讨论备课提纲。讨论中心发言人提出备课提纲时",
                fileList: [
                    {
                        fileType: "word",
                        fileName: "认识长方形",
                        extend: "doc",
                        size: "310.79K"
                    },
                    {
                        fileType: "pdf",
                        fileName: "认识长方形",
                        extend: "pdf",
                        size: "7.42MB"
                    }
                ]
            }
        });

        const actionEditPanel = (val: boolean) => {
            state.isEdit = val;
            proxy.mittBus.emit("watchStatus", state.isEdit);
        };

        const handleChange = () => {
            console.log(1);
        };
        const { textBookGradeList, getTextBookGrade } = useSubmit();

        onMounted(() => {
            getTextBookGrade();
        });
        return {
            ...toRefs(state),
            actionEditPanel,
            textBookGradeList,
            handleChange
        };
    },
    components: { File }
});
</script>

<style lang="scss" scoped>
.head-info {
    width: 100%;
    height: auto;
    min-height: 340px;
    padding: 24px;
    user-select: none;
    background-color: #fff;
    .head-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 38px;
        .left {
            display: flex;
            align-items: center;
            .title {
                font-size: 24px;
                font-family: PingFangSC-Semibold, PingFang SC;
                font-weight: 600;
                color: #19203D;
            }
            .status {
                display: flex;
                align-items: center;
                width: auto;
                min-width: 64px;
                height: 24px;
                line-height: 24px;
                padding: 0 5px;
                border-radius: 4px;
                text-align: center;
                font-size: 12px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                text-align: center;
                margin-left: 12px;
                &-1 {
                    background: #E9EDF0;
                    color: #B2B8BE;
                }
                &-2 {
                    background: #F5A10E;
                    color: #fff;
                }
            }
            .white {
                display: inline-block;
                width: 5px;
                height: 5px;
                border-radius: 50%;
                background-color: #fff;
                margin-right: 5px;
            }
            .input-title {
                display: inline-block;
                :deep(.el-input__inner) {
                    width: 510px;
                    height: 48px;
                    font-size: 24px;
                    font-family: PingFangSC-Semibold, PingFang SC;
                    font-weight: 600;
                    color: #19203D;
                }
            }
        }
        .right {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            .btn-cancel {
                width: 120px;
                height: 36px;
                line-height: 36px;
                text-align: center;
                background: #FFFFFF;
                border-radius: 4px;
                border: 1px solid #E0E2E7;
                font-size: 16px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #19203D;
                cursor: pointer;
                &:hover {
                    border: 1px solid #4B71EE;
                    color: #4B71EE;
                }
            }
            .btn-save {
                width: 120px;
                height: 36px;
                line-height: 36px;
                text-align: center;
                background: #4B71EE;
                border-radius: 4px;
                font-size: 16px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #FFFFFF;
                margin-left: 24px;
                cursor: pointer;
            }
            .btn-edit {
                display: flex;
                align-items: center;
                cursor: pointer;
                img {
                    display: inline-block;
                    width: 16px;
                    height: auto;
                }
                span {
                    font-size: 16px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #4B71EE;
                    margin-left: 5px;
                }
            }
        }
    }
    .lesson-info {
        display: flex;
        align-items: center;
        border-bottom: 1px solid #E9ECF0;
        padding: 16px 0;
        .lesson-cell {
            display: flex;
            align-items: center;
            margin-right: 40px;
            img {
                display: inline-block;
                width: 16px;
                height: auto;
            }
            span {
                font-size: 14px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #5F626F;
                margin-left: 5px;
            }
        }
    }
    .file-info {
        display: flex;
        flex-direction: column;
        padding: 16px 0;
        .file-cell {
            display: flex;
            align-items: flex-start;
            margin-top: 16px;
            img {
                display: inline-block;
                width: 16px;
                height: auto;
            }
            span {
                font-size: 14px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #5F626F;
                margin-left: 5px;
                min-width: 80px;
            }
            .content {
                color: #19203D;
            }
            .special-content {
                line-height: 24px;
                margin-top: -5px;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                word-break: break-all;
                position: relative;
            }
            .clamp {
                -webkit-line-clamp: 1;
                -webkit-box-orient: vertical;
            }
            .textarea-content {
                width: 100%;
            }
            .more {
                font-size: 14px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #4B71EE;
                cursor: pointer;
                position: absolute;
                right: 0;
                bottom: 0;
                overflow: hidden;
                background: #fff;
                padding: 0 5px;
                .dot {
                    font-weight: 400;
                    color: #5F626F;
                    margin: 0 15px 0 0;
                }
            }
            .mores {
                font-size: 14px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #4B71EE;
                cursor: pointer;
            }
            .btn-upload {
                width: 116px;
                height: 40px;
                border-radius: 4px;
                border: 1px solid rgba(75, 113, 238, 0.5);
                text-align: center;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                img {
                    display: inline-block;
                    width: 12px;
                    height: auto;
                }
                span {
                    font-size: 16px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #3B62F4;
                    display: inline-block;
                    margin: 0;
                    min-width: 70px;
                }
            }
            .padding-left {
                padding-left: 5px;
            }
        }
        .align-items {
            align-items: center;
        }
    }
    .flex-wrap {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
    }
    .file-item {
        margin-right: 10px;
        margin-bottom: 10px;
    }
}
</style>
