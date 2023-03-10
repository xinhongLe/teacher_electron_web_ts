<template >
    <div class="p-layout-package">
        <div class="lesson-package">
            <div class="package-item" :class="{ isActive: item.ID == currentSelectPackageId }"
                v-for="(item, index) in lessonPackageList"
                
                @click.stop.prevent="currentSelectPackageId = item.ID">
                <div class="item-name">
                    <div class="names">
                        {{ item.Title }}
                    </div>
                    <img @click.stop.prevent="emits('deleteLessonPackage', item.ID)"
                        src="@/assets/images/preparation/icon_delete_beike.png" alt="">
                </div>
                <div class="items">
                    {{ item.Name }}
                </div>
                <div class="item-footer">
                    <div class="item-button" :class="{ isPaike: item.Status }" @mousedown.stop.prevent="isMouseDrag ? startDrag($event, item) : null" @click.stop.prevent="emits('toMyLessonPackage',item,0)">
                        {{ item.Status ? '已排课' : '排课' }}
                    </div>
                </div>
            </div>
            <div class="package-item-add" @click.stop.prevent="addLessonPackage">
                <img src="@/assets/images/preparation/icon_add_black.png" alt="">
                <span>新增课包</span>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import useLessonPackage, { IPackage } from "@/hooks/useLessonPackage";
import useClickDrag, { } from "@/hooks/useClickDrag";
import {
    ref,
    defineProps,
    defineEmits,
    PropType,
    onMounted,
    defineExpose,
    nextTick
} from "vue";
const currentSelectPackageId = ref("");
const { startDrag } = useClickDrag();
const props = defineProps({
    isMouseDrag: {
        type: Boolean,
        default: true,
    },
    lessonPackageList: {
        type: Object as PropType<IPackage[]>,
        default: () => [],
    }
});
const emits = defineEmits(["addLessonPackage", "deleteLessonPackage", "toMyLessonPackage"]);

const addLessonPackage = () => {
    emits("addLessonPackage");
};

const selectPackage = (data: any) => {
    currentSelectPackageId.value = data!.ID;
    nextTick(() => {
        const dom: HTMLElement = document.querySelector('.package-item.isActive > .item-footer > .item-button') as HTMLElement;
        if (props.isMouseDrag && dom) {
            const event: MouseEvent = new MouseEvent('mousedown');
            event.preventDefault();
            dom.dispatchEvent(event);
        }
    })
};
defineExpose({
    selectPackage
});

</script>

<style lang="scss" scoped >
.p-layout-package {
    background-color: #fff;
    width: 248px;
    padding: 24px;

    .package-item {
        width: 200px;
        // background-color: #fff;
        background: url("~@/assets/images/preparation/bg_kebao.png") no-repeat;
        background-size: cover;
        height: 142px;
        cursor: pointer;
        margin-bottom: 20px;
        padding: 12px;
        display: flex;
        flex-direction: column;
        // justify-content: space-between;

        &.isActive {
            border: 1px solid #409eff;
        }

        .item-name {
            display: flex;
            justify-content: space-between;
            margin-top: 24px;
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
            margin: 8px 0 14px 0;
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
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #4B71EE;

        span {
            padding-left: 8px;
        }

        // img {
        //     width: 30px;
        //     height: 30px;
        // }
    }
}</style>