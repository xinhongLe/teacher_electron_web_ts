<template>
    <el-dialog
        title="查看"
        :model-value="visible"
        width="50%"
        :before-close="handleClose"
    >
        <div class="big-box">
            <img
                :src="src"
                v-if="imgExtention.indexOf(extention) > -1"
                @load="load(1)"
            />
            <video
                :src="src"
                v-if="extention == 'mp4'"
                controls
                autoplay
                @canplay="load(2)"
            ></video>
            <audio
                :src="src"
                v-if="audioExtention.indexOf(extention) > -1"
                controls
                autoplay
                style="height: 200px; margin-bottom: 150px"
            ></audio>
        </div>
    </el-dialog>
</template>

<script lang="ts">
import { defineComponent, nextTick } from "vue";
export default defineComponent({
    name: "enlarge",
    props: {
        extention: {
            type: String,
            default: ""
        },
        visible: {
            type: Boolean,
            default: false
        },
        src: {
            type: String,
            default: ""
        }
    },
    setup(props, { emit }) {
        const imgExtention = ["png", "jpg", "jpeg", "ico"];
        const audioExtention = ["mp3", "wav", "aac"];

        const load = (type: number) => {
            nextTick(() => {
                let dom: HTMLImageElement | HTMLVideoElement;
                if (type === 1) {
                    dom =
                        document.querySelector<HTMLImageElement>(
                            ".big-box img"
                        )!;
                } else {
                    dom =
                        document.querySelector<HTMLVideoElement>(
                            ".big-box video"
                        )!;
                }
                if (dom.width / dom.height > 1) {
                    dom.style.width = "100%";
                    dom.style.height = "auto";
                } else {
                    dom.style.width = "auto";
                    dom.style.maxWidth = "100%";
                    dom.style.height = "70vh";
                }
            });
        };

        const handleClose = () => {
            emit("update:visible", false);
        };

        return {
            imgExtention,
            load,
            handleClose,
            audioExtention
        };
    }
});
</script>

<style lang="scss" scoped>
img,
video,
audio {
    margin: auto;
    display: block;
}
video {
    width: 100%;
}
</style>
