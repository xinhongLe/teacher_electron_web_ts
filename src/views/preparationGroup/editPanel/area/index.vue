<template>
    <div class="area">
        <div class="area-head">
            <div class="tag">
                <div class="tag-1"></div>
                <div class="tag-2"></div>
                <div class="tag-3"></div>
            </div>
            <span class="title">研讨{{numorder+1}}</span>
        </div>
        <div class="area-body">
            <div class="title-box">
                <div>
                    <span class="title">{{content.Title}}</span>
                    <span :class="`title-status title-status-${content.ResourceType}`">{{content.ResourceType === 1 ? '教案设计' : '课件设计'}}</span>
                </div>
                <div class="edit-btn" @click="EditResearch(content)">
                    <img src="../../../../assets/preparationGroup/editPanel/edit.png" alt="">
                    <span>编辑</span>
                </div>
            </div>
            <div class="teacher-box">
                <div class="teacher-con">
                    <img src="../../../../assets/preparationGroup/editPanel/avator_small.png" alt="">
                    <span>{{content.CreaterName}} 于{{moment(content.CreateTime).format("YYYY-MM-DD HH:mm:ss")}}上传教案</span>
                </div>
            </div>
            <div class="area-lesson">
                <div class="left">
                    <div>
                        <div class="box-item box-item-1">
                            <img src="../../../../assets/preparationGroup/editPanel/icon_jiaoan.png" alt="">
                            <p>教案</p>
                            <p class="time">2021-12-12 08:35</p>
                        </div>
                        <div class="tools">
                            <div class="tool-item">
                                <img src="../../../../assets/preparationGroup/editPanel/view.png" alt="">
                                <span @click="lookOver(content.ResourceSource)">查看</span>
                            </div>
                            <div class="tool-item">
                                <img src="../../../../assets/preparationGroup/editPanel/down.png" alt="">
                                <span @click="download(content.ResourceSource)">下载</span>
                            </div>
                        </div>
                    </div>
                    <img class="arrow" src="../../../../assets/preparationGroup/editPanel/right.png" alt="">
                    <div>
                        <div class="box-item box-item-2">
                            <img src="../../../../assets/preparationGroup/editPanel/icon_jiaoan.png" alt="">
                            <p>教案终稿</p>
                            <p class="time">2021-12-12 08:35</p>
                        </div>
                        <div class="tools">
                            <div class="tool-item">
                                <img src="../../../../assets/preparationGroup/editPanel/view.png" alt="">
                                <el-button @click="lookOver(content.ResourceResult)" type="text" :disabled="!content.ResourceResult">查看</el-button>
                            </div>
                            <div class="tool-item">
                                <img src="../../../../assets/preparationGroup/editPanel/down.png" alt="">
                                <el-button @click="download(content.ResourceResult)" type="text" :disabled="!content.ResourceResult">下载</el-button>
                            </div>
                            <div class="tool-item">
                                <el-upload
                                    action
                                    :show-file-list="false"
                                    accept=".doc, .docx, .ppt"
                                    :http-request="(file) => uploadFileSuccess(file, content.DiscussionContentID)"
                                >
                                    <img src="../../../../assets/preparationGroup/editPanel/up.png" alt="">
                                    <span>再次上传</span>
                                </el-upload>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="right">
                    <div class="title-box">
                        <div class="title-left">
                            <p class="title">内容摘要</p>
                            <!-- <p class="content">本节课的设计依据课标和学生自身特点重组教材内容，以学生生活实际和已有经验组织教学，强调学生观察、操作中获取新知，注重教学质量本节课的设计依据课标和学生自身特点重组教材内容，以学生生活实际和已有经验组织教学，强调学生观察、操作中获取新知，注重教本节课的设计依据课标和学生自身特点重组教材<span class="more">阅读全部</span></p> -->
                            <p class="content">{{content.Content}}</p>
                        </div>
                        <div class="title-right">
                            <div class="btn">
                                <img src="../../../../assets/preparationGroup/editPanel/plus.png" alt="">
                                <span>添加批注</span>
                            </div>
                        </div>
                    </div>
                    <div class="file-box">
                        <div class="title-left">
                            <p class="title">附件</p>
                            <p class="files">
                                <span class="files-list">
                                    <div class="file-item" v-for="(item, index) in content.Attachments" :key="index">
                                        <File :fileInfo="item"></File>
                                    </div>
                                </span>
                            </p>
                        </div>
                        <div class="title-right">
                            <div class="btn-memo" @click="memoPanelStatus = !memoPanelStatus">
                                <img src="../../../../assets/preparationGroup/editPanel/memo.png" alt="">
                                <span v-if="memoPanelStatus">收起评论</span>
                                <span v-else>5条评论</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="memo-box" v-if="memoPanelStatus">
                <p class="memo-title">5条评论</p>
                <div class="memo-container">
                    <div class="memo-cell" v-for="(item, index) in memoList" :key="index">
                        <div class="left">
                            <img src="../../../../assets/preparationGroup/editPanel/avator_small.png" alt="">
                            <div class="memo-info">
                                <p class="teacher">{{ item.teacher }}</p>
                                <p class="word">{{ item.word }}</p>
                                <div class="file" v-if="item.files.length > 0">
                                    <span>附件：</span>
                                    <div class="file-list">
                                        <div class="file-cell" v-for="(ite, ind) in item.files" :key="ind">
                                            <FileSmall :fileInfo="ite"></FileSmall>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="right">
                            <span>{{ item.time }}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="pagination" v-if="memoPanelStatus">
                <el-pagination small layout="prev, pager, next" prev-text="上一页" next-text="下一页" :total="50"></el-pagination>
            </div>
            <div class="texrarea-box" v-if="memoPanelStatus">
                <div class="left">
                    <div class="area-action">
                        <div class="action">
                            <el-input v-model="textareaWord" :rows="1" type="textarea" placeholder="请输入评论内容" resize="none"/>
                            <div class="file-list">
                                <div class="file-cell" v-for="(ite, ind) in wordFiles" :key="ind">
                                    <FileSmall :fileInfo="ite"></FileSmall>
                                </div>
                            </div>
                        </div>
                        <img src="../../../../assets/preparationGroup/editPanel/icon_fujian.png" alt="">
                    </div>
                </div>
                <div class="right">
                    <div>发布评论</div>
                </div>
            </div>
        </div>
    </div>
    <AddResearchContent v-model:dialogVisible="dialogVisible" :researchContent="researchContent" @EditSuccess="EditSuccessHandle"></AddResearchContent>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, ref } from "vue";
import { ElMessage } from "element-plus";
import { IOssFileInfo } from "@/types/oss";
import File from "../../file/index.vue";
import FileSmall from "../../file/small.vue";
import moment from "moment";
import { DiscussioncontentList, Fileginseng } from "@/types/preparationGroup";
import { openFile, downLoad } from "@/utils";
import { get, STORAGE_TYPES } from "@/utils/storage";
import { downloadFile, cooOss } from "@/utils/oss";
import { UploadFile } from "element-plus/lib/components/upload/src/upload.type";
import AddResearchContent from "../../popup-window/add-research-content.vue";
import { addResourceResult } from "../../api";
export default defineComponent({
    name: "area",
    props: {
        reload: {
            type: Function
        },
        content: {
            type: Object,
            degault: () => ({})
        },
        numorder: {
            type: Number,
            degault: 0
        }
    },
    setup(props, { emit }) {
        const filesrc = ref("");
        const dialogVisible = ref(false);
        const state = reactive({
            memoPanelStatus: false,
            textareaWord: "",
            memoList: [
                {
                    teacher: "李老师",
                    word: "做的很棒！赞赞赞",
                    time: "2021-12-12 08:35",
                    files: [
                        {
                            fileType: "word",
                            fileName: "认识长方形",
                            fileExtension: "doc",
                            size: "310.79K"
                        },
                        {
                            fileType: "pdf",
                            fileName: "认识长方形",
                            fileExtension: "pdf",
                            size: "7.42MB"
                        }
                    ]
                },
                {
                    teacher: "王老师",
                    word: "我觉得第3页中用的素材可以替换一下，素材在附件中。",
                    time: "2021-12-12 08:35",
                    files: []
                },
                {
                    teacher: "林老师",
                    word: "该课件设计注重学生自主学习能力培养，课前、课中、课后设计能够有效衔接、相互支持。",
                    time: "2021-12-12 08:35",
                    files: [
                        {
                            fileType: "word",
                            fileName: "认识长方形",
                            fileExtension: "doc",
                            size: "310.79K"
                        },
                        {
                            fileType: "pdf",
                            fileName: "认识长方形",
                            fileExtension: "pdf",
                            size: "7.42MB"
                        }
                    ]
                }
            ]
        });

        const researchContent = ref({});

        const contentFiles = reactive<IOssFileInfo[]>([
            {
                bucket: "",
                objectKey: "",
                name: "",
                md5: "",
                fileName: "摘要长方形",
                fileExtension: "doc",
                path: "",
                size: 0,
                fileSize: "310.79 KB",
                fileType: "word"
            }
        ]);
        const wordFiles = reactive<IOssFileInfo[]>([
            {
                bucket: "",
                objectKey: "",
                name: "",
                md5: "",
                fileName: "评论长方形评论长方形评论长方形",
                fileExtension: "doc",
                path: "",
                size: 0,
                fileSize: "310.79 KB",
                fileType: "word"
            }
        ]);

        const lookOver = async (file: Fileginseng) => {
            if (file) {
                const { Extention, FilePath, Name, Bucket } = file;
                if (Extention) {
                    const key = FilePath + "/" + Name + "." + Extention;
                    filesrc.value = await downloadFile(key, Bucket);
                    console.log(filesrc.value, Name + "." + Extention);
                    openFile(filesrc.value, Name + "." + Extention);
                } else {
                    const key = FilePath + "/" + Name;
                    filesrc.value = await downloadFile(key, Bucket);
                    openFile(filesrc.value, Name + "." + Extention);
                }
            }
        };

        const download = async (file: Fileginseng) => {
            if (file) {
                const { Extention, FilePath, FileName, Name, Bucket } = file;
                if (Extention) {
                    const key = FilePath + "/" + Name + "." + Extention;
                    filesrc.value = await downloadFile(key, Bucket);
                    downLoad(filesrc.value, FileName);
                } else {
                    const key = FilePath + "/" + Name;
                    filesrc.value = await downloadFile(key, Bucket);
                    downLoad(filesrc.value, FileName);
                }
            }
        };

        // 再次上传教案/课件
        const uploadFileSuccess = async ({ file }: {file: UploadFile & Blob;}, id: string) => {
            const ossPath = get(STORAGE_TYPES.OSS_PATHS)?.["ElementFile"];
            const res = await cooOss(file, ossPath);
            if (res?.code === 200) {
                const { name, md5, fileExtension } = res;
                const params = {
                    discussionID: id,
                    resourceResult: {
                        name: name,
                        fileName: file.name.substring(0, file.name.lastIndexOf(".")),
                        bucket: ossPath.Bucket,
                        path: ossPath.Path,
                        fileExtension: fileExtension,
                        md5: md5
                    }
                };
                const result = await addResourceResult(params);
                if (result.resultCode === 200) {
                    ElMessage.success("添加研讨的终稿文件成功");
                }
            }
        };

        const againUpload = (id:string) => {
            console.log(id);
        };

        const EditResearch = (row :DiscussioncontentList) => {
            researchContent.value = row;
            dialogVisible.value = true;
        };

        const submit = () => {
            console.log(1);
        };

        const add = () => {
            console.log(1);
        };
        const EditSuccessHandle = () => {
            dialogVisible.value = false;
            emit("Modify");
        };

        return {
            contentFiles,
            wordFiles,
            dialogVisible,
            researchContent,
            ...toRefs(state),
            submit,
            add,
            lookOver,
            download,
            EditResearch,
            EditSuccessHandle,
            uploadFileSuccess,
            againUpload,
            moment
        };
    },
    components: { File, FileSmall, AddResearchContent }
});
</script>

<style lang="scss" scoped>
.area {
    width: 100%;
    min-height: 380px;
    height: auto;
    background: #F9F9FB;
    border-radius: 8px;
    border: 1px solid #E9ECF0;
    margin-bottom: 24px;
    .area-head {
        display: flex;
        align-items: center;
        height: 62px;
        background: linear-gradient(270deg, #F9F9FB 0%, #EBEEFA 100%);
        border-radius: 8px 8px 0px 0px;
        padding-left: 25px;
        .tag {
            display: flex;
            align-items: center;
            > div {
                margin-right: 2px;
            }
            &-1 {
                width: 5px;
                height: 24px;
                background: #4B71EE;
            }
            &-2 {
                width: 5px;
                height: 20px;
                background: #4B71EE;
                opacity: 0.5;
            }
            &-3 {
                width: 5px;
                height: 16px;
                background: #4B71EE;
                opacity: 0.2;
            }
        }
        .title {
            font-size: 24px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #4B71EE;
            margin-left: 25px;
        }
    }
    .area-body {
        height: calc(100% - 62px);
        padding-top: 24px;
        .title-box {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 24px;
            .title {
                font-size: 20px;
                font-family: PingFangSC-Semibold, PingFang SC;
                font-weight: 600;
                color: #19203D;
            }
            .title-status {
                display: inline-block;
                min-width: 60px;
                width: auto;
                height: 24px;
                line-height: 24px;
                border-radius: 4px;
                font-size: 12px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                text-align: center;
                margin-left: 10px;
                padding: 0 5px;
                &-1 {
                    color: #48DBBF;
                    border: 1px solid #48DBBF;
                }
                &-2 {
                    color: #4B71EE;
                    border: 1px solid #4B71EE;
                }
            }
            .edit-btn {
                display: flex;
                align-items: center;
                cursor: pointer;
                span {
                    font-size: 16px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #4B71EE;
                    margin-left: 5px;
                }
            }
        }
        .teacher-box {
            display: flex;
            align-items: center;
            padding: 0 24px;
            .teacher-con {
                display: flex;
                align-items: center;
                line-height: 48px;
                border-bottom: 1px dashed #E0E2E7;
                width: 100%;
                img {
                    display: inline-block;
                    width: 24px;
                    height: auto;
                }
                span {
                    font-size: 14px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #5F626F;
                    margin-left: 10px;
                }
            }
        }
        .area-lesson {
            padding: 24px;
            padding-bottom: 0;
            display: flex;
            .left {
                display: flex;
                align-items: center;
                .box-item {
                    width: 208px;
                    height: 139px;
                    border-radius: 8px;
                    padding: 24px;
                    &-1 {
                        background: #48DBBF;
                    }
                    &-2 {
                        background: #C160E0;
                    }
                    img {
                        display: inline-block;
                        width: 24px;
                        height: auto;
                        margin-bottom: 20px;
                    }
                    p {
                        font-size: 18px;
                        font-family: PingFangSC-Semibold, PingFang SC;
                        font-weight: 600;
                        color: #FFFFFF;
                    }
                    .time {
                        font-size: 14px;
                        font-weight: 400;
                        margin-top: 10px;
                    }
                }
                .tools {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 20px 0;
                    height: 28px;
                    .tool-item {
                        display: flex;
                        align-items: center;
                        cursor: pointer;
                        img {
                            display: inline-block;
                            width: 12px;
                            height: auto;
                        }
                        span {
                            font-size: 14px;
                            font-family: PingFangSC-Regular, PingFang SC;
                            font-weight: 400;
                            color: #4B71EE;
                            margin-left: 5px;
                        }
                        &::after {
                            content: ' ';
                            width: 1px;
                            height: 14px;
                            border: 1px solid #E0E2E7;
                            margin: 0 5px;
                        }
                        &:last-child::after {
                            display: none;
                        }
                    }
                }
                .arrow {
                    margin: 0 16px;
                    margin-top: -40px;
                }
            }
            .right {
                padding-left: 60px;
                width: calc(100% - 260px);
                .title-box {
                    display: flex;
                    justify-content: space-between;
                    padding: 0;
                    .title-left {
                        width: calc(100% - 150px);
                        .title {
                            font-size: 16px;
                            font-family: PingFangSC-Regular, PingFang SC;
                            font-weight: 400;
                            color: #19203D;
                            margin-bottom: 8px;
                        }
                        .content {
                            font-size: 14px;
                            font-family: PingFangSC-Regular, PingFang SC;
                            font-weight: 400;
                            color: #5F626F;
                            margin: 15px 0;
                            line-height: 24px;
                        }
                        .more {
                            font-size: 14px;
                            font-family: PingFangSC-Regular, PingFang SC;
                            font-weight: 400;
                            color: #4B71EE;
                            cursor: pointer;
                        }
                    }
                    .title-right {
                        display: flex;
                        align-items: center;
                        justify-content: flex-end;
                        width: 150px;
                        .btn {
                            width: 118px;
                            height: 36px;
                            line-height: 36px;
                            text-align: center;
                            border-radius: 4px;
                            border: 1px solid #98AEF6;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            cursor: pointer;
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
                .file-box {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    .title-left {
                        width: calc(100% - 150px);
                        .title {
                            font-size: 16px;
                            font-family: PingFangSC-Regular, PingFang SC;
                            font-weight: 400;
                            color: #19203D;
                            margin-bottom: 8px;
                        }
                        .files {
                            min-height: 60px;
                            .files-list {
                                display: flex;
                                align-items: center;
                                flex-wrap: wrap;
                                margin-top: 10px;
                                .file-item {
                                    margin-right: 10px;
                                    margin-bottom: 10px;
                                }
                            }
                        }
                    }
                    .title-right {
                        display: flex;
                        align-items: center;
                        justify-content: flex-end;
                        width: 150px;
                        margin-bottom: 15px;
                        .btn-memo {
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            cursor: pointer;
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
                                &:hover {
                                    color: #4B71EE;
                                }
                            }
                        }
                    }
                }
            }
        }
        .memo-box {
            padding: 0 24px;
            .memo-title {
                font-size: 16px;
                font-family: PingFangSC-Semibold, PingFang SC;
                font-weight: 600;
                color: #19203D;
                border-top: 1px dashed #E0E2E7;
                line-height: 48px;
            }
            .memo-container {
                .memo-cell {
                    display: flex;
                    align-items: flex-start;
                    justify-content: space-between;
                    border-top: 1px solid #E9ECF0;
                    padding: 12px 0;
                    .left {
                        display: flex;
                        align-items: flex-start;
                        img {
                            display: inline-block;
                            width: 24px;
                            height: auto;
                        }
                        .memo-info {
                            padding-left: 10px;
                            .teacher {
                                font-size: 16px;
                                font-family: PingFangSC-Semibold, PingFang SC;
                                font-weight: 600;
                                color: #19203D;
                                line-height: 26px;
                            }
                            .word {
                                font-size: 14px;
                                font-family: PingFangSC-Regular, PingFang SC;
                                font-weight: 400;
                                color: #19203D;
                                line-height: 28px;
                            }
                            .file {
                                display: flex;
                                align-items: center;
                                line-height: 28px;
                                span {
                                    font-size: 14px;
                                    font-family: PingFangSC-Regular, PingFang SC;
                                    font-weight: 400;
                                    color: #5F626F;
                                }
                                .file-list {
                                    display: flex;
                                    align-items: center;
                                    flex-wrap: wrap;
                                }
                            }
                        }
                    }
                    .right {
                        span {
                            font-size: 14px;
                            font-family: PingFangSC-Regular, PingFang SC;
                            font-weight: 400;
                            color: #5F626F;
                            line-height: 26px;
                        }
                    }
                }
            }
        }
        .pagination {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 18px 0;
            border-top: 1px solid #E9ECF0;
            border-bottom: 1px solid #E9ECF0;
            :deep(.el-pagination) {
                display: flex;
                align-items: center;
            }
            :deep(.el-pager li) {
                display: inline-block;
                background: none;
                margin: 0 8px;
            }
            :deep(button) {
                display: inline-block;
                background: none;
            }
        }
        .texrarea-box {
            padding: 16px 24px;
            display: flex;
            justify-content: space-between;
            .left {
                display: flex;
                width: calc(100% - 150px);
                height: 100px;
                .area-action {
                    width: 100%;
                    height: 100%;
                    background: #FFFFFF;
                    border-radius: 4px;
                    border: 1px solid #E0E2E7;
                    padding: 16px;
                    display: flex;
                    align-items: flex-start;
                    justify-content: space-between;
                    .action {
                        width: calc(100% - 40px);
                        :deep(.el-textarea__inner) {
                            padding: 0;
                            border: none;
                            font-size: 16px;
                            font-family: PingFangSC-Regular, PingFang SC;
                            font-weight: 400;
                            color: #19203D;
                        }
                        .file-list {
                            display: flex;
                            align-items: center;
                            flex-wrap: wrap;
                            margin-top: 10px;
                            .file-cell {
                                margin: 0 10px 10px 0;
                                > .preparation-file-small {
                                    margin-left: 0;
                                }
                            }
                        }
                    }
                    img {
                        cursor: pointer;
                    }
                }
            }
            .right {
                display: flex;
                align-items: flex-start;
                justify-content: flex-end;
                width: 150px;
                > div {
                    width: 118px;
                    height: 48px;
                    line-height: 48px;
                    background: #4B71EE;
                    font-size: 16px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #FFFFFF;
                    border-radius: 4px;
                    text-align: center;
                    cursor: pointer;
                }
            }
        }
    }
}
</style>
