<template>
    <div class="roll-call" :style="{'background-color': chooseFlag ? '#fff' : '#efefef'}">
        <div class="roll-call-header">
<!--            <div class="rch-left"></div>-->
            <div class="rch-center">
                <span v-if="chooseFlag">选择班级</span>
            </div>
            <!-- <div class="rch-right" @click="close">
                <img src="@/assets/images/suspension/guanbi.png" alt="" />
            </div> -->
        </div>
        <div class="" v-if="chooseFlag">
            <div class="class-tree" >
                <el-tree
                    ref="treeRef"
                    :data="classTreeList"
                    show-checkbox
                    node-key="ID"
                    default-expand-all
                    :expand-on-click-node="false"
                    :props="treeProps"
                    @check="checkTreeChange"
                >
                </el-tree>
            </div>
            <div class="roll-call-footer">
                <el-button @click="close">取消</el-button>
                <el-button type="primary" @click="submit">确认</el-button>
            </div>
        </div>
        <StudentList :studentList="checkStudentList" v-else/>
    </div>
</template>

<script lang="ts">
import { Student } from "@/types/labelManage";
import { LessonClasses } from "@/types/login";
import { get, STORAGE_TYPES } from "@/utils/storage";
import { ElMessage } from "element-plus";
import { defineComponent, ref } from "vue";
import StudentList from "./studentList.vue";
export default defineComponent({
    setup() {
        const chooseFlag = ref(true);
        const classTreeList = ref<unknown>([]);
        const treeRef = ref();
        let lastCheckKeys: unknown[] = [];
        let currentGradeId = "";
        const allStudentList = ref<Student[]>([]);
        const checkStudentList = ref<Student[]>([]);
        const treeProps = { label: "Name", children: "classData" };
        const userInfo = get(STORAGE_TYPES.USER_INFO);

        const map = new Map();
        const classList = userInfo?.Classes as LessonClasses[];
        classList.forEach(info => {
            const { GradeID, GradeName } = info;
            if (map.has(GradeID)) {
                const mapInfo = map.get(GradeID);
                mapInfo.classData.push({ ...info, GradeID });
            } else {
                const classData = [{ ...info, GradeID }];
                map.set(GradeID, {
                    ...info,
                    classData,
                    ID: GradeID,
                    Name: GradeName
                });
            }
        });
        classTreeList.value = [...map.values()];
        const checkTreeChange = (data: any, node: any) => {
            // 第一次点击马上赋值
            if (!currentGradeId) {
                currentGradeId = data.GradeID;
                lastCheckKeys = treeRef.value!.getCheckedKeys(false);
            }
            // 如果点击的年级id相同则更新最后选中的
            if (currentGradeId === data.GradeID) {
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
                currentGradeId = data.GradeID;
            }
        };
        const submit = () => {
            const data = treeRef.value!.getCheckedNodes(true, false);
            if (data.length === 0) {
                ElMessage({ type: "warning", message: "请先选择班级" });
                return false;
            }
            const studentList: Student[] = [];
            data.forEach((item: any) => {
                const students = allStudentList.value.filter(student => student.ClassID === item.ID);
                studentList.push(...students);
            });
            const map = new Map();
            studentList.forEach(student => {
                const { StudentID } = student;
                if (!map.has(StudentID)) {
                    map.set(StudentID, student);
                }
            });
            checkStudentList.value = [...map.values()];
            window.electron.setContentSize(1400, 1000);
            window.electron.setCenter();
            chooseFlag.value = false;
        };
        const close = () => {
            window.electron.destroyWindow();
        };

        window.electron.ipcRenderer.on("sendAllStudentList", (_, studentList) => {
            allStudentList.value = studentList;
        });
        return {
            classTreeList,
            treeProps,
            treeRef,
            chooseFlag,
            checkTreeChange,
            close,
            checkStudentList,
            submit
        };
    },
    components: { StudentList }
});
</script>

<style lang="scss">
body {
    margin: 0;
    user-select: none;
    overflow: hidden;
    box-sizing: border-box;
    * {
        box-sizing: border-box;
    }
    img {
        -webkit-user-drag: none;
    }
}
::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}
/* 滚动条背景 */
::-webkit-scrollbar-track {
    border-radius: 4px;
    background: rgba(0, 0, 0, 0.06);
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.08);
}
/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background: rgba(0, 0, 0, 0.16);
    -webkit-box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.2);
}
.el-tree {
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
.roll-call {
    width: 100%;
    height: 100vh;
    padding-top: 20px;
    display: flex;
    flex-direction: column;
}
.roll-call-header {
    padding: 0 20px;
    display: flex;
    justify-content: center;
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
        // .rcl-begin{
        //     margin-top: 20px;
        //     display: flex;
        //     flex: 1;
        //     justify-content: space-around;
        //     align-items: center;
        //     background-image: url('./img/project_card_bg.png');
        //     background-size: 100% 100%;
        //     background-position: center center;
        //     background-repeat: no-repeat;
        //     min-width: 0;
        //     min-height: 0;
        //     font-size: 16px;
        //     .rcl-begin .bottom+.bottom+.bottom {
        //         bottom: -3px;
        //     }
        //     .rcl-begin .bottom+.bottom {
        //         bottom: -6px;
        //     }

        //     .rcl-begin:hover .bottom+.bottom+.bottom {
        //         bottom: -8px;
        //     }
        //     .rcl-begin:hover .bottom+.bottom {
        //         bottom: -14px;
        //     }
        //     .rcl-begin:hover .bottom {
        //         bottom: -20px;
        //     }
        // }
    }
}
</style>
