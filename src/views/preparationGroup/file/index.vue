<template>
    <div class="preparation-file" :title="fileInfo.fileName">
        <div class="file-type-box" @click="preView">
            <img class="file-type" v-if="switchFileType(fileInfo, 'word')" src="../../../assets/preparationGroup/editPanel/icon_word.png" />
            <img class="file-type" v-else-if="switchFileType(fileInfo, 'excel')" src="../../../assets/preparationGroup/editPanel/icon_excel.png" />
            <img class="file-type" v-else-if="switchFileType(fileInfo, 'ppt')" src="../../../assets/preparationGroup/editPanel/icon_ppt.png" />
            <img class="file-type" v-else-if="switchFileType(fileInfo, 'pdf')" src="../../../assets/preparationGroup/editPanel/icon_pdf.png" />
            <img class="file-type" v-else-if="switchFileType(fileInfo, 'txt')" src="../../../assets/preparationGroup/editPanel/icon_txt.png" />
            <img class="file-type" v-else-if="switchFileType(fileInfo, 'video')" src="../../../assets/preparationGroup/editPanel/icon_video.png" />
            <img class="file-type" v-else-if="switchFileType(fileInfo, 'radio')" src="../../../assets/preparationGroup/editPanel/icon_radio.png" />
            <img class="file-type" v-else-if="switchFileType(fileInfo, 'image')" src="../../../assets/preparationGroup/editPanel/icon_image.png" />
            <img class="file-type" v-else-if="switchFileType(fileInfo, 'zip')" src="../../../assets/preparationGroup/editPanel/icon_zip.png" />
            <img class="file-type" v-else src="../../../assets/preparationGroup/editPanel/icon_other.png" />
        </div>
        <div class="file-info">
            <p class="file-name"><span class="ellipsis">{{ fileInfo.fileName || fileInfo.FileName }}</span><span style="flex-shrink: 0;">{{`.${fileInfo.fileExtension || fileInfo.extention || fileInfo.Extention}`}}</span></p>
            <div class="loading-box" v-if="action === 'upload' && percent < 100">
              <div
                class="loading-default"
                :class="`loading-${fileInfo.fileType}`"
                :style="{ width: percent + '%' }"
              ></div>
            </div>
            <p class="file-size" v-else>{{`${fileInfo.fileSize || getFileSize(fileInfo.Size || 0) || '0 KB'}`}}</p>
        </div>
        <img v-if="action === 'download'" class="file-download" src="../../../assets/preparationGroup/editPanel/download.png" @click="download" />
        <img v-else-if="action === 'upload'" class="file-download" src="../../../assets/preparationGroup/editPanel/close.png" @click="close" />
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount } from "vue";
import { downloadFile } from "@/utils/oss";
import useUploadFile from "@/hooks/useUploadFile";
import isElectron from "is-electron";
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
        const timer = ref();
        const percent = ref(100);

        const preView = async () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const item: any = props.fileInfo;
            const previewArray = ["ppt", "word", "excel", "pdf"];
            const ext = item.Extention || item.extention || item.fileExtension;
            if (previewArray.indexOf(item.fileType || getFileType(`.${ext}`)) > -1) {
                let url = "";
                if (item.FilePath && item.FileMD5 && item.Extention && item.Bucket) {
                    url = await downloadFile(`${item.FilePath}/${item.FileMD5}.${item.Extention}`, item.Bucket);
                } else if (item.path && item.md5 && item.bucket) {
                    if (item.extention) {
                        url = await downloadFile(`${item.path}/${item.md5}.${item.extention}`, item.bucket);
                    } else if (item.fileExtension) {
                        url = await downloadFile(`${item.path}/${item.md5}.${item.fileExtension}`, item.bucket);
                    }
                }
                const previewUrl = "https://owa.lyx-edu.com/op/view.aspx?src=" + encodeURIComponent(url);
                if (isElectron()) {
                    return window.electron.ipcRenderer.invoke("downloadFile", previewUrl, `${item.fileName}.${item.Extention}`).then((filePath) => {
                        window.electron.shell.openPath(filePath);
                    });
                }
                window.open(previewUrl);
            } else {
                download();
            }
        };
        const download = async () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const item: any = props.fileInfo;
            let url = "";
            if (item.FilePath && item.FileMD5 && item.Extention && item.Bucket) {
                url = await downloadFile(`${item.FilePath}/${item.FileMD5}.${item.Extention}`, item.Bucket);
            } else if (item.path && item.md5 && item.bucket) {
                if (item.extention) {
                    url = await downloadFile(`${item.path}/${item.md5}.${item.extention}`, item.bucket);
                } else if (item.fileExtension) {
                    url = await downloadFile(`${item.path}/${item.md5}.${item.fileExtension}`, item.bucket);
                }
            }
            getBlob(url, function(blob: any) {
                saveAs(blob, item);
            });
        };
        const getBlob = (url: string, cb: any) => {
            const xhr = new XMLHttpRequest();
            xhr.open("GET", url, true);
            xhr.responseType = "blob";
            xhr.onload = function() {
                if (xhr.status === 200) {
                    cb(xhr.response);
                }
            };
            xhr.send();
        };
        const saveAs = (blob: any, item: any) => {
            const name = item.FileName || item.fileName || item.Name;
            const ext = item.Extention || item.extention || item.fileExtension;
            const link = document.createElement("a");
            const body = document.querySelectorAll("body");
            link.href = window.URL.createObjectURL(blob);
            link.download = `${name}.${ext}`;
            link.style.display = "none";
            body[0].appendChild(link);
            link.click();
            body[0].removeChild(link);
            window.URL.revokeObjectURL(link.href);
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
            if (!item.fileSize) return;
            if (props.action === "upload") {
                percent.value = 0;
                timer.value = setInterval(() => {
                    let step = 75;
                    switch (item.fileSize.split(" ")[1]) {
                    case "B":
                        step = 75;
                        break;
                    case "KB":
                        step = 65;
                        break;
                    case "MB":
                        step = 55;
                        break;
                    case "GB":
                        step = 45;
                        break;
                    default:
                        step = 75;
                    }
                    if (percent.value + random(1, step) < 100) {
                        percent.value += random(1, step);
                    } else {
                        percent.value = 100;
                        clearInterval(timer.value);
                        timer.value = null;
                    }
                }, 500);
            }
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const switchFileType = (fileInfo: any, ext: string) => {
            if (fileInfo) {
                if (fileInfo.fileType) {
                    return fileInfo.fileType === ext;
                } else {
                    return getFileType(`${fileInfo.fileName || fileInfo.FileName}.${fileInfo.fileExtension || fileInfo.extention || fileInfo.Extention}`) === ext;
                }
            }
        };
        const { getFileSize, getFileType } = useUploadFile("GroupLessonFile");
        onMounted(() => {
            intervalTimer();
        });
        onBeforeUnmount(() => {
            percent.value = 100;
            clearInterval(timer.value);
            timer.value = null;
        });
        return {
            percent,
            preView,
            download,
            close,
            getFileSize,
            getFileType,
            switchFileType
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
    .file-type-box {
        display: flex;
        align-items: center;
    }
    .file-type {
        // display: inline-block;
        // width: 24px;
        // height: auto;
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
