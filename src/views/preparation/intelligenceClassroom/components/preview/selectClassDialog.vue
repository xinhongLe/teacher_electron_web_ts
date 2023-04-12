<template>
    <div class="class-dialog">
        <el-dialog center width="50vw" :model-value="classVisible" @close="close()">
            <template #title>
                <div class="class-header">
                    将本页发送至学生端
                </div>
            </template>
            <div class="is-class">
                <el-form :model="form" label-width="120px">
                    <el-form-item label="选择班级：">
                        <el-select v-model="form.checkedClass" placeholder="选择班级">
                            <el-option
                                v-for="item in classList"
                                :key="item.ClassId"
                                :label="item.ClassName"
                                :value="item.ClassId"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="请选择类型：">
                        <div class="btn-class" v-for="item in typeList" @click="currentType = item.QuestionId"
                             :class="{isActive:currentType === item.QuestionId}">
                            {{ item.QuestionName }}
                        </div>
                    </el-form-item>
                    <el-form-item label="答题方式：">
                        <div class="btn-class" v-for="item in answerTypeList"
                             @click="currentAnswerType = item.QuestionId"
                             :class="{isActive:currentAnswerType === item.QuestionId}">
                            {{ item.QuestionName }}
                        </div>
                    </el-form-item>
                </el-form>
                <!--                <div>-->
                <!--                    <span>选择类型：</span>-->
                <!--                    <el-radio-group v-model="checkedClass">-->
                <!--                        <el-radio style="margin-bottom: 10px;" :label="item.Id" v-for="item in classList" size="large"-->
                <!--                                  border>{{ item.Name }}-->
                <!--                        </el-radio>-->
                <!--                    </el-radio-group>-->
                <!--                </div>-->

            </div>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="close()"> 取消</el-button>
                    <el-button type="primary" @click="send()"> 发送</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import {defineComponent, ref, onMounted, onUnmounted} from "vue";
import {GetGradeClass, ITeachShare, QuestionShare} from "@/api/prepare";
import {get, STORAGE_TYPES} from "@/utils/storage";
import {store} from "@/store";
import {ElMessage, ElMessageBox} from "element-plus";
import mqtt from "mqtt";
import {YUN_API_ONECARD_MQTT} from "@/config";

export default defineComponent({
    props: {
        classVisible: {
            type: Boolean,
            default: false
        },
        currentSlide: {
            type: Object,
        }
    },
    emits: ["selectedClassList", "update:classVisible"],
    setup(props, {emit}) {
        const client = mqtt.connect(YUN_API_ONECARD_MQTT || "", {
            port: 1883,
            username: "u001",
            password: "p001",
            keepalive: 30
        });
        client && client.on("message", function (topic: any, message: any) {
            // message is Buffer
            const infoString = JSON.parse(message.toString());
            console.log("infoString", infoString);
        });
        const checkedClass = ref("");
        const checkedType = ref("");
        const classList: any = ref([]);
        const typeList = ref([
            {
                QuestionId: 5,
                QuestionName: "无需提交"
            },
            {
                QuestionId: 6,
                QuestionName: "选择/判断"
            },
            {
                QuestionId: 7,
                QuestionName: "截图/拍照"
            }
        ]);
        const currentType = ref();
        const currentAnswerType = ref();
        const answerTypeList = ref([
            {
                QuestionId: 1,
                QuestionName: "单选"
            },
            {
                QuestionId: 2,
                QuestionName: "多选"
            },
            {
                QuestionId: 3,
                QuestionName: "判断"
            }
        ])
        const form = ref({
            checkedClass: "",//选择班级
            checkedType: "",//选择类型
            answerType: "",//答题方式
            selectNum: "",//选项个数
        });
        const teachShareParams = ref<ITeachShare>({
            timeStr: '',
            ElementId: '',
            QuestionId: '',
            S3: '',
            OssName: '',
            Name: '',
            FileType: 10,
            ChooseType: 10,
            OssExtention: 'zip',
            OssPath: 'TeachingMiniToolFile',
            OssBucket: 'axsfile',
            ClassID: '',
            DeleteFlag: 0,
            TeacherID: store.state.userInfo.userCenterUserID,
            IsEnd: false,
            Type: 2,
            Topic: ''
        });
        const close = () => {
            checkedClass.value = "";
            emit("update:classVisible", false);
        };
        const send = async () => {
            if (form.value.checkedClass) {
                // emit("selectedClassList", checkedClass.value);
                const timeStr = new Date().getTime();
                teachShareParams.value.timeStr = String(timeStr);
                teachShareParams.value.ElementId = "element_" + timeStr;
                teachShareParams.value.QuestionId = "question_" + timeStr;
                teachShareParams.value.S3 = props.currentSlide?.teach.src;
                teachShareParams.value.OssName = props.currentSlide?.id;
                teachShareParams.value.Name = props.currentSlide?.teach.name;
                teachShareParams.value.ClassID = form.value.checkedClass;
                teachShareParams.value.Topic = "sharestudent_" + form.value.checkedClass;
                console.log(
                    'teachShareParams.value', teachShareParams.value
                )
                const res = await QuestionShare(teachShareParams.value)
                if (res.success) {
                    ElMessage.success("发送成功");
                    emit("update:classVisible", false);
                    client.subscribe("sharestudent_" + form.value.checkedClass, (err => {
                        client.publish("sharestudent_" + form.value.checkedClass, "sharestudent_" + props.currentSlide?.teach.src);
                    }));
                }
            }
        };
        const _getTeacherClassList = async () => {
            const res = await GetGradeClass();
            res.result?.forEach((item) => {
                item.ClassData.forEach((item2: any) => {
                    classList.value.push(item2)
                })
            });
        };

        onMounted(() => {
            _getTeacherClassList();
        });
        onUnmounted(() => {
            client.end();
        });
        return {
            form,
            checkedClass,
            classList,
            answerTypeList,
            typeList,
            currentAnswerType,
            currentType,
            close,
            send
        }
    }
});
</script>

<style lang="scss" scoped>
.class-dialog {
    :deep(.el-dialog) {
        .el-dialog__header {
            .class-header {
                font-size: 20px;
                font-weight: 600;
                color: #19203D;
            }

            border-bottom: 1px solid #E9ECF0;
        }

        .el-dialog__body {
            padding: 58px 69px !important;
        }

        .el-dialog__footer {
            border-top: 1px solid #E9ECF0;
            padding: 0;

            .dialog-footer {
                background: #FFFFFF;
                border-radius: 0px 0px 8px 8px;
                width: 100%;
                justify-content: center;
                display: flex;
                padding: 16px 24px;
                border-bottom: 1px #F5F6FA;

                .el-button {
                    height: 36px;
                    //background: #4B71EE;
                    min-width: 120px;
                }

                .el-button.el-button--primary {
                    background: #4B71EE;
                }
            }
        }

        .el-form {
            .el-form-item {
                .btn-class {
                    width: 112px;
                    height: 40px;
                    background: #FFFFFF;
                    border-radius: 4px;
                    border: 1px solid #E0E2E7;
                    text-align: center;
                    font-size: 16px;
                    font-weight: 400;
                    color: #5F626F;
                    line-height: 40px;
                    margin-right: 16px;
                    cursor: pointer;

                    &.isActive {
                        background: #4B71EE;
                        color: #fff;
                    }
                }
            }
        }

    }
}
</style>
