<template>
    <div
        class="grade"
        :key="grade.ID"
        :class="isSelect ? 'active' : ''"
        @click="updateClassId(grade)"
    >
        <p class="name">{{ grade.GradeAlbum + grade.Name }}</p>
        <p class="count">学生： {{ grade.StudentCount }}</p>
        <div class="info" @click.stop="openDialag">
            <i class="el-icon-warning-outline" />
            班级信息
        </div>
        <img v-if="isSelect" src="@/assets/my-student/arrow_blue@2x.png" class="arrow">
    </div>
</template>

<script lang="ts">
import { MutationTypes, store } from "@/store";
import { Class, Grade } from "@/types/myStudent";
import { computed, defineComponent, PropType } from "vue";
export default defineComponent({
    props: {
        grade: {
            type: Object as PropType<Class>,
            required: true
        }
    },
    setup(props) {
        const openDialag = () => {
            store.commit(MutationTypes.SHOW_CLASS_DIALOG, { info: props.grade, isEdit: true });
        };

        return {
            isSelect: computed(() => store.state.myStudent.selectClassInfo.ID === props.grade.ID),
            openDialag,
            updateClassId: (grade: Class) => store.commit(MutationTypes.UPDATE_SELECT_CLASS_INFO, grade)
        };
    }
});
</script>

<style lang="scss" scoped>
.grade {
    flex-shrink: 0;
    width: 280px;
    height: 140px;
    background: #FFFFFF;
    border-radius: 4px;
    padding: 20px;
    box-sizing: border-box;
    border: 1px solid #E0E2E7;
    margin-bottom: 16px;
    cursor: pointer;
    .name {
        font-size: 18px;
        font-weight: 600;
        color: #19203D;
        line-height: 24px;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
    }
    .count {
            margin-top: 12px;
        font-size: 14px;
        color: #5F626F;
        line-height: 18px;
        display: flex;
        justify-content: space-between;
    }
    .info {
        font-size: 14px;
        font-weight: 500;
        color: #4B71EE;
        line-height: 20px;
        margin-top: 25px;
        display: flex;
        justify-content: center;
        align-items: center;
        i {
            margin-right: 4px;
        }
    }
    &.active {
        background: #4B71EE;
        position: relative;
        .name, .info {
            color: #fff;
        }
        .count {
            color: rgba(255, 255, 255, .6)
        }
        .arrow {
            position: absolute;
            top: 0;
            bottom: 0;
            right: -8px;
            width: 8px;
            height: 20px;
            margin: auto;
        }
    }
}
</style>
