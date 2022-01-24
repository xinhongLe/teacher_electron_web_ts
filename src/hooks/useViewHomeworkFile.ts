import { FileInfo } from "@/types/lookQuestion";
import { openFile } from "@/utils";
import { getOssUrl } from "@/utils/oss";
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
            const index = FileName.lastIndexOf(".");
            const name = index === -1 ? FileName : FileName.substring(FileName.lastIndexOf("\\") + 1, index);
            if (Extention) {
                const key = FilePath + "/" + name + "." + Extention;
                src.value = await getOssUrl(key, Bucket);
                if (extentionArr.includes(Extention)) {
                    visible.value = true;
                } else {
                    openFile(src.value, name + "." + Extention);
                }
            } else {
                const key = FilePath + "/" + name;
                src.value = await getOssUrl(key, Bucket);
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
