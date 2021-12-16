<template>
    <div class="container" ref="containerRef"  @mousedown="mousedown">
        <div
            :style="{
                transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
                ...divStyle,
            }"
            class="content"
        >
            <img :src="imgUrl" v-if="imgUrl" @load="load" />
            <div class="box" :style="boxStyle"></div>
        </div>
    </div>
</template>

<script lang="ts">
import { QuestionDetail } from "@/types/checkHomework";
import { downloadFile } from "@/utils/oss";
import { defineComponent, PropType, watchEffect, ref, reactive, onMounted } from "vue";
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
            scale: 1,
            y: 0
        });
        const dragPosition = {
            x: 0,
            y: 0
        };
        const zoomRate = 0.015;
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
            transform.y = -y / 2;
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
                }
            }
        });
        return	{
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
        height: 580px;
        overflow: hidden;
        cursor: move;
        .content {
            position: relative;
            height: 100%;
        }
        img {
            width: 100%;
        }
        .box {
            position: absolute;
            background: rgba(46, 230, 255, 0.3);
        }
    }
</style>
