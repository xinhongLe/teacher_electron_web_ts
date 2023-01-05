<template>
    <el-dialog
        v-model="visible"
        :title="showTemplateType === 1 ? '保存模板' : '保存题目'"
        width="620px"
        :align-center="true"
        center
        @close="close"
    >
        <div class="page-type-box">
            <el-form
                ref="ruleForm"
                size="large"
                :model="form"
                :rules="rules"
                label-width="120px"
                @submit.prevent="() => false"
            >
                <el-form-item
                    v-if="showTemplateType === 1"
                    label="模版名称："
                    prop="Name"
                >
                    <el-input v-model="form.Name"></el-input>
                </el-form-item>
                <el-form-item
                    v-if="windowInfo.originType == 0"
                    :label="
                        showTemplateType === 1 ? '课堂环节：' : '保存位置：'
                    "
                    prop="TeachPageClassroomLink"
                >
                    <el-radio-group v-model="form.TeachPageClassroomLink">
                        <el-radio
                            v-for="(item, index) in (classroomLinkList as any)"
                            :label="
                                JSON.stringify({
                                    TeachPageClassroomLinkID: item.ID || '',
                                    Name: item.Name || '',
                                })
                            "
                            :key="index"
                        >
                            {{ item.Name }}
                            <el-icon
                                v-if="!item.ID"
                                color="red"
                                :size="12"
                                @click.stop="removeLinkName(index)"
                            >
                                <Close />
                            </el-icon>
                        </el-radio>
                        <div class="add-link">
                            <span class="add-icon">
                                <el-icon
                                    color="#fff"
                                    :size="14"
                                    @click="insertLinkList"
                                >
                                    <Plus />
                                </el-icon>
                            </span>
                            <el-input
                                style="width: 50%"
                                size="small"
                                v-model="linkName"
                                @keyup.enter.native="insertLinkList"
                                placeholder="请输入"
                            />
                        </div>
                    </el-radio-group>
                </el-form-item>
                <el-form-item
                    v-if="windowInfo.originType == 0"
                    :label="
                        showTemplateType === 1 ? '预估时长：' : '题目数量：'
                    "
                    prop="EstimatedDuration"
                >
                    <el-input-number
                        size="default"
                        v-model="form.EstimatedDuration"
                        controls-position="right"
                        :min="0"
                        :max="10"
                    />
                    <span class="text" v-if="showTemplateType === 1">分钟</span>
                </el-form-item>
                <el-form-item
                    label="是否上架："
                    prop="Status"
                    v-if="windowInfo.originType == 0"
                >
                    <el-switch
                        :active-value="1"
                        :inactive-value="0"
                        v-model="form.Status"
                    />
                </el-form-item>
            </el-form>
        </div>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="close">取消</el-button>
                <el-button type="primary" @click="handleComfirm"
                    >确定</el-button
                >
            </span>
        </template>
    </el-dialog>
</template>

<script lang="ts">
import {
    computed,
    defineComponent,
    reactive,
    toRefs,
    ref,
    onMounted,
    watch,
    nextTick,
} from "vue";
import useSaveTemplate from "@/views/preparation/intelligenceClassroom/edit/hooks/useSaveTemplate";
//   import { formatSeconds2 } from '@/utils/common';
//   import { downloadFile } from '@/utils/oss';
import { store } from "@/store";
import { Close } from "@element-plus/icons-vue";
export default defineComponent({
    name: "saveTemplateDialog",
    props: {
        dialogVisible: {
            type: Boolean,
            default: () => false,
        },
        showTemplateType: {
            type: Number,
            default: () => 1,
        },
        lessonId: {
            type: String,
            required: true,
        },
        subjectID: {
            type: String,
            required: true,
        },
        dialogStatus: {
            type: String,
            required: true,
        },
        selectPageData: {
            type: Array,
            required: true,
        },
    },
    emits: ["update:dialogVisible", "handleAddTemplate", "cacleTemplateDialog"],
    setup(props, { emit }) {
        // console.log(store);
        const windowInfo = computed(
            () => store.state.preparation.editWindowInfo
        );
        const TeacherID = computed(() => store.state.userInfo.id);

        const { queryClassroomLinkList, classroomLinkList } = useSaveTemplate();
        const state = reactive({
            rules: {
                Name: [
                    {
                        required: true,
                        message: "请输入模板名称",
                        trigger: "change",
                    },
                ],
                TeachPageClassroomLink: [
                    {
                        required: true,
                        message: "请选择课堂环节",
                        trigger: "change",
                    },
                ],
                EstimatedDuration: [
                    {
                        required: true,
                        message: "请输入预估时长",
                        trigger: "change",
                    },
                ],
                Status: [
                    {
                        required: true,
                        message: "请选择是否上架",
                        trigger: "change",
                    },
                ],
            },
            linkList: [
                { label: "课堂引入", status: 0 },
                { label: "读写字词", status: 1 },
                { label: "课文赏析", status: 2 },
            ],
            form: {
                ID: "",
                //模板名称
                Name: "",
                //课堂环节
                TeachPageClassroomLink: null,
                // {
                //     //课堂环节id
                //     TeachPageClassroomLinkID: "",
                //     //课堂环节名称
                //     Name: ""
                // },
                //预估时长
                EstimatedDuration: 0,
                //上下架
                Status: 1,
                //教师id
                TeacherID: TeacherID.value,
                //科目Id
                SubjectID: computed(() => props.subjectID).value,
                //课时id
                LessonID: computed(() => props.lessonId).value,
                //是否有音频
                HavingAudio: 0,
                //是否有视频
                HavingVideo: 0,
            },
            linkName: "",
            hasva: false,
        });

        onMounted(() => {
            //编辑模板-暂时去掉了
            // if (props.dialogStatus == 'edit') {
            //   nextTick(() => {
            //     console.log('编辑模板时回显', props.dialogStatus, props.templateFormData);
            //     const data: any = props.templateFormData;
            //     state.form = Object.assign(data, {
            //       SubjectID: computed(() => props.subjectID).value,
            //       LessonID: computed(() => props.lessonId).value
            //     });
            //   });
            // }
            //教师不查课堂环节
            // queryClassroomLinkList({ SubjectID: props.subjectID });
        });
        watch(
            () => props.selectPageData,
            (val: any) => {
                console.log("模板数据", val);
                state.form.EstimatedDuration = val.length;
                // if (val.length) {
                //   val.forEach((item: any) => {
                //     if (item.Json) {
                //       const jsonData: any = JSON.parse(item.Json);
                //       const havingAudio = jsonData.elements?.some((el: any) => el.type == 'audio') ? 1 : 0;
                //       const havingVideo = jsonData.elements?.some((el: any) => el.type == 'video') ? 1 : 0;
                //       if (havingAudio || havingVideo) {
                //         state.hasva = true;
                //         // state.form.EstimatedDuration += 1.3;
                //         jsonData.elements.forEach(async (el: any) => {
                //           if (el.type == 'video' || el.type == 'audio') {
                //             const fileUrl: any = await downloadFile(el.src);
                //             // const time = await videoUpload(fileUrl.url);
                //             const audio: any = new Audio(fileUrl.url);
                //             let duration: any = '';
                //             audio.addEventListener('loadedmetadata', () => {
                //               duration = Number(formatSeconds2(parseInt(audio.duration))); // 通过添加监听来获取视频总时长字段，即duration
                //               state.form.EstimatedDuration += duration;
                //             });
                //           }
                //         });
                //       } else {
                //         // state.hasva = false;
                //         state.form.EstimatedDuration += 1.3;
                //         state.form.EstimatedDuration = Number(state.form.EstimatedDuration.toFixed(1));
                //       }
                //     }
                //   });
                // }
            },
            {
                deep: true,
                immediate: true,
            }
        );
        // watch(
        //   () => [state.hasva, state.form.EstimatedDuration],
        //   (val: any) => {
        //     if (val[0] && val[1]) {
        //       console.log('va', val);
        //       console.log(Math.ceil(state.form.EstimatedDuration));

        //       state.form.EstimatedDuration = Math.ceil(state.form.EstimatedDuration);
        //     }
        //   },
        //   { deep: true, immediate: true }
        // );
        // watch(
        //   () => [state.form.EstimatedDuration, state.hasva],
        //   (val: any) => {
        //     if (val) {
        //       val[0] = Math.ceil(val[0]);
        //       console.log('va', val);

        //       // state.form.EstimatedDuration = val;
        //     }
        //   },
        //   { deep: true, immediate: true }
        // );
        const ruleForm = ref();
        const visible = computed(() => props.dialogVisible);
        //保存模板-确认
        const handleComfirm = () => {
            ruleForm.value.validate((valid: boolean) => {
                if (valid) {
                    emit("handleAddTemplate", state.form);
                    // close();
                }
            });
        };
        //手动输入一条课堂环节
        const insertLinkList = () => {
            classroomLinkList.value.push({ ID: "", Name: state.linkName });
            state.linkName = "";
        };
        //手动删除一条课堂环节
        const removeLinkName = (index: number) => {
            classroomLinkList.value.splice(index, 1);
        };
        const close = () => {
            emit("cacleTemplateDialog");
            emit("update:dialogVisible", false);
        };
        return {
            ...toRefs(state),
            ruleForm,
            visible,
            windowInfo,
            TeacherID,
            handleComfirm,
            close,
            classroomLinkList,
            insertLinkList,
            removeLinkName,
        };
    },
    components: { Close },
});
</script>

<style scoped lang="scss">
.add-link {
    display: flex;
    justify-content: flex-start;
    align-items: center;

    // .el-input {
    //   width: 160px;
    // }
}

.add-icon {
    margin-right: 6px;
    width: 20px;
    height: 20px;
    border: 1px solid var(--el-color-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background-color: var(--el-color-primary);
    cursor: pointer;
}

.text {
    margin-left: 10px;
}
</style>
