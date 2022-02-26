import { IOssFileInfo, OssName } from "@/types/oss";
import { cooOss } from "@/utils/oss";
import { get, STORAGE_TYPES } from "@/utils/storage";
import { ref, reactive } from "vue";

export default (ossPathKey: OssName) => {
    const loadingShow = ref(false);
    const fileInfo = reactive<IOssFileInfo>({
        bucket: "",
        path: "",
        objectKey: "",
        name: "",
        md5: "",
        fileName: "",
        fileExtension: "",
        // 文件实际的大小
        size: 0,
        // 文件展示的大小
        fileSize: "",
        fileType: ""
    });

    const uploadFile = async ({ file }: {file: File & Blob}) => {
        const ossPath = get(STORAGE_TYPES.OSS_PATHS)?.[ossPathKey];

        loadingShow.value = true;
        const res = await cooOss(file, ossPath);
        if (res?.code === 200) {
            const { objectKey, name, md5, fileExtension } = res;
            fileInfo.bucket = ossPath.Bucket;
            fileInfo.path = ossPath.Path;
            fileInfo.fileExtension = fileExtension;
            fileInfo.objectKey = objectKey;
            fileInfo.name = name;
            fileInfo.objectKey = objectKey;
            fileInfo.md5 = md5;
            fileInfo.fileName = file.name.substring(0, file.name.lastIndexOf("."));
            fileInfo.size = file.size;
            fileInfo.fileSize = getFileSize(file.size);
            fileInfo.fileType = getFileType(file.name);
        }
        loadingShow.value = false;
        return { ...fileInfo };
    };

    const resetFileInfo = () => {
        fileInfo.bucket = "";
        fileInfo.path = "";
        fileInfo.fileExtension = "";
        fileInfo.objectKey = "";
        fileInfo.name = "";
        fileInfo.objectKey = "";
        fileInfo.md5 = "";
        fileInfo.size = 0;
        fileInfo.fileSize = "";
        fileInfo.fileType = "";
    };

    const toDecimal = (num: any) => {
        if (num === null) {
            num = "0";
        }
        num = num.toString().replace(/\$|,/g, "");
        if (isNaN(num)) { num = "0"; }
        num = Math.floor(num * 100 + 0.50000000001);
        let cents: any = num % 100;
        num = Math.floor(num / 100).toString();
        if (cents < 10) { cents = "0" + cents; }
        for (let i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++) {
            num = num.substring(0, num.length - (4 * i + 3)) + "" + num.substring(num.length - (4 * i + 3));
        }
        return num + "." + cents;
    };

    const getFileSize = (size: number) => {
        if (size < 1024.0) {
            return toDecimal(size) + " B";
        } else if (size >= 1024.0 && size < 1048576) {
            return toDecimal(size / 1024.0) + " KB";
        } else if (size >= 1048576 && size < 1073741824) {
            return toDecimal(size / 1024.0 / 1024.0) + " MB";
        } else if (size >= 1073741824) {
            return toDecimal(size / 1024.0 / 1024.0 / 1024.0) + " GB";
        } else {
            return "-";
        }
    };

    const getFileType = (fileName: string) => {
        // 后缀获取
        let suffix = "";
        // 获取类型结果
        let result: any = "";
        try {
            const flieArr = fileName.split(".");
            suffix = flieArr[flieArr.length - 1];
        } catch (err) {
            suffix = "";
        }
        if (!suffix) {
            return "";
        }
        suffix = suffix.toLocaleLowerCase();
        // 图片格式
        const imglist = ["png", "jpg", "jpeg", "bmp", "gif"];
        // 进行图片匹配
        result = imglist.find((item) => item === suffix);
        if (result) {
            return "image";
        }
        // 匹配txt
        const txtlist = ["txt"];
        result = txtlist.find((item) => item === suffix);
        if (result) {
            return "txt";
        }
        // 匹配 excel
        const excelist = ["xls", "xlsx"];
        result = excelist.find((item) => item === suffix);
        if (result) {
            return "excel";
        }
        // 匹配 word
        const wordlist = ["doc", "docx"];
        result = wordlist.find((item) => item === suffix);
        if (result) {
            return "word";
        }
        // 匹配 pdf
        const pdflist = ["pdf"];
        result = pdflist.find((item) => item === suffix);
        if (result) {
            return "pdf";
        }
        // 匹配 ppt
        const pptlist = ["ppt", "pptx"];
        result = pptlist.find((item) => item === suffix);
        if (result) {
            return "ppt";
        }
        // 匹配 视频
        const videolist = [
            "mp4",
            "m2v",
            "mkv",
            "rmvb",
            "wmv",
            "avi",
            "flv",
            "mov",
            "m4v"
        ];
        result = videolist.find((item) => item === suffix);
        if (result) {
            return "video";
        }
        // 匹配 音频
        const radiolist = ["mp3", "wav", "wmv"];
        result = radiolist.find((item) => item === suffix);
        if (result) {
            return "radio";
        }
        // 匹配 压缩包
        const ziplist = ["zip", "iso"];
        result = ziplist.find((item) => item === suffix);
        if (result) {
            return "zip";
        }
        // 其他 文件类型
        return "other";
    };

    return {
        loadingShow,
        fileInfo,
        resetFileInfo,
        uploadFile,
        getFileType,
        getFileSize
    };
};
