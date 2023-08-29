<template>
    <el-dialog v-model="dialogVisible" center :title="type === 1 ? '小组比拼设置' : '选择学生'" width="650" @close="close" :close-on-click-modal="false">
       <div class="content" v-if="type === 1">
           <div class="content-top">
               <div class="text">当前班级：</div>
               <el-radio-group v-model="checkClassId" @change="changeClass">
                   <el-radio v-for="item in classList" :key="item.ClassUserCenterId" :label="item.ClassUserCenterId">
                       {{item.ClassName}}
                   </el-radio>
               </el-radio-group>
           </div>

           <div class="content-set">
               <div class="text">小组设置：</div>
               <div class="row" v-for="(item, index) in teamArr" :key="item.id">
                   <el-input v-model="item.name" />
                   <el-button type="primary" @click="checkStudent(item.studentList, index)" plain>{{item.studentList.length > 0 ? `已选${item.studentList.length}人` : "选择学生"}}</el-button>
                   <img @click="emits('addTeam', index)" src="./images/icon_add@2x.png" alt="">
                   <img  @click="emits('delTeam', index)" src="./images/icon_jian.png" alt="">
               </div>
           </div>
       </div>

        <div v-else class="content">
            <select-students ref="studentListRef"></select-students>
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="close">取消</el-button>
            <el-button type="primary" @click="save">保存</el-button>
          </span>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, toRefs, ref, PropType, nextTick } from "vue";
import { get, STORAGE_TYPES } from "@/utils/storage";
import { ICurrentSelectClass } from "@/types/store";
import SelectStudents from "./selectStudents.vue";
import { teamItem } from "./types";
import { Student } from "@/types/labelManage";
interface State {
    type: number,
    teamIndex: number,
    checkClassId: string,
    classList: ICurrentSelectClass[],
    allStudents: Student[],
    currentClassStudents: Student[],
}

const props = defineProps({
    visible: {
        type: Boolean,
        default: () => false
    },
    teamArr: {
        type: Array as PropType<teamItem[]>,
        default: () => []
    }
});

const emits = defineEmits(["update:modelValue", "delTeam", "addTeam", "addStudents", "delStudents"]);

const dialogVisible = computed(() => props.visible);

const state = reactive({
    type: 1, // 1选择班级 2选择学生
    teamIndex: 0,
    checkClassId: "",
    classList: get(STORAGE_TYPES.CLASS_LIST) || [],
    allStudents: get(STORAGE_TYPES.STUDENT_LIST) || [],
    currentClassStudents: []
});

const { type, checkClassId, classList } = toRefs(state);

const studentListRef = ref();
const checkStudent = (list: ICurrentSelectClass[], index:number) => {
    state.type = 2;
    state.teamIndex = index;
    nextTick(() => {
        studentListRef.value.checkAll = false;
        studentListRef.value.studentName = "";
        studentListRef.value.allStudents = state.currentClassStudents;
        studentListRef.value.checkedStudents = list;
    });
    console.log(state.allStudents, "allStudents-----");
};

const save = () => {
    if (state.type === 1) {
        emits("update:modelValue", false);
    } else {
        const checkedStudents = studentListRef.value.checkedStudents;
        const name = props.teamArr[state.teamIndex].name;
        const ids = checkedStudents.map((item:Student) => item.StudentID);
        // 是否从已被选的小组中，选择学生
        const selectIds = checkedStudents.filter((item:Student) => item.ifSelectTeam).map((item:Student) => item.StudentID);
        const selectList:Student[] = state.currentClassStudents.filter((item:Student) => ids.includes(item.StudentID)).map((item:Student) => {
            if (item.ifSelectTeam) {
                return {
                    ...item,
                    Name: item.cloneName + `(${name})`
                };
            } else {
                return {
                    ...item,
                    Name: item.Name + `(${name})`,
                    cloneName: item.Name,
                    ifSelectTeam: true
                };
            }
        });

        const noSelectList:Student[] = state.currentClassStudents.filter((item:Student) => (!(ids.includes(item.StudentID))));

        state.currentClassStudents = [...noSelectList, ...selectList];

        // 已被选的学生 从原数组中移除
        if (selectIds.length > 0) {
            emits("delStudents", selectIds);
        }
        emits("addStudents", state.teamIndex, selectList);
        state.type = 1;
        console.log(selectList, "selectList----");
        console.log(noSelectList, "noSelectList----");
        console.log(state.currentClassStudents, "state.currentClassStudents----");
    }
};

const changeClass = () => {
    emits("delStudents", [], true);
    state.currentClassStudents = state.allStudents.filter((v: any) => state.checkClassId === v.ClassID);
};

const close = () => {
    state.type === 1 ? emits("update:modelValue", false) : (state.type = 1);
};

onMounted(() => {
    state.checkClassId = state.classList[0]?.ClassUserCenterId;
    state.currentClassStudents = state.allStudents.filter((v: any) => state.checkClassId === v.ClassID);
});

</script>

<style scoped lang="scss">
.content{
    display: flex;
    flex-direction: column;
    height: 280px;
    .text{
        font-size: 16px;
        font-family: HarmonyOS_Sans_SC;
        color: #5F626F;
    }
    .content-top{
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin-bottom: 20px;
        .el-radio-group{
            margin-left: 10px;
            flex:1
        }

    }
    .content-set{
        flex: 1;
        overflow-y: auto;
        padding-right: 10px;
        .row{
            display: flex;
            justify-content: flex-start;
            align-items: center;
            margin-top: 10px;
            .el-input{
                flex: 1;
            }
            .el-button{
                width: 90px;
                margin-left: 10px;
            }
            img{
                width: 16px;
                height: 16px;
                margin-left: 10px;
                cursor: pointer;
            }
        }
    }
}

</style>
