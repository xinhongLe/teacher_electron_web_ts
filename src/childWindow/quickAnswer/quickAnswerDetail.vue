<template>
    <div>
       <div class="quick-detail">
           <div class="content">
               <div class="header">
                   <span>班级：</span>
                   <el-select v-model="currentClass"  placeholder="请选择">
                       <el-option
                           v-for="item in classList"
                           :key="item.ClassId"
                           :label="item.ClassName"
                           :value="item.ClassId"
                       />
                   </el-select>
               </div>
               <div class="process">
                   <div class="title">{{message === 0 ? "还未开始抢答" : (message === 1 ? "抢答中…" : "抢答成功学生")}}</div>
                   <img class="photo" v-if="message === 0" src="@/assets/images/suspension/pic_avatar.png" alt="">
                   <div class="quick-success" v-if="message === 2">
                       <div style="text-align: center;">
                           <img class="photo" src="@/assets/images/suspension/pic_avatar.png" alt="">
                           <div class="name">{{studentInfo.name}}</div>
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
import { defineComponent, PropType, reactive, watch, toRefs, onUnmounted } from "vue";
import { sendRushToAnswer, praiseStudent } from "./api";
import { UserInfoState } from "@/types/store";
import mqtt from "mqtt";
import { IClassItem } from "@/types/quickAnswer";
import { YUN_API_ONECARD_MQTT } from "@/config";
export default defineComponent({
    name: "quickAnswerDetail",
    props: {
        classList: {
            type: Array as PropType<IClassItem[]>,
            default: () => []
        },
        currentUserInfo: {
            type: Object as PropType<UserInfoState>
        }
    },
    setup(props) {
        const state = reactive({
            answerMachineID: "",
            currentClass: "",
            status: 0,
            message: 0, // 0未开始抢答 1抢答中 2抢答成功
            studentInfo: {
                name: "",
                id: ""
            }
        });
        watch(() => props.classList, (val) => {
            if (val?.length > 0) {
                state.currentClass = val[0].ClassId;
            }
        }, { immediate: true });

        const client = mqtt.connect(YUN_API_ONECARD_MQTT || "", {
            port: 1883,
            username: "u001",
            password: "p001",
            keepalive: 30
        });

        const getPublish = (id: string) => {
            return `answer_student_rush_${id}`;
        };

        client && client.on("connect", function (err) {
            window.electron.log.info("client connect quickAnswer", err);
        });

        client && client.on("error", (err) => {
            window.electron.log.info("client error quickAnswer", err);
        });

        client && client.on("message", function (topic:any, message:any) {
            console.log(message.toString(), "message.toString()");
            // message is Buffer
            const messageInfo = JSON.parse(message.toString()); // {"ReceiveTime":"2022-09-15 03:54:50","StudentId":"16625405853534467275379851772585","StudentName":"张国庆"}
            state.studentInfo.name = messageInfo.StudentName;
            state.studentInfo.id = messageInfo.StudentId;
            state.message = 2;
            client.unsubscribe(getPublish(state.answerMachineID));
        });

        const handlePraiseStudent = () => {
            const data = {
                Type: 1,
                SchoolID: props.currentUserInfo!.schoolId,
                TeacherID: props.currentUserInfo!.userCenterUserID,
                TeacherName: props.currentUserInfo!.name || "",
                StudentList: [{
                    StudentID: state.studentInfo.id,
                    StudentName: state.studentInfo.name,
                    ClassID: state.currentClass,
                    ClassName: props.classList?.find(item => item.ClassId === state.currentClass)?.ClassId || ""
                }],
                LabelList: [{
                    LabelID: "ab299e61-bbbd-11ec-8bcf-00163e167f3f",
                    LabelName: "上课表现积极",
                    Score: 1,
                    ScoreType: 1
                }]
            };
            praiseStudent(data).then(res => {
                if (res.resultCode === 200) {
                    state.status = 1;
                }
            });
        };

        const handleConfirm = () => {
            state.status = 0;
            state.studentInfo.name = "";
            state.studentInfo.id = "";
            if (state.message === 0 || state.message === 2) {
                const data = {
                    TeacherID: props.currentUserInfo!.userCenterUserID,
                    OrgID: props.currentUserInfo!.schoolId,
                    ClassID: state.currentClass
                };
                sendRushToAnswer(data).then(res => {
                    if (res.resultCode === 200) {
                        state.message = 1;
                        state.answerMachineID = res.result.AnswerMachineID;
                        client.subscribe(getPublish(state.answerMachineID));
                    }
                });
            } else {
                state.message = 0;
                client.unsubscribe(getPublish(state.answerMachineID));
            }
        };
        const close = () => {
            window.electron.destroyWindow();
        };

        onUnmounted(() => {
            client.end();
        });

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
            .el-input__wrapper{
                background: transparent;
                box-shadow: none !important;
            }
            .el-input__inner{
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
