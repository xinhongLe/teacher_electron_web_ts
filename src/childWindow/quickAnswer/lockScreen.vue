<template>
    <div class="lock-screen">
        <Title title="一卡通锁屏管理" :close="close"></Title>
        <div class="content">
          <div class="row" v-for="(item,i) in classList" :key="i">
              <span>{{item.ClassName}}</span>
              <el-switch v-model="item.Stauts"
                         @change="_classDisabled(item)"
                         inline-prompt
                         :active-value="0"
                         :inactive-value="1"
                         active-text="解锁"
                         inactive-text="锁定"
                         size="large"
              />
          </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType, reactive, toRefs } from "vue";
import Title from "@/childWindow/answerMachine/title.vue";
import { classDisabled, getClassEquipmentStatus } from "./api";
import { UserInfoState } from "@/types/store";
import { ElMessage } from "element-plus";
interface ItemClass {
    ClassID: string,
    ClassName:string,
    Stauts:number // 0 上课启用 1 上课禁用
}
interface State {
    classList: ItemClass[]
}
export default defineComponent({
    name: "lockScreen",
    components: { Title },
    props: {
        currentUserInfo: {
            type: Object as PropType<UserInfoState>
        }
    },
    setup(props, { emit }) {
        const state = reactive<State>({
            classList: []
        });

        const close = () => {
            window.electron.destroyWindow();
        };

        const _getClassEquipmentStatus = () => {
            const data = {
                TeacherID: props.currentUserInfo!.userCenterUserID,
                OrgID: props.currentUserInfo!.schoolId
            };
            getClassEquipmentStatus(data).then(res => {
                if (res.resultCode === 200) {
                    state.classList = res.result || [];
                }
            });
        };

        const _classDisabled = (item:ItemClass) => {
            const data = {
                TeacherID: props.currentUserInfo!.userCenterUserID,
                OrgID: props.currentUserInfo!.schoolId,
                ClassID: item.ClassID,
                Type: item.Stauts
            };
            classDisabled(data).then(res => {
                if (res.resultCode === 200) {
                    ElMessage.success(`${item.Stauts === 0 ? "解锁" : "锁定"}成功`);
                }
            });
        };

        onMounted(() => {
            _getClassEquipmentStatus();
        });

        return {
            ...toRefs(state),
            _classDisabled,
            close
        };
    }
});
</script>

<style scoped lang="scss">
.lock-screen{
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    background-color: #fff;
    font-size: 14px;
    border-radius: 12px;
}
.content{
    flex: 1;
    overflow-y: auto;
    padding: 0 40px 40px;
   .row{
       height: 50px;
       display: flex;
       justify-content: space-between;
       align-items: center;
       border-bottom: 1px solid #E9ECF0;
       color: #19203D;
       //:deep(.el-switch){
       //    .el-switch__label.is-active{
       //        color: #6E6D7A;
       //    }
       //}
   }
}
</style>
