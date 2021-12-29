<template>
    <div class="preparation-file" :title="fileInfo.fileName">
        <img class="file-type" v-if="fileInfo.fileType === 'word'" src="../../../assets/preparationGroup/editPanel/icon_word.png" />
        <img class="file-type" v-else-if="fileInfo.fileType === 'excel'" src="../../../assets/preparationGroup/editPanel/icon_excel.png" />
        <img class="file-type" v-else-if="fileInfo.fileType === 'ppt'" src="../../../assets/preparationGroup/editPanel/icon_ppt.png" />
        <img class="file-type" v-else-if="fileInfo.fileType === 'pdf'" src="../../../assets/preparationGroup/editPanel/icon_pdf.png" />
        <img class="file-type" v-else-if="fileInfo.fileType === 'txt'" src="../../../assets/preparationGroup/editPanel/icon_txt.png" />
        <img class="file-type" v-else-if="fileInfo.fileType === 'video'" src="../../../assets/preparationGroup/editPanel/icon_video.png" />
        <img class="file-type" v-else-if="fileInfo.fileType === 'radio'" src="../../../assets/preparationGroup/editPanel/icon_radio.png" />
        <img class="file-type" v-else-if="fileInfo.fileType === 'image'" src="../../../assets/preparationGroup/editPanel/icon_image.png" />
        <img class="file-type" v-else-if="fileInfo.fileType === 'zip'" src="../../../assets/preparationGroup/editPanel/icon_zip.png" />
        <img class="file-type" v-else src="../../../assets/preparationGroup/editPanel/icon_other.png" />
        <div class="file-info">
            <p class="file-name"><span class="ellipsis">{{ fileInfo.fileName }}</span><span style="flex-shrink: 0;">{{`.${fileInfo.fileExtension || fileInfo.extention}`}}</span></p>
            <div class="loading-box" v-if="action === 'upload' && percent < 100">
              <div
                class="loading-default"
                :class="`loading-${fileInfo.fileType}`"
                :style="{ width: percent + '%' }"
              ></div>
            </div>
            <p class="file-size" v-else>{{`${fileInfo.size}`}}</p>
        </div>
        <img v-if="action === 'download'" class="file-download" src="../../../assets/preparationGroup/editPanel/download.png" @click="download" />
        <img v-else-if="action === 'upload'" class="file-download" src="../../../assets/preparationGroup/editPanel/close.png" @click="close" />
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount } from "vue";
import { downloadFile } from "@/utils/oss";
export default defineComponent({
    name: "card",
    props: {
        fileInfo: {
            type: Object
        },
        action: {
            type: String,
            default: () => {
                return "download";
            }
        }
    },
    setup(props, { emit }) {
        console.log(props);
        console.log(emit);
        const timer = ref();
        const percent = ref(0);

        const download = async () => {
            console.log(props.fileInfo);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const item: any = props.fileInfo;
            const url = await downloadFile(`${item.path}/${item.fileName}.${item.fileExtension}`, item.bucket);
            console.log(url);
            const previewUrl = "https://owa.lyx-edu.com/op/view.aspx?src=" + encodeURIComponent(url);
            console.log(previewUrl);
            window.open(previewUrl);
        };
        const close = () => {
            emit("close", props.fileInfo);
        };
        const random = (m: number, n: number) => {
            return Math.floor(Math.random() * (m - n) + n);
        };
        const intervalTimer = () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const item: any = props.fileInfo;
            clearInterval(timer.value);
            timer.value = null;
            if (props.action === "upload") {
                timer.value = setInterval(() => {
                    let step = 50;
                    switch (item.size.split(" ")[1]) {
                    case "B":
                        step = 50;
                        break;
                    case "KB":
                        step = 40;
                        break;
                    case "MB":
                        step = 30;
                        break;
                    case "GB":
                        step = 20;
                        break;
                    default:
                        step = 50;
                    }
                    if (percent.value + random(1, step) < 100) {
                        percent.value += random(1, step);
                    } else {
                        percent.value = 100;
                        clearInterval(timer.value);
                        timer.value = null;
                    }
                    console.log(percent.value);
                }, 1500);
            }
        };
        onMounted(() => {
            intervalTimer();
        });
        onBeforeUnmount(() => {
            clearInterval(timer.value);
            timer.value = null;
        });
        return {
            percent,
            download,
            close
        };
    },
    components: { }
});
</script>

<style lang="scss" scoped>
.preparation-file {
    width: 180px;
    height: 48px;
    line-height: 48px;
    background: #FFFFFF;
    border-radius: 4px;
    border: 1px solid #E0E2E7;
    display: flex;
    align-items: center;
    padding: 12px;
    cursor: pointer;
    &:hover {
        border: 1px solid #4B71EE;
    }
    .file-type {
        display: inline-block;
        width: 24px;
        height: auto;
    }
    .file-info {
        width: calc(100% - 40px);
        padding: 0 12px;
        p {
            margin: 0;
            padding: 0;
            line-height: 18px;
        }
        .file-name {
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #19203D;
            display: flex;
            align-items: center;
        }
        .file-size {
            font-size: 10px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #5F626F;
        }
        .loading-box {
            float: left;
            margin-top: 8px;
            width: 100%;
            height: 4px;
            background: rgba(245, 246, 250, 1);
            border-radius: 2px;
            overflow: hidden;
            .loading-default {
                height: 4px;
                border-radius: 2px;
                background-color: #4B71EE;
            }
            .loading-word {
                background-color: #4B71EE;
            }
            .loading-excel {
                background-color: #00D2A7;
            }
            .loading-ppt {
                background-color: #FF845D;
            }
            .loading-pdf {
                background-color: #FF6B6B;
            }
            .loading-txt {
                background-color: #98B5F3;
            }
            .loading-video {
                background-color: #FF6B6B;
            }
            .loading-radio {
                background-color: #9866FF;
            }
            .loading-image {
                background-color: #9DC3FF;
            }
            .loading-zip {
                background-color: #A5B0C0;
            }
        }
    }
    .file-download {
        display: inline-block;
        width: 16px;
        height: auto;
        cursor: pointer;
    }
    .ellipsis {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: inline-block;
        max-width: 65px;
    }
}
</style>
