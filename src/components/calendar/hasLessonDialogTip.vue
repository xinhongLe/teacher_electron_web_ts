<template>
    <div class="custom-dialog">
        <el-dialog center width="40vw" :model-value="hasLessonVisible" @close="close()">
            <template #title>
                <div class="custom-header">
                    提示
                </div>
            </template>
            <div class="tip-box">
                <img src="@/assets/images/preparation/icon_tips_popup.png" alt="">
                该课程已排课包，请选择您希望的操作
            </div>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="replace()"> 替换 </el-button>
                    <el-button type="primary" @click="addTo()"> 添加 </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
export default defineComponent({
    props: {
        hasLessonVisible: {
            type: Boolean,
            default: false
        }
    },
    emits: ["update:hasLessonVisible"],
    setup(props, { emit }) {

        const close = () => {
            emit("update:hasLessonVisible", false);
        };
        const replace = async () => {

            emit("update:hasLessonVisible", false);
        };
        const addTo = async () => {

            emit("update:hasLessonVisible", false);
        }

        return {
            close,
            addTo,
            replace
        }
    }
});
</script>

<style lang="scss" scoped>
.custom-dialog {
    :deep(.el-dialog) {
        .el-dialog__header {
            .custom-header {
                font-size: 20px;
                font-weight: 600;
                color: #19203D;
            }
        }

        .el-dialog__footer {
            padding: 0;

            .dialog-footer {
                background: #FFFFFF;
                border-radius: 0px 0px 8px 8px;
                width: 100%;
                text-align: right;
                padding: 16px 24px;
                border-bottom: 1px #F5F6FA;

                .el-button {
                    background: #4B71EE;
                    min-width: 200px;
                }
            }
        }

    }
}
</style>
