<template>
    <div
        class="grade"
        :key="grade.ID"
        :class="isSelect ? 'active' : ''"
        @click="updateClassId(grade)"
    >
        <p class="name">{{ grade.GradeAlbum + grade.Name }}</p>
        <p class="count">学生： {{ grade.StudentCount }}</p>
        <div class="info flex-align-items" @click.stop="openDialog(), clicKBuryPoint('班级信息')">
            <el-icon>
                <Warning/>
            </el-icon>
            班级信息
        </div>
        <img
            v-if="isSelect"
            src="@/assets/my-student/arrow_blue@2x.png"
            class="arrow"
        />
    </div>
</template>

<script lang="ts">
import {MutationTypes, store} from "@/store";
import {Class} from "@/types/myStudent";
import {computed, defineComponent, PropType, watch} from "vue";
import usePageEvent from "@/hooks/usePageEvent"; //埋点事件hooks
import {EVENT_TYPE} from "@/config/event";
import {set, STORAGE_TYPES} from "@/utils/storage";

export default defineComponent({
    props: {
        grade: {
            type: Object as PropType<Class>,
            required: true,
        },
    },
    setup(props) {
        const {createBuryingPointFn} = usePageEvent("班级管理");
        const openDialog = () => {
            store.commit(MutationTypes.SHOW_CLASS_DIALOG, {
                info: props.grade,
                isEdit: true,
            });
        };

        const updateClassId = (grade: Class) => {
            store.commit(MutationTypes.UPDATE_SELECT_CLASS_INFO, grade);
            store.commit(MutationTypes.UPDATE_SEARCH_STUDENT, "");

            const classData: any = store.state.userInfo.classList?.find(item => item.ClassAixueshiId === grade.ID);
            store.state.userInfo.currentSelectClass = classData;
            set(STORAGE_TYPES.CURRENT_SELECT_CLASS, classData)
        };
        //班级管理页面点击埋点事件-班级信息
        const clicKBuryPoint = (name: string) => {
            createBuryingPointFn(EVENT_TYPE.PageClick, name, name);
        };
        // 监听全局班级改变
        watch(() => store.state.userInfo.currentSelectClass, (newVal) => {
            if (newVal.ClassAixueshiId === props.grade.ID) {
                updateClassId(props.grade)
            }
        }, {deep: true})
        return {
            isSelect: computed(
                () =>
                    store.state.myStudent.selectClassInfo.ID === props.grade.ID
            ),
            openDialog,
            updateClassId,
            clicKBuryPoint,
        };
    },
});
</script>

<style lang="scss" scoped>
.grade {
    flex-shrink: 0;
    width: 280px;
    height: 140px;
    background: #ffffff;
    border-radius: 4px;
    padding: 20px;
    box-sizing: border-box;
    border: 1px solid #e0e2e7;
    margin-bottom: 16px;
    cursor: pointer;

    .name {
        font-size: 18px;
        font-weight: 600;
        color: #19203d;
        line-height: 24px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .count {
        margin-top: 12px;
        font-size: 14px;
        color: #5f626f;
        line-height: 18px;
        display: flex;
        justify-content: space-between;
    }

    .info {
        font-size: 14px;
        font-weight: 500;
        color: #4b71ee;
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
        background: #4b71ee;
        position: relative;

        .name,
        .info {
            color: #fff;
        }

        .count {
            color: rgba(255, 255, 255, 0.6);
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
