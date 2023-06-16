<template>
    <div class="c-header">
        <div class="tab-item">
            {{ resourceName }}
        </div>
        <div class="header-right">
            <div class="header-window-control">
                <div class="hwc-minimize" @click="useMinimizeWindow()"></div>
                <div class="hwc-maximize" @click="useMaximizeWindow()"></div>
                <div class="hwc-close" @click="close">
                    <el-icon>
                        <CloseBold/>
                    </el-icon>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import useMaximizeWindow from "@/hooks/useMaximizeWindow";
import useMinimizeWindow from "@/hooks/useMinimizeWindow";
import {CloseBold} from "@element-plus/icons-vue";

export default defineComponent({
    name: "NavBar",
    props: {
        resourceName: {
            type: String
        }
    },
    setup() {
        const close = () => {
            window.electron.remote.getCurrentWindow().close();
        };
        return {
            close,
            useMinimizeWindow,
            useMaximizeWindow
        };
    },
    components: {CloseBold}
});
</script>

<style lang="scss" scoped>
.c-header {
    height: 48px;
    background-color: #19203D;
    padding: 0 24px;
    display: flex;
    justify-content: space-between;
    -webkit-app-region: drag;
    overflow: hidden;

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

.tab-item {
    display: flex;
    margin-right: 10px;
    color: #fff;
    font-size: 16px;
    font-weight: 600;
    align-items: center;
    justify-content: space-between;
    align-items: center;
    height: 48px;
    min-width: 140px;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
    user-select: none;
}

.tab-item i {
    font-size: 18px;
}

.tab-item.active {
    background-color: #ffffff;
    color: #202124;
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
