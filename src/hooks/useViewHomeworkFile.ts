import { FileInfo } from "@/types/lookQuestion";
import { openFile } from "@/utils";
import { downloadFile } from "@/utils/oss";
import { ref } from "vue";

export default () => {
    const extentionArr = [
        "png",
        "jpg",
        "jpeg",
        "ico",
        "mp3",
        "wav",
        "aac",
        "mp4"
    ];
    const src = ref("");
    const visible = ref(false);
    const viewInfo = async (file: FileInfo) => {
        if (file) {
            const { Extention, FilePath, FileName, Bucket } = file;
            if (Extention) {
                const key = FilePath + "/" + FileName + "." + Extention;
                src.value = await downloadFile(key, Bucket);
                if (extentionArr.includes(Extention)) {
                    visible.value = true;
                } else {
                    openFile(src.value, FileName + "." + Extention);
                }
            } else {
                const key = FilePath + "/" + FileName;
                src.value = await downloadFile(key, Bucket);
                visible.value = true;
            }
        }
    };

    return {
        src,
        visible,
        viewInfo
    };
};
