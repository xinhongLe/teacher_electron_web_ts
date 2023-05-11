<template>
    <div class="class-dialog">
        <el-dialog center width="710px" :model-value="classVisible" @close="close()">
            <template #title>
                <div class="class-header">将本页发送至学生端</div>
            </template>
            <div class="is-class">
                <el-form :model="form" label-width="120px" size="large">
                    <el-form-item label="选择班级：">
                        <el-select v-model="form.checkedClass" placeholder="选择班级" style="width:100%">
                            <el-option
                                v-for="item in classList"
                                :key="item.ClassId"
                                :label="item.ClassName"
                                :value="item.ClassId"
                            />
                        </el-select>
                    </el-form-item>
                    <!--                    暂时注释！！！！！-->
                    <!--                    <el-form-item label="请选择类型：">-->
                    <!--                        <div class="btn-class" v-for="item in typeList" @click="currentType = item.QuestionId"-->
                    <!--                             :class="{isActive:currentType === item.QuestionId}">-->
                    <!--                            {{ item.QuestionName }}-->
                    <!--                        </div>-->
                    <!--                    </el-form-item>-->
                    <!--                    <el-form-item label="答题方式：" v-if="currentType === 6">-->
                    <!--                        <div class="btn-class" v-for="item in answerTypeList"-->
                    <!--                             @click="currentAnswerType = item.QuestionId"-->
                    <!--                             :class="{isActive:currentAnswerType === item.QuestionId}">-->
                    <!--                            {{ item.QuestionName }}-->
                    <!--                        </div>-->
                    <!--                    </el-form-item>-->
                    <!--                    <el-form-item label="选项个数：" v-if="currentType === 6 && currentAnswerType === 1">-->
                    <!--                        <el-select v-model="form.selectNum" placeholder="选项个数" style="width:100%">-->
                    <!--                            <el-option label="1" :value="1"/>-->
                    <!--                            <el-option label="2" :value="2"/>-->
                    <!--                            <el-option label="3" :value="3"/>-->
                    <!--                            <el-option label="4" :value="4"/>-->
                    <!--                            <el-option label="5" :value="5"/>-->
                    <!--                        </el-select>-->
                    <!--                    </el-form-item>-->
                    <!--                    <div v-if="currentType === 6 &&  currentAnswerType === 1 && form.selectNum">-->
                    <!--                        <el-form-item label="">-->
                    <!--                            <div class="num-calss" @click="curSelNumType = 1" :class="{isActive:curSelNumType === 1}">-->
                    <!--                                <div class="num-calss-left">-->
                    <!--                                    <div class="num-calss-item" v-for="item in ENList.slice(0,form.selectNum)">-->
                    <!--                                        {{ item }}-->
                    <!--                                    </div>-->
                    <!--                                </div>-->
                    <!--                                <img v-if="curSelNumType === 1" src="../../images/slices/icon_xuanzhong.png" alt=""/>-->
                    <!--                            </div>-->
                    <!--                            <div class="num-calss" @click="curSelNumType = 2" :class="{isActive:curSelNumType === 2}">-->
                    <!--                                <div class="num-calss-left">-->
                    <!--                                    <div class="num-calss-item" v-for="item in NUMList.slice(0,form.selectNum)">-->
                    <!--                                        {{ item }}-->
                    <!--                                    </div>-->
                    <!--                                </div>-->

                    <!--                                <img v-if="curSelNumType === 2" src="../../images/slices/icon_xuanzhong.png" alt=""/>-->
                    <!--                            </div>-->
                    <!--                        </el-form-item>-->
                    <!--                    </div>-->
                </el-form>
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

export default defineComponent({
    props: {
        classVisible: {
            type: Boolean,
            default: false
        },
        currentSlide: {
            type: Object,
        },
        sendSuccess: {
            type: Boolean,
            default: false
        }
    },
    emits: ["selectedClassList", "update:classVisible", "update:sendSuccess"],
    setup(props, {emit}) {

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
        ]);
        const ENList = ref([
            "A", "B", "C", "D", "E", "F", "G", "H", "I", "J"
        ]);
        const NUMList = ref([
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10
        ]);
        const curSelNumType = ref<number | null>();
        const form = ref({
            checkedClass: "",//选择班级
            checkedType: "",//选择类型
            answerType: "",//答题方式
            selectNum: null,//选项个数
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
        // const mqttParams = ref({
        //     ElementId: '',
        //     ID: '',
        //     CreateTime: '',
        //     UpdateTime: '',
        //     DeleteTime: '',
        //     DeleteFlag: 0,
        //     Name: '',
        //     FileType: 10,
        //     ChooseType: 10,
        //     OssRegion: '',
        //     OssExtention: 'zip',
        //     OssPath: 'TeachingMiniToolFile',
        //     OssBucket: 'axsfile',
        //     OssName: '',
        //     Size: 0,
        //     FileMD5: '',
        //     EncryptedFileMD5: '',
        //     ClassID: '',
        //     QuestionId: '',
        //     QuestionType: null,
        //     QuestionOption: '',
        //     QuestionNum: 0,
        //     Type: 2,
        //     QuestionDetail: '',
        //     TeacherID: store.state.userInfo.userCenterUserID,
        //     CollectAnswer: '',
        //     TimeStamp: '',
        //     Topic: '',
        //     IsEnd: false,
        //     StudentAnswerStatus: 0,
        //     S1: '',
        //     S2: '',
        //     S3: '',
        //     R1: '',
        //     R2: '',
        //     IsCanInteraction: 'ture'
        // });

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
                const res = await QuestionShare(teachShareParams.value)
                if (res.success) {
                    ElMessage.success("发送成功");
                    emit("update:sendSuccess", true);
                    emit("update:classVisible", false);
                    // const timeStamp = new Date().getTime();
                    // mqttParams.value.TimeStamp = String(timeStamp);
                    // mqttParams.value.ElementId = "element_" + timeStr;
                    // mqttParams.value.QuestionId = "question_" + timeStr;
                    // mqttParams.value.S3 = props.currentSlide?.teach.src;
                    // mqttParams.value.OssName = props.currentSlide?.id;
                    // mqttParams.value.Name = props.currentSlide?.teach.name;
                    // mqttParams.value.ClassID = form.value.checkedClass;
                    // mqttParams.value.Topic = "sharestudent_" + form.value.checkedClass;
                    // console.log('mqttParams.value', mqttParams.value)
                    // client.publish("sharestudent_" + form.value.checkedClass, JSON.stringify(mqttParams.value));
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

        return {
            form,
            checkedClass,
            classList,
            answerTypeList,
            typeList,
            currentAnswerType,
            currentType,
            ENList,
            NUMList,
            curSelNumType,
            // mqttParams,
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

                .num-calss {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    width: 100%;
                    height: 52px;
                    background: #F5F6FA;
                    border-radius: 4px;
                    border: 1px solid #E0E2E7;
                    padding: 8px 12px;
                    margin-bottom: 8px;
                    cursor: pointer;

                    .num-calss-left {
                        display: flex;
                        align-items: center;

                        .num-calss-item {
                            width: 36px;
                            height: 36px;
                            background: #FFFFFF;
                            border-radius: 4px;
                            text-align: center;
                            line-height: 36px;
                            font-size: 16px;
                            font-family: PingFangSC-Regular, PingFang SC;
                            font-weight: 400;
                            color: #19203D;
                            margin-right: 12px;
                        }

                        &.isActive {
                            background: #E6ECFF;
                            border: 1px solid #98AEF6;
                        }
                    }

                }
            }
        }

    }
}
</style>
