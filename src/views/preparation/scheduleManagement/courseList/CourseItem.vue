<template>
    <div
        class="kb-class"
    >
        <div
            v-for="(j, i) in item.CourseBags"
            :key="j.ID"
            class="course-item"
            :class="[
                j.ID ? '' : 'noClassBag',

                selectCourseId ? selectCourseId === j.ID
                    ? 'active'
                    : '' : i === 0 && index === 0 ? 'active' : ''
            ]"
            :draggable="!isShowCourseBtn"
            :data-id="'course-' + index + '-' + i"
            @dragstart="onDragStart($event, j)"
            @dragend="onDragEnd($event)"
            @drag="onDrag($event)"
            @click="handleClickClassBag(j)"
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
        />
    </div>
</template>

<script lang="ts">
import { MutationTypes, store } from "@/store";
import { Course, CourseBag } from "@/types/preparation";
import { computed, defineComponent, PropType, ref } from "vue";
import ClassBagDialog from "../ClassBagDialog.vue";
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
        }
    },
    setup() {
        const dialogVisible = ref(false);
        const { onDragStart, onDrag, onDragEnd } = useDrag();

        const handleClickClassBag = (value: CourseBag) => {
            if (value.Name === "无课包") { return; }
            store.commit(MutationTypes.SET_SELECT_COURSE_BAG, value);
            store.commit(MutationTypes.SET_VIEW_COURSE_DETAIL_ING, true);
        };

        return {
            onDragStart,
            onDragEnd,
            onDrag,
            dialogVisible,
            isShowCourseBtn: computed(() => store.state.preparation.isViewCourseDetailIng),
            selectCourseId: computed(() => store.state.preparation.selectCourseBag.ID),
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
