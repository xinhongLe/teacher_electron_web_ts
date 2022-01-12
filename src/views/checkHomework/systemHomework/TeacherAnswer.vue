<template>
    <div class="container" ref="containerRef">
        <div
            :style="{
                transform: `translate(${transform.x}px, ${transform.y}px)`,
                width: `${imgWidth}px`,
                height: `${imgHeight}px`
            }"
            class="content"
            @mousedown="mousedown"
            v-if="fileInfo"
        >
            <img :src="imgUrl" v-if="imgUrl" @load="load($event, data.WorkbookPageQuestion?.WorkbookPageQuestionBlanks || [])" />
            <div class="box" :style="boxStyle" v-for="(boxStyle, index) in boxStyleList" :key="index"></div>
        </div>
        <EmptyImage v-else :isError="data.Detail?.Result === 2"/>
    </div>
</template>

<script lang="ts">
import { QuestionDetail } from "@/types/checkHomework";
import { downloadFile } from "@/utils/oss";
import { computed, defineComponent, PropType, reactive, ref, watch, watchEffect } from "vue";
import EmptyImage from "./EmptyImage.vue";
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
            y: 0
        });
        const dragPosition = {
            x: 0,
            y: 0
        };
        const fileInfo = computed(() => props.data.Study?.MissionFiles?.find(({ PageNum }) => PageNum === props.data.WorkbookPageQuestion?.PageNum)?.File);
        const { load, imgHeight, imgWidth, x, y, boxStyleList } = useTeacherAnswerLoad();

        watch([x, y], ([v1, v2]) => {
            transform.x = -v1 / 1.15;
            transform.y = -v2 / 1.1;
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
                const offsetWidth = containerRef.value?.offsetWidth || 0;
                const offsetHeight = containerRef.value?.offsetHeight || 0;
                if (x <= 0 && Math.abs(x) < imgWidth.value - offsetWidth) {
                    transform.x = x;
                }
                if (y <= 0 && Math.abs(y) < imgHeight.value - offsetHeight) {
                    transform.y = y;
                }
            };
            document.onmouseup = () => {
                document.onmousemove = null;
                document.onmouseup = null;
            };
        };
        watchEffect(async () => {
            if (props.data) {
                if (fileInfo.value) {
                    const { Bucket, Extention, FileName, FilePath } = fileInfo.value;
                    const key = `${FilePath}/${FileName}.${Extention}`;
                    imgUrl.value = await downloadFile(key, Bucket);
                } else {
                    imgUrl.value = "";
                }
            }
        });
        return {
            imgUrl,
            load,
            imgRef,
            fileInfo,
            imgWidth,
            boxStyleList,
            imgHeight,
            mousedown,
            containerRef,
            transform
        };
    },
    components: { EmptyImage }
});
</script>

<style lang="scss" scoped>
.container {
    width: 100%;
    height: 100%;
    cursor: move;

    .content {
        position: relative;
    }
    .box {
        position: absolute;
        background: rgba(46, 230, 255, 0.3);
    }
}
</style>
