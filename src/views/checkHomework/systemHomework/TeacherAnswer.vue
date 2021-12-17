<template>
    <div class="container" ref="containerRef">
        <div
            :style="{
                transform: `translate(${transform.x}px, ${transform.y}px)`,
                ...divStyle,
            }"
            class="content"
            @mousedown="mousedown"
            v-if="imgUrl"
        >
            <img :src="imgUrl" v-if="imgUrl" @load="load" />
            <div class="box" :style="boxStyle"></div>
        </div>
    </div>
</template>

<script lang="ts">
import { QuestionDetail } from "@/types/checkHomework";
import { downloadFile } from "@/utils/oss";
import { defineComponent, PropType, reactive, ref, watchEffect } from "vue";
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
        const divStyle = ref();
        const boxStyle = ref();
        const imgWidth = ref(0);
        const imgHeight = ref(0);
        const containerRef = ref<HTMLDivElement>();
        const transform = reactive({
            x: 0,
            y: 0
        });
        const dragPosition = {
            x: 0,
            y: 0
        };
        const load = (e: Event) => {
            const target = e.target as HTMLImageElement;
            const blank =
                props.data.WorkbookPageQuestion?.WorkbookPageQuestionBlanks.find(
                    ({ Type }) => Type === 0
                );
            imgWidth.value = target.width;
            imgHeight.value = target.height;
            const x = target.width * (blank?.MarginLeft || 1);
            const y = target.height * (blank?.MarginTop || 1);
            divStyle.value = {
                width: target.width + "px",
                height: target.height + "px"
            };
            transform.x = -x / 1.15;
            transform.y = -y / 1.1;
            boxStyle.value = {
                width: target.width * (blank?.SizeWidth || 1) + "px",
                left: x + "px",
                top: y + "px",
                height: target.height * (blank?.SizeHeight || 1) + "px"
            };
        };

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
                const fileInfo = props.data.Study?.MissionFiles?.find(
                    ({ PageNum }) =>
                        PageNum === props.data.WorkbookPageQuestion?.PageNum
                )?.File;
                if (fileInfo) {
                    const { Bucket, Extention, FileName, FilePath } = fileInfo;
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
            divStyle,
            boxStyle,
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
