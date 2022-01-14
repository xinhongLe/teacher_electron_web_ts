<template>
    <div class="container" ref="containerRef"  @mousedown="mousedown">
        <div
            :style="{
                transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
                width: `${imgWidth}px`,
                height: `${imgHeight}px`
            }"
            class="content"
        >
            <img :src="imgUrl" v-if="imgUrl" @load="load($event, data.WorkbookPageQuestion?.WorkbookPageQuestionBlanks || [])" />
            <div class="box" :style="boxStyle" v-for="(boxStyle, index) in boxStyleList" :key="index"></div>
        </div>
    </div>
</template>

<script lang="ts">
import { QuestionDetail } from "@/types/checkHomework";
import { getOssUrl } from "@/utils/oss";
import { defineComponent, PropType, watchEffect, ref, reactive, onMounted, onUnmounted, watch, computed } from "vue";
import useTeacherAnswerLoad from "./hooks/useTeacherAnswerLoad";
export default defineComponent({
    props: {
        data: {
            type: Object as PropType<QuestionDetail>,
            required: true
        }
    },
    setup(props) {
        const imgUrl = ref("");
        const imgRef = ref<HTMLImageElement>();
        const containerRef = ref<HTMLDivElement>();
        const transform = reactive({
            x: 0,
            scale: 1,
            y: 0
        });
        const dragPosition = {
            x: 0,
            y: 0
        };
        const zoomRate = 0.015;
        const { load, imgHeight, imgWidth, y, boxStyleList } = useTeacherAnswerLoad();
        watch(y, (v) => {
            transform.y = -v / 2;
        });

        const mousedown = (event: MouseEvent) => {
            const { clientX, clientY } = event;
            dragPosition.x = clientX;
            dragPosition.y = clientY;
            document.onmousemove = (event) => {
                const { clientX, clientY } = event;
                const moveX = dragPosition.x - clientX;
                const moveY = dragPosition.y - clientY;
                dragPosition.x = clientX;
                dragPosition.y = clientY;
                const x = transform.x - moveX;
                const y = transform.y - moveY;
                transform.x = x;
                transform.y = y;
            };
            document.onmouseup = () => {
                document.onmousemove = null;
                document.onmouseup = null;
            };
        };

        function mousewheelHandler (e: WheelEvent) {
            const delta = -e.deltaY;
            if (delta > 0) {
                transform.scale = parseFloat((transform.scale + zoomRate).toFixed(3));
            } else {
                if (transform.scale > 0.2) {
                    transform.scale = parseFloat((transform.scale - zoomRate).toFixed(3));
                }
            }
        }

        onMounted(() => {
            document.addEventListener("wheel", mousewheelHandler);
        });

        onUnmounted(() => {
            document.removeEventListener("wheel", mousewheelHandler);
        });

        watchEffect(async () => {
            if (props.data) {
                const fileInfo = props.data.Study?.MissionFiles?.find(
                    ({ PageNum }) =>
                        PageNum === props.data.WorkbookPageQuestion?.PageNum
                )?.File;
                if (fileInfo) {
                    const { Bucket, Extention, FileName, FilePath } = fileInfo;
                    const key = `${FilePath}/${FileName}.${Extention}`;
                    imgUrl.value = await getOssUrl(key, Bucket);
                }
            }
        });
        return	{
            imgUrl,
            load,
            imgWidth,
            imgHeight,
            boxStyleList,
            imgRef,
            mousedown,
            containerRef,
            transform
        };
    }
});
</script>

<style lang="scss" scoped>
    .container {
        width: 100%;
        height: 580px;
        overflow: hidden;
        cursor: move;
        .content {
            position: relative;
            margin: 0px auto;
        }
        .box {
            position: absolute;
            background: rgba(46, 230, 255, 0.3);
        }
    }
</style>
