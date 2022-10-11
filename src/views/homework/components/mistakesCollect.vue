<template>
    <el-dialog v-if="visible" v-model="visible" title="提示" width="362px" center @close="close">
            <div class="content" v-if="status === 0">
                <img class="img_class" src="@/assets/images/homeworkNew/pic_ctsj.png" alt="">
                <div class="content-text" v-if="status === 0">
                    <div class="text">请学生准备好一卡通</div>
                    <div class="text">进入【错题收集】应用开始点选错题</div>
                </div>
            </div>

            <div class="content" v-if="status === 2">
                <div class="bg-img">
                    <img class="search_class" src="@/assets/images/homeworkNew/ctsj_zhuti.png" alt="">
                </div>
                <div class="content-text">
                    <div class="text">
                        <span>正在收集…</span>
                        <span>{{finishCount}}/{{studentsList.length}}</span>
                    </div>
                    <div class="text-gary">请学生进入一卡通的【错题收集】应用</div>
                </div>
            </div>

            <div class="content" v-if="status === 1">
                <img class="img_class" src="@/assets/images/homeworkNew/pic_done.png" alt="">
                <div class="content-text">
                    <div class="text">已收集过，是否要再次发起？</div>
                </div>
            </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button v-if="status === 0" type="primary" @click="handleComfirm">开始</el-button>
            <el-button v-if="status === 2" type="danger"  plain @click="_overWrongTopicCollection">结束收集</el-button>
            <el-button v-if="status === 1" type="primary"  @click="handleComfirm">确定</el-button>
          </span>
        </template>
    </el-dialog>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, toRefs, PropType, watch, onUnmounted } from "vue";
import { Homework, StudentMission } from "@/types/homework";
import { sendWrongTopicDetail, GetStudentMissionList, overWrongTopicCollection } from "../api";
import mqtt from "mqtt";
import { YUN_API_ONECARD_MQTT } from "@/config";
interface State{
    status: number,
    studentsList: StudentMission[],
    collectionId: string,
    finishCount: number,
}

export default defineComponent({
    name: "mistakesCollect",
    props: {
        dialogVisible: {
            type: Boolean,
            require: true
        },
        mistakesCollectState: {
            type: Number,
            default: () => 0
        },
        info: {
            type: Object as PropType<Homework>,
            default: () => ({})
        }
    },
    emits: ["update:dialogVisible", "handleAddCard"],
    setup(props, { emit }) {
        const state = reactive<State>({
            status: 0,
            studentsList: [],
            collectionId: "",
            finishCount: 0
        });
        const visible = computed(() => props.dialogVisible);

        const client = mqtt.connect(YUN_API_ONECARD_MQTT || "", {
            port: 1883,
            username: "u001",
            password: "p001",
            keepalive: 30
        });

        const getPublish = (id: string) => {
            return `ErrorBack_${id}`;
        };

        watch(() => props.dialogVisible, (val) => {
            if (val) {
                state.status = props.mistakesCollectState;
            } else {
                client.unsubscribe(getPublish(state.collectionId));
            }
        });

        client && client.on("connect", function (err) {
            window.electron.log.info("client connect mistakes", err);
        });

        client && client.on("error", (err) => {
            window.electron.log.info("client error mistakes", err);
        });

        client && client.on("message", function (topic:any, message:any) {
            // message is Buffer
            const messageInfo = JSON.parse(message.toString());
            state.finishCount = messageInfo.ReplyCout || 0;
            console.log(messageInfo, "messageInfo");
        });

        const handleComfirm = async () => {
            if (state.status === 0 || state.status === 1) {
                await _GetStudentMissionList();
                await _sendWrongTopicDetail();
            }
        };
        const _GetStudentMissionList = () => {
            return GetStudentMissionList({ ID: props.info.ClassHomeworkPaperID }).then(res => {
                if (res.resultCode === 200) {
                    state.studentsList = res.result || [];
                }
            });
        };

        const _sendWrongTopicDetail = () => {
            const data = {
                ClassHomeworkPaperID: props.info?.ClassHomeworkPaperID,
                SubjectId: props.info?.SubjectID,
                SubjectName: props.info?.SubjectName,
                ClassId: props.info?.ClassID,
                ClassName: props.info?.ClassName,
                TotalCount: props.info?.AllStudentCount,
                StudentIds: state.studentsList.map((item:StudentMission) => item.StudentID)
            };
            sendWrongTopicDetail(data).then(res => {
                if (res.resultCode === 200) {
                    state.status = 2;
                    state.collectionId = res.result.WrongTopicCollectionId;
                    console.log(getPublish(state.collectionId), "getPublish");
                    client.subscribe(getPublish(state.collectionId));
                }
            });
        };

        const _overWrongTopicCollection = () => {
            overWrongTopicCollection({ Id: state.collectionId }).then(res => {
                if (res.resultCode === 200) {
                    close();
                }
            });
        };
        const close = () => {
            state.status = 0;
            state.finishCount = 0;
            state.collectionId = "";
            state.studentsList = [];
            emit("update:dialogVisible", false);
        };

        onUnmounted(() => {
            client && client.end();
        });

        return {
            ...toRefs(state),
            visible,
            _overWrongTopicCollection,
            handleComfirm,
            close
        };
    }
});
</script>
<style lang="scss" scoped>
.content{
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    .content-text{
        text-align: center;
    }
    .img_class{
        width: 72px;
        height: 72px;
        margin-bottom: 20px;
    }
    .bg-img{
        position: relative;
        width: 72px;
        height: 72px;
        background-image: url("../../../assets/images/homeworkNew/ctsj_bg.png");
        background-size: 100% 100%;
        margin-bottom: 20px;
        .search_class{
            position: absolute;
            left: 15px;
            top: 15px;
            width: 36px;
            height: 37px;
            animation: mySearch 3s linear infinite;
        }
    }
    .text{
        font-size: 14px;
        color: #19203D;
        margin-bottom: 10px;
        font-weight: 600;
    }
    .text-gary{
        font-size: 12px;
        color: #5F626F;
        margin-bottom: 10px;
    }
}

@keyframes mySearch {
    10% {
        left: 20px;
        top: 10px;
    }
    20% {
        left: 25px;
        top: 10px;
    }
    30% {
        left: 30px;
        top: 15px;
    }
    40% {
        left: 35px;
        top: 25px;
    }
    50% {
        left: 30px;
        top: 30px;
    }
    60% {
        left: 25px;
        top: 30px;
    }
    70% {
        left: 20px;
        top: 30px;
    }
    80% {
        left: 15px;
        top: 30px;
    }
    90% {
        left: 10px;
        top: 25px;
    }
    100% {
        left: 15px;
        top: 15px;
    }
}
</style>
