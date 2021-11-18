<template>
    <div
        class="kb-class"
    >
        <div
            v-for="(j, i) in item.CourseBags"
            :key="i"
            :class="[
                j.ID ? '' : 'noClassBag',
                leftActiveIndex === index && bagIndex === i
                    ? 'active'
                    : ''
            ]"
            :draggable="!isShowCourseBtn"
            :data-id="'course-' + index + '-' + i"
            @dragstart="onDragstart($event, j)"
            @dragend="onDragEnd($event)"
            @drag="ondrag($event)"
            @click="handleClickClassBag(j, i, index)"
        >
            <span>{{ `课时${index + 1}` }}</span>
            <p>{{ j.Name }}</p>
            <div
                v-show="j.ID"
                class="el-icon-edit-outline"
                title="编辑课包"
            ></div>
        </div>
        <p @click="dialogVisible = true">
            <span class="el-icon-plus"></span>
            <span>自定义课包</span>
        </p>
        <ClassBagDialog
            v-model:dialogVisible="dialogVisible"
            v-if="dialogVisible"
            :lessonOrBagValue="item"
        />
    </div>
</template>

<script lang="ts">
import { store } from "@/store";
import { Course, CourseBag } from "@/types/preparation";
import { computed, defineComponent, PropType, ref } from "vue";
import ClassBagDialog from "./ClassBagDialog.vue";
import useDrag from "@/hooks/useDrag";
export default defineComponent({
    props: {
        item: {
            type: Object as PropType<Course>,
            default: () => ({})
        },
        index: {
            type: Number,
            required: true
        },
        leftActiveIndex: {
            type: Number,
            required: true
        },
        bagIndex: {
            type: Number,
            required: true
        }
    },
    setup(props, { emit }) {
        const dialogVisible = ref(false);
        const { onDragstart, ondrag, onDragEnd } = useDrag();

        const handleClickClassBag = (value: CourseBag, i: number, index: number) => {
            if (value.Name === "无课包") { return; }
            emit("update:leftActiveIndex", index);
            emit("update:bagIndex", i);
        };

        return {
            onDragstart,
            onDragEnd,
            ondrag,
            dialogVisible,
            isShowCourseBtn: computed(() => store.state.preparation.isShowCourseBtn),
            handleClickClassBag
        };
    },
    components: { ClassBagDialog }
});
</script>

<style lang="scss" scoped>
.kb-class {
    margin-bottom: 20px;
    margin-right: 10px;
    > div {
        position: relative;
        width: 100%;
        height: 76px;
        padding: 12px;
        box-sizing: border-box;
        background: url("~@/assets/images/preparation/bg_card@2x.png")
            no-repeat center center;
        background-size: 100% 100%;
        margin-bottom: 20px;
        cursor: pointer;
        &.noClassBag {
            background: url("~@/assets/images/preparation/bg_none@2x.png")
                no-repeat center center;
            background-size: 100% 100%;
        }
        &.active {
            background: url("~@/assets/images/preparation/bg_card_selected@2x.png")
                no-repeat center center;
            background-size: 100% 100%;
        }
        span {
            font-size: 12px;
            color: #5f626f;
        }
        p {
            font-size: 12px;
            font-weight: 600;
            color: #19203d;
            margin-top: 10px;
        }
        div {
            position: absolute;
            width: 20px;
            height: 20px;
            background: rgba(0,0,0, 0.14);
            display: flex;
            align-items: center;
            justify-content: center;
            right: 8px;
            bottom: 4px;
            font-size: 12px;
            cursor: pointer;
            color: #fff;
        }
    }
    > p {
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        user-select: none;
        text-align: center;
        font-size: 12px;
        padding: 6px;
        margin-top: 10px;
        border-radius: 2px;
        border: 1px solid #e0e2e7;
        span {
            &:first-child {
                color: #4b71ee;
                padding-right: 4px;
            }
        }
    }
}
</style>
