<template>
    <div class="roll-call" :style="{'background-color': chooseFlag ? '#fff' : '#efefef'}">
        <div class="roll-call-header" v-if="chooseFlag">
<!--            <div class="rch-left"></div>-->
            <div class="rch-center">
                <span v-if="chooseFlag">选择班级</span>
            </div>
            <!-- <div class="rch-right" @click="close">
                <img src="@/assets/images/suspension/guanbi.png" alt="" />
            </div> -->
        </div>
        <div class="roll-call-content" v-if="chooseFlag">
<!--            <div class="class-tree" >-->
<!--                <el-tree-->
<!--                    ref="treeRef"-->
<!--                    :data="classTreeList"-->
<!--                    show-checkbox-->
<!--                    node-key="ID"-->
<!--                    default-expand-all-->
<!--                    :expand-on-click-node="false"-->
<!--                    :props="treeProps"-->
<!--                    @check="checkTreeChange"-->
<!--                >-->
<!--                </el-tree>-->

<!--            </div>-->
            <div class="content">
                <div class="left">
                    <div @click.capture="handleRow(i)" :class="['leftRow', activeIndex === i ? 'active' : '']" v-for="(item, i) in gradeList" :key="i">
                        <el-checkbox :indeterminate="item.ClassList.filter(item => item.check).length > 0 && (item.ClassList.filter(item => item.check).length < item.ClassList.length)"
                                     v-model="item.check"
                                     @change="handleChangeGrade(item)"
                                     size="large" />
                        <span class="text">{{item.GradeName}}</span>
                    </div>
                </div>
                <div class="right">
                    <el-checkbox  @change="handleChangeClass(item)" v-for="(item, i) in classList" :key="i" v-model="item.check" :label="item.ClassName" size="large" />
                </div>
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
import { IYunInfo, LessonClasses } from "@/types/login";
import { get, STORAGE_TYPES } from "@/utils/storage";
import { ElMessage } from "element-plus";
import { defineComponent, reactive, ref, toRefs } from "vue";
import StudentList from "./studentList.vue";
import { getTeacherClassList } from "@/views/login/api";
import { UserInfoState } from "@/types/store";
import { IClassItem, IGradeItem } from "@/types/quickAnswer";

interface State {
    activeIndex:number,
    gradeList: IGradeItem[],
    classList: IClassItem[],
    allStudentList: Student[],
    checkStudentList: Student[],
    lastCheckGradeId: string
}

export default defineComponent({
    setup() {
        // const classTreeList = ref<unknown>([]);
        // const treeRef = ref();
        // let lastCheckKeys: unknown[] = [];
        // let currentGradeId = "";
        // const allStudentList = ref<Student[]>([]);
        // const checkStudentList = ref<Student[]>([]);
        // const treeProps = { label: "Name", children: "classData" };
        // const userInfo = get(STORAGE_TYPES.USER_INFO);
        const chooseFlag = ref(true);
        const currentUserInfo:UserInfoState = get(STORAGE_TYPES.CURRENT_USER_INFO);
        const yunInfo: IYunInfo = get(STORAGE_TYPES.YUN_INFO);

        // const map = new Map();
        // const classList = userInfo?.Classes as LessonClasses[];
        // classList.forEach(info => {
        //     const { GradeID, GradeName } = info;
        //     if (map.has(GradeID)) {
        //         const mapInfo = map.get(GradeID);
        //         mapInfo.classData.push({ ...info, GradeID });
        //     } else {
        //         const classData = [{ ...info, GradeID }];
        //         map.set(GradeID, {
        //             ...info,
        //             classData,
        //             ID: GradeID,
        //             Name: GradeName
        //         });
        //     }
        // });
        // classTreeList.value = [...map.values()];
        // const checkTreeChange = (data: any, node: any) => {
        //     // 第一次点击马上赋值
        //     if (!currentGradeId) {
        //         currentGradeId = data.GradeID;
        //         lastCheckKeys = treeRef.value!.getCheckedKeys(false);
        //     }
        //     // 如果点击的年级id相同则更新最后选中的
        //     if (currentGradeId === data.GradeID) {
        //         lastCheckKeys = treeRef.value!.getCheckedKeys(false);
        //     } else {
        //         // 选中不同的年级,和上一次选中的比对
        //         const arr: unknown[] = [];
        //         node.checkedKeys.forEach((key: string) => {
        //             if (!lastCheckKeys.includes(key)) {
        //                 arr.push(key);
        //             }
        //         });
        //         treeRef.value!.setCheckedKeys([], false);
        //         treeRef.value!.setCheckedKeys(arr, false);
        //         // 更新选中的年级和班级key
        //         lastCheckKeys = arr;
        //         currentGradeId = data.GradeID;
        //     }
        // };

        const state = reactive<State>({
            activeIndex: 0,
            gradeList: [],
            classList: [],
            allStudentList: [],
            checkStudentList: [],
            lastCheckGradeId: ""
        });
        const submit = () => {
            // const data = treeRef.value!.getCheckedNodes(true, false);
            // if (data.length === 0) {
            //     ElMessage({ type: "warning", message: "请先选择班级" });
            //     return false;
            // }
            // const studentList: Student[] = [];
            // data.forEach((item: any) => {
            //     const students = allStudentList.value.filter(student => student.ClassID === item.ID);
            //     studentList.push(...students);
            // });
            // const map = new Map();
            // studentList.forEach(student => {
            //     const { StudentID } = student;
            //     if (!map.has(StudentID)) {
            //         map.set(StudentID, student);
            //     }
            // });
            let selectClass:string[] = [];
            state.gradeList.forEach((item:IGradeItem) => {
                const arr = item.ClassList.filter((j:IClassItem) => j.check).map((v:IClassItem) => v.ClassId);
                selectClass = selectClass.concat(arr);
            });

            if (selectClass.length === 0) {
                return ElMessage.warning("请至少选择一个班级");
            }

            state.checkStudentList = state.allStudentList.filter(student => selectClass.includes(student.ClassID));
            const size = window.electron.remote.screen.getPrimaryDisplay().workAreaSize;
            const width = size.width > 1200 ? 1200 : size.width;
            const height = size.height > 800 ? 800 : size.height;
            window.electron.setContentSize(width, height);
            window.electron.setCenter();
            chooseFlag.value = false;
        };

        // const openQuickAnswer = (classList:IClassItem[]) => {
        //     state.classList = classList;
        // };

        const handleRow = (i:number) => {
            state.activeIndex = i;
            state.classList = state.gradeList[i].ClassList;
        };

        // 只能选择同个年级班级
        const handleChangeGrade = (row:IGradeItem) => {
            state.lastCheckGradeId = row.GradeId;
            state.gradeList.forEach((i:IGradeItem) => {
                if (row.GradeId === i.GradeId) {
                    i.ClassList.forEach((v:IClassItem) => {
                        v.check = row.check;
                    });
                } else {
                    i.check = false;
                    i.ClassList.forEach((v:IClassItem) => {
                        v.check = false;
                    });
                }
            });
        };

        const handleChangeClass = (item: IClassItem) => {
            // 和上次选中的年做比较 如选中年级不同 取消上次选中的年级、班级
            if (state.lastCheckGradeId && state.lastCheckGradeId !== item.GradeId) {
                const lastGradeList = state.gradeList.find((i:IGradeItem) => state.lastCheckGradeId === i.GradeId);
                if (lastGradeList) {
                    lastGradeList.check = false;
                    lastGradeList.ClassList.forEach((j:IClassItem) => { j.check = false});
                }
            }
            state.lastCheckGradeId = item.GradeId || "";
            state.gradeList.some((i:IGradeItem) => {
                if (item.GradeId === i.GradeId) {
                    i.check = i.ClassList.length === i.ClassList.filter((j:IClassItem) => j.check).length;
                    return true;
                }
            });
        };

        const _getTeacherClassList = () => {
            const data = {
                TermCode: yunInfo!.TermCode,
                Base_OrgId: currentUserInfo!.schoolId,
                TeacherId: currentUserInfo!.userCenterUserID
            };
            getTeacherClassList(data).then(res => {
                if (res.resultCode === 200) {
                    const list = res.result || [];
                    state.gradeList = list.map((i:IGradeItem) => {
                        i.ClassList.forEach((j: IClassItem) => {
                            j.GradeId = i.GradeId;
                        });
                        return i;
                    });
                    state.classList = state.gradeList.length > 0 ? state.gradeList[0].ClassList : [];
                }
            });
        };

        _getTeacherClassList();

        const close = () => {
            window.electron.destroyWindow();
        };

        window.electron.ipcRenderer.on("sendAllStudentList", (_, studentList) => {
            state.allStudentList = studentList;
        });
        return {
            ...toRefs(state),
            // classTreeList,
            // treeProps,
            // treeRef,
            // checkTreeChange,
            chooseFlag,
            close,
            submit,
            handleRow,
            handleChangeGrade,
            handleChangeClass,
            _getTeacherClassList,
            yunInfo,
            currentUserInfo
        };
    },
    components: { StudentList }
});
</script>

<style lang="scss" scoped>
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
//.el-tree {
//    > div {
//        > div {
//            &:first-of-type {
//                font-weight: 600;
//                margin: 10px 0;
//            }
//        }
//    }
//    .el-icon-caret-right:before {
//        content: "";
//    }
//    .el-tree-node.is-expanded > .el-tree-node__children {
//        display: flex !important;
//        flex-wrap: wrap;
//    }
//}
.roll-call {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
}
.roll-call-header {
    padding: 20px 20px 0;
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
.roll-call-content {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
    padding: 10px;
}
//.class-tree {
//    flex: 1;
//    min-height: 0;
//    overflow-y: auto;
//}
.content{
    display: flex;
    flex: 1;
    min-height: 0;
    .left{
        width: 200px;
        height: 100%;
        overflow-y: auto;
        padding: 20px 0;
        border-right: 1px solid #E9ECF0;;
        .leftRow{
            display: flex;
            align-items: center;
            cursor: pointer;
            height: 42px;
            padding: 0px 20px;
            .text{
                margin-left: 6px;
                font-size: 14px;
                color: #19203D;
            }
            &:hover{
                background-color: #ecf5ff;
            }
        }
        .active{
            background: #E6ECFF;
            :deep(.el-checkbox__label){
                color: #4B71EE;
            }
        }
    }
    .right{
        flex: 1;
        min-widths: 0;
        padding: 20px;
        overflow-y: auto;
    }
}
.roll-call-footer {
    display: flex;
    justify-content: center;
    padding-top: 10px;
    .el-button {
        width: 100px;
    }
}

</style>
