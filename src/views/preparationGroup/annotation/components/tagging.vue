<template>
    <div class="tagging">
        <div class="tagging-center">
            <div class="tagging-center-main" @click="showAnnotaiton($event)">
                <div
                    @mousedown="clickElement($event,item,index)"
                    :class="activeIndex === index ? 'elements activeElements' : 'elements'"
                    :id="`element`+index" v-for="(item,index) in elementList"
                    :key="index"
                    :style="{left: item.PointX + 'px', top: item.PointY+ 'px'}"
                >
                    <span>{{index + 1}}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { nextTick } from "process";
import { EditAnnotation } from "../api";
import { defineComponent, onMounted, ref, getCurrentInstance, onBeforeUnmount, reactive, toRefs } from "vue-demi";
import { get, STORAGE_TYPES } from "@/utils/storage";
export default defineComponent({
    setup(props, { emit }) {
        const allData = reactive({ elementList: [] });
        const { proxy } = getCurrentInstance();
        const dragePosition = {
            x: 0,
            y: 0
        };
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
        const lastMove = ref();
        const clickElement = (event, item, index) => {
            console.log(item, "item");
            activeIndex.value = index;
            const taggingComponents = document.querySelector(".tagging-center-main");
            console.log(taggingComponents.offsetWidth);
            proxy.mittBus.emit("annotationActionID", activeIndex.value);
            dragePosition.x = event.clientX;
            dragePosition.y = event.clientY;
            move = true;
            document.addEventListener("mousemove", (e) => {
                if (move) {
                    lastMove.value = new Date().getTime();
                    const x = dragePosition.x - e.clientX;
                    const y = dragePosition.y - e.clientY;
                    dragePosition.x = e.clientX;
                    dragePosition.y = e.clientY;
                    /**
                     *防止超出范围
                     */
                    if (allData.elementList[activeIndex.value].PointX - x / scale.value < 0) allData.elementList[activeIndex.value].PointX = 0;
                    if (allData.elementList[activeIndex.value].PointY - y / scale.value < 0) allData.elementList[activeIndex.value].PointY = 0;
                    if (allData.elementList[activeIndex.value].PointX - x / scale.value > taggingComponents.offsetWidth) allData.elementList[activeIndex.value].PointX = taggingComponents.offsetWidth;
                    if (allData.elementList[activeIndex.value].PointY - y / scale.value > taggingComponents.offsetHeight) allData.elementList[activeIndex.value].PointY = taggingComponents.offsetHeight;
                    allData.elementList[activeIndex.value].PointX = allData.elementList[activeIndex.value].PointX - x / scale.value;
                    allData.elementList[activeIndex.value].PointY = allData.elementList[activeIndex.value].PointY - y / scale.value;
                }
            });
            document.addEventListener("mouseup", () => {
                move = false;
            });
            // 监听鼠标三秒之内没有动过
            const isMove = setInterval(() => {
                const now = new Date().getTime();
                console.log(now, lastMove.value);
                if (!lastMove.value) {
                    clearInterval(isMove);
                    return false;
                }
                if (now - lastMove.value > 1000) {
                    console.log("没有动了");
                    lastMove.value = undefined;
                    for (const item of allData.elementList) {
                        if (!item.ID) {
                            return false;
                        }
                        if (item.CreateTeacherID === get(STORAGE_TYPES.USER_INFO).ID) {
                            const obj = {
                                annotationID: item.ID,
                                pointX: item.PointX,
                                pointY: item.PointY,
                                content: item.Content
                            };
                            EditAnnotation(obj);
                        }
                    }
                }
            }, 500);
        };
        const showAnnotaiton = (e) => {
            let annotationSwitch = false;
            console.log(e, "eeeeeeeeee");
            if (e.srcElement.className === "tagging-center-main") {
                annotationSwitch = false;
            } else {
                annotationSwitch = true;
            }
            emit("showAnnotation", annotationSwitch);
        };
        return {
            ...toRefs(allData),
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
