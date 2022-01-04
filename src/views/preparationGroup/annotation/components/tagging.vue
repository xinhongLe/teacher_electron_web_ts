<template>
    <div class="tagging">
        <div class="tagging-center">
            <div class="tagging-center-main" @click="showAnnotaiton($event)">
                <div
                    @mousedown="clickElement($event,item,index)"
                    :class="activeIndex === index ? 'elements activeElements' : 'elements'"
                    :id="`element`+index" v-for="(item,index) in elementList"
                    :key="index"
                    :style="{left: item.left + 'px', top: item.top+ 'px'}"
                >
                    <span>{{index + 1}}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { nextTick } from "process";
import { defineComponent, onMounted, ref, getCurrentInstance, onBeforeUnmount, reactive, toRefs } from "vue-demi";
export default defineComponent({
    setup(props, { emit }) {
        const allData = reactive({ elementList: [] });
        const { proxy } = getCurrentInstance();
        const dragePosition = {
            x: 0,
            y: 0
        };
        const style = reactive({
            left: 0,
            top: 0
        });
        const scale = ref(null);
        onMounted(() => {
            window.addEventListener("resize", onRize);
            proxy.mittBus.on("annotationList", (annotation) => {
                allData.elementList = annotation;
            });
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
                scale.value = Ctransform.slice(6, Ctransform.length - 1);
            });
        });
        onBeforeUnmount(() => {
            proxy.mittBus.off("annotationList");
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
                scale.value = Ctransform.slice(6, Ctransform.length - 1);
            });
        };
        let move = false;
        const activeIndex = ref(null);
        const clickElement = (event, item, index) => {
            activeIndex.value = index;
            proxy.mittBus.emit("annotationActionID", activeIndex.value);
            dragePosition.x = event.clientX;
            dragePosition.y = event.clientY;
            move = true;
            document.addEventListener("mousemove", (e) => {
                if (move) {
                    const x = dragePosition.x - e.clientX;
                    const y = dragePosition.y - e.clientY;
                    dragePosition.x = e.clientX;
                    dragePosition.y = e.clientY;
                    allData.elementList[activeIndex.value].left = allData.elementList[activeIndex.value].left - x / scale.value;
                    allData.elementList[activeIndex.value].top = allData.elementList[activeIndex.value].top - y / scale.value;
                }
            });
            document.addEventListener("mouseup", () => {
                move = false;
            });
        };
        const showAnnotaiton = (e) => {
            let annotationSwitch = false;
            if (e.toElement.className === "tagging-center-main") {
                annotationSwitch = false;
            } else {
                annotationSwitch = true;
            }
            emit("showAnnotation", annotationSwitch);
        };
        return {
            ...toRefs(allData),
            style,
            activeIndex,
            clickElement,
            showAnnotaiton
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
        }
    }
}
.activeElements{
    background-image: url("./pic_pizhu2.png") !important;
    background-position: center center;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    color:#fff !important;
}
.elements{
    position: absolute;
    top: calc(50% - 20px);
    left: calc(50% - 10px);
    width: 38px;
    height: 44px;
    background-image: url("./pic_pizhu1.png");
    background-position: center center;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    display: flex;
    align-items: center;
    justify-content: center;
    color:#4B71EE;
}
</style>
