<template>
    <div :class="isEdit ? 'head-info max' : 'head-info'">
        <div class="head-title">
            <div class="left">
                <el-input v-show="isEdit" class="input-title" v-model="lessonItem.PreTitle" placeholder="" maxlength="20"></el-input>
                <div v-show="!isEdit" style="display: flex;align-items: center;">
                    <span class="title">{{ lessonItem.PreTitle }}</span>
                    <span :class="`status status-${lessonItem.Status}`"><span class="white"></span>{{ switchStatus(lessonItem.Status) }}</span>
                </div>
            </div>
            <!-- <div class="left">
                <span class="title">{{ lessonItem.PreTitle }}</span>
                <span :class="`status status-${lessonItem.Status}`"><span class="white"></span>{{ switchStatus(lessonItem.Status) }}</span>
            </div> -->
            <div class="right" v-show="lessonItem.CanEdit && lessonItem.Status === 2">
                <div class="btn-cancel" @click="actionEditPanel(false);getPreparateDetail();" v-show="isEdit">
                    <span>取消</span>
                </div>
                <div class="btn-save" v-show="isEdit" @click="savePreparateDetail">
                    <span>保存</span>
                </div>
                <div class="btn-edit" @click="actionEditPanel(true)" v-show="!isEdit">
                    <img src="../../../../assets/preparationGroup/editPanel/edit.png" alt="" />
                    <span>编辑</span>
                </div>
            </div>
        </div>
        <div class="lesson-info">
            <div class="lesson-cell">
                <img src="../../../../assets/preparationGroup/editPanel/persion.png" alt="" />
                <span>创建人：{{ lessonItem.CreaterName }}</span>
            </div>
            <div class="lesson-cell">
                <img src="../../../../assets/preparationGroup/editPanel/time.png" alt="" />
                <span>创建时间：{{ lessonItem.CreateTime }}</span>
            </div>
            <div class="lesson-cell">
                <img src="../../../../assets/preparationGroup/editPanel/personals.png" alt="" />
                <span>小组人数：{{ teacherCount }}人</span>
            </div>
        </div>
        <div class="file-info">
            <div class="file-cell" :class="isEdit ? `align-items` : ''">
                <img src="../../../../assets/preparationGroup/editPanel/pointer.png" alt="" />
                <span>备课范围：</span>
                <div class="content" :class="isEdit ? `padding-left` : ''" v-show="isEdit">
                    <el-cascader
                        v-model="lessonItem.LessonRangeIDs"
                        :options="textBookGradeList"
                        :props="{expandTrigger: 'click'}"
                    ></el-cascader>
                </div>
                <span v-show="!isEdit" class="content">{{ lessonItem.LessonRange }}</span>
            </div>
            <div class="file-cell">
                <img src="../../../../assets/preparationGroup/editPanel/book.png" alt="" />
                <span>备课内容：</span>
                <span class="content textarea-content" v-show="isEdit">
                    <el-input v-model="lessonItem.LessonContent" :rows="3" type="textarea" placeholder="500个字符以内" :maxlength="500" resize="none"/>
                </span>
                <span class="content special-content" :class="isShowMore ? `` : `clamp`" :title="lessonItem.LessonContent" v-show="!isEdit">
                    {{ lessonItem.LessonContent }}
                    <div v-if="isFull">
                        <span class="more" v-if="!isShowMore" @click="isShowMore = true">
                            <span class="dot">...</span>阅读全部
                        </span>
                        <span class="mores" v-else @click="isShowMore = false">
                            收起全部
                        </span>
                    </div>
                </span>
            </div>
            <div class="file-cell">
                <img src="../../../../assets/preparationGroup/editPanel/file.png" alt="" />
                <span>教研资料：</span>
                <div class="content flex-wrap">
                    <div style="width: 100%;margin-bottom: 12px;" v-show="isEdit">
                        <el-upload
                            action=""
                            :show-file-list="false"
                            :http-request="uploadFile"
                            :on-success="onSuccess"
                        >
                            <div class="btn-upload" v-loading="loadingShow">
                                <img src="../../../../assets/preparationGroup/editPanel/icon_upload.png" alt="">
                                <span>{{ `上传${loadingShow ? "中..." : "文件"}` }}</span>
                            </div>
                        </el-upload>
                    </div>
                    <div style="display:flex;align-items:center;flex-wrap: wrap;">
                        <div class="file-item" v-for="(item, index) in lessonItem.Attachments" :key="index">
                            <File :fileInfo="item" :action="isEdit ? 'upload' : 'download'" @close="deleteFileItem"></File>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, getCurrentInstance, watch, nextTick, onMounted, onBeforeUnmount } from "vue";
import { useRoute } from "vue-router";
import { fetchPreparateDetail, editPreparateDetail } from "../../api";
import { lessonItemData } from "@/types/preparationGroup";
import { IOssFileInfo } from "@/types/oss";
import useUploadFile from "@/hooks/useUploadFile";
import moment from "moment";
import useSubmit from "../useSubmit";
import File from "../../file/index.vue";
import { ElMessage } from "element-plus";
export default defineComponent({
    name: "head-info",
    props: {
        reload: {
            type: Function
        },
        teacherCount: {
            type: Number,
            default: () => {
                return 0;
            }
        }
    },
    setup(props, { emit }) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { proxy } = getCurrentInstance() as any;
        const route = useRoute();
        const isEdit = ref(false);
        const isShowMore = ref(false);
        const isFull = ref(false);
        const lessonItem = reactive<lessonItemData>({
            Attachments: [],
            CanEdit: false,
            CreateTime: "",
            EndTime: "",
            CreaterID: "",
            CreaterName: "",
            PreTitle: "",
            Status: 0,
            TeacherCount: 0,
            LessonRange: "",
            LessonRangeIDs: [],
            LessonContent: ""
        });

        const getPreparateDetail = async () => {
            const res = await fetchPreparateDetail({
                id: route.params.preId as string
            });
            if (res.resultCode === 200) {
                const { Attachments, CanEdit, CreateTime, CreaterID, CreaterName, PreTitle, Status, TeacherCount = 0, LessonRange, LessonContent = "" } = res.result;
                lessonItem.Attachments = [];
                if (Attachments && Attachments.length > 0) {
                    Attachments.map((v: any) => {
                        lessonItem.Attachments.push({
                            ...v,
                            fileName: v.FileName,
                            fileExtension: v.Extention,
                            fileSize: getFileSize(v.Size),
                            fileType: getFileType(`${v.FileName}.${v.Extention}`)
                        });
                    });
                }
                lessonItem.CanEdit = CanEdit;
                lessonItem.CreateTime = moment(CreateTime).format("YYYY-MM-DD HH:mm:ss");
                lessonItem.CreaterID = CreaterID;
                lessonItem.CreaterName = CreaterName;
                lessonItem.PreTitle = PreTitle;
                lessonItem.Status = Status;
                lessonItem.TeacherCount = TeacherCount;
                lessonItem.LessonRange = LessonRange || "";
                lessonItem.LessonRangeIDs = lessonItem.LessonRange.split(",");
                if (lessonItem.LessonRangeIDs.length > 0) {
                    let rangeText = "";
                    const levelOne = textBookGradeList.value.filter((v: any) => {
                        return v.value === lessonItem.LessonRangeIDs[0];
                    });
                    if (levelOne && levelOne[0]) {
                        rangeText += `${levelOne[0].label} `;
                        if (levelOne[0].children && levelOne[0].children.length > 0) {
                            const levelTwo = levelOne[0].children.filter((vv: any) => {
                                return vv.value === lessonItem.LessonRangeIDs[1];
                            });
                            if (levelTwo && levelTwo[0]) {
                                rangeText += `${levelTwo[0].label} `;
                                if (levelTwo[0].children && levelTwo[0].children.length > 0) {
                                    const levelThree = levelTwo[0].children.filter((vvv: any) => {
                                        return vvv.value === lessonItem.LessonRangeIDs[2];
                                    });
                                    if (levelThree && levelThree[0]) {
                                        rangeText += `${levelThree[0].label}`;
                                    }
                                }
                            }
                        }
                    }
                    lessonItem.LessonRange = rangeText;
                }
                lessonItem.LessonContent = LessonContent;
                proxy.mittBus.emit("PreDetail", lessonItem);
                nextTick(() => {
                    isEdit.value = false;
                    const specialContent = document.querySelectorAll(".special-content");
                    const windowContent = document.documentElement.clientWidth;
                    if (specialContent && specialContent[0] && specialContent[0].clientWidth) {
                        isFull.value = (windowContent - 200) < specialContent[0].clientWidth;
                    }
                });
            }
        };

        const savePreparateDetail = async () => {
            if (lessonItem.PreTitle.trim().length === 0 || !lessonItem.PreTitle) {
                ElMessage.info("请输入备课主题");
                return;
            }
            const params = {
                groupLessonPreparateID: route.params.preId as string,
                preTitle: lessonItem.PreTitle,
                lessonRange: lessonItem.LessonRangeIDs.join(","),
                lessonContent: lessonItem.LessonContent,
                attachments: [] as any
            };
            if (lessonItem.Attachments && lessonItem.Attachments.length > 0) {
                lessonItem.Attachments.map(v => {
                    params.attachments.push({
                        // ...v,
                        bucket: v.bucket || v.Bucket,
                        objectKey: v.objectKey || v.ObjectKey,
                        name: v.name || v.md5 || v.FileMD5,
                        md5: v.md5 || v.FileMD5,
                        fileMD5: v.md5 || v.FileMD5,
                        fileName: v.fileName || v.FileName,
                        extention: v.fileExtension || v.Extention,
                        fileExtension: v.fileExtension || v.Extention,
                        size: v.size || v.Size
                    });
                });
            }
            const res = await editPreparateDetail(params);
            if (res.resultCode === 200) {
                getPreparateDetail();
                actionEditPanel(false);
            }
        };

        const actionEditPanel = (val: boolean) => {
            isEdit.value = val;
            proxy.mittBus.emit("watchStatus", isEdit.value);
        };

        const { switchStatus, textBookGradeList, getTextBookGrade } = useSubmit();
        const { loadingShow, fileInfo, uploadFile, resetFileInfo, getFileType, getFileSize } = useUploadFile("GroupLessonFile");
        watch(fileInfo, (fileObj: IOssFileInfo) => {
            const file = {
                ...fileObj
            };
            if (file && file.name.length > 0) {
                if (file.fileName.length < 128) {
                    const list = JSON.parse(JSON.stringify(lessonItem.Attachments));
                    list.push(file);
                    lessonItem.Attachments = list;
                    resetFileInfo();
                } else {
                    ElMessage.info("文件名字长度不能超过128位");
                    resetFileInfo();
                }
            }
        }, {
            immediate: true,
            deep: true
        });
        const deleteFileItem = (fileObj: IOssFileInfo) => {
            let index = -1;
            if (fileObj.name) {
                index = lessonItem.Attachments.findIndex((v) => v.name === fileObj.name);
            } else if (fileObj.Name) {
                index = lessonItem.Attachments.findIndex((v) => v.Name === fileObj.Name);
            }
            lessonItem.Attachments.splice(index, 1);
        };
        const onSuccess = () => {
            loadingShow.value = false;
        };
        onMounted(() => {
            proxy.mittBus.on("busPreparateDetail", (status: boolean) => {
                getPreparateDetail();
            });
            getTextBookGrade();
            getPreparateDetail();
        });
        onBeforeUnmount(() => {
            proxy.mittBus.off("busPreparateDetail");
        });
        return {
            isEdit,
            isShowMore,
            isFull,
            lessonItem,
            actionEditPanel,
            switchStatus,
            textBookGradeList,
            loadingShow,
            fileInfo,
            uploadFile,
            onSuccess,
            resetFileInfo,
            getFileType,
            getFileSize,
            deleteFileItem,
            getPreparateDetail,
            savePreparateDetail
        };
    },
    components: { File }
});
</script>

<style lang="scss" scoped>
.head-info {
    width: 100%;
    height: auto;
    min-height: 340px;
    padding: 24px;
    user-select: none;
    background-color: #fff;
    .head-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 38px;
        .left {
            display: flex;
            align-items: center;
            .title {
                font-size: 24px;
                font-family: PingFangSC-Semibold, PingFang SC;
                font-weight: 600;
                color: #19203D;
            }
            .status {
                display: flex;
                align-items: center;
                width: auto;
                min-width: 64px;
                height: 24px;
                line-height: 24px;
                border-radius: 4px;
                text-align: center;
                font-size: 12px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                text-align: center;
                margin-left: 12px;
                padding: 0 10px;
                &-1 {
                    background: #E9EDF0;
                    color: #B2B8BE;
                }
                &-2 {
                    background: #F5A10E;
                    color: #fff;
                }
            }
            .white {
                display: inline-block;
                width: 5px;
                height: 5px;
                border-radius: 50%;
                background-color: #fff;
                margin-right: 5px;
            }
            .input-title {
                display: inline-block;
                :deep(.el-input__inner) {
                    width: 520px;
                    height: 48px;
                    font-size: 24px;
                    font-family: PingFangSC-Semibold, PingFang SC;
                    font-weight: 600;
                    color: #19203D;
                }
            }
        }
        .right {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            .btn-cancel {
                width: 120px;
                height: 36px;
                line-height: 36px;
                text-align: center;
                background: #FFFFFF;
                border-radius: 4px;
                border: 1px solid #E0E2E7;
                font-size: 16px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #19203D;
                cursor: pointer;
                &:hover {
                    border: 1px solid #4B71EE;
                    color: #4B71EE;
                }
            }
            .btn-save {
                width: 120px;
                height: 36px;
                line-height: 36px;
                text-align: center;
                background: #4B71EE;
                border-radius: 4px;
                font-size: 16px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #FFFFFF;
                margin-left: 24px;
                cursor: pointer;
            }
            .btn-edit {
                display: flex;
                align-items: center;
                cursor: pointer;
                img {
                    display: inline-block;
                    width: 16px;
                    height: auto;
                }
                span {
                    font-size: 16px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #4B71EE;
                    margin-left: 5px;
                }
            }
        }
    }
    .lesson-info {
        display: flex;
        align-items: center;
        border-bottom: 1px solid #E9ECF0;
        padding: 16px 0;
        .lesson-cell {
            display: flex;
            align-items: center;
            margin-right: 40px;
            img {
                display: inline-block;
                width: 16px;
                height: auto;
            }
            span {
                font-size: 14px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #5F626F;
                margin-left: 5px;
            }
        }
    }
    .file-info {
        display: flex;
        flex-direction: column;
        padding: 16px 0;
        .file-cell {
            display: flex;
            align-items: flex-start;
            margin-top: 16px;
            img {
                display: inline-block;
                width: 16px;
                height: auto;
            }
            span {
                font-size: 14px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #5F626F;
                margin-left: 5px;
                min-width: 80px;
            }
            .content {
                color: #19203D;
            }
            .special-content {
                line-height: 24px;
                margin-top: -5px;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                word-break: break-all;
                position: relative;
            }
            .clamp {
                line-clamp: 1;
                box-orient: vertical;
                -webkit-line-clamp: 1;
                -webkit-box-orient: vertical;
            }
            .textarea-content {
                width: 100%;
            }
            .more {
                font-size: 14px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #4B71EE;
                cursor: pointer;
                position: absolute;
                right: 0;
                bottom: 0;
                overflow: hidden;
                background: #fff;
                padding: 0 5px;
                .dot {
                    font-weight: 400;
                    color: #5F626F;
                    margin: 0 15px 0 0;
                }
            }
            .mores {
                font-size: 14px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #4B71EE;
                cursor: pointer;
            }
            .btn-upload {
                width: 116px;
                height: 40px;
                border-radius: 4px;
                border: 1px solid rgba(75, 113, 238, 0.5);
                text-align: center;
                display: flex;
                align-items: center;
                justify-content: center;
                overflow: hidden;
                cursor: pointer;
                img {
                    display: inline-block;
                    width: 12px;
                    height: auto;
                }
                span {
                    font-size: 16px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #3B62F4;
                    display: inline-block;
                    margin: 0;
                    min-width: 70px;
                }
                :deep(.el-loading-spinner) {
                    top: 0;
                }
            }
            .padding-left {
                padding-left: 5px;
            }
        }
        .align-items {
            align-items: center;
        }
    }
    .flex-wrap {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
    }
    .file-item {
        margin-right: 10px;
        margin-bottom: 10px;
    }
}
.max {
    min-height: 400px;
}
</style>
