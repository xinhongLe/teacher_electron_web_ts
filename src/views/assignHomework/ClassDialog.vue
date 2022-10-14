<template>
    <el-dialog
        title="布置对象"
        :model-value="dialogVisible"
        width="50%"
        center
        :before-close="handleClose"
    >
        <div class="class-tree">
            <el-tree
                ref="treeRef"
                :data="classTreeList"
                show-checkbox
                node-key="ClassId"
                default-expand-all
                :expand-on-click-node="false"
                :props="treeProps"
                @check="checkTreeChange"
            >
            </el-tree>
        </div>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="handleClose">取消</el-button>
                <el-button type="primary" @click="handleSave">确定</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script lang="ts">
import { ElTreeType } from "@/types/elementType";
import { defineComponent, ref } from "vue";
import { useRoute } from "vue-router";
import { fetchGradeClassStudents } from "./api";
export default defineComponent({
    props: {
        dialogVisible: {
            type: Boolean,
            default: false,
        },
    },
    setup(porps, { emit }) {
        const route = useRoute();
        const classTreeList = ref<unknown>([]);
        const treeRef = ref<ElTreeType>();
        const treeProps = { label: "ClassName", children: "classData" };
        let currentGradeId = "";
        let lastCheckKeys: unknown[] = [];
        const handleClose = () => {
            emit("update:dialogVisible", false);
        };

        const handleSave = () => {
            handleClose();
            const data = treeRef.value!.getCheckedNodes(true, false);
            emit("update:classList", data);
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const checkTreeChange = (data: any, node: any) => {
            // 第一次点击马上赋值
            if (!currentGradeId) {
                currentGradeId = data.GradeId;
                lastCheckKeys = treeRef.value!.getCheckedKeys(false);
            }
            // 如果点击的年级id相同则更新最后选中的
            if (currentGradeId === data.GradeId) {
                lastCheckKeys = treeRef.value!.getCheckedKeys(false);
            } else {
                // 选中不同的年级,和上一次选中的比对
                const arr: unknown[] = [];
                node.checkedKeys.forEach((key: string) => {
                    if (!lastCheckKeys.includes(key)) {
                        arr.push(key);
                    }
                });

                treeRef.value!.setCheckedKeys([], false);
                treeRef.value!.setCheckedKeys(arr, false);

                // 更新选中的年级和班级key
                lastCheckKeys = arr;
                currentGradeId = data.GradeId;
            }
        };

        fetchGradeClassStudents({
            subjectID: route.params.subjectId as string,
        }).then((res) => {
            console.log("分层标签", res);

            if (res.resultCode === 200) {
                classTreeList.value = res.result.map((item) => {
                    const classData = item.ClassData.map((j) => {
                        j.Students = j.Students.map((items) => {
                            return {
                                ...items,
                                TagName: items.TagName
                                    ? items.TagName
                                    : "未标记",
                            };
                        });
                        return {
                            ...j,
                            GradeId: item.GradeId,
                            GradeName: item.GradeName,
                        };
                    });
                    return {
                        classData,
                        ...item,
                        ClassName: item.GradeName,
                        ClassId: item.GradeId,
                    };
                });
            }
        });

        return {
            classTreeList,
            handleClose,
            checkTreeChange,
            treeRef,
            handleSave,
            treeProps,
        };
    },
});
</script>

<style lang="scss" scoped>
.class-tree {
    height: 400px;
    overflow-y: auto;
    :deep(.el-tree) {
        > div {
            > div {
                &:first-of-type {
                    font-weight: 600;
                    margin: 10px 0;
                }
            }
        }
        .el-icon-caret-right:before {
            content: "";
        }
        .el-tree-node.is-expanded > .el-tree-node__children {
            display: flex !important;
            flex-wrap: wrap;
        }
    }
}
</style>
