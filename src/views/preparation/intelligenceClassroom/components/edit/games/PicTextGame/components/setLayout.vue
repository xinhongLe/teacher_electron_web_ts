<template>
    <div id="setLayout">
        <div
            id="content"
            :style="{
                width: contentWidth + 'px',
                height: contentHeight + 'px',
                transform: `scale(${ scale })`
            }">

            <div
                :class="['shape-box', 'shape-active']"
                @click.stop="() => null"
                :style="{
                    width: element.Size.Width + 'px',
                    height: element.Size.Height + 'px',
                    left: element.Position.x + 'px',
                    top: element.Position.y + 'px',
                    zIndex: element.zIndex || 0
                 }"
                v-for="(element, i) in elements" :key="i"
            >
                <div
                    class="shape-content"
                    @mousedown.stop="handleMousedown($event, element)"
                >
                    <div
                        class="shape__scale-point lt"
                        @mousedown.stop="handlePointMousedown('lt', $event, element)"
                    ></div>
                    <div
                        class="shape__scale-point rt"
                        @mousedown.stop="handlePointMousedown('rt', $event, element)"
                    ></div>
                    <div
                        class="shape__scale-point lb"
                        @mousedown.stop="handlePointMousedown('lb', $event, element)"
                    ></div>
                    <div
                        class="shape__scale-point rb"
                        @mousedown.stop="handlePointMousedown('rb', $event, element)"
                    ></div>
                    <div
                        class="shape__scale-point l"
                        @mousedown.stop="handlePointMousedown('l', $event, element)"
                    ></div>
                    <div
                        class="shape__scale-point r"
                        @mousedown.stop="handlePointMousedown('r', $event, element)"
                    ></div>
                    <div
                        class="shape__scale-point t"
                        @mousedown.stop="handlePointMousedown('t', $event, element)"
                    ></div>
                    <div
                        class="shape__scale-point b"
                        @mousedown.stop="handlePointMousedown('b', $event, element)"
                    ></div>
                    <div class="text_class" v-if="element.Type === 1">
                        {{ element.Data }}
                    </div>
                    <img class="pic_class" v-if="element.Type === 0" :src="element.File.url" alt="">
                </div>
            </div>

        </div>
    </div>
</template>

<script lang="ts">
import {defineComponent, ref, onMounted, reactive, computed, toRefs} from "vue";
import {IClassItem, IClassOption} from "@/types/game";

export default defineComponent({
    name: "setLayout",
    props: {
        newForm: {
            type: Object,
            require: true,
            default: () => ({
                leftType: 1,
                rightType: 1,
                leftData: [
                    {
                        Type: 1,
                        Data: "",
                        File: {
                            url: "",
                            Bucket: "",
                            Name: "",
                            FileName: "",
                            FilePath: "",
                            Extention: "",
                            Type: 2,
                        },
                        Position: {x: 200, y: 200},
                        Size: {Width: 240, Height: 100},
                    },
                ],
                rightData: [
                    {
                        Type: 1,
                        Data: "",
                        File: {
                            url: "",
                            Bucket: "",
                            Name: "",
                            FileName: "",
                            FilePath: "",
                            Extention: "",
                            Type: 2,
                        },
                        Position: {x: 600, y: 200},
                        Size: {Width: 240, Height: 100},
                    },
                ]
            })
        }
    },
    emits: ["save"],
    setup(props, {emit}) {
        const state = reactive({
            contentWidth: 1920,
            contentHeight: 1080,
            isMousedown: false,
            // selectElementId: "",
            elements: [] as IClassItem[]
        });

        const form: any = computed(() => props.newForm);

        const scale = ref(1);
        const element = ref({
            dragStyle: {
                height: 200,
                width: 200,
                top: 100,
                left: 200
            }
        });

        const elementStar = ref({});

        const handleMousedown = (e: any, element: any) => {
            state.isMousedown = true;
            elementStar.value = {...element};
            const pos = {
                height: element.Size.Height,
                width: element.Size.Width,
                top: element.Position.y,
                left: element.Position.x
            };
            const startY = e.clientY / scale.value;
            const startX = e.clientX / scale.value;
            const startTop = pos.top;
            const startLeft = pos.left;

            const move = (moveEvent: any) => {
                if (state.isMousedown) {
                    // this.flag = true;
                    // 移动的时候，不需要向后代元素传递事件，只需要单纯的移动就OK
                    moveEvent.stopPropagation();
                    moveEvent.preventDefault();

                    const currX = moveEvent.clientX / scale.value;
                    const currY = moveEvent.clientY / scale.value;
                    pos.top = currY - startY + startTop;
                    pos.left = currX - startX + startLeft;
                    element.Position.y = pos.top;
                    element.Position.x = pos.left;
                }
            };
            const up = () => {
                state.isMousedown = false;
                document.removeEventListener("mousemove", move, true);
                document.removeEventListener("mouseup", up, true);
            };
            document.addEventListener("mousemove", move, true);
            document.addEventListener("mouseup", up, true);
        };

        const handlePointMousedown = (point: any, downEvent: any, element: any) => {
            const pos = {...element};
            const height = element.Size.Height;
            const width = element.Size.Width;
            const top = element.Position.y;
            const left = element.Position.x;
            const startX = downEvent.clientX / scale.value;
            const startY = downEvent.clientY / scale.value;
            const move = (moveEvent: any) => {
                const currX = moveEvent.clientX / scale.value;
                const currY = moveEvent.clientY / scale.value;
                const disY = currY - startY;
                const disX = currX - startX;
                const hasT = /t/.test(point);
                const hasB = /b/.test(point);
                const hasL = /l/.test(point);
                const hasR = /r/.test(point);
                const newHeight = +height + (hasT ? -disY : hasB ? disY : 0);
                const newWidth = +width + (hasL ? -disX : hasR ? disX : 0);
                pos.Size.Height = newHeight > 0 ? newHeight : 0;
                pos.Size.Width = newWidth > 0 ? newWidth : 0;
                pos.Position.x = +left + (hasL ? disX : 0);
                pos.Position.y = +top + (hasT ? disY : 0);
                element.Position.y = pos.Position.y;
                element.Position.x = pos.Position.x;
                element.Size.Width = pos.Size.Width;
                element.Size.Height = pos.Size.Height;
            };
            const up = () => {
                state.isMousedown = false;
                document.removeEventListener("mousemove", move);
                document.removeEventListener("mouseup", up);
            };
            document.addEventListener("mousemove", move);
            document.addEventListener("mouseup", up);
        };

        const initData = () => {
            state.elements = [];
            props.newForm.leftData.forEach((option: any, index: number) => {
                option.selectId = index;
                state.elements.push(option);
            });
            props.newForm.rightData.forEach((option: any, index: number) => {
                option.selectId = index;
                state.elements.push(option);
            });
        };
        const handleComfirm = () => {
            emit("save");
        };

        onMounted(() => {
            const width = document.getElementById("setLayout")?.clientWidth || 850;
            scale.value = width / state.contentWidth;
            initData();
        });
        return {
            ...toRefs(state),
            scale,
            element,
            form,
            handleMousedown,
            handlePointMousedown,
            handleComfirm
        };
    }
});
</script>

<style scoped lang="scss">
#setLayout {
    width: 100%;
    height: 100%;
    font-size: 24px;
}

#content {
    width: 100%;
    height: 100%;
    border: 1px solid var(--el-border-color);
    transform-origin: 0 0;
    overflow: hidden;
}

.shape-box {
    position: absolute;
    box-sizing: content-box;
    cursor: move;
}

.shape-active {
    outline: 1px solid #70c0ff;
}

.shape-active .shape__scale-point {
    display: block;
}

.shape-content {
    width: 100%;
    height: 100%;
    position: relative;
}

.shape__scale-point {
    position: absolute;
    background: #fff;
    border: 1px solid #59c7f9;
    width: 12px;
    height: 12px;
    z-index: 100;
    border-radius: 50%;
    box-sizing: border-box;
    display: none;
}

.shape__scale-point.lt {
    left: -6px;
    top: -6px;
    cursor: nw-resize;
}

.shape__scale-point.rt {
    right: -6px;
    top: -6px;
    cursor: ne-resize;
}

.shape__scale-point.lb {
    bottom: -6px;
    left: -6px;
    cursor: sw-resize;
}

.shape__scale-point.rb {
    bottom: -6px;
    right: -6px;
    cursor: se-resize;
}

.shape__scale-point.l {
    left: -6px;
    top: 50%;
    margin-top: -6px;
    cursor: w-resize;
}

.shape__scale-point.r {
    right: -6px;
    top: 50%;
    margin-top: -6px;
    cursor: e-resize;
}

.shape__scale-point.t {
    top: -6px;
    left: 50%;
    margin-left: -6px;
    cursor: n-resize;
}

.shape__scale-point.b {
    bottom: -6px;
    left: 50%;
    margin-left: -6px;
    cursor: s-resize;
}

.text_class {
    line-height: 32px;
}

.pic_class {
    width: 100%;
    height: 100%;
    background-size: contain;
}

</style>
