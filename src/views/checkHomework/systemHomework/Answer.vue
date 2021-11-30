<template>
    <div class="canvas-box" :style="{ height: height + 60 + 'px' }">
        <Question
            :speechResult="speechResult"
            :speechText="speechText"
            :questionType="questionType"
            :isWrite="writeData.length > 0"
            :question="questionUrl"
            :answer="''"
            :isOrigin="isOrigin"
            :speechAudioList="speechAudioList"
            :choiceValue="choiceValue"
            :imgWidth="imgWidth"
            :imgHeight="imgHeight"
            :imgOffsetX="imgOffsetX"
            :imgOffsetY="imgOffsetY"
            :isQuestion="isQuestion"
        />
        <Write
            :data="writeData"
            :writeList="writeList"
            :panelHeight="imgHeight"
            :panelWidth="imgWidth"
            :panelOffsetX="imgOffsetX"
            :panelOffsetY="imgOffsetY"
        />
        <Note
            :width="width"
            :height="height"
            :data="noteData"
            :scale="scale"
            :isWrite="writeData.length > 0"
            :isRead="questionType == 7"
        />
    </div>
</template>

<script lang="ts">
import { QuestionFile, SpeechAssessResult } from "@/types/checkHomework";
import { FileInfo } from "@/types/lookQuestion";
import { downloadFile } from "@/utils/oss";
import { defineComponent, PropType, ref, watchEffect } from "vue";
import axios from "axios";
import Question from "./Question.vue";
import Write from "./Write.vue";
import Note from "./Note.vue";
let panelWidth = 1024;
let panelHeight = 696;
let scale = 900 / 1024;
const width = 900;
let height = 696 * scale;
let imgOffsetX = 37.5 * scale;
let imgOffsetY = 96 * scale;
let imgWidth = 924.5 * scale;
let imgHeight = 511 * scale;
export default defineComponent({
    props: {
        data: {
            type: Array as PropType<QuestionFile[]>,
            default: () => []
        },
        question: {
            type: Object as PropType<FileInfo>,
            default: () => ({})
        },
        answer: {
            type: Object,
            default: () => ({})
        },
        isQuestion: {
            type: Boolean,
            default: true
        },
        isOrigin: {
            type: Boolean,
            default: true
        },
        writeList: {
            type: Array,
            default: () => []
        },
        // 题目类型, 1 ABC类型选择题 , 2 123类型选择题 , 3 TF判断题 , 4√×判断题 , 5 填空题 , 6 应用题 7语音测评
        questionType: {
            type: Number,
            default: 1
        },
        speechResult: {
            type: Array as PropType<SpeechAssessResult[]>,
            default: () => []
        },
        speechAudioList: {
            type: Array as PropType<string[]>,
            default: () => []
        },
        speechText: {
            type: String,
            default: ""
        },
        choiceValue: {
            type: String,
            default: ""
        }
    },
    setup(props) {
        const questionUrl = ref("");
        const noteData = ref([]);
        const writeData = ref([]);
        const _scale = ref(scale);
        const _height = ref(height);
        const _width = ref(width);
        const _imgWidth = ref(imgWidth);
        const _imgHeight = ref(imgHeight);
        const _imgOffsetX = ref(imgOffsetX);
        const _imgOffsetY = ref(imgOffsetY);
        const _downloadFile = async (file: FileInfo) => {
            let url = "";
            const { Extention, FilePath, FileName, Bucket } = file;
            if (Extention) {
                const key = FilePath + "/" + FileName + "." + Extention;
                url = await downloadFile(key, Bucket);
            } else {
                const key = FilePath + "/" + FileName;
                url = await downloadFile(key, Bucket);
            }
            return url;
        };
        watchEffect(
            async () => {
                if (props.question) {
                    questionUrl.value = await _downloadFile(props.question);
                }
            }
        );
        function init() {
            noteData.value = [];
            writeData.value = [];
            props.data.forEach(async (item) => {
                if (item.File) {
                    const url = await _downloadFile(item.File);
                    setStyle(url, item.Type);
                }
            });
        }
        async function setStyle(url: string, type: number) {
            const res = await axios.get(url);
            // 对缩放比例进行计算
            // 显示框 及画板
            panelWidth = res.data.panelWidth;
            panelHeight = res.data.panelHeight;
            scale = width / panelWidth;
            height = panelHeight * scale;
            // 图片
            imgWidth = res.data.qaWidth * scale;
            imgHeight = res.data.qaHeight * scale;
            imgOffsetX = res.data.qaX * scale;
            imgOffsetY = res.data.qaY * scale;
            _scale.value = scale;
            _height.value = height;
            _imgWidth.value = imgWidth;
            _imgHeight.value = imgHeight;
            _imgOffsetX.value = imgOffsetX;
            _imgOffsetY.value = imgOffsetY;
            if (res.data.operations && res.data.operations.length > 0) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                res.data.operations.map((note: any) => {
                    // 铅笔 修改该值，为了确认是订正还是笔记
                    if (note.mode === "0") {
                        note.mode = "0-" + type;
                    }
                });
                noteData.value = noteData.value.concat(res.data.operations);
            }
            if (res.data.fillBlankArr && res.data.fillBlankArr.length > 0) {
                writeData.value = writeData.value.concat(res.data.fillBlankArr);
            }
        }
        init();
        return {
            questionUrl,
            height: _height,
            writeData,
            imgHeight: _imgHeight,
            imgOffsetX: _imgOffsetX,
            imgOffsetY: _imgOffsetY,
            noteData,
            width: _width,
            scale: _scale,
            imgWidth: _imgWidth
        };
    },
    components: { Question, Write, Note }
});
</script>

<style lang="scss" scoped>
.canvas-box {
    border: 1px solid #ababab;
    background-color: #fff;
    position: relative;
    padding: 30px;
    overflow: hidden;
    min-width: 960px;
}

.canvas-box canvas {
    position: absolute;
    z-index: 10;
}

.canvas-box img {
    width: 900px;
}
</style>
