<template>
    <div>
       <div class="quick-detail">
           <div class="content">
               <div class="header">
                   <span>班级：</span>
                   <el-select v-model="currentClass"  placeholder="请选择">
                       <el-option
                           v-for="item in classList"
                           :key="item.ID"
                           :label="item.Name"
                           :value="item.ID"
                       />
                   </el-select>
               </div>
               <div class="process">
                   <div class="title">{{message === 0 ? "还未开始抢答" : (message === 1 ? "抢答中…" : "抢答成功学生")}}</div>
                   <img class="photo" v-if="message === 0" src="@/assets/images/suspension/pic_avatar.png" alt="">
                   <div class="quick-success" v-if="message === 2">
                       <div style="text-align: center;">
                           <img class="photo" src="@/assets/images/suspension/pic_avatar.png" alt="">
                           <div class="name">木卿欣</div>
                       </div>
                       <div class="zan">
                           <img @click="handlePraiseStudent" v-if="status === 0" src="@/assets/images/suspension/icon_zan1.png" alt="">
                           <img v-else src="@/assets/images/suspension/icon_zan_selected1.png" alt="">
                       </div>
                   </div>
           </div>
       </div>
       <div class="footer">
           <div :class="['custom-btn', message === 1 ? 'canCle-btn' : '']" @click="handleConfirm">{{message === 0 ? "开始抢答" : (message === 1 ? "取消抢答" : "再抢一次")}}</div>
       </div>

       </div>
       <div class="close-row">
           <div class="close-btn" @click="close">
               <el-icon :size="14" color="#FFFFFF"><close /></el-icon>
               <span>关闭</span>
           </div>
       </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive, watch, toRefs } from "vue";
import { LessonClasses } from "@/types/login";
import { sendRushToAnswer, praiseStudent } from "./api";
import { UserInfoState } from "@/types/store";
export default defineComponent({
    name: "quickAnswerDetail",
    props: {
        classList: {
            type: Array as PropType<LessonClasses[]>,
            default: () => []
        },
        currentUserInfo: {
            type: Object as PropType<UserInfoState>
        }
    },
    setup(props) {
        const state = reactive({
            currentClass: "",
            status: 0,
            message: 0 // 0未开始抢答 1抢答中 2抢答成功
        });
        watch(() => props.classList, (val) => {
            if (val?.length > 0) {
                state.currentClass = val[0].ID;
            }
        }, { immediate: true });

        const handlePraiseStudent = () => {
            const data = {
                StudentIdList: [],
                AnswerMachineID: "",
                TeacherID: props.currentUserInfo!.userCenterUserID
            };
            praiseStudent(data).then(res => {
                if (res.resultCode === 200) {
                    state.status = 1;
                }
            });
        };

        const handleConfirm = () => {
            state.status = 0;
            if (state.message === 0 || state.message === 2) {
                const data = {
                    TeacherID: props.currentUserInfo!.userCenterUserID,
                    OrgID: props.currentUserInfo!.schoolId,
                    ClassID: state.currentClass
                };
                sendRushToAnswer(data).then(res => {
                    if (res.resultCode === 200) {
                        state.message = 2;
                    }
                });
            } else {
                state.message = 0;
            }
        };
        const close = () => {
            window.electron.destroyWindow();
        };

        return {
            ...toRefs(state),
            handleConfirm,
            handlePraiseStudent,
            close
        };
    }
});
</script>

<style scoped lang="scss">
.quick-detail{
    border-radius: 12px;
    background-color: #fff;
}
.content{
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    position: relative;
    width: 100%;
    height: 260px;
    background-image: url("../../assets/images/suspension/qiangda_bg.png") !important;
    background-position: center center;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    .header{
        position: absolute;
        left: 20px;
        top: 10px;
        font-size: 14px;
        color: #fff;
        :deep(.el-select){
            width: 120px;
            .el-input__inner{
                background: transparent;
                border: none;
                color: #fff;
            }
        }
    }
    .process{
        .title{
            font-size: 20px;
            color: #FFFFFF;
            margin: 40px 0 20px;
        }
        .photo{
            width: 88px;
            height: 88px;
        }
        .quick-success{
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            .name{
                font-size: 16px;
                color: #FFFFFF;
                margin-top: 10px;
            }
            .zan{
                cursor: pointer;
                position: absolute;
                top: 30px;
                right: -50px;
                margin-left: 30px;
            }
        }
    }
}
.footer{
    background-color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%;
    padding: 2rem 0 10px;
    border-radius: 12px;
    .custom-btn{
        cursor: pointer;
        width: 196px;
        height: 64px;
        line-height: 50px;
        text-align: center;
        font-size: 16px;
        color: #FFFFFF;
        background: url("../../assets/images/suspension/btn_qd.png") no-repeat center center;
        background-size: 100% 100%;
    }
    .canCle-btn{
        background: url("../../assets/images/suspension/btn_quxiao.png") no-repeat center center;
    }
}

.close-row{
    display: flex;
    justify-content: center;
    width: 100%;
    .close-btn{
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 112px;
        height: 36px;
        line-height: 36px;
        text-align: center;
        font-size: 14px;
        color: #FFFFFF;
        background: rgba(255,255,255,0.2);
        border-radius: 18px;
        border: 1px solid #FFFFFF;
        margin-top: 20px;
        >span{
            margin-left: 4px;
        }
    }
}

</style>
