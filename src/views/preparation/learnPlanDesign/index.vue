<template>
    <div class="learndesign">
        <!--导学案涉及选择框-->
        <el-dialog
            v-if="learnSelectVisible"
            class="custom-dialog"
            v-model="learnSelectVisible"
            title="导学案设计"
            width="696px"
            align-center
            center
            :destroy-on-close="true"
            @close="close"
        >
            <div class="learn-plan-design">
                <div class="left-template">
                    <div class="template-view">
                        <div class="template-img-1">
                            <div class="top">
                                <img src="@/assets/images/preparation/learndesign/icon_muban.png" alt="">
                                <span>模板一</span>
                            </div>
                            <img src="@/assets/images/preparation/learndesign/pic_muban1.png" alt="">
                            <div class="template-hover">
                                <div class="view" @click="reviewTemplate(1)">预览模板</div>
                                <div class="use" @click="useCurrentTemplate(1)">直接使用</div>
                            </div>
                        </div>
                        <div class="template-img-2" style="margin-right: 0">
                            <div class="top">
                                <img src="@/assets/images/preparation/learndesign/icon_muban.png" alt="">
                                <span>模板二</span>
                            </div>
                            <img src="@/assets/images/preparation/learndesign/pic_muban2.png" alt="">

                            <div class="template-hover">
                                <div class="view" @click="reviewTemplate(2)">预览模板</div>
                                <div class="use" @click="useCurrentTemplate(2)">直接使用</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </el-dialog>

        <!--模板预览界面-->
        <el-dialog
            v-if="viewVisible"
            class="custom-dialog"
            v-model="viewVisible"
            :title="currentTitle"
            width="790px"
            align-center
            center
            :destroy-on-close="true"
            @close="closeView"
        >
            <div class="template-view">
                <img v-if="reviewType === 1" src="@/assets/images/preparation/learndesign/pic_,muban1.png" alt="">
                <img v-else src="@/assets/images/preparation/learndesign/pic_,muban2.png" alt="">
            </div>
            <template #footer>
                  <span class="dialog-footer">
<!--                    <el-button @click="dialogFormVisible = false">Cancel</el-button>-->
                    <el-button type="primary" @click="useCurrentTemplate(reviewType)">
                      使用模板
                    </el-button>
                  </span>
            </template>
        </el-dialog>
    </div>

</template>

<script lang="ts">
import {
    defineComponent,
    ref,
} from "vue";
import {useRouter, useRoute} from "vue-router";

export default defineComponent({
    name: "index",
    props: {
        learnSelectVisible: {
            type: Boolean,
            default: false
        },
        resourceData: {
            type: Object,
            default: {}
        }
    },
    emits: ["update:learnSelectVisible", "openEditTemplate"],
    setup(props, {emit}) {
        // 路由
        const router = useRouter();
        // 预览弹框
        const viewVisible = ref(false);
        // 当前模板标题
        const currentTitle = ref("");
        // 关闭弹框
        const close = () => {
            emit("update:learnSelectVisible")
        }
        // 模板类型
        const reviewType = ref(0);
        // 预览模板
        const reviewTemplate = (type: number) => {
            reviewType.value = type;
            viewVisible.value = true;
            currentTitle.value = `模板${type === 1 ? '一' : '二'}`
        }
        // 直接使用模板
        const useCurrentTemplate = (type: number) => {
            viewVisible.value = false
            // 跳转到模板编辑界面
            emit("openEditTemplate", type);
        }
        // 关闭预览弹框
        const closeView = () => {
            viewVisible.value = false
        }

        return {
            currentTitle,
            viewVisible,
            reviewType,
            close,
            reviewTemplate,
            useCurrentTemplate,
            closeView
        }
    }
})
</script>

<style lang="scss" scoped>
.learndesign {
    :deep(.el-dialog) {
        border-radius: 8px;

        .el-dialog__header {
            padding: 20px;

            .el-dialog__title {
                font-size: 20px;
            }

            .el-dialog__headerbtn {
                width: 30px;
                height: 30px;
                border-radius: 50%;
            }
        }

        .el-dialog__body {
            background: #F5F6FA !important;
            min-height: 406px;
            max-height: 80vh;
            overflow: auto;
        }
    }
}


.learn-plan-design {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 351px;

    .left-template {

        .title {
            margin-bottom: 20px;
            font-size: 16px;
        }

        .template-view {
            display: flex;
            align-items: center;

            .template-img-1, .template-img-2 {
                display: flex;
                flex-direction: column;
                //align-items: center;
                margin-right: 32px;
                width: 228px;
                height: 246px;
                background: #FFFFFF;
                box-shadow: 0px 8px 19px 0px rgba(0, 0, 0, 0.05);
                border-radius: 8px;
                padding: 16px;
                position: relative;

                .top {
                    margin-bottom: 16px;
                    display: flex;
                    align-items: center;

                    span {
                        padding-left: 2px;
                    }
                }

                .template-hover {
                    display: none;
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    background: rgba(255, 255, 255, 0.5);
                    left: 0;
                    top: 0;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;

                    .view, .use {
                        cursor: pointer;
                        width: 96px;
                        height: 32px;
                        background: #FFFFFF;
                        border-radius: 4px;
                        border: 1px solid #4B71EE;
                        line-height: 32px;
                        text-align: center;
                        font-size: 14px;
                        font-weight: 400;
                        color: #4B71EE;
                    }

                    .use {
                        background: #4B71EE;
                        margin-top: 16px;
                        color: #FFFFFF;
                    }
                }

            }

            .template-img-1 {
                &:hover {
                    .template-hover {
                        display: flex;
                    }
                }
            }

            .template-img-2 {
                &:hover {
                    .template-hover {
                        display: flex;
                    }
                }
            }
        }


    }

    .right-template {
    }

}

.template-view {
    text-align: center;
}
</style>
