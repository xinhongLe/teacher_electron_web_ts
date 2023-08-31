<template>
    <div id="attend-class">
        <div class="titles">
            <span></span>
            <div class="text">
                点击选择上课班级
            </div>
            <div class="close-icon" @click="close">
                <el-icon :size="14">
                    <close style="width:30px;height:30px"/>
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
                <el-checkbox-group v-if="isCheck" v-model="checkClassList" @change="handleChangeClass">
                    <el-checkbox v-for="(item, i) in classList" :key="i"
                                 :label="item.ClassUserCenterId" size="large">{{ item.ClassName }}
                    </el-checkbox>
                </el-checkbox-group>
                <el-radio-group v-else v-model="checkedClass" @change="handleChangeRadioClass">
                    <el-radio v-for="(item, i) in classList" :key="i"
                              :label="item.ClassUserCenterId" size="large">{{ item.ClassName }}
                    </el-radio>
                </el-radio-group>

            </div>
        </div>
        <div class="footer">
            <el-button type="primary" @click="confirm">确定</el-button>
        </div>
    </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, ref, watch} from "vue";

import {ElMessage} from "element-plus";
import {IClassItem, IGradeItem} from "@/types/quickAnswer";
import {ICurrentSelectClass, UserInfoState} from "@/types/store";
import {get, set, STORAGE_TYPES} from "@/utils/storage";
import {store} from "@/store";

interface State {
    classList: ICurrentSelectClass[]
}

export default defineComponent({
    name: "selectAttendClass",
    props: {
        classVisible: {
            type: Boolean,
            require: false
        },
        currentClassList: {
            type: Array,
            require: []
        },
        isCheck: {
            type: Boolean,
            require: false
        },
    },
    emits: ["update:classVisible", "update:currentClassList", "close", "confirm"],
    setup(props, {emit}) {
        //已经选择的班级列表
        const checkClassList: any = ref([]);
        //已经选择的班级
        const checkedClass: any = ref("");
        //班级列表
        const classList = ref([]);
        const currentUserInfo = ref<UserInfoState>(get(STORAGE_TYPES.CURRENT_USER_INFO));
        const confirm = () => {
            if (props.isCheck) {
                if (checkClassList.value.length === 0) {
                    return ElMessage.warning("请至少选择一个班级");
                } else {
                    const classData: any = [];
                    checkClassList.value.forEach((item: any) => {
                        classList.value.forEach((j: any) => {
                            if (item === j.ClassUserCenterId) {
                                classData.push(j)
                            }
                        })
                    })
                    emit("update:currentClassList", classData);
                    emit("confirm", checkClassList.value);
                    emit("update:classVisible", false);
                }
            } else {
                if (!checkedClass.value) {
                    return ElMessage.warning("请至少选择一个班级");
                } else {
                    const classData: any = classList.value.find((item: any) => item.ClassUserCenterId === checkedClass.value);
                    emit("update:currentClassList", classData);
                    emit("confirm", checkedClass.value);
                    emit("update:classVisible", false);
                }
            }
        };
        const handleChangeGrade = (item: IGradeItem) => {
            item.ClassList.forEach((i: IClassItem) => {
                i.check = item.check;
            });
        };

        const handleChangeClass = () => {
            // state.gradeList.some((i: IGradeItem) => {
            //     const currentGrade = i.ClassList.find((j: IClassItem) => j.ClassId === item.ClassId);
            //     if (currentGrade) {
            //         i.check = i.ClassList.length === i.ClassList.filter((j: IClassItem) => j.check).length;
            //     }
            //     return currentGrade;
            // });
        };
        const handleChangeRadioClass = (val: string) => {
            const classData: any = classList.value.find((item: ICurrentSelectClass) => item.ClassUserCenterId === val);
            window.electron.ipcRenderer.send('updateSelectClass', JSON.stringify(classData));
        };
        const _getTeacherClassList = () => {
            // const data = {
            //     Base_OrgId: currentUserInfo.value!.schoolId,
            //     TeacherId: currentUserInfo.value!.userCenterUserID
            // };
            // getTeacherClassList(data).then(res => {
            //     if (res.resultCode === 200) {
            //         state.gradeList = res.result;
            //         classList.value = state.gradeList.length > 0 ? state.gradeList[0].ClassList : [];
            //     }
            // });
            classList.value = store.state.userInfo.classList.length ? store.state.userInfo.classList : get(STORAGE_TYPES.CLASS_LIST);
        };

        const close = () => {
            emit("close");
            emit("update:classVisible", false);
            checkClassList.value = [];
            checkedClass.value = "";
        };

        onMounted(() => {
            _getTeacherClassList();
        });

        watch(() => props.currentClassList, (val: any) => {
            if (val && val.ClassUserCenterId) {
                if (!props.isCheck) {
                    checkedClass.value = val.ClassUserCenterId
                }
            }
        }, {immediate: true})

        return {
            classList,
            currentUserInfo,
            checkClassList,
            checkedClass,
            handleChangeGrade,
            handleChangeClass,
            handleChangeRadioClass,
            confirm,
            close,

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
            color: #9C9FAA;
            cursor: pointer;
            -webkit-app-region: no-drag;
            width: 30px;
            height: 30px;
            background: #f6f6fa;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;

            .el-icon {
                width: 30px;
                height: 30px;
                color: #9C9FAA;
            }
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

        :deep(.right) {
            flex: 1;
            min-widths: 0;
            padding: 32px;
            overflow-y: auto;

            .el-checkbox {
                .el-checkbox__input {
                    .el-checkbox__inner {
                        width: 18px;
                        height: 18px;
                    }

                    .el-checkbox__inner::after {
                        height: 12px;
                        left: 6px;
                        position: absolute;
                        top: 0px;
                        width: 4px;
                    }
                }

                .el-checkbox__label {
                    font-size: 18px;
                }

            }

            .el-radio {
                .el-radio__input {
                    .el-radio__inner {
                        width: 18px;
                        height: 18px;
                    }

                    .el-radio__inner::after {
                        height: 6px;
                        left: 8px;
                        position: absolute;
                        top: 8px;
                        width: 6px;
                    }
                }

                .el-radio__label {
                    font-size: 18px;
                }
            }
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
