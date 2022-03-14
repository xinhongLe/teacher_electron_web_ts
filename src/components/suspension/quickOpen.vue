<script lang="ts" setup>
import { CourseWares } from "@/api";
import { SchoolWindowInfo } from "@/types/preparation";
import isElectron from "is-electron";
import { onMounted, ref } from "vue";

const windowList = ref<SchoolWindowInfo[]>([]);

const courseWares = ref<CourseWares[]>([]);

const openWindow = (win: SchoolWindowInfo) => {
    window.electron.ipcRenderer.invoke(
        "openWindow",
        JSON.parse(JSON.stringify(win))
    );
    window.electron.ipcRenderer.invoke("hideUnfoldSuspensionWin");
};

const lookQuestions = (item: CourseWares) => {
    window.electron.ipcRenderer.invoke("lookQuestions", {
        id: item.ID,
        type: 3
    });
    window.electron.ipcRenderer.invoke("hideUnfoldSuspensionWin");
};

const lookVideo = (id: string) => {
    window.electron.ipcRenderer.invoke("lookVideo", id);
    window.electron.ipcRenderer.invoke("hideUnfoldSuspensionWin");
};

onMounted(() => {
    if (isElectron()) {
        window.electron.ipcRenderer.on("getWindowList", (_, data) => {
            windowList.value = data;
        });

        window.electron.ipcRenderer.on("getCourseWares", (_, data) => {
            courseWares.value = data;
        });
    }
});
</script>

<template>
    <div
        class="quick-open-warp"
        v-if="windowList.length !== 0 || courseWares.length !== 0"
    >
        <span class="title">快速调用</span>
        <div class="list">
            <div
                class="item"
                v-for="item in windowList"
                :key="item.WindowID"
                @click="openWindow(item)"
            >
                <img
                    src="@/assets/images/suspension/icon_chuangkaye_big.svg"
                    class="icon"
                />
                <span class="name">{{ item.WindowName }}</span>
            </div>
            <template v-for="item in courseWares" :key="item.ID">
                <div
                    class="item"
                    v-if="item.HasVideo"
                    @click="lookVideo(item.FileID || '')"
                >
                    <img
                        src="@/assets/images/suspension/icon_viedo_big.svg"
                        class="icon"
                    />
                    <span class="name">{{ item.Name }}</span>
                </div>
                <div class="item" @click="lookQuestions(item)">
                    <img
                        src="@/assets/images/suspension/icon_timu_big.svg"
                        class="icon"
                    />
                    <span class="name">{{ item.Name }}</span>
                </div>
            </template>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.quick-open-warp {
    margin-top: 14px;
    .title {
        font-size: 20px;
        font-weight: 600;
        color: #ffffff;
    }
    .list {
        margin-top: 14px;
        display: flex;
        overflow: auto;
        padding-bottom: 4px;
        .item {
            flex-shrink: 0;
            width: 120px;
            height: 80px;
            padding: 12px;
            background: rgba(255, 255, 255, 0.12);
            border-radius: 4px;
            margin-right: 12px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            cursor: pointer;
            border: 2px solid transparent;
            .icon {
                width: 28px;
                height: 28px;
            }
            .name {
                font-size: 14px;
                font-weight: 400;
                color: #ffffff;
                @include text-ellipsis;
            }
            &:hover {
                border: 2px solid var(--app-color-primary);
            }
        }
        &::-webkit-scrollbar {
            height: 12px;
        }
        /* 滚动条背景 */
        &::-webkit-scrollbar-track {
            background: #081134;
            border-radius: 2px;
        }
        /* 滚动条滑块 */
        &::-webkit-scrollbar-thumb {
            border: 4px solid #081134;
            background-clip: padding-box;
            border-radius: 9999px;
            background: rgba(255, 255, 255, 0.3);
        }
    }
}
</style>
