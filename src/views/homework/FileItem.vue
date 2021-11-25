<template>
    <div class="file-info">
        <p @click="viewInfo">
            <img
                :src="
                    require(`@/assets/images/homeworkNew/${showImg(
                        file.File.Extention
                    )}.png`)
                "
                alt=""
            />
            <span>{{ file.File.Name }}</span>
        </p>
        <Enlarge
            v-model:visible="visible"
            v-if="visible"
            :src="src"
            :extention="file.File.Extention"
        />
    </div>
</template>

<script lang="ts">
import { HomeworkPaperFile } from "@/types/homework";
import { downloadFile } from "@/utils/oss";
import { defineComponent, PropType, ref } from "vue";
import Enlarge from "@/components/enlarge/index.vue";
export default defineComponent({
    props: {
        file: {
            type: Object as PropType<HomeworkPaperFile>,
            default: () => ({})
        }
    },
    setup(props) {
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
        const showImg = (extention: string) => {
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
        const viewInfo = async () => {
            const file = props.file.File;
            if (file) {
                const { Extention, FilePath, FileName, Bucket } = file;
                if (Extention) {
                    const key = FilePath + "/" + FileName + "." + Extention;
                    src.value = await downloadFile(key, Bucket);
                    if (extentionArr.includes(Extention)) {
                        visible.value = true;
                    } else {
                        window.open(src.value);
                    }
                } else {
                    const key = FilePath + "/" + FileName;
                    src.value = await downloadFile(key, Bucket);
                    visible.value = true;
                }
            }
        };
        return {
            showImg,
            src,
            visible,
            viewInfo
        };
    },
    components: { Enlarge }
});
</script>

<style lang="scss" scoped>
.file-info {
    position: relative;
    margin-right: 20px;
    padding: 10px 20px;
    background-color: #f3f7ff;
    border-radius: 4px;
    p {
        background: #fff;
        padding: 8px;
        img {
            width: 20px;
            height: 20px;
            vertical-align: middle;
            margin-right: 10px;
        }
    }
}
</style>
