<template>
    <el-dialog
        v-model="visible"
        title="问题反馈"
        center
        :destroy-on-close="true"
    >
        <el-upload
            action=""
            :show-file-list="false"
            class="feedback-uploader"
            v-loading="loadingShow"
            :http-request="uploadFile"
            accept="image/png, image/jpeg, image/jpg"
        >
            <img v-if="imgUrl" :src="imgUrl" class="feedback-img">
            <i v-else class="el-icon-plus feedback-uploader-icon"></i>
        </el-upload>
        <el-form
            ref="formRef"
            :model="formData"
            label-position="top"
        >
            <el-form-item
                :label="`${name} 老师您好，有什么问题或建议？`"
                required
                prop="content"
                :rules="{required: true, message: '请填写反馈内容', trigger: 'blur'}"
            >
                <el-input
                    type="textarea"
                    placeholder="请输入问题或建议"
                    v-model="formData.content"
                    :rows="2"
                    maxlength="500"
                    show-word-limit
                />
            </el-form-item>
        </el-form>
        <template #footer>
            <span>
                <el-button type="primary" @click="submit">提交反馈错误</el-button>
            </span>
        </template>

    </el-dialog>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from "vue";
import useUploadFile from "@/hooks/useUploadFile";
import { downloadFile } from "@/utils/oss";
import { store } from "@/store";
import useSubmit from "./useSubmit";

export default defineComponent({
    setup() {
        const visible = ref(false);
        const imgUrl = ref("");
        const name = computed(() => store.state.userInfo.name);
        const { loadingShow, fileInfo, uploadFile, resetFileInfo } = useUploadFile("FeedBackFile");

        watch(fileInfo, async ({ objectKey, bucket }) => {
            imgUrl.value = await downloadFile(objectKey, bucket);
        });

        watch(visible, () => {
            imgUrl.value = "";
            formData.content = "";
            resetFileInfo();
        });

        const show = () => {
            visible.value = true;
        };

        const { formData, formRef, submit } = useSubmit(visible, fileInfo);

        return {
            visible,
            show,
            name,
            formRef,
            formData,
            loadingShow,
            submit,
            uploadFile,
            imgUrl
        };
    }
});
</script>

<style lang="scss">
.feedback-uploader {
     .el-upload {
        width: 100%;
    }
    .feedback-uploader-icon {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      font-size: 28px;
      color: #8c939d;
      width: 100%;
      height: 600px;
      line-height: 600px;
      text-align: center;
      &:hover{
         border-color: #409eff
      }
    }
    .feedback-img {
      width: 100%;
      height: 600px;
      display: block;
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      &:hover{
         border-color: #409eff
      }
    }
    .feedback-tip {
      color: #ff4949
    }
  }
</style>
