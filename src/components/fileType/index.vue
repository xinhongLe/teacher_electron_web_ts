<template>
    <span class="file-type" :class="getFileTypeClass(fileExtension)" :style="{width:iconWidth + 'px',height:iconHeight + 'px'}" />
</template>

<script lang="ts">
import { fileTypeMap } from "@/config";
import { defineComponent } from "vue";
export default defineComponent({
    name: "fileType",
    props: {
        fileExtension: {
            required: true,
            default: ""
        },
        iconWidth: {
            type: Number,
            default: 16
        },
        iconHeight: {
            type: Number,
            default: 19
        }
    },
    setup() {
        const getFileTypeClass = (fileExtension: string) => {
            const type = fileTypeMap[fileExtension];
            const classMap: Record<number, string> = {
                2: "pic",
                3: "ppt",
                4: "music",
                5: "video",
                9: "word",
                10: "pdf",
                11: "zip",
                12: "excel"
            };
            if (classMap[type]) {
                return classMap[type];
            }
            return "other";
        };

        return {
            getFileTypeClass
        };
    }
});
</script>

<style lang="scss" scoped>
.file-type {
    width: 16px;
    height: 19px;
    background-size: 100% 100%;
    flex-shrink: 0;
    &.ppt {
        background-image: url("../../assets/images/attend-class/icon_ppt@2x.png");
    }
    &.video {
        background-image: url("../../assets/images/attend-class/icon_video@2x.png");
    }
    &.word {
        background-image: url("../../assets/images/attend-class/icon_word@2x.png");
    }
    &.pic {
        background-image: url("../../assets/images/attend-class/icon_pic@2x.png");
    }
    &.pdf {
        background-image: url("../../assets/images/attend-class/icon_pdf@2x.png");
    }
    &.zip {
        background-image: url("../../assets/images/attend-class/icon_zip@2x.png");
    }
    &.music {
        background-image: url("../../assets/images/attend-class/icon_music@2x.png");
    }
    &.excel {
        background-image: url("../../assets/images/attend-class/icon_excel@2x.png");
    }
    &.other {
        background-image: url("../../assets/images/attend-class/icon_timu.png");
    }
}
</style>
