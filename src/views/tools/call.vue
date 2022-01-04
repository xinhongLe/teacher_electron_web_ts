<template>
    <div class="roll-call">
        <div class="roll-call-header">
            <div class="rch-left"></div>
            <div class="rch-center">
                <span v-if="chooseFlag">选择班级</span>
            </div>
            <div class="rch-right" @click="close">
                <img src="@/assets/images/suspension/guanbi.png" alt="" />
            </div>
        </div>
        <div class="class-tree" v-if="chooseFlag">
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
        <div class="roll-call-footer" v-if="chooseFlag">
            <el-button @click="close">取消</el-button>
            <el-button type="primary" @click="submit">确认</el-button>
        </div>
        <div id="projects" v-if="!chooseFlag">
            <div class="roll-call-list">
                <div class="rcl-left">
                    <div>1</div>
                    <div>2</div>
                    <div>1</div>
                    <div>2</div>
                    <div>1</div>
                    <div>1</div>
                    <div>2</div>
                    <div>2</div>
                </div>
                <div class="rcl-right">
                    <div class="rcl-call">
                        已点名
                    </div>
                    <div class="rcl-begin">
                        开始
                        <div class="bottom"></div>
                        <div class="bottom"></div>
                        <div class="bottom"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { ElMessage } from "element-plus";
import { defineComponent, ref } from "vue";
import { fetchGradeClassStudents } from "./api";
export default defineComponent({
    setup() {
        const chooseFlag = ref(true);
        const classTreeList = ref<unknown>([]);
        const allClassTreeList = ref<unknown>([]);
        const treeRef = ref();
        let lastCheckKeys: unknown[] = [];
        let currentGradeId = "";
        const checkStudentList: any = ref([]);
        const treeProps = { label: "ClassName", children: "classData" };
        fetchGradeClassStudents({
            subjectID: "39F766472E16384149030DFA4E9863B5"
        }).then((res) => {
            if (res.resultCode === 200) {
                allClassTreeList.value = res.result;
                classTreeList.value = res.result.map((item) => {
                    const classData = item.ClassData.map((j) => {
                        j.Students = j.Students.map((items) => {
                            return {
                                ...items,
                                TagName: items.TagName
                                    ? items.TagName
                                    : "未标记"
                            };
                        });
                        return {
                            ...j,
                            GradeId: item.GradeId,
                            GradeName: item.GradeName
                        };
                    });
                    return {
                        classData,
                        ...item,
                        ClassName: item.GradeName,
                        ClassId: item.GradeId
                    };
                });
            }
        });
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
        const submit = () => {
            const data = treeRef.value!.getCheckedNodes(true, false);
            if (data.length === 0) {
                ElMessage({ type: "warning", message: "请先选择班级" });
                return false;
            }
            data.forEach((item: any) => {
                checkStudentList.value.push(...item.Students);
            });
            chooseFlag.value = false;
        };

        const close = () => {
            window.electron.destroyWindow();
        };
        return {
            classTreeList,
            treeProps,
            treeRef,
            chooseFlag,
            checkTreeChange,
            close,
            submit
        };
    }
});
</script>

<style lang="scss" scoped>
.roll-call {
    width: 100%;
    height: 95vh;
}
.roll-call-header {
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .rch-center {
        font-size: 18px;
    }
    .rch-right {
        width: 20px;
        height: 20px;
        img {
            width: 100%;
            height: 100%;
        }
    }
}
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
.roll-call-footer {
    display: flex;
    justify-content: center;
    .el-button {
        width: 100px;
    }
}
#projects{
    width: 100%;
    height: 90vh;
    padding: 10px;
    box-sizing: border-box;
    background: red;
    display: flex;
    min-width: 0px;
    min-height: 0px;
}
.roll-call-list{
    display: flex;
    flex: 1;
    min-width: 0;
    min-height: 0;
    .rcl-left{
        display: flex;
        flex: 1;
        justify-content: flex-start;
        flex-wrap: wrap;
        min-width: 0;
        min-height: 0;
        div{
            width: 125px;
            margin: 10px;
            border: 1px solid #000;
        }
    }
    .rcl-right{
        padding: 10px 10px 10px 0;
        width:160px;
        display: flex;
        flex-direction: column;
        min-width: 0;
        min-height: 0;
        .rcl-call{
            display: flex;
            flex: 1;
            min-width: 0;
            min-height: 0;
            border: 1px solid #000;
        }
        .rcl-begin{
            margin-top: 20px;
            display: flex;
            flex: 1;
            justify-content: space-around;
            align-items: center;
            background-image: url('./img/project_card_bg.png');
            background-size: 100% 100%;
            background-position: center center;
            background-repeat: no-repeat;
            min-width: 0;
            min-height: 0;
            font-size: 16px;
            .rcl-begin .bottom+.bottom+.bottom {
                bottom: -3px;
            }
            .rcl-begin .bottom+.bottom {
                bottom: -6px;
            }

            .rcl-begin:hover .bottom+.bottom+.bottom {
                bottom: -8px;
            }
            .rcl-begin:hover .bottom+.bottom {
                bottom: -14px;
            }
            .rcl-begin:hover .bottom {
                bottom: -20px;
            }
        }
    }
}
</style>
