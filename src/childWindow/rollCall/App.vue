<template>
    <div
        class="roll-call"
        :style="{ 'background-color': '#fff' }"
    >
        <StudentList />
    </div>
</template>

<script lang="ts">
import { Student } from "@/types/labelManage";
import { get, STORAGE_TYPES } from "@/utils/storage";
import { defineComponent, reactive, toRefs } from "vue";
import StudentList from "./studentList.vue";
import { UserInfoState } from "@/types/store";
import { IClassItem, IGradeItem } from "@/types/quickAnswer";

interface State {
    activeIndex: number;
    gradeList: IGradeItem[];
    classList: IClassItem[];
    allStudentList: Student[];
    lastCheckGradeId: string;
    currentClassList: any;
}

export default defineComponent({
    setup() {
        const currentUserInfo: UserInfoState = get(
            STORAGE_TYPES.CURRENT_USER_INFO
        );

        const allStudentList = get(STORAGE_TYPES.STUDENT_LIST) || [];
        const state = reactive<State>({
            activeIndex: 0,
            gradeList: [],
            classList: [],
            allStudentList: allStudentList,
            lastCheckGradeId: "",
            currentClassList: get(STORAGE_TYPES.CURRENT_SELECT_CLASS) || {},
        });

        const close = () => {
            window.electron.destroyWindow();
        };

        window.electron.ipcRenderer.on(
            "sendAllStudentList",
            (_, studentList) => {
                state.allStudentList = studentList;
            }
        );
        return {
            ...toRefs(state),
            close,
            currentUserInfo,
        };
    },
    components: { StudentList },
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

    #attend-class {
        width: 100%;
        height: 100%;
    }
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
.content {
    display: flex;
    flex: 1;
    min-height: 0;

    .left {
        width: 200px;
        height: 100%;
        overflow-y: auto;
        padding: 20px 0;
        border-right: 1px solid #e9ecf0;

        .leftRow {
            display: flex;
            align-items: center;
            cursor: pointer;
            height: 42px;
            padding: 0px 20px;

            .text {
                margin-left: 6px;
                font-size: 14px;
                color: #19203d;
            }

            &:hover {
                background-color: #ecf5ff;
            }
        }

        .active {
            background: #e6ecff;

            :deep(.el-checkbox__label) {
                color: #4b71ee;
            }
        }
    }

    .right {
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
