<template>
    <div class="p-layout-package">
        <div class="lesson-package">
            <div class="lesson-package-item" :class="{ isActive: item.Id == currentSelectPackageId }"
                 v-for="(item, index) in lessonPackageList" @click.stop.prevent="selectPackage(item)" :key="index">
                <div class="package-item">
                    <div class="item-name">
                        <div class="names">
                            {{ course.lessonName || course.chapterName || "课包一" }}
                        </div>
                        <div @click.stop="deletenPackage(item.Id)">
                            <img src="@/assets/images/preparation/icon_delete_beike.png" alt="">
                        </div>
                    </div>
                    <div class="items">{{ item.Name }}</div>
                    <div class="item-footer">
                        <div class="item-button" :class="{ isPaike: item.IsSchedule }"
                             @mousedown.stop.prevent="isMouseDrag ? startDrag($event, course, item) : null"
                             @click.stop.prevent="!isMouseDrag ? toArrangeClass(item, 0) : null"
                             @touchstart.stop.prevent="!isMouseDrag ? toArrangeClass(item, 0, $event) : touchStartDrag($event, course, item)">
                            {{ item.IsSchedule ? "已排课" : "排课" }}
                        </div>
                    </div>
                </div>
            </div>

            <div class="package-item-add" @click.stop.prevent="addPackage">
                <img src="@/assets/images/preparation/icon_add_black.png" alt="">
                <span>新增课包</span>
            </div>
        </div>
    </div>
    <deletePackage v-model:visible="deleteVisible" @onDeletePackage="onDeletePackage"/>
</template>

<script lang="ts" setup>
import useLessonPackage from "@/hooks/useLessonPackage";
import useClickDrag, {} from "@/hooks/useClickDrag";
import {ref, PropType, onMounted, nextTick, watch} from "vue";
import emitter from "@/utils/mitt";
import {useStore} from "@/store";
import deletePackage from "../layout/dialog/deletePackage.vue";

const currentSelectPackageId = ref<string>("");
const {startDrag, touchStartDrag} = useClickDrag();
const {
    getMyLessonBagNew,
    lessonPackageList,
    addLessonPackage,
    deleteLessonPackage,
    addResourceLessonBag,
    addLessonBag,
    setValueAddLessonBag
} = useLessonPackage();

interface ICourse {
    chapterId: string;
    lessonId: string;
    lessonName: string;
    chapterName: string;
}

const props = defineProps({
    course: {
        type: Object as PropType<ICourse>,
        required: true
    },
    isMouseDrag: {
        type: Boolean,
        default: true
    }
});

const emits = defineEmits(["toArrangeClass", "updateSchedules", "closeCalendar"]);
const deleteVisible = ref(false);
const deleteTargetId = ref("");
const currentTouchEvent = ref<TouchEvent>();

watch(() => props.course, async (val: ICourse) => {
    setValueAddLessonBag(props.course);
    await getMyLessonBagNew({id: val.lessonId});
    if (!val.lessonId) return;
    if (!lessonPackageList.value.length) {
        addLessonBag.value.name = "备课包1";
        const res = await addLessonPackage(addLessonBag.value);
        if (res) {
            await getMyLessonBagNew({id: val.lessonId});
            // selectPackage(lessonPackageList.value[0])
        }
    } else {
        emitter.emit("updateResourceList", []);
        selectPackage(lessonPackageList.value[0]);
    }
}, {deep: true, immediate: true});

// 新增备课包
const addPackage = async () => {
    // if (lessonPackageList.value.length) {
    addLessonBag.value.name = "备课包" + (lessonPackageList.value.length + 1);
    lessonPackageList.value.forEach(item => {
        if (item.Name === addLessonBag.value.name) {
            addLessonBag.value.name = "备课包" + (Number(item.Name?.slice(3)) + 1);
        }
    });
    const res = await addLessonPackage(addLessonBag.value);
    if (res?.Id) {
        await getMyLessonBagNew({id: props.course.lessonId});
        // emitter.emit("updatePackageCount", null);
        return res.Id;
    }
    // }
};
// 选择备课包
const selectPackage = (data?: any) => {
    currentSelectPackageId.value = data ? data.Id : "";
    emitter.emit("updateResourceList", [currentSelectPackageId.value]);
    emits("closeCalendar");
};
// 去排课
const toArrangeClass = (data: any, type: number, ev?: TouchEvent) => {
    currentTouchEvent.value = ev;
    emits("toArrangeClass", data, type, ev);
};
// 1 从资源里列表过来备课包排课，非直接点击排课，要先新增一个课包;
// 0 直接在我的备课包里点击排课，不用再新增备课包；
const toLessonBagArrange = (data: any, type?: number, ev?: TouchEvent) => {
    currentTouchEvent.value = currentTouchEvent.value || ev;
    nextTick(() => {
        setTimeout(async () => {
            if (type) {
                const bagId = await addPackage();
                if (bagId) {
                    const params = {
                        resourceId: data.ResourceId,
                        lessonBagId: bagId
                    };
                    const res = await addResourceLessonBag(params);
                    if (res) {
                        currentSelectPackageId.value = bagId;
                        // openMouseDrag();
                        emitter.emit("updatePackageCount", null);
                        // const item = lessonPackageList.value.find(item => item.Id === bagId)
                        // console.log('itemitem', item)
                        emits("toArrangeClass", data, 0, ev);
                        // emitter.emit("updateResourceList", [currentSelectPackageId.value]);
                    }
                }
            } else {
                const bagId = data.Id || currentSelectPackageId.value;
                currentSelectPackageId.value = bagId;
                const item = lessonPackageList.value.find(item => item.Id === bagId);
                openMouseDrag(item);
            }
        }, 200);
    });
};
// 备课包虚拟元素开始触发移动
const openMouseDrag = (data?: any) => {
    nextTick(() => {
        // if (isMobile.value) return;
        const dom: HTMLElement = document.querySelector(".lesson-package-item.isActive > .package-item > .item-footer > .item-button") as HTMLElement;
        if (dom) {
            if (!isMobile.value) {
                const event: MouseEvent = new MouseEvent("mousedown");
                event.preventDefault();
                dom.dispatchEvent(event);
            } else {
                currentTouchEvent.value && touchStartDrag(currentTouchEvent.value, props.course, data);
            }
        }
    });
};
// 打开删除弹框
const deletenPackage = (id: any) => {
    deleteTargetId.value = id;
    deleteVisible.value = true;
};
// 确认删除回调
const onDeletePackage = async () => {
    const res = await deleteLessonPackage(deleteTargetId.value);
    if (res) {
        await getMyLessonBagNew({id: props.course.lessonId});
        selectPackage(lessonPackageList.value[0]);
        emitter.emit("updatePackageCount", null);
        emits("updateSchedules");
    }
};
const isMobile = ref(false);
const getMobile = () => {
    isMobile.value = !!navigator.maxTouchPoints;
};
onMounted(() => {
    getMobile();
});
defineExpose({
    selectPackage,
    toLessonBagArrange,
    getMyLessonBagNew
});

</script>

<style lang="scss" scoped>
.p-layout-package {
    background-color: #fff;
    width: 248px;

    // padding: 24px;
    .lesson-package-item {
        width: 100%;
        height: 174px;
        display: flex;
        align-items: center;
        justify-content: center;

        .package-item {
            width: 200px;
            // background-color: #fff;
            background: url("~@/assets/images/preparation/bg_kebao.png") no-repeat;
            background-size: cover;
            height: 142px;
            cursor: pointer;
            padding: 12px;
            display: flex;
            flex-direction: column;
            // justify-content: space-between;

            .item-name {
                display: flex;
                justify-content: space-between;
                margin-top: 16px;
                align-items: flex-end;

                .names {
                    width: 80%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    font-size: 14px;
                    font-weight: 600;
                    color: rgba($color: #fff, $alpha: 0.5);
                }

                img {
                    cursor: pointer;
                    width: 24px;
                    height: 24px;
                    // flex: 1;
                }

            }

            .items {
                width: 100%;
                font-size: 20px;
                font-weight: 600;
                color: #FFFFFF;
                margin: 14px 0 16px 0;
            }

            .item-footer {
                width: 100%;
                text-align: right;

                .item-button {
                    width: 72px;
                    height: 28px;
                    background: #FFEDBF;
                    border-radius: 16px;
                    font-size: 14px;
                    font-weight: 600;
                    color: #D36719;
                    text-align: center;
                    display: inline-block;
                    line-height: 28px;

                    &.isPaike {
                        background: rgba(255, 255, 255, 0.3);
                        color: #FFFFFF;
                    }
                }
            }
        }

        &.isActive {
            background: rgba(75, 113, 238, 0.2);
        }
    }

    .package-item-add {
        width: 200px;
        height: 40px;
        background: #FFFFFF;
        border-radius: 4px;
        border: 1px solid #E0E2E7;
        cursor: pointer;
        padding: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC, serif;
        font-weight: 400;
        color: #4B71EE;
        margin: auto;
        margin-top: 20px;
        margin-bottom: 20px;

        span {
            padding-left: 8px;
        }
    }
}
</style>
