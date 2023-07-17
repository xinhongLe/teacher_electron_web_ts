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
                                <img src="@/assets/images/preparation/icon_muban.png" alt="">
                                <span>模板一</span>
                            </div>
                            <img src="@/assets/images/preparation/pic_muban1.png" alt="">
                            <div class="template-hover">
                                <div class="view">预览模板</div>
                                <div class="use">直接使用</div>
                            </div>
                        </div>
                        <div class="template-img-2" style="margin-right: 0">
                            <div class="top">
                                <img src="@/assets/images/preparation/icon_muban.png" alt="">
                                <span>模板二</span>
                            </div>
                            <img src="@/assets/images/preparation/pic_muban2.png" alt="">

                            <div class="template-hover">
                                <div class="view">预览模板</div>
                                <div class="use">直接使用</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="right-template" v-if="false">

                </div>
            </div>

        </el-dialog>
    </div>

</template>

<script lang="ts">
import {
    computed,
    defineComponent,
    onUnmounted,
    PropType,
    reactive,
    ref,
    toRefs,
    watch,
    nextTick
} from "vue";

export default defineComponent({
    name: "index",
    props: {
        learnSelectVisible: {
            type: Boolean,
            default: false
        }
    },
    emits: ["update:learnSelectVisible"],
    setup(props, {emit}) {

        const close = () => {
            emit("update:learnSelectVisible")
        }

        return {
            close
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
            padding-top: 72px;
            padding-bottom: 72px;
        }
    }
}


.learn-plan-design {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

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
</style>
