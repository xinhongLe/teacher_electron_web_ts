<template>
    <div class="resource-content">
        <div class="resource-list">
            <ResourceItem
                v-for="(item, index) in resourceList"
                :key="index"
                :data="item"
                :btns="false"
                @eventEmit="eventEmit"
            />
        </div>
        <div class="resource-filter">
            <el-radio-group
                class="custom-radio-two"
                v-model="type"
                size="small"
            >
                <el-radio-button
                    v-for="item in typeList"
                    :key="item.value"
                    :label="item.value"
                >
                    {{ item.label }}
                </el-radio-button>
            </el-radio-group>
            
            <el-button class="switch-btn" size="small" type="default" @click="switchClass()">
                <img src="@/assets/images/preparation/icon_qiehuan.png" alt="">
                {{isSwitch ? "全部显示" : "仅显示备课篮"}}
            </el-button>
        </div>
    </div>
</template>

<script lang="ts">
import { IpcRendererEvent } from "electron";
import isElectron from "is-electron";
import { defineComponent, onActivated, onMounted, ref, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import ResourceItem from "../preparation/layout/resourceItem.vue";

export default defineComponent({
    components: { ResourceItem },
    setup() {
        const resourceList = ref([
            {
                type: 0,
                source: 0,
                name: "数一数",
                difficulty: 0,
                updateTime: "2021-10-20 11:5",
                size: 182912,
                view: 23
            },
            {
                type: 1,
                source: 1,
                name: "数一数",
                difficulty: 0,
                updateTime: "2021-10-20 11:5",
                size: 453322,
                view: 23
            },
            {
                type: 2,
                source: 2,
                name: "数一数",
                difficulty: 1,
                updateTime: "2021-10-20 11:5",
                size: 342245,
                view: 23
            },
            {
                type: 3,
                source: 3,
                name: "补图形",
                difficulty: 2,
                updateTime: "2021-10-20 11:5",
                size: 2343343,
                view: 23
            },
            {
                type: 3,
                source: 3,
                name: "补图形",
                difficulty: 2,
                updateTime: "2021-10-20 11:5",
                size: 2343343,
                view: 23
            },
            {
                type: 3,
                source: 3,
                name: "补图形",
                difficulty: 2,
                updateTime: "2021-10-20 11:5",
                size: 2343343,
                view: 23
            },
            {
                type: 3,
                source: 3,
                name: "补图形",
                difficulty: 2,
                updateTime: "2021-10-20 11:5",
                size: 2343343,
                view: 23
            },
            {
                type: 3,
                source: 3,
                name: "补图形",
                difficulty: 2,
                updateTime: "2021-10-20 11:5",
                size: 2343343,
                view: 23
            }
        ]);
        const router = useRouter();

        const eventEmit = (event: string, data: any, e?: MouseEvent | TouchEvent) => {
            console.log(event, data);
            switch(event) {
                case "delete":
                    break;
                case "version":
                     break;
                case "detail":
                    router.push("/resource/" + data.type + "/" + data.id);
                    break;
            }
        };

        const type = ref("");
        const typeList = ref([
            {
                value: "",
                label: "全部"
            },
            {
                value: 2,
                label: "教案"
            },
            {
                value: 3,
                label: "导学案"
            },
            {
                value: 4,
                label: "课件"
            },
            {
                value: 5,
                label: "微课视频"
            },
            {
                value: 6,
                label: "试卷"
            },
            {
                value: 7,
                label: "电子课本"
            },
            {
                value: 8,
                label: "教具"
            },
            {
                value: 9,
                label: "工具"
            },
            {
                value: 10,
                label: "素材"
            },
            {
                value: 11,
                label: "其他"
            }
        ]);
        const onTypeChange = () => {
            //
        };

        const isSwitch = ref(false);
        const sendResourceData = () => {
            if (isElectron()) {
                window.electron.ipcRenderer.send("attendClass", "unfoldSuspension", {
                    type: "sysData",
                    resources: JSON.stringify(resourceList.value)
                });
            }
        };

        onActivated(() => {
            sendResourceData();
        });

        const onWatchAttendClass = (e: IpcRendererEvent, event: any) => {
            switch(event.type) {
                case "sysData":
                    window.electron.ipcRenderer.send("attendClass", "unfoldSuspension", { type: "switchClass", switch: isSwitch.value });
                    sendResourceData();
                    break;
                case "openResource":
                    const resource = JSON.parse(event.resource);
                    router.push("/resource/" + resource.type + "/" + resource.id);
                    break;
                case "switchClass":
                    switchClass();
                    break;
            }
        }

        onMounted(() => {
            if (isElectron()) {
                console.log("================xxxxxxxxxxxxxxxxxxx===========================");
                window.electron.ipcRenderer.on("attendClass", onWatchAttendClass);
            }
        });

        onUnmounted(() => {
            if (isElectron()) {
                console.log("===========================================");
                window.electron.ipcRenderer.off("attendClass", onWatchAttendClass);
            }
        });

        const switchClass = () => {
            isSwitch.value = !isSwitch.value;
            window.electron.ipcRenderer.send("attendClass", "unfoldSuspension", { type: "switchClass", switch: isSwitch.value });
            sendResourceData();
        };

        return {
            resourceList,
            eventEmit,
            type,
            typeList,
            onTypeChange,
            isSwitch,
            switchClass
        }
    }
});
</script>

<style lang="scss" scoped>
.resource-content {
    flex: 1;
    min-height: 0;
    padding: 15px;
    height: 100%;
    background-color: #F5F6FA;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.resource-list {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
}

.resource-filter {
    padding: 15px;
    background-color: #fff;
    margin: 0 -15px -15px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.custom-radio-two {
    :deep(.el-radio-button__inner) {
        margin-right: 10px;
        border-radius: 4px;
        border: 0;
        background: #F0F4FF;
        min-width: 80px;
        color: #4B71EE;
    }
    :deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
        color: #fff;
        box-shadow: none;
        background: #4B71EE;
    }
    :deep(.el-radio-button--small .el-radio-button__inner) {
        font-size: 14px;
    }
}

.switch-btn {
    :deep(span) {
        display: flex;
        align-items: center;
    }
    img {
        display: block;
        margin-right: 3px;
    }
}
</style>
