<template>
      <div class="import">
        <p>
            <span>只能上传xls/xlsx文件</span>
            <el-upload
                v-show="!fileInfo.name"
                class="file-btn"
                ref="uploadRef"
                :action="action"
                :show-file-list="false"
                :limit="1"
                accept=".xls,.xlsx"
                :on-change="onChangeFile"
                :http-request="uploadSectionFile"
                :auto-upload="false"
            >
                <span><i class="el-icon-plus"></i>添加文件</span></el-upload
            >

             <span style="margin-right: 0;background: #D4D6D9;color: #fff; border-color: #D4D6D9" v-show="fileInfo.name"><i class="el-icon-plus"></i>添加文件</span>
                <span>
                <el-link type="primary" href="https://app-v.oss-cn-shanghai.aliyuncs.com/other/%E6%89%B9%E9%87%8F%E6%B3%A8%E5%86%8C%E5%AD%A6%E7%94%9F%E4%BF%A1%E6%81%AF%E8%A1%A8.xlsx" download="批量注册学生信息表.xlsx"
                    >
                    <i class="el-icon-download"></i>下载导入模板
                    </el-link
                >
                </span>
        </p>
        <div class="no-data" v-if="!fileInfo.name">
            <img src="@/assets/my-student/pic_wuwenjian@2x.png" />
            <p>还没有上传文件</p>
            <p>您可以点击【添加文件】进行上传</p>
        </div>
        <div class="file-box">
            <div class="file" v-if="fileInfo.name">
                <img src="@/assets/my-student/icon_excel@2x.png" alt=""/>
                <span>{{ fileInfo.name }}</span>
                <span>已上传</span>
                <span @click="delFile"><i class="el-icon-delete"></i>删除</span>
            </div>
            <!-- <div class="result" v-if="result.length > 0">
                <p>成功导入45条记录，导入失败<span>12</span>条记录</p>
                <p>
                    1. Bruce老师的三年级一班.xls sheet1 中的第45行
                    <span>导入失败！</span>
                </p>
            </div> -->
        </div>
    </div>
</template>

<script lang="ts">
import { AI_XUE_SHI_API } from "@/config";
import { store } from "@/store";
import { ElUploadType } from "@/types/elementType";
import { ElMessage } from "element-plus";
import { ElFile, UploadFile } from "element-plus/lib/components/upload/src/upload.type";
import { defineComponent, ref } from "vue";
import { batchAddStudent } from "../api";
const getIconName = (extention: string) => {
    switch (extention) {
    case "doc":
    case "docx":
        return "icon_word@2x";
    case "png":
    case "jpg":
    case "jpge":
    case "pdf":
        return "icon_pic@2x";
    case "mp3":
    case "mkv":
    case "flv":
        return "icon_music@2x";
    case "mp4":
        return "icon_video@2x";
    default:
        return "icon_other@2x";
    }
};
export default defineComponent({
    props: {
        isDisabledBtn: {
            type: Boolean
        }
    },
    setup(props, { emit }) {
        const fileInfo = ref<Partial<UploadFile>>({});
        const uploadRef = ref<ElUploadType>();
        const action = AI_XUE_SHI_API + "/Api/Web/Class/BatchAddStudent/V210918";
        const delFile = () => {
            emit("update:isDisabledBtn", true);
            fileInfo.value = {};
            uploadRef.value && uploadRef.value.clearFiles(["ready"]);
        };
        const onChangeFile = (file: UploadFile) => {
            emit("update:isDisabledBtn", false);
            fileInfo.value = file;
        };

        const uploadSectionFile = async ({ file }: {file: ElFile}) => {
            const formdata = new FormData(); // 创建form对象
            const { userInfo: { id }, myStudent: { selectClassInfo: { ID, SchoolId } } } = store.state;
            formdata.append("classId", ID);
            formdata.append("teacherId", id);
            formdata.append("schoolId", SchoolId); // 通过append向form对象添加数据,可以通过append继续添加数据
            formdata.append("file", file); // 通过append向form对象添加数据,可以通过append继续添加数据
            const res = await batchAddStudent(formdata);
            if (res.resultCode === 200) {
                ElMessage.success("批量注册成功!");
                emit("successCallback");
                fileInfo.value = {};
            }
        };
        return {
            getIconName,
            delFile,
            onChangeFile,
            uploadSectionFile,
            fileInfo,
            uploadRef,
            action
        };
    }
});
</script>

<style lang="scss" scoped>
.import {
    width: 100%;
    height: 574px;
    background: #f5f6fa;
    margin-top: 24px;
    padding: 24px 32px;
    box-sizing: border-box;
    > p {
        overflow: hidden;
        > span:nth-of-type(1) {
            float: left;
            font-size: 20px;
            font-weight: 600;
            color: #19203d;
            line-height: 28px;
        }
        > span:nth-of-type(2),> span:nth-of-type(3) {
            width: 132px;
            height: 32px;
            border-radius: 4px;
            border: 1px solid #98aef6;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 14px;
            color: #4b71ee;
            line-height: 32px;
            margin-right: 30px;
            float: right;
            i {
                margin-right: 2px;
            }
        }
        .file-btn {
            float: right;
            span {
                width: 132px;
                height: 32px;
                border-radius: 4px;
                border: 1px solid #4b71ee;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 14px;
                color: #fff;
                background: #4b71ee;
                line-height: 32px;
                float: right;
                i {
                    margin-right: 2px;
                }
            }
        }
    }
    .no-data {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto;
        height: 162px;
        img {
            width: 136px;
            height: 85px;
            margin: auto;
            display: block;
        }
        p:nth-of-type(1) {
            margin-top: 24px;
            font-size: 18px;
            font-weight: 600;
            color: #19203d;
            line-height: 25px;
            text-align: center;
        }
        p:nth-of-type(2) {
            margin-top: 6px;
            font-size: 16px;
            color: #5f626f;
            line-height: 22px;
            text-align: center;
        }
    }
    .file-box {
        margin-top: 24px;
        .file {
            width: 100%;
            padding: 0 20px;
            box-sizing: border-box;
            height: 60px;
            background: #ffffff;
            border-radius: 4px;
            display: flex;
            align-items: center;
            img {
                width: 20px;
                height: 23px;
                margin-right: 8px;
            }
        }
        span:nth-of-type(1) {
            font-size: 16px;
            color: #19203d;
            flex: 1;
        }
        span:nth-of-type(2) {
            font-size: 14px;
            color: #5f626f;
            margin-right: 130px;
        }
        span:nth-of-type(3) {
            font-size: 14px;
            color: #ff6b6b;
            i {
                margin-right: 3px;
            }
        }
        .result {
            p {
                font-size: 16px;
                color: #5f626f;
                line-height: 22px;
                margin: 15px 0;
                span {
                    color: #ff6b6b;
                    margin: 0 2px;
                }
            }
            p:nth-of-type(1) {
                line-height: 62px;
                margin-top: 0;
                border-bottom: 1px dashed #d5d8dd;
            }
        }
    }
    :deep(.el-link.el-link--primary) {
        color: #4b71ee;
    }
}
</style>
