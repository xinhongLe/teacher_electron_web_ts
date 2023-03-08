<template >
    <div class="p-layout-package">
        <div class="lesson-package">
            <div class="package-item" :class="{ isActive: item.ID == currentSelectPackageId }"
                v-for="(item, index) in lessonPackageList"
                @mousedown.stop.prevent="isMouseDrag ? startDrag($event, item) : null"
                @click.stop.prevent="currentSelectPackageId = item.ID">
                <div class="item-name">
                    {{ item.Title }}
                </div>
                <div class="items">
                    {{ item.Name }}
                </div>
                <div class="item-footer">
                    <div class="delete-icon">
                        <img src="@/assets/images/preparation/delete.png" alt="">
                    </div>
                    <div class="paike-status">
                        {{ item.Status ? '已排课' : '排课' }}
                    </div>
                </div>
            </div>
            <div class="package-item-add">
                <img src="@/assets/images/preparation/plus.png" alt="">
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import useLessonPackage, { IPackage } from "@/hooks/useLessonPackage";
import useClickDrag,{} from "@/hooks/useClickDrag";
import {
    ref,
    defineProps,
    defineEmits,
    PropType,
    onMounted
} from "vue";
const { currentSelectPackageId } = useLessonPackage();
const { startDrag } = useClickDrag();
const props = defineProps({
    isMouseDrag: {
        type: Boolean,
        default: true,
    },
    lessonPackageList:{
        type: Object as PropType<IPackage[]>,
        default: ()=>[] ,
    }
});

</script>

<style lang="scss" scoped >
.p-layout-package {
    padding: 0 5px 0 20px;

    // background-color: #fff;
    .package-item {
        width: 232px;
        background-color: #fff;
        height: 180px;
        cursor: pointer;
        margin-bottom: 20px;
        padding: 10px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        &.isActive {
            border: 1px solid #409eff;
        }

        .item-name {
            font-size: 14px;
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .items {
            width: 100%;
            text-align: center;
            font-size: 30px;
        }

        .item-footer {
            display: flex;
            justify-content: space-between;

            .delete-icon {
                width: 50%;
                text-align: right;

                img {
                    width: 20px;
                }
            }

            .paike-status {
                width: 40%;
                text-align: center;
                font-size: 14px;
                padding-top: 4px;
                background: #67c23a;
                color: #fff;
            }
        }
    }

    .package-item-add {
        height: 100px;
        width: 100%;
        cursor: pointer;
        background-color: #fff;
        padding: 10px;
        display: flex;
        justify-content: center;
        align-items: center;

        img {
            width: 30px;
            height: 30px;
        }
    }
}
</style>