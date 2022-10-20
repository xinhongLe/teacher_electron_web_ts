<template>
   <div>
       <el-dialog v-if="visible" v-model="visible" class="custom-dialog" title="错题收集" width="532px" center @close="close">
           <div class="page-type-box">
               <NulliparousStudents
                   :HeadPortrait="value.StudentHeadPortrait"
                   :name="value.StudentName"
                   :className="value.StudentAccount"
               ></NulliparousStudents>
               <div class="text">请点选答错的题目序号，不选视为答对：</div>
               <div class="content">
                   <div
                       :class="['topic', (selectIndex.includes(i) ? 'active' : '')]"
                       v-for="(item, i) in questionList"
                       :key="i"
                       @click="selectWrong(i)">
                       {{ item.QuestionTrueNumber ? item.QuestionTrueNumber : i + 1}}
                   </div>
               </div>
           </div>
           <template #footer>
          <span class="dialog-footer">
            <span class="text">共做错<i class="num">{{selectIndex.length}}</i>题</span>
            <el-button type="primary" @click="handleComfirm">提交</el-button>
          </span>
           </template>
       </el-dialog>
   </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, toRefs, ref, PropType } from "vue";
import NulliparousStudents from "../NulliparousStudents.vue";
import { ClassHomeworkPaperQuestion, MissionDetail } from "@/types/checkHomework";
import { upLoadWorkbookHomework } from "../api";
import moment from "moment";
import { ElMessage } from "element-plus";
interface State {
    selectIndex: number[]
}
export default defineComponent({
    name: "collectWrongTopic",
    components: { NulliparousStudents },
    props: {
        dialogVisible: {
            type: Boolean,
            require: true
        },
        value: {
            type: Object as PropType<MissionDetail>,
            require: true
        },
        questionList: {
            type: Array as PropType<ClassHomeworkPaperQuestion[]>,
            default: () => []
        }
    },
    emits: ["update:dialogVisible", "updateQuestionInfo"],
    setup(props, { emit }) {
        const state = reactive<State>({
            selectIndex: []
        });

        const visible = computed(() => props.dialogVisible);

        const selectWrong = (index:number) => {
            if (state.selectIndex.includes(index)) {
                state.selectIndex.splice(state.selectIndex.findIndex((i:number) => i === index), 1);
            } else {
                state.selectIndex.push(index);
            }
        };

        const handleComfirm = () => {
            const list = props.questionList.map((item:ClassHomeworkPaperQuestion, i: number) => {
                const currentStudentInfo = item.MissionDetails.find(j => j.StudentID === props.value!.StudentID);
                return {
                    MissionDetailID: currentStudentInfo?.MissionDetailID || "",
                    StartTime: moment().format("YYYY-MM-DD HH:mm:ss"),
                    Result: state.selectIndex.includes(i) ? 2 : 1,
                    PageNum: item.PageNum || 0
                };
            });

            console.log(list, "-----");
            upLoadWorkbookHomework({ MissionDetails: list }).then(res => {
                if (res.resultCode === 200) {
                    ElMessage.success("提交成功");
                    emit("updateQuestionInfo");
                    close();
                }
            });
        };
        const close = () => {
            state.selectIndex = [];
            emit("update:dialogVisible", false);
        };
        return {
            ...toRefs(state),
            visible,
            handleComfirm,
            close,
            selectWrong
        };
    }
});
</script>

<style scoped lang="scss">
.text{
    font-size: 14px;
    color: #90949E;
    margin-bottom: 20px;
}
.content{
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    .topic{
        cursor: pointer;
        width: 100px;
        height: 32px;
        line-height: 32px;
        background: #FFFFFF;
        border-radius: 4px;
        border: 1px solid #E0E2E7;
        text-align: center;
        margin-bottom: 20px;
        margin-right: 20px;
    }
    .active{
        background: #FF6B6B;
        color: #fff;
        border: 1px solid #FF6B6B;
    }
}
:deep(.el-dialog__footer){
    border-top: 1px solid  #F5F6FA !important;
    padding-top: 20px !important;
}
.dialog-footer {
    display: flex;
    justify-content: space-between;
}
.num{
    color: #FF6B6B;
}
</style>
