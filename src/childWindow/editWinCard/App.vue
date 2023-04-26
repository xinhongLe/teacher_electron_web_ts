<template>
    <div class="main-container">
        <div class="main-body">
            <div class="c-header">
                <div class="tab-list">{{ currentTitle }}</div>
                <div class="header-right">
                    <div class="header-window-control">
                        <div class="hwc-minimize" @click="minimizeWindow"></div>
                        <div class="hwc-maximize" @click="maximizeWindow"></div>
                        <div class="hwc-close" v-if="isElectron()" @click="close">
                            <el-icon>
                                <CloseBold/>
                            </el-icon>
                        </div>
                    </div>
                </div>
            </div>
            <div style="height: calc(100% - 48px)">
                <edit-win-card ref="editWinCardRef"/>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, nextTick } from "vue";
import isElectron from "is-electron";
import { CloseBold } from "@element-plus/icons-vue";
import EditWinCard from "../../views/preparation/intelligenceClassroom/edit/index.vue";

const editWinCardRef = ref();
// 获取url中"?"符后的字串
const name: string = window.location.search;
const currentTitle = ref(decodeURIComponent(name.substring(1)));
document.title = currentTitle.value;

const close = () => {
    nextTick(async () => {
        const res = await editWinCardRef.value.closeCurrentWinCard();
        if (res) {
            window.electron.destroyWindow();
        }
    });
};
const minimizeWindow = () => {
    window.electron.minimizeWindow();
};
const maximizeWindow = () => {
    window.electron.maximizeWindow();
};
</script>

<style lang="scss" scoped>
.main-container {
    height: 100vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    -webkit-app-region: no-drag;

    .main-body {
        display: flex;
        flex: 1;
        overflow-y: hidden;
        -webkit-app-region: no-drag;
        flex-direction: column;

        .c-header {
            height: 48px;
            background-color: var(--app-color-dark);
            padding: 0 24px;
            display: flex;
            justify-content: space-between;
            -webkit-app-region: drag;
            overflow: hidden;
            align-items: center;

            .tab-list {
                -webkit-app-region: no-drag;
                font-size: 20px;
                color: #ccc;
            }

            .header-right {
                display: flex;
                flex-shrink: 0;

                .help-warp {
                    display: flex;
                    align-items: center;
                    font-size: 14px;
                    color: #ffffff;
                    margin-right: 40px;
                    cursor: pointer;
                    -webkit-app-region: no-drag;

                    .help-icon {
                        margin-right: 6px;
                    }
                }

                .line {
                    align-self: center;
                    width: 1px;
                    background-color: rgba(216, 216, 216, 0.2);
                    height: 24px;
                    margin: 0 32px;
                }
            }
        }
    }
}

.header-window-control {
    display: flex;
    align-items: center;
    -webkit-app-region: no-drag;
}

.hwc-minimize,
.hwc-maximize,
.hwc-close {
    height: 24px;
    margin-right: 20px;
    display: flex;
    align-items: center;
    cursor: pointer;
}

.hwc-close {
    margin-right: 0;
}

.hwc-minimize:before {
    content: "";
    display: block;
    width: 14px;
    border-radius: 3px;
    border: 1px solid #8c8f9f;
}

.hwc-maximize:before {
    content: "";
    display: block;
    width: 10px;
    height: 10px;
    border-radius: 3px;
    border: 2px solid #8c8f9f;
}

.hwc-close i {
    font-size: 20px;
    color: #8c8f9f;
    font-weight: 600;
}

.avatar-wrapper span {
    font-size: 18px;
    text-align: center;
}
</style>
