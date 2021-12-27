<template>
    <div class="area">
        <div class="area-head">
            <div class="tag">
                <div class="tag-1"></div>
                <div class="tag-2"></div>
                <div class="tag-3"></div>
            </div>
            <span class="title">研讨一</span>
        </div>
        <div class="area-body">
            <div class="title-box">
                <div>
                    <span class="title">认识长方形与正方形</span>
                    <span class="title-status title-status-1">教案设计</span>
                </div>
                <div class="edit-btn">
                    <img src="../../../../assets/preparationGroup/editPanel/edit.png" alt="">
                    <span>编辑</span>
                </div>
            </div>
            <p class="teacher-box">
                <img src="../../../../assets/preparationGroup/editPanel/avator_small.png" alt="">
                <span>林老师 于2021-12-12 08:35上传教案</span>
            </p>
            <div class="area-lesson">
                <div class="left">
                    <div>
                        <div class="box-item box-item-1">
                            <img src="../../../../assets/preparationGroup/editPanel/icon_jiaoan.png" alt="">
                            <p>教案</p>
                            <p class="time">2021-12-12 08:35</p>
                        </div>
                        <div class="tools">
                            <div class="tool-item">
                                <img src="../../../../assets/preparationGroup/editPanel/view.png" alt="">
                                <span>查看</span>
                            </div>
                            <div class="tool-item">
                                <img src="../../../../assets/preparationGroup/editPanel/down.png" alt="">
                                <span>下载</span>
                            </div>
                            <div class="tool-item">
                                <img src="../../../../assets/preparationGroup/editPanel/up.png" alt="">
                                <span>再次上传</span>
                            </div>
                        </div>
                    </div>
                    <img class="arrow" src="../../../../assets/preparationGroup/editPanel/right.png" alt="">
                    <div>
                        <div class="box-item box-item-2">
                            <img src="../../../../assets/preparationGroup/editPanel/icon_jiaoan.png" alt="">
                            <p>教案终稿</p>
                            <p class="time">2021-12-12 08:35</p>
                        </div>
                        <div class="tools">
                            <div class="tool-item">
                                <img src="../../../../assets/preparationGroup/editPanel/view.png" alt="">
                                <span>查看</span>
                            </div>
                            <div class="tool-item">
                                <img src="../../../../assets/preparationGroup/editPanel/down.png" alt="">
                                <span>下载</span>
                            </div>
                            <div class="tool-item">
                                <img src="../../../../assets/preparationGroup/editPanel/up.png" alt="">
                                <span>再次上传</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="right">
                    <div class="title-box">
                        <div class="title-left">
                            <p class="title">内容摘要</p>
                            <p class="content">本节课的设计依据课标和学生自身特点重组教材内容，以学生操作中获取新知，注重教本节课的设计依据课标和学生自身特点重组教材...<span class="more">阅读全部</span></p>
                        </div>
                        <div class="title-right">
                            <div class="btn">
                                <img src="../../../../assets/preparationGroup/editPanel/plus.png" alt="">
                                <span>添加批注</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from "vue";
export default defineComponent({
    name: "area",
    props: {
        reload: {
            type: Function
        }
    },
    setup(props, { emit }) {
        console.log(props);
        console.log(emit);
        const state = reactive({
            stepList: [
                {
                    title: "上传教案/课件初稿",
                    tip: "点击【新增研讨】，填写备课内容及上传资料"
                },
                {
                    title: "在线/线下进行研讨",
                    tip: "小组成员可通过在线或线下对教案/课件进行反馈"
                },
                {
                    title: "更新教案/课件",
                    tip: "研讨对象上传者根据反馈修改教案/课件"
                },
                {
                    title: "形成教案/课件终稿",
                    tip: "研讨对象上传者上传修改后的教案/课件，支持查看、下载和再次上传"
                }
            ]
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
    components: { }
});
</script>

<style lang="scss" scoped>
.area {
    width: 100%;
    min-height: 380px;
    height: auto;
    background: #F9F9FB;
    border-radius: 8px;
    border: 1px solid #E9ECF0;
    .area-head {
        display: flex;
        align-items: center;
        height: 62px;
        background: linear-gradient(270deg, #F9F9FB 0%, #EBEEFA 100%);
        border-radius: 8px 8px 0px 0px;
        padding-left: 25px;
        .tag {
            display: flex;
            align-items: center;
            > div {
                margin-right: 2px;
            }
            &-1 {
                width: 5px;
                height: 24px;
                background: #4B71EE;
            }
            &-2 {
                width: 5px;
                height: 20px;
                background: #4B71EE;
                opacity: 0.5;
            }
            &-3 {
                width: 5px;
                height: 16px;
                background: #4B71EE;
                opacity: 0.2;
            }
        }
        .title {
            font-size: 24px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #4B71EE;
            margin-left: 25px;
        }
    }
    .area-body {
        height: calc(100% - 62px);
        padding: 24px;
        .title-box {
            display: flex;
            align-items: center;
            justify-content: space-between;
            .title {
                font-size: 20px;
                font-family: PingFangSC-Semibold, PingFang SC;
                font-weight: 600;
                color: #19203D;
            }
            .title-status {
                display: inline-block;
                min-width: 60px;
                width: auto;
                height: 24px;
                line-height: 24px;
                border-radius: 4px;
                font-size: 12px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                text-align: center;
                margin-left: 10px;
                &-1 {
                    color: #48DBBF;
                    border: 1px solid #48DBBF;
                }
                &-2 {
                    color: #4B71EE;
                    border: 1px solid #4B71EE;
                }
            }
            .edit-btn {
                display: flex;
                align-items: center;
                cursor: pointer;
                span {
                    font-size: 16px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #4B71EE;
                    margin-left: 5px;
                }
            }
        }
        .teacher-box {
            display: flex;
            align-items: center;
            line-height: 48px;
            border-bottom: 1px dashed #E0E2E7;
            img {
                display: inline-block;
                width: 24px;
                height: auto;
            }
            span {
                font-size: 14px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #5F626F;
                margin-left: 10px;
            }
        }
        .area-lesson {
            padding: 24px 0;
            display: flex;
            .left {
                display: flex;
                align-items: center;
                .box-item {
                    width: 208px;
                    height: 139px;
                    border-radius: 8px;
                    padding: 24px;
                    &-1 {
                        background: #48DBBF;
                    }
                    &-2 {
                        background: #C160E0;
                    }
                    img {
                        display: inline-block;
                        width: 24px;
                        height: auto;
                        margin-bottom: 20px;
                    }
                    p {
                        font-size: 18px;
                        font-family: PingFangSC-Semibold, PingFang SC;
                        font-weight: 600;
                        color: #FFFFFF;
                    }
                    .time {
                        font-size: 14px;
                        font-weight: 400;
                        margin-top: 10px;
                    }
                }
                .tools {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 16px 0;
                    .tool-item {
                        display: flex;
                        align-items: center;
                        cursor: pointer;
                        img {
                            display: inline-block;
                            width: 12px;
                            height: auto;
                        }
                        span {
                            font-size: 14px;
                            font-family: PingFangSC-Regular, PingFang SC;
                            font-weight: 400;
                            color: #4B71EE;
                            margin-left: 5px;
                        }
                        &::after {
                            content: ' ';
                            width: 1px;
                            height: 14px;
                            border: 1px solid #E0E2E7;
                            margin: 0 5px;
                        }
                        &:last-child::after {
                            display: none;
                        }
                    }
                }
                .arrow {
                    margin: 0 16px;
                }
            }
            .right {
                padding-left: 60px;
                width: calc(100% - 260px);
                .title-box {
                    display: flex;
                    justify-content: space-between;
                    .title-left {
                        .title {
                            font-size: 16px;
                            font-family: PingFangSC-Regular, PingFang SC;
                            font-weight: 400;
                            color: #19203D;
                            margin-bottom: 8px;
                        }
                        .content {
                            font-size: 14px;
                            font-family: PingFangSC-Regular, PingFang SC;
                            font-weight: 400;
                            color: #5F626F;
                        }
                        .more {
                            font-size: 14px;
                            font-family: PingFangSC-Regular, PingFang SC;
                            font-weight: 400;
                            color: #4B71EE;
                            cursor: pointer;
                        }
                    }
                    .title-right {
                        .btn {
                            width: 118px;
                            height: 36px;
                            line-height: 36px;
                            text-align: center;
                            border-radius: 4px;
                            border: 1px solid #98AEF6;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            cursor: pointer;
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
            }
        }
    }
}
</style>
