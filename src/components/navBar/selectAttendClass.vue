<template>
    <div id="attend-class">
        <div class="titles">
            <span></span>
            <div class="text">
                点击选择上课班级
            </div>
            <div class="close-icon" @click="close">
                <el-icon :size="14" color="#9C9FAA">
                    <close/>
                </el-icon>
            </div>
        </div>
        <div class="content">
            <!--            <div class="left">-->
            <!--                <div @click.capture="handleRow(i)" :class="['leftRow', activeIndex === i ? 'active' : '']"-->
            <!--                     v-for="(item, i) in gradeList" :key="i">-->
            <!--                    <el-checkbox-->
            <!--                        :indeterminate="item.ClassList.filter(item => item.check).length > 0 && (item.ClassList.filter(item => item.check).length < item.ClassList.length)"-->
            <!--                        v-model="item.check"-->
            <!--                        @change="handleChangeGrade(item)"-->
            <!--                        size="large"/>-->
            <!--                    <span class="text">{{ item.GradeName }}</span>-->
            <!--                </div>-->
            <!--            </div>-->
            <div class="right">
                <el-checkbox @change="handleChangeClass(item)" v-for="(item, i) in classList" :key="i"
                             v-model="item.check" :label="item.ClassName" size="large"/>
            </div>
        </div>
        <div class="footer">
            <el-button type="primary" @click="confirm">确定</el-button>
        </div>
    </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, PropType, reactive, ref, toRefs} from "vue";

import {ElMessage} from "element-plus";
import {getTeacherClassList} from "@/views/login/api";
import {IClassItem, IGradeItem} from "@/types/quickAnswer";
import {UserInfoState} from "@/types/store";
import {get, STORAGE_TYPES} from "@/utils/storage";
import {store} from "@/store";

interface State {
    activeIndex: number,
    gradeList: IGradeItem[],
    classList: IClassItem[]
}

export default defineComponent({
    name: "selectAttendClass",
    props: {
        classVisible: {
            type: Boolean,
            require: false
        }
    },
    emits: ["update:classVisible"],
    setup(props, {emit}) {
        const currentUserInfo = ref<UserInfoState>(get(STORAGE_TYPES.CURRENT_USER_INFO));

        const state = reactive<State>({
            activeIndex: 0,
            gradeList: [],
            classList: []
        });
        const confirm = () => {
            let selectClass: IClassItem[] = [];
            state.gradeList.forEach((item: IGradeItem) => {
                const arr = item.ClassList.filter((j: IClassItem) => j.check);
                selectClass = selectClass.concat(arr);
            });

            if (selectClass.length === 0) {
                return ElMessage.warning("请至少选择一个班级");
            }

            console.log('selectClass', selectClass)
        };

        const handleRow = (i: number) => {
            state.activeIndex = i;
            state.classList = state.gradeList[i].ClassList;
        };

        const handleChangeGrade = (item: IGradeItem) => {
            item.ClassList.forEach((i: IClassItem) => {
                i.check = item.check;
            });
        };

        const handleChangeClass = (item: IClassItem) => {
            state.gradeList.some((i: IGradeItem) => {
                const currentGrade = i.ClassList.find((j: IClassItem) => j.ClassId === item.ClassId);
                if (currentGrade) {
                    i.check = i.ClassList.length === i.ClassList.filter((j: IClassItem) => j.check).length;
                }
                return currentGrade;
            });
        };

        const _getTeacherClassList = () => {
            // const data = {
            //     Base_OrgId: currentUserInfo.value!.schoolId,
            //     TeacherId: currentUserInfo.value!.userCenterUserID
            // };
            // getTeacherClassList(data).then(res => {
            //     if (res.resultCode === 200) {
            //         state.gradeList = res.result;
            //         state.classList = state.gradeList.length > 0 ? state.gradeList[0].ClassList : [];
            //     }
            // });
            state.classList = store.state.userInfo.classList;
        };

        const close = () => {
            emit("update:classVisible", false)
        };

        onMounted(() => {
            _getTeacherClassList();
        });

        return {
            ...toRefs(state),
            handleChangeGrade,
            handleChangeClass,
            handleRow,
            confirm,
            close,
            currentUserInfo
        };
    }
});
</script>

<style scoped lang="scss">
#attend-class {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 102;
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    flex-direction: column;
    width: 919px;
    height: 550px;
    background: #FFFFFF;
    border-radius: 8px;
    box-shadow: 0px 6px 16px -8px rgba(0, 0, 0, 0.12),
    0px 9px 28px 0px rgba(0, 0, 0, 0.08),
    0px 12px 48px 16px rgba(0, 0, 0, 0.05);

    .titles {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 14px;
        border-bottom: 2px solid #f5f6fa;

        .text {
            font-size: 20px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #19203D;
        }

        .close-icon {
            cursor: pointer;
            -webkit-app-region: no-drag;
            width: 30px;
            height: 30px;
            background: #f6f6fa;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }

    .content {
        display: flex;
        flex: 1;
        min-height: 0;

        .left {
            width: 160px;
            height: 100%;
            overflow-y: auto;
            padding: 20px 0;
            border-right: 1px solid #E9ECF0;;

            .leftRow {
                display: flex;
                align-items: center;
                cursor: pointer;
                height: 42px;
                padding: 0px 20px;

                .text {
                    margin-left: 6px;
                    font-size: 14px;
                    color: #19203D;
                }

                &:hover {
                    background-color: #ecf5ff;
                }
            }

            .active {
                background: #E6ECFF;
                box-shadow: inset -4px 0px 0px #4b71ee;

                :deep(.el-checkbox__label) {
                    color: #4B71EE;
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

    .footer {
        width: 100%;
        padding: 20px;
        text-align: right;

        .el-button {
            width: 200px;
            height: 40px;
            background: #4B71EE;
            border-radius: 4px;
        }
    }
}


</style>
