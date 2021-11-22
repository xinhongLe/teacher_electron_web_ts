import { IOssFileInfo, OssName } from "@/types/oss";
import { cooOss } from "@/utils/oss";
import { get, STORAGE_TYPES } from "@/utils/storage";
import { UploadFile } from "element-plus/lib/components/upload/src/upload.type";
import { ref, reactive } from "vue";

export default (ossPathKey: OssName) => {
    const loadingShow = ref(false);
    const fileInfo = reactive<IOssFileInfo>({
        bucket: "",
        objectKey: "",
        name: "",
        md5: "",
        fileName: "",
        fileExtension: ""
    });

    const uploadFile = async ({ file }: {file: UploadFile & Blob}) => {
        const ossPath = get(STORAGE_TYPES.OSS_PATHS)?.[ossPathKey];

        loadingShow.value = true;
        const res = await cooOss(file, ossPath);
        if (res?.code === 200) {
            const { objectKey, name, md5, fileExtension } = res;
            fileInfo.bucket = ossPath.Bucket;
            fileInfo.fileExtension = fileExtension;
            fileInfo.objectKey = objectKey;
            fileInfo.name = name;
            fileInfo.objectKey = objectKey;
            fileInfo.md5 = md5;
            fileInfo.fileName = file.name.substring(0, file.name.lastIndexOf("."));
        }
        loadingShow.value = false;
    };

    const resetFileInfo = () => {
        fileInfo.bucket = "";
        fileInfo.fileExtension = "";
        fileInfo.objectKey = "";
        fileInfo.name = "";
        fileInfo.objectKey = "";
        fileInfo.md5 = "";
    };

    return {
        loadingShow,
        fileInfo,
        resetFileInfo,
        uploadFile
    };
};
