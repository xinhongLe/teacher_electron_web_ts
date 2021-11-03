import { ElForm, ElMessage } from "element-plus";
import { reactive, ref, unref, Ref } from "vue";
import isElectron from "is-electron";
import router from "@/router";
import { IFile } from "./interface";
import { submitFeedback } from "./api";
import { IOssFileInfo } from "@/types/oss";

export default (visible: Ref<boolean>, fileInfo: IOssFileInfo) => {
    const formData = reactive({
        content: ""
    });
    const formRef = ref<InstanceType<typeof ElForm>>();

    const submit = () => {
        const form = unref(formRef);
        form!.validate(async valid => {
            if (valid) {
                const ActionName = router.currentRoute.value.name as string;
                const ClientName = isElectron() ? "教师PC端" : "教师web端";

                const FeedBackFiles: IFile[] = [{
                    MD5: fileInfo.md5,
                    OssExtention: fileInfo.fileExtension,
                    OssName: fileInfo.name,
                    Name: fileInfo.name,
                    BucketName: fileInfo.bucket
                }];
                const Content = formData.content;
                const SubjectID = null;
                const res = await submitFeedback({
                    ActionName,
                    ClientName,
                    FeedBackFiles,
                    Content,
                    SubjectID
                });
                if (res.resultCode === 200) {
                    visible.value = false;
                    ElMessage.success("问题提交成功");
                    form!.resetFields();
                }
            }
        });
    };

    return {
        formRef,
        formData,
        submit
    };
};
