<template>
    <div class="discuss">
        <div class="discuss-head">
            <span class="title">研讨内容</span>
            <div class="discuss-btn" @click="AddResearch">
                <img src="../../../../assets/preparationGroup/editPanel/discuss-btn.png" alt="" />
                <span>新增研讨</span>
            </div>
        </div>
        <div class="discuss-process">
            <p class="process-title">研讨流程</p>
            <div class="discuss-box">
                <div class="step-cycle" v-for="(item, index) in stepList" :key="index">
                    <div class="step-cell">
                        <span class="step">{{ index + 1 }}</span>
                        <div class="step-info">
                            <p>{{ item.title }}</p>
                            <p class="tip">{{ item.tip }}</p>
                        </div>
                    </div>
                    <span class="line" v-if="index !== stepList.length - 1"></span>
                </div>
            </div>
        </div>
        <div class="discuss-area">
            <div class="discuss-box-cell">
                <Area :content="item" :numorder="index" v-for="(item, index) in Contents" :key="index" @Modify="ModifyHandle"></Area>
            </div>
        </div>
        <AddResearchContent v-model:dialogVisible="dialogVisible" v-if="dialogVisible" @AddSuccess="AddSuccessHandle">></AddResearchContent>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import Area from "../area/index.vue";
import AddResearchContent from "../../popup-window/add-research-content.vue";
import useContents from "./useContents";
export default defineComponent({
    name: "discuss",
    props: {
        reload: {
            type: Function
        }
    },
    setup(props, { emit }) {
        console.log(props);
        console.log(emit);
        const route = useRoute();
        const dialogVisible = ref(false);
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

        const { Contents, getContents } = useContents();

        const submit = () => {
            console.log(1);
        };

        const AddResearch = () => {
            dialogVisible.value = true;
        };

        const AddSuccessHandle = () => {
            dialogVisible.value = false;
            fetchContents();
        };

        const ModifyHandle = () => {
            fetchContents();
        };

        const add = () => {
            console.log(1);
        };
        const fetchContents = () => {
            const preId = route.params.preId as string;
            const params = {
                id: preId
            };
            getContents(params);
        };

        onMounted(async () => {
            fetchContents();
        });

        return {
            ...toRefs(state),
            submit,
            add,
            AddResearch,
            AddSuccessHandle,
            fetchContents,
            ModifyHandle,
            dialogVisible,
            Contents
        };
    },
    components: { Area, AddResearchContent }
});
</script>

<style lang="scss" scoped>
.discuss {
    width: 100%;
    min-height: 220px;
    height: auto;
    background: #FFFFFF;
    border-radius: 8px;
    padding: 20px 24px;
    padding-bottom: 0.1px;
    .discuss-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px dashed #E0E2E7;
        padding-bottom: 24px;
        .title {
            font-size: 20px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #19203D;
        }
        .discuss-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 142px;
            height: 36px;
            background: #4B71EE;
            border-radius: 4px;
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
                color: #FFFFFF;
                margin-left: 10px;
            }
        }
    }
    .discuss-process {
        .process-title {
            font-size: 16px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #5F626F;
            line-height: 48px;
        }
        .discuss-box {
            display: flex;
            align-items: center;
            justify-content: space-between;
            .step-cycle {
                width: 27.5%;
                display: flex;
                align-items: center;
                justify-content: space-between;
                overflow: hidden;
                .step-cell {
                    display: flex;
                    align-items: center;
                    width: 75%;
                    .step {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        width: 48px;
                        height: 48px;
                        border: 1px solid #98AEF6;
                        border-radius: 50%;
                        text-align: center;
                        font-size: 20px;
                        font-family: PingFangSC-Semibold, PingFang SC;
                        font-weight: 600;
                        color: #4B71EE;
                    }
                    .step-info {
                        width: 224px;
                        margin-left: 16px;
                        font-size: 16px;
                        font-family: PingFangSC-Regular, PingFang SC;
                        font-weight: 400;
                        color: #19203D;
                        line-height: 24px;
                        .tip {
                            font-size: 14px;
                            font-family: PingFangSC-Regular, PingFang SC;
                            font-weight: 400;
                            color: #5F626F;
                            line-height: 18px;
                        }
                    }
                }
            }
            .line {
                display: inline-block;
                width: 20%;
                margin-right: 5.5%;
                height: 2px;
                background: #E9ECF0;
            }
        }
    }
    .discuss-area {
        .discuss-box-cell {
            margin-top: 30px;
        }
    }
}
</style>
