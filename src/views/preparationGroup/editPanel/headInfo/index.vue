<template>
    <div class="head-info">
        <div class="head-title">
            <span class="title">第3单元 长方形和正方形</span>
            <span :class="`status status-2`"><span class="white"></span>正在进行</span>
        </div>
        <div class="lesson-info">
            <div class="lesson-cell">
                <img src="../../../../assets/preparationGroup/editPanel/persion.png" alt="" />
                <span>创建人：林老师</span>
            </div>
            <div class="lesson-cell">
                <img src="../../../../assets/preparationGroup/editPanel/time.png" alt="" />
                <span>创建时间：2021-12-20 16:06</span>
            </div>
            <div class="lesson-cell">
                <img src="../../../../assets/preparationGroup/editPanel/personals.png" alt="" />
                <span>小组人数：5人</span>
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
                <span class="content special-content">1、初步认识长方形和正方形，会找出它们的特征，并且会利用特征来进行正确的判断； 2、通过学生的操作探索活动，培养学生学习数学的兴趣； 3、培养学生的初步动手能力和与人合作的习惯。 4、集体备课由教学处（或教科研室）实施管理。一般由教研组长具体主持集体备课活动；公共科和规模较大、门类较多的专业教研组可分成若干备课组，由备课组长负责具体实施，教研组长指导并参加各小组的备课活动。 5、集中研讨即组长在集体备课时间里召集本组教师提出备课要求，听取中心发言人的发言，讨论备课提纲。讨论中心发言人提出备课提纲时...<span class="more">阅读全部</span></span>
            </div>
            <div class="file-cell">
                <img src="../../../../assets/preparationGroup/editPanel/file.png" alt="" />
                <span>教研资料：</span>
                <span class="content flex-wrap">
                    <div class="file-item" v-for="(item, index) in fileList" :key="index">
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
                },
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
                },
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
                },
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
    }
    .lesson-info {
        display: flex;
        align-items: center;
        border-bottom: 1px solid #E9ECF0;
        margin-top: 4px;
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
            .more {
                font-size: 14px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #4B71EE;
                cursor: pointer;
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
