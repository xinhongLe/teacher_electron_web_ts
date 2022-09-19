<template>
    <div class="box">
        <Title title="选择班级" :close="close"></Title>
        <div class="content">
            <div class="left">
                <div @click.capture="handleRow(i)" :class="['leftRow', activeIndex === i ? 'active' : '']" v-for="(item, i) in gradeList" :key="i">
                    <el-checkbox :indeterminate="item.classList.filter(item => item.check).length > 0 && (item.classList.filter(item => item.check).length < item.classList.length)"
                                 v-model="item.check"
                                 :label="item.GradeName"
                                 @change="handleChangeGrade(item)"
                                 size="large" />
                </div>
            </div>
            <div class="right">
                <el-checkbox  @change="handleChangeClass(item)" v-for="(item, i) in classList" :key="i" v-model="item.check" :label="item.Name" size="large" />
            </div>
        </div>
        <div class="footer">
            <el-button @click="close">取消</el-button>
            <el-button type="primary" @click="confirm">确定</el-button>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType, reactive, ref, toRefs } from "vue";
import Title from "@/childWindow/answerMachine/title.vue";
import { ILessonManagerResult, LessonClasses } from "@/types/login";
import { ElMessage } from "element-plus";
interface ClassItem extends LessonClasses{
    check?: boolean
}
interface GradeItem {
    GradeID: string,
    GradeName: string,
    check: boolean,
    classList: ClassItem[]
}
interface State {
    activeIndex:number,
    gradeList: GradeItem[],
    classList: ClassItem[]
}
export default defineComponent({
    name: "selectClass",
    components: { Title },
    props: {
        userInfo: {
            type: Object as PropType<ILessonManagerResult>,
            require: true
        }
    },
    emits: ["openQuickAnswer"],
    setup(props, { emit }) {
        const state = reactive<State>({
            activeIndex: 0,
            gradeList: [],
            classList: []
        });

        const confirm = () => {
            let selectClass:ClassItem[] = [];
            state.gradeList.forEach((item:GradeItem) => {
                const arr = item.classList.filter((j:ClassItem) => j.check);
                selectClass = selectClass.concat(arr);
            });

            if (selectClass.length === 0) {
                return ElMessage.warning("请至少选择一个班级");
            }

            emit("openQuickAnswer", selectClass);
        };

        const handleRow = (i:number) => {
            state.activeIndex = i;
            state.classList = state.gradeList[i].classList;
        };

        const handleChangeGrade = (item:GradeItem) => {
            item.classList.forEach((i:ClassItem) => {
                i.check = !i.check;
            });
        };

        const handleChangeClass = (item: ClassItem) => {
            state.gradeList.forEach((i:GradeItem) => {
                if (i.GradeID === item.GradeID) {
                    i.check = i.classList.length === i.classList.filter((j:ClassItem) => j.check).length;
                }
            });
        };

        const allGradeList = () => {
            const allClassList = props.userInfo?.Classes || [];
            const value:any = {};
            allClassList.forEach((item:ClassItem) => {
                if (value[item.GradeID]) {
                    value[item.GradeID].classList.push(item);
                } else {
                    value[item.GradeID] = {};
                    value[item.GradeID].GradeID = item.GradeID;
                    value[item.GradeID].GradeName = item.GradeName;
                    value[item.GradeID].classList = [item];
                }
            });
            return Object.values(value);
        };

        const close = () => {
            window.electron.destroyWindow();
        };

        onMounted(() => {
            state.gradeList = allGradeList() as GradeItem[];
            state.classList = state.gradeList.length > 0 ? state.gradeList[0].classList : [];
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
.box{
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    background-color: #fff;
    font-size: 14px;
}
.content{
    display: flex;
    flex: 1;
    min-height: 0;
    .left{
        width: 160px;
        height: 100%;
        overflow-y: auto;
        padding: 20px 0;
        border-right: 1px solid #E9ECF0;;
        .leftRow{
            cursor: pointer;
            height: 36px;
            padding: 0px 20px;
            line-height: 36px;
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
.footer{
    width: 100%;
    padding: 20px 0;
    text-align: center;
}

</style>
