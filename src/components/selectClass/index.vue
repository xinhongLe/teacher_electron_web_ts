<template>
    <div class="class-dialog">
        <el-dialog center width="40vw" :model-value="classVisible" @close="close()">
            <template #title>
                <div class="class-header">
                    点击选择上课班级
                </div>
            </template>
            <div class="is-class" v-if="false">
                <el-checkbox-group v-model="checkedClassList">
                    <el-checkbox label="Option A" />
                    <el-checkbox label="Option B" />
                    <el-checkbox label="Option C" />
                    <el-checkbox label="disabled" disabled />
                    <el-checkbox label="selected and disabled" disabled />
                </el-checkbox-group>
            </div>
            <div class="no-class">
                <img src="@/assets/images/preparation/pic_noclass.png" alt="">
                <span>您还没有班级</span>
                <div class="no-class-button">
                    <el-button type="primary" @click="sure()"> 确定 </el-button>
                </div>
            </div>
            <template #footer v-if="false">
                <div class="dialog-footer">
                    <el-button type="primary" @click="sure()"> 确定 </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
export default defineComponent({
    props: {
        classVisible: {
            type: Boolean,
            default: false
        }
    },
    emits: ["onDeletePackage", "update:classVisible"],
    setup(props, { emit }) {
        const checkedClassList = ref([]);
        const close = () => {
            emit("update:classVisible", false);
        };
        const sure = async () => {
            emit("onDeletePackage");
            emit("update:classVisible", false);
        }
        return {
            checkedClassList,
            close,
            sure
        }
    }
});
</script>

<style lang="scss" scoped>
.class-dialog {
    :deep(.el-dialog) {
        .el-dialog__header {
            .class-header {
                font-size: 20px;
                font-weight: 600;
                color: #19203D;
            }
        }

        .no-class {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            > span {
                padding: 28px 0;
                font-size: 20px;
                font-weight: 400;
                color: #5F626F;
            }

            .no-class-button {
                .el-button {
                    background: #4B71EE;
                    min-width: 200px;
                }
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
