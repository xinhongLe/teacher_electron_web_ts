<script lang="ts" setup>
import { ClassroomType } from "@/types/preparation";
import { ref } from "vue";

const titleList = [{ title: "数智课堂", type: ClassroomType.WindowClasses }, { title: "翻转课堂", type: ClassroomType.Classes }];
const currentTab = ref(ClassroomType.WindowClasses);
</script>

<template>
    <div class="attend-class-warp">
        <div class="header">
            <div v-for="item in titleList" :key="item.title" class="tab" :class="{active: item.type === currentTab}" @click="currentTab = item.type">
                {{item.title}}
            </div>
        </div>
        <div class="content-warp">

        </div>
    </div>
</template>

<style lang="scss" scoped>
.attend-class-warp {
    width: 100%;
    height: 100%;
    background-color: #F5F6FA;
    display: flex;
    flex-direction: column;
    .header {
        height: 60px;
        background-color: #fff;
        padding-left: 20px;
        display: flex;
        align-items: center;
        margin-bottom: 12px;
        .tab {
            display: flex;
            align-items: center;
            height: 100%;
            font-size: 24px;
            font-weight: 600;
            color: #A7AAB4;
            margin-right: 32px;
            cursor: pointer;
            &.active {
                color: var(--app-color-dark);
                position: relative;
                &::before {
                    content: "";
                    position: absolute;
                    width: 100%;
                    height: 3px;
                    background-color: var(--app-color-primary);
                    bottom: 0;
                }
            }
        }
    }
    .content-warp {
        flex: 1;
        background-color: #fff;
        padding: 20px;
    }
}
</style>
