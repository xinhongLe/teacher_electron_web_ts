<template>
    <div class="select-student">
        <el-dialog
            title="选择学生"
            :model-value="visible"
            width="896px"
            center
            :before-close="handleClose"
        >
            <div class="container">
                <div class="student-box" v-if="list.length > 0">
                    <div class="label-list">
                        <div
                            :class="{
                                active: activeIndex === index ? true : false,
                            }"
                            v-for="(item, index) in list"
                            :key="index"
                            @click="activeIndex = index"
                        >
                            <el-checkbox
                                :indeterminate="getStatusStyle(index)"
                                v-model="item.checked"
                                @change="
                                    (val) => handleCheckAllChange(val, index)
                                "
                            ></el-checkbox>
                            <span class="name">{{ item.label }}</span>
                            <div class="num">{{ getCount(item.students) }}</div>
                        </div>
                    </div>
                    <div class="student-list">
                        <div
                            class="item"
                            v-for="(item, index) in list[activeIndex].students"
                            :key="`${item.ID}${index}`"
                        >
                            <el-checkbox
                                style="margin-top: 8px"
                                v-model="item.checked"
                                @change="
                                    (val) => handleCheckChange(val, activeIndex)
                                "
                            ></el-checkbox>
                            <img
                                src="../../assets/images/attend-class/touxiang_student.png"
                            />
                            <div>
                                <p>{{ item.Name }}</p>
                                <p>{{ item.Phone }}</p>
                                <p>{{ item.Account }}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="container-footer">
                    <el-checkbox
                        :indeterminate="getBigStatusStyle()"
                        v-model="checkAll"
                        @change="handleCheckAllChange1"
                    ></el-checkbox>
                    <span style="margin-left: 16px">全选</span>
                    <span>当前已选{{ selectCount }}人</span>
                    <div class="btn" @click="setClassList">确定</div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import { Level, Student } from "@/types/assignHomework";
import { cloneDeep } from "lodash";
import { computed, defineComponent, PropType, ref } from "vue";
export default defineComponent({
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        levelList: {
            type: Array as PropType<Level[]>,
            default: () => []
        },
        allStudentCount: {
            type: Number,
            default: 0
        }
    },
    setup(props, { emit }) {
        const list = ref<Level[]>(cloneDeep(props.levelList));

        const activeIndex = ref(0);
        const selectCount = computed(() => {
            let selectCount = 0;
            list.value.forEach((v) => {
                v.students.forEach(e => {
                    if (e.checked) {
                        selectCount++;
                    }
                });
            });
            return selectCount;
        });
        const checkAll = computed(() => {
            let checkAll = false;
            list.value.filter((v) => !v.checked).length > 0
                ? (checkAll = false)
                : (checkAll = true);
            return checkAll;
        });

        const handleClose = () => {
            emit("update:visible", false);
        };

        const getCount = (students: Student[]) => {
            return students.filter((e) => e.checked).length;
        };

        const getStatusStyle = (index: number) => {
            return list.value[index].students.filter((v) => v.checked).length <
                    list.value[index].students.length &&
                list.value[index].students.filter((v) => v.checked).length > 0;
        };

        const getBigStatusStyle = () => {
            return (
                selectCount.value < props.allStudentCount && selectCount.value > 0
            );
        };

        const handleCheckAllChange = (val: boolean, index: number) => {
            val
                ? list.value[index].students.map((v) => (v.checked = true))
                : list.value[index].students.map((v) => (v.checked = false));
        };

        const handleCheckChange = (val: boolean, activeIndex: number) => {
            if (!val) {
                list.value[activeIndex].checked = false;
            } else {
                list.value[activeIndex].students.filter((e) => e.checked)
                    .length === list.value[activeIndex].students.length
                    ? (list.value[activeIndex].checked = true)
                    : (list.value[activeIndex].checked = false);
            }
        };

        const handleCheckAllChange1 = (val: boolean) => {
            if (val) {
                list.value.forEach((v) => {
                    v.checked = true;
                    v.students.forEach((e) => {
                        e.checked = true;
                    });
                });
            } else {
                list.value.forEach((v) => {
                    v.checked = false;
                    v.students.forEach((e) => {
                        e.checked = false;
                    });
                });
            }
        };

        const setClassList = () => {
            handleClose();
            emit("updateLevelList", list.value);
        };

        return {
            list,
            activeIndex,
            getCount,
            checkAll,
            handleCheckAllChange,
            getStatusStyle,
            handleCheckChange,
            getBigStatusStyle,
            handleCheckAllChange1,
            selectCount,
            setClassList,
            handleClose
        };
    }
});
</script>

<style lang="scss" scoped>
.select-student {
    :deep(.el-dialog__body) {
        padding: 0;
    }
    :deep(.el-checkbox__input),
    :deep(.el-checkbox__inner),
    :deep(.el-checkbox__original) {
        width: 20px;
        height: 20px;
        float: left;
    }
    :deep(.el-checkbox__inner) {
        border-color: #4b71ee;
    }
    :deep(.el-checkbox__inner::after) {
        width: 4.5px;
        height: 10px;
        left: 6px;
    }
    :deep(.el-checkbox__label) {
        font-size: 16px;
        color: #19203d;
        line-height: 20px;
        float: left;
    }
    :deep(.is-checked .el-checkbox__inner) {
        background: #4b71ee;
    }
    :deep(.el-checkbox__input.is-indeterminate .el-checkbox__inner::before) {
        top: 8px;
    }
}
.student-box {
    display: flex;
    justify-content: space-between;
    .label-list {
        width: 240px;
        height: 400px;
        > div {
            margin-bottom: 13px;
            height: 48px;
            display: flex;
            padding: 0 0 0 40px;
            border-right: 3px solid #fff;
            align-items: center;
        }
        .name {
            font-size: 16px;
            color: #19203d;
            line-height: 48px;
            margin-left: 16px;
        }
        .num {
            width: 20px;
            margin-left: auto;
            height: 20px;
            background: #4b71ee;
            border-radius: 50%;
            font-size: 12px;
            color: #ffffff;
            line-height: 20px;
            text-align: center;
            margin-right: 16px;
        }
        .active {
            background: #e6ecff;
            border-right: 3px solid #4b71ee;
            box-sizing: border-box;
        }
    }
    .student-list {
        background: #f5f6fa;
        flex: 1;
        padding: 16px 20px 0;
        height: 400px;
        box-sizing: border-box;
        overflow-y: auto;
        .item {
            width: 296px;
            height: 80px;
            background: #ffffff;
            border-radius: 4px;
            padding: 9px 20px 7px 20px;
            box-sizing: border-box;
            margin-bottom: 16px;
            float: left;
            :deep(.el-checkbox) {
                float: left;
                margin-top: 21px;
            }
            img {
                width: 38px;
                height: 38px;
                float: left;
                margin: 10px 0 0 20px;
                border-radius: 50%;
            }
            > div {
                margin-left: 16px;
                float: left;
                p:nth-of-type(1) {
                    height: 22px;
                    font-size: 16px;
                    font-weight: 500;
                    color: #19203d;
                    line-height: 22px;
                    margin-bottom: 4px;
                }
                p:nth-of-type(2),
                p:nth-of-type(3) {
                    height: 17px;
                    font-size: 12px;
                    font-weight: 500;
                    color: #5f626f;
                    line-height: 17px;
                    margin-bottom: 2px;
                }
            }
        }
        .item:nth-of-type(2n-1) {
            margin-right: 16px;
        }
    }
}
.container-footer {
    padding: 16px 32px 16px 40px;
    overflow: hidden;
    :deep(.el-checkbox) {
        float: left;
        font-size: 14px;
    }
    > span {
        font-size: 14px;
        color: #5f626f;
        margin-top: 10px;
        line-height: 20px;
        margin-left: 24px;
        float: left;
    }
    :deep(.el-checkbox__label) {
        font-size: 14px;
        color: #5f626f;
    }
    .btn {
        cursor: pointer;
        user-select: none;
        width: 200px;
        height: 40px;
        background: #4b71ee;
        border-radius: 4px;
        font-size: 16px;
        color: #ffffff;
        line-height: 40px;
        float: right;
        text-align: center;
    }
}
</style>
