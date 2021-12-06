<template>
    <div>
        <div
            class="pic"
            @click="lookFile()"
            v-if="imgExtention.indexOf(file.Extention) > -1"
        >
            <img :src="src" />
            <!-- <el-tooltip effect="dark" content="点赞可以将此作品添加至优秀作品集" placement="top">
                <img src="@/assets/images/homeworkNew/icon_dianzan_rest@2x.png" alt="" class="fabulous">
                <img src="@/assets/images/homeworkNew/icon_dianzan_selected@2x.png" alt="" class="fabulous">
            </el-tooltip> -->
        </div>
        <div class="video" @click="lookFile()" v-if="file.Extention == 'mp4'">
            <div class="cover"></div>
            <video :src="src"></video>
            <img
                src="@/assets/images/homeworkNew/icon_video.png"
                alt=""
                class="btn"
            />
            <!-- <el-tooltip effect="dark" content="点赞可以将此作品添加至优秀作品集" placement="top">
                <img src="@/assets/images/homeworkNew/icon_dianzan_rest@2x.png" alt="" class="fabulous">
                <img src="@/assets/images/homeworkNew/icon_dianzan_selected@2x.png" alt="" class="fabulous">
            </el-tooltip> -->
        </div>
        <div
            class="audio"
            @click="lookFile()"
            v-if="audioExtention.indexOf(file.Extention) > -1"
        >
            <img
                src="@/assets/images/homeworkNew/icon_yinping.png"
                alt=""
                class="btn"
            />
            <!-- <el-tooltip effect="dark" content="点赞可以将此作品添加至优秀作品集" placement="top">
                <img src="@/assets/images/homeworkNew/icon_dianzan_rest@2x.png" alt="" class="fabulous">
                <img src="@/assets/images/homeworkNew/icon_dianzan_selected@2x.png" alt="" class="fabulous">
            </el-tooltip> -->
        </div>
        <Enlarge
            :extention="file.Extention"
            :src="src"
            v-model:visible="visible"
            v-if="visible"
        ></Enlarge>
    </div>
</template>

<script lang="ts">
import useViewHomeworkFile from "@/hooks/useViewHomeworkFile";
import { FileInfo } from "@/types/lookQuestion";
import { defineComponent, PropType, ref } from "vue";
import Enlarge from "@/components/enlarge/index.vue";
export default defineComponent({
    props: {
        file: {
            type: Object as PropType<FileInfo>,
            default: () => ({})
        }
    },
    setup(props) {
        const imgExtention = ["png", "jpg", "jpeg", "ico"];
        const audioExtention = ["mp3", "wav", "aac"];
        const visible = ref(false);
        const { src, viewInfo } = useViewHomeworkFile();
        viewInfo(props.file);
        const lookFile = () => {
            visible.value = true;
        };
        return {
            src,
            imgExtention,
            visible,
            lookFile,
            audioExtention
        };
    },
    components: { Enlarge }
});
</script>

<style lang="scss" scoped>
.pic,
.video,
.audio {
    margin-right: 16px;
    margin-bottom: 16px;
    float: left;
    position: relative;
    width: 112px;
    height: 112px;
    border-radius: 6px;
    overflow: hidden;
    img {
        width: 112px;
        height: 112px;
    }
    .fabulous {
        position: absolute;
        right: 4px;
        top: 4px;
        width: 23px;
        height: 23px;
        z-index: 2;
    }
}
.video {
    .cover {
        width: 100%;
        height: 100%;
        z-index: 1;
        background: rgb(0, 0, 0);
        left: 0;
        top: 0;
        position: absolute;
        opacity: 0.5;
    }
    .btn {
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
        margin: auto;
        z-index: 2;
        width: 21px;
        height: 26px;
    }
}
.audio {
    background: #7a96f5;
    .btn {
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
        margin: auto;
        z-index: 2;
        width: 40px;
        height: 25px;
    }
}
</style>
