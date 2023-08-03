<template>
    <div class="box">
        <Title title="选择班级" :close="close"></Title>
        <div class="content">
            <div class="left">
                <div @click.capture="handleRow(i)" :class="['leftRow', activeIndex === i ? 'active' : '']"
                     v-for="(item, i) in gradeList" :key="i">
                    <el-checkbox
                        :indeterminate="item.ClassList.filter(item => item.check).length > 0 && (item.ClassList.filter(item => item.check).length < item.ClassList.length)"
                        v-model="item.check"
                        @change="handleChangeGrade(item)"
                        size="large"/>
                    <span class="text">{{ item.GradeName }}</span>
                </div>
            </div>
            <div class="right">
                <el-checkbox @change="handleChangeClass(item)" v-for="(item, i) in classList" :key="i"
                             v-model="item.check" :label="item.ClassName" size="large"/>
            </div>
        </div>
        <div class="footer">
            <el-button @click="close">取消</el-button>
            <el-button type="primary" @click="confirm">确定</el-button>
        </div>
    </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, PropType, reactive, ref, toRefs} from "vue";
import Title from "@/childWindow/answerMachine/title.vue";
import {IYunInfo} from "@/types/login";
import {ElMessage} from "element-plus";
import {getTeacherClassList} from "@/api/login";
import {IClassItem, IGradeItem} from "@/types/quickAnswer";
import {UserInfoState} from "@/types/store";

interface State {
    activeIndex: number,
    gradeList: IGradeItem[],
    classList: IClassItem[]
}

export default defineComponent({
    name: "selectClass",
    components: {Title},
    props: {
        currentUserInfo: {
            type: Object as PropType<UserInfoState>,
            require: true
        }
    },
    emits: ["openQuickAnswer"],
    setup(props, {emit}) {
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

            emit("openQuickAnswer", selectClass);
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
            const data = {
                Base_OrgId: props.currentUserInfo!.schoolId,
                TeacherId: props.currentUserInfo!.userCenterUserID
            };
            getTeacherClassList(data).then(res => {
                if (res.resultCode === 200) {
                    state.gradeList = res.result;
                    state.classList = state.gradeList.length > 0 ? state.gradeList[0].ClassList : [];
                }
            });
        };

        const close = () => {
            window.electron.destroyWindow();
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
            close
        };
    }
});
</script>

<style scoped lang="scss">
.box {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    background-color: #fff;
    font-size: 14px;
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
    padding: 20px 0;
    text-align: center;
}

</style>
