<template>
    <div class="tagging">
        <div class="tagging-center">
            <div class="tagging-center-main">
                <div
                @mousedown="clickElement($event,item,index)"
                :class="activeIndex === index ? 'elements activeElements' : 'elements'"
                :id="`element`+index" v-for="(item,index) in elementList"
                :key="index"
            >
            </div>
            </div>
        </div>
    </div>
</template>

<script>
import { nextTick } from "process";
import { defineComponent, onMounted, ref } from "vue-demi";
export default defineComponent({
    setup() {
        const elementList = ref([]);
        const addElement = () => {
            elementList.value.push({
                left: 0,
                top: 0
            });
        };
        onMounted(() => {
            window.addEventListener("resize", onRize);
            nextTick(() => {
                const taggingRef = document.querySelector(".tagging-center");
                const width = document.querySelector(".slide-content").style.width;
                const height = document.querySelector(".slide-content").style.height;
                taggingRef.setAttribute("style", `width:${width};height:${height};`);
                const taggingCenter = document.querySelector(".tagging-center-main");
                const Cwidth = document.querySelector(".screen-slide").style.width;
                const Cheight = document.querySelector(".screen-slide").style.height;
                const Ctransform = document.querySelector(".screen-slide").style.transform;
                taggingCenter.setAttribute("style", `width:${Cwidth};height:${Cheight};transform:${Ctransform}`);
            });
        });
        const onRize = () => {
            nextTick(() => {
                const taggingRef = document.querySelector(".tagging-center");
                const width = document.querySelector(".slide-content").style.width;
                const height = document.querySelector(".slide-content").style.height;
                taggingRef.setAttribute("style", `width:${width};height:${height};`);
                const taggingCenter = document.querySelector(".tagging-center-main");
                const Cwidth = document.querySelector(".screen-slide").style.width;
                const Cheight = document.querySelector(".screen-slide").style.height;
                const Ctransform = document.querySelector(".screen-slide").style.transform;
                taggingCenter.setAttribute("style", `width:${Cwidth};height:${Cheight};transform:${Ctransform}`);
            });
        };
        let move = false;
        let deltaLeft = 0;
        let deltaTop = 0;
        let icon = "";
        const activeIndex = ref(null);
        const clickElement = (event, item, index) => {
            activeIndex.value = index;
            const taggingComponents = document.querySelector(".tagging-center");
            icon = document.querySelector(`#element${index}`);
            deltaLeft = event.clientX - event.target.offsetLeft;
            deltaTop = event.clientY - event.target.offsetTop;
            move = true;
            taggingComponents.addEventListener("mousemove", (e) => {
                if (move) {
                    const cx = e.clientX;
                    const cy = e.clientY;
                    /** 相减即可得到相对于父元素移动的位置 */
                    let dx = cx - deltaLeft;
                    let dy = cy - deltaTop;
                    /** 防止超出父元素范围 */
                    if (dx < 0) dx = 0;
                    if (dy < 0) dy = 0;
                    if (dx > taggingComponents.offsetWidth) dx = taggingComponents.offsetWidth;
                    if (dy > taggingComponents.offsetHeight) dy = taggingComponents.offsetHeight;
                    icon.setAttribute("style", `left:${dx}px;top:${dy}px`);
                    item.left = dx;
                    item.top = dy;
                }
            });
            taggingComponents.addEventListener("mouseup", () => {
                move = false;
                icon = "";
                item = {};
                index = null;
            });
        };
        return {
            elementList,
            activeIndex,
            clickElement,
            addElement
        };
    }
});
</script>

<style lang="scss" scoped>
.tagging{
    width: 100%;
    height: 100%;
    .tagging-center{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        display: flex;
        justify-content: center;
        align-items: center;
        transform-origin: center center;
        .tagging-center-main{
            position: absolute;
            top: 0;
            left: 0;
            transform-origin: 0 0;
            border: 2px solid #000;
        }
    }
}
.activeElements{
    background: red !important;
}
.elements{
    position: absolute;
    top: calc(50% - 20px);
    left: calc(50% - 10px);
    width: 20px;
    height: 40px;
    background: #000;
}
</style>
