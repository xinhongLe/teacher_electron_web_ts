<template>
    <div class="grade-list">
        <div class="empty" v-if="classList.length === 0">
            <img src="@/assets/my-student/pic_wubanji@2x.png" />
            <p>您还没有班级</p>
            <p>您可以点击下方【创建班级】</p>
        </div>
        <div class="list" v-else>
            <Grade v-for="item in classList" :grade="item" :key="item.ID" />
        </div>

        <!-- <div class="add-btn" @click="showDialog">
            <img src="@/assets/my-student/icon_add_rest@2x.png" />
            <span>创建班级</span>
        </div> -->
        <AddOrEditClass v-if="isShowClassDialog" />
    </div>
</template>

<script lang="ts">
import { store, MutationTypes, ActionTypes } from "@/store";
import { computed, defineComponent } from "vue";
import Grade from "./Grade.vue";
import AddOrEditClass from "../addOrEditClass/index.vue";
import usePageEvent from "@/hooks/usePageEvent"; //埋点事件hooks

export default defineComponent({
    name: "GradeList",
    setup() {
        store.dispatch(ActionTypes.FETCH_CLASS_LIST, true);
        //班级管理页面点击埋点事件
        const clicKBuryPoint = (name: string) => {
            usePageEvent(1, "班级管理", name, name);
        };
        return {
            classList: computed(() => store.state.myStudent.classList),
            isShowClassDialog: computed(
                () => store.state.myStudent.isShowClassDialog
            ),
            showDialog: () =>
                store.commit(MutationTypes.SHOW_CLASS_DIALOG, {
                    isEdit: false,
                }),
            clicKBuryPoint,
        };
    },
    components: { Grade, AddOrEditClass },
});
</script>

<style lang="scss" scoped>
.grade-list {
    width: 328px;
    box-sizing: border-box;
    margin-top: 1px;
    background: #fff;
    display: flex;
    flex-direction: column;
    position: relative;
    justify-content: space-between;
    flex-shrink: 0;
    .add-btn {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 52px;
        border-top: 1px solid #f5f6fa;
        cursor: pointer;
        img {
            width: 20px;
            height: 20px;
            margin-right: 8px;
        }
        span {
            font-size: 16px;
            font-weight: 600;
            color: #4b71ee;
            line-height: 22px;
        }
    }
    .empty {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        img {
            width: 136px;
            height: 85px;
        }
        p:nth-of-type(1) {
            margin-top: 24px;
            font-size: 18px;
            font-weight: 600;
            color: #19203d;
            line-height: 25px;
            text-align: center;
        }
        p:nth-of-type(2) {
            margin-top: 6px;
            font-size: 16px;
            color: #5f626f;
            line-height: 22px;
            text-align: center;
        }
    }
    .list {
        display: flex;
        flex-direction: column;
        align-items: center;
        flex: 1;
        overflow-y: overlay;
    }
}
</style>
