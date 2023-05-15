<template>
    <div class="custom-dialog">
        <el-dialog center width="30vw" :model-value="deleteLessonVisible" @close="close()">
            <template #header>
                <div class="custom-header">
                    提示
                </div>
            </template>
            <div class="tip-box">
                <img src="@/assets/images/preparation/icon_tips_popup.png" alt="">
                <p>
                    发现此课程有多个课包，请确认要删除的课包
                </p>
            </div>
            <div class="lesson-check">
                <el-checkbox size="large" v-model="checkAll" @change="handleCheckAllChange"
                    :indeterminate="isIndeterminate">全选</el-checkbox>
                <el-checkbox-group v-model="checkedLesson" @change="handleCheckedLessonChange">
                    <el-checkbox size="large" v-for="item in currentPackageList" :label="item.PackageId">{{
                        item.LessonName + ' ' + item.PackageName
                    }}</el-checkbox>
                </el-checkbox-group>
            </div>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="sureDelete()"> 确认删除 </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts" setup>
import { defineComponent, ref, PropType, computed } from "vue";
import { IPackageExtDto } from "@/api/prepare"
const props = defineProps({
    deleteLessonVisible: {
        type: Boolean,
        default: false
    },
    currentPackageList: {
        type: Array as PropType<IPackageExtDto[]>,
        default: () => ([]),
    }
});
const currentPackageList = computed(() => props.currentPackageList)
const emits = defineEmits(["update:deleteLessonVisible", "sureDeletePackage"]);

const checkAll = ref(false);// 全选状态
const checkedLesson = ref<any[]>();// 选中的课程包
const isIndeterminate = ref(false);

// 全选改变
const handleCheckAllChange = (val: boolean) => {
    checkedLesson.value = val ? currentPackageList.value.map((item) => item.PackageId) : []
    isIndeterminate.value = false
};
// 选中课程包改变
const handleCheckedLessonChange = (value: string[]) => {
    const checkedCount = value.length
    checkAll.value = checkedCount === currentPackageList.value.length
    isIndeterminate.value = checkedCount > 0 && checkedCount < currentPackageList.value.length
};

const close = () => {
    checkedLesson.value = []
    emits("update:deleteLessonVisible", false);
};
const sureDelete = async () => {
    if (!checkedLesson.value?.length) return;
    emits("sureDeletePackage", checkedLesson.value);
    emits("update:deleteLessonVisible", false);
};

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

        .tip-box {
            font-weight: 500;
            display: flex;
            align-items: center;

            p {
                margin-left: 24px;
                font-size: 18px;
                color: #212743;
                line-height: 24px;
            }
        }

        .lesson-check {
            padding: 20px 50px;

            >.el-checkbox {
                margin-bottom: 6px;
            }

            .el-checkbox-group {
                .el-checkbox {
                    display: block;
                }
            }
        }

        .el-dialog__footer {
            padding: 0;

            .dialog-footer {
                background: #FFFFFF;
                border-radius: 0px 0px 8px 8px;
                width: 100%;
                text-align: center;
                padding: 16px 24px;
                border-bottom: 1px #F5F6FA;

                .el-button {
                    background: #FF6B6B;
                    color: #FFFFFF;
                    min-width: 120px;
                }
            }
        }

    }
}
</style>
