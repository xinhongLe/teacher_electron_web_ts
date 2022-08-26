<template>
    <div class="wrongbook-wrapper">
        <header class="wrongbook-header">
            <div class="header-left">
                <div
                    @click="switchClass(item.id)"
                    class="class-item"
                    :class="item.id == state.currentClassId ? 'isActive' : ''"
                    v-for="item in state.classList"
                >
                    <span>{{ item.name }}</span>
                </div>
            </div>
        </header>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from "vue";
const state = reactive({
    classList: [
        {
            name: "一年级1班",
            id: 1,
        },
        {
            name: "一年级2班",
            id: 2,
        },
        {
            name: "一年级3班",
            id: 3,
        },
    ], //顶部年级列表
    currentClassId: 1, //当前选中的班级
});
//切换顶部选中的班级
const switchClass = (value: number) => {
    state.currentClassId = value;
};
</script>

<style lang="scss" scoped>
.wrongbook-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    min-width: 0;
    min-height: 0;
    background: #f5f6fa;
    .wrongbook-header {
        width: 100%;
        height: 56px;
        background: #ffffff;
        padding: 18px 16px;
        display: flex;
        .header-left {
            height: 100%;
            display: flex;
            align-items: center;
            width: 40%;
            font-size: 14px;
            color: #a7aab4;
            font-family: HarmonyOS_Sans_SC;
            .class-item {
                margin-right: 32px;
                cursor: pointer;
            }
            .isActive {
                font-size: 16px;
                color: #19203d;
                font-weight: bold;
            }
            .isActive::after {
                content: "";
                display: block;
                position: relative;
                width: 74px;
                height: 3px;
                background: #4b71ee;
                bottom: -20px;
                /* left: -74px; */
                right: 0;
            }
        }
    }
}
</style>
