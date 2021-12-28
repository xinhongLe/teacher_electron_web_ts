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
                <div class="btn-cancel" @click="isEdit = false" v-if="isEdit">
                    <span>取消</span>
                </div>
                <div class="btn-save" v-if="isEdit">
                    <span>保存</span>
                </div>
                <div class="btn-edit" @click="isEdit = true" v-else>
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
            <div class="file-cell">
                <img src="../../../../assets/preparationGroup/editPanel/pointer.png" alt="" />
                <span>备课范围：</span>
                <span class="content">数学 苏教版 三上</span>
            </div>
            <div class="file-cell">
                <img src="../../../../assets/preparationGroup/editPanel/book.png" alt="" />
                <span>备课内容：</span>
                <span class="content textarea-content" v-if="isEdit">
                    <el-input v-model="lessonItem.content" :rows="3" type="textarea" placeholder="" resize="none"/>
                </span>
                <span class="content special-content" v-else>{{ lessonItem.content }}<span class="more">阅读全部</span></span>
            </div>
            <div class="file-cell">
                <img src="../../../../assets/preparationGroup/editPanel/file.png" alt="" />
                <span>教研资料：</span>
                <span class="content flex-wrap">
                    <div class="btn-upload">
                        <img src="../../../../assets/preparationGroup/editPanel/icon_upload.png" alt="">
                        <span>上传文件</span>
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
import { defineComponent, reactive, toRefs } from "vue";
import File from "../../file/index.vue";
export default defineComponent({
    name: "head-info",
    props: {
        reload: {
            type: Function
        }
    },
    setup(props, { emit }) {
        console.log(props);
        console.log(emit);
        const state = reactive({
            isEdit: false,
            lessonItem: {
                title: "第3单元 长方形和正方形",
                creator: "林老师",
                createTime: "2021-12-20 16:06",
                num: 5,
                grade: "",
                version: "",
                subject: "",
                content: "1、初步认识长方形和正方形，会找出它们的特征，并且会利用特征来进行正确的判断",
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

        const submit = () => {
            console.log(1);
        };

        const add = () => {
            console.log(1);
        };
        return {
            ...toRefs(state),
            submit,
            add
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
            }
            .btn-upload {
                width: 116px;
                height: 40px;
                border-radius: 4px;
                opacity: 0.5;
                border: 1px solid #3B62F4;
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
                }
            }
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
