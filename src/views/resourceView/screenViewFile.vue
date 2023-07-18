<template>
    <div class="iframe-box">
        <div class="iframe-content" v-if="type === 4 || type === 0">
            <iframe class="office-iframe" v-if="isOffice" :src="url" sandbox="allow-same-origin allow-scripts"
                    id="office-iframe"></iframe>
            <iframe v-if="type === 4" :src="url"></iframe>
            <div class="iframe-image" v-if="isImage">
                <img :src="url"/>
            </div>
            <div class="iframe-audio" v-if="isAudio">
                <audio :src="url" controls controlsList="nodownload"/>
            </div>
            <div class="iframe-video" v-if="isVideo">
                <video :src="url" controls/>
            </div>
            <div class="not-preview" v-if="
                !isVideo && !isAudio && !isImage && !isOffice && type !== 4
            ">
                暂不支持预览，请下载查看
            </div>
        </div>
        <!--        <div class="iframe-footer">-->
        <!--            <div class="iframe-footer-btn pen" @click="drawingShow = true">-->
        <!--                <p>画笔</p>-->
        <!--            </div>-->
        <!--            <div class="iframe-footer-btn" @click="close">-->
        <!--                <p>关闭</p>-->
        <!--            </div>-->
        <!--        </div>-->
    </div>
    <div class="me-tools" ref="metools" v-drag>
        <!-- 右边固定展开的按钮 -->
        <div class="me-tools-righttool">
            <!-- 画笔 -->
            <div
                class="me-tool-btn-new"
                :class="toolType === 'pen' && 'btn-active'"
                @click="openPaintTool($event),(toolType = 'pen')"
            >
                <div class="icon-text">
                    <img v-if="toolType !== 'pen'"
                         src="@/views/preparation/intelligenceClassroom/images/slices/icon_hb.png" alt=""/>
                    <img v-if="toolType === 'pen'"
                         src="@/views/preparation/intelligenceClassroom/images/slices/icon_hb_white.png"
                         alt=""/>
                    <span class="text">画笔</span>
                </div>
            </div>
            <!-- 关闭 -->
            <div class="me-tool-btn-new" @click="close">
                <div class="icon-text">
                    <img src="@/views/preparation/intelligenceClassroom/images/slices/close.png" alt=""/>
                    <span class="text">关闭</span>
                </div>
            </div>
        </div>
    </div>
    <PenTool
        @undo="undo()"
        @redo="redo()"
        :penTop="penTop"
        v-if="isShowPen"
        :penLeft="penLeft"
        :canUndo="isCanUndo"
        :canRedo="isCanRedo"
        v-model:isShowPen="isShowPen"
        :currentDrawColor="currentDrawColor"
        :currentLineWidth="currentLineWidth"
        :eraserLineWidth="eraserLineWidth"
        @clear="whiteboardOption('clear')"
        @setEraser="whiteboardOption('setEraser')"
        @setEraserSize="setEraserSize"
        @setPenSize="(value) => whiteboardOption('setPenSize', value)"
        @setPenColor="(value) => whiteboardOption('setPenColor', value)"
    />
    <drawing-board :show="drawingShow" @closeWriteBoard="drawingShow = false" :isOldTool="false" ref="drawingBoardRef"
                   v-model:isCanUndo="isCanUndo"
                   v-model:isCanRedo="isCanRedo"
                   v-model:currentDrawColor="currentDrawColor"
                   v-model:currentLineWidth="currentLineWidth"
                   v-model:eraserLineWidth="eraserLineWidth"/>
</template>

<script lang="ts">
import {IResourceItem} from "@/api/resource";
import {MutationTypes, useStore} from "@/store";
import {getOssUrl} from "@/utils/oss";
import PenTool from "@/views/preparation/intelligenceClassroom/components/preview/PenTool.vue";

import {
    computed,
    defineComponent, nextTick,
    onMounted,
    onUnmounted,
    PropType,
    ref,
    watchEffect,
} from "vue";
import DrawingBoard from "@/components/drawingBoard/index.vue";

export default defineComponent({
    components: {DrawingBoard, PenTool},

    props: {
        index: {
            type: Number,
            default: 0,
        },
    },
    setup(props, {emit}) {
        const drawingBoardRef = ref();
        //显示隐藏画笔
        const drawingShow = ref(false);
        const toolType = ref("mouse");

        const store = useStore();
        const url = ref("");
        const resource = computed(() =>
            store.state.common.showResourceFullScreen.length > 0
                ? store.state.common.showResourceFullScreen[props.index]
                    .resource
                : null
        );
        const type = computed(() => resource.value?.ResourceShowType);
        const extention = computed(() =>
            resource.value && resource.value.File
                ? resource.value.File.FileExtention
                : ""
        );
        const isOffice = computed(
            () =>
                ["ppt", "pptx", "doc", "docx", "xls", "xlsx", "pdf"].indexOf(
                    extention.value.toLocaleLowerCase()
                ) > -1
        );
        const isImage = computed(
            () => ["gif", "png", "jpg", "jpeg"].indexOf(extention.value.toLocaleLowerCase()) > -1
        );
        const isAudio = computed(
            () => ["mp3", "wav"].indexOf(extention.value.toLocaleLowerCase()) > -1
        );
        const isVideo = computed(() => ["mp4"].indexOf(extention.value.toLocaleLowerCase()) > -1);

        const initIframeSrc = async () => {
            if (!resource.value) return;

            if (resource.value.ResourceShowType === 0 && resource.value.File) {
                const {FilePath, FileMD5, FileExtention, FileBucket} =
                    resource.value.File;
                const key = `${FilePath}/${FileMD5}.${FileExtention}`;
                const fileUrl = await getOssUrl(key, FileBucket);
                url.value = isOffice.value
                    ? "https://owa.lyx-edu.com/op/view.aspx?src=" +
                    encodeURIComponent(fileUrl)
                    : fileUrl;
            }

            if (
                resource.value.ResourceShowType === 4 &&
                resource.value.ResourceToolUrl
            ) {
                url.value = resource.value.ResourceToolUrl;
                console.log("url.value", url.value);
            }
        };

        initIframeSrc();
        // watchEffect(initIframeSrc);
        const close = () => {
            store.commit(MutationTypes.REMOVE_FULLSCREEN_RESOURCE, {
                id: resource.value?.id,
                openMore: resource.value?.openMore,
            });
        };
        const isShowPen = ref(false);
        const penLeft = ref(0);
        const penTop = ref(0);
        const isCanUndo = ref(false);
        const isCanRedo = ref(false);
        const currentDrawColor = ref("#f60000");
        const currentLineWidth = ref(2);
        const eraserLineWidth = ref(30);
        // 工具栏
        const openPaintTool = (event: MouseEvent) => {
            const target = event.target as HTMLDivElement;
            const {left, top} = target.getBoundingClientRect();
            drawingShow.value = true;
            isShowPen.value = true;
            penLeft.value = left;
            penTop.value = top;
        };
        // 撤销
        const undo = () => {
            drawingBoardRef.value.undo()
        };
        // 回退
        const redo = () => {
            drawingBoardRef.value.redo()
        };
        // 画笔其它配置
        const whiteboardOption = (option: string, value?: number) => {
            // emit("whiteboardOption", option, value);
            console.log('option,value', option, value)
            drawingBoardRef.value.whiteboardOption(option, value)
        };
        // 设置橡皮大小
        const setEraserSize = (value: number) => {
            console.log('value', value)
            drawingBoardRef.value.whiteboardOption("setEraserSize", value)
        };
        onMounted(() => {
            const iframe: any = document.getElementById("office-iframe");
            const mask: any = document.querySelector('.mask');
            iframe.addEventListener("load", function () {
                // 在这里写回调函数的逻辑
                setTimeout(function () {
                    // 这里放置你的代码
                    mask.style.display = 'block';
                }, 300);
            });
            iframe.addEventListener('error', function () {
                mask.style.display = 'none';
            });
        })
        return {
            close,
            type,
            url,
            isOffice,
            isImage,
            isAudio,
            isVideo,
            resource,
            drawingShow,
            toolType,
            isShowPen,
            penLeft,
            penTop,
            openPaintTool,
            drawingBoardRef,
            undo,
            redo,
            setEraserSize,
            whiteboardOption,
            isCanUndo,
            isCanRedo,
            currentDrawColor,
            currentLineWidth,
            eraserLineWidth,
        };
    },
});
</script>

<style lang="scss" scoped>
.iframe-box {
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 20000;
    background: #fff;
    overflow: hidden;

    .iframe-content {
        overflow: hidden;
        flex: 1;
        min-height: 0;
        background: #fff;

        .not-preview {
            width: 100%;
            height: 100%;
            overflow: hidden;
            background: #fff;
            font-size: 30px;
            font-weight: 600;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        iframe {
            height: 100%;
            width: 100%;
        }

        .office-iframe {
            height: calc(100% + 55px);
            margin-top: -55px;
        }

        .iframe-image,
        .iframe-video,
        .iframe-audio {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;

            img {
                width: 100%;
                height: 100%;
                object-fit: contain;
                display: block;
            }

            video {
                width: 100%;
                height: 100%;
                object-fit: contain;
            }
        }
    }

    .mask {
        display: none;
        position: absolute;
        bottom: 80px;
        width: 77px;
        height: 22px;
        background: #d24726;
        right: 1px;
    }

    .iframe-footer {
        width: 100%;
        height: 80px;
        padding: 12px;
        background: rgb(125, 164, 236);
        display: flex;
        align-items: center;
        justify-content: center;

        .iframe-footer-btn {
            width: 64px;
            height: 64px;
            cursor: pointer;
            margin-right: 20px;
            background: url("~@/assets/look/btn_guanbi@2x.png");
            background-size: 100% 100%;

            p {
                color: #fff;
                text-align: center;
                font-size: 12px;
                line-height: 24px;
                margin-top: 40px;
                font-weight: 550;
            }
        }

        .pen {
            background: url("./../../assets/look/btn_huabi@2x.png");
            background-size: 100% 100%;
            margin-right: 20px;

            p {
                color: #4b71ee;
            }
        }
    }


}

.me-tools {
    background: rgba(15, 39, 91, 0.15);
    border-radius: 12px;
    z-index: 99999;
    cursor: move;
    height: 64px;
    display: flex;
    overflow: auto;
    bottom: 4vh;
    right: 6vw;
    //width: 378px;
    transition: width 0.5s, transform 0.5s;
    overflow-y: hidden;

    .me-tools-righttool {
        display: flex;
        align-items: center;
        width: 130px;
        padding: 0px 5px;
        justify-content: space-around;

        .me-tool-btn-new {

            cursor: pointer;
            width: 48px;
            height: 48px;
            background: #FFFFFF;
            border-radius: 8px;
            position: relative;
            top: 0;
            transition: all 0.1s;

            .icon-text {
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: space-around;
                align-items: center;
                padding: 4px 0;

                .text {
                    font-size: 9px;
                    font-family: HarmonyOS_Sans_SC_Medium;
                    color: #414E65;
                }

                img {
                    width: 18px;
                }
            }
        }

        .me-tool-btn-new:active {
            top: 2px;
            box-shadow: 0 0 0 !important;
        }

        .me-tool-btn-new.btn-active {
            background: #4B71EE;

            .text {
                color: #fff;
            }
        }
    }


}
</style>
